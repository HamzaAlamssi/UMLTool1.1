import React, { useEffect, useRef } from "react";
import { ApollonEditor, UMLDiagramType, ApollonMode } from "@ls1intum/apollon";
import styles from "./styles/components-styles/ApollonEditor.module.css";

// Always use UseCaseDiagram regardless of prop
const ApollonEditorComponent = React.forwardRef((props, ref) => {
  const editorContainerRef = useRef(null);

  useEffect(() => {
    if (editorContainerRef.current && !ref?.current) {
      ref.current = new ApollonEditor(editorContainerRef.current, {
        mode: ApollonMode.Modelling,
        type: UMLDiagramType.UseCaseDiagram,
      });
    }
    return () => {
      if (ref?.current) {
        ref.current.destroy();
        ref.current = null;
      }
    };
  }, [ref]);

  return (
    <div className={styles.editorWrapper}>
      <div ref={editorContainerRef} className={styles.editorContainer} />
    </div>
  );
});

export default ApollonEditorComponent;
