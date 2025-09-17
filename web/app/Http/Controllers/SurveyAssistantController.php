<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Prism\Prism\Enums\Provider;
use Prism\Prism\Schema\ObjectSchema;
use Prism\Prism\Schema\StringSchema;
use Prism\Prism\Schema\ArraySchema;
use Prism\Prism\Schema\EnumSchema;

class SurveyAssistantController extends Controller
{
    public function generateTitle(Request $request){
        $prompt = (string) $request->input('prompt','');
        
        if (trim($prompt) === '') {
            return response()->json(['message' => 'Prompt is required.'], 422);
        }

        $system = 'You generate concise, compelling survey titles. Output only the title, without quotes.';
        // Add a small entropy nonce so repeated identical prompts can still yield varied results
        $nonce = bin2hex(random_bytes(4));
        $system .= " Nonce: {$nonce}. Do not include or reference the nonce in the output.";
        $userPrompt = "Generate a short survey title (<= 60 chars) for: {$prompt}";

        try {
            // Prefer the container helper to resolve Prism (start text generation chain)
            $response = prism()
                ->text()
                ->using(Provider::Gemini, 'gemini-2.0-flash')
                ->withSystemPrompt($system)
                ->withPrompt($userPrompt)
                ->asText();

            $title = trim($response->text ?? '');
            $title = trim($title, "\"' ");

            if ($title === '') {
                $title = 'Customer survey';
            }

            return response()->json(['title' => $title]);
        } catch (\Throwable $e) {
            report($e);
            return response()->json([
                'message' => 'Failed to generate title.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    public function generateSurvey(Request $request)
    {
        $prompt = (string) $request->input('prompt', '');
        
        if (trim($prompt) === '') {
            return response()->json(['message' => 'Prompt is required.'], 422);
        }

        // Create the survey generation schema
        $surveyGenerationSchema = new ObjectSchema(
            name: 'survey_generation',
            description: 'Complete survey with title, questions and answers',
            properties: [
                new StringSchema('surveyTitle', 'The main title of the survey'),
                new ArraySchema(
                    name: 'questions',
                    description: 'Array of survey questions with answers',
                    items: new ObjectSchema(
                        name: 'question',
                        description: 'A single survey question',
                        properties: [
                            new StringSchema('content', 'The question text'),
                            new EnumSchema('type', 'Question type', [
                                'text', 'rating', 'single-choice', 'multiple-choice', 
                                'satisfaction', 'number-scale'
                            ]),
                            new StringSchema('description', 'Helper text for the question'),
                            new StringSchema('questionType', 'Display name for question type'),
                            new ArraySchema(
                                name: 'answerOptions',
                                description: 'Answer options for choice-based questions',
                                items: new ObjectSchema(
                                    name: 'answer_option',
                                    description: 'A single answer option',
                                    properties: [
                                        new StringSchema('text', 'Answer option text')
                                    ],
                                    requiredFields: ['text']
                                )
                            )
                        ],
                        requiredFields: ['content', 'type', 'description', 'questionType', 'answerOptions']
                    )
                )
            ],
            requiredFields: ['surveyTitle', 'questions']
        );

        // System prompt for comprehensive survey generation
        $systemPrompt = 'You are a survey expert. Generate a complete survey with title and relevant questions based on the user prompt. If the user specifies a number of questions, generate exactly that many. If no number is specified, generate 3-5 questions. Include appropriate answer options for choice-based questions. For text questions, leave answerOptions as empty array. Match questionType to these mappings: text="Short answer", rating="Star rating", single-choice="Single choice", multiple-choice="Multiple choice", satisfaction="Satisfaction", number-scale="Number scale".';
        
        // Add entropy nonce
        $nonce = bin2hex(random_bytes(4));
        $systemPrompt .= " Nonce: {$nonce}. Do not include or reference the nonce in the output.";
        
        $userPrompt = "Generate a survey for: {$prompt}. Pay attention to any specific number of questions requested.";

        try {
            $response = prism()
                ->structured()
                ->using(Provider::Gemini, 'gemini-2.0-flash')
                ->withSchema($surveyGenerationSchema)
                ->withSystemPrompt($systemPrompt)
                ->withPrompt($userPrompt)
                ->asStructured();

            $surveyData = $response->structured;
            
            if ($surveyData === null || !isset($surveyData['surveyTitle']) || !isset($surveyData['questions'])) {
                throw new \Exception('Invalid survey data generated');
            }
            
            // Process and format the data for frontend
            $processedData = $this->processSurveyData($surveyData);
            
            return response()->json($processedData);
        } catch (\Throwable $e) {
            report($e);
            return response()->json([
                'message' => 'Failed to generate survey.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    private function processSurveyData($aiData)
    {
        // Add UUIDs and format for frontend compatibility
        $questions = [];
        foreach ($aiData['questions'] as $index => $question) {
            $questionId = (string)($index + 1);
            
            // Process answer options with UUIDs
            $answerOptions = [];
            if (isset($question['answerOptions']) && is_array($question['answerOptions'])) {
                foreach ($question['answerOptions'] as $optIndex => $option) {
                    $answerOptions[] = [
                        'id' => 'opt' . ($optIndex + 1),
                        'text' => $option['text'] ?? ''
                    ];
                }
            }
            
            $questions[] = [
                'id' => $questionId,
                'content' => $question['content'] ?? '',
                'type' => $question['type'] ?? 'text',
                'description' => $question['description'] ?? '',
                'questionType' => $question['questionType'] ?? 'Short answer',
                'isDraggable' => true,
                'answerOptions' => $answerOptions
            ];
        }
        
        // Add thank you card
        $questions[] = [
            'id' => 'thankyou',
            'content' => 'Thank You Card',
            'type' => 'card',
            'description' => '',
            'questionType' => 'Card',
            'isDraggable' => false,
            'answerOptions' => []
        ];
        
        return [
            'surveyTitle' => $aiData['surveyTitle'],
            'questions' => $questions
        ];
    }
}
