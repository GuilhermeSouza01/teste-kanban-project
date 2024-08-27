/* eslint-disable react/prop-types */
import styled from "styled-components";

const TaskContainer = styled.div`
    background-color: #fff;
    border-radius: 3px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    padding: 10px;
`;

const Task = ({ task }) => {
    return (
        <TaskContainer>
            <h3>{task.title}</h3>
            <p>{task.description}</p>

        </TaskContainer>
    )
}

export default Task