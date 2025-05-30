import React, { useRef, useState } from "react";
import {
  MdExpandMore,
  MdSaveAlt,
  MdFileUpload,
  MdZoomIn,
  MdZoomOut,
} from "react-icons/md";
import { FaSlideshare } from "react-icons/fa";
import { TbMessageChatbot } from "react-icons/tb";
import { FiUser } from "react-icons/fi";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./styles/components-styles/ProjectHeader.module.css";
import stylesHeader from "./styles/components-styles/Header.module.css";
import { useProjects } from "../context/ProjectContext";
import Modal from "./Modal";
import M2CModal from "./M2CModal";

const ProjectHeader = ({ editorInstance, onMessagesClick, onShareClick, projectName, projectOwner }) => {
  const fileInputRef = useRef(null);
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useProjects();

  const [showJavaImport, setShowJavaImport] = useState(false);
  const [javaCodeInput, setJavaCodeInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [showGeneratedCode, setShowGeneratedCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showM2CWarning, setShowM2CWarning] = useState(false);

  // Export canvas model as JSON (same as yaqeen.jsx)
  const exportDiagram = () => {
    console.log("ProjectHeader: exportDiagram called", editorInstance);
    if (!editorInstance?.current) {
      alert("Editor not ready");
      return;
    }
    const { classes, relationships } = editorInstance.current;
    console.log("ProjectHeader: exportDiagram model", { classes, relationships });
    if (!Array.isArray(classes) || !Array.isArray(relationships)) {
      alert("No model to export.");
      return;
    }
    const data = { classes, relationships };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uml_project.json";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
    a.remove();
  };

  // Import JSON into canvas model (same as yaqeen.jsx)
  const importDiagram = (event) => {
    console.log("ProjectHeader: importDiagram called", editorInstance);
    if (!editorInstance?.current) {
      alert("Editor not ready");
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data.classes) && Array.isArray(data.relationships)) {
          editorInstance.current.setModel(data.classes, data.relationships);
          alert("Model imported successfully!");
        } else {
          alert("Invalid JSON project format.");
        }
      } catch (err) {
        alert("Could not parse JSON: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Save canvas model to DB (update diagram_json)
  const saveDiagramToDatabase = async () => {
    console.log("ProjectHeader: saveDiagramToDatabase called", editorInstance);
    if (!editorInstance?.current) {
      alert("Editor not ready");
      return;
    }
    const { classes, relationships } = editorInstance.current;
    console.log("ProjectHeader: saveDiagramToDatabase model", { classes, relationships });
    if (!Array.isArray(classes) || !Array.isArray(relationships)) {
      alert("No model to save.");
      return;
    }
    try {
      // Send as a single string (not object) for diagramJson
      const res = await fetch(
        `http://localhost:9000/api/projects/updateDiagram?projectId=${projectId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(JSON.stringify({ classes, relationships })),
        }
      );
      if (res.ok) {
        alert("Diagram saved to database!");
      } else {
        alert("Failed to save diagram.");
      }
    } catch (err) {
      alert("Error saving diagram: " + err.message);
    }
  };

  const handleZoomIn = () => {
    if (editorInstance?.current && editorInstance.current.zoomIn) {
      editorInstance.current.zoomIn();
    }
  };
  const handleZoomOut = () => {
    if (editorInstance?.current && editorInstance.current.zoomOut) {
      editorInstance.current.zoomOut();
    }
  };

  // Java code generation logic (moved from UMLEditor)
  function generateJavaCode(classes, relationships) {
    classes = Array.isArray(classes) ? classes : [];
    relationships = Array.isArray(relationships) ? relationships : [];
    const visibilityMap = {
      public: "public",
      private: "private",
      protected: "protected",
      package: "/* package */"
    };
    const parseAttribute = (attrName) => {
      const [name, type] = attrName.split(":").map(s => s.trim());
      return {
        name: name || "unknown",
        type: type || "String"
      };
    };
    const parseMethod = (methodName) => {
      const parts = methodName.split(":").map(s => s.trim());
      let returnType = "void";
      let signature = methodName;
      if (parts.length > 1) {
        returnType = parts.pop();
        signature = parts.join(":").trim();
      }
      if (!signature.includes("(") || !signature.endsWith(")")) {
        signature = `${signature.replace(/\)?$/, "")}()`;
      }
      const [namePart, paramsPart] = signature.split(/\((.*)\)/s);
      const params = paramsPart
        ? paramsPart.split(",")
            .map(param => {
              const [pName, pType] = param.split(":").map(s => s.trim());
              return {
                name: pName || "param",
                type: pType || "Object"
              };
            })
            .filter(p => p.name)
        : [];
      return {
        name: namePart.trim(),
        params,
        returnType: returnType || "void"
      };
    };
    let code = "";
    const processedClasses = new Set();
    classes.forEach(cls => {
      if (processedClasses.has(cls.id)) return;
      processedClasses.add(cls.id);
      code += `public class ${cls.name} `;
      const inheritance = relationships.find(r =>
        r.type === "inheritance" && r.fromId === cls.id
      );
      if (inheritance) {
        const parent = classes.find(c => c.id === inheritance.toId);
        code += `extends ${parent?.name} `;
      }
      code += '{\n';
      (cls.attributes || []).forEach(attr => {
        const parsed = parseAttribute(attr.name);
        code += `    ${visibilityMap[attr.visibility]} ${parsed.type} ${parsed.name};\n`;
      });
      (cls.methods || []).forEach(method => {
        const parsed = parseMethod(method.name);
        code += `    ${visibilityMap[method.visibility]} ${parsed.returnType} ${parsed.name}(`;
        code += parsed.params.map(p => `${p.type} ${p.name}`).join(", ");
        code += `) {\n`;
        code += `        // TODO: Implement method\n`;
        code += `    }\n\n`;
      });
      code += '}\n\n';
    });
    return code;
  }

  function parseJavaCode(code) {
    const classes = [];
    const relationships = [];
    const classBlocks = code.split(/(?=public\s+class|private\s+class|protected\s+class|class)/g);
    classBlocks.forEach(block => {
      const classMatch = block.match(/class\s+(\w+)(?:\s+extends\s+(\w+))?/);
      if (!classMatch) return;
      const className = classMatch[1];
      const parentClass = classMatch[2];
      const classBody = block.slice(classMatch.index + classMatch[0].length);
      const newClass = {
        id: `cls_${className}`,
        type: 'class',
        name: className,
        x: 100 + classes.length * 300,
        y: 100,
        width: 200,
        height: 150,
        attributes: [],
        methods: []
      };
      if (parentClass) {
        relationships.push({
          fromId: newClass.id,
          toId: `cls_${parentClass}`,
          type: 'inheritance'
        });
      }
      const fieldRegex = /(public|private|protected)\s+([\w<>]+)\s+(\w+)\s*;/g;
      let fieldMatch;
      while ((fieldMatch = fieldRegex.exec(classBody)) !== null) {
        newClass.attributes.push({
          name: `${fieldMatch[3]}: ${fieldMatch[2]}`,
          visibility: fieldMatch[1].toLowerCase()
        });
      }
      const methodRegex = /(public|private|protected)\s+([\w<>]+)\s+(\w+)\s*\(([^)]*)\)/g;
      let methodMatch;
      while ((methodMatch = methodRegex.exec(classBody)) !== null) {
        const params = methodMatch[4]
          .split(',')
          .map(p => p.trim())
          .filter(p => p)
          .map(p => {
            const parts = p.split(/\s+/).filter(Boolean);
            return {
              name: parts[1] || 'param',
              type: parts[0] || 'Object'
            };
          });
        const paramString = params.map(p => `${p.name}: ${p.type}`).join(', ');
        newClass.methods.push({
          name: `${methodMatch[3]}${params.length ? `(${paramString})` : '()'}: ${methodMatch[2]}`,
          visibility: methodMatch[1].toLowerCase()
        });
      }
      classes.push(newClass);
    });
    return { classes, relationships };
  }

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #348983 60%, #5eead4 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(52, 137, 131, 0.10)",
            marginRight: "0.7rem",
            cursor: "pointer",
            overflow: "hidden",
          }}
          onClick={() => navigate("/main")}
          title="Go to Main Page"
        >
          <img src="/image/white_logo.png" className={stylesHeader.logo} alt="Logo" />
        </div>
        {/* View dropdown only */}
        <div className={styles.dropdown}>
          <button className={styles.menuButton}>
            View <MdExpandMore style={{ fontSize: "1.1em", marginLeft: 6 }} />
          </button>
          <div className={styles.dropdownContent}>
            <button className={styles.dropdownItem} onClick={handleZoomIn}>
              <MdZoomIn /> Zoom In
            </button>
            <button className={styles.dropdownItem} onClick={handleZoomOut}>
              <MdZoomOut /> Zoom Out
            </button>
          </div>
        </div>
        {/* Edit dropdown */}
        <div className={styles.dropdown}>
          <button className={styles.menuButton}>
            Edit <MdExpandMore style={{ fontSize: "1.1em", marginLeft: 6 }} />
          </button>
          <div className={styles.dropdownContent}>
            <button className={styles.dropdownItem} onClick={() => {
              if (window.confirm('Are you sure you want to clear the canvas? This cannot be undone.')) {
                if (editorInstance?.current && editorInstance.current.clearCanvas) {
                  editorInstance.current.clearCanvas();
                }
              }
            }}>Clear</button>
          </div>
        </div>
        {/* Save button */}
        <button
          className={`${styles.saveBtn} ${styles.smallBtn}`}
          onClick={saveDiagramToDatabase}
          title="Save diagram to database"
        >
          <MdSaveAlt style={{ marginRight: 4 }} /> Save
        </button>
        {projectName && (
          <div className={styles.projectInfo}>
            <span className={styles.projectName}>{projectName}</span>
            {projectOwner && (
              <span className={styles.projectOwner}>
                Owner: {projectOwner}
              </span>
            )}
          </div>
        )}
      </div>
      <div className={styles.rightSection}>
        <button
          className={styles.smallBtn + ' ' + styles.exportBtn}
          onClick={exportDiagram}
          title="Export diagram as JSON"
        >
          <span className={styles.iconWrap}><MdSaveAlt /></span>
          <span className={styles.btnText}>Export JSON</span>
        </button>
        <button
          className={styles.smallBtn + ' ' + styles.importBtn}
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          title="Import diagram from JSON"
        >
          <span className={styles.iconWrap}><MdFileUpload /></span>
          <span className={styles.btnText}>Import JSON</span>
        </button>
        <input
          type="file"
          accept=".json"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={importDiagram}
        />
        {/* --- Java code generation/import buttons --- */}
        <button
          className={styles.smallBtn}
          onClick={() => {
            if (typeof projectName === 'string' && typeof window !== 'undefined') {
              // Try to get diagram type from the DOM or a prop if available
              const diagramType = window.__CURRENT_DIAGRAM_TYPE__ || (window.project && window.project.diagramType) || null;
              if (diagramType && diagramType.toLowerCase() !== 'class') {
                setShowM2CWarning(true);
                return;
              }
            }
            if (typeof window !== 'undefined' && window.project && window.project.diagramType && window.project.diagramType.toLowerCase() !== 'class') {
              setShowM2CWarning(true);
              return;
            }
            if (typeof projectDiagramType === 'string' && projectDiagramType.toLowerCase() !== 'class') {
              setShowM2CWarning(true);
              return;
            }
            // fallback: try to infer from model
            const { classes = [], relationships = [] } = editorInstance?.current || {};
            if (classes.some(c => c.type !== 'class')) {
              setShowM2CWarning(true);
              return;
            }
            const code = generateJavaCode(classes, relationships);
            setGeneratedCode(code || '// No code generated');
            setShowGeneratedCode(true);
          }}
          title="Generate Java Code from Model"
        >
          M2C
        </button>
        <button
          className={styles.smallBtn}
          onClick={() => setShowJavaImport(true)}
          title="Import Java Code to Model"
        >
          C2M
        </button>
        {/* Share button */}
        <button className={styles.smallBtn} onClick={onShareClick}>
          <FaSlideshare style={{ marginRight: 4 }} /> Share
        </button>
        {/* Messages button */}
        <button className={styles.messagesBtn} onClick={onMessagesClick}>
          <TbMessageChatbot style={{ marginRight: 4 }} /> Messages
        </button>
        {/* User avatar in right section */}
        <div
          style={{
            height: "2.3rem",
            width: "2.3rem",
            borderRadius: "9999px",
            border: "2px solid #5eead4",
            background: "linear-gradient(135deg, #fff 60%, #e0fdfa 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginLeft: "0.7rem",
            boxShadow: "0 2px 8px rgba(52, 137, 131, 0.10)",
            overflow: "hidden",
          }}
        >
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="User Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <FiUser size={22} color="#348983" />
          )}
        </div>
        {/* Java Code Generation Modal */}
        <M2CModal
          open={showGeneratedCode}
          onClose={() => setShowGeneratedCode(false)}
          code={generatedCode}
          copied={copied}
          onCopy={async () => {
            try {
              await navigator.clipboard.writeText(generatedCode);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            } catch (err) {
              alert('Failed to copy code. Please copy manually.');
            }
          }}
        />
        {/* Java Import Modal */}
        <Modal
          open={showJavaImport}
          onClose={() => setShowJavaImport(false)}
          title="Import Java Code"
          actions={[
            {
              label: "Import",
              onClick: () => {
                try {
                  const parsed = parseJavaCode(javaCodeInput);
                  if (!editorInstance?.current) return;
                  if (parsed.classes.length === 0) {
                    alert('No valid classes found in Java code.');
                    return;
                  }
                  editorInstance.current.setModel(parsed.classes, parsed.relationships);
                  setShowJavaImport(false);
                  setJavaCodeInput('');
                } catch (e) {
                  alert('Error parsing Java code: ' + e.message);
                }
              },
            },
            {
              label: "Cancel",
              onClick: () => setShowJavaImport(false),
            },
          ]}
        >
          <textarea
            className={styles.modalTextarea}
            value={javaCodeInput}
            onChange={e => setJavaCodeInput(e.target.value)}
            placeholder="Paste Java classes here..."
          />
        </Modal>
        <Modal open={showM2CWarning} onClose={() => setShowM2CWarning(false)}>
          <div className={styles.modalHeader}>Not Supported</div>
          <div className={styles.modalBody}>
            Java code generation is only available for class diagrams.
          </div>
          <div className={styles.modalFooter}>
            <button className={styles.saveBtn} onClick={() => setShowM2CWarning(false)}>
              Close
            </button>
          </div>
        </Modal>
      </div>
    </header>
  );
};

export default ProjectHeader;