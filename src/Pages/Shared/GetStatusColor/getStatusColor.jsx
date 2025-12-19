const getStatusColor = (status) => {
  if (status === "Pending") {
    return "badge-warning";
  } else if (status === "In-progress") {
    return "badge-primary";
  } else if (status === "Working") {
    return "badge-info";
  } else if (status === "Resolved") {
    return "badge-accent";
  } else if (status === "Closed") {
    return "badge-ghost";
  } else {
    return "badge-ghost";
  }
};
export default getStatusColor;

// const getStatusColor = (s) => {
//   const colors = {
//     pending: "badge-warning",
//     "in-progress": "badge-info",
//     resolved: "badge-success",
//     closed: "badge-ghost",
//   };
//   return colors[s] || "badge-ghost";
// };
