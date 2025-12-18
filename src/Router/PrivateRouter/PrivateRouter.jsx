import React from "react";
import { Navigate, useLocation } from "react-router";
import useAuth from "../../Hooks/useAuth/useAuth";
import Loading2 from "../../Components/Loading/Loading2";

const PrivateRouter = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading2></Loading2>;
  }

  if (!user) {
    return <Navigate to={"/login"} state={location?.pathname}></Navigate>;
  }

  return children;
};

export default PrivateRouter;
