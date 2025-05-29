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
import { ProjectProvider } from "./context/ProjectContext";
import RequireAuth from "./components/RequireAuth";
import AdminLoginPage from "./pages/AdminLoginPage";

function App() {
  return (
    <BrowserRouter>
      <ProjectProvider>
        <Routes>
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="AdminLogin" element={<AdminLoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="ForgotPassword" element={<ForgotPasswordPage />} />
          <Route path="*" element={<ErrorPage />} />

          {/* Protected routes */}
          <Route path="main" element={<RequireAuth><MainPage /></RequireAuth>} />
          <Route path="recentProjects" element={<RequireAuth><RecentProjectsPage /></RequireAuth>} />
          <Route path="SharedWithMe" element={<RequireAuth><SharedWithMePage /></RequireAuth>} />
          <Route path="Templates" element={<RequireAuth><TemplatesPage /></RequireAuth>} />
          <Route path="DeleteUser" element={<RequireAuth role="admin"><DeleteUserPage /></RequireAuth>} />
          <Route path="AddUser" element={<RequireAuth role="admin"><AddUserPage /></RequireAuth>} />
          <Route path="ViewUsers" element={<RequireAuth role="admin"><ViewUsersPage /></RequireAuth>} />
          <Route path="ManageUserProfile" element={<RequireAuth role="admin"><ManageUserProfilePage /></RequireAuth>} />
          <Route path="Profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
          <Route path="project/:id" element={<RequireAuth><ProjectPage /></RequireAuth>} />
        </Routes>
      </ProjectProvider>
    </BrowserRouter>
  );
}
export default App;
