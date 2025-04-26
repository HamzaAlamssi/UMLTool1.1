import React, { useRef, useState, useEffect } from "react";
import ApollonEditor from "../components/ApollonEditor";
import Header from "../components/ProjectHeader";
import ChatSidebar from "../components/ChatSidebar";
import ShareModal from "../components/ShareModal";
import CollaboratorsModal from "../components/CollaboratorsModal";
import { useParams } from "react-router-dom";

function ProjectPage() {
  const editorRef = useRef(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [collabOpen, setCollabOpen] = useState(false);
  const [project, setProject] = useState(null);
  const { id: projectId } = useParams();

  // Fetch project by ID from URL
  useEffect(() => {
    if (!projectId) return;
    fetch(`http://localhost:9000/api/projects/${projectId}`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setProject(data));
  }, [projectId]);

  // Load diagram JSON into Apollon editor when ready
  useEffect(() => {
    if (
      project &&
      project.diagramJson &&
      editorRef.current &&
      typeof editorRef.current.model !== "undefined"
    ) {
      try {
        const diagram = JSON.parse(project.diagramJson);
        // Apollon expects the model under .model
        if (diagram.model) {
          editorRef.current.model = diagram.model;
        } else {
          editorRef.current.model = diagram;
        }
      } catch (e) {
        // ignore invalid JSON
      }
    }
  }, [project]);

  const handleOpenCollaborators = () => {
    setShareOpen(false);
    setCollabOpen(true);
  };

  const handleOpenShare = () => {
    setCollabOpen(false);
    setShareOpen(true);
  };

  return (
    <>
      <Header
        editorInstance={editorRef}
        onMessagesClick={() => setChatOpen((v) => !v)}
        onShareClick={() => setShareOpen(true)}
      />
      <div style={{ padding: "1rem" }}>
        {project ? (
          <div>
            <h2>
              Project: {project.name} (Type: {project.diagramType})
            </h2>
            <div>Owner: {project.owner && project.owner.username}</div>
          </div>
        ) : (
          <div>Loading project...</div>
        )}
      </div>
      <ApollonEditor ref={editorRef} />
      {chatOpen && <ChatSidebar onClose={() => setChatOpen(false)} />}
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        onManageCollaborators={handleOpenCollaborators}
      />
      <CollaboratorsModal
        open={collabOpen}
        onClose={() => setCollabOpen(false)}
        onAdd={handleOpenShare}
      />
    </>
  );
}

export default ProjectPage;
