/**
 * Simple function to save assessment to the database
 */

import Assessment from '../models/assessment.model.js';


export const saveAssessment = async (assessmentData, sourceInfo, options = {}) => {

  // console.log("assessment data are" , assessmentData);
  // console.log("assessment data are" , assessmentData[0]);
  // console.log("source info are" , assessmentData[1]);
  try {
    // Extract questions from assessment data
    const questions = Array.isArray(assessmentData[0]) 
      ? assessmentData[0] 
      : (assessmentData[0].assessment || assessmentData[0].questions || []);
    
    if (!questions || questions.length === 0) {
      throw new Error('No questions found to save');
    }
    
    // Create assessment title
    let title = 'Generated Assessment';
    if(assessmentData[1].title){
      title = assessmentData[1].title || assessmentData[1].metadata.title || sourceInfo.title;
    }
    
    // Create assessment object
    const assessment = new Assessment({
      title: title || options.title || `${sourceInfo.type} assessment`,
      description: assessmentData[1].description || assessmentData[1].metadata.description || options.description || `${sourceInfo.type} assessment with ${questions.length} questions at ${sourceInfo.difficulty} difficulty.`,
      type: sourceInfo.type || 'MCQ',
      difficulty: sourceInfo.difficulty || 'medium',
      creator: options.userId || null,
      questions: questions,
      assessmentLang: sourceInfo.language || 'english',
      tags: assessmentData[1].tags || assessmentData[1].metadata.tags || [sourceInfo.difficulty, sourceInfo.type],
      isPublic: true,
      transcript: sourceInfo.transcript,
      learnId: sourceInfo.learnId || null,
    });
    
    // Save to database
    const savedAssessment = await assessment.save();
    console.log(`Assessment saved with ID: ${savedAssessment._id}`);
    return savedAssessment;
  } catch (error) {
    console.error('Error saving assessment to database:', error);
    return null;
  }
};