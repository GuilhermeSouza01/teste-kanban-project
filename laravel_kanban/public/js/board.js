$(document).ready(function () {
    // Função para abrir o modal de tarefa
    function openTaskModal(
        taskId = "",
        columnId = "",
        title = "",
        description = "",
        modalTitle = "Create Task"
    ) {
        $("#task-id").val(taskId);
        $("#column-id").val(columnId);
        $("#title").val(title);
        $("#description").val(description);
        $("#modal-title").text(modalTitle);
        $("#task-modal").fadeIn();
    }

    // Evento para abrir o modal de adicionar nova tarefa
    $(document).on("click", ".add-task-button", function (event) {
        event.stopPropagation();
        openTaskModal("", $(this).data("column-id"), "", "", "Create Task");
    });

    // Evento para abrir o modal de edição de tarefa
    $(document).on("click", ".edit-task", function (event) {
        event.stopPropagation();
        var taskId = $(this).data("task-id");
        $.get(`/api/tasks/${taskId}`, function (data) {
            openTaskModal(
                data.data.id,
                data.data.column_id,
                data.data.title,
                data.data.description,
                "Edit Task"
            );
        });
    });

    // Evento para excluir uma tarefa
    $(document).on("click", ".delete-task", function (event) {
        event.stopPropagation();
        var taskId = $(this).data("task-id");
        if (confirm("Are you sure you want to delete this task?")) {
            $.ajax({
                url: `/api/tasks/${taskId}`,
                method: "DELETE",
                data: { _token: "{{ csrf_token() }}" },
                success: function (response) {
                    $(`.task[data-task-id="${taskId}"]`).remove();
                },
                error: function (response) {
                    alert("Failed to delete task. Please try again.");
                },
            });
        }
    });

    // Evento para fechar o modal de tarefa
    $(document).on("click", "#close-modal", function () {
        $("#task-modal").fadeOut();
    });

    // Submissão do formulário de tarefa
    $(document).on("submit", "#task-form", function (e) {
        e.preventDefault();
        var taskId = $("#task-id").val();
        var url = taskId ? `/api/tasks/${taskId}` : "/api/tasks";
        var method = taskId ? "PUT" : "POST";
        var taskData = {
            title: $("#title").val(),
            description: $("#description").val(),
            column_id: $("#column-id").val(),
            _token: "{{ csrf_token() }}",
        };

        $.ajax({
            url: url,
            method: method,
            data: taskData,
            success: function (response) {
                var taskHtml = `
                    <div class="task" data-task-id="${response.data.id}">
                        <h4>${response.data.title}</h4>
                        <p>${response.data.description}</p>
                        <button class="edit-task" data-task-id="${response.data.id}">Edit</button>
                        <button class="delete-task" data-task-id="${response.data.id}">Delete</button>
                    </div>`;
                if (!taskId) {
                    $(
                        ".tasks[data-column-id='" +
                            response.data.column_id +
                            "'] .add-task-button"
                    ).before(taskHtml);
                } else {
                    $(`.task[data-task-id="${taskId}"]`).replaceWith(taskHtml);
                }
                $("#task-modal").fadeOut();
            },
            error: function (response) {
                alert("Failed to save task. Please try again.");
            },
        });
    });

    // Função para converter RGB para HEX
    function rgbToHex(rgb) {
        var rgbArr = rgb.match(/\d+/g);
        return rgbArr
            ? "#" +
                  ("0" + parseInt(rgbArr[0], 10).toString(16)).slice(-2) +
                  ("0" + parseInt(rgbArr[1], 10).toString(16)).slice(-2) +
                  ("0" + parseInt(rgbArr[2], 10).toString(16)).slice(-2)
            : rgb;
    }

    // Abrir modal para editar coluna
    $(document).on("click", ".column-header", function (event) {
        event.stopPropagation();
        var columnId = $(this).closest(".column").data("column-id");
        var title = $(this).find("h4").text();
        var headerColor = rgbToHex($(this).css("background-color"));

        $("#column-title").val(title);
        $("#header-background-color").val(headerColor);
        $("#column-id").val(columnId);
        $("#modal-title").text("Edit Column");
        $("#column-modal").fadeIn();
        $("body").addClass("modal-open");
    });

    // Fechar modal de edição de coluna
    $(document).on("click", "#close-column-modal", function () {
        $("#column-modal").fadeOut();
        $("body").removeClass("modal-open");
    });

    // Submissão do formulário de edição de coluna
    $(document).on("submit", "#column-form", function (e) {
        e.preventDefault();
        var columnId = $("#column-id").val();
        var title = $("#column-title").val();
        var headerColor = $("#header-background-color").val();

        $.ajax({
            url: `/api/columns/${columnId}`,
            method: "PATCH",
            data: {
                title: title,
                header_background_color: headerColor,
                _token: "{{ csrf_token() }}",
            },
            success: function (response) {
                var columnHeader = $(
                    `.column[data-column-id="${columnId}"] .column-header`
                );
                columnHeader.find("h4").text(title);
                columnHeader.css("background-color", headerColor);
                $("#column-modal").fadeOut();
                $("body").removeClass("modal-open");
            },
            error: function (response) {
                alert("Failed to update column. Please try again.");
            },
        });
    });

    // Funcionalidade de arrastar e soltar tarefas entre colunas
    $(".tasks")
        .sortable({
            connectWith: ".tasks",
            update: function (event, ui) {
                var columnId = $(this).data("column-id");
                var tasks = $(this).sortable("toArray", {
                    attribute: "data-task-id",
                });

                var orderData = {
                    tasks: tasks.map((taskId, index) => ({
                        id: taskId,
                        order: index + 1,
                        column_id: columnId,
                    })),
                };

                $.ajax({
                    url: "/api/tasks/update-order",
                    method: "POST",
                    data: orderData,
                    success: function (response) {
                        console.log(
                            "Task order updated successfully:",
                            response
                        );
                    },
                    error: function (response) {
                        alert("Failed to update task order. Please try again.");
                    },
                });
            },
        })
        .disableSelection();

    // Funcionalidade de arrastar e soltar colunas
    $(".board")
        .sortable({
            items: ".column",
            update: function (event, ui) {
                var columns = $(this).sortable("toArray", {
                    attribute: "data-column-id",
                });

                var orderData = {
                    columns: columns.map((columnId, index) => ({
                        id: columnId,
                        order: index + 1,
                    })),
                };

                $.ajax({
                    url: "/api/columns/update-order",
                    method: "POST",
                    data: orderData,
                    success: function (response) {
                        console.log(
                            "Column order updated successfully:",
                            response
                        );
                    },
                    error: function (response) {
                        alert(
                            "Failed to update column order. Please try again."
                        );
                    },
                });
            },
        })
        .disableSelection();

    // Função para abrir o modal de confirmação de exclusão de coluna
    function openDeleteColumnModal(columnId) {
        $("#delete-column-modal").data("column-id", columnId).fadeIn();
    }

    $(document).on("click", ".delete-column-button", function (event) {
        event.stopPropagation();
        var columnId = $(this).data("column-id");
        openDeleteColumnModal(columnId);
    });

    $(document).on("click", "#close-delete-column-modal", function () {
        $("#delete-column-modal").fadeOut();
    });

    $(document).on("click", "#cancel-delete-column", function () {
        $("#delete-column-modal").fadeOut();
    });

    $(document).on("click", "#confirm-delete-column", function () {
        var columnId = $("#delete-column-modal").data("column-id");

        $.ajax({
            url: `/api/columns/${columnId}`,
            method: "DELETE",
            success: function (response) {
                $(`.column[data-column-id="${columnId}"]`).remove();
                $("#delete-column-modal").fadeOut();
            },
            error: function (response) {
                alert("Failed to delete column. Please try again.");
            },
        });
    });
});
