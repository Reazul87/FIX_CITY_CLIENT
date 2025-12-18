import React from "react";
import Forbidden from "../../Components/Forbidden/Forbidden";
import Loading from "../../Components/Loading/Loading";
import useRole from "../../Hooks/useRole/useRole";

const AdminRoute = ({ children }) => {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (role !== "Admin") {
    return <Forbidden></Forbidden>;
  }

  return children;
};

export default AdminRoute;
