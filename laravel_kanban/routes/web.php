<?php

use App\Http\Controllers\BoardController;
use App\Http\Controllers\ColumnController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('board.index');
});

Route::get('/board', [BoardController::class, 'showBoardIndex'])->name('board.index');
