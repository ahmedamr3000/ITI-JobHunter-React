import React from "react";
import "./JobSearch.css";
import SearchIcon from "@mui/icons-material/Search";

function JobSearch() {
  return (
    <>
      <div className="d-flex align-items-center jobSearch">
        <SearchIcon className="searchIcon"></SearchIcon>
        <div className="searchInput">
          <input type="text" placeholder="What job are you looking for?"/>
        </div>

        <div className="selectCategories">
          <select name="" id="">
            <option value="">Select Category</option>
            <option value="">Freelance</option>
            <option value="">Part Time</option>
            <option value="">Full Time</option>
            <option value="">Remote</option>
          </select>
        </div>
        <button className="searchBtn">Search</button>
      </div>
    </>
  );
}

export default JobSearch;
