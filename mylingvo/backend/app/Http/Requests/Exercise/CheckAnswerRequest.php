<?php

declare(strict_types=1);

namespace App\Http\Requests\Exercise;

use Illuminate\Foundation\Http\FormRequest;

class CheckAnswerRequest extends FormRequest
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
        return [
            'exercise_type' => ['required', 'string', 'in:decline,identify,form,sentence'],
            'content_id' => ['required', 'integer'],
            'content_type' => ['required', 'string'],
            'answer' => ['required', 'string'],
            'time_spent_ms' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'exercise_type.required' => 'Exercise type is required.',
            'exercise_type.in' => 'Exercise type must be one of: decline, identify, form, sentence.',
            'content_id.required' => 'Content ID is required.',
            'content_id.integer' => 'Content ID must be an integer.',
            'content_type.required' => 'Content type is required.',
            'answer.required' => 'An answer is required.',
        ];
    }
}
