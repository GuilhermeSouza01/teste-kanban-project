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

    // public function reorderTasks(UpdateTaskRequest $request)
    // {
    //     $request->validated();

    //     $tasks = $request->input('tasks');

    //     foreach ($tasks as $task) {
    //         Task::where('id', $task['id'])->update([
    //             'order' => $task['order'],
    //             'column_id' => $task['column_id']
    //         ]);
    //     }

    //     return response()->json([
    //         'status' => 'success',
    //         'message' => 'Tarefas reordenadas com sucesso'
    //     ], 200);
    // }

    public function updateTaskOrder(Request $request)
    {
        $tasks = $request->input('tasks');

        foreach ($tasks as $task) {
            Task::where('id', $task['id'])->update([
                'order' => $task['order'],
                'column_id' => $task['column_id']
            ]);
        }

        // Após a atualização, vamos garantir que todas as tarefas em cada coluna tenham ordens únicas
        $columns = array_unique(array_column($tasks, 'column_id'));

        foreach ($columns as $columnId) {
            $columnTasks = Task::where('column_id', $columnId)
                ->orderBy('order')
                ->get();

            foreach ($columnTasks as $index => $task) {
                $task->update(['order' => $index + 1]);
            }
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Tarefas reordenadas com sucesso',
        ], 200);
    }


    // Ordem das tarefas em uma mesma coluna quando a é movida para outra coluna

    public function updateTaskOrderInColumn(Request $request)
    {
        $tasks = $request->input('tasks');

        foreach ($tasks as $task) {
            Task::where('id', $task['id'])->update([
                'order' => $task['order'],
                'column_id' => $task['column_id']
            ]);
        }

        // Atualiza a ordem das tarefas na coluna para garantir ordens únicas
        $columnTasks = Task::where('column_id', $tasks[0]['column_id'])
            ->orderBy('order')
            ->get();

        $order = 1;

        foreach ($columnTasks as $task) {
            $task->update(['order' => $order]);
            $order++;
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Tarefas reordenadas com sucesso',
        ], 200);
    }
}
