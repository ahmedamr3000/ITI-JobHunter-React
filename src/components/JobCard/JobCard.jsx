import { Link } from "react-router-dom";
import "./JobCard.css";
function JobCard({ job }) {
  const getJobTypeBackgroundColor = (jobType) => {
    switch (jobType) {
      case "Full Time":
        return "#56CDAD1A";
      case "Freelance":
        return "#F443361A";
      case "Remote":
        return "#2196F31A";
      case "Part Time":
        return "#FF98001A";
      default:
    }
  };

  const getJobTypeColor = (jobType) => {
    switch (jobType) {
      case "Full Time":
        return "#56CDAD";
      case "Freelance":
        return "#F44336";
      case "Remote":
        return "#2196F3";
      case "Part Time":
        return "#FF9800";
      default:
    }
  };

  return (
    <div className="col-md-6">
      <div className="job-card bg-white py-4 px-5">
        <h3 className="job-title">{job.title}</h3>
        <div className="info d-flex gap-2">
          <p className="comp-name">{job.company?.name}</p>
          <span className="">&bull;</span>
          <p className="address">{job.location}</p>
        </div>
        <div className="tags d-flex align-items-center gap-3">
          <div
            className="type position-relative"
            style={{
              backgroundColor: getJobTypeBackgroundColor(job.job_type),
              color: getJobTypeColor(job.job_type),
            }}
          >
            {job.job_type}
          </div>
          <Link to={`/job/${job._id}`} className="status text-decoration-none">
            {job.job_status}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default JobCard;
