<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSurveyRequest extends FormRequest
{
	public function authorize(): bool
	{
		return true;
	}

	public function rules(): array
	{
		return [
			'name' => ['sometimes', 'string', 'max:255'],
			'status' => ['sometimes', Rule::in(['active', 'inactive', 'draft'])],
			'survey_type' => ['sometimes', Rule::in(['post_purchase', 'site_widget', 'email', 'exit_intent', 'embedded'])],
			'survey_meta_data' => ['nullable', 'array'],
			'is_active' => ['sometimes', 'boolean'],
		];
	}
}


