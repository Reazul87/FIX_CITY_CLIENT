const getStatusColor = (status) => {
  if (status === "Pending") {
    return "badge-warning";
  } else if (status === "In-Progress") {
    return "badge-info";
  } else if (status === "Resolved") {
    return "badge-success";
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
