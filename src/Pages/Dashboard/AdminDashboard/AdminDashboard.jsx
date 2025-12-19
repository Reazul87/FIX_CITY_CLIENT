import React from "react";
import { useQuery } from "@tanstack/react-query";
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
import Loading from "../../../Components/Loading/Loading";
import useAxiosSecure from "../../../Hooks/useAxiosSecure/useAxiosSecure";

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();

  const { data: dashboardData = {}, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin-dashboard");
      return res.data.data;
    },
  });

  const {
    stats = {},
    latestIssues = [],
    latestPayments = [],
    latestUsers = [],
    monthlyPayments = [],
  } = dashboardData;
  //console.log(dashboardData);

  const {
    totalIssues = 0,
    pending = 0,
    inProgress = 0,
    resolved = 0,
    rejected = 0,
    totalPayments = 0,
  } = stats;

  const pieData = [
    { name: "Pending", value: pending, color: "#f59e0b" },
    { name: "In Progress", value: inProgress, color: "#3b82f6" },
    { name: "Resolved", value: resolved, color: "#10b981" },
    { name: "Rejected", value: rejected, color: "#ef4444" },
  ];

  if (isLoading) return <Loading />;

  return (
    <div className="w-11/12 mx-auto py-5 md:py-10 px-2 md:px-4 min-h-screen">
      <div className="text-center mb-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">System Overview</h1>
        <p className="text-xl text-gray-600">
          Monitor and manage the entire civic reporting system
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-6 mb-12">
        <div className="card bg-base-100 shadow-xl p-3 md:p-6 text-center">
          <h3 className="text-4xl font-bold text-primary">{totalIssues}</h3>
          <p className="text-gray-600 mt-2">Total Issues Reported</p>
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
          <h3 className="text-4xl font-bold text-green-500">{resolved}</h3>
          <p className="text-gray-600 mt-2">Resolved Issues</p>
        </div>
        <div className="card bg-base-100 shadow-xl p-3 md:p-6 text-center">
          <h3 className="text-4xl font-bold text-red-500">{rejected}</h3>
          <p className="text-gray-600 mt-2">Rejected Issues</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6 mb-12">
        <div className="card bg-base-100 shadow-xl p-4 md:p--8 text-center lg:col-span-1">
          <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-purple-600">
            BDT{totalPayments.toLocaleString("en-BD")}
          </h3>
          <p className="md:text-xl text-gray-600 mt-4">
            Total Payment Received
          </p>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
          <div className="card bg-base-100 shadow-xl p-3 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
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
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6">
              Monthly Payments
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyPayments}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="monthYear"
                  angle={-35}
                  textAnchor="end"
                  height={80}
                />
                <YAxis />
                <Tooltip
                  formatter={(value) => `৳${value.toLocaleString("en-BD")}`}
                />
                <Bar
                  dataKey="totalAmount"
                  fill="#9333ea"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
        <div className="card bg-base-100 shadow-xl p-4 md:p-8">
          <h2 className="text-xl text-center md:text-2xl font-bold mb-6">
            Latest Issues
          </h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Reported By</th>
                  <th>Reported</th>
                </tr>
              </thead>
              <tbody>
                {latestIssues.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No issues yet
                    </td>
                  </tr>
                ) : (
                  latestIssues.map((issue) => (
                    <tr key={issue._id}>
                      <td>{issue.title}</td>
                      <td>
                        <span
                          className={`badge ${issue.status === "In-progress"?"px-0":""} ${
                            issue.status === "Resolved"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td>{issue.issueBy}</td>
                      <td>{new Date(issue.reportedAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl p-4 md:p-8">
          <h2 className="text-center text-xl md:text-2xl font-bold mb-6">
            Latest Payments
          </h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Amount</th>
                  <th>User</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {latestPayments.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No payments yet
                    </td>
                  </tr>
                ) : (
                  latestPayments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="font-bold">৳{payment.amount}</td>
                      <td>{payment.customer_email}</td>
                      <td>{new Date(payment.paidAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card bg-base-100 shadow-xl p-4 md:p-8">
          <h2 className="text-xl text-center md:text-2xl font-bold mb-6">
            Latest Registered Users
          </h2>
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {latestUsers.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No users yet
                    </td>
                  </tr>
                ) : (
                  latestUsers.map((user) => (
                    <tr key={user._id}>
                      <td>{user.name || "N/A"}</td>
                      <td>{user.email}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
