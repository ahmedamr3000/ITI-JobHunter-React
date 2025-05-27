import JobSearch from "../JobSearch/JobSearch"

let popularSearch = [
    "Graphic Designer",
    "UI/UX",
    "Web Developer",
    "Copywriter",
    "Front-End Developer",
  ];

function JobsHero() {
  return (
    <div className="explore w-100">
              <div className="container py-5">
                <p className="exp">Explore Best Job Opportunities</p>
                <h2 className="emp">Empower 
                  <br></br>
                  Your Career</h2>
                <p className="desc">
                  Discover your next career move with JobLinkup, the go-to job
                  <br></br>
                  marketplace for job seekers and employers.
                </p>
                <JobSearch />
                <div className="popularSearch">
                  <p className="fw-bold mt-3 mb-2">Popular Search:</p>
                  <div className="tags d-flex flex-wrap gap-3">
                  {popularSearch.map((search,index)=> <div className="searchTag" key={index}>{search}</div>)}
                  </div>
    
                </div>
              
              </div>
            </div>
  )
}

export default JobsHero