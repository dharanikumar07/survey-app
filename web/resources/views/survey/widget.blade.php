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
            overflow: hidden;
        }

        .th-sf-survey-container {
            padding: 32px;
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
        .th-sf-survey-number-option.hovered {
            border-color: #2c6ecb !important;
        // background-color: #e6f0ff !important;
            transform: scale(1.1);
        }
        .th-sf-survey-rating-option.hovered {
            color: #ffd700;
            transform: scale(1.1);
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
<div class="th-sf-survey-container">
    @php
        $surveyHtmlContent = $survey->getSurveyHtmlContent();
        if (!empty($surveyHtmlContent)) {
            $surveyHtmlContent = preg_replace('#<script(.*?)>(.*?)</script>#is', '', $surveyHtmlContent);
        }
    @endphp
    {!! $surveyHtmlContent !!}
</div>
<script>

    let surveyData = @json($surveyData);
    let selectedView = 'desktop';
    let currentQuestionIndex = 0;
    let answersStoreFront = {};

    let questionContent = null;
    let prevButton = null;
    let nextButton = null;
    let progressIndicators = null;

    initSurvey();

    function initSurvey() {
        questionContent = document.getElementById('question-content');
        prevButton = document.getElementById('prev-button');
        nextButton = document.getElementById('next-button');
        progressIndicators = document.getElementById('progress-indicators');

        if (questionContent && prevButton && nextButton && progressIndicators) {
            renderProgressIndicators();
            renderQuestion();
            updateNavigationButtons();

            nextButton.addEventListener('click', goToNext);
            prevButton.addEventListener('click', goToPrevious);
        } else {
            setTimeout(initSurvey, 100);
        }
    }

    function renderProgressIndicators() {
        if (!progressIndicators || !surveyData) return;
        console.log(surveyData.questions)
        progressIndicators.innerHTML = '';
        surveyData.questions.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `th-sf-survey-progress-dot ${index <= currentQuestionIndex ? 'active' : ''}`;
            progressIndicators.appendChild(dot);
        });
    }

    function renderQuestion() {
        if (!questionContent || !surveyData) return;

        if (currentQuestionIndex >= surveyData.questions.length) {
            renderThankYou();
            return;
        }

        const question = surveyData.questions[currentQuestionIndex];
        console.log("question in recent log" , question.type);
        let questionHTML = `
                <h3 class="th-sf-survey-question-heading">${question.heading}</h3>
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
        console.log("questionHTML rendered");

        if (question.type === 'rating') {
            questionHTML += renderRatingQuestion(question);
        } else if (question.type === 'satisfaction') {
            questionHTML += renderSatisfactionQuestion(question);
        } else if (question.type === 'number-scale') {
            questionHTML += renderNumberScaleQuestion(question);
        } else if (question.type === 'multiple-choice') {
            questionHTML += renderMultipleChoiceQuestion(question);
        } else if (question.type === 'text') {
            questionHTML += renderTextQuestion(question);
        }

        questionHTML += `
                    </div>
                </div>
            `;

        questionContent.innerHTML = questionHTML;

        addQuestionEventListeners();
    }

    function renderRatingQuestion(question) {
        const storedValue = answersStoreFront[currentQuestionIndex];
        const currentRating = parseInt(
            typeof storedValue === 'object' ? storedValue?.rating : storedValue || '0',
            10
        );

        let emoji = '😐';
        let ratingText = 'Not likely';

        if (currentRating >= 4) {
            emoji = '🤩';
            ratingText = 'Love it';
        } else if (currentRating >= 3) {
            emoji = '😊';
            ratingText = 'Like it';
        } else if (currentRating >= 2) {
            emoji = '😐';
            ratingText = 'Neutral';
        } else if (currentRating >= 1) {
            emoji = '😕';
            ratingText = 'Dislike it';
        }

        let html = `
        <div class="th-sf-survey-rating-emoji" style="font-size: 48px; text-align: center;">${emoji}</div>
        <p class="th-sf-survey-rating-text" style="text-align: center; margin: 0; font-size: 16px; color: #6d7175;">${ratingText}</p>
        <div class="th-sf-survey-rating-scale">
            <div style="display: flex; justify-content: center; gap: ${selectedView === 'mobile' ? '4px' : '8px'}; width: 100%;">
    `;

        for (let i = 1; i <= 5; i++) {
            const isSelected = i <= currentRating; // Fill all stars up to the selected rating
            html += `
            <button class="th-sf-survey-rating-option ${isSelected ? 'selected' : ''}"
                    data-rating="${i}"
                    style="width: ${selectedView === 'mobile' ? '32px' : '40px'};
                           height: ${selectedView === 'mobile' ? '32px' : '40px'};">
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


    function renderNumberScaleQuestion(question) {
        const storedValue = answersStoreFront[currentQuestionIndex];
        const type = question.type;
        const currentRating = parseInt(
            typeof storedValue === 'object' ? storedValue?.[type] : storedValue || '0',
            10
        );

        let ratingText = '';
        switch (currentRating) {
            case 5: ratingText = 'Excellent'; break;
            case 4: ratingText = 'Very Good'; break;
            case 3: ratingText = 'Good'; break;
            case 2: ratingText = 'Fair'; break;
            case 1: ratingText = 'Poor'; break;
            default: ratingText = 'Select your rating';
        }

        let html = `
        <div class="th-sf-survey-number-scale">
            <p class="th-sf-survey-rating-text" style="text-align: center; margin: 0 0 10px 0; font-size: 16px; color: #6d7175;">${ratingText}</p>
            <div style="display: flex; justify-content: center; gap: ${selectedView === 'mobile' ? '4px' : '8px'}; width: 100%;">
    `;

        for (let i = 1; i <= 5; i++) {
            const isSelected = i <= currentRating;
            html += `
            <button class="th-sf-survey-number-option ${isSelected ? 'selected' : ''}"
                    data-rating="${i}"
                    style="width: ${selectedView === 'mobile' ? '32px' : '40px'};
                           height: ${selectedView === 'mobile' ? '32px' : '40px'};
                           border: 2px solid;
                           border-color: ${isSelected ? '#2c6ecb' : '#ccc'};
                           border-radius: 50%;
                           background: ${isSelected ? '#2c6ecb' : 'white'};
                           color: ${isSelected ? 'white' : '#000'};
                           font-size: ${selectedView === 'mobile' ? '14px' : '16px'};
                           cursor: pointer;
                           transition: all 0.2s ease;
                           font-weight: ${isSelected ? '600' : '400'};">
                ${i}
            </button>
        `;
        }

        html += `
            </div>
            <div style="display: flex; justify-content: space-between; width: 100%; max-width: 300px; font-size: 14px; color: #6d7175; margin-top: 10px;">
                <span>Poor</span>
                <span>Excellent</span>
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
        const type = question.type;
        satisfactionOptions.forEach((option, index) => {
            const isSelected = answersStoreFront[currentQuestionIndex]?.[type] === option.value;
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

    function renderMultipleChoiceQuestion(question) {
        let html = `
                <div class="th-sf-survey-multiple-choice-container">
            `;

        question.answers.forEach((option) => {
            const isSelected = answersStoreFront[currentQuestionIndex]?.multipleChoice === option.content;
            html += `
                    <div class="th-sf-survey-multiple-choice-option ${isSelected ? 'selected' : ''}"
                         data-option="${option.content}">
                        <div class="th-sf-survey-multiple-choice-radio"></div>
                        <span class="th-sf-survey-multiple-choice-text">${option.content}</span>
                    </div>
                `;
        });

        html += '</div>';
        return html;
    }

    function renderTextQuestion(question) {
        return `
                <div class="th-sf-survey-text-input-container" style="width: 100%; max-width: 500px; padding: 10px;">
                    <textarea class="th-sf-survey-text-input-field"
                              placeholder="Type your answer here..."
                              style="border: 1px solid #ccc; border-radius: 4px; padding: 10px; min-height: 80px; background: #fff; cursor: text; width: 100%; resize: vertical; font-family: inherit;">${answersStoreFront[currentQuestionIndex] || ''}</textarea>
                </div>
            `;
    }

    function addQuestionEventListeners() {
        const ratingOptions = document.querySelectorAll('[data-rating]');
        ratingOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const rating = e.target.closest('[data-rating]')?.dataset.rating;
                handleRatingSelect(rating);
            });
        });

        const multipleChoiceOptions = document.querySelectorAll('[data-option]');

        multipleChoiceOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                const optionText = e.target.closest('[data-option]').dataset.option;
                handleMultipleChoiceSelect(optionText);
            });
        });

        const textInput = document.querySelector('.th-sf-survey-text-input-field');
        if (textInput) {
            textInput.addEventListener('input', (e) => {
                handleTextInput(e.target.value);
            });
        }
    }

    function handleRatingSelect(rating) {
        const question = surveyData.questions[currentQuestionIndex];
        const questionType = question.type;

        answersStoreFront[currentQuestionIndex] = {
            ...answersStoreFront[currentQuestionIndex],
            [questionType]: rating
        };
        updateQuestionDisplay();
        updateNavigationButtons();

    }

    function handleMultipleChoiceSelect(optionText) {
        answersStoreFront[currentQuestionIndex] = {...answersStoreFront[currentQuestionIndex], multipleChoice: optionText};
        updateQuestionDisplay();
        updateNavigationButtons();
    }

    function handleTextInput(value) {
        answersStoreFront[currentQuestionIndex] = value;
        updateNavigationButtons();
    }

    function updateQuestionDisplay() {
        renderQuestion();
    }

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

    function isQuestionComplete() {
        if (currentQuestionIndex >= surveyData.questions.length) return true;

        const answer = answersStoreFront[currentQuestionIndex];
        if (!answer) return false;

        const question = surveyData.questions[currentQuestionIndex];

        if (question.type === 'rating') {
            return answer.rating || answer.option || answer.multipleChoice;
        }

        return true;
    }

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
    }

    function goToNext() {
        if (currentQuestionIndex < surveyData.questions.length) {
            currentQuestionIndex++;
            renderQuestion();
            renderProgressIndicators();
            updateNavigationButtons();
        } else if (currentQuestionIndex === surveyData.questions.length) {
            const backendUrl = surveyData.backend_url;
            const uuid = surveyData.uuid;
            fetch(`${backendUrl}/api/surveyResponse/${uuid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${shopifyAccessToken}`
                },
                body: JSON.stringify({
                    answers: answersStoreFront
                })
            })
                .then(res => res.json())
                .then(data => {
                    console.log('Survey response saved:', data);
                })
                .catch(err => {
                    console.error('Error saving survey:', err);
                });

            currentQuestionIndex = 0;
            answersStoreFront = {};
            renderQuestion();
            renderProgressIndicators();
            updateNavigationButtons();
        }
    }

    function goToPrevious() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
            renderProgressIndicators();
            updateNavigationButtons();
        }
    }

    function listenResizeObserver() {
        const target = document.body;
        if (!target) return;

        if ('ResizeObserver' in window) {
            const resizeObserver = new ResizeObserver(() => {
                updateHeight();
            });

            resizeObserver.observe(target);

            updateHeight();
        } else {
            console.warn("ResizeObserver is not supported in this browser.");
        }
    }

    function updateHeight() {
        const height = document.body.scrollHeight + 15;
        const width = document.body.scrollWidth;

        window.parent.postMessage({
            type: 'survey-widget-height',
            height: height,
            width: width
        }, '*');
    }

    function initializeSurvey() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initSurvey);
        } else {
            setTimeout(initSurvey, 100);
        }
    }

    initializeSurvey();

    document.addEventListener('DOMContentLoaded', () => {
        listenResizeObserver();
    });
</script>
<script src="{{ asset('assets/js/survey-widget.js') }}"></script>
</body>
</html>
