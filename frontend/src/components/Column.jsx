/* eslint-disable react/prop-types */

import Task from './Task';
import styled from 'styled-components';

const ColumnContainer = styled.div`
  background-color: #f4f5f7;
  border-radius: 3px;
  padding: 10px;
  width: 300px;
`;

const ColumnTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Column = ({ column }) => {
    return (
        <ColumnContainer>
            <ColumnTitle>{column.title}</ColumnTitle>
            {column.tasks.map(task => (
                <Task key={task.id} task={task} />
            ))}
        </ColumnContainer>
    );
};

export default Column;
