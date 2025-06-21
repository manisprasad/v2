
const INJECTED_ELEMENT_ID = "#secondary.style-scope.ytd-watch-flexy";

// Add Google Fonts - Poppins
const link = document.createElement("link");
link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap";
link.rel = "stylesheet";
document.head.appendChild(link);

// Add Font Awesome for icons
const fontAwesome = document.createElement("link");
fontAwesome.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css";
fontAwesome.rel = "stylesheet";
document.head.appendChild(fontAwesome);

// Add custom CSS styles
const customStyles = document.createElement("style");
customStyles.textContent = `
  .yt-sidekick {
    --primary-color: #8B5CF6;
    --primary-light: rgba(139, 92, 246, 0.1);
    --primary-hover: #7C3AED;
    --text-light: #f1f5f9;
    --text-dark: #1e293b;
    --bg-dark: #1a1a1a;
    --bg-card: #222222;
    --bg-hover: #2a2a2a;
    --border-color: #333333;
    font-family: 'Poppins', sans-serif;
  }

  #custom-tabs-container {
    padding: 16px;
    background-color: var(--bg-dark);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    margin-top: 16px;
    color: var(--text-light);
    overflow: hidden;
  }

  .tab-buttons-container {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);
    overflow-x: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--primary-color) var(--bg-dark);
    -ms-overflow-style: none;
  }

  .tab-buttons-container::-webkit-scrollbar {
    height: 4px;
  }

  .tab-buttons-container::-webkit-scrollbar-thumb {
    background-color: var(--primary-color);
    border-radius: 4px;
  }

  .tab-button {
    padding: 10px 16px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-light);
    background-color: var(--bg-card);
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .tab-button i {
    font-size: 14px;
  }

  .tab-button:hover {
    background-color: var(--bg-hover);
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  }

  .tab-button.active {
    background-color: var(--primary-color);
    color: white;
    box-shadow: 0 4px 8px rgba(139, 92, 246, 0.3);
  }

  .content-wrapper {
    transition: all 0.3s ease-in-out;
    animation: fadeIn 0.5s ease;
    border-radius: 12px;
    overflow: hidden;
  }

  /* Content containers styling */
  .chat-history {
    flex: 1;
    overflow-y: auto;
    margin-bottom: 16px;
    padding: 12px;
    background-color: var(--bg-card);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    scrollbar-width: thin;
    scrollbar-color: var(--primary-color) var(--bg-card);
    max-height: 320px;
  }

  .chat-history::-webkit-scrollbar {
    width: 4px;
  }

  .chat-history::-webkit-scrollbar-thumb {
    background-color: var(--primary-color);
    border-radius: 4px;
  }

  .chat-message {
    padding: 10px 16px;
    border-radius: 18px;
    max-width: 85%;
    word-wrap: break-word;
    animation: messageIn 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .chat-message.user {
    align-self: flex-end;
    background-color: var(--primary-color);
    border-bottom-right-radius: 4px;
  }

  .chat-message.bot {
    align-self: flex-start;
    background-color: var(--bg-hover);
    border-bottom-left-radius: 4px;
  }

  .input-container {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    background-color: var(--bg-card);
    padding: 8px 12px;
    border-radius: 24px;
    margin-top: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .input-field {
    flex: 1;
    padding: 10px 16px;
    background-color: transparent;
    border: none;
    color: var(--text-light);
    font-size: 14px;
    outline: none;
    font-family: 'Poppins', sans-serif;
  }

  .input-field::placeholder {
    color: #666;
  }

  .send-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: white;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(139, 92, 246, 0.3);
  }

  .send-button:hover {
    background-color: var(--primary-hover);
    transform: scale(1.05);
  }

  /* Markdown content styling */
  .markdown-content {
    padding: 16px;
    line-height: 1.7;
    font-size: 15px;
  }

  .markdown-content h1, 
  .markdown-content h2, 
  .markdown-content h3 {
    margin-top: 16px;
    margin-bottom: 12px;
    font-weight: 600;
    color: var(--primary-color);
  }

  .markdown-content p {
    margin: 12px 0;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .markdown-content ul, 
  .markdown-content ol {
    margin: 12px 0;
    padding-left: 24px;
  }

  .markdown-content li {
    margin-bottom: 8px;
  }

  .markdown-content pre {
    background-color: rgba(0, 0, 0, 0.3);
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 16px 0;
  }

  .markdown-content code {
    background-color: rgba(0, 0, 0, 0.2);
    padding: 3px 6px;
    border-radius: 4px;
    font-family: monospace;
    color: #f1c40f;
  }

  /* Flashcard styling */
  .flash-card {
    perspective: 1000px;
    height: 200px;
    margin: 24px 0;
  }

  .flash-card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    transform-style: preserve-3d;
    background-color: var(--bg-card);
    border-radius: 16px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }

  .flash-card-inner.flipped {
    transform: rotateY(180deg);
  }

  .flash-card-front,
  .flash-card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    border-radius: 16px;
    overflow: auto;
  }

  .flash-card-front {
    background: linear-gradient(135deg, var(--bg-card), var(--bg-hover));
    z-index: 1;
  }

  .flash-card-back {
    background: linear-gradient(135deg, var(--primary-light), var(--bg-card));
    transform: rotateY(180deg);
  }

  .flash-nav-buttons {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: 20px;
  }

  .flash-nav-button {
    padding: 10px 20px;
    background-color: var(--bg-card);
    color: var(--text-light);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .flash-nav-button:hover:not(:disabled) {
    background-color: var(--primary-color);
    transform: translateY(-2px);
  }

  .flash-nav-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Chapters styling */
  .chapter-item {
    margin-bottom: 16px;
    padding: 16px;
    background: linear-gradient(135deg, var(--bg-card), var(--bg-hover));
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    animation: slideIn 0.5s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .chapter-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    background: linear-gradient(135deg, var(--bg-hover), var(--primary-light));
  }

  .chapter-title {
    font-weight: 600;
    font-size: 16px;
    color: var(--primary-color);
    margin-bottom: 8px;
  }

  .chapter-description {
    font-size: 14px;
    color: var(--text-light);
    margin-bottom: 8px;
    opacity: 0.9;
  }

  .chapter-time {
    font-size: 12px;
    color: #ccc;
    font-style: italic;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  /* Loading animation */
  @keyframes pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }

  .loading-message {
    text-align: center;
    padding: 20px;
    font-size: 16px;
    color: var(--text-light);
    animation: pulse 2s infinite ease-in-out;
  }

  /* Other animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(-20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes messageIn {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }
`;

