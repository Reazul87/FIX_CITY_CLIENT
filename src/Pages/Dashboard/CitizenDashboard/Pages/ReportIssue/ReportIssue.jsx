import React from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../../../Hooks/useAxiosSecure/useAxiosSecure";
import { useForm } from "react-hook-form";
import axios from "axios";
import useAuth from "../../../../../Hooks/useAuth/useAuth";
import toast from "react-hot-toast";
import Loading from "../../../../../Components/Loading/Loading";

const ReportIssue = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { data: db, isLoading: userLoading } = useQuery({
    queryKey: ["dbUser", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/see-user/${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });
  const dbUser = db?.result;

  const {
    data: myIssues = [],
    isLoading,
    reset,
  } = useQuery({
    queryKey: ["my-issues", dbUser?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/see-issues/${dbUser.email}`);
      return res.data;
    },
    enabled: !!dbUser?.email,
  });

  const issueCount = myIssues?.data?.length || 0;
  const isPremium = dbUser?.isPremium;
  const canReport = isPremium || issueCount < 3;

  const createMutation = useMutation({
    mutationFn: async (issue_info) => {
      const res = await axiosSecure.post("/create-issue", issue_info);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["my-issues", dbUser?.email]);

      if (data.success === true) {
        toast.success("Your issue has been submitted successfully.");
        navigate("/dashboard/my-issues");
        reset();
      }
    },
  });

  const handleIssueSubmit = async (data) => {
    const { title, category, description, location, image } = data;
    try {
      if (!canReport) {
        Swal.fire({
          icon: "warning",
          title: "Limit Reached!",
          text: "Free users can report max 3 issues. Subscribe to continue.",
          confirmButtonText: "Go to Profile",
        }).then(() => navigate("/dashboard/profile"));
        return;
      }

      if (user) {
        let photoURL;

        if (image) {
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

        if (dbUser.isBlocked !== true) {
          const issue_info = {
            title,
            category,
            description,
            location,
            image: photoURL,
            issueBy: dbUser.email,
            userId: dbUser._id,
          };
          createMutation.mutate(issue_info);
        } else {
          toast.error("Access denied. Your account is blocked.");
        }
      }
    } catch (e) {
      Swal.fire("Error", "Failed to report issue.", "error");
    }
  };

  if (loading || userLoading) {
    return <Loading></Loading>;
  }
  return (
    <div className="w-11/12 mx-auto py-5 md:py-10 px-2 md:px-4">
      <div className="max-w-2xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body p-2 md:p-6">
            <h2 className="card-title text-2xl md:text-3xl mb-6">
              Report New Issue
            </h2>

            {!isPremium && issueCount >= 3 && (
              <div className="alert alert-error shadow-lg mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div>
                  <h3 className="font-bold">Issue Limit Reached!</h3>
                  <div className="text-xs">
                    You have reported 3 issues. Upgrade to Premium for unlimited
                    reports.
                  </div>
                </div>
                <button
                  onClick={() => navigate("/dashboard/profile")}
                  className="btn btn-sm btn-warning"
                >
                  Subscribe Now
                </button>
              </div>
            )}

            <form
              onSubmit={handleSubmit(handleIssueSubmit)}
              className="space-y-5"
            >
              {/* Image Upload */}
              <div className="flex flex-col space-y-1.5">
                <label className="label font-semibold">Upload Image</label>
                <input
                  {...register("image", { required: "Image is required" })}
                  type="file"
                  accept="image/*"
                  className="file-input file-input-success focus:border-0 w-full"
                  disabled={!canReport}
                />
                {errors.image && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.image.message}
                  </p>
                )}
                <label className="label text-gray-500">Max 5MB, JPG/PNG</label>
              </div>

              {/* Title */}
              <div className="flex flex-col space-y-1.5">
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
                  disabled={!canReport}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Category */}
              <div className="flex flex-col space-y-1.5">
                <label className="label font-semibold">Category *</label>
                <select
                  {...register("category", {
                    required: "Please select a category",
                  })}
                  className="select select-success focus-within:border-0 w-full"
                  disabled={!canReport}
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
              <div className="flex flex-col space-y-1.5">
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
                  disabled={!canReport}
                />
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col space-y-1.5">
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
                  className="textarea textarea-success focus:border-0 h-32 w-full"
                  disabled={!canReport}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className={`btn btn-success w-full mt-6 ${
                  isLoading ? "loading" : ""
                }`}
                disabled={!canReport || createMutation.isPending}
              >
                {createMutation.isPending ? "Submitting..." : "Report Issue"}
              </button>
            </form>

            <div className="mt-6 p-4 bg-base-200 rounded-lg text-center">
              <p className="text-sm">
                You have reported <strong>{issueCount}</strong> issue(s)
                {!isPremium && ` (Max 3 for free users)`}
              </p>
              {isPremium && (
                <div className="badge badge-success mt-2">
                  Premium User – Unlimited
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
