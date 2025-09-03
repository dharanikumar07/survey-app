import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Box, Text } from '@shopify/polaris';

/**
 * SurveyIframe Component
 * 
 * This component renders the survey content inside an iframe to isolate
 * the DOM, CSS, and JavaScript from the parent React application.
 * 
 * The iframe will contain pure HTML with inline styles and vanilla JavaScript,
 * making it easy to embed in storefronts later.
 */
const SurveyIframe = forwardRef(({ surveyData, selectedView, onSurveyComplete }, ref) => {
    const iframeRef = useRef(null);
    const [iframeContent, setIframeContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // State to track iframe's internal state
    const [iframeState, setIframeState] = useState({
        currentQuestionIndex: 0,
        answers: {},
        isReady: false
    });

    // Generate the complete HTML content for the iframe
    const generateIframeContent = () => {
        const { questions, name } = surveyData;

        // Create the HTML structure with inline styles
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name || 'Survey'}</title>
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
        
        @keyframes checkmarkAnimation {
            0% {
                transform: scale(0);
                opacity: 0;
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        .th-sf-survey-checkmark {
            animation: checkmarkAnimation 0.5s ease-in-out forwards;
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
            border-radius: ${selectedView === 'mobile' ? '20px' : '8px'};
            box-shadow: ${selectedView === 'mobile'
                ? '0 4px 20px rgba(0, 0, 0, 0.15)'
                : '0 1px 3px rgba(0, 0, 0, 0.1)'};
            width: 100%;
            max-width: ${selectedView === 'mobile' ? '375px' : selectedView === 'maximize' ? '800px' : '600px'};
            border: none;
            position: relative;
            margin: 0 auto;
        }
        
        .th-sf-survey-card-content {
            display: flex;
            flex-direction: column;
            gap: 24px;
            align-items: center;
            padding: ${selectedView === 'mobile' ? '16px' : '0'};
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
            font-size: ${selectedView === 'mobile' ? '20px' : '24px'};
            font-weight: 600;
            margin: 0;
            color: #202223;
            text-align: center;
            padding: ${selectedView === 'mobile' ? '0 16px' : '0'};
        }
        
        .th-sf-survey-question-description {
            font-size: ${selectedView === 'mobile' ? '14px' : '16px'};
            margin: 0;
            color: #6d7175;
            text-align: center;
            padding: ${selectedView === 'mobile' ? '0 16px' : '0'};
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
            width: ${selectedView === 'mobile' ? '32px' : '40px'};
            height: ${selectedView === 'mobile' ? '32px' : '40px'};
            border: none;
            background: transparent;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: ${selectedView === 'mobile' ? '24px' : '32px'};
            color: #ddd;
        }
        
        .th-sf-survey-rating-option.hovered {
            color: #ffd700;
            transform: scale(1.1);
        }
        
        .th-sf-survey-rating-option:hover {
            color: #ffd700;
            transform: scale(1.1);
        }
        
        .th-sf-survey-rating-option.selected {
            color: #ffd700;
            filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.5));
        }
        
        /* Number scale hover effect */
        .th-sf-survey-number-option.hovered {
            border-color: #2c6ecb !important;
            // background-color: #e6f0ff !important;
            transform: scale(1.1);
        }
        
        .th-sf-survey-multiple-choice-container {
            width: 100%;
            max-width: ${selectedView === 'mobile' ? '320px' : '500px'};
            padding: ${selectedView === 'mobile' ? '8px' : '10px'};
        }
        
        .th-sf-survey-multiple-choice-option {
            border: 2px solid #ccc;
            border-radius: ${selectedView === 'mobile' ? '12px' : '8px'};
            padding: ${selectedView === 'mobile' ? '12px 16px' : '16px 20px'};
            margin-bottom: ${selectedView === 'mobile' ? '8px' : '12px'};
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
            font-size: 28px;
            font-weight: 600;
            margin: 0;
            color: #202223;
            opacity: 0;
            animation: fadeIn 0.5s ease-in-out 0.3s forwards;
        }
        
        .th-sf-survey-thank-you-description {
            font-size: 18px;
            margin: 0;
            color: #6d7175;
            opacity: 0;
            animation: fadeIn 0.5s ease-in-out 0.5s forwards;
        }
        
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
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
    <div class="th-sf-survey-container">
        <div class="th-sf-survey-content">
            <div class="th-sf-survey-card ${selectedView}-view">
                <div class="th-sf-survey-card-content">
                    <div class="th-sf-survey-question-area">
                        <div class="th-sf-survey-question-content" id="question-content">
                            <!-- Question content will be dynamically inserted here -->
                        </div>
                    </div>
                    
                    <div class="th-sf-survey-navigation">
                        <div class="th-sf-survey-navigation-content">
                            <button class="th-sf-survey-button th-sf-survey-prev-button" id="prev-button" style="display: none;">
                                Previous
                            </button>
                            
                            <div class="th-sf-survey-progress-indicators" id="progress-indicators">
                                <!-- Progress dots will be dynamically inserted here -->
                            </div>
                            
                            <button class="th-sf-survey-button th-sf-survey-next-button" id="next-button">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <script>
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
                window.parent.postMessage({ type, data }, '*');
            }
        }
        
        // Listen for messages from parent
        window.addEventListener('message', (event) => {
            const { type, data } = event.data;
            
            switch (type) {
                case 'INIT_SURVEY':
                    surveyData = data.surveyData;
                    selectedView = data.selectedView;
                    currentQuestionIndex = data.initialQuestionIndex || 0;
                    answers = {};
                    initSurvey();
                    sendMessageToParent('SURVEY_READY', { currentQuestionIndex });
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
                    answers = { ...answers, ...data.answers };
                    updateQuestionDisplay();
                    updateNavigationButtons();
                    break;
                    
                case 'RESET_SURVEY':
                    currentQuestionIndex = 0;
                    answers = {};
                    renderQuestion();
                    renderProgressIndicators();
                    updateNavigationButtons();
                    sendMessageToParent('NAVIGATION_CHANGED', { currentQuestionIndex });
                    break;
            }
        });
        
        // Initialize the survey
        function initSurvey() {
            // Check if surveyData is initialized
            if (!surveyData) {
                console.log('Survey data not yet initialized, waiting...');
                setTimeout(initSurvey, 100);
                return;
            }
            
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
            if (!progressIndicators || !surveyData || !surveyData.questions) return;
            
            progressIndicators.innerHTML = '';
            surveyData.questions.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = \`th-sf-survey-progress-dot \${index <= currentQuestionIndex ? 'active' : ''}\`;
                progressIndicators.appendChild(dot);
            });
        }
        
        // Render current question
        function renderQuestion() {
            if (!questionContent || !surveyData || !surveyData.questions) return;
            
            // If we're past the last question, show the thank you page
            if (currentQuestionIndex >= surveyData.questions.length) {
                renderThankYou();
                return;
            }
            
            const question = surveyData.questions[currentQuestionIndex];
            if (!question) return;
            
            let questionHTML = \`
                <h3 class="th-sf-survey-question-heading">\${question.content || 'Question'}</h3>
            \`;
            
            if (question.description) {
                questionHTML += \`
                    <p class="th-sf-survey-question-description">\${question.description}</p>
                \`;
            }
            
            questionHTML += \`
                <div class="th-sf-survey-answer-area">
                    <div class="th-sf-survey-answer-content">
            \`;
            
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
            
            questionHTML += \`
                    </div>
                </div>
            \`;
            
            questionContent.innerHTML = questionHTML;
            
            // Add event listeners to the new elements
            addQuestionEventListeners();
        }
        
        // Render rating question
        function renderRatingQuestion(question) {
            // Get the current rating if it exists
            const currentRating = parseInt(answers[currentQuestionIndex]?.rating || '0');
            
            // Update emoji and text based on rating
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
            
            let html = \`
                <div class="th-sf-survey-rating-emoji" style="font-size: 48px; text-align: center;">\${emoji}</div>
                <p class="th-sf-survey-rating-text" style="text-align: center; margin: 0; font-size: 16px; color: #6d7175;">\${ratingText}</p>
                <div class="th-sf-survey-rating-scale">
                    <div style="display: flex; justify-content: center; gap: \${selectedView === 'mobile' ? '4px' : '8px'}; width: 100%;">
            \`;
            
            for (let i = 1; i <= 5; i++) {
                const isSelected = i <= currentRating; // Fill all stars up to the selected rating
                html += \`
                    <button class="th-sf-survey-rating-option \${isSelected ? 'selected' : ''}" 
                            data-rating="\${i}" 
                            style="width: \${selectedView === 'mobile' ? '32px' : '40px'}; height: \${selectedView === 'mobile' ? '32px' : '40px'};">
                        ⭐
                    </button>
                \`;
            }
            
            html += \`
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 100%; max-width: 300px; font-size: 14px; color: #6d7175;">
                        <span>\${question.leftLabel || 'Hate it'}</span>
                        <span>\${question.rightLabel || 'Love it'}</span>
                    </div>
                </div>
            \`;
            
            return html;
        }
        
        // Render satisfaction question
        function renderSatisfactionQuestion(question) {
            const satisfactionOptions = [
                { emoji: '😠', label: 'Not satisfied', value: '1' },
                { emoji: '😞', label: 'Dissatisfied', value: '2' },
                { emoji: '😐', label: 'Neutral', value: '3' },
                { emoji: '🙂', label: 'Satisfied', value: '4' },
                { emoji: '🥰', label: 'Very satisfied', value: '5' }
            ];
            
            let html = \`
                <div class="th-sf-survey-satisfaction-scale">
                    <div style="display: flex; justify-content: center; gap: \${selectedView === 'mobile' ? '8px' : '16px'}; width: 100%;">
            \`;
            
            satisfactionOptions.forEach((option, index) => {
                const isSelected = answers[currentQuestionIndex]?.rating === option.value;
                html += \`
                    <button class="th-sf-survey-satisfaction-option \${isSelected ? 'selected' : ''}" 
                            data-rating="\${option.value}"
                            style="display: flex; flex-direction: column; align-items: center; gap: 8px; border: none; background: transparent; cursor: pointer; transition: all 0.2s ease; padding: 8px; border-radius: 8px;">
                        <div style="font-size: \${selectedView === 'mobile' ? '32px' : '48px'};">\${option.emoji}</div>
                        <span style="font-size: 12px; color: \${isSelected ? '#2c6ecb' : '#6d7175'}; font-weight: \${isSelected ? '600' : '400'}; text-align: center;">\${option.label}</span>
                    </button>
                \`;
            });
            
            html += \`
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 100%; max-width: 400px; font-size: 14px; color: #6d7175; margin-top: 8px;">
                        <span>\${question.leftLabel || 'Not satisfied'}</span>
                        <span>\${question.rightLabel || 'Very satisfied'}</span>
                    </div>
                </div>
            \`;
            
            return html;
        }
        
        // Render number scale question
        function renderNumberScaleQuestion(question) {
            // Get the current rating if it exists
            const currentRating = parseInt(answers[currentQuestionIndex] || '0');
            
            // Create a label based on the selected rating
            let ratingText = '';
            if (currentRating === 5) {
                ratingText = 'Excellent';
            } else if (currentRating === 4) {
                ratingText = 'Very Good';
            } else if (currentRating === 3) {
                ratingText = 'Good';
            } else if (currentRating === 2) {
                ratingText = 'Fair';
            } else if (currentRating === 1) {
                ratingText = 'Poor';
            } else {
                ratingText = 'Select your rating';
            }
            
            let html = \`
                <div class="th-sf-survey-number-scale">
                    <p class="th-sf-survey-rating-text" style="text-align: center; margin: 0 0 10px 0; font-size: 16px; color: #6d7175;">\${ratingText}</p>
                    <div style="display: flex; justify-content: center; gap: \${selectedView === 'mobile' ? '4px' : '8px'}; width: 100%;">
            \`;
            
            for (let i = 1; i <= 5; i++) {
                const isSelected = i <= currentRating; // Fill all numbers up to the selected rating
                html += \`
                    <button class="th-sf-survey-number-option \${isSelected ? 'selected' : ''}" 
                            data-rating="\${i}"
                            style="width: \${selectedView === 'mobile' ? '32px' : '40px'}; height: \${selectedView === 'mobile' ? '32px' : '40px'}; border: 2px solid; border-color: \${isSelected ? '#2c6ecb' : '#ccc'}; border-radius: 50%; background: \${isSelected ? '#2c6ecb' : 'white'}; color: \${isSelected ? 'white' : '#000'}; font-size: \${selectedView === 'mobile' ? '14px' : '16px'}; cursor: pointer; transition: all 0.2s ease; font-weight: \${isSelected ? '600' : '400'};">
                        \${i}
                    </button>
                \`;
            }
            
            html += \`
                    </div>
                    <div style="display: flex; justify-content: space-between; width: 100%; max-width: 300px; font-size: 14px; color: #6d7175; margin-top: 10px;">
                        <span>Poor</span>
                        <span>Excellent</span>
                    </div>
                </div>
            \`;
            
            return html;
        }
        
        // Render multiple choice question
        function renderMultipleChoiceQuestion(question) {
            let html = \`
                <div class="th-sf-survey-multiple-choice-container">
            \`;
            
            question.answerOptions.forEach((option) => {
                const isSelected = answers[currentQuestionIndex]?.multipleChoice === option.text;
                html += \`
                    <div class="th-sf-survey-multiple-choice-option \${isSelected ? 'selected' : ''}" 
                         data-option="\${option.text}">
                        <div class="th-sf-survey-multiple-choice-radio"></div>
                        <span class="th-sf-survey-multiple-choice-text">\${option.text}</span>
                    </div>
                \`;
            });
            
            html += '</div>';
            return html;
        }
        
        // Render text question
        function renderTextQuestion(question) {
            return \`
                <div class="th-sf-survey-text-input-container" style="width: 100%; max-width: 500px; padding: 10px;">
                    <textarea class="th-sf-survey-text-input-field" 
                              placeholder="Type your answer here..." 
                              style="border: 1px solid #ccc; border-radius: 4px; padding: 10px; min-height: 80px; background: #fff; cursor: text; width: 100%; resize: vertical; font-family: inherit;">\${answers[currentQuestionIndex] || ''}</textarea>
                </div>
            \`;
        }
        
        // Add event listeners to question elements
        function addQuestionEventListeners() {
            // Star rating container
            const ratingContainer = document.querySelector('.th-sf-survey-rating-scale');
            if (ratingContainer) {
                ratingContainer.addEventListener('mouseleave', () => {
                    // Remove all hover effects when mouse leaves the rating area
                    document.querySelectorAll('.th-sf-survey-rating-option').forEach(star => {
                        star.classList.remove('hovered');
                    });
                });
            }
            
            // Number scale container
            const numberScaleContainer = document.querySelector('.th-sf-survey-number-scale');
            if (numberScaleContainer) {
                numberScaleContainer.addEventListener('mouseleave', () => {
                    // Remove all hover effects when mouse leaves the number scale area
                    document.querySelectorAll('.th-sf-survey-number-option').forEach(number => {
                        number.classList.remove('hovered');
                    });
                });
            }
            
            // Rating options (handles both star rating and number scale)
            const ratingOptions = document.querySelectorAll('[data-rating]');
            ratingOptions.forEach(option => {
                // Handle click for rating
                option.addEventListener('click', (e) => {
                    const ratingElement = e.target.closest('[data-rating]');
                    const rating = ratingElement.dataset.rating;
                    
                    // Check if it's a star rating or number scale
                    if (ratingElement.classList.contains('th-sf-survey-rating-option')) {
                        handleRatingSelect(rating);
                    } else if (ratingElement.classList.contains('th-sf-survey-number-option')) {
                        handleNumberScaleSelect(rating);
                    } else {
                        // Handle any other type of rating
                        handleRatingSelect(rating);
                    }
                });

                // Handle hover effect for star rating and number scale
                option.addEventListener('mouseenter', (e) => {
                    const ratingElement = e.target.closest('[data-rating]');
                    const hoveredRating = parseInt(ratingElement.dataset.rating);
                    
                    if (ratingElement.classList.contains('th-sf-survey-rating-option')) {
                        // Highlight all stars up to the hovered one
                        document.querySelectorAll('.th-sf-survey-rating-option').forEach((star, index) => {
                            const starRating = index + 1;
                            if (starRating <= hoveredRating) {
                                star.classList.add('hovered');
                            } else {
                                star.classList.remove('hovered');
                            }
                        });
                    } else if (ratingElement.classList.contains('th-sf-survey-number-option')) {
                        // Highlight all numbers up to the hovered one
                        document.querySelectorAll('.th-sf-survey-number-option').forEach((number, index) => {
                            const numberRating = index + 1;
                            if (numberRating <= hoveredRating) {
                                number.classList.add('hovered');
                            } else {
                                number.classList.remove('hovered');
                            }
                        });
                    }
                });
                
                // Handle mouse leave for options
                option.addEventListener('mouseleave', (e) => {
                    const ratingElement = e.target.closest('[data-rating]');
                    
                    if (ratingElement.classList.contains('th-sf-survey-rating-option')) {
                        // Remove hover effect from all stars
                        document.querySelectorAll('.th-sf-survey-rating-option').forEach(star => {
                            star.classList.remove('hovered');
                        });
                    } else if (ratingElement.classList.contains('th-sf-survey-number-option')) {
                        // Remove hover effect from all numbers
                        document.querySelectorAll('.th-sf-survey-number-option').forEach(number => {
                            number.classList.remove('hovered');
                        });
                    }
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
            answers[currentQuestionIndex] = { ...answers[currentQuestionIndex], rating };
            updateQuestionDisplay();
            updateNavigationButtons();
            
            // Update emoji and text based on rating
            const ratingInt = parseInt(rating);
            let emoji = '😐';
            let ratingText = 'Not likely';
            
            if (ratingInt >= 4) {
                emoji = '🤩';
                ratingText = 'Love it';
            } else if (ratingInt >= 3) {
                emoji = '😊';
                ratingText = 'Like it';
            } else if (ratingInt >= 2) {
                emoji = '😐';
                ratingText = 'Neutral';
            } else if (ratingInt >= 1) {
                emoji = '😕';
                ratingText = 'Dislike it';
            }
            
            // Update the emoji and text immediately
            const emojiElement = document.querySelector('.th-sf-survey-rating-emoji');
            const textElement = document.querySelector('.th-sf-survey-rating-text');
            
            if (emojiElement) {
                emojiElement.textContent = emoji;
            }
            
            if (textElement) {
                textElement.textContent = ratingText;
            }
            
            // Sync with parent
            sendMessageToParent('ANSWER_SELECTED', {
                questionIndex: currentQuestionIndex,
                answer: answers[currentQuestionIndex],
                questionType: surveyData.questions[currentQuestionIndex].type
            });
        }
        
        // Handle number scale selection
        function handleNumberScaleSelect(rating) {
            answers[currentQuestionIndex] = rating;
            
            // Update the label based on the selected rating
            const ratingInt = parseInt(rating);
            let ratingText = '';
            
            if (ratingInt === 5) {
                ratingText = 'Excellent';
            } else if (ratingInt === 4) {
                ratingText = 'Very Good';
            } else if (ratingInt === 3) {
                ratingText = 'Good';
            } else if (ratingInt === 2) {
                ratingText = 'Fair';
            } else if (ratingInt === 1) {
                ratingText = 'Poor';
            }
            
            // Update the text immediately
            const textElement = document.querySelector('.th-sf-survey-rating-text');
            
            if (textElement) {
                textElement.textContent = ratingText;
            }
            
            updateQuestionDisplay();
            updateNavigationButtons();
            
            // Sync with parent
            sendMessageToParent('ANSWER_SELECTED', {
                questionIndex: currentQuestionIndex,
                answer: rating,
                questionType: 'number-scale'
            });
        }
        
        // Handle multiple choice selection
        function handleMultipleChoiceSelect(optionText) {
            answers[currentQuestionIndex] = { ...answers[currentQuestionIndex], multipleChoice: optionText };
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
            if (!nextButton || !prevButton || !surveyData) return;
            
            const canGoNext = isQuestionComplete();
            const canGoPrev = currentQuestionIndex > 0;
            const isLastQuestion = currentQuestionIndex === surveyData.questions.length - 1;
            
            // Update button text based on position in survey
            nextButton.textContent = isLastQuestion ? 'Submit' : 'Next';
            
            // Update button styles and visibility
            nextButton.disabled = !canGoNext;
            prevButton.style.display = canGoPrev ? 'block' : 'none';
            
            if (canGoNext) {
                nextButton.style.background = isLastQuestion ? '#2c6ecb' : '#1a1a1a'; // Blue for submit
                nextButton.style.opacity = '1';
            } else {
                nextButton.style.background = '#ccc';
                nextButton.style.opacity = '0.6';
            }
        }
        
        // Check if current question is complete
        function isQuestionComplete() {
            if (!surveyData || !surveyData.questions) return false;
            if (currentQuestionIndex >= surveyData.questions.length) return true;
            
            const answer = answers[currentQuestionIndex];
            if (!answer) return false;
            
            const question = surveyData.questions[currentQuestionIndex];
            if (!question) return false;
            
            if (question.type === 'rating') {
                return answer.rating || answer.option || answer.multipleChoice;
            }
            
            return true;
        }
        
        // Render thank you message
        function renderThankYou() {
            if (!questionContent) return;
            
            questionContent.innerHTML = \`
                <div class="th-sf-survey-thank-you-card">
                    <div style="display: flex; flex-direction: column; gap: 16px; align-items: center;">
                        <div class="th-sf-survey-checkmark" style="width: 80px; height: 80px; border-radius: 50%; background-color: #008060; display: flex; justify-content: center; align-items: center; margin-bottom: 8px;">
                            <svg width="40" height="40" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.7 5.3c-.4-.4-1-.4-1.4 0l-6.8 6.8-3.8-3.8c-.4-.4-1-.4-1.4 0-.4.4-.4 1 0 1.4l4.5 4.5c.2.2.4.3.7.3.3 0 .5-.1.7-.3l7.5-7.5c.4-.4.4-1 0-1.4z" fill="white"/>
                            </svg>
                        </div>
                        <h3 class="th-sf-survey-thank-you-heading">Thank you for your feedback!</h3>
                        <p class="th-sf-survey-thank-you-description">We appreciate your time and input.</p>
                    </div>
                </div>
            \`;
            
            // Hide all navigation buttons on Thank You page
            if (nextButton) {
                nextButton.style.display = 'none';
            }
            if (prevButton) {
                prevButton.style.display = 'none';
            }
            
            // Hide progress indicators on Thank You page
            if (progressIndicators) {
                progressIndicators.style.display = 'none';
            }
            
            // Send message to parent about survey completion
            sendMessageToParent('SURVEY_COMPLETE', { answers });
        }
        
        // Navigation functions
        function goToNext() {
            if (currentQuestionIndex < surveyData.questions.length - 1) {
                // Move to the next question
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
            } else if (currentQuestionIndex === surveyData.questions.length - 1) {
                // On the last question, clicking Submit should show Thank You page
                currentQuestionIndex = surveyData.questions.length; // Set to one past the last question
                renderThankYou();
                
                // Send completion message to parent
                sendMessageToParent('SURVEY_COMPLETE', { answers });
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
</body>
</html>`;

        return htmlContent;
    };

    // Generate iframe content when survey data changes
    useEffect(() => {
        if (surveyData && surveyData.questions) {
            const content = generateIframeContent();
            setIframeContent(content);
            setIsLoading(false);
        }
    }, [surveyData, selectedView]);



    // Handle messages from iframe
    useEffect(() => {
        const handleMessage = (event) => {
            const { type, data } = event.data;

            switch (type) {
                case 'SURVEY_COMPLETE':
                    console.log('Survey completed with answers:', data.answers);
                    if (onSurveyComplete) {
                        onSurveyComplete(data.answers);
                    }
                    break;

                case 'QUESTION_CHANGED':
                    console.log('Question changed:', data);
                    setIframeState(prev => ({
                        ...prev,
                        currentQuestionIndex: data.currentQuestionIndex
                    }));
                    break;

                case 'ANSWER_SELECTED':
                    console.log('Answer selected:', data);
                    setIframeState(prev => ({
                        ...prev,
                        answers: {
                            ...prev.answers,
                            [data.questionIndex]: data.answer
                        }
                    }));
                    break;

                case 'NAVIGATION_CHANGED':
                    console.log('Navigation changed:', data);
                    setIframeState(prev => ({
                        ...prev,
                        currentQuestionIndex: data.currentQuestionIndex
                    }));
                    break;

                case 'SURVEY_READY':
                    console.log('Survey iframe is ready');
                    setIframeState(prev => ({
                        ...prev,
                        isReady: true
                    }));
                    break;
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onSurveyComplete]);

    // Send initial data to iframe when it loads
    const handleIframeLoad = () => {
        setIsLoading(false);

        // Send initial survey data to iframe
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'INIT_SURVEY',
                data: {
                    surveyData,
                    selectedView,
                    initialQuestionIndex: 0
                }
            }, '*');
        }
    };

    // Expose methods to control the iframe from parent
    useImperativeHandle(ref, () => ({
        // Control methods
        setQuestionIndex: (index) => {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage({
                    type: 'SET_QUESTION_INDEX',
                    data: { questionIndex: index }
                }, '*');
            }
        },

        setAnswers: (newAnswers) => {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage({
                    type: 'SET_ANSWERS',
                    data: { answers: newAnswers }
                }, '*');
            }
        },

        resetSurvey: () => {
            if (iframeRef.current && iframeRef.current.contentWindow) {
                iframeRef.current.contentWindow.postMessage({
                    type: 'RESET_SURVEY',
                    data: {}
                }, '*');
            }
        },

        refreshIframe: () => {
            // Force iframe to reload by changing srcDoc
            const newContent = generateIframeContent();
            setIframeContent(newContent);
            setIsLoading(true);
        },

        // Get current state from iframe
        getCurrentState: () => {
            return {
                currentQuestionIndex: iframeState.currentQuestionIndex,
                answers: iframeState.answers,
                surveyData,
                isReady: iframeState.isReady
            };
        },

        // HTML content methods (for backward compatibility)
        getHTMLContent: () => {
            if (iframeRef.current && (iframeRef.current.contentDocument || iframeRef.current.contentWindow)) {
                const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
                return doc.documentElement.outerHTML;
            }
            return '';
        },

        getBodyContent: () => {
            if (iframeRef.current && (iframeRef.current.contentDocument || iframeRef.current.contentWindow)) {
                const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
                return doc.body ? doc.body.innerHTML : '';
            }
            return '';
        },

        getCompleteHTML: () => {
            if (iframeRef.current && (iframeRef.current.contentDocument || iframeRef.current.contentWindow)) {
                const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
                return doc.documentElement.outerHTML;
            }
            return '';
        },

        getCleanHTML: () => {
            if (iframeRef.current && (iframeRef.current.contentDocument || iframeRef.current.contentWindow)) {
                const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
                const container = doc.querySelector('.th-sf-survey-container');
                return container ? container.outerHTML : '';
            }
            return '';
        },

        getJavaScriptContent: () => {
            // Return the iframe's JavaScript content
            return generateIframeContent();
        },

        // Precise helpers to fetch only specific inner HTML chunks
        getContainerDivHTML: () => {
            if (iframeRef.current && (iframeRef.current.contentDocument || iframeRef.current.contentWindow)) {
                const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
                const container = doc.querySelector('.th-sf-survey-container');
                return container ? container.outerHTML : '';
            }
            return '';
        },

        getQuestionContentHTML: () => {
            if (iframeRef.current && (iframeRef.current.contentDocument || iframeRef.current.contentWindow)) {
                const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
                const questionContentEl = doc.getElementById('question-content');
                return questionContentEl ? questionContentEl.outerHTML : '';
            }
            return '';
        }
    }));

    if (isLoading) {
        return (
            <Box padding="400" background="bg-surface-secondary" borderRadius="300">
                <Text variant="bodyMd" alignment="center">
                    Loading survey preview...
                </Text>
            </Box>
        );
    }

    return (
        <Box>
            <iframe
                ref={iframeRef}
                srcDoc={iframeContent}
                style={{
                    width: '100%',
                    height: '800px',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
                onLoad={handleIframeLoad}
                title="Survey Preview"
            />
        </Box>
    );
});

export default SurveyIframe;
