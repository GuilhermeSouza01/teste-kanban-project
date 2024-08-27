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
        $columns = Column::with('tasks')->get();

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

        $column = Column::create($request->all());

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
        $column->update($request->only(['title', 'header_background_color', 'position']));

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
     */
    public function updateColumnOrder(Request $request)
    {
        $columns = $request->input('columns');

        foreach ($columns as $index => $column) {
            Column::where('id', $column['id'])->update(['order' => $index]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Colunas reordenadas com sucesso'
        ], 200);
    }
}
