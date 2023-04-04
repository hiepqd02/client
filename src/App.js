import './App.css';
import TestTable from './component/TestTable';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<TestTable/>}
        />
      </Routes>
    </Router>  
  );
}

export default App;
