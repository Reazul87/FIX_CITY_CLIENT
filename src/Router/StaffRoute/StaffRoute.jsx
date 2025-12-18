import React from "react";
import Forbidden from "../../Components/Forbidden/Forbidden";
import Loading from "../../Components/Loading/Loading";
import useRole from "../../Hooks/useRole/useRole";
import Loading2 from "../../Components/Loading/Loading2";

const StaffRoute = ({ children }) => {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (role !== "Staff") {
    return <Forbidden></Forbidden>;
  }

  return children;
};

export default StaffRoute;
