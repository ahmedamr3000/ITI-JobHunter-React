import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const ProtectedRoute = () => {
  const { token } = useAuthStore();

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
