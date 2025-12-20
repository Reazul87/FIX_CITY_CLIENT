import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../../Hooks/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";
import Loading from "../../../../../Components/Loading/Loading";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["manage-users", "Citizen"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/all-users?role=Citizen`);
      return res.data?.data;
    },
  });

  const userMutation = useMutation({
    mutationFn: async ({ update }) => {
      const res = await axiosSecure.patch("/block-unblock", update);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["manage-users", "Citizen"]);
      toast.success("User status updated");
    },
    onError: () => {
      toast.error("User status updated failed");
    },
  });

  const handleUpdateToggle = (user, isBlocked) => {
    const action = isBlocked ? "block" : "unblock";

    Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${action} this user?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${action} it!`,
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const update = {
          isBlocked: isBlocked,
          id: user._id,
        };
        userMutation.mutate({ update });
      }
    });
  };

  if (isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">Manage Users</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subscription</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <img
                        src={user.picture}
                        alt={user.name}
                      />
                    </div>
                  </div>
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  {user.isPremium ? (
                    <div className="badge badge-success">Premium</div>
                  ) : (
                    <div className="badge badge-warning">Free</div>
                  )}
                </td>
                <td>
                  {user.isBlocked ? (
                    <div className="badge badge-error">Blocked</div>
                  ) : (
                    <div className="badge badge-success">Active</div>
                  )}
                </td>
                <td>
                  {user.isBlocked ? (
                    <button
                      onClick={() => handleUpdateToggle(user, false)}
                      className="btn btn-sm btn-error"
                    >
                      Unblock
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateToggle(user, true)}
                      className="btn btn-sm btn-success"
                    >
                      Block
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!isLoading && users.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">No citizen users found.</p>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
