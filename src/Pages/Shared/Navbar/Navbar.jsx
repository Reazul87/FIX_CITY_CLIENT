import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router";

import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FaGear, FaUser } from "react-icons/fa6";
import toast from "react-hot-toast";
import MyLink from "../../../Components/MyLink/MyLink";
import { AuthContext } from "../../../Context/AuthContext/AuthContext";
import Logo from "../Logo/Logo";
import { MdDashboardCustomize } from "react-icons/md";
import Loading2 from "../../../Components/Loading/Loading2";
import Loading from "../../../Components/Loading/Loading";

const Navbar = () => {
  const { user, signOutUser, loading } = useContext(AuthContext);

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    const html = document.querySelector("html");
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const links = (
    <>
      <li>
        <MyLink to={"/"} className={"text-white/80"}>
          Home
        </MyLink>
      </li>
      <li>
        <MyLink to={"/all-issues/general"} className={"text-white/80"}>
          All Issues
        </MyLink>
      </li>
    </>
  );

  const handleSignOutUser = () => {
    signOutUser().then(() => {
      toast.success("Log out successful");
    });
  };

  const handleTheme = (checked) => {
    setTheme(checked ? "dark" : "light");
  };

  if (loading) {
    return <Loading></Loading>;
  }

  return (
    <div className="bg-gradient-to-r from-[#112a56] to-[#081C40] shadow-sm">
      <div className="bg-[#ffffff24]">
        <div className="navbar w-11/12 mx-auto">
          <div className="navbar-start">
            <div className="dropdown">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost lg:hidden hover:bg-transparent p-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {" "}
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />{" "}
                </svg>
              </div>
              {/* The dropdown menu itself does not need motion unless you want it to animate opening */}
              <ul
                tabIndex={-1}
                className="menu menu-sm dropdown-content bg-[#173A75] rounded-box z-10 mt-3 w-36 p-2 shadow"
              >
                {links}
              </ul>
            </div>
            <Link to={"/"}>
              <Logo></Logo>
            </Link>
          </div>

          <div className="navbar-center hidden lg:flex text-white">
            <ul className="menu menu-horizontal px-1">{links}</ul>
          </div>

          <div className="navbar-end gap-3">
            <input
              onChange={(e) => handleTheme(e.target.checked)}
              type="checkbox"
              defaultChecked={localStorage.getItem("theme") === "dark"}
              className="toggle"
            />
            {loading ? (
              <>
                <span className="loading loading-spinner loading-xl text-yellow-400"></span>
              </>
            ) : user ? (
              <div className="dropdown dropdown-end z-50">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-9 border-2 border-gray-300 rounded-full">
                    <img
                      alt="Tailwind CSS Navbar component"
                      referrerPolicy="no-referrer"
                      src={user.photoURL}
                      // src={user.photoURL || "https://i.pravatar.cc/1080"}
                    />
                  </div>
                </div>
                <ul
                  tabIndex="-1"
                  className="menu font-medium menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
                >
                  <div className=" pb-3 border-b border-b-gray-200">
                    <li className="text-sm font-bold">{user.displayName}</li>
                    <li className="text-xs">{user.email}</li>
                  </div>
                  <li className="mt-3">
                    <MyLink to={"/dashboard/profile"}>
                      <FaUser /> Profile
                    </MyLink>
                  </li>
                  <li>
                    <MyLink to={"/dashboard"} className={""}>
                      <MdDashboardCustomize />
                      Dashboard
                    </MyLink>
                  </li>
                  <li>
                    <a>
                      <FaGear /> Settings
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={handleSignOutUser}
                      className="btn btn-xs text-left text-white mt-2.5 bg-gradient-to-r from-[#f9618a] to-[#f881a1] hover:from-[#f881a1] hover:to-[#f9618a]"
                    >
                      <IoLogOut /> Logout
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <Link
                to={"/login"}
                className="btn rounded-full border-[#d1bfcc]  btn-sm bg-gradient-to-r from-[#f9618a] to-[#f881a1] hover:from-[#f881a1] hover:to-[#f9618a] text-white"
              >
                {" "}
                <IoLogIn /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
