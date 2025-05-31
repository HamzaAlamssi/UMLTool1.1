import React from "react";
import styles from "./Modal.module.css";

const Modal = ({ open, onClose, title, children, actions = [] }) => {
  if (!open) return null;
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {title && <div className={styles.modalHeader}>{title}</div>}
        <div className={styles.modalBody}>{children}</div>
        {actions.length > 0 && (
          <div className={styles.modalFooter}>
            {actions.map((action, idx) => (
              <button
                key={idx}
                className={styles.modalActionBtn + (action.variant ? ' ' + styles[action.variant] : '')}
                onClick={action.onClick}
                type="button"
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal; 