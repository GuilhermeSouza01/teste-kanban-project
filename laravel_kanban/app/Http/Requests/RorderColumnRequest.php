<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RorderColumnRequest extends FormRequest
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
            'columns' => ['required', 'array'],
            'columns.*.id' => ['integer', 'exists:columns,id'],
            'columns.*.order' => ['integer'],
            'order' => ['required', 'array'],
            'order.*' => ['integer', 'exists:columns,id']
        ];
    }
}
