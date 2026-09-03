import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import PhysicsLab from "./pages/PhysicsLab/PhysicsLab";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/physics" element={<PhysicsLab />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;