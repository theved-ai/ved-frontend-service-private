export default function Sidebar() {
  return (
    <aside
      style={{
        width: 290,
        minWidth: 230,
        maxWidth: 320,
        background: "#f3f4f6",
        padding: "2.1rem 1.4rem 1.4rem 1.8rem",
        borderRight: "1px solid #e5e7eb",
        fontSize: "1.06rem",
        fontFamily: "inherit",
        lineHeight: 1.5,
        height: "100%",
        boxSizing: "border-box"
      }}
    >
      <h2 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "1.2rem" }}>
        What can Ved do?
      </h2>
      <div>
        <strong>Email (Gmail)</strong>
        <ul>
          <li>Search, read, and send emails</li>
          <li>Create and manage draft emails</li>
          <li>Manage email labels</li>
        </ul>
        <strong>Calendar (Google Calendar)</strong>
        <ul>
          <li>Create, modify, and delete calendar events</li>
          <li>List calendars and upcoming events</li>
        </ul>
        <strong>Slack</strong>
        <ul>
          <li>List channels and users</li>
          <li>Send and read messages</li>
          <li>Manage threads and replies</li>
          <li>Search messages and mentions</li>
        </ul>
        <strong>Google Tasks</strong>
        <ul>
          <li>List your task lists and tasks</li>
          <li>Create, update, or delete tasks</li>
        </ul>
      </div>
    </aside>
  );
}
