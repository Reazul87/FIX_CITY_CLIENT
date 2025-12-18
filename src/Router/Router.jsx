import { createBrowserRouter } from "react-router";
import MainLayout from "../Layouts/MainLayout/MainLayout";
import Home from "../Pages/Home/Home";
import DashboardLayout from "../Layouts/DashboardLayout/DashboardLayout";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Register/Register";
import Error from "../Components/Error/Error";
import MyIssues from "../Pages/Dashboard/CitizenDashboard/Pages/MyIssues/MyIssues";
import ReportIssue from "../Pages/Dashboard/CitizenDashboard/Pages/ReportIssue/ReportIssue";
import Profile from "../Pages/Shared/Profile/Profile";
import AllIssues from "../Pages/Dashboard/AdminDashboard/Pages/AllIssues/AllIssues";
import ManageUsers from "../Pages/Dashboard/AdminDashboard/Pages/ManageUsers/ManageUsers";
import ManageStaff from "../Pages/Dashboard/AdminDashboard/Pages/ManageStaff/ManageStaff";
import AssignedIssues from "../Pages/Dashboard/StaffDashboard/Pages/AssignedIssues/AssignedIssues";
import PaymentSuccess from "../Pages/Dashboard/CitizenDashboard/Pages/PaymentSuccess/PaymentSuccess";
import PaymentCancelled from "../Pages/Dashboard/CitizenDashboard/Pages/PaymentCancelled/PaymentCancelled";
import PaymentsHistory from "../Pages/Dashboard/AdminDashboard/Pages/Payments/PaymentsHistory";
import AllIssues1 from "../Pages/AllIssues1/AllIssues1";
import PaymentSuccessBoost from "../Pages/Dashboard/AdminDashboard/Pages/PaymentSuccessBoost/PaymentSuccessBoost";
import PrivateRouter from "./PrivateRouter/PrivateRouter";
import StaffRoute from "./StaffRoute/StaffRoute";
import AdminRoute from "./AdminRoute/AdminRoute";
import PaymentCancelledBoost from "../Pages/Dashboard/AdminDashboard/Pages/PaymentCancelledBoost/PaymentCancelledBoost";
import IssueDetails from "../Pages/IssueDetails/IssueDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      {
        index: true,
        element: <Home></Home>,
      },
      {
        path: "/login",
        element: <Login></Login>,
      },
      {
        path: "/register",
        element: <Register></Register>,
      },
      {
        path: "/all-issues/general",
        element: <AllIssues1></AllIssues1>,
      },
      {
        path: "/issue/:id",
        element: (
          <PrivateRouter>
            <IssueDetails></IssueDetails>
          </PrivateRouter>
        ),
      },
      {
        path: "/payment-success",
        element: <PaymentSuccessBoost></PaymentSuccessBoost>,
      },
      {
        path: "/payment-cancelled/:id",
        element: <PaymentCancelledBoost></PaymentCancelledBoost>,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRouter>
        <DashboardLayout></DashboardLayout>
      </PrivateRouter>
    ),
    children: [
      {
        index: true,
        element: <Dashboard></Dashboard>,
      },
      {
        path: "my-issues",
        element: <MyIssues></MyIssues>,
      },
      {
        path: "report-issue",
        element: <ReportIssue></ReportIssue>,
      },
      {
        path: "assigned-issues",
        element: (
          <StaffRoute>
            <AssignedIssues></AssignedIssues>
          </StaffRoute>
        ),
      },
      {
        path: "all-issues",
        element: (
          <AdminRoute>
            <AllIssues></AllIssues>
          </AdminRoute>
        ),
      },
      {
        path: "manage-staff",
        element: (
          <AdminRoute>
            <ManageStaff></ManageStaff>
          </AdminRoute>
        ),
      },
      {
        path: "manage-users",
        element: (
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
        ),
      },
      {
        path: "payments",
        element: (
          <AdminRoute>
            <PaymentsHistory></PaymentsHistory>
          </AdminRoute>
        ),
      },
      {
        path: "payment-success",
        element: <PaymentSuccess></PaymentSuccess>,
      },
      {
        path: "payment-cancelled",
        element: <PaymentCancelled></PaymentCancelled>,
      },
      {
        path: "profile",
        element: <Profile></Profile>,
      },
    ],
  },
  {
    path: "/*",
    element: <Error></Error>,
  },
]);
export default router;
