import React, { useRef, useState, useEffect } from "react";
import UmlEditor from "./UMLEditor";
import styles from "../components/styles/admin-pages/AdminTemplatesPage.module.css";
import { useAdmin } from "../context/AdminContext";
import { FaArrowLeft, FaArrowCircleLeft, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TEMPLATE_TYPES = [
  { value: "design pattern", label: "Design Pattern" },
  { value: "customized", label: "Customized" },
];

function AdminTemplatesPage() {
  const editorRef = useRef();
  const { templates, fetchTemplates, saveTemplate, updateTemplate, deleteTemplate, loading, error } = useAdmin();
  const [templateType, setTemplateType] = useState(TEMPLATE_TYPES[0].value);
  const [templateName, setTemplateName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [success, setSuccess] = useState("");
  const [initialModel, setInitialModel] = useState(null);
  const [prevPage, setPrevPage] = useState("/ViewUsers");
  const navigate = useNavigate();

  // Fetch templates on mount
  useEffect(() => {
    fetchTemplates();
    // Try to get previous page from history
    if (window.history.state && window.history.state.idx > 0) {
      setPrevPage(document.referrer || "/ViewUsers");
    }
    // eslint-disable-next-line
  }, []);

  // When a template is selected, load its data
  useEffect(() => {
    if (!selectedTemplateId) return;
    const template = templates.find(t => t.id === Number(selectedTemplateId));
    if (template) {
      setTemplateName(template.name);
      setTemplateType(template.type);
      try {
        const diagram = JSON.parse(template.diagramJson || '{}');
        setInitialModel({
          classes: Array.isArray(diagram.classes) ? diagram.classes : [],
          relationships: Array.isArray(diagram.relationships) ? diagram.relationships : [],
        });
        // Set model in editor
        setTimeout(() => {
          if (editorRef.current && editorRef.current.setModel) {
            editorRef.current.setModel(
              Array.isArray(diagram.classes) ? diagram.classes : [],
              Array.isArray(diagram.relationships) ? diagram.relationships : []
            );
          }
        }, 0);
      } catch {
        setInitialModel({ classes: [], relationships: [] });
      }
    }
  }, [selectedTemplateId, templates]);

  // When a new template is created, clear selection and fields
  const resetFields = () => {
    setSelectedTemplateId("");
    setTemplateName("");
    setTemplateType(TEMPLATE_TYPES[0].value);
    setInitialModel({ classes: [], relationships: [] });
    setTimeout(() => {
      if (editorRef.current && editorRef.current.setModel) {
        editorRef.current.setModel([], []);
      }
    }, 0);
  };

  // Create new template
  const handleCreate = async () => {
    if (!templateName.trim()) {
      setSuccess("");
      window.alert("Please enter a template name.");
      return;
    }
    const { classes, relationships } = editorRef.current || {};
    if (!Array.isArray(classes) || !Array.isArray(relationships)) {
      window.alert("No diagram to save.");
      return;
    }
    try {
      await saveTemplate({
        name: templateName,
        type: templateType,
        diagramJson: JSON.stringify({ classes, relationships }),
      });
      setSuccess("Template created successfully!");
      window.alert("Template created successfully!");
      resetFields();
      fetchTemplates();
    } catch (e) {
      setSuccess("");
    }
  };

  // Update existing template
  const handleSave = async () => {
    if (!templateName.trim()) {
      setSuccess("");
      window.alert("Please enter a template name.");
      return;
    }
    const { classes, relationships } = editorRef.current || {};
    if (!Array.isArray(classes) || !Array.isArray(relationships)) {
      window.alert("No diagram to save.");
      return;
    }
    try {
      await updateTemplate(selectedTemplateId, {
        name: templateName,
        type: templateType,
        diagramJson: JSON.stringify({ classes, relationships }),
      });
      setSuccess("Template updated successfully!");
      window.alert("Template updated successfully!");
      fetchTemplates();
    } catch (e) {
      setSuccess("");
    }
  };

  // Remove selected template from DB
  const handleRemoveTemplate = async () => {
    if (!selectedTemplateId) return;
    try {
      await deleteTemplate(selectedTemplateId);
      window.alert("Template deleted successfully!");
      resetFields();
      fetchTemplates();
    } catch (e) {
      window.alert("Failed to delete template: " + (e?.message || e));
    }
  };

  // Go to previous page
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate(prevPage);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.contentWrapper}>
        <header className={styles.header}>

        <div className={styles.headerFields}>
            <button
                className={styles.iconBtn}
                onClick={handleBack}
                title="Go Back"
                style={{ marginRight: 0 }}
            >
                <FaArrowCircleLeft />
            </button>
            <select
              className={styles.typeSelect}
              value={templateType}
              onChange={e => setTemplateType(e.target.value)}
              disabled={!!selectedTemplateId}
            >
              {TEMPLATE_TYPES.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <input
              className={styles.nameInput}
              type="text"
              placeholder="Template Name"
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              maxLength={40}
              disabled={!!selectedTemplateId && loading}
            />
            <button
              className={styles.createBtn}
              onClick={handleCreate}
              disabled={!!selectedTemplateId || loading}
            >
              <span>Create</span> <span style={{ marginLeft: '0.4em' }}>Template</span>
            </button>
            <button
              className={styles.saveBtn}
              onClick={handleSave}
              disabled={!selectedTemplateId || loading}
            >
              <span>Save</span> <span style={{ marginLeft: '0.4em' }}>Template</span>
            </button>
            <select
              className={styles.typeSelect}
              value={selectedTemplateId}
              onChange={e => setSelectedTemplateId(e.target.value)}
            >
              <option value="">Select Template...</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <button
              className={styles.removeBtn}
              onClick={handleRemoveTemplate}
              disabled={!selectedTemplateId}
              title="Delete selected template"
            >
              <FaTimes />
            </button>
          </div>
          {error && <span className={styles.error}>{error}</span>}
        </header>
        <div className={styles.editorFullWrapper}>
          <UmlEditor ref={editorRef} permission="OWNER" initialModel={initialModel} />
        </div>
      </div>
    </div>
  );
}

export default AdminTemplatesPage; 