document.head.appendChild(customStyles);

class TabManager {
    constructor() {
        this.tabs = {
            "Talk to Video": { 
                icon: "fa-solid fa-comments",
                handler: this.createTalkToVideoContent 
            },
            "Notes Generator": { 
                icon: "fa-solid fa-clipboard-list",
                handler: this.createNotesGeneratorContent 
            },
            "✨Chapters": { 
                icon: "fa-solid fa-book",
                handler: this.createTimestampGeneratorContent 
            },
            "Flashcards": { 
                icon: "fa-solid fa-clone",
                handler: this.createFlashCard 
            },
            "Summary": { 
                icon: "fa-solid fa-align-left",
                handler: this.createSummaryContent 
            }
        };
        this.tabContentState = {}; 
    }

    clearTabContentState() {
        this.tabContentState = {};
        window.alert("Tab content cleared");
        
        const container = document.getElementById("custom-tabs-container");
        if (container) {
            container.remove(); 
        }
        
        this.injectCustomDiv();
    }

    createFlashCard() {
        const contentWrapper = document.createElement("div");
        contentWrapper.className = "content-wrapper";
        contentWrapper.style.cssText = `
            padding: 16px; 
            background-color: var(--bg-dark); 
            border-radius: 12px; 
            height: 400px; 
            overflow-y: auto; 
            position: relative;
            display: flex;
            flex-direction: column;
        `;
    
        const loadingMessage = document.createElement("div");
        loadingMessage.className = "loading-message";
        loadingMessage.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Take a deep breath ✨✨';
        
        setTimeout(() => {
            loadingMessage.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating Flashcards for you...';
        }, 2000);
        
        contentWrapper.appendChild(loadingMessage);
    
        // Define an array to store the flashcards
        let flashcards = [];
        let currentIndex = 0;
    
        // Create a flashcard content area that will contain the actual cards
        const flashcardContent = document.createElement("div");
        flashcardContent.className = "flashcard-content";
        flashcardContent.style.cssText = `
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            margin-bottom: 16px;
        `;
        contentWrapper.appendChild(flashcardContent);
        
        // Create navigation buttons wrapper early, but add it to content later
        const buttonsWrapper = document.createElement("div");
        buttonsWrapper.className = "flash-nav-buttons";
        buttonsWrapper.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: auto;
            padding-top: 16px;
            border-top: 1px solid var(--border-color);
        `;
    
        // Fetch flashcards
        fetchFlash().then((flash) => {
            console.log(flash);
            // Assume the `flash` response contains an array of flashcards
            flashcards = flash.map(item => ({
                question: item.question,
                answer: item.answer
            }));
    
            contentWrapper.removeChild(loadingMessage);
    
            // Function to update the flashcard display
            function updateFlashCard() {
                if (flashcards.length === 0) return;
    
                const flash = flashcards[currentIndex];
    
                // Clear previous flashcard
                flashcardContent.innerHTML = "";
    
                // Create a new flashcard
                const flashCardContainer = document.createElement("div");
                flashCardContainer.className = "flash-card";
                flashCardContainer.style.cssText = `
                    perspective: 1000px;
                    height: 220px;
                    width: 100%;
                    margin: 0 auto;
                `;
    
                // Inner container for flip animation
                const innerContainer = document.createElement("div");
                innerContainer.className = "flash-card-inner";
                innerContainer.style.cssText = `
                    position: relative;
                    width: 100%;
                    height: 100%;
                    transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    transform-style: preserve-3d;
                    background-color: var(--bg-card);
                    border-radius: 16px;
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
                `;
    
                // Front side (question)
                const frontSide = document.createElement("div");
                frontSide.className = "flash-card-front";
                frontSide.style.cssText = `
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, var(--bg-card), var(--bg-hover));
                    overflow: auto;
                `;
                frontSide.innerHTML = `
                    <div style="width: 100%; text-align: center;">
                        <div style="font-size: 12px; margin-bottom: 12px; color: #ccc;">
                            Card ${currentIndex + 1} of ${flashcards.length}
                        </div>
                        <div style="font-size: 18px; font-weight: 500; margin-bottom: 16px; max-height: 120px; overflow-y: auto; padding: 8px;">
                            ${flash.question}
                        </div>
                        <div style="margin-top: 16px; font-size: 12px; color: #aaa;">
                            Click to flip
                        </div>
                    </div>
                `;
    
                // Back side (answer)
                const backSide = document.createElement("div");
                backSide.className = "flash-card-back";
                backSide.style.cssText = `
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    backface-visibility: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 24px;
                    border-radius: 16px;
                    background: linear-gradient(135deg, var(--primary-light), var(--bg-card));
                    transform: rotateY(180deg);
                    overflow: auto;
                `;
                backSide.innerHTML = `
                    <div style="width: 100%; text-align: center;">
                        <div style="font-size: 14px; margin-bottom: 12px; color: #ccc;">Answer:</div>
                        <div style="max-height: 150px; overflow-y: auto; padding: 8px;">${flash.answer}</div>
                    </div>
                `;
    
                // Append front and back sides to the inner container
                innerContainer.appendChild(frontSide);
                innerContainer.appendChild(backSide);
    
                // Append inner container to the flashcard
                flashCardContainer.appendChild(innerContainer);
    
                // Add click event for flip animation
                flashCardContainer.addEventListener("click", () => {
                    innerContainer.classList.toggle("flipped");
                });
    
                // Append flashcard to the flashcard content area
                flashcardContent.appendChild(flashCardContainer);
                
                // Update navigation buttons status
                updateButtonStates();
            }
    
            // Back button
            const backButton = document.createElement("button");
            backButton.className = "flash-nav-button";
            backButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i> Previous';
            backButton.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevent event bubbling to the card
                if (currentIndex > 0) {
                    currentIndex--;
                    updateFlashCard();
                }
            });
    
            // Next button
            const nextButton = document.createElement("button");
            nextButton.className = "flash-nav-button";
            nextButton.innerHTML = 'Next <i class="fa-solid fa-chevron-right"></i>';
            nextButton.addEventListener("click", (e) => {
                e.stopPropagation(); // Prevent event bubbling to the card
                if (currentIndex < flashcards.length - 1) {
                    currentIndex++;
                    updateFlashCard();
                }
            });
    
            // Function to update button states (dim and disable at extremes)
            function updateButtonStates() {
                backButton.disabled = currentIndex === 0;
                nextButton.disabled = currentIndex === flashcards.length - 1;
            }
    
            // Append buttons to the wrapper
            buttonsWrapper.appendChild(backButton);
            buttonsWrapper.appendChild(nextButton);
            contentWrapper.appendChild(buttonsWrapper);
    
            // Card counter display
            const cardCounter = document.createElement("div");
            cardCounter.style.cssText = `
                text-align: center;
                font-size: 12px;
                color: var(--text-light);
                opacity: 0.7;
                margin-top: 8px;
            `;
            cardCounter.textContent = `${currentIndex + 1} / ${flashcards.length}`;
            contentWrapper.appendChild(cardCounter);
            
            // Update card counter when changing cards
            const updateCardCounter = () => {
                cardCounter.textContent = `${currentIndex + 1} / ${flashcards.length}`;
            };
            
            // Override previous event listeners to also update counter
            backButton.addEventListener("click", updateCardCounter);
            nextButton.addEventListener("click", updateCardCounter);
    
            // Initial flashcard display
            updateFlashCard();
    
        }).catch(error => {
            console.error("Error fetching notes:", error);
            const errorMessage = document.createElement("div");
            errorMessage.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error loading flashcards. Please try again.';
            errorMessage.style.cssText = "text-align: center; padding: 20px; color: #ff6b6b;";
            contentWrapper.appendChild(errorMessage);
        });
    
        return contentWrapper;
    }

    createTalkToVideoContent() {
        const contentWrapper = document.createElement("div");
        contentWrapper.className = "content-wrapper";
        contentWrapper.style.cssText = `

