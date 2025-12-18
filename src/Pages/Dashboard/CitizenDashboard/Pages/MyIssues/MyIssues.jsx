import React, { useEffect } from "react";

// src/pages/CitizenDashboard/MyIssues.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "react-router";
import Swal from "sweetalert2";
import { useState } from "react";
import useAuth from "../../../../../Hooks/useAuth/useAuth";
import useAxiosSecure from "../../../../../Hooks/useAxiosSecure/useAxiosSecure";
import toast from "react-hot-toast";
import axios from "axios";
import { useForm } from "react-hook-form";
import getStatusColor from "../../../../Shared/GetStatusColor/getStatusColor";
import Loading from "../../../../../Components/Loading/Loading";

const MyIssues = () => {
  const { user, loading } = useAuth();
  const queryClient = useQueryClient();
  const [editingIssue, setEditingIssue] = useState(null);
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const [filter, setFilter] = useState({
    status: "",
    category: "",
    priority: "",
  });

  const {
    handleSubmit,
    reset,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (editingIssue) {
      setValue("title", editingIssue.title);
      setValue("category", editingIssue.category);
      setValue("location", editingIssue.location);
      setValue("description", editingIssue.description);
    }
  }, [setValue, editingIssue]);

  const { data: issues = [], isLoading } = useQuery({
    queryKey: ["my-issues", user?.email, filter],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/see-issues/${user.email}?status=${filter.status}&priority=${filter.priority}&category=${filter.category}`
      );
      return res.data?.data;
    },
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosSecure.patch(`/update-issue/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["my-issues", user?.email, filter]);
      setEditingIssue(null);
      if (data.success) {
        toast.success("Issue Updated successful !");
        reset();
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (issue) => {
      const res = await axiosSecure.delete(
        `/delete-issue?id=${issue._id}&trackingId=${issue.trackingId}`
      );
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["my-issues", user?.email, "Closed"]);
      if (data.success) {
        toast.success("Issue Deleted successful !");
      }
    },
  });

  const handleEditIssue = async (data) => {
    const { title, category, description, location, image } = data;
    //console.log(data);

    try {
      if (user) {
        let photoURL = editingIssue.image;

        if (image.length > 0) {
          const imgData = new FormData();
          imgData.append("image", image[0]);

          const pictureH = await axios.post(
            `https://api.imgbb.com/1/upload?key=${
              import.meta.env.VITE_IMG_BB_KEY
            }`,
            imgData
          );
          photoURL = pictureH.data.data.display_url;
        }
        const update_info = {
          title,
          category,
          description,
          location,
        };
        if (photoURL) {
          update_info.image = photoURL;
        }

        editMutation.mutate({
          id: editingIssue._id,
          data: {
            title,
            category,
            description,
            location,
            image: photoURL,
            trackingId: editingIssue.trackingId,
          },
        });
      }
    } catch (error) {
      Swal.fire("Error", "Failed to report issue.", "error");
      //console.log(error);
    }
  };

  const handleDeleteIssue = (issue) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(issue);
      }
    });
  };

  if (loading || isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">My Issues</h2>
        <Link to="/dashboard/report-issue" className="btn btn-success">
          Report New Issue
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <select
          className="select select-bordered flex-1"
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          value={filter.status}
        >
          <option value="">All Status</option>
          <option>Pending</option>
          <option>In-Progress</option>
          <option>Resolved</option>
          <option>Closed</option>
        </select>
        <select
          className="select select-bordered flex-1"
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          value={filter.category}
        >
          <option value="">All Categories</option>
          <option>Broken Streetlight</option>
          <option>Pothole</option>
          <option>Water Leakage</option>
          <option>Garbage Overflow</option>
          <option>Damaged Footpath</option>
        </select>
        <select
          className="select select-bordered flex-1"
          onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          value={filter.priority}
        >
          <option value="">All Priority</option>
          <option>High</option>
          <option>Low</option>
        </select>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue._id}>
                <td>
                  <img
                    src={issue.image}
                    className="w-16 h-16 object-cover rounded"
                  />
                </td>
                <td>{issue.title}</td>
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
                <td className="flex gap-2 mt-4">
                  <Link
                    to={`/issue/${issue._id}`}
                    state={location.pathname}
                    className="btn btn-sm btn-info"
                  >
                    View
                  </Link>
                  {issue.status === "Pending" && (
                    <button
                      onClick={() => setEditingIssue(issue)}
                      className="btn btn-sm btn-warning"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteIssue(issue)}
                    disabled={deleteMutation.isPending}
                    className="btn btn-sm btn-error"
                  >
                    {issue && deleteMutation.isPending
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden grid gap-4">
        {issues.map((issue) => (
          <div key={issue._id} className="card bg-base-100 shadow-xl">
            <figure>
              <img
                src={issue.image}
                alt={issue.title}
                className="h-48 w-full object-cover"
              />
            </figure>
            <div className="card-body">
              <h3 className="card-title text-lg">{issue.title}</h3>
              <div className="flex flex-wrap gap-2">
                <div className={`badge ${getStatusColor(issue.status)}`}>
                  {issue.status}
                </div>
                <div
                  className={`badge ${
                    issue.priority === "high" ? "badge-error" : "badge-warning"
                  }`}
                >
                  {issue.priority}
                </div>
              </div>
              <div className="card-actions justify-end mt-4">
                <Link
                  to={`/issue/${issue._id}`}
                  className="btn btn-sm btn-info"
                >
                  View
                </Link>
                {issue.status === "Pending" && (
                  <button
                    onClick={() => setEditingIssue(issue)}
                    className="btn btn-sm btn-warning"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDeleteIssue(issue)}
                  disabled={deleteMutation.isPending}
                  className="btn btn-sm btn-error"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isLoading && issues.length === 0 && (
        <div className="h-80 flex flex-col justify-center items-center py-10">
          <p className="text-xl text-gray-500">No issues found.</p>
          <Link to="/dashboard/report-issue" className="btn btn-success mt-4">
            Report Your First Issue
          </Link>
        </div>
      )}

      {editingIssue && (
        <div className="modal modal-open">
          <div className="modal-box">
            <form
              onSubmit={handleSubmit(handleEditIssue)}
              className="space-y-2"
            >
              {/* Image Upload */}
              <div className="flex flex-col space-y-1">
                <label className="label font-semibold">Upload Image</label>
                <input
                  {...register("image")}
                  type="file"
                  accept="image/*"
                  className="file-input file-input-success focus:border-0 w-full"
                />
                <label className="label text-gray-500">Max 5MB, JPG/PNG</label>
              </div>

              {/* Title */}
              <div className="flex flex-col space-y-1">
                <label className="label font-semibold">Issue Title *</label>
                <input
                  {...register("title", {
                    required: "Title is required",
                    minLength: {
                      value: 10,
                      message: "Title must be at least 10 characters",
                    },
                  })}
                  type="text"
                  placeholder="e.g., Broken Streetlight at Gulshan-2"
                  className="input file-input-success focus:border-0 w-full"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="flex flex-col space-y-1">
                <label className="label font-semibold">Category *</label>
                <select
                  {...register("category", {
                    required: "Please select a category",
                  })}
                  className="select select-success focus-within:border-0 w-full"
                >
                  <option value="">Select Category</option>
                  <option value={"Broken Streetlight"}>
                    Broken Streetlight
                  </option>
                  <option value={"Pothole"}>Pothole</option>
                  <option value={"Water Leakage"}>Water Leakage</option>
                  <option value={"Garbage Overflow"}>Garbage Overflow</option>
                  <option value={"Damaged Footpath"}>Damaged Footpath</option>
                  <option value={"Others"}>Others</option>
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="flex flex-col space-y-1">
                <label className="label font-semibold">Location *</label>
                <input
                  {...register("location", {
                    required: "Location is required",
                    minLength: {
                      value: 5,
                      message: "Location must be at least 5 characters",
                    },
                  })}
                  type="text"
                  placeholder="e.g., Road 12, Block C, Mirpur"
                  className="input file-input-success focus:border-0 w-full"
                  required
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col space-y-1">
                <label className="label font-semibold">Description *</label>
                <textarea
                  {...register("description", {
                    required: "Description is required",
                    minLength: {
                      value: 20,
                      message: "Description must be at least 20 characters",
                    },
                  })}
                  placeholder="Describe the issue in detail..."
                  className="textarea textarea-success focus:border-0 h-25 w-full"
                  required
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className={`btn btn-outline btn-success w-full mt-3 ${
                  isLoading ? "loading" : ""
                }`}
                disabled={editMutation.isPending}
              >
                {editMutation.isPending ? "Updating..." : "Update Issue"}
              </button>
              <button
                type="button"
                className={`btn btn-warning w-full mt-1`}
                onClick={() => {
                  reset();
                  setEditingIssue(null);
                }}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIssues;
