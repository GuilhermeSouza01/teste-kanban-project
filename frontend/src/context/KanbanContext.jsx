/* eslint-disable react/prop-types */
import { createContext, useState } from "react";

export const KanbanContext = createContext();

export const KanbanProvider = ({ children }) => {
  const [columns, setColumns] = useState([]);

  return (
    <KanbanContext.Provider value={{ columns, setColumns }}>
      {children}
    </KanbanContext.Provider>
  );
};
