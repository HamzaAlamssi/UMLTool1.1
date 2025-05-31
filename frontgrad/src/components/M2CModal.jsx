import React from "react";
import Modal from "./Modal";
import styles from "./Modal.module.css";

const M2CModal = ({ open, onClose, code, copied, onCopy }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Generated Java Code"
      actions={[
        { label: copied ? "Copied!" : "Copy", onClick: onCopy, variant: copied ? "copied" : undefined },
        { label: "Close", onClick: onClose }
      ]}
    >
      <pre className={styles.modalCode}>{code}</pre>
    </Modal>
  );
};

export default M2CModal; 