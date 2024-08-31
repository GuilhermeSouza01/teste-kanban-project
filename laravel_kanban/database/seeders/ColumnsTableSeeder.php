<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ColumnsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $columns = [

            ['title' => 'A fazer', 'header_background_color' => '#f44336', 'order' => 1],
            ['title' => 'Em andamento', 'header_background_color' => '#ff9800', 'order' => 2],
            ['title' => 'Concluído', 'header_background_color' => '#4caf50', 'order' => 3],
        ];

        foreach ($columns as $column) {
            DB::table('columns')->insert($column);
        }
    }
}
