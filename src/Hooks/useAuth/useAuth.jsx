import React, { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext/AuthContext";

const useAuth = () => {
  const authentication = useContext(AuthContext);
  return authentication;
};

export default useAuth;
