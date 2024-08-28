$(document).ready(function () {
    // Abrir modal para adicionar uma nova tarefa
    $(".open-modal").click(function (event) {
        event.stopPropagation(); // Impede que outros eventos sejam acionados
        var columnId = $(this).data("column-id");
        $("#column-id").val(columnId);
        $("#task-id").val("");
        $("#title").val("");
        $("#description").val("");
        $("#modal-title").text("Create Task");
        $("#task-modal").fadeIn();
    });

    // Abrir modal para editar uma tarefa
    $(".edit-task").click(function (event) {
        event.stopPropagation(); // Impede que outros eventos sejam acionados
        var taskId = $(this).data("task-id");
        $.get(`/api/tasks/${taskId}`, function (data) {
            $("#task-id").val(data.data.id);
            $("#title").val(data.data.title);
            $("#description").val(data.data.description);
            $("#column-id").val(data.data.column_id);
            $("#modal-title").text("Edit Task");
            $("#task-modal").fadeIn();
        });
    });

    // Fechar o modal de tarefa
    $("#close-modal").click(function () {
        $("#task-modal").fadeOut();
    });

    // Submeter o formulário do modal de tarefa
    $("#task-form").submit(function (e) {
        e.preventDefault();

        var taskId = $("#task-id").val();
        var url = taskId ? `/api/tasks/${taskId}` : "/api/tasks";
        var method = taskId ? "PUT" : "POST";

        $.ajax({
            url: url,
            method: method,
            data: {
                title: $("#title").val(),
                description: $("#description").val(),
                column_id: $("#column-id").val(),
                _token: "{{ csrf_token() }}",
            },
            success: function (response) {
                location.reload();
            },
        });
    });

    // Deletar uma tarefa
    $(".delete-task").click(function (event) {
        event.stopPropagation(); // Impede que outros eventos sejam acionados
        var taskId = $(this).data("task-id");

        if (confirm("Are you sure you want to delete this task?")) {
            $.ajax({
                url: `/api/tasks/${taskId}`,
                method: "DELETE",
                data: {
                    _token: "{{ csrf_token() }}",
                },
                success: function (response) {
                    $(`.task[data-task-id="${taskId}"]`).remove();
                },
            });
        }
    });

    // Abrir modal para editar coluna
    $(".column-header").click(function (event) {
        event.stopPropagation(); // Impede que outros eventos sejam acionados
        var columnId = $(this).data("column-id");
        var color = $(this).data("color");
        var title = $(this).text();

        $("#color-picker").val(color);
        $("#column-title").val(title);
        $("#column-id").val(columnId);
        $("#modal-title").text("Editar Coluna");
        $("#column-modal").fadeIn();
        $("body").addClass("modal-open"); // Aplica o desfoque ao conteúdo
    });

    // Fechar o modal de edição de coluna
    $("#close-column-modal").click(function () {
        $("#column-modal").fadeOut();
        $("body").removeClass("modal-open"); // Remove o desfoque do conteúdo
    });

    // Submeter a troca de cor e título da coluna
    $("#column-form").submit(function (e) {
        e.preventDefault();

        var columnId = $("#column-id").val();
        var color = $("#color-picker").val();
        var title = $("#column-title").val();

        $.ajax({
            url: `/api/columns/${columnId}`,
            method: "PATCH",
            data: {
                color: color,
                title: title,
                _token: "{{ csrf_token() }}",
            },
            success: function (response) {
                var columnHeader = $(
                    `.column[data-column-id="${columnId}"] .column-header`
                );
                columnHeader.css("background-color", color);
                columnHeader.text(title);
                $("#column-modal").fadeOut();
                $("body").removeClass("modal-open"); // Remove o desfoque do conteúdo
            },
            error: function (response) {
                console.error("Failed to update column");
            },
        });
    });

    // Funcionalidade para arrastar e soltar tarefas entre colunas
    $(".tasks")
        .sortable({
            connectWith: ".tasks",
            update: function (event, ui) {
                var columnId = $(this).data("column-id");
                var tasks = $(this).sortable("toArray", {
                    attribute: "data-task-id",
                });

                $.ajax({
                    url: "/api/tasks/update-order",
                    method: "POST",
                    data: {
                        tasks: tasks.map((taskId, index) => ({
                            id: taskId,
                            order: index + 1, // Ordem começa a partir de 1
                            column_id: columnId,
                        })),
                        _token: "{{ csrf_token() }}",
                    },
                    success: function (response) {
                        console.log("Order updated successfully");
                    },
                    error: function (response) {
                        console.error("Failed to update order");
                    },
                });
            },
        })
        .disableSelection();

    // Funcionalidade para arrastar e soltar colunas
    $(".board")
        .sortable({
            items: ".column",
            update: function (event, ui) {
                var columns = $(this).sortable("toArray", {
                    attribute: "data-column-id",
                });

                $.ajax({
                    url: "/api/columns/update-order",
                    method: "POST",
                    data: {
                        columns: columns.map((columnId, index) => ({
                            id: columnId,
                            order: index,
                        })),
                        _token: "{{ csrf_token() }}",
                    },
                });
            },
        })
        .disableSelection();
});
