import React from "react";
import Swal from "sweetalert2";
import useAuth from "../../../Hooks/useAuth/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useRole from "../../../Hooks/useRole/useRole";
import useAxiosSecure from "../../../Hooks/useAxiosSecure/useAxiosSecure";
import photoUpload from "../../../assets/image-upload-icon.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "../../Dashboard/CitizenDashboard/Pages/Payment/InvoicePDF";
import toast from "react-hot-toast";
import Loading from "../../../Components/Loading/Loading";

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading, updateUserProfile } = useAuth();
  const { role, isLoading } = useRole();
  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { data: dbUser, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile", user?.email, role],
    queryFn: async () => {
      const res = await axiosSecure.get(`/see-user/${user.email}?role=${role}`);
      return res.data?.result;
    },
  });

  const { data: paymentData, isLoading: paymentLoading } = useQuery({
    queryKey: ["payment", dbUser?.transactionId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payment/${dbUser.transactionId}`);
      return res.data?.data;
    },
    enabled: !!dbUser?.transactionId,
  });

  const changeStatus = useMutation({
    mutationFn: async ({ id, update }) => {
      const res = await axiosSecure.patch(`/status/${id}/staff`, update);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["user-profile"]);
      if (data.success === true) {
        toast.success(`${data.message}`);
      }
    },
    onError: () => {
      toast.error("Working status update failed");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ email, update_info }) => {
      const res = await axiosSecure.patch(
        `/update-user/${email}/profile`,
        update_info
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user-profile"]);
      Swal.fire("Success", "profile updated!", "success");
    },
  });

  if (loading || isLoading || profileLoading || paymentLoading) {
    return <Loading></Loading>;
  }

  const handleUpdateProfile = async (data) => {
    const { name, photo } = data;
    const img = photo[0];

    try {
      if (user) {
        let photoURL = dbUser?.picture;

        if (img) {
          const imgData = new FormData();
          imgData.append("image", img);

          const pictureG = await axios.post(
            `https://api.imgbb.com/1/upload?key=${
              import.meta.env.VITE_IMG_BB_KEY
            }`,
            imgData
          );
          photoURL = pictureG.data?.data?.display_url;
        }

        if (name || photoURL) {
          await updateUserProfile(name, photoURL);
        }

        const update_info = {
          picture: photoURL,
          name: name,
        };

        updateMutation.mutate({ email: dbUser.email, update_info });
      }
    } catch (e) {
      toast.error("Profile update failed. Please try again.");
    }
  };

  const handleSubscribeProfile = async (dbUser) => {
    const paymentInfo = {
      cost: 1000,
      user_name: dbUser.name,
      user_email: dbUser.email,
      user_id: dbUser._id,
    };
    const res = await axiosSecure.post(
      "/payment-checkout-session",
      paymentInfo
    );
    window.location.assign(res.data.url);
  };

  const handleChangeStatus = () => {
    const status = dbUser?.status === "Available" ? "Offline" : "Available";
    const update = { status };
    changeStatus.mutate({ id: dbUser._id, update });
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-xl mx-auto">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex mb-5 items-center justify-between">
              <h2 className="card-title md:text-3xl text-2xl">My Profile</h2>

              {role === "Staff" && (
                <span
                  onClick={handleChangeStatus}
                  className={`tooltip tooltip-primary badge ${
                    dbUser?.status === "Available"
                      ? "badge-outline badge-success"
                      : "badge-outline badge-primary"
                  } cursor-pointer`}
                  data-tip={`Go ${
                    dbUser?.status === "Available" ? "Offline" : "Available"
                  }`}
                >
                  {dbUser?.status}
                </span>
              )}
            </div>
            {/* Profile Info */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-center mb-6">
              <img
                src={dbUser?.picture}
                // src={dbUser?.picture || user?.photoURL}
                className="w-24 h-24 object-cover rounded-full ring ring-sky-500 ring-offset-base-100 ring-offset-2"
              />
              <div>
                <h3
                  className={`text-xl md:text-2xl lg:text-3xl font-bold ${
                    role === "Admin" || role === "Staff"
                      ? "tooltip tooltip-primary cursor-pointer"
                      : ""
                  }`}
                  data-tip={`
                      ${
                        role === "Admin"
                          ? role
                          : role === "Staff" && "Moderator"
                      }`}
                >
                  {dbUser?.name}
                  {/* {dbUser?.name || user?.displayName} */}

                  <span className="ms-1.5 space-x-1.5 ">
                    {role !== "Citizen" && (
                      <span
                        className={`badge hidden sm:inline ${
                          role === "Admin"
                            ? "badge-error"
                            : role === "Staff" && "badge-secondary"
                        }`}
                      >
                        {role === "Admin"
                          ? role
                          : role === "Staff" && "Moderator"}
                      </span>
                    )}
                    {role === "Citizen" &&
                      (dbUser?.isPremium === true ? (
                        <span className="badge badge-primary">Premium</span>
                      ) : (
                        <span className="badge badge-dash hidden sm:inline">
                          Free
                        </span>
                      ))}
                  </span>
                </h3>
                {/* <p className="text-lg">{dbUser?.email || user?.email}</p> */}
                <p className="text-md md:text-lg">{dbUser?.email}</p>
              </div>
            </div>
            {/*  */}

            {role === "Citizen" && dbUser?.isBlocked && (
              <div className="alert alert-error shadow-lg mb-6">
                <div>
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
                  <span>Your account is blocked. Contact authorities.</span>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit(handleUpdateProfile)}
              className="space-y-4"
            >
              {/* Photo Upload */}
              <div className="space-y-1.5">
                <label className="label font-bold text-black/70">
                  Photo Upload
                </label>
                <div className="flex items-center gap-2.5 mt-1.5">
                  <img src={photoUpload} alt="upload photo" className="h-10" />

                  <input
                    accept="image/*"
                    {...register("photo")}
                    type="file"
                    className="cursor-pointer text-gray-500 hover:text-pink-500 font-medium w-full"
                  />
                </div>
              </div>

              {/* Name */}
              <div className="space-y-1.5">
                <label className="label font-bold text-black/70">
                  Full Name
                </label>
                <input
                  type="text"
                  {...register("name", { required: "Name is required" })}
                  defaultValue={dbUser?.name}
                  className="input rounded-full focus:border-0 focus:outline-pink-300 w-full"
                  placeholder="Name"
                />
                {errors.name && (
                  <p className="text-red-400">{errors.name.message}</p>
                )}
              </div>

              <button type="submit" className="btn btn-error w-full">
                Save Changes
              </button>
            </form>

            {/* Premium Subscribe */}
            {role === "Citizen" && !dbUser?.isPremium && (
              <div className="mt-6 p-4 bg-base-200 rounded-lg">
                <h4 className="font-bold mb-2">Go Premium – ৳1000</h4>
                <p className="text-sm mb-3">
                  Unlimited issue reports + Priority support
                </p>
                <button
                  onClick={() => handleSubscribeProfile(dbUser)}
                  className="btn btn-success w-full"
                >
                  Subscribe Now
                </button>
              </div>
            )}

            {/* PDF Invoice */}
            {role === "Citizen" && dbUser?.isPremium && (
              <PDFDownloadLink
                className="btn btn-info w-full"
                document={<InvoicePDF user={paymentData} />}
                fileName="Profile Premium Invoice.pdf"
              >
                Download Invoice (PDF)
              </PDFDownloadLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
