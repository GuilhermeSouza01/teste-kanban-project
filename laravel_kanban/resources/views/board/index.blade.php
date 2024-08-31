@extends('layouts.app')

@section('title', 'Board')

@push('css')
    <link rel="stylesheet" href="{{ asset('css/board.css') }}">
@endpush

@section('content')
    <div class="container">
        <div class="board">
            @foreach ($columns as $column)
                <div class="column" data-column-id="{{ $column->id }}">
                    <div class="column-header" style="background-color: {{ $column->header_background_color }}">
                        <h4>{{ $column->title }}</h4>
                        <button class="open-modal" data-column-id="{{ $column->id }}">Add Task</button>
                    </div>
                    <div class="tasks" data-column-id="{{ $column->id }}">
                        @foreach ($column->tasks as $task)
                            <div class="task" data-task-id="{{ $task->id }}">
                                <h3>{{ $task->title }}</h3>
                                <p>{{ $task->description }}</p>
                                <button class="edit-task" data-task-id="{{ $task->id }}">Edit</button>
                                <button class="delete-task" data-task-id="{{ $task->id }}">Delete</button>
                            </div>
                        @endforeach
                    </div>
                </div>
            @endforeach
        </div>
    </div>

    <!-- Modal -->
    <div id="task-modal" class="modal hidden">
        <div class="modal-content">
            <h2 id="modal-title">Create/Edit Task</h2>
            <form id="task-form">
                @csrf
                <input type="hidden" id="task-id">
                <input type="hidden" id="column-id">
                <div class="form-group">
                    <label for="title">Title</label>
                    <input type="text" id="title" required>
                </div>
                <div class="form-group">
                    <label for="description">Description</label>
                    <textarea id="description" required></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" id="close-modal" class="btn-cancel">Cancelar</button>
                    <button type="submit" class="btn-save">Salvar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal de edição do cabeçalho da coluna -->

    <div id="column-modal" class="modal">
        <div class="modal-content">
            <span id="close-column-modal" class="close">&times;</span>
            <h2 id="modal-title">Editar Coluna</h2>
            <form id="column-form">
                <input type="hidden" id="column-id">
                <div class="form-group">
                    <label for="column-title">Título</label>
                    <input type="text" id="column-title" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="header-background-color">Cor de Fundo</label>
                    <input type="color" id="header-background-color" class="form-control">
                </div>
                <button type="submit" class="btn btn-save">Salvar</button>
            </form>
        </div>
    </div>




@endsection

@push('css')
    <link rel="stylesheet" href="{{ asset('css/board.css') }}">
@endpush

@push('js')
    <script src="{{ asset('js/board.js') }}"></script>
@endpush
