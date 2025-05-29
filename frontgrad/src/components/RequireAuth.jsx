import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../context/ProjectContext";

function RequireAuth({ children, role }) {
  const { user, error, loading } = useProjects();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || error || !user.email)) {
      navigate("/login", { replace: true });
    } else if (
      !loading &&
      role &&
      (!user.role || user.role.toLowerCase() !== role.toLowerCase())
    ) {
      navigate("/login", { replace: true });
    }
  }, [user, error, loading, navigate, role]);

  if (loading) return null; // or a loading spinner
  if (!user || error || !user.email) return null;
  if (role && (!user.role || user.role.toLowerCase() !== role.toLowerCase())) return null;
  return children;
}

export default RequireAuth; 