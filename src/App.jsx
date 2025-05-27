import { Route, Routes } from "react-router-dom";
import CompanyHome from "./components/CompanyHome/CompanyHome";
import CreateJob from "./components/CreateJob/CreateJob";
import JobDetailsPage from "./components/JobDetailsPage/JobDetailsPage";
import JobsPage from "./components/JobsPage/JobsPage";
import Login from "./components/Login/Login";
import CompanyDetails from "./components/CompanyDetails/CompanyDetails";
import ProfilePage from "./components/Profile/Profile";
import Register from "./components/Register/Register";
import Layout from "./components/Layout/Layout";
import "./assets/fonts/clash-display.css";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<JobsPage />} />
          <Route path="create-job" element={<CreateJob />} />
          <Route path="job/:id" element={<JobDetailsPage />} />
          <Route path="Profile" element={<ProfilePage />} />
          <Route path="CompanyHome" element={<CompanyHome />} />
          <Route path="Companydetails/:id" element={<CompanyDetails />} />
        </Route>

        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </>
  );
}
export default App;
