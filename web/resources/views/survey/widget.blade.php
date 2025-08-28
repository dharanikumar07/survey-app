<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Survey #1</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f6f6f7;
            overflow: hidden;
        }

        .th-sf-survey-container {
            padding: 16px;
            background: #f6f6f7;
            height: 100vh;
            overflow: hidden;
        }

        .th-sf-survey-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
            align-items: center;
            height: 100%;
            max-height: calc(100vh - 100px);
            overflow-y: auto;
            overflow-x: hidden;
        }

        .th-sf-survey-card {
            background: white;
            border-radius: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            width: 100%;
            max-width: 375px;
            border: none;
            position: relative;
            margin: 0 auto;
        }

        .th-sf-survey-card-content {
            display: flex;
            flex-direction: column;
            gap: 24px;
            align-items: center;
            padding: 16px;
        }

        .th-sf-survey-question-area {
            padding-top: 24px;
            width: 100%;
            position: relative;
            overflow: hidden;
        }

        .th-sf-survey-question-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
            align-items: center;
            animation: slideIn 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .th-sf-survey-question-heading {
            font-size: 20px;
            font-weight: 600;
            margin: 0;
            color: #202223;
            text-align: center;
            padding: 0 16px;
        }

        .th-sf-survey-question-description {
            font-size: 14px;
            margin: 0;
            color: #6d7175;
            text-align: center;
            padding: 0 16px;
        }

        .th-sf-survey-answer-area {
            padding-top: 16px;
            padding-bottom: 16px;
            width: 100%;
        }

        .th-sf-survey-answer-content {
            display: flex;
            flex-direction: column;
            gap: 16px;
            align-items: center;
        }

        .th-sf-survey-rating-scale {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            width: 100%;
            padding-top: 10px;
        }

        .th-sf-survey-rating-option {
            width: 32px;
            height: 32px;
            border: none;
            background: transparent;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 24px;
            color: #ddd;
        }

        .th-sf-survey-rating-option:hover {
            color: #ffd700;
            transform: scale(1.1);
        }

        .th-sf-survey-rating-option.selected {
            color: #ffd700;
            filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.5));
        }

        .th-sf-survey-multiple-choice-container {
            width: 100%;
            max-width: 320px;
            padding: 8px;
        }

        .th-sf-survey-multiple-choice-option {
            border: 2px solid #ccc;
            border-radius: 12px;
            padding: 12px 16px;
            margin-bottom: 8px;
            background: #fff;
            cursor: pointer;
            display: flex;
            align-items: center;
            transition: all 0.2s ease;
        }

        .th-sf-survey-multiple-choice-option:hover {
            background: #f8f9fa;
            border-color: #999;
            transform: scale(1.02);
        }

        .th-sf-survey-multiple-choice-option.selected {
            border-color: #2c6ecb;
            background: #f1f8ff;
            transform: scale(1.02);
        }

        .th-sf-survey-multiple-choice-radio {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 2px solid #ccc;
            margin-right: 16px;
            background: transparent;
            position: relative;
        }

        .th-sf-survey-multiple-choice-option.selected .th-sf-survey-multiple-choice-radio {
            border-color: #2c6ecb;
            background: #2c6ecb;
        }

        .th-sf-survey-multiple-choice-option.selected .th-sf-survey-multiple-choice-radio::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
        }

        .th-sf-survey-navigation {
            border-top: 1px solid #e1e3e5;
            padding-top: 16px;
            width: 100%;
        }

        .th-sf-survey-navigation-content {
            display: flex;
            justify-content: space-between;
            width: 100%;
            padding: 0 24px 24px 24px;
        }

        .th-sf-survey-button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s ease;
        }

        .th-sf-survey-prev-button {
            background: #6d7175;
            color: white;
        }

        .th-sf-survey-prev-button:hover:not(:disabled) {
            background: #5a5a5a;
            transform: scale(1.05);
        }

        .th-sf-survey-prev-button:disabled {
            background: #f1f1f1;
            color: #999;
            cursor: not-allowed;
            opacity: 0.5;
        }

        .th-sf-survey-next-button {
            background: #1a1a1a;
            color: white;
        }

        .th-sf-survey-next-button:hover:not(:disabled) {
            background: #333;
            transform: scale(1.05);
        }

        .th-sf-survey-next-button:disabled {
            background: #ccc;
            cursor: not-allowed;
            opacity: 0.6;
        }

        .th-sf-survey-progress-indicators {
            display: flex;
            gap: 4px;
        }

        .th-sf-survey-progress-dot {
            width: 8px;
            height: 8px;
            background: #ddd;
            border-radius: 50%;
            transition: background 0.2s ease;
        }

        .th-sf-survey-progress-dot.active {
            background: #000;
        }

        .th-sf-survey-thank-you-card {
            display: flex;
            flex-direction: column;
            gap: 16px;
            align-items: center;
            text-align: center;
            padding-top: 24px;
            padding-bottom: 24px;
        }

        .th-sf-survey-thank-you-heading {
            font-size: 24px;
            font-weight: 600;
            margin: 0;
            color: #202223;
        }

        .th-sf-survey-thank-you-description {
            font-size: 16px;
            margin: 0;
            color: #6d7175;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        /* Mobile device frame indicator */
        .th-sf-survey-card.mobile-view::before {
            content: '';
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 6px;
            background: #1a1a1a;
            border-radius: 3px;
            z-index: 1;
        }

        /* Scrollbar styles */
        .th-sf-survey-content::-webkit-scrollbar {
            width: 8px;
        }

        .th-sf-survey-content::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 4px;
        }

        .th-sf-survey-content::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 4px;
        }

        .th-sf-survey-content::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
    </style>
</head>
<body>
<div class="th-sf-survey-container" style="padding: 32px; background: #f6f6f7; min-height: 100vh;">
    {!! $survey->getSurveyHtmlContent() !!}
</div>
<script>
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

        console.log

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
</script>
<script src="{{ asset('assets/js/survey-widget.js') }}"></script>
</body>
</html>
