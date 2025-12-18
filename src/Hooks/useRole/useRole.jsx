import React from "react";
import useAuth from "../useAuth/useAuth";
import useAxiosSecure from "../useAxiosSecure/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../Components/Loading/Loading";

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { data: role, isLoading } = useQuery({
    queryKey: ["user-role", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/see-user/${user.email}/role`);
      return res.data.result.role;
    },
  });

  if (isLoading || loading) {
    return <Loading></Loading>;
  }

  return { role, isLoading };
};

export default useRole;
