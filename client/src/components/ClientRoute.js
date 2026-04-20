import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  if (token && user) {
    // For this route, we just need to know if the user is authenticated.
    // The specific role check can be removed if both admins and clients can see it.
    return { isAuthenticated: true };
  }
  return { isAuthenticated: false };
};

const ClientRoute = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  return <Outlet />;
};

export default ClientRoute;
