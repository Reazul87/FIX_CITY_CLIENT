import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import useAxiosSecure from "../../../Hooks/useAxiosSecure/useAxiosSecure";
import Loading from "../../../Components/Loading/Loading";

const CitizenDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data: issues, isLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/citizen-dashboard`);
      // return res.data;
      return res.data?.data;
    },
  });

  const stats = issues?.stats;
  const monthlyPayments = issues?.stats.monthlyPayments;
  const userIssue = issues?.issues;
  //console.log(stats, monthlyPayments, userIssue);

  const pieData = [
    { name: "Pending", value: stats?.pending, color: "#f59e0b" },
    { name: "In Progress", value: stats?.inProgress, color: "#3b82f6" },
    { name: "Resolved", value: stats?.resolved, color: "#10b981" },
  ];

  if (isLoading) {
    return <Loading />;
  }
  //console.log(userIssue.length);

  return (
    <div className="w-11/12 mx-auto py-6 px-2 md:py-10 md:px-4  min-h-screen">
      <h1 className="text-2xl md:text-4xl font-bold text-center text-accent mb-12">
        Issue Stats Overview
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6 mb-12">
        <div className="card bg-base-100 shadow-xl p-3 md:p-6 text-center">
          <h3 className="text-4xl font-bold text-primary">
            {stats?.totalIssues}
          </h3>
          <p className="text-gray-600 mt-2">Total Issues Submitted</p>
        </div>
        <div className="card bg-base-100 shadow-xl p-3 md:p-6 text-center">
          <h3 className="text-4xl font-bold text-amber-500">
            {stats?.pending}
          </h3>
          <p className="text-gray-600 mt-2">Total Pending Issues</p>
        </div>
        <div className="card bg-base-100 shadow-xl p-3 md:p-6 text-center">
          <h3 className="text-4xl font-bold text-blue-500">
            {stats?.inProgress}
          </h3>
          <p className="text-gray-600 mt-2">Total In Progress</p>
        </div>
        <div className="card bg-base-100 shadow-xl p-3 md:p-6 text-center">
          <h3 className="text-4xl font-bold text-green-500">
            {stats?.resolved}
          </h3>
          <p className="text-gray-600 mt-2">Total Resolved Issues</p>
        </div>
        <div className="card bg-base-100 shadow-xl p-3 md:p-6 text-center">
          <h3 className="text-3xl font-bold text-purple-600">
            BDT{stats?.totalPayments.toLocaleString("en-BD")}
          </h3>
          <p className="text-gray-600 mt-2">Total Payments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-8 mb-12">
        <div className="card bg-base-100 shadow-xl p-4 md:p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Issue Status Overview
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
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
            Payments Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyPayments}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="monthYear" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="totalAmount" fill="#9333ea" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-center">
        <Link to="/dashboard/report-issue" className="btn btn-primary">
          Report New Issue
        </Link>
      </div>
      {userIssue.length === 0 && (
        <div className="text-center py-8 md:py-16 bg-base-200 rounded-xl">
          <p className="text-xl text-gray-500 mb-6">
            You haven't reported any issues yet.
          </p>
          <Link to="/dashboard/report-issue" className="btn btn-primary">
            Report Your First Issue
          </Link>
        </div>
      )}
    </div>
  );
};

export default CitizenDashboard;
