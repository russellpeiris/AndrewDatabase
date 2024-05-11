import { BrowserRouter, Route, Routes } from "react-router-dom";
import Create from "./components/createModal/Create";
import Home from "./pages/home/Home";

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
