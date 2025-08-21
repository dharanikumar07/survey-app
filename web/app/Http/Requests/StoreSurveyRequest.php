<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSurveyRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'name' => ['required', 'string', 'max:255'],
			'status' => ['sometimes', Rule::in(['active', 'inactive', 'draft'])],
			'survey_type' => ['required', Rule::in(['post_purchase', 'site_widget', 'email', 'exit_intent', 'embedded'])],
			'survey_meta_data' => ['nullable', 'array'],
			'is_active' => ['sometimes', 'boolean'],
		];
	}
}


