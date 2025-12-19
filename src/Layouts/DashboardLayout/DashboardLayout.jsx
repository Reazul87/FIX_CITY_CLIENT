import React, { useEffect, useState } from "react";
import { Link, Outlet } from "react-router";
import useRole from "../../Hooks/useRole/useRole";
import Loading from "../../Components/Loading/Loading";
import {
  Bug,
  ClipboardCheck,
  ClipboardList,
  Home,
  MessageSquareWarning,
  Settings,
  UserCircle,
} from "lucide-react";
import useAuth from "../../Hooks/useAuth/useAuth";
import toast from "react-hot-toast";
import { IoLogOut } from "react-icons/io5";
import {
  FaGooglePay,
  FaRegCircleUser,
  FaUserSecret,
  FaUserTie,
} from "react-icons/fa6";
import { MdOutlineDashboardCustomize } from "react-icons/md";

const DashboardLayout = () => {
  const { user, signOutUser, loading } = useAuth();
  const { role, isLoading } = useRole();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    const html = document.querySelector("html");
    html.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleTheme = (checked) => {
    setTheme(checked ? "dark" : "light");
  };

  if (loading || isLoading) {
    return <Loading></Loading>;
  }
  //console.log(role, isLoading);

  const handleSignOutUser = () => {
    signOutUser().then(() => {
      toast.success("Log out successful");
    });
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        {/* Navbar */}
        <nav className="navbar w-full bg-base-300">
          <label
            htmlFor="my-drawer-4"
            aria-label="open sidebar"
            className="btn btn-square btn-ghost"
          >
            {/* Sidebar toggle icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2"
              fill="none"
              stroke="currentColor"
              className="my-1.5 inline-block size-4"
            >
              <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
              <path d="M9 4v16"></path>
              <path d="M14 10l2 2l-2 2"></path>
            </svg>
          </label>
          <div className="px-5 flex flex-col md:flex-row items-center justify-center gap-1.5 md:justify-between w-full">
            <h1 className="text-md sm:text-xl md:text-2xl font-bold">
              {role} Dashboard{" "}
              <span className="text-primary hidden sm:inline">
                {user?.displayName}
              </span>
            </h1>
            <div className="flex items-center gap-5">
              <label className="flex cursor-pointer gap-2">
                <input
                  onChange={(e) => handleTheme(e.target.checked)}
                  type="checkbox"
                  defaultChecked={localStorage.getItem("theme") === "dark"}
                  className="toggle theme-controller"
                />
              </label>
              <button
                onClick={handleSignOutUser}
                className="btn btn-sm btn-outline btn-primary"
              >
                <IoLogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </nav>
        {/* Page content here */}
        <div className="p-4">
          <Outlet></Outlet>
        </div>
      </div>

      <div className="drawer-side is-drawer-close:overflow-visible">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
          {/* Sidebar content here */}
          <ul className="menu w-full grow">
            {/* Home item */}

            <li>
              <Link
                to={"/"}
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Home"
              >
                <Home size={18} />
                <span className="is-drawer-close:hidden">Home</span>
              </Link>
            </li>

            {/* Admin item */}
            {role === "Admin" && (
              <>
                {/* All issues item */}

                <li>
                  <Link
                    to={"all-issues"}
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="All issues"
                  >
                    <ClipboardList size={18} />
                    <span className="is-drawer-close:hidden">All issues</span>
                  </Link>
                </li>

                {/* Dashboard item */}

                <li>
                  <Link
                    to={"/dashboard"}
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Dashboard"
                  >
                    <MdOutlineDashboardCustomize size={18} />
                    <span className="is-drawer-close:hidden">Dashboard</span>
                  </Link>
                </li>

                {/*Manage Staff item */}

                <li>
                  <Link
                    to={"manage-staff"}
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Manage staff"
                  >
                    <FaUserSecret size={18} />
                    <span className="is-drawer-close:hidden">Manage staff</span>
                  </Link>
                </li>

                {/* Manage users item */}

                <li>
                  <Link
                    to={"manage-users"}
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Manage users"
                  >
                    <FaUserTie size={18} />
                    <span className="is-drawer-close:hidden">Manage users</span>
                  </Link>
                </li>

                {/* Payments Staff item */}

                <li>
                  <Link
                    to={"payments"}
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Payments"
                  >
                    <FaGooglePay size={18} />
                    <span className="is-drawer-close:hidden">Payments</span>
                  </Link>
                </li>

                {/* Profile item */}
                <li>
                  <Link
                    to={"profile"}
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Profile"
                  >
                    <FaRegCircleUser size={18} />
                    <span className="is-drawer-close:hidden">Profile</span>
                  </Link>
                </li>
              </>
            )}

            {/* Staff item */}
            {role === "Staff" && (
              <>
                {/* Dashboard item */}

                <li>
                  <Link
                    to={"/dashboard"}
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Dashboard"
                  >
                    <MdOutlineDashboardCustomize size={18} />
                    <span className="is-drawer-close:hidden">Dashboard</span>
                  </Link>
                </li>

                {/* Assigned issues item */}

                <li>
                  <Link
                    to={"assigned-issues"}
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Assigned issues"
                  >
                    <ClipboardCheck size={18} />
                    <span className="is-drawer-close:hidden">
                      Assigned issues
                    </span>
                  </Link>
                </li>

                {/* Profile item */}

                <li>
                  <Link
                    to={"profile"}
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Profile"
                  >
                    <FaRegCircleUser size={18} />
                    <span className="is-drawer-close:hidden">Profile</span>
                  </Link>
                </li>
              </>
            )}

            {/* Citizen item */}
            {role === "Citizen" && (
              <>
                {/* My Issues item */}

                <li>
                  <Link
                    to={"my-issues"}
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="My Issues"
                  >
                    <Bug size={18} />
                    <span className="is-drawer-close:hidden">My Issues</span>
                  </Link>
                </li>

                {/* Dashboard item */}

                <li>
                  <Link
                    to={"/dashboard"}
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Dashboard"
                  >
                    <MdOutlineDashboardCustomize size={18} />
                    <span className="is-drawer-close:hidden">Dashboard</span>
                  </Link>
                </li>

                {/* Report issue */}

                <li>
                  <Link
                    to={"report-issue"}
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Report Issue"
                  >
                    <MessageSquareWarning size={18} />
                    <span className="is-drawer-close:hidden">Report Issue</span>
                  </Link>
                </li>

                {/* Profile item */}
                <li>
                  <Link
                    to={"profile"}
                    className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                    data-tip="Profile"
                  >
                    <UserCircle size={18} />
                    <span className="is-drawer-close:hidden">Profile</span>
                  </Link>
                </li>
              </>
            )}

            {/* Settings icon */}

            <li>
              <button
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Settings"
              >
                <Settings size={18} />
                {/* <LucideSettings2  size={18}/> */}
                <span className="is-drawer-close:hidden">Settings</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
