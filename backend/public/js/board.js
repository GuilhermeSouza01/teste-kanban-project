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
    // Evento de clique no botão de edição
    $(document).on("click", ".edit-task", function (event) {
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

    // Evento de clique no botão de exclusão
    $(document).on("click", ".delete-task", function (event) {
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
                    console.log("Task deleted successfully:", response);
                    $(`.task[data-task-id="${taskId}"]`).remove();
                },
                error: function (response) {
                    console.error("Failed to delete task:", response);
                },
            });
        }
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

        var taskData = {
            title: $("#title").val(),
            description: $("#description").val(),
            column_id: $("#column-id").val(),
            _token: "{{ csrf_token() }}",
        };

        console.log("Submitting task:", taskData);

        $.ajax({
            url: url,
            method: method,
            data: taskData,
            success: function (response) {
                console.log("Task saved successfully:", response);

                // Adicionar nova tarefa à coluna se for uma nova tarefa
                if (!taskId) {
                    var newTaskHtml = `
                        <div class="task" data-task-id="${response.data.id}" data-order="${response.data.order}">
                            <h4>${response.data.title}</h4>
                            <p>${response.data.description}</p>
                            <button class="edit-task" data-task-id="${response.data.id}">Edit</button>
                            <button class="delete-task" data-task-id="${response.data.id}">Delete</button>
                        </div>`;
                    $(
                        `.tasks[data-column-id="${response.data.column_id}"]`
                    ).append(newTaskHtml);
                } else {
                    // Atualizar a tarefa existente
                    var taskElement = $(`.task[data-task-id="${taskId}"]`);
                    taskElement.find("h4").text(response.data.title);
                    taskElement.find("p").text(response.data.description);
                }

                $("#task-modal").fadeOut(); // Fechar o modal após salvar
            },
            error: function (response) {
                console.error("Failed to save task:", response);
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
                    console.log("Task deleted successfully:", response);
                    $(`.task[data-task-id="${taskId}"]`).remove();
                },
                error: function (response) {
                    console.error("Failed to delete task:", response);
                },
            });
        }
    });

    // Função para converter Rgb para Hex

    function rgbToHex(rgb) {
        var rgbArr = rgb.match(/\d+/g);
        return rgbArr
            ? "#" +
                  ("0" + parseInt(rgbArr[0], 10).toString(16)).slice(-2) +
                  ("0" + parseInt(rgbArr[1], 10).toString(16)).slice(-2) +
                  ("0" + parseInt(rgbArr[2], 10).toString(16)).slice(-2)
            : rgb;
    }

    $(document).ready(function () {
        // Abrir modal para editar coluna
        $(".column-header").click(function (event) {
            event.stopPropagation(); // Impede que outros eventos sejam acionados

            var columnId = $(this).closest(".column").data("column-id");
            var title = $(this).find("h4").text(); // Captura o texto do <h2>
            var headerColor = rgbToHex($(this).css("background-color")); // Captura a cor de fundo

            $("#column-title").val(title);
            $("#header-background-color").val(headerColor); // Preenche o campo de cor
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

        // Submeter a edição da coluna
        $("#column-form").submit(function (e) {
            e.preventDefault();

            var columnId = $("#column-id").val();
            var title = $("#column-title").val();
            var headerColor = $("#header-background-color").val(); // Captura a nova cor

            var columnData = {
                title: title,
                header_background_color: headerColor, // Inclui a cor no envio
            };

            console.log("Submitting column update:", columnData);

            $.ajax({
                url: `/api/columns/${columnId}`,
                method: "PATCH",
                data: columnData,
                success: function (response) {
                    console.log("Column updated successfully:", response);
                    var columnHeader = $(
                        `.column[data-column-id="${columnId}"] .column-header`
                    );
                    columnHeader.find("h2").text(title); // Atualiza o título
                    columnHeader.css("background-color", headerColor); // Atualiza a cor
                    $("#column-modal").fadeOut();
                    $("body").removeClass("modal-open");
                },
                error: function (response) {
                    console.error("Failed to update column:", response);
                },
            });
        });
    });
    $(document).ready(function () {
        // Funcionalidade para arrastar e soltar tarefas entre colunas
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
                            order: index + 1, // Ordem começa a partir de 1
                            column_id: columnId,
                        })),
                    };

                    console.log("Updating task order in column:", orderData);

                    $.ajax({
                        url: "/api/tasks/update-order",
                        method: "POST",
                        data: orderData,
                        success: function (response) {
                            console.log(
                                "Order updated successfully:",
                                response
                            );
                        },
                        error: function (response) {
                            console.error("Failed to update order:", response);
                        },
                    });
                },
            })
            .disableSelection();
    });

    // Funcionalidade para arrastar e soltar colunas
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
                        order: index + 1, // Ordem começa em 1
                    })),
                };

                console.log("Updating column order:", orderData);

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
                        console.error(
                            "Failed to update column order:",
                            response
                        );
                    },
                });
            },
        })
        .disableSelection();
});
