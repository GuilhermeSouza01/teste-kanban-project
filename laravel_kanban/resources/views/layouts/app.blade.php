<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Board</title>
    <link rel="stylesheet" href="{{ asset('css/jquery-ui.css') }}">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    <link rel="stylesheet" href="{{ asset('css/board.css') }}">
</head>

<body>
    <div class="app-layout">
        @include('layouts._partials.sidebar')

        <div class="main-content">
            <div class="add-collumn-container">
                <button id="add-column-button" class="add-column-button">Adicionar Coluna</button>
            </div>
            @yield('content')
        </div>
    </div>

    <script src="{{ asset('js/jquery.min.js') }}"></script>
    <script src="{{ asset('js/jquery-ui.js') }}"></script>
    <script src="{{ asset('js/scripts.js') }}"></script>
    <script src="{{ asset('js/board.js') }}"></script>
</body>

</html>
