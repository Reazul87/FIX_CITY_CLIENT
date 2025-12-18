import React from "react";
import { NavLink } from "react-router";

const MyLink = ({ children, to, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "font-bold text-primary  bg-transparent"
          : `font-medium transition-all duration-200 hover:text-primary bg-transparent ${className}`
      }
    >
      {children}
    </NavLink>
  );
};

export default MyLink;
