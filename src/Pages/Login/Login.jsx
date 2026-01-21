import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Eye, EyeClosed } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../../Context/AuthContext/AuthContext";
import { useForm } from "react-hook-form";
import useAxiosSecure from "../../Hooks/useAxiosSecure/useAxiosSecure";
import { FcGoogle } from "react-icons/fc";
import { useMutation } from "@tanstack/react-query";
import Loading2 from "../../Components/Loading/Loading2";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signInUser, setLoading, loading, signInWithGoogle } =
    useContext(AuthContext);
  const [show, setShow] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const location = useLocation();

  const loginMutation = useMutation({
    mutationFn: async (update_info) => {
      const res = await axiosSecure.post("/login-user", update_info);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success === true) {
        toast.success("Login Successful");
        if (data.data.role === "Staff" || data.data.role === "Admin") {
          navigate(location.state ? location.state : "/dashboard");
        } else {
          navigate(location.state ? location.state : "/");
        }
      }
    },
    onError: (e) => {
      toast.error(e.response.data.message);
    },
  });

  const loginGoogleMutation = useMutation({
    mutationFn: async (update_info) => {
      const res = await axiosSecure.post("/login-google-user", update_info);
      return res.data;
    },
    onSuccess: (data) => {
      if (data.success === true) {
        toast.success("Google Login Successful");
        if (data.data.role === "Staff" || data.data.role === "Admin") {
          navigate(location.state ? location.state : "/dashboard");
        } else {
          navigate(location.state ? location.state : "/");
        }
      }
    },
    onError: (e) => {
      toast.error(e.response.data.message);
    },
  });

  const handleDemoLogin = (role) => {
    let email = `${import.meta.env.VITE_CitizenEmail}`;
    let password = `${import.meta.env.VITE_Password}`;
    if (role === "Admin") {
      email = `${import.meta.env.VITE_AdminEmail}`;
      password = `${import.meta.env.VITE_Password}`;
    } else if (role === "Staff") {
      email = `${import.meta.env.VITE_StaffEmail}`;
      password = `${import.meta.env.VITE_Password}`;
    }

    signInUser(email, password)
      .then(async (result) => {
        const user = result.user;
        if (role && user) {
          toast.success(`${role} Login Successful`);
          if (role === "Admin" || role === "Staff") {
            navigate("/dashboard");
          } else {
            navigate("/");
          }
        }
      })
      .catch((e) => {
        const message =
          e.code === "auth/wrong-password" ? "Wrong password" : "Login failed";
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  const handleEmailPasswordLogin = (data) => {
    const { email, password } = data;
    signInUser(email, password)
      .then(async (result) => {
        const user = result.user;
        
        const user_info = {
          email,
          password,
        };

        loginMutation.mutate(user_info);
      })
      .catch((e) => {
        const message =
          e.code === "auth/wrong-password" ? "Wrong password" : "Login failed";
        toast.error(message);
      })
      .finally(() => setLoading(false));
  };

  const handleGoogleSignIn = () => {
    signInWithGoogle()
      .then(async (result) => {
        const user = result.user;

        const google = user.providerData[0].providerId;
        const user_info = {
          email: user.email,
          provider: google,
        };

        loginGoogleMutation.mutate(user_info);
      })
      .catch(() => {
        toast.error("Google login failed");
      })
      .finally(() => setLoading(false));
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
    <div className="card ml-2 mr-2 bg-base-100 md:mx-auto max-w-sm shrink-0 shadow-xl my-5 md:my-10 border border-gray-100">
      <title>Login</title>
      <div className="card-body p-4 md:p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-[#173A75]">
            Welcome Back
          </h1>
          <p className="text-gray-500 mt-2">
            Sign in to continue your journey. Manage your account, explore new
            features, and more.
          </p>
        </div>
        <form onSubmit={handleSubmit(handleEmailPasswordLogin)}>
          <fieldset className="fieldset">
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="label font-bold text-black/70">
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
              <label className="label font-bold text-black/70">Password</label>
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

            <Link className="text-sm font-medium text-blue-600 hover:text-blue-500 hover:underline transition duration-150">
              Forgot Password?
            </Link>
            <button
              className={`btn mt-4 text-white rounded-full bg-gradient-to-r from-[#FF974D] to-[#FF6F00] hover:from-[#FF6F00] hover:to-[#FF974D]`}
            >
              Login
            </button>
            <div className="flex justify-between">
              <button
                onClick={() => handleDemoLogin("Citizen")}
                // onClick={() => {
                //   demoLoginMutation.mutate({ role: "Citizen" });
                //   setValue("email", "welcome@gmail.com");
                //   setValue("password", "Welcome12");
                // }}
                type="button"
                className={`btn flex-1 text-xs text-white rounded-full bg-gradient-to-r from-[#6360f0] to-[#8b59ff] hover:from-[#ce3a6b] hover:to-[#96165c]`}
              >
                Demo Login
              </button>
              <button
                onClick={() => handleDemoLogin("Staff")}
                type="button"
                className={`btn flex-1 text-xs text-white rounded-full bg-gradient-to-r from-[#c740e2] to-[#f52ca8] hover:from-[#3c47e7] hover:to-[#1d85b6] `}
              >
                Staff Login
              </button>
              <button
                onClick={() => handleDemoLogin("Admin")}
                type="button"
                className={`btn flex-1 text-xs text-white rounded-full bg-gradient-to-r from-[#eb5151] to-[#ec2d2d] hover:from-[#34a4e6] hover:to-[#1691ca] `}
              >
                Admin Login
              </button>
            </div>
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
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <Link
            to={"/register"}
            className="font-medium text-blue-600 hover:text-blue-500 ml-1 transition duration-150"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