            background-color: #2a2a2a;
            border: 1px solid #444;
            border-radius: 8px;
            color: #fff;
            display: flex;
            flex-direction: column;
            height: 500px;
            box-sizing: border-box;
        `;
    
        // Chat history container
        const chatHistory = document.createElement("div");
        chatHistory.id = "chat-history";
        chatHistory.className = "chat-history";
        chatHistory.style.cssText = `
            flex: 1;
            overflow-y: auto;
            margin-bottom: 12px;
            background-color: #1e1e1e;
            border-radius: 6px;
            display: flex;
            flex-direction: column;
            gap: 8px;
        `;
        contentWrapper.appendChild(chatHistory);
    
        // Input container
        const inputContainer = document.createElement("div");
        inputContainer.className = "input-container";
        inputContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
        `;
    
        // Input field
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.className = "input-field";
        inputField.placeholder = "Ask anything about this video...";
        inputField.style.cssText = `
            flex: 1;
            padding: 10px;
            background-color: #333;
            border: 1px solid #444;
            border-radius: 6px;
            color: #fff;
            font-size: 14px;
            outline: none;
        `;
    
        // Send button
        const sendButton = document.createElement("div");
        sendButton.className = "send-button";
        sendButton.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
        sendButton.style.cssText = `
            cursor: pointer;
            padding: 10px;
            background-color: #4a90e2;
            color: white;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: opacity 0.2s;
        `;
        sendButton.addEventListener("mouseover", () => {
            sendButton.style.opacity = "0.8";
        });
        sendButton.addEventListener("mouseout", () => {
            sendButton.style.opacity = "1";
        });

 
    
