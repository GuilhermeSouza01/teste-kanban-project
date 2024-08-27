import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
  background: ${props => props.backgroundColor || '#ccc'};
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
    const [columns, setColumns] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/columns')
            .then(response => {
                console.log('API Response:', response.data);
                setColumns(response.data.data || []);
            })
            .catch(error => console.error('Error fetching columns:', error));
    }, []);

    const handleDragEnd = async result => {

        const { destination, source, draggableId } = result;

        if (!destination) return;

        let updatedColumns;
        let updatedTasks = [];

        if (source.droppableId === destination.droppableId) {
            // Reordenar tarefas dentro da mesma coluna
            const columnId = source.droppableId;
            const column = columns.find(col => col.id === parseInt(columnId));
            const tasks = Array.from(column.tasks);
            const [movedTask] = tasks.splice(source.index, 1);
            tasks.splice(destination.index, 0, movedTask);

            updatedColumns = columns.map(col => {
                if (col.id === parseInt(columnId)) {
                    return { ...col, tasks };
                }
                return col;
            });

            updatedTasks = tasks.map((task, index) => ({
                id: task.id,
                column_id: parseInt(columnId),
                order: index
            }));
        } else {
            // Mover entre colunas
            const startColumnId = source.droppableId;
            const endColumnId = destination.droppableId;

            const startColumn = columns.find(col => col.id === parseInt(startColumnId));
            const endColumn = columns.find(col => col.id === parseInt(endColumnId));
            const startTasks = Array.from(startColumn.tasks);
            const endTasks = Array.from(endColumn.tasks);
            const [movedTask] = startTasks.splice(source.index, 1);
            endTasks.splice(destination.index, 0, movedTask);

            updatedColumns = columns.map(col => {
                if (col.id === parseInt(startColumnId)) {
                    return { ...col, tasks: startTasks };
                }
                if (col.id === parseInt(endColumnId)) {
                    return { ...col, tasks: endTasks };
                }
                return col;
            });

            updatedTasks = [
                ...startTasks.map((task, index) => ({
                    id: task.id,
                    column_id: parseInt(startColumnId),
                    order: index
                })),
                ...endTasks.map((task, index) => ({
                    id: task.id,
                    column_id: parseInt(endColumnId),
                    order: index
                }))
            ];
        }

        setColumns(updatedColumns);

        console.log('Updated Tasks:', updatedTasks);

        try {
            await axios.post('http://localhost:8000/api/tasks/update-order', {
                tasks: updatedTasks
            });
            console.log('Tasks updated successfully');
        } catch (error) {
            console.error('Error updating tasks:', error);
        }
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="all-columns" direction="horizontal">
                {(provided) => (
                    <BoardContainer
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {columns.map((column, index) => (
                            <Droppable key={column.id} droppableId={String(column.id)}>
                                {(provided) => (
                                    <ColumnContainer
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                    >
                                        <ColumnHeader backgroundColor={column.header_background_color}>
                                            {column.title}
                                        </ColumnHeader>
                                        {column.tasks && column.tasks.length > 0 ? (
                                            column.tasks.map((task, index) => (
                                                <Draggable key={task.id} draggableId={String(task.id)} index={index}>
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
                                            ))
                                        ) : (
                                            <p>No tasks available</p>
                                        )}
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
