import { useEffect, useState, useCallback } from "react";
import useJobStore from "../../store/useJobsStore";
import { Box, Pagination } from "@mui/material";

import "./Jobs.css";
import JobCard from "../JobCard/JobCard";

import JobsHero from "../JobsHero/JobsHero";

function JobsPage() {
  const { jobs, loading, error, fetchJobs } = useJobStore();
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 8;

  const [displayedJobs, setDisplayedJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    if (jobs && jobs.length > 0) {
      const filtered = jobs.filter((job) => {
        const jobTitle = job.title ? job.title.toLowerCase() : "";
        const term = searchTerm.toLowerCase();
        return jobTitle.includes(term);
      });
      setDisplayedJobs(filtered);
    } else if (jobs && jobs.length === 0 && !loading) {
      setDisplayedJobs([]);
    }
    setCurrentPage(1);
  }, [jobs, searchTerm, loading]);

  const handleSearchResults = useCallback((results) => {
    setDisplayedJobs(results);
    setCurrentPage(1);
  }, []);

  const handleSearchTermChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const handlePopularSearchClick = useCallback((term) => {
    setSearchTerm(term);
  }, []);

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
        return "#607D8B";
    }
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobsOnPage = displayedJobs.slice(
    indexOfFirstJob,
    indexOfLastJob
  );

  const totalPages = Math.ceil(displayedJobs.length / jobsPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  if (loading && displayedJobs.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h1 className="text-center">Loading jobs...</h1>
      </div>
    );
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <div className="jobs">
        <JobsHero
          onSearchResults={handleSearchResults}
          allJobs={jobs}
          searchTerm={searchTerm}
          onSearchTermChange={handleSearchTermChange}
          onPopularSearchClick={handlePopularSearchClick}
        />

        <div className="jobs-area">
          <div className="container">
            <h2 className="py-5 fs-1 main-title">
              Latest <span>Open Jobs</span>
            </h2>

            <div className="jobs pb-5">
              <div className="row g-4">
                {currentJobsOnPage.length > 0 ? (
                  currentJobsOnPage.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}
                      getJobTypeBackgroundColor={getJobTypeBackgroundColor}
                    />
                  ))
                ) : (
                  <p>No jobs found matching your criteria.</p>
                )}
              </div>

              <div className="row">
                {displayedJobs.length > jobsPerPage && (
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