        // Function to add messages to chat
        const addMessageToChat = (message, isUser) => {
            const messageElement = document.createElement("div");
            messageElement.style.cssText = `
                border-radius: 8px;
                max-width: 80%;
                align-self: ${isUser ? "flex-end" : "flex-start"};
                font-size: 19px;
                color: #fff;
                height:500px
                word-wrap: break-word;
            `;

            console.log(message);
            let newMesg = message;
    
               if(!isUser) {
                newMesg = message.substring(8, message.length - 3);
               }
                messageElement.innerHTML = newMesg
    
            // messageElement.classList.add("chat-message");
            // messageElement.appendChild(style);
            chatHistory.appendChild(messageElement);
            chatHistory.scrollTop = chatHistory.scrollHeight;
        };
    
        // Function to handle sending a message
        const handleSendMessage = async () => {
            const userMessage = inputField.value.trim();
            if (!userMessage) return;
    
            addMessageToChat(`${userMessage}`, true);
            inputField.value = "";
    
            // Show typing indicator
            const typingIndicator = document.createElement("div");
            typingIndicator.className = "chat-message bot";
            typingIndicator.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
            typingIndicator.style.cssText = `
                padding: 12px 16px;
                background-color: #444;
                border-radius: 8px;
                align-self: flex-start;
                max-width: 80%;
            `;
            chatHistory.appendChild(typingIndicator);
            chatHistory.scrollTop = chatHistory.scrollHeight;
    
            try {
                const geminiResponse = await getGeminiResponse(userMessage);
                chatHistory.removeChild(typingIndicator);
                addMessageToChat(` ${geminiResponse}`, false);
            } catch (error) {
                chatHistory.removeChild(typingIndicator);
                console.error("Error:", error);
                addMessageToChat(`<strong>Error:</strong> Failed to get a response. Please try again.`, false);
            }
        };
    
        // Send message on button click
        sendButton.addEventListener("click", handleSendMessage);
    
