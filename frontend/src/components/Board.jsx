import React, { useContext, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { KanbanContext } from "../context/KanbanContext";

const BoardContainer = styled.div`
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  padding: 16px;
`;

const ColumnContainer = styled.div`
  background: #f4f4f4;
  border-radius: 8px;
  margin-right: 16px;
  padding: 8px;
  width: 300px;
  display: flex;
  flex-direction: column;
`;

const ColumnHeader = styled.div`
  background: ${(props) => props.backgroundColor || "#ccc"};
  color: #fff;
  padding: 8px;
  border-radius: 4px;
  font-weight: bold;
`;

const TaskItem = styled.div`
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
  padding: 8px;
`;

function Board() {
  const { columns, setColumns } = useContext(KanbanContext);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/columns")
      .then((response) => {
        setColumns(response.data.data || []);
      })
      .catch((error) => console.error("Error fetching columns:", error));
  }, [setColumns]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;

    if (type === "column") {
      // Moving columns
      const updatedColumns = Array.from(columns);
      const [movedColumn] = updatedColumns.splice(source.index, 1);
      updatedColumns.splice(destination.index, 0, movedColumn);

      setColumns(updatedColumns);

      try {
        await axios.post("http://localhost:8000/api/columns/update-order", {
          columns: updatedColumns.map((column, index) => ({
            id: column.id,
            order: index,
          })),
        });
      } catch (error) {
        console.error("Error updating columns:", error.response.data);
      }
    } else if (type === "task") {
      // Moving tasks
      const startColumnId = source.droppableId;
      const endColumnId = destination.droppableId;

      const startColumn = columns.find(
        (col) => col.id === parseInt(startColumnId)
      );
      const endColumn = columns.find((col) => col.id === parseInt(endColumnId));

      if (!startColumn || !endColumn) return;

      const startTasks = Array.from(startColumn.tasks);
      const endTasks = Array.from(endColumn.tasks);
      const [movedTask] = startTasks.splice(source.index, 1);

      if (startColumnId === endColumnId) {
        // Task moved within the same column
        startTasks.splice(destination.index, 0, movedTask);
        const updatedColumns = columns.map((col) =>
          col.id === parseInt(startColumnId)
            ? { ...col, tasks: startTasks }
            : col
        );

        setColumns(updatedColumns);

        try {
          await axios.post("http://localhost:8000/api/tasks/update-order", {
            tasks: startTasks.map((task, index) => ({
              id: task.id,
              column_id: parseInt(startColumnId),
              order: index,
            })),
          });
        } catch (error) {
          console.error("Error updating tasks:", error.response.data);
        }
      } else {
        // Task moved to a different column
        endTasks.splice(destination.index, 0, movedTask);
        const updatedColumns = columns.map((col) => {
          if (col.id === parseInt(startColumnId)) {
            return { ...col, tasks: startTasks };
          }
          if (col.id === parseInt(endColumnId)) {
            return { ...col, tasks: endTasks };
          }
          return col;
        });

        setColumns(updatedColumns);

        const updatedTasks = [
          ...startTasks.map((task, index) => ({
            id: task.id,
            column_id: parseInt(startColumnId),
            order: index,
          })),
          ...endTasks.map((task, index) => ({
            id: task.id,
            column_id: parseInt(endColumnId),
            order: index,
          })),
        ];

        try {
          await axios.post("http://localhost:8000/api/tasks/update-order", {
            tasks: updatedTasks,
          });
        } catch (error) {
          console.error("Error updating tasks:", error.response.data);
        }
      }
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <BoardContainer ref={provided.innerRef} {...provided.droppableProps}>
            {columns.map((column, index) => (
              <Droppable
                key={column.id}
                droppableId={String(column.id)}
                type="task"
              >
                {(provided) => (
                  <ColumnContainer
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <ColumnHeader
                      backgroundColor={column.header_background_color}
                    >
                      {column.title}
                    </ColumnHeader>
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={String(task.id)}
                        index={index}
                      >
                        {(provided) => (
                          <TaskItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <h4>{task.title}</h4>
                            <p>{task.description}</p>
                          </TaskItem>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ColumnContainer>
                )}
              </Droppable>
            ))}
            {provided.placeholder}
          </BoardContainer>
        )}
      </Droppable>
    </DragDropContext>
  );
}

export default Board;
