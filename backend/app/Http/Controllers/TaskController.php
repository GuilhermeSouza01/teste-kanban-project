<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateOrderRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tasks = Task::with('column')->get();

        return response()->json([
            'status' => 'success',
            'message' => 'Tarefas listadas com sucesso',
            'data' => $tasks
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
    public function store(StoreTaskRequest $request)
    {
        $request->validated();

        $task = Task::create($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Tarefa criada com sucesso',
            'data' => $task
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Tarefa listada com sucesso',
            'data' => $task
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
    public function update(UpdateTaskRequest $request, string $id)
    {
        $request->validated();

        $task = Task::findOrFail($id);
        $task->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Tarefa atualizada com sucesso',
            'data' => $task
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Tarefa deletada com sucesso'
        ], 200);
    }

    public function reorderTasks(UpdateTaskRequest $request)
    {
        $request->validated();

        $tasks = $request->input('tasks');

        foreach ($tasks as $task) {
            Task::where('id', $task['id'])->update([
                'order' => $task['order'],
                'column_id' => $task['column_id']
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Tarefas reordenadas com sucesso'
        ], 200);
    }

    public function updateOrder(Request $request)
    {
        //Atualiza a ordem e as colunas das tarefas

        // $request->validated();

        $tasks = $request->input('tasks');

        foreach ($tasks as $taskData) {
            $task = Task::find($taskData['id']);

            if ($task->order != $taskData['order']) {
                $task->order = $taskData['order'];
                $task->save();
            }
        }


        return response()->json([
            'status' => 'success',
            'message' => 'Tarefas reordenadas com sucesso',
            'data' => $tasks
        ], 200);
    }
}
