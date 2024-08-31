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
                        <button class="delete-column-button" data-column-id="{{ $column->id }}">
                            <span class="icon">×</span>
                        </button>
                    </div>
                    <div class="tasks" data-column-id="{{ $column->id }}">
                        @foreach ($column->tasks as $task)
                            <div class="task" data-task-id="{{ $task->id }}">
                                <h3>{{ $task->title }}</h3>
                                <p>{{ $task->description }}</p>
                                <button class="edit-task btn-edit" data-task-id="{{ $task->id }}">Edit</button>
                                <button class="delete-task btn-delete" data-task-id="{{ $task->id }}">Delete</button>
                            </div>
                        @endforeach

                    </div>
                    <div class="task add-task-button" data-column-id="{{ $column->id }}">
                        <span>+</span>
                    </div>
                </div>
            @endforeach
        </div>
    </div>

    <!-- Modal -->
    <div id="task-modal" class="modal hidden">
        <div class="modal-content">
            <h2 id="modal-title">Criação / Edição Tarefa</h2>
            <form id="task-form">
                @csrf
                <input type="hidden" id="task-id">
                <input type="hidden" id="column-id">
                <div class="form-group">
                    <label for="title">Titulo</label>
                    <input type="text" id="title" required>
                </div>
                <div class="form-group">
                    <label for="description">Descrição</label>
                    <textarea id="description" required></textarea>
                </div>
                <div class="form-actions">
                    <button type="button" id="close-modal" class="btn-cancel">Cancelar</button>
                    <button type="submit" class="btn-save">Salvar</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Modal de adicionar coluna -->

    <div id="add-column-modal" class="modal">
        <div class="modal-content">
            <h2 id="modal-title">Adicionar Coluna</h2>
            <form id="add-column-form">
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


    <!-- Modal de edição do cabeçalho da coluna -->

    <div id="edit-column-modal" class="modal">
        <div class="modal-content">
            <h2 id="modal-title">Editar Coluna</h2>
            <form id="edit-column-form">
                <input type="hidden" id="column-id">
                <div class="form-group">
                    <label for="column-title">Título</label>
                    <input type="text" id="edit-column-title" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="header-background-color">Cor de Fundo</label>
                    <input type="color" id="edit-header-background-color" class="form-control">
                </div>
                <button id="close-edit-column-modal" class="btn-cancel">Cancelar</button>
                <button type="submit" class="btn btn-save">Salvar</button>
            </form>
        </div>
    </div>


    <!-- Modal de confirmação de exclusão de coluna -->

    <div id="delete-column-modal" class="modal">
        <div class="modal-content">
            <h2 id="modal-title">Excluir Coluna</h2>
            <p>Tem certeza que deseja excluir esta coluna?</p>
            <div class="form-actions">
                <button id="cancel-delete-column" class="btn-cancel">Cancelar</button>
                <button id="confirm-delete-column" class="btn-delete">Excluir</button>
            </div>
        </div>
    </div>

    <!-- Modal de confirmação de exclusão de tarefa -->

    <div id="delete-task-modal" class="modal">
        <div class="modal-content">
            <h2 id="modal-title">Excluir Tarefa</h2>
            <p>Tem certeza que deseja excluir esta tarefa?</p>
            <div class="form-actions">
                <button id="cancel-delete-task" class="btn-cancel">Cancelar</button>
                <button id="confirm-delete-task" class="btn-delete">Excluir</button>
            </div>
        </div>
    </div>




@endsection


@push('js')
    <script src="{{ asset('js/board.js') }}"></script>
@endpush
