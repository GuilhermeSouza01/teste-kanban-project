$(document).ready(function () {
    // Função para abrir o modal de tarefa
    function openTaskModal(
        taskId = "",
        columnId = "",
        title = "",
        description = "",
        modalTitle = "Criar Tarefa"
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
        openTaskModal("", $(this).data("column-id"), "", "", "Criar Tarefa");
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

    // Evento para excluir uma tarefa - abre o modal de confirmação
    $(document).on("click", ".delete-task", function (event) {
        event.stopPropagation();
        var taskId = $(this).data("task-id");
        openDeleteTaskModal(taskId);
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
                        <button class="edit-task btn-edit" data-task-id="${response.data.id}">Edit</button>
                        <button class="delete-task btn-delete" data-task-id="${response.data.id}">Delete</button>
                    </div>`;
                $("#task-modal").fadeOut(400, function () {
                    if (!taskId) {
                        // Adiciona a nova tarefa antes do botão add-task-button
                        $(
                            ".column[data-column-id='" +
                                response.data.column_id +
                                "'] .tasks"
                        ).append(taskHtml);
                    } else {
                        // Atualiza a tarefa existente
                        $(`.task[data-task-id="${taskId}"]`).replaceWith(
                            taskHtml
                        );
                    }
                });
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

    // Função para abrir o modal de confirmação de exclusão de tarefa
    function openDeleteTaskModal(taskId) {
        $("#delete-task-modal").data("task-id", taskId).fadeIn();
    }

    $(document).on("click", ".delete-task", function (event) {
        event.stopPropagation();
        var taskId = $(this).data("task-id");
        openDeleteTaskModal(taskId);
    });

    $(document).on("click", "#cancel-delete-task", function () {
        $("#delete-task-modal").fadeOut();
    });

    $(document).on("click", "#confirm-delete-task", function () {
        var taskId = $("#delete-task-modal").data("task-id");

        $.ajax({
            url: `/api/tasks/${taskId}`,
            method: "DELETE",
            success: function (response) {
                $(`.task[data-task-id="${taskId}"]`).remove();
                $("#delete-task-modal").fadeOut();
            },
            error: function (response) {
                alert("Failed to delete task. Please try again.");
            },
        });
    });

    // Função para abrir o modal de  criação de coluna
    function openColumnModal(columnId = "", title = "", headerColor = "") {
        $("#column-id").val(columnId);
        $("#column-title").val(title);
        $("#header-background-color").val(headerColor);
        $("#modal-title").text("Criar Coluna");
        $("#add-column-modal").fadeIn();
    }

    // Evento para abrir o modal de adicionar nova coluna
    $(document).on("click", ".add-column-button", function (event) {
        event.stopPropagation();
        openColumnModal("", "", "");
    });

    // Evento para fechar o modal de adicionar coluna
    $(document).on("click", "#close-add-column-modal", function () {
        $("#add-column-modal").fadeOut();
    });

    // Submissão do formulário de adicionar coluna
    $(document).on("submit", "#add-column-form", function (e) {
        e.preventDefault();
        var columnId = $("#column-id").val();
        var title = $("#column-title").val();
        var headerColor = $("#header-background-color").val();

        var url = columnId ? `/api/columns/${columnId}` : "/api/columns";
        var method = columnId ? "PATCH" : "POST";
        var columnData = {
            title: title,
            header_background_color: headerColor,
            _token: "{{ csrf_token() }}",
        };

        $.ajax({
            url: url,
            method: method,
            data: columnData,
            success: function (response) {
                if (!columnId) {
                    // Se for uma nova coluna, adiciona ao DOM
                    var newColumnHtml = `
                        <div class="column" data-column-id="${response.data.id}">
                            <div class="column-header" style="background-color: ${response.data.header_background_color}">
                                <h4>${response.data.title}</h4>
                                <button class="delete-column-button" data-column-id="${response.data.id}">
                                    <span class="icon">×</span>
                                </button>
                            </div>
                            <div class="tasks" data-column-id="${response.data.id}">
                                <div class="task add-task-button" data-column-id="${response.data.id}">
                                    <span>+</span>
                                </div>
                            </div>
                        </div>`;
                    $(".board").append(newColumnHtml);
                } else {
                    // Se for uma edição, atualiza a coluna existente
                    var columnHeader = $(
                        `.column[data-column-id="${columnId}"] .column-header`
                    );
                    columnHeader.find("h4").text(title);
                    columnHeader.css("background-color", headerColor);
                }
                $("#add-column-modal").fadeOut();
            },
            error: function (response) {
                alert("Failed to save column. Please try again.");
            },
        });
    });

    // Função para abrir o modal de editar o header da coluna

    function openEditColumnModal(columnId = "", title = "", headerColor = "") {
        $("#column-id").val(columnId);
        $("#edit-column-title").val(title);
        $("#edit-header-background-color").val(headerColor);
        $("#edit-column-modal").fadeIn();
    }

    // Evento para abrir o modal de editar coluna

    $(document).on("click", ".column-header", function (event) {
        event.stopPropagation();
        var columnId = $(this).closest(".column").data("column-id");
        var title = $(this).find("h4").text();
        var headerColor = rgbToHex($(this).css("background-color"));

        console.log("Column ID:", columnId);
        console.log("Title:", title);
        console.log("Header Color:", headerColor);

        openEditColumnModal(columnId, title, headerColor);
    });

    // Evento para fechar o modal de editar coluna

    $(document).on("click", "#close-edit-column-modal", function () {
        $("#edit-column-modal").fadeOut();
    });

    // Submissão do formulário de editar coluna

    $(document).on("submit", "#edit-column-form", function (e) {
        e.preventDefault();
        var columnId = $("#column-id").val();
        var title = $("#edit-column-title").val();
        var headerColor = $("#edit-header-background-color").val();

        $.ajax({
            url: `/api/columns/${columnId}`,
            method: "PATCH",
            data: {
                title: title,
                header_background_color: headerColor,
            },
            success: function (response) {
                var columnHeader = $(
                    `.column[data-column-id="${columnId}"] .column-header`
                );
                columnHeader.find("h4").text(title);
                columnHeader.css("background-color", headerColor);
                $("#edit-column-modal").fadeOut();
            },
            error: function (response) {
                alert("Failed to update column. Please try again.");
            },
        });
    });
});
