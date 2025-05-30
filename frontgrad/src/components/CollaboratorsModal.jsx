import React, { useState } from "react";
import styles from "./styles/components-styles/CollaboratorsModal.module.css";
import { useProjectGroup } from "../context/ProjectGroupContext";

function CollaboratorsModal({ open, onClose, onAdd, project }) {
  const { group, members, removeMember, addMember, updateMemberPermission, loading, error, refreshGroup } = useProjectGroup();
  const [newEmail, setNewEmail] = useState("");
  const [newPerm, setNewPerm] = useState("EDIT");
  const [permEdits, setPermEdits] = useState({}); // { email: permission }
  const [savingPerms, setSavingPerms] = useState(false);

  const ownerEmail = project?.owner?.email;

  React.useEffect(() => {
    // Reset edits when group changes
    setPermEdits({});
  }, [group]);

  if (!open) return null;

  const handleRemove = async (email) => {
    await removeMember(email);
  };

  const handleAdd = async () => {
    if (!newEmail.trim() || newEmail.trim().toLowerCase() === ownerEmail?.toLowerCase()) return;
    await addMember({ email: newEmail.trim(), permission: newPerm });
    setNewEmail("");
    setNewPerm("EDIT");
  };

  const handlePermChange = (email, permission) => {
    setPermEdits((prev) => ({ ...prev, [email]: permission }));
  };

  const handleSavePerms = async () => {
    setSavingPerms(true);
    for (const m of members) {
      const newPerm = permEdits[m.user.email];
      if (newPerm && newPerm !== m.permission) {
        await updateMemberPermission(m.user.email, newPerm);
      }
    }
    setPermEdits({});
    setSavingPerms(false);
    await refreshGroup();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 className={styles.groupName}>{group?.name || "Group"}</h1>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close" style={{ alignSelf: "flex-start" }}>
            ×
          </button>
        </div>
        <h2 className={styles.title}>Manage Project Collaborators</h2>
        <div className={styles.collaboratorsList}>
          {members.map((c) => {
            const isOwner = c.user.email === ownerEmail;
            return (
              <div className={styles.collaborator} key={c.user.email} style={{ gap: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 2 }}>
                  {c.user.profileImage ? (
                    <img className={styles.avatar} src={c.user.profileImage} alt="Avatar" style={{ borderRadius: '50%', width: 42, height: 42, objectFit: 'cover', marginRight: 10 }} />
                  ) : (
                    <div className={`${styles.avatar} ${styles.fallback}`} style={{ marginRight: 10 }}>{c.user.username?.[0]?.toUpperCase() || c.user.email[0]}</div>
                  )}
                  <span className={styles.name} style={{ fontWeight: 600, fontSize: '1.05rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 120 }}>{c.user.username || c.user.email}</span>
                </div>
                {isOwner ? (
                  <span className={styles.role} style={{ marginLeft: 12, fontWeight: 700, color: '#348983', flex: 1 }}>Owner</span>
                ) : (
                  <select
                    className={styles.select}
                    value={permEdits[c.user.email] || c.permission}
                    onChange={e => handlePermChange(c.user.email, e.target.value)}
                    disabled={loading || savingPerms}
                    style={{ flex: 3, minWidth: 120, maxWidth: 220 }}
                  >
                    <option value="EDIT">Edit and share</option>
                    <option value="VIEW">View only</option>
                    <option value="READONLY">Comment only</option>
                  </select>
                )}
                <button
                  className={styles.removeBtn}
                  title="Remove"
                  onClick={() => handleRemove(c.user.email)}
                  style={{ marginLeft: 8, opacity: isOwner ? 0.3 : 1, pointerEvents: isOwner ? 'none' : 'auto' }}
                  disabled={loading || savingPerms || isOwner}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
        <div className={styles.addMemberRow}>
          <input
            type="email"
            placeholder="Add member email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            className={styles.addMemberInput}
            disabled={loading || savingPerms}
            style={{ borderColor: newEmail.trim().toLowerCase() === ownerEmail?.toLowerCase() ? '#e57373' : undefined }}
          />
          <select value={newPerm} onChange={e => setNewPerm(e.target.value)} className={styles.select} disabled={loading || savingPerms}>
            <option value="EDIT">Edit and share</option>
            <option value="VIEW">View only</option>
            <option value="READONLY">Comment only</option>
          </select>
          <button className={styles.primaryBtn} onClick={handleAdd} disabled={loading || savingPerms || !newEmail.trim() || newEmail.trim().toLowerCase() === ownerEmail?.toLowerCase()}>
            Add
          </button>
        </div>
        {newEmail.trim().toLowerCase() === ownerEmail?.toLowerCase() && (
          <div style={{ color: '#e57373', fontSize: '0.95rem', marginTop: -8, marginBottom: 8 }}>
            The project owner is already part of the group.
          </div>
        )}
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div className={styles.footerButtons}>
          <button className={styles.primaryBtn} onClick={onClose} disabled={loading || savingPerms}>
            Done
          </button>
          <button className={styles.primaryBtn} onClick={handleSavePerms} disabled={loading || savingPerms || Object.keys(permEdits).length === 0} style={{ marginLeft: 8 }}>
            {savingPerms ? "Saving..." : "Save Perm"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CollaboratorsModal;
