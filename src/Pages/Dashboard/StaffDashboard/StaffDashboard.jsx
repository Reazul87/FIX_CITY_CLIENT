import React from "react";

import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import useAxiosSecure from "../../../Hooks/useAxiosSecure/useAxiosSecure";
import Loading from "../../../Components/Loading/Loading";

const StaffDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const location = useLocation();

  const { data: dashboardData = {}, isLoading } = useQuery({
    queryKey: ["staff-dashboard"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/staff-dashboard`);
      return res.data.data;
    },
  });

  const { assignedIssues = [], stats = {} } = dashboardData;

  const {
    totalAssigned = 0,
    pending = 0,
    inProgress = 0,
    resolved = 0,
    todaysTasks = 0,
    todaysIssues = [],
    monthlyResolved = [],
  } = stats;

  const pieData = [
    { name: "Pending", value: pending, color: "#f59e0b" },
    { name: "In Progress", value: inProgress, color: "#3b82f6" },
    { name: "Resolved", value: resolved, color: "#10b981" },
  ];

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-11/12 mx-auto py-6 px-2 md:py-10 md:px-4 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">
          Performance Overview
        </h1>
        <p className="text-xl text-gray-600">
          Track and manage your assigned civic issues
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6 mb-12">
        <div className="card bg-base-100 shadow-xl p-3 md:p-6 text-center">
          <h3 className="text-4xl font-bold text-primary">{totalAssigned}</h3>
          <p className="text-gray-600 mt-2">Total Assigned Issues</p>
        </div>
        <div className="card bg-base-100 shadow-xl p-3 md:p-6 text-center">
          <h3 className="text-4xl font-bold text-green-500">{resolved}</h3>
          <p className="text-gray-600 mt-2">Issues Resolved</p>
        </div>
        <div className="card bg-base-100 shadow-xl p-3 md:p-6 text-center">
          <h3 className="text-4xl font-bold text-amber-500">{pending}</h3>
          <p className="text-gray-600 mt-2">Pending Issues</p>
        </div>
        <div className="card bg-base-100 shadow-xl p-3 md:p-6 text-center">
          <h3 className="text-4xl font-bold text-blue-500">{inProgress}</h3>
          <p className="text-gray-600 mt-2">In Progress</p>
        </div>
        <div className="card bg-base-100 shadow-xl p-3 md:p-6 text-center">
          <h3 className="text-4xl font-bold text-purple-600">{todaysTasks}</h3>
          <p className="text-gray-600 mt-2">Today's Tasks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mb-12">
        <div className="card bg-base-100 shadow-xl p-4 md:p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Issue Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card bg-base-100 shadow-xl p-4 md:p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Monthly Resolved Issues
          </h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={monthlyResolved}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="monthYear"
                angle={-36}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl p-0 md:p-8">
        <h2 className="text-2xl font-bold mb-6">
          Today's Tasks <span className="text-primary">({todaysTasks})</span>
        </h2>
        {todaysTasks === 0 ? (
          <div className="text-center py-8 md:py-12">
            <p className="text-xl text-gray-500">
              No tasks assigned for today.
            </p>
            <p className="text-gray-600 mt-2">Enjoy your day!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {todaysIssues.map((issue) => (
              <div
                key={issue._id}
                className="card bg-base-100  border border-gray-100 shadow-md p-1 md:p-2"
              >
                <figure className="p-2">
                  <img
                    src={issue.image}
                    alt={issue.title}
                    className="h-36 object-cover rounded-md w-full"
                  />
                </figure>
                <div className="card-body p-2">
                  <h3 className="font-semibold text-[1rem] md:text-lg ">{issue.title}</h3>
                  <p className="text-sm text-gray-600">
                    Location: {issue.location}
                  </p>
                  <p className="text-sm text-gray-600">
                    Category: {issue.category}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <span
                      className={`badge ${
                        issue.priority === "High"
                          ? "badge-error"
                          : "badge-warning"
                      }`}
                    >
                      {issue.priority}
                    </span>
                    <span className="badge badge-primary">{issue.status}</span>
                  </div>
                </div>
                <div className="p-2">
                  <Link
                    to={`/issue/${issue._id}`}
                    state={location.pathname}
                    className="btn btn-sm btn-primary mt-4 w-full"
                  >
                    View & Update
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
