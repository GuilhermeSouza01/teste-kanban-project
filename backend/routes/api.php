<?php

use App\Http\Controllers\ColumnController;
use App\Http\Controllers\TaskController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::apiResource('columns', ColumnController::class);
Route::apiResource('tasks', TaskController::class);

// Atualiza a ordem das tarefas
Route::post('/tasks/update-order', [TaskController::class, 'updateTaskOrder']);

// Atualiza a ordem das colunas
Route::post('/columns/update-order', [ColumnController::class, 'updateColumnOrder']);
