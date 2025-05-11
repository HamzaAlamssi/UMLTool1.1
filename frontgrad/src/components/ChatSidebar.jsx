import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { isSameDay } from "date-fns";
import styles from "./styles/components-styles/ChatSidebar.module.css";

function ChatSidebar({ onClose, projectId, currentUser }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const wsClientRef = useRef(null);

  // Use useCallback for stable fetch function
  const fetchMessages = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/messages/project/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(
          Array.isArray(data)
            ? data.map((msg) => ({
                id: msg.id,
                user: msg.sender && msg.sender.email ? msg.sender.email : "Unknown",
                text: msg.content,
                timestamp: msg.timestamp,
              }))
            : []
        );
      }
    } catch (e) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Proper WebSocket management and cleanup
  useEffect(() => {
    if (!projectId || !currentUser?.email) return;
    const socket = new SockJS("http://localhost:9000/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: () => {},
    });
    wsClientRef.current = client;
    client.onConnect = () => {
      client.subscribe(`/topic/project-${projectId}`, (message) => {
        const msg = JSON.parse(message.body);
        setMessages((prev) => [
          ...prev,
          {
            id: msg.id,
            user: msg.sender?.email || "Unknown",
            text: msg.content,
            timestamp: msg.timestamp,
          },
        ]);
      });
    };
    client.activate();
    return () => {
      if (wsClientRef.current) {
        wsClientRef.current.deactivate();
      }
    };
  }, [projectId, currentUser?.email]);

  // Always fetch messages when component mounts or projectId changes
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message via WebSocket or HTTP POST
  const sendMessage = async () => {
    if (!input.trim() || !currentUser?.email || !projectId) {
      alert("Missing message, user, or project info.");
      return;
    }
    const messagePayload = {
      senderId: currentUser.email, // Use email for user identification
      projectId,
      content: input.trim(),
    };
    if (wsClientRef.current && wsClientRef.current.connected) {
      try {
        wsClientRef.current.publish({
          destination: "/app/chat.sendMessage",
          body: JSON.stringify(messagePayload),
        });
        setInput("");
      } catch (err) {
        alert("WebSocket send failed: " + err.message);
      }
    } else {
      try {
        const res = await fetch("/api/messages/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(messagePayload),
        });
        if (res.ok) {
          setInput("");
          fetchMessages();
        } else {
          const errorText = await res.text();
          alert("Failed to send message: " + errorText);
        }
      } catch (e) {
        alert("HTTP send failed: " + e.message);
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
          <div style={{ textAlign: "center", color: "#888", fontSize: "1.1em", marginTop: "2em" }}>
            Loading messages...
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div style={{ textAlign: "center", color: "#bbb", fontSize: "1.1em", marginTop: "2em" }}>
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((msg, idx) => {
                const msgDate = msg.timestamp ? new Date(msg.timestamp) : null;
                const prevMsg = idx > 0 ? messages[idx - 1] : null;
                const showDateHeader =
                  msgDate &&
                  (!prevMsg ||
                    !isSameDay(
                      msgDate,
                      prevMsg && prevMsg.timestamp ? new Date(prevMsg.timestamp) : null
                    ));
                return (
                  <React.Fragment key={msg.id}>
                    {showDateHeader && (
                      <div style={{
                        textAlign: "center",
                        color: "#348983",
                        fontWeight: 600,
                        fontSize: "1.1em",
                        margin: "0.7em 0 1em 0"
                      }}>
                        {msgDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </div>
                    )}
                    <div
                      className={
                        msg.user === currentUser.email
                          ? `${styles.messageRow} ${styles.you}`
                          : `${styles.messageRow}`
                      }
                    >
                      <div
                        className={
                          msg.user === currentUser.email
                            ? `${styles.messageBubble} ${styles.you}`
                            : `${styles.messageBubble} ${styles.other}`
                        }
                      >
                        {msg.user !== currentUser.email && (
                          <span className={styles.messageUser}>{msg.user}</span>
                        )}
                        <span>{msg.text}</span>
                        <div style={{ fontSize: "0.8em", color: "#888", marginTop: 2 }}>
                          {msg.timestamp && new Date(msg.timestamp).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true,
                            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                          })}
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })
            )}
          </>
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
