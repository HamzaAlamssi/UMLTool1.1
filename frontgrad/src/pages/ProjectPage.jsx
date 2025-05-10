import React, { useRef, useState, useEffect } from "react";
import Header from "../components/ProjectHeader";
import ChatSidebar from "../components/ChatSidebar";
import ShareModal from "../components/ShareModal";
import CollaboratorsModal from "../components/CollaboratorsModal";
import UmlEditor from "./yaqeen.jsx";
import { useParams } from "react-router-dom";

function ProjectPage() {
  const editorRef = useRef(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [collabOpen, setCollabOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [initialModel, setInitialModel] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const { id: projectId } = useParams();

  useEffect(() => {
    if (!projectId) return;
    fetch(`http://localhost:9000/api/projects/${projectId}`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setProject(data);
        if (data) {
          console.info(`[ProjectPage] Loaded project: id=${data.id}, name=${data.name}`);
        }
        // Accept both camelCase and snake_case for diagramJson
        const diagramJsonRaw = data?.diagramJson ?? data?.diagram_json;
        if (diagramJsonRaw) {
          let parsed = diagramJsonRaw;
          try {
            if (typeof parsed === "string") parsed = JSON.parse(parsed);
            if (typeof parsed === "string") parsed = JSON.parse(parsed);
          } catch (e) {
            parsed = e;
          }
          setInitialModel(parsed);
          if (parsed && typeof parsed === "object") {
            console.info(`[ProjectPage] Set initialModel: classes=${Array.isArray(parsed.classes) ? parsed.classes.length : 0}, relationships=${Array.isArray(parsed.relationships) ? parsed.relationships.length : 0}`);
          }
        } else {
          setInitialModel(null);
          console.info("[ProjectPage] No diagram_json found, initialModel set to null");
        }
      });
  }, [projectId]);


  useEffect(() => {
  fetch("http://localhost:9000/auth/aUser", { credentials: "include" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      console.log("Fetched currentUser:", data);
      setCurrentUser(data);
    });
  }, []);
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
      <UmlEditor
      ref={editorRef}
      projectId={projectId}
      initialModel={initialModel}
      />
      {chatOpen && (
        <ChatSidebar
          onClose={() => setChatOpen(false)}
          projectId={projectId}
          currentUser={currentUser}
        />
      )}
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        onManageCollaborators={() => {
          setShareOpen(false);
          setCollabOpen(true);
        }}
        projectId={projectId}
      />
      <CollaboratorsModal
        open={collabOpen}
        onClose={() => setCollabOpen(false)}
        onAdd={() => {
          setCollabOpen(false);
          setShareOpen(true);
        }}
      />
    </>
  );
}

export default ProjectPage;