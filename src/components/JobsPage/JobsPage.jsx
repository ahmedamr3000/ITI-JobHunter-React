import { useEffect, useState } from "react";
import useJobStore from "../../store/useJobsStore";
import { Box, Pagination } from "@mui/material";

import "./Jobs.css";
import JobCard from "../JobCard/JobCard";

import JobsHero from "../JobsHero/JobsHero";

function JobsPage() {
  const { jobs, loading, error, fetchJobs } = useJobStore();
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 8;

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const getJobTypeBackgroundColor = (jobType) => {
    switch (jobType) {
      case "Full Time":
        return "#4CAF50";
      case "Freelance":
        return "#F44336";
      case "Remote":
        return "#2196F3";
      case "Part Time":
        return "#FF9800";
      default:
    }
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <>
      <div className="jobs">
        <JobsHero />

        <div className="jobs-area">
          <div className="container">
            <h2 className="py-5 fs-1 main-title">
              Latest <span>Open Jobs</span>
            </h2>

            <div className="jobs pb-5">
              <div className="row g-4">
                {currentJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>

              <div className="row">
                {jobs.length > jobsPerPage && (
                  <Box
                    sx={{ display: "flex", justifyContent: "center", mt: 4 }}
                  >
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      size="large"
                      onChange={handlePageChange}
                      variant="outlined"
                      shape="rounded"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          borderColor: "#AEB4C1",
                        },
                        "& .MuiPaginationItem-root.Mui-selected": {
                          backgroundColor: "#4640DE",
                          color: "#fff",
                          borderColor: "#4640DE",
                          "&:hover": {
                            backgroundColor: "#4640DE",
                          },
                        },
                        "& .MuiPaginationItem-root:hover": {
                          borderColor: "#4640DE",
                          backgroundColor: "#4640DE1A",
                        },
                      }}
                    />
                  </Box>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default JobsPage;
