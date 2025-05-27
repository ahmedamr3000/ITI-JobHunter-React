import React, { useState, useEffect, useCallback } from "react";
import "./JobSearch.css";
import SearchIcon from "@mui/icons-material/Search";

function JobSearch({
  onSearchResults,
  allJobs,
  searchTerm,
  onSearchTermChange,
}) {
  const applyFilters = useCallback(
    (jobsToFilter, currentSearchTerm) => {
      if (!jobsToFilter) {
        if (onSearchResults) {
          onSearchResults([]);
        }
        return;
      }

      const filtered = jobsToFilter.filter((job) => {
        const jobTitle = job.title ? job.title.toLowerCase() : "";
        const term = currentSearchTerm ? currentSearchTerm.toLowerCase() : "";
        return jobTitle.includes(term);
      });

      if (onSearchResults) {
        onSearchResults(filtered);
      }
    },
    [onSearchResults]
  );

  useEffect(() => {
    applyFilters(allJobs, searchTerm);
  }, [allJobs, searchTerm, applyFilters]);

  const handleSearchInputChange = (event) => {
    onSearchTermChange(event.target.value);
  };

  const handleSearchClick = () => {
    applyFilters(allJobs, searchTerm);
  };

  return (
    <>
      <div className="d-flex align-items-center jobSearch">
        <SearchIcon className="searchIcon"></SearchIcon>
        <div className="searchInput">
          <input
            type="text"
            placeholder="What job are you looking for?"
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
        </div>

        <button className="searchBtn" onClick={handleSearchClick}>
          Search
        </button>
      </div>
    </>
  );
}

export default JobSearch;
