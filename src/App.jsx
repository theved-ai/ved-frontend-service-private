import React from "react";
import Sidebar from "./Sidebar";
import ChatInterface from "./ChatInterface";

export default function App() {
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      background: "#fafbfc",
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif"
    }}>
      <header style={{
        width: "100%",
        textAlign: "center",
        padding: "1.1rem 0 1rem 0",
        background: "#fff",
        fontWeight: 700,
        fontSize: "2.2rem",
        letterSpacing: "2px",
        borderBottom: "1px solid #eee",
        fontFamily: "inherit",
        flexShrink: 0,
      }}>
        theved.ai
      </header>
      <div style={{
        flex: 1,
        display: "flex",
        minHeight: 0, // for scrollable children
        minWidth: 0
      }}>
        <Sidebar />
        <ChatInterface />
      </div>
    </div>
  );
}
