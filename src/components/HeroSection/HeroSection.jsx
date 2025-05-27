import React from "react";
import banner from "./../../assets/Desktop.jpg";
import SearchIcon from "@mui/icons-material/Search";
import JobSearch from "../JobSearch/JobSearch";

export default function HeroSection() {
  let popularSearch = [
    "Graphic Designer",
    "UI/UX",
    "Web Developer",
    "Copywriter",
    "Front-End Developer",
  ];

  return (
    <>
      <div className="container py-5 ">
        <div
          className="hero w-100"
          style={{
            backgroundImage: `url(${banner})`,
            backgroundSize: "center",
            backgroundPosition: "right bottom",
            backgroundRepeat: "no-repeat",
            height: "750px",
          }}
        >
          <div className="content ">
            <h2
              className="fw-bolder mt-5"
              style={{ fontFamily: "ClashDisplay-Medium", fontSize: "75px" }}
            >
              Discover
              <br></br>
              more than
              <br></br>
              <span style={{ color: "#26A4FF" }}>5000+ Jobs</span>
            </h2>
            <p className=" fw-light">
              Great platform for the job seeker that searching
              <br></br>for new career heights and passionate about startups.{" "}
              <br></br>
              marketplace for job seekers and employers.
            </p>
          </div>

          <div className="search">
            <SearchIcon
              style={{
                fontSize: 40,
                color: "#4640DE",
                marginLeft: 40,
                marginTop: 10,
              }}
            />

            <input
              type="text"
              placeholder="Search for job details..."
              style={{
                width: "480px",
                height: "55px",
                paddingLeft: "20px",
                fontSize: "17px",
                border: "none",
                borderRadius: "none",
              }}
              className=" mx-3 bg-body rounded"
            ></input>

            <button
              type="button"
              className=" mx-4"
              style={{
                width: 225,
                height: 60,
                fontSize: 24,
                backgroundColor: "#4640DE",
                color: "white",
                fontWeight: 600,
                border: "none",
              }}
            >
              search my job
            </button>
          </div>
          <br />
          <JobSearch />

          <div className="popularSearch">
            <p className="fw-bold mt-3 mb-2">Popular Search:</p>
            <div className="tags d-flex flex-wrap gap-3">
              {popularSearch.map((search) => (
                <div className="searchTag">{search}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
