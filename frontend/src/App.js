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

function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* Cliente */}

        <Route path="/client-home" element={<ClientHome />} />

        <Route path="/client" element={<ClientDashboard />} />

        {/* Admin */}

        <Route path="/admin" element={<AdminDashboard />} />

        <Route path="/admin/cars" element={<AdminCars />} />

        <Route
          path="/admin/rentals"
          element={<AdminRentals />}
        />

        <Route
          path="/admin/payments"
          element={<AdminPayments />}
        />

        <Route
          path="/admin/users"
          element={<AdminUsers />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;