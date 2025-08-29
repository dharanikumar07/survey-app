(function () {
    // Survey data and state - will be initialized from parent
    let surveyData = null;
    let selectedView = 'desktop';
    let currentQuestionIndex = 0;
    let answers = {};

    // DOM elements
    let questionContent = null;
    let prevButton = null;
    let nextButton = null;
    let progressIndicators = null;

    // Communication with parent component
    function sendMessageToParent(type, data) {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({type, data}, '*');
        }
    }

    // Listen for messages from parent
    window.addEventListener('message', (event) => {
        const {type, data} = event.data;

        switch (type) {
            case 'INIT_SURVEY':
                surveyData = data.surveyData;
                selectedView = data.selectedView;
                currentQuestionIndex = data.initialQuestionIndex || 0;
                answers = {};
                initSurvey();
                sendMessageToParent('SURVEY_READY', {currentQuestionIndex});
                break;

            case 'SET_QUESTION_INDEX':
                currentQuestionIndex = data.questionIndex;
                renderQuestion();
                renderProgressIndicators();
                updateNavigationButtons();
                sendMessageToParent('QUESTION_CHANGED', {
                    currentQuestionIndex,
                    question: surveyData.questions[currentQuestionIndex]
                });
                break;

            case 'SET_ANSWERS':
                answers = {...answers, ...data.answers};
                updateQuestionDisplay();
                updateNavigationButtons();
                break;

            case 'RESET_SURVEY':
                currentQuestionIndex = 0;
                answers = {};
                renderQuestion();
                renderProgressIndicators();
                updateNavigationButtons();
                sendMessageToParent('NAVIGATION_CHANGED', {currentQuestionIndex});
                break;
        }
    });

    // Initialize the survey
    function initSurvey() {
        // Get DOM elements after they're available
        questionContent = document.getElementById('question-content');
        prevButton = document.getElementById('prev-button');
        nextButton = document.getElementById('next-button');
        progressIndicators = document.getElementById('progress-indicators');

        if (questionContent && prevButton && nextButton && progressIndicators) {
            renderProgressIndicators();
            renderQuestion();
            updateNavigationButtons();

            // Add navigation event listeners
            nextButton.addEventListener('click', goToNext);
            prevButton.addEventListener('click', goToPrevious);
        } else {
            // Wait for DOM to be ready
            setTimeout(initSurvey, 100);
        }
    }

    // Render progress indicators
    function renderProgressIndicators() {
        if (!progressIndicators || !surveyData) return;

        progressIndicators.innerHTML = '';
        surveyData.questions.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `th-sf-survey-progress-dot ${index <= currentQuestionIndex ? 'active' : ''}`;
            progressIndicators.appendChild(dot);
        });
    }

    // Render current question
    function renderQuestion() {
        if (!questionContent || !surveyData) return;

        if (currentQuestionIndex >= surveyData.questions.length) {
            renderThankYou();
            return;
        }

        const question = surveyData.questions[currentQuestionIndex];
        let questionHTML = `
                <h3 class="th-sf-survey-question-heading">${question.content}</h3>
            `;

        if (question.description) {
            questionHTML += `
                    <p class="th-sf-survey-question-description">${question.description}</p>
                `;
        }

        questionHTML += `
                <div class="th-sf-survey-answer-area">
                    <div class="th-sf-survey-answer-content">
            `;

        // Render different question types
        if (question.type === 'rating') {
            questionHTML += renderRatingQuestion(question);
        } else if (question.type === 'satisfaction') {
            questionHTML += renderSatisfactionQuestion(question);
        } else if (question.type === 'number-scale') {
            questionHTML += renderNumberScaleQuestion(question);
        } else if (question.answerOptions && question.answerOptions.length > 0) {
            questionHTML += renderMultipleChoiceQuestion(question);
        } else if (question.type === 'text') {
            questionHTML += renderTextQuestion(question);
        }

        questionHTML += `
                    </div>
                </div>
            `;

        questionContent.innerHTML = questionHTML;

        // Add event listeners to the new elements
        addQuestionEventListeners();
    }

    // Render rating question
    function renderRatingQuestion(question) {
        let html = `
                <div class="th-sf-survey-rating-emoji" style="font-size: 48px; text-align: center;">😐</div>
                <p class="th-sf-survey-rating-text" style="text-align: center; margin: 0; font-size: 16px; color: #6d7175;">Not likely</p>
                <div class="th-sf-survey-rating-scale">
                    <div style="display: flex; justify-content: center; gap: ${selectedView === 'mobile' ? '4px' : '8px'}; width: 100%;">
            `;

        for (let i = 1; i <= 5; i++) {
            const isSelected = answers[currentQuestionIndex]?.rating === i.toString();
            html += `
                    <button class="th-sf-survey-rating-option ${isSelected ? 'selected' : ''}"
                            data-rating="${i}"
                            style="width: ${selectedView === 'mobile' ? '32px' : '40px'}; height: ${selectedView === 'mobile' ? '32px' : '40px'};">
                        ⭐
                    </button>
                `;
        }

        html += `
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 100%; max-width: 300px; font-size: 14px; color: #6d7175;">
                        <span>${question.leftLabel || 'Hate it'}</span>
                        <span>${question.rightLabel || 'Love it'}</span>
                    </div>
                </div>
            `;

        return html;
    }

    // Render satisfaction question
    function renderSatisfactionQuestion(question) {
        const satisfactionOptions = [
            {emoji: '😠', label: 'Not satisfied', value: '1'},
            {emoji: '😞', label: 'Dissatisfied', value: '2'},
            {emoji: '😐', label: 'Neutral', value: '3'},
            {emoji: '🙂', label: 'Satisfied', value: '4'},
            {emoji: '🥰', label: 'Very satisfied', value: '5'}
        ];

        let html = `
                <div class="th-sf-survey-satisfaction-scale">
                    <div style="display: flex; justify-content: center; gap: ${selectedView === 'mobile' ? '8px' : '16px'}; width: 100%;">
            `;

        satisfactionOptions.forEach((option, index) => {
            const isSelected = answers[currentQuestionIndex]?.rating === option.value;
            html += `
                    <button class="th-sf-survey-satisfaction-option ${isSelected ? 'selected' : ''}"
                            data-rating="${option.value}"
                            style="display: flex; flex-direction: column; align-items: center; gap: 8px; border: none; background: transparent; cursor: pointer; transition: all 0.2s ease; padding: 8px; border-radius: 8px;">
                        <div style="font-size: ${selectedView === 'mobile' ? '32px' : '48px'};">${option.emoji}</div>
                        <span style="font-size: 12px; color: ${isSelected ? '#2c6ecb' : '#6d7175'}; font-weight: ${isSelected ? '600' : '400'}; text-align: center;">${option.label}</span>
                    </button>
                `;
        });

        html += `
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 100%; max-width: 400px; font-size: 14px; color: #6d7175; margin-top: 8px;">
                        <span>${question.leftLabel || 'Not satisfied'}</span>
                        <span>${question.rightLabel || 'Very satisfied'}</span>
                    </div>
                </div>
            `;

        return html;
    }

    // Render number scale question
    function renderNumberScaleQuestion(question) {
        let html = `
                <div class="th-sf-survey-number-scale">
                    <div style="display: flex; justify-content: center; gap: ${selectedView === 'mobile' ? '4px' : '8px'}; width: 100%;">
            `;

        for (let i = 1; i <= 5; i++) {
            const isSelected = answers[currentQuestionIndex] === i.toString();
            html += `
                    <button class="th-sf-survey-number-option ${isSelected ? 'selected' : ''}"
                            data-rating="${i}"
                            style="width: ${selectedView === 'mobile' ? '32px' : '40px'}; height: ${selectedView === 'mobile' ? '32px' : '40px'}; border: 2px solid; border-color: ${isSelected ? '#2c6ecb' : '#ccc'}; border-radius: 50%; background: ${isSelected ? '#2c6ecb' : 'white'}; color: ${isSelected ? 'white' : '#000'}; font-size: ${selectedView === 'mobile' ? '14px' : '16px'}; cursor: pointer; transition: all 0.2s ease; font-weight: ${isSelected ? '600' : '400'};">
                        ${i}
                    </button>
                `;
        }

        html += `
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 100%; max-width: 300px; font-size: 14px; color: #6d7175;">
                        <span>Poor</span>
                        <span>Excellent</span>
                    </div>
                </div>
            `;

        return html;
    }

    // Render multiple choice question
    function renderMultipleChoiceQuestion(question) {
        let html = `
                <div class="th-sf-survey-multiple-choice-container">
            `;

        question.answerOptions.forEach((option) => {
            const isSelected = answers[currentQuestionIndex]?.multipleChoice === option.text;
            html += `
                    <div class="th-sf-survey-multiple-choice-option ${isSelected ? 'selected' : ''}"
                         data-option="${option.text}">
                        <div class="th-sf-survey-multiple-choice-radio"></div>
                        <span class="th-sf-survey-multiple-choice-text">${option.text}</span>
                    </div>
                `;
        });

        html += '</div>';
        return html;
    }

    // Render text question
    function renderTextQuestion(question) {
        return `
                <div class="th-sf-survey-text-input-container" style="width: 100%; max-width: 500px; padding: 10px;">
                    <textarea class="th-sf-survey-text-input-field"
                              placeholder="Type your answer here..."
                              style="border: 1px solid #ccc; border-radius: 4px; padding: 10px; min-height: 80px; background: #fff; cursor: text; width: 100%; resize: vertical; font-family: inherit;">${answers[currentQuestionIndex] || ''}</textarea>
                </div>
            `;
    }

    // Add event listeners to question elements
    function addQuestionEventListeners() {
        // Rating options
        const ratingOptions = document.querySelectorAll('[data-rating]');
        ratingOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const rating = e.target.dataset.rating;
                handleRatingSelect(rating);
            });
        });

        // Multiple choice options
        const multipleChoiceOptions = document.querySelectorAll('[data-option]');
        multipleChoiceOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const optionText = e.target.closest('[data-option]').dataset.option;
                handleMultipleChoiceSelect(optionText);
            });
        });

        // Text input
        const textInput = document.querySelector('.th-sf-survey-text-input-field');
        if (textInput) {
            textInput.addEventListener('input', (e) => {
                handleTextInput(e.target.value);
            });
        }
    }

    // Handle rating selection
    function handleRatingSelect(rating) {
        answers[currentQuestionIndex] = {...answers[currentQuestionIndex], rating};
        updateQuestionDisplay();
        updateNavigationButtons();

        // Sync with parent
        sendMessageToParent('ANSWER_SELECTED', {
            questionIndex: currentQuestionIndex,
            answer: answers[currentQuestionIndex],
            questionType: surveyData.questions[currentQuestionIndex].type
        });
    }

    // Handle multiple choice selection
    function handleMultipleChoiceSelect(optionText) {
        answers[currentQuestionIndex] = {...answers[currentQuestionIndex], multipleChoice: optionText};
        updateQuestionDisplay();
        updateNavigationButtons();

        // Sync with parent
        sendMessageToParent('ANSWER_SELECTED', {
            questionIndex: currentQuestionIndex,
            answer: answers[currentQuestionIndex],
            questionType: surveyData.questions[currentQuestionIndex].type
        });
    }

    // Handle text input
    function handleTextInput(value) {
        answers[currentQuestionIndex] = value;
        updateNavigationButtons();

        // Sync with parent
        sendMessageToParent('ANSWER_SELECTED', {
            questionIndex: currentQuestionIndex,
            answer: value,
            questionType: surveyData.questions[currentQuestionIndex].type
        });
    }

    // Update question display after selection
    function updateQuestionDisplay() {
        renderQuestion();
    }

    // Update navigation buttons
    function updateNavigationButtons() {
        const canGoNext = isQuestionComplete();
        const canGoPrev = currentQuestionIndex > 0;

        nextButton.disabled = !canGoNext;
        prevButton.style.display = canGoPrev ? 'block' : 'none';

        if (canGoNext) {
            nextButton.style.background = '#1a1a1a';
            nextButton.style.opacity = '1';
        } else {
            nextButton.style.background = '#ccc';
            nextButton.style.opacity = '0.6';
        }
    }

    // Check if current question is complete
    function isQuestionComplete() {
        if (currentQuestionIndex >= surveyData.questions.length) return true;

        const answer = answers[currentQuestionIndex];
        if (!answer) return false;

        const question = surveyData.questions[currentQuestionIndex];

        if (question.type === 'rating') {
            return answer.rating || answer.option || answer.multipleChoice;
        }

        return true;
    }

    // Render thank you message
    function renderThankYou() {
        if (!questionContent) return;

        questionContent.innerHTML = `
                <div class="th-sf-survey-thank-you-card">
                    <div style="display: flex; flex-direction: column; gap: 8px; align-items: center;">
                        <h3 class="th-sf-survey-thank-you-heading">Thank you for your feedback!</h3>
                        <p class="th-sf-survey-thank-you-description">We appreciate your time and input.</p>
                    </div>
                </div>
            `;

        if (nextButton) {
            nextButton.textContent = 'Submit';
        }
        if (prevButton) {
            prevButton.style.display = 'none';
        }

        // Send message to parent about survey completion
        sendMessageToParent('SURVEY_COMPLETE', {answers});
    }

    // Navigation functions
    function goToNext() {
        if (currentQuestionIndex < surveyData.questions.length) {
            currentQuestionIndex++;
            renderQuestion();
            renderProgressIndicators();
            updateNavigationButtons();

            // Sync with parent
            sendMessageToParent('NAVIGATION_CHANGED', {
                currentQuestionIndex,
                direction: 'next',
                question: surveyData.questions[currentQuestionIndex]
            });
        } else if (currentQuestionIndex === surveyData.questions.length) {
            // Submit survey
            alert('Survey submitted! Thank you for your feedback.');

            // Send completion message to parent
            sendMessageToParent('SURVEY_COMPLETE', {answers});

            // Reset to first question
            currentQuestionIndex = 0;
            answers = {};
            renderQuestion();
            renderProgressIndicators();
            updateNavigationButtons();

            sendMessageToParent('NAVIGATION_CHANGED', {
                currentQuestionIndex,
                direction: 'reset'
            });
        }
    }

    function goToPrevious() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
            renderProgressIndicators();
            updateNavigationButtons();

            // Sync with parent
            sendMessageToParent('NAVIGATION_CHANGED', {
                currentQuestionIndex,
                direction: 'previous',
                question: surveyData.questions[currentQuestionIndex]
            });
        }
    }

    // Initialize when DOM is ready
    function initializeSurvey() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSurvey);
        } else {
            // DOM is already ready
            setTimeout(initSurvey, 100);
        }
    }

    // Start initialization
    initializeSurvey();
})();
