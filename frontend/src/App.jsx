import "./App.css";
import Board from "./components/Board";
import { KanbanProvider } from "./context/KanbanContext";
import GlobalStyles from "./styles/GlobalStyles";

function App() {
  return (
    <>
      <GlobalStyles />
      <KanbanProvider>
        <Board />
      </KanbanProvider>
    </>
  );
}

export default App;
