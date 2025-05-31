import React, { useRef, useState, useEffect } from "react";
import Header from "../components/ProjectHeader";
import ChatSidebar from "../components/ChatSidebar";
import ShareModal from "../components/ShareModal";
import CollaboratorsModal from "../components/CollaboratorsModal";
import UmlEditor from "./UMLEditor.jsx";
import { useParams } from "react-router-dom";
import { useProjects } from "../context/ProjectContext";
import { ProjectGroupProvider, useProjectGroup, useProjectPermission } from "../context/ProjectGroupContext";

function getOwnerPermission(user, project) {
  if (!user || !project) return false;
  // Accept both username and email for owner check
  if (
    (project.ownerUsername && user.username && project.ownerUsername === user.username) ||
    (project.ownerEmail && user.email && project.ownerEmail.toLowerCase() === user.email.toLowerCase())
  ) {
    return true;
  }
  return false;
}

function ProjectPageInner({ projectId }) {
  const editorRef = useRef(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [collabOpen, setCollabOpen] = useState(false);
  const [project, setProject] = useState(null);
  const [initialModel, setInitialModel] = useState(null);
  const { user } = useProjects();
  const [error, setError] = useState(null);
  const { group, loading: groupLoading } = useProjectGroup();
  const [modalState, setModalState] = useState(null); // 'share' | 'collab' | null
  const isOwner = getOwnerPermission(user, project);
  const permission = isOwner ? 'OWNER' : useProjectPermission(user, project, group);

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
      })
      .catch((err) => {
        setError("Failed to load project data. Please try again later.");
        console.error(err);
      });
  }, [projectId]);

  return (
    <>
      <Header
        editorInstance={editorRef}
        onMessagesClick={() => setChatOpen((v) => !v)}
        onShareClick={() => {
          if (group) setModalState('collab');
          else setModalState('share');
        }}
        projectName={project?.name}
        projectOwner={project?.ownerUsername}
        permission={permission}
      />
      <div style={{ padding: "1rem" }}>
        {project ? (
          <div>
            <h2>
              Project: {project.name} (Type: {project.diagramType})
            </h2>
            <div>Owner: {project.ownerUsername}</div>
            {project.groupName && (
              <div>
                <strong>Group:</strong> {project.groupName}
                <br />
                <strong>Members:</strong> {project.groupMembers && project.groupMembers.join(", ")}
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#888', marginTop: '2em' }}>
            Loading project details, please wait...
          </div>
        )}
      </div>
      <UmlEditor
        ref={editorRef}
        projectId={projectId}
        initialModel={initialModel}
        permission={permission}
      />
      {chatOpen && (permission === 'OWNER' || permission === 'EDIT' || permission === 'READONLY') && (
        <ChatSidebar
          onClose={() => setChatOpen(false)}
          projectId={projectId}
          currentUser={user}
          permission={permission}
        />
      )}
      <ShareModal
        open={modalState === 'share' && permission === 'OWNER'}
        onClose={() => setModalState(null)}
        onManageCollaborators={() => setModalState('collab')}
        projectId={projectId}
      />
      <CollaboratorsModal
        open={modalState === 'collab' && permission === 'OWNER'}
        onClose={() => setModalState(null)}
        onAdd={() => setModalState('share')}
        project={project}
      />
      {/* If error state is used, ensure it is friendly */}
      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginTop: '2em' }}>
          Oops! Something went wrong: {error}
        </div>
      )}
    </>
  );
}

export default function ProjectPageWrapper() {
  const { id: projectId } = useParams();
  return (
    <ProjectGroupProvider projectId={projectId}>
      <ProjectPageInner projectId={projectId} />
    </ProjectGroupProvider>
  );
}