import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import { Eye, EyeClosed } from "lucide-react";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import photoUpload from "../../assets/image-upload-icon.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import useAxiosSecure from "../../Hooks/useAxiosSecure/useAxiosSecure";
import { FcGoogle } from "react-icons/fc";
import { useMutation } from "@tanstack/react-query";
import Loading2 from "../../Components/Loading/Loading2";

const Register = () => {
  const { setLoading, loading, signInWithGoogle } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [show, setShow] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();

  const createMutation = useMutation({
    mutationFn: async (update_info) => {
      const res = await axiosSecure.post("/create-user", update_info);
      return res.data;
    },
    onSuccess: (data) => {
      console.log(data);
      toast.success("Account created successfully.");
      navigate("/login");
    },
  });

  const createGoogleMutation = useMutation({
    mutationFn: async (update_info) => {
      const res = await axiosSecure.post("/create-google-user", update_info);
      return res.data;
    },
    onSuccess: (data) => {
      // console.log(data);
      if (!data.success) {
        toast.success("Google Login Successful");
        navigate(location.state ? location.state : "/");
      } else {
        toast.success("Google Registration Successful");
        navigate(location.state ? location.state : "/");
      }
    },
  });

  const handleRegisterUser = async (data) => {
    const { email, password, photo, name } = data;
    const img = photo && photo.length > 0 ? photo[0] : null;
    try {
      let photoURL = "https://i.pravatar.cc/1080";

      if (img) {
        const imgData = new FormData();
        imgData.append("image", img);

        const pictureG = await axios.post(
          `https://api.imgbb.com/1/upload?key=${
            import.meta.env.VITE_IMG_BB_KEY
          }`,
          imgData
        );
        photoURL = pictureG.data.data.display_url;
      }

      const user_info = {
        picture: photoURL,
        name,
        email,
        password,
      };
      createMutation.mutate(user_info);
    } catch (error) {
      const message =
        error.code === "auth/email-already-in-use"
          ? "Email already registered"
          : "Registration failed";
      toast.error(message);
      console.error("Registration failed");
    } finally {
      if (loading) setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then(async (result) => {
        const user = result.user;
        const google = user.providerData[0].providerId;

        const user_info = {
          picture: user.photoURL,
          name: user.displayName,
          email: user.email,
          provider: google,
          uid: user.uid,
        };

        createGoogleMutation.mutate(user_info);
      })
      .catch((e) => {
        console.error("Google registration failed:", e);
        toast.error("Google registration failed");
      })
      .finally(() => {
        if (loading) setLoading(false);
      });
  };

  if (loading) {
    return <Loading2></Loading2>;
  }

  const PASSWORD_REGEX = {
    hasUpperCase: /(?=.*[A-Z])/,
    hasLowerCase: /(?=.*[a-z])/,
    hasNumber: /(?=.*[0-9])/,
  };

  const EMAIL_REGEX = {
    allowEmail: /\.(com|net|org)$/i,
  };

  return (
    <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-xl my-10 border border-gray-100">
      <title>Registration</title>
      <div className="card-body">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-[#173A75]">
            Create Account
          </h1>
          <p className="text-gray-500 mt-2">
            By joining the FIX CITY community, you become a direct partner in
            developing and maintaining our public infrastructure. Let's make our
            city better, together
          </p>
        </div>
        <form onSubmit={handleSubmit(handleRegisterUser)}>
          <fieldset className="fieldset">
            {/* Photo Upload */}
            <div className="space-y-1.5">
              <label htmlFor="photo" className="label font-bold text-black/70">
                Photo Upload
              </label>
              <div className="flex items-center gap-2.5 mt-1.5">
                <img src={photoUpload} alt="upload photo" className="h-10" />

                <input
                  accept="image/*"
                  {...register("photo", { required: "Photo is required" })}
                  type="file"
                  className="cursor-pointer text-gray-500 hover:text-pink-500 font-medium"
                />
              </div>
              {errors.photo && (
                <p className="text-red-400">{errors.photo.message}</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <label htmlFor="name" className="label font-bold text-black/70">
                Full Name
              </label>
              <input
                type="text"
                {...register("name", { required: "Name is required" })}
                className="input rounded-full focus:border-0 focus:outline-pink-300 w-full"
                placeholder="Name"
              />
              {errors.name && (
                <p className="text-red-400">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="label font-bold text-black/70">
                Email Address
              </label>

              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                  validate: {
                    allowEmail: (value) => {
                      return (
                        EMAIL_REGEX.allowEmail.test(value) ||
                        "Must end with .com, .net, or .org"
                      );
                    },
                  },
                })}
                className="input rounded-full focus:border-0 focus:outline-pink-300 w-full"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="label font-bold text-black/70"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={show ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must have at least 6 characters",
                    },
                    validate: {
                      hasUpperCase: (value) => {
                        return (
                          PASSWORD_REGEX.hasUpperCase.test(value) ||
                          "Password must include at least one uppercase letter"
                        );
                      },
                      hasLowerCase: (value) => {
                        return (
                          PASSWORD_REGEX.hasLowerCase.test(value) ||
                          "Password must include at least one lowercase letter"
                        );
                      },
                      hasNumber: (value) => {
                        return (
                          PASSWORD_REGEX.hasNumber.test(value) ||
                          "Password must include at least one number"
                        );
                      },
                    },
                  })}
                  className="input rounded-full focus:border-0 focus:outline-pink-300 w-full"
                  placeholder="••••••••"
                />

                <button
                  className="absolute top-2.5 right-5 text-gray-500 cursor-pointer z-10"
                  type="button"
                  onClick={() => setShow(!show)}
                >
                  {show ? (
                    <EyeClosed size={20}></EyeClosed>
                  ) : (
                    <Eye size={20}></Eye>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400">{errors.password.message}</p>
              )}
            </div>

            <button
              className={`btn mt-4 text-white rounded-full bg-gradient-to-r from-[#FF974D] to-[#FF6F00] hover:from-[#FF6F00] hover:to-[#FF974D]`}
            >
              Register
            </button>
          </fieldset>
        </form>

        <div className="flex items-center">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-4 text-sm text-gray-500">OR</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          className="btn bg-white rounded-full text-black border-[#e5e5e5]"
        >
          <FcGoogle />
          Login with Google
        </button>

        <p className="text-center">
          Already have an account? Please{" "}
          <Link className="text-blue-500 hover:text-blue-800" to="/login">
            Login
          </Link>{" "}
        </p>
      </div>
    </div>
  );
};

export default Register;
