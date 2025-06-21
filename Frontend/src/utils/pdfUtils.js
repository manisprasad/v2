import jsPDF from 'jspdf'
import 'jspdf-autotable'
import hindiFont from './hindiFont' // Base64-encoded Hindi font
import tamilFont from './Tamil' // Base64-encoded Tamil font
import malyalamFont from './malyalam' // Base64-encoded Malayalam font

/**
 * Generates a PDF with the assessment questions and answers
 * @param {Object} assessmentData - The assessment data with questions and answers
 * @param {string} title - The title for the PDF
 * @param {string} language - The language for the PDF content (e.g., 'hindi', 'tamil', 'malayalam', 'english')
 * @returns {Object} - Result object with success status and filename
 */
export const generateAssessmentPDF = (assessmentData, title = "Generated Assessment", language = 'english') => {
  console.log(assessmentData)
  try {
    const doc = new jsPDF()
    const normalizedLang = (language || 'english').toLowerCase()

    // Load fonts only if required
    if (normalizedLang === 'hindi') {
      doc.addFileToVFS('NotoSansHindi.ttf', hindiFont)
      doc.addFont('NotoSansHindi.ttf', 'NotoSansHindi', 'normal')
    }
    if (normalizedLang === 'tamil') {
      doc.addFileToVFS('Tamil.ttf', tamilFont)
      doc.addFont('Tamil.ttf', 'TamilFont', 'normal')
    }
    if (normalizedLang === 'malayalam') {
      doc.addFileToVFS('Malyalam.ttf', malyalamFont)
      doc.addFont('Malyalam.ttf', 'MalyalamFont', 'normal')
    }

    // Decide font to use
    let selectedFont = 'helvetica'
    if (normalizedLang === 'hindi') selectedFont = 'NotoSansHindi'
    else if (normalizedLang === 'tamil') selectedFont = 'TamilFont'
    else if (normalizedLang === 'malayalam') selectedFont = 'MalyalamFont'

    doc.setFont(selectedFont)

    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20

    doc.setFontSize(20)
    doc.setTextColor(0, 0, 128)
    doc.text(title, pageWidth / 2, 20, { align: 'center' })

    const currentDate = new Date().toLocaleDateString()
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated on: ${currentDate}`, pageWidth / 2, 30, { align: 'center' })

    doc.setTextColor(0, 0, 0)
    doc.setFontSize(12)
    doc.text("Assessment Questions", margin, 40)

    let questions
    try {
      questions = typeof assessmentData === 'string' ? JSON.parse(assessmentData) : assessmentData
      if (!Array.isArray(questions)) {
        if (questions.questions && Array.isArray(questions.questions)) {
          questions = questions.questions
        } else {
          throw new Error("Could not find questions array in assessment data")
        }
      }
    } catch (error) {
      console.error("Error parsing assessment data:", error)
      throw new Error("Failed to generate PDF: Invalid assessment data format")
    }

    let yPosition = 50
    const lineHeight = 10

    const addQuestionSection = (sectionTitle, questionList, startY) => {
      let y = startY
      doc.setFontSize(14)
      doc.setTextColor(0, 102, 204)
      doc.text(sectionTitle, margin, y)
      y += lineHeight * 1.5

      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)

      questionList.forEach((question, index) => {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage()
          doc.setFont(selectedFont)
          y = margin + 10
        }

        const questionText = question.type === "ASSERTION_REASONING"
          ? question.question
          : `${index + 1}. ${question.question}`

        const splitQuestion = doc.splitTextToSize(questionText, pageWidth - (margin * 2))
        doc.text(splitQuestion, margin, y)
        y += lineHeight * splitQuestion.length

        if (question.options) {
          y += lineHeight / 2

          question.options.forEach((option, optIndex) => {
            if (y > doc.internal.pageSize.getHeight() - margin) {
              doc.addPage()
              doc.setFont(selectedFont)
              y = margin + 10
            }

            const optionText = doc.splitTextToSize(
              `${String.fromCharCode(65 + optIndex)}. ${option}`,
              pageWidth - (margin * 2) - 10
            )
            doc.text(optionText, margin + 10, y)
            y += lineHeight * optionText.length
          })
        }

        y += lineHeight
      })

      return y
    }

    if (questions.filter(q => q.type === "MCQ").length > 0) {
      yPosition = addQuestionSection("Multiple Choice Questions", questions.filter(q => q.type === "MCQ"), yPosition)
      yPosition += lineHeight
    }

    if (questions.filter(q => q.type === "SHORT_ANSWER").length > 0) {
      yPosition = addQuestionSection("Short Answer Questions", questions.filter(q => q.type === "SHORT_ANSWER"), yPosition)
      yPosition += lineHeight
    }

    if (questions.filter(q => q.type === "LONG_ANSWER").length > 0) {
      yPosition = addQuestionSection("Long Answer Questions", questions.filter(q => q.type === "LONG_ANSWER"), yPosition)
      // eslint-disable-next-line
      yPosition += lineHeight
    }

    doc.addPage()
    doc.setFont(selectedFont)
    doc.setFontSize(16)
    doc.setTextColor(0, 0, 128)
    doc.text("Answer Key", pageWidth / 2, 20, { align: 'center' })

    const columns = ['#', 'Type', 'Correct Answer', 'Explanation', 'Reference']
    const data = questions.map((q, i) => [
      i + 1,
      q.type || 'General',
      q.correctAnswer || 'N/A',
      q.explanation || 'N/A',
      q.reference || 'N/A'
    ])

    doc.autoTable({
      startY: 30,
      head: [columns],
      body: data,
      headStyles: { fillColor: [0, 102, 204] },
      styles: {
        overflow: 'linebreak',
        font: selectedFont,
        fontStyle: 'normal',
        fontSize: 10
      },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 20 },
        2: { cellWidth: 50 },
        3: { cellWidth: 60 },
        4: { cellWidth: 40 }
      }
    })

    const fileName = `${title.replace(/\s+/g, '_')}.pdf`
    doc.save(fileName)

    return {
      success: true,
      fileName,
      totalPages: doc.internal.getNumberOfPages(),
      questionCount: questions.length
    }
  } catch (error) {
    console.error("Error generating PDF:", error)
    throw new Error(`Failed to generate PDF: ${error.message}`)
  }
}