        // Send message on Enter key press
        inputField.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
                handleSendMessage();
            }
        });
    
        inputContainer.appendChild(inputField);
        inputContainer.appendChild(sendButton);
        contentWrapper.appendChild(inputContainer);
    
        return contentWrapper;
    }
    
    createSummaryContent() {
        const contentWrapper = document.createElement("div");
        contentWrapper.className = "content-wrapper";
        contentWrapper.style.cssText = `
            padding: 16px; 
            background-color: var(--bg-dark); 
            border-radius: 12px; 
            height: 400px; 
            overflow-y: auto;
        `;
    
        const loadingMessage = document.createElement("div");
        loadingMessage.className = "loading-message";
        loadingMessage.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Loading summary...✨✨';
        contentWrapper.appendChild(loadingMessage);
    
        // Fetch summary and display it
        fetchSummary().then((summary) => {
            contentWrapper.removeChild(loadingMessage);
    
            const cleanedMarkdown = summary.replace(/```markdown|```/g, "").trim();
            const md = window.markdownit();
            const parsedSummary = md.render(cleanedMarkdown);
    
            const summaryContainer = document.createElement("div");
            summaryContainer.className = "markdown-content";
            summaryContainer.innerHTML = parsedSummary;
            contentWrapper.appendChild(summaryContainer);
            
        }).catch((error) => {
            console.error("Error fetching summary:", error);
            const errorMessage = document.createElement("div");
            errorMessage.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error loading summary. Please try again.';
            errorMessage.style.cssText = "text-align: center; padding: 20px; color: #ff6b6b;";
            contentWrapper.appendChild(errorMessage);
        });
    
        return contentWrapper;
    }

    createNotesGeneratorContent() {
        const contentWrapper = document.createElement("div");
        contentWrapper.className = "content-wrapper";
        contentWrapper.style.cssText = `
            padding: 16px; 
            background-color: var(--bg-dark); 
            border-radius: 12px; 
            height: 400px; 
            overflow-y: auto;
        `;
    
        const loadingMessage = document.createElement("div");
        loadingMessage.className = "loading-message";
        loadingMessage.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating smart notes... ✨✨';
        contentWrapper.appendChild(loadingMessage);
    
        // Fetch notes and display in tab
        fetchNotes().then((notes) => {
            contentWrapper.removeChild(loadingMessage);
    
            const cleanedMarkdown = notes.replace(/```markdown|```/g, "").trim();
            const md = window.markdownit();
            const parsedNotes = md.render(cleanedMarkdown);
    
            const notesContainer = document.createElement("div");
            notesContainer.className = "markdown-content";
            notesContainer.innerHTML = parsedNotes;
            contentWrapper.appendChild(notesContainer);
            
        }).catch((error) => {
            console.error("Error fetching notes:", error);
            const errorMessage = document.createElement("div");
            errorMessage.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error loading notes. Please try again.';
            errorMessage.style.cssText = "text-align: center; padding: 20px; color: #ff6b6b;";
            contentWrapper.appendChild(errorMessage);
        });
    
        return contentWrapper;
    }
    
    createTimestampGeneratorContent() {
        const contentWrapper = document.createElement("div");
        contentWrapper.className = "content-wrapper";
        contentWrapper.style.cssText = `
            padding: 16px; 
            height: 400px;  
            background-color: var(--bg-dark); 
            border-radius: 12px; 
            overflow-y: auto;
        `;
    
        const loadingMessage = document.createElement("div");
        loadingMessage.className = "loading-message";
        loadingMessage.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating chapters... ✨✨';
        contentWrapper.appendChild(loadingMessage);
    
        // Fetch and display chapters
        fetchChapters().then((chapters) => {
            contentWrapper.removeChild(loadingMessage);
            const cleanedMarkdown = chapters.replace(/```json|```/g, "").trim();
    
            try {
                const chaptersData = JSON.parse(cleanedMarkdown);
                const chaptersList = document.createElement("div");
    
                chaptersData.forEach((chapter, index) => {
                    const chapterItem = document.createElement("div");
                    chapterItem.className = "chapter-item";
                    chapterItem.style.animationDelay = `${index * 0.1}s`;
    
                    const chapterTitle = document.createElement("div");
                    chapterTitle.className = "chapter-title";
                    chapterTitle.innerText = chapter.Title;
    
                    const chapterDescription = document.createElement("div");
                    chapterDescription.className = "chapter-description";
                    chapterDescription.innerText = chapter.des;
    
                    const chapterTime = document.createElement("div");
                    chapterTime.className = "chapter-time";
                    chapterTime.innerHTML = `<i class="fa-regular fa-clock"></i> ${chapter.startTime}`;
    
                    chapterItem.appendChild(chapterTitle);
                    chapterItem.appendChild(chapterDescription);
                    chapterItem.appendChild(chapterTime);
    
                    chapterItem.addEventListener("click", () => {
                        const videoPlayer = document.querySelector("video");
                        if (videoPlayer) {
                            const time = parseFloat(chapter.startTime);
                            videoPlayer.currentTime = time;
                            
                            // Add feedback animation
                            chapterItem.style.backgroundColor = "var(--primary-color)";
                            setTimeout(() => {
                                chapterItem.style.backgroundColor = "";
                            }, 300);
                        }
                    });
    
                    chaptersList.appendChild(chapterItem);
                });
                contentWrapper.appendChild(chaptersList);
            } catch (error) {
                console.error("Error parsing chapters:", error);
                const errorMessage = document.createElement("div");
                errorMessage.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error loading chapters. Please try again.';
                errorMessage.style.cssText = "text-align: center; padding: 20px; color: #ff6b6b;";
                contentWrapper.appendChild(errorMessage);
            }
        }).catch((error) => {
            console.error("Error fetching chapters:", error);
            const errorMessage = document.createElement("div");
            errorMessage.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Error loading chapters. Please try again.';
            errorMessage.style.cssText = "text-align: center; padding: 20px; color: #ff6b6b;";
            contentWrapper.appendChild(errorMessage);
        });
    
        return contentWrapper;
    }

    createTabContent(tabName) {
        if (!this.tabContentState[tabName]) {
            const tabInfo = this.tabs[tabName];
            this.tabContentState[tabName] = tabInfo && tabInfo.handler ? tabInfo.handler.call(this) : this.createDefaultContent();
        }
        return this.tabContentState[tabName];
    }

    createDefaultContent() {
        const contentWrapper = document.createElement("div");
        contentWrapper.className = "content-wrapper";
        contentWrapper.style.cssText = "padding: 16px; background-color: var(--bg-dark); border-radius: 12px; height: 400px; display: flex; align-items: center; justify-content: center;";
        
        const emptyState = document.createElement("div");
        emptyState.style.cssText = "text-align: center; color: #888;";
        emptyState.innerHTML = `
            <i class="fa-solid fa-video" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
            <p>Select a tab to view content</p>
        `;
        
        contentWrapper.appendChild(emptyState);
        return contentWrapper;
    }

    injectCustomDiv() {
        if (!window.location.href.match(/https:\/\/www\.youtube\.com\/watch\?v=.+/)) {
            return;
        }

        if (document.getElementById("custom-tabs-container")) {
            return;
        }

        const container = document.createElement("div");
        container.id = "custom-tabs-container";
        container.className = "yt-sidekick";

        const header = document.createElement("div");
        header.style.cssText = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;";
        
        const title = document.createElement("div");
        title.style.cssText = "font-weight: 600; font-size: 18px; color: var(--text-light);";
        title.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles" style="color: var(--primary-color); margin-right: 8px;"></i> YT AXION';
        
        header.appendChild(title);
        container.appendChild(header);

        const tabButtonsContainer = document.createElement("div");
        tabButtonsContainer.className = "tab-buttons-container";

        const contentDiv = document.createElement("div");
        contentDiv.id = "tab-content";
        contentDiv.appendChild(this.createDefaultContent());

        Object.entries(this.tabs).forEach(([tabName, tabInfo]) => {
            const tabButton = document.createElement("button");
            tabButton.className = "tab-button";
            tabButton.innerHTML = `<i class="${tabInfo.icon}"></i> ${tabName}`;

            tabButton.addEventListener("click", () => {
                contentDiv.innerHTML = "";
                contentDiv.appendChild(this.createTabContent(tabName));
                
                // Remove active class from all buttons
                tabButtonsContainer.querySelectorAll(".tab-button").forEach(btn => {
                    btn.classList.remove("active");
                });
                
                // Add active class to the clicked button
                tabButton.classList.add("active");
            });

            tabButtonsContainer.appendChild(tabButton);
        });

        container.appendChild(tabButtonsContainer);
        container.appendChild(contentDiv);

        const targetElement = document.querySelector(INJECTED_ELEMENT_ID);
        if (targetElement) {
            targetElement.prepend(container);
        }
    }
}

