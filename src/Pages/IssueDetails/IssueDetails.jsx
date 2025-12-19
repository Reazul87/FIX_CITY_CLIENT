import React, { useEffect, useState } from "react";

import { useParams, Link, useNavigate, useLocation } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../Hooks/useAuth/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure/useAxiosSecure";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDFBoost from "../Dashboard/CitizenDashboard/Pages/Payment/InvoicePDFBoost";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import axios from "axios";
import getStatusColor from "../Shared/GetStatusColor/getStatusColor";
import Loading2 from "../../Components/Loading/Loading2";

const IssueDetails = () => {
  const {
    handleSubmit,
    reset,
    register,
    setValue,
    formState: { errors },
  } = useForm();

  const { id } = useParams();
  const { user, loading } = useAuth();
  const [editingIssue, setEditingIssue] = useState(null);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  console.log(editingIssue);

  useEffect(() => {
    if (editingIssue) {
      setValue("title", editingIssue.title);
      setValue("category", editingIssue.category);
      setValue("location", editingIssue.location);
      setValue("description", editingIssue.description);
    }
  }, [setValue, editingIssue]);

  const { data: dbUser, isLoading: userLoading } = useQuery({
    queryKey: ["dbUser", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/see-user/${user.email}`);
      return res.data?.result;
    },
  });

  const { data: issue, isLoading: issueLoading } = useQuery({
    queryKey: ["issue-details"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/issue/${id}`);
      return res.data?.data;
    },
  });

  const { data: paymentData, isLoading: paymentLoading } = useQuery({
    queryKey: ["payment", issue?.transactionId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payment/${issue?.transactionId}`);
      return res.data?.data;
    },
    enabled: !!issue?.transactionId,
  });

  const editMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      const res = await axiosSecure.patch(`/update-issue/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      // queryClient.invalidateQueries(["issue-details"]);
      queryClient.invalidateQueries(["trackings"]);
      if (data.success) {
        setEditingIssue(null);
        reset();
        toast.success("Issue Updated successful");
      }
    },
    onError: (e) => {
      console.log(e);
      toast.error(e.response.data.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/delete-issue?id=${id}`);
      return res.data;
    },
    onSuccess: () => {
      navigate("/dashboard/my-issues");
      Swal.fire("Deleted!", "Issue deleted.", "success");
    },

    onError: (err) => {
      console.error("Delete issue Error:", err);
      toast.error("Delete failed");
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

        editMutation.mutate({
          id: editingIssue._id,
          data: {
            title,
            category,
            description,
            location,
            image: photoURL,
            trackingId: editingIssue.trackingId,
            issueBy: editingIssue.issueBy,
          },
        });
      }
    } catch (error) {
      Swal.fire("Error", "Failed to report issue.", "error");
      //console.log(error);
    }
  };

  const handleDeleteIssue = (id) => {
    Swal.fire({
      title: "Delete?",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
        //console.log(deleteMutation);
      }
    });
  };

  const handleBoostIssue = (issue) => {
    Swal.fire({
      title: "Boost Issue – ৳100",
      text: "Make it High Priority",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (dbUser.isBlocked !== true) {
          const paymentInfo = {
            cost: 100,
            issue_name: issue.title,
            issueBy: issue.issueBy,
            issue_id: issue._id,
            trackingId: issue.trackingId,
          };
          //console.log({ issue, paymentInfo });
          const res = await axiosSecure.post(
            "/boost-issue-payment-checkout-session",
            paymentInfo
          );
          window.location.assign(res.data.url);
          //console.log(res.data);
        } else {
          toast.error("Access denied. Your account is blocked.");
        }
      }
    });
  };
  //console.log(issue);

  const { data: trackings, isLoading: trackingsLoading } = useQuery({
    queryKey: ["trackings"],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/issue-trackings/${issue?.trackingId}`
      );
      return res.data?.data;
    },
    enabled: !!issue?.trackingId,
  });
  //console.log(trackings);

  if (
    loading ||
    userLoading ||
    issueLoading ||
    paymentLoading ||
    trackingsLoading
  ) {
    return <Loading2></Loading2>;
  }

  const isOwner = dbUser?._id === issue?.userId;
  const canEdit = isOwner && issue?.status === "Pending";
  const canDelete = isOwner;

  return (
    <div className="w-11/12 mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="card lg:col-span-2">
          <figure className="p-3">
            <img
              src={issue?.image}
              className="w-full h-64 object-cover rounded-lg"
            />
          </figure>
          <div className="card-body p-4">
            <h2 className="flex items-center">
              Title :{" "}
              <span className="card-title text-lg ms-1.5">{issue?.title}</span>
            </h2>
            <p className="flex items-center">
              Location :{" "}
              <span className="text-sm text-gray-600 ms-1.5">
                {issue?.location}
              </span>
            </p>
            <div className="flex items-center">
              Category :
              <span className="badge badge-outline ms-1.5">
                {issue?.category}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              <div className="flex items-center">
                Status :{" "}
                <span
                  className={`badge badge-error ${getStatusColor(
                    issue?.status
                  )} ms-1.5`}
                >
                  {issue?.status}
                </span>
              </div>
              <div className="flex items-center">
                Priority :{" "}
                <span
                  className={`badge ${
                    issue?.priority === "high" ? "badge-error" : "badge-warning"
                  } ms-1.5`}
                >
                  {issue?.priority}
                </span>
              </div>
            </div>

            {editingIssue && (
              <div className="modal modal-open">
                <div className="modal-box">
                  <form
                    onSubmit={handleSubmit(handleEditIssue)}
                    className="space-y-2"
                  >
                    {/* Image Upload */}
                    <div className="flex flex-col space-y-1">
                      <label className="label font-semibold">
                        Upload Image
                      </label>
                      <input
                        {...register("image")}
                        type="file"
                        accept="image/*"
                        className="file-input file-input-success focus:border-0 w-full"
                      />
                      <label className="label text-gray-500">
                        Max 5MB, JPG/PNG
                      </label>
                    </div>

                    {/* Title */}
                    <div className="flex flex-col space-y-1">
                      <label className="label font-semibold">
                        Issue Title *
                      </label>
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
                        <option value={"Garbage Overflow"}>
                          Garbage Overflow
                        </option>
                        <option value={"Damaged Footpath"}>
                          Damaged Footpath
                        </option>
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
                      />
                      {errors.location && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.location.message}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col space-y-1">
                      <label className="label font-semibold">
                        Description *
                      </label>
                      <textarea
                        {...register("description", {
                          required: "Description is required",
                          minLength: {
                            value: 20,
                            message:
                              "Description must be at least 20 characters",
                          },
                        })}
                        placeholder="Describe the issue in detail..."
                        className="textarea textarea-success focus:border-0 h-25 w-full"
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
                        issueLoading ? "loading" : ""
                      }`}
                      disabled={issueLoading}
                    >
                      {issueLoading ? "Updating..." : "Update Issue"}
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

            <div className="flex gap-2 flex-col md:flex-row md:justify-between mt-6">
              {canEdit && (
                <button
                  onClick={() => setEditingIssue(issue)}
                  className="btn btn-warning btn-sm"
                >
                  Edit
                </button>
              )}
              {canDelete && (
                <button
                  onClick={() => handleDeleteIssue(issue._id)}
                  className="btn btn-error btn-sm"
                >
                  Delete
                </button>
              )}
              {issue?.priority === "Low" && (
                <button
                  onClick={() => handleBoostIssue(issue)}
                  className="btn btn-success btn-sm"
                  disabled={issue.isBoosted}
                >
                  Boost (৳100)
                </button>
              )}
              {issue?.isBoosted === true && (
                <PDFDownloadLink
                  className="btn btn-outline btn-success mb-6"
                  document={<InvoicePDFBoost issue={paymentData} />}
                  fileName="Issues Boosted Invoice.pdf"
                >
                  {({ loading }) =>
                    loading ? "Generating..." : "Download Invoice (PDF)"
                  }
                </PDFDownloadLink>
              )}

              <Link
                to={location.state ? location.state : "/all-issues/general"}
                className="btn btn-outline btn-sm"
              >
                Back
              </Link>
            </div>
          </div>
        </div>

        <div>
          {issue?.assigned && (
            <div className="card bg-base-200 p-4 mb-6">
              <h3 className="font-bold mb-2 text-center md:text-left">
                Assigned Staff
              </h3>
              <div className="flex flex-col md:flex-row items-center gap-3">
                <img
                  src={issue.staff_picture}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{issue.staff_name}</p>
                  <p className="text-sm text-gray-600">{issue.staff_email}</p>
                </div>
              </div>
            </div>
          )}

          <ul className="timeline timeline-vertical overflow-auto h-80">
            {trackings?.map((tracking, index) => (
              <li key={tracking._id}>
                {index !== 0 && <hr className="bg-primary" />}
                <div className="timeline-start timeline-box md:timeline-start">
                  <time className="font-mono italic text-sm">
                    {new Date(tracking.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <div className="timeline-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-5 h-5 text-primary"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="timeline-end timeline-box mb-10 md:mb-0">
                  <p className="font-bold text-primary">
                    {tracking.status}
                    <span className="text-sm font-normal text-gray-600 ml-2">
                      by {tracking.by}
                    </span>
                  </p>
                  <p className="mt-1 text-gray-700">{tracking.message}</p>
                </div>
                {index !== trackings.length - 1 && (
                  <hr className="bg-primary" />
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IssueDetails;
