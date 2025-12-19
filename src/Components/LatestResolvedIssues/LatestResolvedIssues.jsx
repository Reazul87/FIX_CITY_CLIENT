import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "react-router";
import useAxiosSecure from "../../Hooks/useAxiosSecure/useAxiosSecure";
import Loading from "../Loading/Loading";
import Loading2 from "../Loading/Loading2";

const LatestResolvedIssues = () => {
  const axiosSecure = useAxiosSecure();
  const location = useLocation();

  const { data: resolvedIssues = [], isLoading } = useQuery({
    queryKey: ["latest-resolved-issues"],
    queryFn: async () => {
      const res = await axiosSecure.get("/latest-resolved-issues");
      return res.data.data || [];
    },
  });
  //////console.log(resolvedIssues);

  if (isLoading) {
    return <Loading2 />;
  }

  if (resolvedIssues.length === 0) {
    return (
      <div className="text-center py-25">
        <p className="text-2xl text-gray-500">No resolved issues yet.</p>
      </div>
    );
  }

  return (
    <section className="py-16 bg-base-200">
      <div className="w-11/12 mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Latest Resolved Issues
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resolvedIssues.map((issue) => (
            <div
              key={issue._id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow"
            >
              <figure className="p-4">
                <img
                  src={issue.image || "https://via.placeholder.com/300"}
                  alt={issue.title}
                  className="h-56 w-full object-cover rounded-xl"
                />
              </figure>
              <div className="card-body">
                <h3 className="card-title text-xl">{issue.title}</h3>
                <p className="text-gray-600">Location: {issue.location}</p>
                <div className="flex gap-2 mt-2">
                  <span className="badge badge-outline">{issue.category}</span>
                  <span className="badge badge-success">Resolved</span>
                  {issue.priority === "High" && (
                    <span className="badge badge-error">High Priority</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-3">
                  Resolved on: {new Date(issue.resolvedAt).toLocaleDateString()}
                </p>
                <div className="card-actions mt-4">
                  <Link
                    to={`/issue/${issue._id}`}
                    state={location.pathname}
                    className="btn btn-primary w-full"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestResolvedIssues;
