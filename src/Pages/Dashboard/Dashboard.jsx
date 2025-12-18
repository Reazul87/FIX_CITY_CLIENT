import React from "react";
import useRole from "../../Hooks/useRole/useRole";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import StaffDashboard from "./StaffDashboard/StaffDashboard";
import CitizenDashboard from "./CitizenDashboard/CitizenDashboard";
import Loading from "../../Components/Loading/Loading";

const Dashboard = () => {
  const { role, isLoading } = useRole();

  if (isLoading) {
    return <Loading></Loading>;
  }

  if (role === "Admin") {
    return <AdminDashboard></AdminDashboard>;
  } else if (role === "Staff") {
    return <StaffDashboard></StaffDashboard>;
  } else if (role === "Citizen") {
    return <CitizenDashboard></CitizenDashboard>;
  }
};

export default Dashboard;
