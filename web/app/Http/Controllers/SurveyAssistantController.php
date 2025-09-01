<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Prism\Prism\Enums\Provider;

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
}