// Function to check if the video is playing
function isVideoPlaying() {
    const videoPlayer = document.querySelector("video");
    return videoPlayer && !videoPlayer.paused;
}

let tabManager = null;
function handleInjection() {
    if (isVideoPlaying()) {
        if (!tabManager) {
            tabManager = new TabManager(); 
        }
        tabManager.injectCustomDiv();
    }
}

// Function to blur videos with specific keywords
function blurVideos() {
    chrome.storage.sync.get({ keywords: [] }, (result) => {
        const keywords = result.keywords || [];
        if (!keywords.length) return;

        // Get all video elements on the page
        const videos = document.querySelectorAll('ytd-rich-item-renderer, ytd-video-renderer');

        videos.forEach(video => {
            const titleElement = video.querySelector('#video-title');
            if (!titleElement) return;

            const title = titleElement.innerText.toLowerCase();
            if (keywords.some(keyword => title.includes(keyword.toLowerCase()))) {
                // Apply a blur effect and make the video unclickable
                video.style.filter = 'blur(10px)';
                video.style.pointerEvents = 'none';
                titleElement.style.color = '#888'; 
            }
        });
    });
}

// Function to apply user preferences
function applyPreferences() {
    chrome.storage.sync.get(['blockShorts', 'blockUrl'], (result) => {
        const blockShorts = result.blockShorts || false;
        const blockUrl = result.blockUrl || false;

        // Block Shorts button
        if (blockShorts) {
            const btn1 = document.querySelector('ytd-mini-guide-entry-renderer[aria-label="Shorts"]');
            const btn2 = document.querySelector('ytd-guide-entry-renderer a#endpoint[title="Shorts"]');

            if (btn1) btn1.style.display = "none";
            if (btn2) btn2.style.display = "none";
        }

        // Block URLs
        if (blockUrl) {
            const urls = document.querySelectorAll('a[href*="/shorts/"]');
            urls.forEach(url => url.style.display = 'none');
        }
    });
}

