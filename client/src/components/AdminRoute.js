import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  if (token && user) {
    return { isAuthenticated: true, isAdmin: String(user.rol).toLowerCase() === "admin" };
  }
  return { isAuthenticated: false, isAdmin: false };
};

const AdminRoute = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!isAdmin) {
    return <Navigate to="/client-home" />; 
  }

  return <Outlet />;
};

export default AdminRoute;
