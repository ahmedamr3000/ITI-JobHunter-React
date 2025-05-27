import React, { useEffect, useState } from "react";
import axios from "axios";
import useUserStore from "../../store/User.store";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faBookmark,
  faCloudArrowDown,
  faCloudArrowUp,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

import "./ProfilePage.css";

const EditableSection = ({
  title,
  children,
  onSave,
  onEdit,
  isEditing,
  sectionKey,
  hideMenu = false,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleToggleDropdown = () => setDropdownOpen((prevState) => !prevState);
  const handleCloseDropdown = () => setDropdownOpen(false);

  const handleEditClick = (e) => {
    e.preventDefault();
    onEdit(sectionKey, !isEditing);
    handleCloseDropdown();
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    onSave(sectionKey);
    handleCloseDropdown();
  };

  return (
    <div className="section-card">
      <div className="section-header">
        {title && (
          <h6
            className={`fw-bold mb-0 text-dark-grey ${
              sectionKey === "header" ? "" : ""
            }`}
          >
            {title}
          </h6>
        )}
        {!hideMenu && (
          <div className="dropdown">
            <button
              className="btn btn-sm"
              type="button"
              id={`${sectionKey}-dropdownMenuButton`}
              aria-expanded={dropdownOpen}
              onClick={handleToggleDropdown}
            >
              <FontAwesomeIcon icon={faEllipsisV} />{" "}
            </button>
            <ul
              className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}
              aria-labelledby={`${sectionKey}-dropdownMenuButton`}
            >
              <li>
                <a className="dropdown-item" href="#" onClick={handleEditClick}>
                  {isEditing ? "Cancel Edit" : "Edit"}
                </a>
              </li>
              {isEditing && (
                <li>
                  <a
                    className="dropdown-item"
                    href="#"
                    onClick={handleSaveClick}
                  >
                    Save
                  </a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

const ProfilePage = () => {
  const { user, getUser, updateUser, deleteUser } = useUserStore();
  const [updatedUser, setUpdatedUser] = useState(user);
  const [isLoading, setIsLoading] = useState(false);

  const [sectionEditModes, setSectionEditModes] = useState({
    summary: false,
    education: false,
    workExperience: false,
    aboutMe: false,
    contacts: false,
    objective: false,
    skills: false,
    header: false,
  });

  useEffect(() => {
    getUser();
  }, [getUser]);

  useEffect(() => {
    if (user) {
      setUpdatedUser(user);
    }
  }, [user]);

  const handleSectionEditToggle = (sectionKey, isEditing) => {
    setSectionEditModes((prev) => ({
      ...prev,
      [sectionKey]: isEditing,
    }));
  };

  const handleSectionSave = async (sectionKey) => {
    const result = await updateUser(updatedUser);

    if (result && result.success) {
      handleSectionEditToggle(sectionKey, false);
    } else {
    }
  };

  const handleInputChange = (e, section, index = null) => {
    const { name, value } = e.target;

    setUpdatedUser((prevUser) => {
      const newUser = { ...prevUser };

      switch (section) {
        case "summary":
        case "objective":
        case "userName":
        case "role":
          newUser[name] = value;
          break;
        case "title":
          newUser[name] = value;
          break;
        case "aboutMe":
          newUser.aboutMe = { ...(newUser.aboutMe || {}), [name]: value };
          break;
        case "contacts":
          newUser.contacts = { ...(newUser.contacts || {}), [name]: value };
          break;
        case "skills":
          newUser.skills = value.split(",").map((s) => s.trim());
          break;
        case "education":
        case "workExperience":
          if (index !== null) {
            const sectionArray = [...(newUser[section] || [])];
            if (!sectionArray[index]) {
              sectionArray[index] = {};
            }
            sectionArray[index] = { ...sectionArray[index], [name]: value };
            newUser[section] = sectionArray;
          }
          break;
        default:
          break;
      }
      return newUser;
    });
  };

  const handleCVUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      handleSubmitCV(uploadedFile);
    }
  };

  const handleSubmitCV = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("cv", file);

    try {
      setIsLoading(true);
      let token = localStorage.getItem("UserToken");
      if (!token) {
        token = sessionStorage.getItem("UserToken");
      }
      if (!token) {
        console.error("Authentication token is missing.");
        setIsLoading(false);
        alert("Authentication required. Please log in again.");
        return;
      }

      const { data } = await axios.post(
        "https://iti-jobhunter-node-production-ccbd.up.railway.app/api//resume",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (data.status === "success") {
        await updateUser({ cv: data.url });
        setIsLoading(false);
        alert("CV uploaded successfully!");
      } else {
        setIsLoading(false);
        console.error(
          "CV Upload Error (Backend):",
          data.message || "Unknown error from backend."
        );
        alert("CV upload failed: " + (data.message || "Please try again."));
      }
    } catch (error) {
      console.error(
        "CV Upload Error (Frontend Catch):",
        error.response?.data || error.message
      );
      setIsLoading(false);
      alert(
        "An error occurred during CV upload: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const actualUserData = user || {};

  const renderNoData = (sectionName) => (
    <h6 className="text-medium-grey text-center my-4">
      No {sectionName} data yet. Click Edit to add!
    </h6>
  );

  const handleAddEducation = () => {
    setUpdatedUser((prev) => ({
      ...prev,
      education: [...(prev.education || []), {}],
    }));
  };

  const handleAddWorkExperience = () => {
    setUpdatedUser((prev) => ({
      ...prev,
      workExperience: [...(prev.workExperience || []), {}],
    }));
  };

  return (
    <div className="container py-3 back">
      <div className="row">
        <div className="col-lg-8 ">
          <EditableSection
            title="Profile"
            sectionKey="header"
            isEditing={sectionEditModes.header}
            onEdit={handleSectionEditToggle}
            onSave={handleSectionSave}
          >
            <div className="d-flex align-items-center gap-3">
              <div className="flex-grow-1">
                {sectionEditModes.header ? (
                  <>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      name="userName"
                      placeholder="Full Name"
                      value={updatedUser.userName || ""}
                      onChange={(e) => handleInputChange(e, "userName")}
                    />
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="title"
                      placeholder="Title"
                      value={updatedUser.title || ""}
                      onChange={(e) => handleInputChange(e, "title")}
                    />
                  </>
                ) : (
                  <>
                    <h4 className="fw-bold mb-0 text-dark-grey">
                      {actualUserData.userName || "Full Name"}
                    </h4>
                    <p className="text-medium-grey mb-1 fs-6">
                      {actualUserData.title || "Title"}
                    </p>
                  </>
                )}
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 justify-content-end mt-3"></div>
            <div className="d-flex justify-content-end mt-2">
              <p className="small text-medium-grey mb-0">
                Joined{" "}
                {actualUserData.createdAt
                  ? new Date(actualUserData.createdAt).toLocaleDateString(
                      "en-US",
                      { month: "long", year: "numeric" }
                    )
                  : "N/A"}{" "}
              </p>
            </div>
          </EditableSection>

          <EditableSection
            title="Summary"
            sectionKey="summary"
            isEditing={sectionEditModes.summary}
            onEdit={handleSectionEditToggle}
            onSave={handleSectionSave}
          >
            {sectionEditModes.summary ? (
              <textarea
                className="form-control"
                rows="4"
                name="summary"
                placeholder="Summary"
                value={updatedUser.summary || ""}
                onChange={(e) => handleInputChange(e, "summary")}
              ></textarea>
            ) : actualUserData.summary ? (
              <p className="text-dark-grey mb-0">{actualUserData.summary}</p>
            ) : (
              renderNoData("Summary")
            )}
          </EditableSection>

          <EditableSection
            title="Education"
            sectionKey="education"
            isEditing={sectionEditModes.education}
            onEdit={handleSectionEditToggle}
            onSave={handleSectionSave}
          >
            {sectionEditModes.education ? (
              <>
                {(updatedUser.education || []).map((edu, index) => (
                  <div
                    key={index}
                    className="education-item-edit mb-4 p-3 border rounded bg-light"
                  >
                    <h6>Education Entry {index + 1}</h6>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      name="institution"
                      placeholder="University / Institution"
                      value={edu.institution || ""}
                      onChange={(e) => handleInputChange(e, "education", index)}
                    />
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      name="degree"
                      placeholder="Degree (e.g., Bachelor's, Master's)"
                      value={edu.degree || ""}
                      onChange={(e) => handleInputChange(e, "education", index)}
                    />
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      name="fieldOfStudy"
                      placeholder="Field of Study"
                      value={edu.fieldOfStudy || ""}
                      onChange={(e) => handleInputChange(e, "education", index)}
                    />
                    <label className="form-label mt-2 mb-1 text-medium-grey">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-sm mb-2"
                      name="startDate"
                      value={
                        edu.startDate
                          ? new Date(edu.startDate).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => handleInputChange(e, "education", index)}
                    />
                    <label className="form-label mt-2 mb-1 text-medium-grey">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-sm mb-2"
                      name="endDate"
                      value={
                        edu.endDate
                          ? new Date(edu.endDate).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) => handleInputChange(e, "education", index)}
                    />
                    <textarea
                      className="form-control form-control-sm"
                      rows="2"
                      name="description"
                      placeholder="Description of studies and achievements"
                      value={edu.description || ""}
                      onChange={(e) => handleInputChange(e, "education", index)}
                    ></textarea>
                    {index > 0 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm mt-3"
                        onClick={() => {
                          setUpdatedUser((prev) => ({
                            ...prev,
                            education: prev.education.filter(
                              (_, i) => i !== index
                            ),
                          }));
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-primary-custom btn-sm mt-3"
                  onClick={handleAddEducation}
                >
                  Add More Education
                </button>
              </>
            ) : actualUserData.education &&
              actualUserData.education.length > 0 ? (
              actualUserData.education.map((edu, index) => (
                <div
                  key={index}
                  className="d-flex align-items-start gap-3 mb-3"
                >
                  <img
                    src="../../../public/Harvard_University_shield.png"
                    alt="University Logo"
                    className="profile-avatar-small"
                  />
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-0 text-dark-grey">
                      {edu.institution || "University/Institution"}
                    </h6>
                    <p className="text-medium-grey small mb-1">
                      {edu.degree || "Degree"} &bull;{" "}
                      {edu.fieldOfStudy || "Field of Study"}
                    </p>
                    <p className="text-dark-grey small mb-0">
                      {edu.description || "No description provided."}
                    </p>
                    {(edu.startDate || edu.endDate) && (
                      <p className="text-medium-grey small mb-0">
                        {edu.startDate
                          ? new Date(edu.startDate).getFullYear()
                          : ""}
                        {edu.startDate && edu.endDate ? " - " : ""}
                        {edu.endDate
                          ? new Date(edu.endDate).getFullYear()
                          : "Present"}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              renderNoData("Education")
            )}
          </EditableSection>

          <EditableSection
            title="Work Experience"
            sectionKey="workExperience"
            isEditing={sectionEditModes.workExperience}
            onEdit={handleSectionEditToggle}
            onSave={handleSectionSave}
          >
            {sectionEditModes.workExperience ? (
              <>
                {(updatedUser.workExperience || []).map((job, index) => (
                  <div
                    key={index}
                    className="work-experience-item-edit mb-4 p-3 border rounded bg-light"
                  >
                    <h6>Work Experience Entry {index + 1}</h6>
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      name="company"
                      placeholder="Company"
                      value={job.company || ""}
                      onChange={(e) =>
                        handleInputChange(e, "workExperience", index)
                      }
                    />
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      name="title"
                      placeholder="Job Title"
                      value={job.title || ""}
                      onChange={(e) =>
                        handleInputChange(e, "workExperience", index)
                      }
                    />
                    <input
                      type="text"
                      className="form-control form-control-sm mb-2"
                      name="location"
                      placeholder="Location (e.g., City, Country)"
                      value={job.location || ""}
                      onChange={(e) =>
                        handleInputChange(e, "workExperience", index)
                      }
                    />
                    <label className="form-label mt-2 mb-1 text-medium-grey">
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-sm mb-2"
                      name="startDate"
                      value={
                        job.startDate
                          ? new Date(job.startDate).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange(e, "workExperience", index)
                      }
                    />
                    <label className="form-label mt-2 mb-1 text-medium-grey">
                      End Date
                    </label>
                    <input
                      type="date"
                      className="form-control form-control-sm mb-2"
                      name="endDate"
                      value={
                        job.endDate
                          ? new Date(job.endDate).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange(e, "workExperience", index)
                      }
                    />
                    <textarea
                      className="form-control form-control-sm"
                      rows="2"
                      name="description"
                      placeholder="Job responsibilities and achievements"
                      value={job.description || ""}
                      onChange={(e) =>
                        handleInputChange(e, "workExperience", index)
                      }
                    ></textarea>
                    {index > 0 && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm mt-3"
                        onClick={() => {
                          setUpdatedUser((prev) => ({
                            ...prev,
                            workExperience: prev.workExperience.filter(
                              (_, i) => i !== index
                            ),
                          }));
                        }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-primary-custom btn-sm mt-3"
                  onClick={handleAddWorkExperience}
                >
                  Add More Experience
                </button>
              </>
            ) : actualUserData.workExperience &&
              actualUserData.workExperience.length > 0 ? (
              actualUserData.workExperience.map((job, index) => (
                <div
                  key={index}
                  className="d-flex align-items-start gap-3 mb-3"
                >
                  <img
                    src="../../../public/work-call-logo-icon-design-vector-22558311.jpg"
                    alt="Company Logo"
                    className="profile-avatar-small"
                  />
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-0 text-dark-grey">
                      {job.title || "Job Title"}
                    </h6>
                    <p className="text-medium-grey small mb-1">
                      {job.company || "Company"} &bull;{" "}
                      {job.startDate || job.endDate
                        ? `${
                            job.startDate
                              ? new Date(job.startDate).getFullYear()
                              : ""
                          }${job.startDate && job.endDate ? " - " : ""}${
                            job.endDate
                              ? new Date(job.endDate).getFullYear()
                              : "Present"
                          }`
                        : "Years"}
                    </p>
                    <p className="text-dark-grey small mb-0">
                      {job.description || "No description provided."}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              renderNoData("Work Experience")
            )}
          </EditableSection>
        </div>
        <div className="col-lg-4">
          <div className="border bord rounded">
            <EditableSection
              title="About Me"
              sectionKey="aboutMe"
              isEditing={sectionEditModes.aboutMe}
              onEdit={handleSectionEditToggle}
              onSave={handleSectionSave}
            >
              {sectionEditModes.aboutMe ? (
                <>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="primaryIndustry"
                      placeholder="Primary Industry"
                      value={updatedUser.aboutMe?.primaryIndustry || ""}
                      onChange={(e) => handleInputChange(e, "aboutMe")}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="expectedSalary"
                      placeholder="Expected Salary"
                      value={updatedUser.aboutMe?.expectedSalary || ""}
                      onChange={(e) => handleInputChange(e, "aboutMe")}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="experience"
                      placeholder="Experience (e.g., 0-2 years)"
                      value={updatedUser.aboutMe?.experience || ""}
                      onChange={(e) => handleInputChange(e, "aboutMe")}
                    />
                  </div>
                </>
              ) : actualUserData.aboutMe &&
                (actualUserData.aboutMe.primaryIndustry ||
                  actualUserData.aboutMe.expectedSalary ||
                  actualUserData.aboutMe.experience) ? (
                <>
                  <p className="mb-0 text-dark-grey">
                    <span className="fw-bold">Primary Industry:</span>{" "}
                    {actualUserData.aboutMe.primaryIndustry || "N/A"}
                  </p>
                  <p className="mb-0 text-dark-grey">
                    <span className="fw-bold">Expected Salary:</span>{" "}
                    {actualUserData.aboutMe.expectedSalary || "N/A"}
                  </p>
                  <p className="mb-0 text-dark-grey">
                    <span className="fw-bold">Experience:</span>{" "}
                    {actualUserData.aboutMe.experience || "N/A"}
                  </p>
                </>
              ) : (
                renderNoData("About Me")
              )}
            </EditableSection>

            <EditableSection
              title="Contacts"
              sectionKey="contacts"
              isEditing={sectionEditModes.contacts}
              onEdit={handleSectionEditToggle}
              onSave={handleSectionSave}
            >
              {sectionEditModes.contacts ? (
                <>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="phone"
                      placeholder="Phone"
                      value={updatedUser.contacts?.phone || ""}
                      onChange={(e) => handleInputChange(e, "contacts")}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="email"
                      className="form-control form-control-sm"
                      name="email"
                      placeholder="Email"
                      value={updatedUser.contacts?.email || ""}
                      onChange={(e) => handleInputChange(e, "contacts")}
                    />
                  </div>
                  <div className="mb-2">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="location"
                      placeholder="Location"
                      value={updatedUser.contacts?.location || ""}
                      onChange={(e) => handleInputChange(e, "contacts")}
                    />
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <FontAwesomeIcon
                      icon={faLinkedin}
                      className="fs-5 text-blue"
                    />
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      name="linkedin"
                      placeholder="LinkedIn Profile URL"
                      value={updatedUser.contacts?.linkedin || ""}
                      onChange={(e) => handleInputChange(e, "contacts")}
                    />
                  </div>
                </>
              ) : actualUserData.contacts &&
                (actualUserData.contacts.phone ||
                  actualUserData.contacts.email ||
                  actualUserData.contacts.location ||
                  actualUserData.contacts.linkedin) ? (
                <>
                  <p className="mb-0 text-dark-grey">
                    <span className="fw-bold">Phone:</span>{" "}
                    {actualUserData.contacts.phone || "N/A"}
                  </p>
                  <p className="mb-0 text-dark-grey">
                    <span className="fw-bold">Email:</span>{" "}
                    {actualUserData.contacts.email || "N/A"}
                  </p>
                  <p className="mb-0 text-dark-grey">
                    <span className="fw-bold">Location:</span>{" "}
                    {actualUserData.contacts.location || "N/A"}
                  </p>
                  <div className="d-flex align-items-center gap-2">
                    <FontAwesomeIcon
                      icon={faLinkedin}
                      className="fs-5 text-blue"
                    />
                    {actualUserData.contacts.linkedin ? (
                      <a
                        href={`https://${actualUserData.contacts.linkedin.replace(
                          /^https?:\/\//,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none text-blue small"
                      >
                        {actualUserData.contacts.linkedin}
                      </a>
                    ) : (
                      <p className="text-medium-grey small mb-0">N/A</p>
                    )}
                  </div>
                </>
              ) : (
                renderNoData("Contacts")
              )}
            </EditableSection>
            <EditableSection
              title="Objective"
              sectionKey="objective"
              isEditing={sectionEditModes.objective}
              onEdit={handleSectionEditToggle}
              onSave={handleSectionSave}
            >
              {sectionEditModes.objective ? (
                <textarea
                  className="form-control"
                  rows="3"
                  name="objective"
                  placeholder="Objective"
                  value={updatedUser.objective || ""}
                  onChange={(e) => handleInputChange(e, "objective")}
                ></textarea>
              ) : actualUserData.objective ? (
                <p className="text-dark-grey mb-0">
                  {actualUserData.objective}
                </p>
              ) : (
                renderNoData("Objective")
              )}
            </EditableSection>
            <EditableSection
              title="Skills"
              sectionKey="skills"
              isEditing={sectionEditModes.skills}
              onEdit={handleSectionEditToggle}
              onSave={handleSectionSave}
            >
              {sectionEditModes.skills ? (
                <textarea
                  className="form-control"
                  rows="3"
                  name="skills"
                  placeholder="Skills (comma-separated)"
                  value={updatedUser.skills?.join(", ") || ""}
                  onChange={(e) => handleInputChange(e, "skills")}
                ></textarea>
              ) : actualUserData.skills && actualUserData.skills.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {actualUserData.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                renderNoData("Skills")
              )}
            </EditableSection>

            <div className="section-card">
              <h6 className="fw-bold mb-3 text-dark-grey">Manage CV</h6>
              <div className="mb-3">
                <input
                  type="file"
                  id="cv-upload"
                  accept="application/pdf"
                  className="d-none"
                  onChange={handleCVUpload}
                />
                <label
                  htmlFor="cv-upload"
                  className="btn btn-primary-custom d-flex align-items-center gap-2"
                >
                  <FontAwesomeIcon icon={faCloudArrowUp} /> Upload / Update CV
                </label>
                {isLoading && (
                  <p className="text-medium-grey mt-2 mb-0">Uploading...</p>
                )}
              </div>
              {actualUserData.cv ? (
                <div className="mb-3">
                  <button
                    onClick={() => window.open(actualUserData.cv, "_blank")}
                    className="btn btn-primary-custom"
                  >
                    Show My Resume
                  </button>
                </div>
              ) : (
                <p className="text-medium-grey mb-3">No CV uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
