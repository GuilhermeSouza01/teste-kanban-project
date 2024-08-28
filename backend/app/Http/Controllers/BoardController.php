<?php

namespace App\Http\Controllers;

use App\Models\Column;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function showBoardIndex()
    {
        // Carregar as colunas e suas tarefas
        $columns = Column::with('tasks')->get();

        // Retornar a view com os dados necessários
        return view('board.index', ['columns' => $columns]);
    }
}