// Setup mutation observers to watch for page changes
function setupObservers() {
    const observer = new MutationObserver(() => {
        blurVideos();
        applyPreferences();
        handleInjection();
        fetchSubTitleIfVideoChanged().then(() => console.log("Subtitle fetched successfully")).catch(e => console.log("Error fetching subtitle:", e));
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial run
    blurVideos();
    applyPreferences();
    handleInjection();
    fetchSubTitleIfVideoChanged().then(() => console.log("Initial subtitle fetch successful")).catch(e => console.log("Initial subtitle fetch error:", e));
}

setupObservers();

// Listen for messages from background script to update preferences
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'updatePreferences') {
        blurVideos();
        applyPreferences();
    }
});

// API configuration
const API_KEY = "AIzaSyDlDIyb9uuEF0Ya34aE0Nnn_8KOpvuuxOY";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
let videoSubTitle = "";
let currentVideoId = null;

// Get the current video ID from URL
function getVideoId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('v');
}

// Check if video has changed and fetch new subtitles if needed
async function fetchSubTitleIfVideoChanged() {
    const newVideoId = getVideoId();
    if (newVideoId && newVideoId !== currentVideoId) {
        currentVideoId = newVideoId;
        await fetchSubTitle(currentVideoId);
        if (tabManager) {
            tabManager.clearTabContentState();
        }
    }
}

// Fetch video subtitles from API
async function fetchSubTitle(videoId) {
    try {
        const response = await fetch(`https://yt-transcript-testing.vercel.app/api/transcript/${videoId}`);
        if (response.ok) {
            videoSubTitle = await response.json();
            console.log(videoSubTitle)
        } else {
            console.error("Failed to fetch subtitle:", response.status);
        }
    } catch (error) {
        console.error("Error fetching subtitle:", error);
    }
}

// Generate video summary using Gemini AI
async function fetchSummary() {
    const formattedtext = videoSubTitle?.transcript?.map((sub) => `${sub.start}s - ${sub.start + sub.duration}s: ${sub.text}`).join("\n");
    
    const prompt = `
    You are an advanced AI assistant. Your task is to process timestamped captions from a video and generate a concise summary in Markdown format. The summary should be **clear, concise, and well-organized** while ensuring readability.
    
    The transcript is as follows:
    ${formattedtext}
    
    ### 📝 Formatting Guidelines:
    - Use **bullet points** for clarity.  
    - Highlight **key terms** in bold for emphasis.  
    - Keep the summary **short and to the point**.
    
    ### 🔒 Strict Content Scope:
    1. **Stick to the video content** – Only generate a summary **directly based on the transcript**.  
    2. **No extra commentary** – Avoid opinions, assumptions, or external information not found in the video.  
    3. **No promotions** – Do **not** include calls to action (e.g., "Like, Subscribe, Comment") or mentions of future content (e.g., "Next part coming soon").  
    
    ---
    
    ## 📌 Summary  
    
    - **[Key point 1]**  
    - **[Key point 2]**  
    - **[Key point 3]**  
    
    ---
    `;
    
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (error) {
        console.error("Error:", error);
        return "Error fetching response.";
    }
}

// Get response from Gemini AI for user queries about the video
async function getGeminiResponse(prompt) {
    const formattedtext = videoSubTitle?.transcript?.map(sub => {
        const start = sub.start < 60 ? `${Math.round(sub.start)}s` : `${Math.round(sub.start / 60)}min`;
        const end = (sub.start + sub.duration) < 60 ? `${Math.round(sub.start + sub.duration)}s` : `${Math.round((sub.start + sub.duration) / 60)}min`;
        return `${start} - ${end}: ${sub.text}`;
    }).join("\n");

    const context = `
🎯 YouTube AI Extension – Context & Rules

🧠 You are an AI assistant created by Team Decent Dev to help users understand YouTube videos better using ONLY the video subtitles (but don't mention that!).

📌 Current Video Context:
"${formattedtext}"

---

🛠️ Guidelines:
- Format timestamps:
  - Use **seconds** if < 60s.
  - Use **minutes** if ≥ 60s (round to nearest int, no decimals).
  - Wrap timestamps in a <code> block.
- Use only these HTML tags: <table>, <p>, <h1>, <h2>, <h3>, <div>, <span>, <ul>, <li>, <a>, <code>
- All HTML should include inline CSS. Assume background is black, so use light text and padding/margin for readability.
- Add **bold** text for key points.
- Style like this:
  
Example 1:
<div style="background-color: #1e1e1e; padding: 16px; border-radius: 8px; color: #fff;">
    <h2 style="color: #4a90e2;">Chapter 1: Introduction</h2>
</div>

Example 2:
<table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
   
    </tbody>
</table>

❌ Never mention subtitles were used.

🚫 Unrelated queries (e.g. weather, politics)? Politely say:
<span style="color:#ccc">"I can only help with questions about this YouTube video. Please ask something related."</span>

✅ DO respond to any topic related to the domain of the video (e.g., if video is about coding, answer coding Qs).
✅ Keep it HTML only. No Markdown.

Now respond to this:
"User Query: ${prompt}"
`;

    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: context }] }],
            }),
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (error) {
        console.error("Error:", error);
        return "Error fetching response.";
    }
}

