import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import styles from "./styles/components-styles/ChatSidebar.module.css";

const DUMMY_MESSAGES = [
  { id: 1, user: "Alice", text: "Hi! Need any help?" },
  { id: 2, user: "You", text: "Just exploring the tool!" },
];

function ChatSidebar({ onClose }) {
  const [messages, setMessages] = useState(DUMMY_MESSAGES);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      { id: Date.now(), user: "You", text: input.trim() },
    ]);
    setInput("");
  };

  return (
    <aside className={styles.chatSidebar}>
      <div className={styles.chatHeader}>
        <span>Chat</span>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#348983",
            padding: 0,
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
          }}
          aria-label="Close chat"
        >
          <FaTimes size={18} />
        </button>
      </div>
      <div className={styles.chatMessages}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={
              msg.user === "You"
                ? `${styles.messageRow} ${styles.you}`
                : `${styles.messageRow}`
            }
          >
            <div
              className={
                msg.user === "You"
                  ? `${styles.messageBubble} ${styles.you}`
                  : `${styles.messageBubble} ${styles.other}`
              }
            >
              {msg.user !== "You" && (
                <span className={styles.messageUser}>{msg.user}</span>
              )}
              <span>{msg.text}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form
        className={styles.chatInputWrapper}
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        autoComplete="off"
      >
        <input
          className={styles.chatInput}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message…"
          autoFocus
          maxLength={400}
        />
        <button type="submit" className={styles.sendBtn} aria-label="Send">
          <FaPaperPlane />
        </button>
      </form>
    </aside>
  );
}

export default ChatSidebar;
