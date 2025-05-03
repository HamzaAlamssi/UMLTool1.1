import React, { useRef, useState, useEffect } from "react";
import ApollonEditor from "../components/ApollonEditor";
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
  const { id: projectId } = useParams();

  useEffect(() => {
    if (!projectId) return;
    fetch(`http://localhost:9000/api/projects/${projectId}`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setProject(data);
        if (data && data.diagram_json) {
          let parsed;
          try {
            parsed = typeof data.diagram_json === "string"
              ? JSON.parse(data.diagram_json)
              : data.diagram_json;
          } catch (e) {
            parsed = null;
          }
          setInitialModel(parsed);
          console.log("ProjectPage: Sending initialModel to UmlEditor:", parsed);
        } else {
          setInitialModel(null);
          console.log("ProjectPage: No diagram_json, sending null to UmlEditor");
        }
      });
  }, [projectId]);

  useEffect(() => {
    console.log("ProjectPage: editorRef.current =", editorRef.current);
  });

  useEffect(() => {
    if (editorRef.current) {
      console.log("ProjectPage: classes =", editorRef.current.classes);
      console.log("ProjectPage: relationships =", editorRef.current.relationships);
    }
  });

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
      <UmlEditor ref={editorRef} initialModel={initialModel} />
      {chatOpen && <ChatSidebar onClose={() => setChatOpen(false)} />}
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
