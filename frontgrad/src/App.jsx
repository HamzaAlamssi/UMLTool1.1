import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import RecentProjectsPage from "./pages/RecentProjectsPage";
import SharedWithMePage from "./pages/SharedWithMePage";
import TemplatesPage from "./pages/TemplatesPage";
import ErrorPage from "./pages/ErrorPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AddUserPage from "./pages/AddUserPage";
import DeleteUserPage from "./pages/DeleteUserPage";
import ViewUsersPage from "./pages/ViewUsersPage";
import ManageUserProfilePage from "./pages/ManageUserProfilePage";
import ProfilePage from "./pages/NewProfilePage";
import ProjectPage from "./pages/ProjectPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage />} /> //done
        <Route path="login" element={<LoginPage />} /> //done
        <Route path="register" element={<RegisterPage />} /> //done
        <Route path="main" element={<MainPage />} /> //done
        <Route path="recentProjects" element={<RecentProjectsPage />} />
        <Route path="SharedWithMe" element={<SharedWithMePage />} />
        <Route path="Templates" element={<TemplatesPage />} /> //done
        <Route path="*" element={<ErrorPage />} /> //done
        <Route path="ForgotPassword" element={<ForgotPasswordPage />} />
        <Route path="DeleteUser" element={<DeleteUserPage />} />
        <Route path="AddUser" element={<AddUserPage />} />
        <Route path="ViewUsers" element={<ViewUsersPage />} />
        <Route path="ManageUserProfile" element={<ManageUserProfilePage />} />
        <Route path="Profile" element={<ProfilePage />} /> //done
        <Route path="project/:id" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
