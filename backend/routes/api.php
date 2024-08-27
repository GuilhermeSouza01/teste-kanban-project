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
Route::put('tasks/rorder', [TaskController::class, 'rorder']);
Route::put('columns/rorder', [ColumnController::class, 'rorder']);
Route::post('/tasks/update-order', [TaskController::class, 'updateOrder']);
Route::post('/columns/update-order', [ColumnController::class, 'updateOrder']);
