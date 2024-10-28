import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ItemPage from "./pages/ItemPage";
import CartPage from "./pages/CartPage";
import Success from "./pages/Success";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BilsPage from "./pages/BilsPage";
import CustomerPage from "./pages/CustomerPage";
import UsersPage from "./pages/UsersPage";
import Userbilpage from "./pages/Userbilpage";
import './App.css'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage></HomePage>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/items"
            element={
              <ProtectedRoute>
                <ItemPage></ItemPage>
              </ProtectedRoute>
            }
          ></Route>
          {/* ------------------------------------------------------- */}

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage></CartPage>
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/bills"
            element={
              <ProtectedRoute>
                <BilsPage></BilsPage>
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UsersPage></UsersPage>
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/CustomerPage"
            element={
              <ProtectedRoute>
                <CustomerPage></CustomerPage>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/userbilPage"
            element={
              <ProtectedRoute>
                <Userbilpage></Userbilpage>
              </ProtectedRoute>
            }
          ></Route>
        
          <Route
            path="/success"
            element={
              <ProtectedRoute>
                <Success></Success>
              </ProtectedRoute>
            }
          ></Route>
        
          {/* ------------------------------------------- */}
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
export function ProtectedRoute({ children }) {
  if (localStorage.getItem("auth")) {
    return children;
  } else {
    return <Navigate to={"/login"}></Navigate>;
  }
}
