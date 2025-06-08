import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatInterface() {
  // Array of { role: "user" | "assistant", content: string }
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to history
    setMessages((msgs) => [...msgs, { role: "user", content: input }]);
    setInput("");
    setLoading(true);

    // Prepare assistant message index
    let assistantIndex = null;

    // Add placeholder assistant message for streaming
    setMessages((msgs) => {
      assistantIndex = msgs.length + 1; // next index after user message
      return [...msgs, { role: "assistant", content: "" }];
    });

    const res = await fetch("http://localhost:8000/v1/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_prompt: input }),
    });

    if (!res.body) {
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let currentResponse = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      if (value) {
        const chunk = decoder.decode(value);
        currentResponse += chunk;
        setMessages((msgs) => {
          // Update only the last assistant message
          const newMsgs = [...msgs];
          // Always update the last message (the one we just appended)
          if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === "assistant") {
            newMsgs[newMsgs.length - 1] = {
              ...newMsgs[newMsgs.length - 1],
              content: currentResponse,
            };
          }
          return newMsgs;
        });
      }
    }
    setLoading(false);
  };

  // Message bubble styling
  const getBubbleStyle = (role) => ({
  fontFamily: "inherit",
  boxSizing: "border-box",
  background: role === "user" ? "#e9f0fe" : "#fff",
  color: "#222",
  padding: "0.85rem 1.15rem",
  borderRadius: 13,
  maxWidth: "80%",
  margin: role === "user" ? "0.7rem 0 1.5rem auto" : "0 0 1.5rem 0", // more gap between bubbles
  fontWeight: 500,
  fontSize: "1.06rem",
  alignSelf: role === "user" ? "flex-end" : "flex-start",
  border: role === "assistant" ? "1px solid #eaeaea" : "none",
  boxShadow: "0 1px 5px rgba(60,60,70,0.05)",
  wordBreak: "break-word"
});

  return (
    <section style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      minHeight: 0,
      minWidth: 0,
      background: "#fafbfc",
      fontFamily: "inherit"
    }}>
      {/* Message area */}
      <div style={{
        flex: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center"
      }}>
        <div
          className="markdown-body"
          style={{
            width: "100%",
            maxWidth: 720,
            margin: "0 auto",
            fontSize: "1.08rem",
            padding: "2rem 0 0.2rem 0",
            overflowY: "auto",
            flex: 1,
            display: "flex",
            flexDirection: "column"
          }}>
          {messages.map((msg, i) =>
            msg.role === "user" ? (
              <div key={i} style={getBubbleStyle("user")}>
                {msg.content}
              </div>
            ) : (
              <div key={i} style={getBubbleStyle("assistant")} className="bubble-md">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            )
          )}
          {loading && (
            <div style={getBubbleStyle("assistant")}>Loading...</div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Input bar */}
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff",
          borderTop: "1px solid #e5e7eb",
          padding: "0.7rem 0 0.7rem 0",
          margin: 0,
          flexShrink: 0,
        }}
      >
        <div style={{
          width: 700,
          maxWidth: "98vw",
          position: "relative",
          display: "flex",
          fontFamily: "inherit"
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            style={{
              width: "100%",
              borderRadius: "999px",
              padding: "0.93rem 3.3rem 0.93rem 1.2rem",
              border: "1px solid #ccc",
              fontSize: "1.07rem",
              background: "#fff",
              outline: "none",
              fontFamily: "inherit",
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
          />
          <button
            type="submit"
            style={{
              position: "absolute",
              right: 9,
              top: "50%",
              transform: "translateY(-50%)",
              background: "#89aaff",
              border: "none",
              borderRadius: "50%",
              width: 38,
              height: 38,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "1.35rem",
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              boxShadow: "0 1px 5px rgba(37,99,235,0.09)",
              opacity: input.trim() && !loading ? 1 : 0.5,
              transition: "background 0.15s",
              padding: 0,
            }}
            disabled={!input.trim() || loading}
            aria-label="Send"
          >
            <span style={{ marginTop: 1 }}>➤</span>
          </button>
        </div>
      </form>
    </section>
  );
}
