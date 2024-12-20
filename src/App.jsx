import { BrowserRouter, Route, Routes } from "react-router";
import AppLayout from "./pages/AppLayout";

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route index element={<AppLayout/>}>

      </Route>
    </Routes>
  </BrowserRouter>
  )

}

export default App;