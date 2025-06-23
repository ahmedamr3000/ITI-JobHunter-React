import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import useCompanyStore from "../../store/UseCompanyStore";
import "./CreateJob.css";

const jobTypes = ["Full Time", "Part Time", "Freelance", "Remote"];

const validationSchema = Yup.object({
  title: Yup.string()
    .matches(
      /^[A-Za-z\s-]+$/,
      "Job title must contain only English letters, spaces, and hyphens"
    )
    .required("Job title is required"),
  description: Yup.string()
    .matches(
      /^[A-Za-z0-9\s.,!?-]*$/,
      "Job description must contain only English letters, numbers, and allowed symbols"
    )
    .required("Job description is required"),
  location: Yup.string()
    .matches(
      /^[A-Za-z0-9\s.,!?-]*$/,
      "Location must contain only English letters, numbers, and allowed symbols"
    )
    .required("Location is required"),
  job_type: Yup.string()
    .oneOf(jobTypes, "Invalid job type")
    .required("Job type is required"),
  company: Yup.string().required("Company is required"),
  salary_range: Yup.object({
    min: Yup.number()
      .min(0, "Minimum salary cannot be negative")
      .required("Minimum salary is required"),
    max: Yup.number()
      .min(Yup.ref("min"), "Maximum salary must be greater than minimum")
      .required("Maximum salary is required"),
  }),
});

