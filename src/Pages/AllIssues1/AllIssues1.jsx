import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth/useAuth";
import useAxiosSecure from "../../Hooks/useAxiosSecure/useAxiosSecure";
import getStatusColor from "../Shared/GetStatusColor/getStatusColor";
import Loading from "../../Components/Loading/Loading";
import toast from "react-hot-toast";

export default function AllIssues1() {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    status: "",
    priority: "",
  });

  const [page, setPage] = useState(1);
  const limit = 9;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchText);
      setPage(1);
    }, 700);

    return () => clearTimeout(timer);
  }, [searchText, filters]);

  const { data: dbUser } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/see-user/${user.email}`);
      return res.data?.result;
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["all-issues", search, filters, page],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/all-issues?category=${filters.category}&status=${filters.status}&priority=${filters.priority}&search=${search}&limit=${limit}&page=${page}`
      );
      return res.data;
    },
  });
  const issues = data?.data || [];
  const pagination = data?.pagination || {};
  //console.log(data);

  const upvoteMutation = useMutation({
    mutationFn: async (issueId) => {
      const upvote_info = {
        upvotedBy: dbUser._id,
      };
      const res = await axiosSecure.patch(
        `/issues/${issueId}/upvote`,
        upvote_info
      );
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-issues", search, filters, page]);
      Swal.fire("Upvoted!", "Your support is recorded.", "success");
    },
    onError: () => {
      toast.error("Upvote failed");
    },
  });

  const handleUpvote = (issue) => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (issue.userId === dbUser._id) {
      Swal.fire("Oops!", "You cannot upvote your own issue.", "info");
      return;
    }
    if (issue.upvotedBy?.includes(dbUser._id)) {
      Swal.fire(
        "Already Voted!",
        "You have already upvoted this issue.",
        "info"
      );
      return;
    }
    if (dbUser.isBlocked !== true) {
      upvoteMutation.mutate(issue._id);
    } else {
      toast.error("Access denied. Your account is blocked.");
    }
  };

  if (loading || isLoading) {
    return <Loading></Loading>;
  }

  return (
    <div className="w-11/12 mx-auto py-10 px-4 min-h-screen">
      <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800">
        All Issues
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 p-6 bg-base-200 rounded-xl shadow-inner">
        <input
          type="text"
          placeholder="Search by title or location..."
          className="input input-bordered w-full"
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
        <select
          className="select select-bordered"
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option>Broken Streetlight</option>
          <option>Pothole</option>
          <option>Water Leakage</option>
          <option>Garbage Overflow</option>
          <option>Damaged Footpath</option>
        </select>
        <select
          className="select select-bordered"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option>Pending</option>
          <option>In-Progress</option>
          <option>Resolved</option>
          <option>Closed</option>
        </select>
        <select
          className="select select-bordered"
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
        >
          <option value="">All Priority</option>
          <option>High</option>
          <option>Low</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues.map((issue) => (
          <div
            key={issue._id}
            className={`card bg-base-100 shadow-md border border-gray-100 ${
              issue.priority === "high" ? "ring-2 ring-red-500" : ""
            }`}
          >
            <figure className="relative h-52">
              <img
                src={issue.image || "https://via.placeholder.com/400x250"}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
              <span
                className={`absolute top-4 right-4 badge font-bold ${
                  issue.priority === "high" ? "badge-error" : "badge-warning"
                }`}
              >
                {issue.priority.toUpperCase()}
              </span>
            </figure>

            <div className="card-body p-2 md:p-4 gap-3">
              <h2 className="card-title text-gray-800 leading-tight">
                {issue.title}
              </h2>
              <p className="text-gray-500 text-sm flex items-center gap-1">
                {issue.location}
              </p>
              <div className="flex justify-between gap-2 my-2">
                <span className="badge badge-outline">{issue.category}</span>
                <span
                  className={`badge text-white ${getStatusColor(issue.status)}`}
                >
                  {issue.status}
                </span>
              </div>

              <div className="card-actions justify-between items-center mt-4">
                <button
                  onClick={() => handleUpvote(issue)}
                  className="btn btn-sm btn-outline"
                  disabled={upvoteMutation.isLoading}
                >
                  Upvote {issue?.upvote}
                </button>
                <Link
                  to={`/issue/${issue._id}`}
                  className="btn btn-sm btn-primary"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      {!isLoading && issues.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-2xl text-gray-400">No matching issues found.</p>
        </div>
      )}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-12 gap-2">
          <button
            onClick={() => setPage(pagination.currentPage - 1)}
            disabled={!pagination.hasPrev}
            className="btn btn-outline"
          >
            Previous
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`btn ${
                  p === pagination.currentPage ? "btn-primary" : "btn-outline"
                }`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={() => setPage(pagination.currentPage + 1)}
            disabled={!pagination.hasNext}
            className="btn btn-outline"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