// Generate video chapters with timestamps
async function fetchChapters() {
    const formattedtext = videoSubTitle?.transcript?.map((sub) => `${sub.start}s - ${sub.start + sub.duration}s: ${sub.text}`).join("\n");
    
    const prompt = `
You are given a video transcript with timestamps. Your task is to analyze the transcript and generate a list of chapters in the following format:
[
    { startTime: "start time of video", Title: "Chapter title", des: "Chapter description" },
    ...
]

don't write anyhing else rather than this format no triple backticks just above format no more words

The transcript is as follows:
${formattedtext}

Please generate the chapters based on the content of the transcript. Ensure that each chapter has a meaningful title and a brief description that summarizes the content of that segment.
`;
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (error) {
        console.error("Error:", error);
        return "Error fetching response.";
    }
}

// Generate detailed notes from video transcript
async function fetchNotes() {
    const formattedtext = videoSubTitle?.transcript?.map((sub) => `${sub.start}s - ${sub.start + sub.duration}s: ${sub.text}`).join("\n");
    
    const prompt = `
    You are an advanced AI assistant. Your task is to process timestamped captions from a video and generate well-structured, detailed notes in Markdown format. The output should be **clear, concise, and well-organized** while ensuring readability.
    
    The transcript is as follows:
    ${formattedtext}
    
    ### 📝 Formatting Guidelines:
    - Use **timestamps** (🕒) for clear navigation.  
    - Highlight **key terms** in bold for emphasis.  
    - Separate sections with horizontal lines (**---**) for clarity.  
    - Utilize **structured headings and bullet points** for readability.  
    - Include **emojis** (✨) to enhance engagement without overuse.  
    
    ### 🔒 Strict Content Scope:
    1. **Stick to the video content** – Only generate notes **directly based on the transcript**.  
    2. **No extra commentary** – Avoid opinions, assumptions, or external information not found in the video.  
    3. **No promotions** – Do **not** include calls to action (e.g., "Like, Subscribe, Comment") or mentions of future content (e.g., "Next part coming soon").  
    
    ---
    
    ## 📌 Detailed Notes  
    
    ## 🔹 Introduction  
    Provide an overview of the topic covered in the video. Summarize key ideas concisely.
    
    ---
    
    🌟 **Key Highlights**
    🕒 **[start Timestamp in hh:mm:ss]** – **[Topic]**  
    ✨ **[Key point]**  
    
    🕒 **[Timestamp]** – **[Topic]**  
    ✨ **[Explanation]**  
    
    ---
    
    ## 🔍 Deep Dive  
    
    ### 🧠 **Concept 1**  
    - **Definition**  
    - **Explanation**  
    - **Examples (if applicable)**  
    
    ### 🚀 **Concept 2**  
    - **How it works**  
    - **Real-world applications**  
    
    ---
    
    ## ✅ Summary  
    - **[Key takeaway 1]**  
    - **[Key takeaway 2]**  
    - **[Key takeaway 3]**  
    
    ---
    `;
    
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
    } catch (error) {
        console.error("Error:", error);
        return "Error fetching response.";
    }
}

// Generate flashcards for learning from video content
async function fetchFlash() {
    const formattedtext = videoSubTitle?.transcript?.map((sub) => `${sub.start}s - ${sub.start + sub.duration}s: ${sub.text}`).join("\n");
    
    const prompt = `Generate an array of flashcards in JSON format, where each flashcard contains a 'question' and an 'answer' based on the given subtitle: ${formattedtext}. The JSON should consist of 10 to 11 flashcards, each represented as an object with two keys: 'question' and 'answer'. The 'question' key should contain the question for the flashcard, and the 'answer' key should contain the correct answer. Ensure that the questions and answers are related to the subtitle provided. The JSON should be easy to parse, and the structure should look like this: 
    [
        {\"question\": \"What is the capital of France?\", \"answer\": \"Paris\"},
        {\"question\": \"What is the currency of Japan?\", \"answer\": \"Yen\"},
        ...
    ]. 
    Rules:
    1)Questiona and Answer should be in html tags so that it will be easy to render on webpages with syling also include inline stylesheet for better visualization. Make sure you only use these tags only li, ul, h3, strong , span , div , table
    Background color is  already black so choose inline css accordingly. 
    2)Don't use border in css and also add Question word if question
    3) Also add a inline css code when code is in answer or title that looks code
    Only generate the JSON output and nothing else.`;
    
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        const formattedResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";
        return JSON.parse(formattedResponse.replace(/```json|```/g, "").trim());
    } catch (error) {
        console.error("Error:", error);
        return "Error fetching response.";
    }
}