function CreateJob() {
  const [backendError, setBackendError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { companies, getAllCompanies, isLoading, error } = useCompanyStore();

  useEffect(() => {
    getAllCompanies();
  }, [getAllCompanies]);

  const initialValues = {
    title: "",
    description: "",
    location: "",
    job_type: "",
    job_status: "Open",
    company: "",
    salary_range: { min: "", max: "" },
  };

  const handleSubmit = async (
    values,
    { setSubmitting, resetForm, setErrors }
  ) => {
    setBackendError(null);
    setSuccessMessage(null);

    let token = localStorage.getItem("UserToken");
    if (!token) {
      token = sessionStorage.getItem("UserToken");
    }
    try {
      const response = await axios.post(
        "https://iti-jobhunter-node-production-2ae5.up.railway.app/api/job/create/",
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSuccessMessage("Job created successfully!");
      resetForm();
      setSubmitting(false);
    } catch (error) {
      if (error.response) {
        const errorData = error.response.data;
        if (error.response.status === 401) {
          setBackendError("Unauthorized: Please log in to create a job.");
        } else {
          const formattedErrors = {};
          Object.keys(errorData).forEach((key) => {
            formattedErrors[key] = errorData[key];
          });
          setErrors(formattedErrors);
          setBackendError(
            "Failed to create job. Please check the errors below."
          );
        }
      } else {
        setBackendError("Something went wrong: " + error.message);
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="post-job mt-5">
      <div className="container">
        <h2 className="text-center mb-4">
          Post a <span className="text-primary">Free Job</span>
        </h2>
        {successMessage && (
          <div className="alert alert-success mb-4" role="alert">
            {successMessage}
          </div>
        )}
        {backendError && (
          <div className="alert alert-danger mb-4" role="alert">
            {backendError}
          </div>
        )}
        {error && (
          <div className="alert alert-danger mb-4" role="alert">
            {error}
          </div>
        )}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, resetForm, isSubmitting }) => (
            <Form className="form-parent mt-5 mb-5">
              <h3 className="position-relative pb-4 mb-4">
                To submit job you should enter all fields
              </h3>
              <div className="row gy-4">
                <div className="col-md-6">
                  <div className="form-floating mb-4">
                    <Field
                      name="title"
                      type="text"
                      className={`form-control ${
                        errors.title && touched.title ? "is-invalid" : ""
                      }`}
                      id="jobTitle"
                      placeholder="Job Title"
                    />
                    <label htmlFor="jobTitle">Job Title</label>
                    <div
                      style={{ minHeight: "1.5em" }}
                      className="invalid-feedback"
                    >
                      {errors.title && touched.title ? errors.title : ""}
                    </div>
                  </div>

                  <div className="form-floating">
                    <Field
                      as="select"
                      name="job_type"
                      className={`form-select ${
                        errors.job_type && touched.job_type ? "is-invalid" : ""
                      }`}
                      id="jobType"
                      aria-label="Select job type"
                    >
                      <option value="" disabled>
                        Select Job Type
                      </option>
                      {jobTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </Field>
                    <label htmlFor="jobType">Job Type</label>
                    <div
                      style={{ minHeight: "1.5em" }}
                      className="invalid-feedback"
                    >
                      {errors.job_type && touched.job_type
                        ? errors.job_type
                        : ""}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating mb-4">
                    <Field
                      name="location"
                      type="text"
                      className={`form-control ${
                        errors.location && touched.location ? "is-invalid" : ""
                      }`}
                      id="location"
                      placeholder="Location"
                    />
                    <label htmlFor="location">Location</label>
                    <div
                      style={{ minHeight: "1.5em" }}
                      className="invalid-feedback"
                    >
                      {errors.location && touched.location
                        ? errors.location
                        : ""}
                    </div>
                  </div>

                  <div className="form-floating mb-4">
                    <Field
                      as="select"
                      name="company"
                      className={`form-select ${
                        errors.company && touched.company ? "is-invalid" : ""
                      }`}
                      id="company"
                      aria-label="Select company"
                    >
                      <option value="" disabled>
                        Select Company
                      </option>

                      {isLoading ? (
                        <option disabled>Loading companies...</option>
                      ) : !companies?.foundedCompany ||
                        companies.foundedCompany.length === 0 ? (
                        <option disabled>No companies available</option>
                      ) : (
                        companies.foundedCompany.map((company) => (
                          <option key={company._id} value={company._id}>
                            {company.name}
                          </option>
                        ))
                      )}
                    </Field>
                    <label htmlFor="company">Company</label>
                    <div
                      style={{ minHeight: "1.5em" }}
                      className="invalid-feedback"
                    >
                      {errors.company && touched.company ? errors.company : ""}
                    </div>
                  </div>
                </div>
              </div>

              <div className="row gy-4">
                <div className="col-md-6">
                  <div className="form-floating ">
                    <Field
                      name="salary_range.min"
                      type="number"
                      className={`form-control ${
                        errors.salary_range?.min && touched.salary_range?.min
                          ? "is-invalid"
                          : ""
                      }`}
                      id="salaryMin"
                      placeholder="Minimum Salary"
                    />
                    <label htmlFor="salaryMin">Minimum Salary</label>
                    <div
                      style={{ minHeight: "1.5em" }}
                      className="invalid-feedback"
                    >
                      {errors.salary_range?.min && touched.salary_range?.min
                        ? errors.salary_range.min
                        : ""}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-floating mb-4">
                    <Field
                      name="salary_range.max"
                      type="number"
                      className={`form-control ${
                        errors.salary_range?.max && touched.salary_range?.max
                          ? "is-invalid"
                          : ""
                      }`}
                      id="salaryMax"
                      placeholder="Maximum Salary"
                    />
                    <label htmlFor="salaryMax">Maximum Salary</label>
                    <div
                      style={{ minHeight: "1.5em" }}
                      className="invalid-feedback"
                    >
                      {errors.salary_range?.max && touched.salary_range?.max
                        ? errors.salary_range.max
                        : ""}
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-floating mb-4">
                <Field
                  as="textarea"
                  name="description"
                  className={`form-control ${
                    errors.description && touched.description
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Job Description"
                  id="floatingTextarea2"
                  style={{ height: 150 }}
                />
                <label htmlFor="floatingTextarea2">Job Description</label>
                <div
                  style={{ minHeight: "1.5em" }}
                  className="invalid-feedback"
                >
                  {errors.description && touched.description
                    ? errors.description
                    : ""}
                </div>
              </div>

              <div className="form-btns mt-4 d-flex justify-content-center">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setSuccessMessage(null);
                    setBackendError(null);
                  }}
                  className="clear"
                >
                  Clear
                </button>
                <button type="submit" disabled={isSubmitting} className="">
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreateJob;
