<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreColumnRequest;
use App\Http\Requests\UpdateColumnRequest;
use App\Models\Column;
use Illuminate\Http\Request;

class ColumnController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Ordenar as colunas pelo campo 'order'
        $columns = Column::with(['tasks' => function ($query) {
            $query->orderBy('order'); // Ordena as tarefas dentro de cada coluna
        }])->orderBy('order')->get(); // Ordena as colunas

        return response()->json([
            'status' => 'success',
            'message' => 'Colunas listadas com sucesso',
            'data' => $columns
        ], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreColumnRequest $request)
    {
        $request->validated();

        // Verificar se já existe uma coluna com o mesmo ID e ordem
        $existingColumn = Column::where('id', $request->input('id'))
            ->where('order', $request->input('order'))
            ->first();

        if ($existingColumn) {
            return response()->json([
                'status' => 'error',
                'message' => 'Coluna com o mesmo ID e ordem já existe',
            ], 409); // Conflito
        }

        // Se não existir, criar uma nova coluna
        $maxOrder = Column::max('order');
        $newOrder = $maxOrder ? $maxOrder + 1 : 1;

        $column = Column::create(array_merge(
            $request->all(),
            ['order' => $newOrder] // Define a ordem da nova coluna
        ));

        return response()->json([
            'status' => 'success',
            'message' => 'Coluna criada com sucesso',
            'data' => $column
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Column $column)
    {
        $column = $column->load('tasks');
        return response()->json([
            'status' => 'success',
            'message' => 'Coluna listada com sucesso',
            'data' => $column
        ], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateColumnRequest $request, string $id)
    {
        $request->validated();

        $column = Column::findOrFail($id);
        $column->update($request->only(['title', 'header_background_color']));

        return response()->json([
            'status' => 'success',
            'message' => 'Coluna atualizada com sucesso',
            'data' => $column
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Column $column)
    {
        $column->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Coluna deletada com sucesso',
            'data' => $column
        ], 200);
    }

    /**
     * Order the columns.
     */ // Adicione este método ao seu controlador de colunas
    public function updateColumnOrder(Request $request)
    {
        $columns = $request->input('columns');

        foreach ($columns as $index => $columnId) {
            Column::where('id', $columnId)->update(['order' => $index + 1]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Colunas reordenadas com sucesso',
        ], 200);
    }

    public function updateOrder(Request $request)
    {
        $columns = $request->input('columns');

        foreach ($columns as $column) {
            Column::where('id', $column['id'])->update(['order' => $column['order']]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Ordem das colunas atualizada com sucesso',
        ], 200);
    }
}
