import React, { useEffect } from "react";
import HeroSection from "../HeroSection/HeroSection";
import JobCard from "../JobCard/JobCard";
// import useJobStore from "../../store/useJobsStore";
import useCompanyStore from "../../store/UseCompanyStore";
import ComputerIcon from "@mui/icons-material/Computer";
import JobsHero from "../JobsHero/JobsHero";
export default function Home() {
  // const { jobs, loading, error, fetchJobs } = useJobStore();
  const { companies, getAllCompanies } = useCompanyStore();

  useEffect(() => {
    // fetchJobs();
    getAllCompanies();
    console.log("companies", companies);
  }, []);

  return (
    <>
     <HeroSection />
      
      {/* <JobsHero /> */}

      <div className="container">
        <h1 style={{ fontSize: "50px" }} className=" ">
          Explore by <span style={{ color: "#26A4FF" }}>category </span>{" "}
        </h1>

        <div className="row mx-4 my-4">
          {companies.foundedCompany?.map((company) => (
            <div className="col-md-3">
              <div className="category-card">
                <div
                  className="category"
                  style={{
                    width: "280px",
                    height: "214px",
                    backgroundColor: "white",
                    borderColor: "#rgba(214, 221, 235, 1)",
                    boxShadow: "8px 8px 18px rgba(204, 212, 242, 0.6)",
                  }}
                >
                  <div
                    className="icon pt-4 mx-4"
                    n
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "left",
                    }}
                  >
                    <ComputerIcon sx={{ fontSize: 45 }} />
                  </div>
                  <h2 style={{ fontSize: "30px" }} className=" mx-4 pt-4">
                    {company.industry}
                  </h2>
                  <h4
                    style={{ fontSize: "19px", color: "#7C8493" }}
                    className="mx-4 mt-4"
                  >
                    500 job available
                  </h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* <JobCard job={jobs} /> */}
    </>
  );
}
