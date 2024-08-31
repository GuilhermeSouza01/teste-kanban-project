<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RorderTasksRequest extends FormRequest
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
            'tasks' => 'required|array',
            'tasks.*.id' => 'required|integer|exists:tasks,id',
            'tasks.*.order' => 'required|integer',
            'tasks.*.column_id' => 'required|integer|exists:columns,id'
        ];
    }
}
