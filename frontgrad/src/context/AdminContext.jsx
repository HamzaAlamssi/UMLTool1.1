import React, { createContext, useContext, useState, useCallback } from "react";

const AdminContext = createContext();

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }) {
  const [templates, setTemplates] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all templates
  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:9000/api/templates", { credentials: "include" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setTemplates(data);
    } catch (err) {
      setError(err.message || "Failed to fetch templates");
    }
    setLoading(false);
  }, []);

  // Save a new template
  const saveTemplate = async ({ name, type, diagramJson }) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:9000/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, type, diagramJson }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setTemplates((prev) => [data, ...prev]);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || "Failed to save template");
      setLoading(false);
      throw err;
    }
  };

  // Fetch all users
  const fetchUsers = useCallback(async (query = "") => {
    setLoading(true);
    setError("");
    try {
      const url = query
        ? `http://localhost:9000/api/users/search?q=${encodeURIComponent(query)}`
        : "http://localhost:9000/api/users";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError(err.message || "Failed to fetch users");
    }
    setLoading(false);
  }, []);

  // Add a new user
  const addUser = async (userData) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:9000/api/admin/add-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(userData),
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchUsers();
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || "Failed to add user");
      setLoading(false);
      throw err;
    }
  };

  // Delete user(s)
  const deleteUsers = async (emails) => {
    setLoading(true);
    setError("");
    try {
      await Promise.all(
        emails.map(async (email) => {
          const res = await fetch(`http://localhost:9000/api/users/${encodeURIComponent(email)}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!res.ok) throw new Error(await res.text());
        })
      );
      await fetchUsers();
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || "Failed to delete user(s)");
      setLoading(false);
      throw err;
    }
  };

  // Update user
  const updateUser = async (email, updateData) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:9000/api/users/${encodeURIComponent(email)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updateData),
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchUsers();
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || "Failed to update user");
      setLoading(false);
      throw err;
    }
  };

  // Update an existing template
  const updateTemplate = async (id, { name, type, diagramJson }) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:9000/api/templates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, type, diagramJson }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setTemplates((prev) => prev.map(t => t.id === id ? data : t));
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || "Failed to update template");
      setLoading(false);
      throw err;
    }
  };

  // Delete a template by id
  const deleteTemplate = async (id) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:9000/api/templates/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error(await res.text());
      setTemplates((prev) => prev.filter(t => t.id !== id));
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.message || "Failed to delete template");
      setLoading(false);
      throw err;
    }
  };

  // Expose context value
  return (
    <AdminContext.Provider
      value={{
        templates,
        users,
        loading,
        error,
        fetchTemplates,
        saveTemplate,
        fetchUsers,
        addUser,
        deleteUsers,
        updateUser,
        updateTemplate,
        deleteTemplate,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
} 