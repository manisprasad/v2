const INJECTED_ELEMENT_ID = "#secondary.style-scope.ytd-watch-flexy"

// Add modern font
const link = document.createElement("link")
link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap"
link.rel = "stylesheet"
document.head.appendChild(link)

document.body.style.fontFamily = "'Inter', sans-serif"

class TabManager {
  constructor() {
    this.tabs = {
      "💬 Chat": this.createTalkToVideoContent,
      "📝 Notes": this.createNotesGeneratorContent,
      "⌚ Chapters": this.createTimestampGeneratorContent,
      "🎴 Flashcards": this.createFlashCard,
      "📋 Summary": this.createSummaryContent,
    }
    this.tabContentState = {}
  }

  clearTabContentState() {
    this.tabContentState = {}
    const container = document.getElementById("custom-tabs-container")
    if (container) {
      container.remove()
    }
    this.injectCustomDiv()
  }

  createTabContent(tabName) {
    if (!this.tabContentState[tabName]) {
      const tabFunction = this.tabs[tabName]
      this.tabContentState[tabName] = tabFunction ? tabFunction.call(this) : this.createDefaultContent()
    }
    return this.tabContentState[tabName]
  }

  injectCustomDiv() {
    if (!window.location.href.match(/https:\/\/www\.youtube\.com\/watch\?v=.+/)) {
      return
    }

    if (document.getElementById("custom-tabs-container")) {
      return
    }

    const container = document.createElement("div")
    container.id = "custom-tabs-container"
    container.style.cssText = `
            padding: 20px;
            background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            margin-top: 20px;
            color: #fff;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
            width: 100%;
            box-sizing: border-box;
        `

    const tabButtonsContainer = document.createElement("div")
    tabButtonsContainer.style.cssText = `
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
            overflow-x: auto;
            padding-bottom: 12px;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
            -webkit-overflow-scrolling: touch;
            width: 100%;
            flex-wrap: nowrap;
        `

    const contentDiv = document.createElement("div")
    contentDiv.style.cssText = `
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            transform: translateY(10px);
            width: 100%;
            overflow-x: auto;
        `
    contentDiv.appendChild(this.createDefaultContent())
    setTimeout(() => {
      contentDiv.style.opacity = "1"
      contentDiv.style.transform = "translateY(0)"
    }, 100)

    Object.entries(this.tabs).forEach(([tabName, _]) => {
      const tabButton = document.createElement("button")
      tabButton.innerText = tabName
      tabButton.style.cssText = `
                padding: 12px 24px;
                font-size: 14px;
                font-weight: 500;
                color: rgba(255, 255, 255, 0.8);
                background: linear-gradient(145deg, #2a2a2a, #333);
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                display: flex;
                align-items: center;
                gap: 8px;
                white-space: nowrap;
                backdrop-filter: blur(5px);
                position: relative;
                overflow: hidden;
                flex-shrink: 0;
            `

      // Add hover effect
      tabButton.addEventListener("mouseover", () => {
        if (!tabButton.classList.contains("active")) {
          tabButton.style.transform = "translateY(-2px) scale(1.02)"
          tabButton.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.3)"
          tabButton.style.background = "linear-gradient(145deg, #333, #3a3a3a)"
        }
      })

      tabButton.addEventListener("mouseout", () => {
        if (!tabButton.classList.contains("active")) {
          tabButton.style.transform = "translateY(0) scale(1)"
          tabButton.style.boxShadow = "none"
          tabButton.style.background = "linear-gradient(145deg, #2a2a2a, #333)"
        }
      })

      // Add ripple effect
      tabButton.addEventListener("click", (e) => {
        const ripple = document.createElement("div")
        const rect = tabButton.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = e.clientX - rect.left - size / 2
        const y = e.clientY - rect.top - size / 2

        ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    transform: translate(${x}px, ${y}px) scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `

        tabButton.appendChild(ripple)
        setTimeout(() => ripple.remove(), 600)

        // Content transition
        contentDiv.style.opacity = "0"
        contentDiv.style.transform = "translateY(10px)"

        setTimeout(() => {
          contentDiv.innerHTML = ""
          contentDiv.appendChild(this.createTabContent(tabName))
          contentDiv.style.opacity = "1"
          contentDiv.style.transform = "translateY(0)"
        }, 300)

        // Update tab states
        tabButtonsContainer.querySelectorAll("button").forEach((btn) => {
          btn.classList.remove("active")
          btn.style.background = "linear-gradient(145deg, #2a2a2a, #333)"
          btn.style.color = "rgba(255, 255, 255, 0.8)"
          btn.style.transform = "translateY(0) scale(1)"
          btn.style.boxShadow = "none"
        })

        tabButton.classList.add("active")
        tabButton.style.background = "linear-gradient(145deg, #3a3a3a, #444)"
        tabButton.style.color = "#fff"
        tabButton.style.transform = "translateY(-2px) scale(1.02)"
        tabButton.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.3)"
      })

      tabButtonsContainer.appendChild(tabButton)
    })

    // Add ripple animation style
    const style = document.createElement("style")
    style.textContent = `
            @keyframes ripple {
                to {
                    transform: translate(${0}px, ${0}px) scale(4);
                    opacity: 0;
                }
            }
            
            ::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            
            ::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb {
                background: rgba(255, 255, 255, 0.3);
                border-radius: 4px;
            }
            
            ::-webkit-scrollbar-thumb:hover {
                background: rgba(255, 255, 255, 0.4);
            }
        `
    document.head.appendChild(style)

    container.appendChild(tabButtonsContainer)
    container.appendChild(contentDiv)

    const targetElement = document.querySelector(INJECTED_ELEMENT_ID)
    if (targetElement) {
      targetElement.prepend(container)
      // Initial animation
      container.style.opacity = "0"
      container.style.transform = "translateY(20px)"
      setTimeout(() => {
        container.style.opacity = "1"
        container.style.transform = "translateY(0)"
      }, 100)
    }
  }

  createFlashCard() {
    const contentWrapper = document.createElement("div")
    contentWrapper.style.cssText = `
            padding: 20px;
            background: linear-gradient(145deg, #2a2a2a, #333);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: #fff;
            height: 400px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
            position: relative;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            width: 100%;
            box-sizing: border-box;
        `

    const loadingMessage = document.createElement("div")
    loadingMessage.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 24px; margin-bottom: 10px;">✨</div>
                <div style="font-size: 16px; color: #ccc; font-weight: 500;">Generating Flashcards...</div>
            </div>
        `
    contentWrapper.appendChild(loadingMessage)

    fetchFlash()
      .then((flash) => {
        contentWrapper.removeChild(loadingMessage)
        let currentIndex = 0

        function createFlashcardElement(flashcard) {
          const cardContainer = document.createElement("div")
          cardContainer.style.cssText = `
                    perspective: 1000px;
                    width: 100%;
                    height: 300px;
                    margin-bottom: 20px;
                    box-sizing: border-box;
                `

          const card = document.createElement("div")
          card.style.cssText = `
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transform-style: preserve-3d;
                    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                `

          const front = document.createElement("div")
          front.innerHTML = flashcard.question
          front.style.cssText = `
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    background: linear-gradient(145deg, #333, #3a3a3a);
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                    font-size: 18px;
                    text-align: center;
                    box-sizing: border-box;
                    overflow: auto;
                `

          const back = document.createElement("div")
          back.innerHTML = flashcard.answer
          back.style.cssText = `
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    background: linear-gradient(145deg, #3a3a3a, #444);
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                    transform: rotateY(180deg);
                    font-size: 18px;
                    text-align: center;
                    box-sizing: border-box;
                    overflow: auto;
                `

          card.appendChild(front)
          card.appendChild(back)
          cardContainer.appendChild(card)

          let isFlipped = false
          cardContainer.addEventListener("click", () => {
            isFlipped = !isFlipped
            card.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0)"
          })

          return cardContainer
        }

        function updateFlashcard() {
          contentWrapper.innerHTML = ""
          const flashcard = flash[currentIndex]
          const cardElement = createFlashcardElement(flashcard)
          contentWrapper.appendChild(cardElement)

          // Navigation buttons
          const buttonsContainer = document.createElement("div")
          buttonsContainer.style.cssText = `
                    display: flex;
                    justify-content: center;
                    gap: 16px;
                    margin-top: 20px;
                `

          const prevButton = document.createElement("button")
          prevButton.innerText = "Previous"
          prevButton.style.cssText = `
                    padding: 10px 20px;
                    background: linear-gradient(145deg, #2a2a2a, #333);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: #fff;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    opacity: ${currentIndex === 0 ? "0.5" : "1"};
                `
          prevButton.disabled = currentIndex === 0

          const nextButton = document.createElement("button")
          nextButton.innerText = "Next"
          nextButton.style.cssText = `
                    padding: 10px 20px;
                    background: linear-gradient(145deg, #2a2a2a, #333);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    color: #fff;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    opacity: ${currentIndex === flash.length - 1 ? "0.5" : "1"};
                `
          nextButton.disabled = currentIndex === flash.length - 1

          prevButton.addEventListener("click", () => {
            if (currentIndex > 0) {
              currentIndex--
              updateFlashcard()
            }
          })

          nextButton.addEventListener("click", () => {
            if (currentIndex < flash.length - 1) {
              currentIndex++
              updateFlashcard()
            }
          })

          buttonsContainer.appendChild(prevButton)
          buttonsContainer.appendChild(nextButton)
          contentWrapper.appendChild(buttonsContainer)

          // Progress indicator
          const progress = document.createElement("div")
          progress.style.cssText = `
                    text-align: center;
                    margin-top: 16px;
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 14px;
                `
          progress.innerText = `Card ${currentIndex + 1} of ${flash.length}`
          contentWrapper.appendChild(progress)
        }

        updateFlashcard()
      })
      .catch((error) => {
        console.error("Error fetching flashcards:", error)
        contentWrapper.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 20px;
                    color: #ff6b6b;
                    font-size: 16px;
                ">
                    Error loading flashcards. Please try again.
                </div>
            `
      })

    return contentWrapper
  }

  createTalkToVideoContent() {
    const contentWrapper = document.createElement("div")
    contentWrapper.style.cssText = `
            padding: 20px;
            background: linear-gradient(145deg, #2a2a2a, #333);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: #fff;
            display: flex;
            flex-direction: column;
            height: 400px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            width: 100%;
            box-sizing: border-box;
        `

    const chatHistory = document.createElement("div")
    chatHistory.id = "chat-history"
    chatHistory.style.cssText = `
            flex: 1;
            overflow-y: auto;
            margin-bottom: 16px;
            padding: 12px;
            background: linear-gradient(145deg, #1e1e1e, #252525);
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
            width: 100%;
            box-sizing: border-box;
        `

    const inputContainer = document.createElement("div")
    inputContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(145deg, #333, #3a3a3a);
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            width: 100%;
            box-sizing: border-box;
        `

    const inputField = document.createElement("input")
    inputField.type = "text"
    inputField.placeholder = "Ask anything about the video..."
    inputField.style.cssText = `
            flex: 1;
            padding: 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: #fff;
            font-size: 14px;
            transition: all 0.3s ease;
            outline: none;
            width: 100%;
            box-sizing: border-box;
        `

    inputField.addEventListener("focus", () => {
      inputField.style.boxShadow = "0 0 0 2px rgba(255, 255, 255, 0.1)"
    })

    inputField.addEventListener("blur", () => {
      inputField.style.boxShadow = "none"
    })

    const sendButton = document.createElement("button")
    sendButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
        `
    sendButton.style.cssText = `
            background: linear-gradient(145deg, #4a90e2, #357abd);
            border: none;
            border-radius: 8px;
            color: #fff;
            width: 44px;
            height: 44px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(74, 144, 226, 0.3);
            flex-shrink: 0;
        `

    sendButton.addEventListener("mouseover", () => {
      sendButton.style.transform = "scale(1.05)"
      sendButton.style.boxShadow = "0 4px 12px rgba(74, 144, 226, 0.4)"
    })

    sendButton.addEventListener("mouseout", () => {
      sendButton.style.transform = "scale(1)"
      sendButton.style.boxShadow = "0 2px 8px rgba(74, 144, 226, 0.3)"
    })

    const addMessageToChat = (message, isUser) => {
      const messageElement = document.createElement("div")
      messageElement.style.cssText = `
                padding: 12px 16px;
                border-radius: 12px;
                max-width: 80%;
                align-self: ${isUser ? "flex-end" : "flex-start"};
                background: ${isUser ? "linear-gradient(145deg, #4a90e2, #357abd)" : "linear-gradient(145deg, #3a3a3a, #444)"};
                color: #fff;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                animation: fadeIn 0.3s ease;
                word-wrap: break-word;
                overflow-wrap: break-word;
            `

      const md = window.markdownit()
      const cleanedMarkdown = isUser ? message : message.substring(12)
      messageElement.innerHTML = md.render(cleanedMarkdown)

      const style = document.createElement("style")
      style.textContent = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .chat-message h1 { color: #4a90e2; font-size: 24px; margin: 8px 0; }
                .chat-message h2 { color: #64b5f6; font-size: 22px; margin: 8px 0; }
                .chat-message h3 { color: #90caf9; font-size: 20px; margin: 8px 0; }
                .chat-message p { color: #fff; font-size: 16px; margin: 4px 0; }
                .chat-message strong { color: #ffd700; }
                .chat-message em { color: #ffa07a; }
                .chat-message code {
                    background: rgba(0, 0, 0, 0.2);
                    color: #00ff00;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-family: 'Fira Code', monospace;
                }
                .chat-message pre {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 12px;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin: 8px 0;
                }
                .chat-message a {
                    color: #00bfff;
                    text-decoration: none;
                    border-bottom: 1px solid currentColor;
                    transition: opacity 0.2s;
                }
                .chat-message a:hover {
                    opacity: 0.8;
                }
                .chat-message ul, .chat-message ol {
                    margin: 8px 0;
                    padding-left: 24px;
                }
                .chat-message li {
                    margin: 4px 0;
                }
            `

      messageElement.classList.add("chat-message")
      messageElement.appendChild(style)
      chatHistory.appendChild(messageElement)
      chatHistory.scrollTop = chatHistory.scrollHeight
    }

    const handleSendMessage = async () => {
      const userMessage = inputField.value.trim()
      if (!userMessage) return

      addMessageToChat(userMessage, true)
      inputField.value = ""

      try {
        const response = await getGeminiResponse(userMessage)
        addMessageToChat(response, false)
      } catch (error) {
        console.error("Error:", error)
        addMessageToChat("Sorry, I couldn't process your request. Please try again.", false)
      }
    }

    sendButton.addEventListener("click", handleSendMessage)
    inputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSendMessage()
      }
    })

    inputContainer.appendChild(inputField)
    inputContainer.appendChild(sendButton)
    contentWrapper.appendChild(chatHistory)
    contentWrapper.appendChild(inputContainer)

    return contentWrapper
  }

  createSummaryContent() {
    const contentWrapper = document.createElement("div")
    contentWrapper.style.cssText = `
            padding: 20px;
            background: linear-gradient(145deg, #2a2a2a, #333);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: #fff;
            height: 400px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            width: 100%;
            box-sizing: border-box;
        `

    const loadingMessage = document.createElement("div")
    loadingMessage.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 24px; margin-bottom: 10px;">✨</div>
                <div style="font-size: 16px; color: #ccc; font-weight: 500;">Generating Summary...</div>
            </div>
        `
    contentWrapper.appendChild(loadingMessage)

    fetchSummary()
      .then((summary) => {
        contentWrapper.removeChild(loadingMessage)
        const cleanedMarkdown = summary.replace(/```markdown|```/g, "").trim()
        const md = window.markdownit()
        const parsedSummary = md.render(cleanedMarkdown)

        const summaryContainer = document.createElement("div")
        summaryContainer.innerHTML = parsedSummary
        summaryContainer.style.cssText = `
                padding: 16px;
                line-height: 1.6;
                font-size: 16px;
                border-left: 2px solid rgba(255, 255, 255, 0.2);
                animation: fadeIn 0.4s ease;
                width: 100%;
                box-sizing: border-box;
            `

        const style = document.createElement("style")
        style.innerHTML = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .markdown-content h1, .markdown-content h2, .markdown-content h3 {
                    margin-top: 20px;
                    margin-bottom: 12px;
                    font-weight: 600;
                    color: #4a90e2;
                    letter-spacing: -0.02em;
                }
                
                .markdown-content h1 { font-size: 28px; }
                .markdown-content h2 { font-size: 24px; }
                .markdown-content h3 { font-size: 20px; }
                
                .markdown-content p {
                    margin: 12px 0;
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    line-height: 1.7;
                }
                
                .markdown-content ul, .markdown-content ol {
                    margin: 12px 0;
                    padding-left: 24px;
                }
                
                .markdown-content li {
                    margin-bottom: 8px;
                    position: relative;
                }
                
                .markdown-content li::before {
                    content: "•";
                    color: #4a90e2;
                    position: absolute;
                    left: -18px;
                }
                
                .markdown-content pre {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 16px;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin: 12px 0;
                    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                .markdown-content code {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 3px 6px;
                    border-radius: 4px;
                    font-family: 'Fira Code', monospace;
                    font-size: 14px;
                }
            `
        document.head.appendChild(style)

        summaryContainer.classList.add("markdown-content")
        contentWrapper.appendChild(summaryContainer)
      })
      .catch((error) => {
        console.error("Error fetching summary:", error)
        contentWrapper.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 20px;
                    color: #ff6b6b;
                    font-size: 16px;
                    background: rgba(255, 107, 107, 0.1);
                    border-radius: 8px;
                    margin: 20px;
                ">
                    <div style="font-size: 24px; margin-bottom: 10px;">😕</div>
                    Error loading summary. Please try again.
                </div>
            `
      })

    return contentWrapper
  }

  createNotesGeneratorContent() {
    const contentWrapper = document.createElement("div")
    contentWrapper.style.cssText = `
            padding: 20px;
            background: linear-gradient(145deg, #2a2a2a, #333);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: #fff;
            height: 400px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            width: 100%;
            box-sizing: border-box;
        `

    const loadingMessage = document.createElement("div")
    loadingMessage.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 24px; margin-bottom: 10px;">✨</div>
                <div style="font-size: 16px; color: #ccc; font-weight: 500;">Generating Notes...</div>
            </div>
        `
    contentWrapper.appendChild(loadingMessage)

    fetchNotes()
      .then((notes) => {
        contentWrapper.removeChild(loadingMessage)
        const cleanedMarkdown = notes.replace(/```markdown|```/g, "").trim()
        const md = window.markdownit()
        const parsedNotes = md.render(cleanedMarkdown)

        const notesContainer = document.createElement("div")
        notesContainer.innerHTML = parsedNotes
        notesContainer.style.cssText = `
                padding: 16px;
                line-height: 1.6;
                font-size: 16px;
                border-left: 2px solid rgba(255, 255, 255, 0.2);
                animation: fadeIn 0.4s ease;
                width: 100%;
                box-sizing: border-box;
            `

        const style = document.createElement("style")
        style.innerHTML = `
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .markdown-content h1, .markdown-content h2, .markdown-content h3 {
                    margin-top: 20px;
                    margin-bottom: 12px;
                    font-weight: 600;
                    color: #4a90e2;
                    letter-spacing: -0.02em;
                }
                
                .markdown-content h1 { font-size: 28px; }
                .markdown-content h2 { font-size: 24px; }
                .markdown-content h3 { font-size: 20px; }
                
                .markdown-content p {
                    margin: 12px 0;
                    padding: 8px 0;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    line-height: 1.7;
                }
                
                .markdown-content ul, .markdown-content ol {
                    margin: 12px 0;
                    padding-left: 24px;
                }
                
                .markdown-content li {
                    margin-bottom: 8px;
                    position: relative;
                }
                
                .markdown-content li::before {
                    content: "•";
                    color: #4a90e2;
                    position: absolute;
                    left: -18px;
                }
                
                .markdown-content pre {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 16px;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin: 12px 0;
                    box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                
                .markdown-content code {
                    background: rgba(0, 0, 0, 0.2);
                    padding: 3px 6px;
                    border-radius: 4px;
                    font-family: 'Fira Code', monospace;
                    font-size: 14px;
                }
            `
        document.head.appendChild(style)

        notesContainer.classList.add("markdown-content")
        contentWrapper.appendChild(notesContainer)
      })
      .catch((error) => {
        console.error("Error fetching notes:", error)
        contentWrapper.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 20px;
                    color: #ff6b6b;
                    font-size: 16px;
                    background: rgba(255, 107, 107, 0.1);
                    border-radius: 8px;
                    margin: 20px;
                ">
                    <div style="font-size: 24px; margin-bottom: 10px;">😕</div>
                    Error loading notes. Please try again.
                </div>
            `
      })

    return contentWrapper
  }

  createTimestampGeneratorContent() {
    const contentWrapper = document.createElement("div")
    contentWrapper.style.cssText = `
            padding: 20px;
            background: linear-gradient(145deg, #2a2a2a, #333);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: #fff;
            height: 400px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            width: 100%;
            box-sizing: border-box;
        `

    const loadingMessage = document.createElement("div")
    loadingMessage.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 24px; margin-bottom: 10px;">✨</div>
                <div style="font-size: 16px; color: #ccc; font-weight: 500;">Generating Chapters...</div>
            </div>
        `
    contentWrapper.appendChild(loadingMessage)

    fetchChapters()
      .then((chapters) => {
        contentWrapper.removeChild(loadingMessage)
        const cleanedMarkdown = chapters.replace(/```json|```/g, "").trim()

        try {
          const chaptersData = JSON.parse(cleanedMarkdown)
          const chaptersList = document.createElement("div")
          chaptersList.style.cssText = `
                    display: grid;
                    gap: 16px;
                    padding: 4px;
                    width: 100%;
                    box-sizing: border-box;
                `

          chaptersData.forEach((chapter, index) => {
            const chapterItem = document.createElement("div")
            chapterItem.style.cssText = `
                        background: linear-gradient(145deg, #333, #3a3a3a);
                        border-radius: 12px;
                        padding: 16px;
                        cursor: pointer;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        position: relative;
                        overflow: hidden;
                        animation: fadeIn 0.4s ease backwards;
                        animation-delay: ${index * 0.1}s;
                        width: 100%;
                        box-sizing: border-box;
                    `

            chapterItem.innerHTML = `
                        <div style="
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 4px;
                            height: 100%;
                            background: linear-gradient(to bottom, #4a90e2, #357abd);
                        "></div>
                        <div style="
                            font-weight: 600;
                            font-size: 18px;
                            color: #4a90e2;
                            margin-bottom: 8px;
                        ">${chapter.Title}</div>
                        <div style="
                            font-size: 14px;
                            color: rgba(255, 255, 255, 0.8);
                            margin-bottom: 12px;
                            line-height: 1.5;
                        ">${chapter.des}</div>
                        <div style="
                            font-size: 12px;
                            color: rgba(255, 255, 255, 0.6);
                            display: flex;
                            align-items: center;
                            gap: 6px;
                        ">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12 6 12 12 16 14"></polyline>
                            </svg>
                            ${chapter.startTime}
                        </div>
                    `

            chapterItem.addEventListener("mouseover", () => {
              chapterItem.style.transform = "translateY(-2px)"
              chapterItem.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)"
              chapterItem.style.background = "linear-gradient(145deg, #3a3a3a, #444)"
            })

            chapterItem.addEventListener("mouseout", () => {
              chapterItem.style.transform = "translateY(0)"
              chapterItem.style.boxShadow = "none"
              chapterItem.style.background = "linear-gradient(145deg, #333, #3a3a3a)"
            })

            chapterItem.addEventListener("click", () => {
              const videoPlayer = document.querySelector("video")
              if (videoPlayer) {
                const time = Number.parseFloat(chapter.startTime)
                videoPlayer.currentTime = time

                // Add click feedback animation
                const ripple = document.createElement("div")
                ripple.style.cssText = `
                                position: absolute;
                                width: 100%;
                                height: 100%;
                                top: 0;
                                left: 0;
                                background: rgba(255, 255, 255, 0.1);
                                border-radius: 12px;
                                animation: ripple 0.6s linear;
                                pointer-events: none;
                            `
                chapterItem.appendChild(ripple)
                setTimeout(() => ripple.remove(), 600)
              }
            })

            chaptersList.appendChild(chapterItem)
          })

          const style = document.createElement("style")
          style.textContent = `
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translateY(10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    @keyframes ripple {
                        to {
                            opacity: 0;
                            transform: scale(1.1);
                        }
                    }
                `
          document.head.appendChild(style)

          contentWrapper.appendChild(chaptersList)
        } catch (error) {
          console.error("Error parsing chapters:", error)
          contentWrapper.innerHTML = `
                    <div style="
                        text-align: center;
                        padding: 20px;
                        color: #ff6b6b;
                        font-size: 16px;
                        background: rgba(255, 107, 107, 0.1);
                        border-radius: 8px;
                        margin: 20px;
                    ">
                        <div style="font-size: 24px; margin-bottom: 10px;">😕</div>
                        Error loading chapters. Please try again.
                    </div>
                `
        }
      })
      .catch((error) => {
        console.error("Error fetching chapters:", error)
        contentWrapper.innerHTML = `
                <div style="
                    text-align: center;
                    padding: 20px;
                    color: #ff6b6b;
                    font-size: 16px;
                    background: rgba(255, 107, 107, 0.1);
                    border-radius: 8px;
                    margin: 20px;
                ">
                    <div style="font-size: 24px; margin-bottom: 10px;">😕</div>
                    Error loading chapters. Please try again.
                </div>
            `
      })

    return contentWrapper
  }

  createDefaultContent() {
    const contentWrapper = document.createElement("div")
    contentWrapper.style.cssText = `
            padding: 20px;
            background: linear-gradient(145deg, #2a2a2a, #333);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            color: #fff;
            text-align: center;
            animation: fadeIn 0.4s ease;
            width: 100%;
            box-sizing: border-box;
        `

    contentWrapper.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 12px;">👋</div>
            <div style="font-size: 18px; color: #4a90e2; margin-bottom: 8px;">Welcome!</div>
            <div style="color: rgba(255, 255, 255, 0.8);">Select a tab to get started.</div>
        `

    return contentWrapper
  }
}

// Function to check if the video is playing
function isVideoPlaying() {
  const videoPlayer = document.querySelector("video")
  return videoPlayer && !videoPlayer.paused
}

let tabManager = null
function handleInjection() {
  if (isVideoPlaying()) {
    if (!tabManager) {
      tabManager = new TabManager()
    }
    tabManager.injectCustomDiv()
  }
}

// Setup observers and initialize
function setupObservers() {
  const observer = new MutationObserver(() => {
    handleInjection()
    fetchSubTitleIfVideoChanged()
      .then(() => console.log("Subtitles updated"))
      .catch((e) => console.error("Error updating subtitles:", e))
  })

  observer.observe(document.body, { childList: true, subtree: true })

  // Initial setup
  handleInjection()
  fetchSubTitleIfVideoChanged()
    .then(() => console.log("Initial subtitles loaded"))
    .catch((e) => console.error("Error loading initial subtitles:", e))
}

setupObservers()

// API configuration
const API_KEY = "AIzaSyDlDIyb9uuEF0Ya34aE0Nnn_8KOpvuuxOY"
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`
let videoSubTitle = ""
let currentVideoId = null

function getVideoId() {
  const urlParams = new URLSearchParams(window.location.search)
  return urlParams.get("v")
}

async function fetchSubTitleIfVideoChanged() {
  const newVideoId = getVideoId()
  if (newVideoId && newVideoId !== currentVideoId) {
    currentVideoId = newVideoId
    await fetchSubTitle(currentVideoId)
    if (tabManager) {
      tabManager.clearTabContentState()
    }
  }
}

async function fetchSubTitle(videoId) {
  try {
    const response = await fetch(`https://yt-transcript-testing.vercel.app/api/transcript/${videoId}`)
    if (response.ok) {
      videoSubTitle = await response.json()
    } else {
      console.error("Failed to fetch subtitle:", response.status)
    }
  } catch (error) {
    console.error("Error fetching subtitle:", error)
  }
}

// API interaction functions
async function fetchSummary() {
  const formattedtext = videoSubTitle?.transcript
    ?.map((sub) => `${sub.start}s - ${sub.start + sub.duration}s: ${sub.text}`)
    .join("\n")

  const prompt = `
    You are an advanced AI assistant. Your task is to process timestamped captions from a video and generate a concise summary in Markdown format. The summary should be clear, concise, and well-organized while ensuring readability.
    
    The transcript is as follows:
    ${formattedtext}
    
    ### 📝 Formatting Guidelines:
    - Use bullet points for clarity
    - Highlight key terms in bold for emphasis
    - Keep the summary short and to the point
    
    ### 🔒 Strict Content Scope:
    1. Stick to the video content – Only generate a summary directly based on the transcript
    2. No extra commentary – Avoid opinions, assumptions, or external information not found in the video
    3. No promotions – Do not include calls to action or mentions of future content
    
    ## 📌 Summary
    `

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated."
  } catch (error) {
    console.error("Error:", error)
    return "Error fetching response."
  }
}

async function getGeminiResponse(prompt) {
  const formattedtext = videoSubTitle?.transcript
    ?.map((sub) => `${sub.start}s - ${sub.start + sub.duration}s: ${sub.text}`)
    .join("\n")

  const context = `
    You are an AI assistant designed to help users understand YouTube videos better. Your responses should be based on the video content and presented in a clear, engaging format.
    
    Video Transcript:
    ${formattedtext}
    
    Guidelines:
    - Format timestamps consistently
    - Use markdown for formatting
    - Keep responses concise and relevant
    - Focus on the video content
    `

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${context}\n\nUser Query: ${prompt}` }] }],
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated."
  } catch (error) {
    console.error("Error:", error)
    return "Error fetching response."
  }
}

async function fetchChapters() {
  const formattedtext = videoSubTitle?.transcript
    ?.map((sub) => `${sub.start}s - ${sub.start + sub.duration}s: ${sub.text}`)
    .join("\n")

  const prompt = `
    Generate a list of chapters from this video transcript in JSON format:
    ${formattedtext}
    
    Format each chapter as:
    {
        startTime: "time in seconds",
        Title: "Chapter title",
        des: "Brief description"
    }
    
    Return only the JSON array.
    `

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated."
  } catch (error) {
    console.error("Error:", error)
    return "Error fetching response."
  }
}

async function fetchNotes() {
  const formattedtext = videoSubTitle?.transcript
    ?.map((sub) => `${sub.start}s - ${sub.start + sub.duration}s: ${sub.text}`)
    .join("\n")

  const prompt = `
    Generate detailed, well-structured notes from this video transcript:
    ${formattedtext}
    
    Format using:
    - Clear headings
    - Bullet points
    - Key terms in bold
    - Timestamps where relevant
    
    Focus on main concepts and important details.
    `

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated."
  } catch (error) {
    console.error("Error:", error)
    return "Error fetching response."
  }
}

async function fetchFlash() {
  const formattedtext = videoSubTitle?.transcript
    ?.map((sub) => `${sub.start}s - ${sub.start + sub.duration}s: ${sub.text}`)
    .join("\n")

  const prompt = `
    Create 10 flashcards from this video transcript:
    ${formattedtext}
    
    Format as JSON array of:
    {
        "question": "Question with HTML formatting",
        "answer": "Answer with HTML formatting"
    }
    
    Use appropriate HTML tags (li, ul, h3, strong, span, div, table) with inline styles.
    Return only the JSON array.
    `

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    const formattedResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]"
    return JSON.parse(formattedResponse.replace(/```json\n|\n```/g, ""))
  } catch (error) {
    console.error("Error:", error)
    return []
  }
}
