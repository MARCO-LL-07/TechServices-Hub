import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ClientHome from "./pages/ClientHome";
import ClientDashboard from "./pages/ClientDashboard";

import AdminDashboard from "./pages/AdminDashboard";
import AdminCars from "./pages/AdminCars";
import AdminPayments from "./pages/AdminPayments";
import AdminRentals from "./pages/AdminRentals";
import AdminUsers from "./pages/AdminUsers";

import AdminRoute from "./components/AdminRoute";
import ClientRoute from "./components/ClientRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Cliente Routes */}
        <Route element={<ClientRoute />}>
          <Route path="/client-home" element={<ClientHome />} />
          <Route path="/client" element={<ClientDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/cars" element={<AdminCars />} />
          <Route path="/admin/rentals" element={<AdminRentals />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;