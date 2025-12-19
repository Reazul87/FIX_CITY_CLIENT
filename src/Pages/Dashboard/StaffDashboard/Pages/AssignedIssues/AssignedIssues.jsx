import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useState } from "react";
import useAuth from "../../../../../Hooks/useAuth/useAuth";
import useAxiosSecure from "../../../../../Hooks/useAxiosSecure/useAxiosSecure";
import getStatusColor from "../../../../Shared/GetStatusColor/getStatusColor";
import Loading from "../../../../../Components/Loading/Loading";
import toast from "react-hot-toast";

const AssignedIssues = () => {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState({ status: "", priority: "" });
  const axiosSecure = useAxiosSecure();

  const { data: dbUser } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/see-user/${user.email}`);
      return res.data?.result;
    },
  }); 

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["assigned-issues", dbUser?._id, filter],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/issue/${dbUser._id.toString()}/assigned?status=${
          filter.status
        }&priority=${filter.priority}`
      );
      return res.data?.data;
    },
    enabled: !!dbUser,
  });

  const changeStatus = useMutation({
    mutationFn: async ({ issue, status }) => { 
      const update_info = {
        status,
        trackingId: issue.trackingId,
      };

      const res = await axiosSecure.patch(
        `/issue/status/${issue._id}`,
        update_info
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["assigned-issues", user._id]);
      Swal.fire("Updated!", "Issue status changed.", "success");
    },
    onError: () => {
      toast.error("Issue status change failed");
    },
  });

  const handleStatusChange = (issue, newStatus) => {
    changeStatus.mutate({ issue, status: newStatus });
  };

  if (loading || isLoading) {
    return <Loading></Loading>;
  }

  const getNextStatuses = (current) => {
    const flow = {
      Pending: ["In-progress"],
      "In-progress": ["Working"],
      Working: ["Resolved"],
      Resolved: ["Closed"],
      Closed: [],
    };
    return flow[current] || [];
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-center md:text-left">
        Assigned Issues
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <select
          className="select select-bordered w-full"
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option>Pending</option>
          <option>In-progress</option>
          <option>Working</option>
          <option>Resolved</option>
          <option>Closed</option>
        </select>

        <select
          className="select select-bordered w-full"
          value={filter.priority}
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
        >
          <option value="">All Priority</option>
          <option>High</option>
          <option>Low</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Change Status</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr
                key={issue._id}
                className={issue.priority === "high" ? "bg-yellow-50" : ""}
              >
                <td className="font-medium">{issue.title}</td>
                <td>{issue.category}</td>
                <td>
                  <span
                    className={`badge  ${getStatusColor(issue.status)} ${
                      issue.status === "In-progress" ? "px-0" : ""
                    }`}
                  >
                    {issue.status}
                  </span>
                </td>
                <td>
                  <div
                    className={`badge ${
                      issue.priority === "high"
                        ? "badge-error"
                        : "badge-warning"
                    }`}
                  >
                    {issue.priority}
                  </div>
                </td>
                <td>
                  <div className="dropdown dropdown-end">
                    <label
                      disabled={issue.status === "Closed" && true}
                      tabIndex={0}
                      className="btn btn-sm btn-outline btn-primary"
                    >
                      Change Status
                    </label>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-0.5 shadow bg-base-100 rounded-box w-27"
                    >
                      {getNextStatuses(issue.status).map((status) => (
                        <li key={status}>
                          <button
                            onClick={() => handleStatusChange(issue, status)}
                          >
                            {status}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!isLoading && issues.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">
            No issues assigned to you yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignedIssues;
