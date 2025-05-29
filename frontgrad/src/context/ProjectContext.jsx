import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const ProjectContext = createContext();

export function useProjects() {
  return useContext(ProjectContext);
}

export function ProjectProvider({ children }) {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [sharedProjects, setSharedProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // List of public routes
  const publicRoutes = ["/login", "/register", "/ForgotPassword", "/AdminLogin"];

  // Fetch user info
  useEffect(() => {
    // Only fetch user if not on a public route
    if (publicRoutes.includes(location.pathname)) return;

    fetch("http://localhost:9000/auth/aUser", {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (res.status === 401) {
          navigate("/login", { replace: true });
          throw new Error("Not authenticated");
        }
        return res.ok ? res.json() : Promise.reject("Not authenticated");
      })
      .then((userData) => {
        console.log("[ProjectContext] Fetched user info:", userData);
        setUser(userData);
      })
      .catch((err) => {
        setError(err.message || err.toString());
        // Already navigated above if 401
      });
  }, [navigate, location.pathname]);

  // Fetch projects, shared projects, and templates
  const fetchAll = useCallback(() => {
    if (!user || (!user.email && !user.username)) return;
    const email = user.email || user.username;
    setLoading(true);
    Promise.all([
      fetch(`http://localhost:9000/api/projects/own?email=${encodeURIComponent(email)}`, { credentials: "include" })
        .then((res) => (res.ok ? res.json() : [])),
      fetch(`http://localhost:9000/api/projects/shared?email=${encodeURIComponent(email)}`, { credentials: "include" })
        .then((res) => (res.ok ? res.json() : [])),
      fetch("http://localhost:9000/api/templates", { credentials: "include" })
        .then((res) => (res.ok ? res.json() : [])),
    ])
      .then(([proj, shared, tpl]) => {
        setProjects(Array.isArray(proj) ? proj : []);
        setSharedProjects(Array.isArray(shared) ? shared : []);
        setTemplates(Array.isArray(tpl) ? tpl : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || err.toString());
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (user) fetchAll();
  }, [user, fetchAll]);

  // Add project (immediate UI update)
  const addProject = (project) => setProjects((prev) => [project, ...prev]);
  // Add shared project (if needed for UI update)
  const addSharedProject = (project) => setSharedProjects((prev) => [project, ...prev]);

  // Delete project (UI and backend)
  const deleteProject = async (projectId) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    try {
      await fetch(`http://localhost:9000/api/projects/${projectId}`, {
        method: "DELETE",
        credentials: "include",
      });
      // Optionally refresh from backend
      fetchAll();
    } catch (err) {
      setError(err.message || "Failed to delete project");
    }
  };

  // Refresh all
  const refresh = () => fetchAll();

  // Update project name (API + update state)
  const updateProjectName = async (projectId, newName) => {
    try {
      const res = await fetch(`http://localhost:9000/api/projects/updateName?projectId=${projectId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newName),
      });
      if (!res.ok) throw new Error("Failed to update project name");
      setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, name: newName } : p)));
    } catch (err) {
      setError(err.message || "Failed to update project name");
      throw err;
    }
  };

  // Create project (API + update state)
  const createProject = async (projectName) => {
    if (!user || (!user.email && !user.username)) throw new Error("User not authenticated");
    const email = user.email || user.username;
    try {
      const res = await fetch("http://localhost:9000/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: projectName,
          ownerEmail: email,
        }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      const data = await res.json();
      addProject(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to create project");
      throw err;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        user,
        projects,
        sharedProjects,
        templates,
        loading,
        error,
        addProject,
        addSharedProject,
        deleteProject,
        refresh,
        updateProjectName,
        createProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
} 