<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RuleRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        if ($this->routeIs('create.rule') || $this->routeIs('update.rule')) {
            return [
                'rule_type' => ['required', 'string', 'in:quantity_break_free_gift,bundles,volume_discount_bundles,related_products,quantity_discounts'],
                'rule_title' => ['required', 'string'],
                'rule_status' => ['required', 'string', 'in:active,draft'],
                'filters' => ['required', 'array'],
                'is_recurring' => ['required', 'boolean'],
                'start_date' => ['nullable', 'date_format:Y-m-d H:i:s'],
                'end_date' => ['nullable', 'date_format:Y-m-d H:i:s'],
                'conditions' => ['nullable', 'array'],
                'rule_data' => ['required', 'array'],
            ];
        } elseif ($this->routeIs('delete.rule')) {
            return [
                'uuid' => ['required'],
            ];
        }

        return [];
    }
}
