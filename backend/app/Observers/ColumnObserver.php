<?php

namespace App\Observers;

use App\Models\Column;

class ColumnObserver
{
    /**
     * Handle the Column "created" event.
     */
    public function created(Column $column): void
    {
        $this->incrementOrder($column);
    }

    /**
     * Handle the Column "updated" event.
     */
    public function updated(Column $column): void
    {
        $this->adjustOrder($column);
    }

    /**
     * Handle the Column "deleted" event.
     */
    public function deleted(Column $column): void
    {
        $this->decrementOrder($column);
    }

    /**
     * Handle the Column "restored" event.
     */
    public function restored(Column $column): void
    {
        //
    }

    /**
     * Handle the Column "force deleted" event.
     */
    public function forceDeleted(Column $column): void
    {
        //
    }

    /**
     * Increment the order of the columns.
     */
    private function incrementOrder(Column $column): void
    {
        Column::where('order', '>=', $column->order)
            ->increment('order');
    }

    private function adjustOrder(Column $column): void
    {
        $oldOrder = $column->getOriginal('order');
        $newOrder = $column->order;

        if ($oldOrder > $newOrder) {
            Column::whereBetween('order', [$newOrder, $oldOrder - 1])
                ->increment('order');
        } else if ($oldOrder < $newOrder) {
            Column::whereBetween('order', [$oldOrder + 1, $newOrder])
                ->decrement('order');
        }
    }

    /**
     * Decrement the order of the columns.
     */

    private function decrementOrder(Column $column): void

    {
        Column::where('order', '>', $column->order)
            ->decrement('order');
    }
}
