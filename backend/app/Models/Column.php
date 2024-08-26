<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Column extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'position', 'header_background_color'];

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
