<?php

namespace App\Observers;

use App\Models\Task;

class TaskObserver
{
    /**
     * Handle the Task "created" event.
     */
    public function created(Task $task): void
    {
        $this->incrementOrder($task);
    }

    /**
     * Handle the Task "updated" event.
     */
    public function updated(Task $task): void
    {
        $this->adjustOrder($task);
    }

    /**
     * Handle the Task "deleted" event.
     */
    public function deleted(Task $task): void
    {
        $this->decrementOrder($task);
    }

    /**
     * Handle the Task "restored" event.
     */
    public function restored(Task $task): void
    {
        //
    }

    /**
     * Handle the Task "force deleted" event.
     */
    public function forceDeleted(Task $task): void
    {
        //
    }

    /**
     * Increment the order of the tasks in the same column.
     */

    private function incrementOrder(Task $task): void

    {
        $tasks = Task::where('column_id', $task->column_id)
            ->where('id', '!=', $task->id)
            ->where('order', '>=', $task->order)
            ->get();

        foreach ($tasks as $task) {
            $task->order++;
            $task->save();
        }
    }

    /**
     * Adjust the order of the tasks in the same column.
     */

    private function adjustOrder(Task $task): void

    {
        $oldOrder = $task->getOriginal('order');
        $newOrder = $task->order;

        if ($oldOrder > $newOrder) {
            Task::where('column_id', $task->column_id)
                ->whereBetween('order', [$newOrder, $oldOrder - 1])
                ->increment('order');
        } else if ($oldOrder < $newOrder) {
            Task::where('column_id', $task->column_id)
                ->whereBetween('order', [$oldOrder + 1, $newOrder])
                ->decrement('order');
        }
    }

    /**
     * Decrement the order of the tasks in the same column.
     */

    private function decrementOrder(Task $task): void

    {
        $tasks = Task::where('column_id', $task->column_id)
            ->where('order', '>', $task->order)
            ->get();

        foreach ($tasks as $task) {
            $task->order--;
            $task->save();
        }
    }
}
