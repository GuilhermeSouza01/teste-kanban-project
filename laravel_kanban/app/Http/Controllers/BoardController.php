<?php

namespace App\Http\Controllers;

use App\Models\Column;
use Illuminate\Http\Request;

class BoardController extends Controller
{
    public function showBoardIndex()
    {
        // Ordenar as colunas pelo campo 'order'
        $columns = Column::with(['tasks' => function ($query) {
            $query->orderBy('order'); // Ordena as tarefas dentro de cada coluna
        }])->orderBy('order')->get(); // Ordena as colunas


        // Retornar a view com os dados necessários
        return view('board.index', ['columns' => $columns]);
    }
}
