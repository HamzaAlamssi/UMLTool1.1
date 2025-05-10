import React, { useState, useRef, useEffect } from "react";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import styles from "./styles/components-styles/ChatSidebar.module.css";

function ChatSidebar({ onClose, projectId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const wsClientRef = useRef(null);

  // Fetch messages from backend
  const fetchMessages = async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/messages/project/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(
          data.map((msg) => ({
            id: msg.id,
            user: msg.sender?.username || msg.sender?.email || "Unknown",
            text: msg.content,
            timestamp: msg.timestamp,
          }))
        );
      }
    } catch (e) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  // WebSocket setup
  useEffect(() => {
    if (!projectId || !currentUser) return;
    // Use backend port for SockJS
    const socket = new SockJS("http://localhost:9000/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: () => { },
    });
    wsClientRef.current = client;
    client.onConnect = () => {
      client.subscribe(`/topic/project-${projectId}`, (message) => {
        console.log("Received WebSocket message:", message.body);
        const msg = JSON.parse(message.body);
        setMessages((prev) => [
          ...prev,
          {
            id: msg.id,
            user: msg.sender?.username || msg.sender?.email || "Unknown",
            text: msg.content,
            timestamp: msg.timestamp,
          },
        ]);
      });
    };
    client.activate();
    return () => {
      client.deactivate();
    };
  }, [projectId, currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message via WebSocket
  const sendMessage = async () => {
    if (!input.trim() || !currentUser || !projectId) {
      console.log('Blocked: input, currentUser, or projectId missing', { input, currentUser, projectId });
      return;
    }
    const messagePayload = {
      senderId: currentUser.username, // Use username as senderId (it's the email)
      projectId,
      content: input.trim(),
    };
    if (wsClientRef.current && wsClientRef.current.connected) {
      console.log('Sending via WebSocket', messagePayload);
      wsClientRef.current.publish({
        destination: "/app/chat.sendMessage",
        body: JSON.stringify(messagePayload),
      });
      setInput("");
    } else {
      console.log('WebSocket not connected, falling back to HTTP POST', messagePayload);
      try {
        const res = await fetch("/api/messages/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messagePayload),
        });
        if (res.ok) {
          setInput("");
          fetchMessages();
        }
      } catch (e) {
        console.log('HTTP POST failed', e);
      }
    }
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
        {loading ? (
          <div style={{ textAlign: "center", color: "#888" }}>Loading…</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={
                msg.user === currentUser.username // Use username for comparison
                  ? `${styles.messageRow} ${styles.you}`
                  : `${styles.messageRow}`
              }
            >
              <div
                className={
                  msg.user === currentUser.username // Use username for comparison
                    ? `${styles.messageBubble} ${styles.you}`
                    : `${styles.messageBubble} ${styles.other}`
                }
              >
                {msg.user !== currentUser.username && (
                  <span className={styles.messageUser}>{msg.user}</span>
                )}
                <span>{msg.text}</span>
              </div>
            </div>
          ))
        )}
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
