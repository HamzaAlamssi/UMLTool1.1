import React, { createContext, useContext, useState, useCallback } from "react";

const ProjectGroupContext = createContext();

export function useProjectGroup() {
  return useContext(ProjectGroupContext);
}

/**
 * Returns the permission level for the current user in the current project group.
 * Possible values: 'OWNER', 'EDIT', 'READONLY', 'VIEW', null
 */
export function useProjectPermission(user, project, group) {
  if (!user || !project) return null;
  if (project.owner?.email && user.email && project.owner.email.toLowerCase() === user.email.toLowerCase()) {
    return 'OWNER';
  }
  if (group && Array.isArray(group.members)) {
    const member = group.members.find(m => m.user?.email?.toLowerCase() === user.email?.toLowerCase());
    if (member) {
      if (member.permission === 'EDIT') return 'EDIT';
      if (member.permission === 'READONLY') return 'READONLY';
      if (member.permission === 'VIEW') return 'VIEW';
    }
  }
  return null;
}

export function ProjectGroupProvider({ projectId, children }) {
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch group info by projectId
  const fetchGroup = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:9000/api/groups/by-project/${projectId}`,
        { credentials: "include" }
      );
      if (!res.ok) {
        setGroup(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setGroup(data);
    } catch (err) {
      setError(err.message || "Failed to fetch group");
    }
    setLoading(false);
  }, [projectId]);

  // Create group
  const createGroup = async ({ groupName, members, cursorColor }) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:9000/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          projectId,
          groupName,
          members,
          cursorColor,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      await fetchGroup();
      return true;
    } catch (err) {
      setError(err.message || "Failed to create group");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add member
  const addMember = async ({ email, permission }) => {
    if (!group) return false;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:9000/api/groups/${group.id}/add-member`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, permission }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      await fetchGroup();
      return true;
    } catch (err) {
      setError(err.message || "Failed to add member");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove member
  const removeMember = async (email) => {
    if (!group) return false;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:9000/api/groups/${group.id}/remove-member?email=${encodeURIComponent(email)}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error(await res.text());
      await fetchGroup();
      return true;
    } catch (err) {
      setError(err.message || "Failed to remove member");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update member permission
  const updateMemberPermission = async (email, permission) => {
    if (!group) return false;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `http://localhost:9000/api/groups/${group.id}/update-member-permission`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email, permission }),
        }
      );
      if (!res.ok) throw new Error(await res.text());
      await fetchGroup();
      return true;
    } catch (err) {
      setError(err.message || "Failed to update permission");
      return false;
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (projectId) fetchGroup();
  }, [projectId, fetchGroup]);

  return (
    <ProjectGroupContext.Provider
      value={{
        group,
        members: group?.members || [],
        loading,
        error,
        createGroup,
        addMember,
        removeMember,
        updateMemberPermission,
        refreshGroup: fetchGroup,
      }}
    >
      {children}
    </ProjectGroupContext.Provider>
  );
} 