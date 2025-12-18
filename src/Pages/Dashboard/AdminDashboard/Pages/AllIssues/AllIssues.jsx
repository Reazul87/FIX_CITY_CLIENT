import React from "react";

// src/pages/AdminDashboard/AllIssues.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useState } from "react";
import useAuth from "../../../../../Hooks/useAuth/useAuth";
import useAxiosSecure from "../../../../../Hooks/useAxiosSecure/useAxiosSecure";
import { useForm } from "react-hook-form";
import getStatusColor from "../../../../Shared/GetStatusColor/getStatusColor";
import toast from "react-hot-toast";
import Loading from "../../../../../Components/Loading/Loading";
const AllIssues = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [showAssignModal, setShowAssignModal] = useState(null);
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const { data: dbUser, isLoading: userLoading } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/see-user/${user.email}`);
      return res.data?.result;
    },
  });

  const { data: issues = [], isLoading: issuesLoading } = useQuery({
    queryKey: ["all-issues", "Pending"],
    queryFn: async () => {
      const res = await axiosSecure.get("/all-issues/admin");
      // const res = await axiosSecure.get("/all-issues/admin?status=Pending");
      return res.data?.data;
    },
  });

  const { data: staff = [], isLoading: staffLoading } = useQuery({
    queryKey: ["staff", "Available"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        "/all-staff?role=Staff&status=Available"
      );
      return res.data?.data;
    },
  });

  const assignMutation = useMutation({
    mutationFn: async ({ issueId, assignedStaff }) => {
      const res = await axiosSecure.patch(
        `/assigning-staff/${issueId}`,
        assignedStaff
      );
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-issues"]);
      setShowAssignModal(null);
      Swal.fire("Assigned!", "Staff has been assigned.", "success");
    },
    onError: () => {
      toast.error("Staff  assign failed");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ issueId, update }) => {
      const res = await axiosSecure.patch(`/issue/${issueId}/reject`, update);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-issues", "Pending"]);
      Swal.fire("Rejected!", "Issue has been rejected.", "info");
    },
    onError: () => {
      toast.error("Issue rejection failed");
    },
  });

  const handleStaffAssign = async (data) => {
    const { staffId } = data;

    const res = await axiosSecure.get(`/user/${staffId}?status=Staff`);
    const { picture, email, name } = res.data.data;
    const assignedStaff = {
      staff_Id: staffId,
      staff_picture: picture,
      staff_name: name,
      staff_email: email,
      trackingId: showAssignModal.trackingId,
    };

    assignMutation.mutate({ issueId: showAssignModal._id, assignedStaff });
  };

  const handleReject = (issue) => {
    Swal.fire({
      title: "Reject Issue?",
      text: "This will mark the issue as rejected.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, reject!",
    }).then((result) => {
      if (result.isConfirmed) {
        const update_info = {
          rejected_id: dbUser._id,
          trackingId: issue.trackingId,
        };
        rejectMutation.mutate({ issueId: issue._id, update: update_info });
      }
    });
  };

  if (loading || issuesLoading || userLoading || staffLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6">All Issues</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned Staff</th>
              <th>Actions</th>
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
                  <div className={`badge ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </div>
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
                  {issue.assigned ? (
                    <div className="flex items-center gap-2">
                      <div className="avatar">
                        <div className="w-8 rounded-full">
                          <img
                            src={
                              issue.staff_picture || "https://i.pravatar.cc/150"
                            }
                          />
                        </div>
                      </div>
                      <span className="text-cyan-600 font-medium text-xs">
                        {issue.staff_name || "assigned"}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Not assigned</span>
                  )}
                </td>
                <td className="flex gap-2">
                  {!issue.assigned && (
                    <button
                      onClick={() => setShowAssignModal(issue)}
                      className="btn btn-sm btn-primary"
                      disabled={issue.rejected}
                    >
                      Assign
                    </button>
                  )}
                  {issue.assigned && (
                    <button className="btn btn-sm btn-outline" disabled>
                      Assign
                    </button>
                  )}
                  {issue.status === "Pending" && (
                    <button
                      onClick={() => handleReject(issue)}
                      className="btn btn-sm btn-error"
                    >
                      Reject
                    </button>
                  )}
                  {issue.rejected && (
                    <button className="btn btn-sm btn-outline" disabled>
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAssignModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-center">Assign Staff</h3>
            <form
              onSubmit={handleSubmit(handleStaffAssign)}
              className="space-y-4 mt-4"
            >
              <select
                {...register("staffId", {
                  required: "Please select a staff member to assign",
                })}
                defaultValue=""
                className={`select w-full ${
                  errors.staffId ? "select-error" : "select-bordered"
                }`}
                disabled={assignMutation.isPending}
              >
                <option value="" disabled>
                  Select a Staff to Assign
                </option>
                {staff.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.email})
                  </option>
                ))}
              </select>
              {errors.staffId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.staffId.message}
                </p>
              )}
              {/*  */}

              <div className="modal-action mt-0">
                <button
                  type="submit"
                  className="btn btn-sm btn-primary"
                  disabled={assignMutation.isPending}
                >
                  {assignMutation.isPending ? "Assigning..." : "Assign Staff"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    reset();
                    setShowAssignModal(null);
                  }}
                  className="btn"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!issuesLoading && issues.length === 0 && (
        <div className="text-center py-10">
          <p className="text-xl text-gray-500">No issues reported yet.</p>
        </div>
      )}
    </div>
  );
};

export default AllIssues;
