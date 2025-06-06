import React, { useState, useRef, useEffect, useCallback } from "react";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { isSameDay } from "date-fns";
import styles from "./styles/components-styles/ChatSidebar.module.css";

function ChatSidebar({ onClose, projectId, currentUser, permission }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const wsClientRef = useRef(null);

  const canChat = permission === 'OWNER' || permission === 'EDIT' || permission === 'READONLY';

  // Use useCallback for stable fetch function
  const fetchMessages = useCallback(async () => {
    if (!projectId || !canChat) return;
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:9000/api/messages/project/${projectId}`, {
        credentials: "include"
      });
      console.log("Response status:", res.status);
      if (res.ok) {
        const data = await res.json();
        console.log("Fetched messages:", data);
        setMessages(
          Array.isArray(data)
            ? data.map((msg) => ({
              id: msg.id,
              user: msg.sender?.username || "Unknown",
              text: msg.content,
              timestamp: msg.timestamp,
            }))
            : []
        );
      } else {
        console.error("Server returned error:", res.status);
      }

    } catch (e) {
      console.error("Error fetching messages:", e);
    } finally {
      setLoading(false);
    }
  }, [projectId, canChat]);

  // Proper WebSocket management and cleanup
  useEffect(() => {
    if (!projectId || !currentUser?.username || !canChat) return;
    const socket = new SockJS("http://localhost:9000/ws");
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: () => { },
    });
    wsClientRef.current = client;
    client.onConnect = () => {
      client.subscribe(`/topic/project-${projectId}`, (message) => {
        const msg = JSON.parse(message.body);
        setMessages((prev) => [
          ...prev,
          {
            id: msg.id,
            user: msg.sender?.username || "Unknown",
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
  }, [projectId, currentUser?.username, canChat]);

  // Always fetch messages when component mounts or projectId changes
  useEffect(() => {
    if (!canChat) return;
    fetchMessages();
    const interval = setInterval(() => {
      fetchMessages();
    }, 2000);
    return () => clearInterval(interval);
  }, [fetchMessages, canChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message via WebSocket or HTTP POST
  const sendMessage = async () => {
    if (!input.trim() || !currentUser?.email || !projectId || !canChat) {
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
        fetchMessages(); // Fetch messages after sending via WebSocket
      } catch (err) {
        alert("WebSocket send failed: " + err.message);
      }
    } else {
      try {
        const res = await fetch("http://localhost:9000/api/messages/send", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include",
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
        {canChat ? (
          loading ? (
            <div style={{ textAlign: "center", color: "#888", fontSize: "1.1em", marginTop: "2em" }}>
              Loading messages, please wait...
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
                          msg.user === currentUser.username
                            ? `${styles.messageRow} ${styles.you}`
                            : `${styles.messageRow}`
                        }
                      >
                        <div
                          className={
                            msg.user === currentUser.username
                              ? `${styles.messageBubble} ${styles.you}`
                              : `${styles.messageBubble} ${styles.other}`
                          }
                        >
                          {msg.user !== currentUser.username && (
                            <span className={styles.messageUser}>{msg.user}</span>
                          )}
                          <span>{msg.text}</span>
                          {msg.timestamp && (
                            <div style={{ fontSize: "0.8em", color: "#888", marginTop: 2 }}>
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                              })}
                            </div>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })
              )}
            </>
          )
        ) : (
          <div style={{ textAlign: "center", color: "#bbb", fontSize: "1.1em", marginTop: "2em" }}>
            You do not have permission to view or send messages in this project.
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {canChat && (
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
      )}
    </aside>
  );
}

export default ChatSidebar;
