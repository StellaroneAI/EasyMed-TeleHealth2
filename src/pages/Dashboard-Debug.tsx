import React from "react";

export default function Dashboard() {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ fontSize: "24px", marginBottom: "20px", color: "#333" }}>
        EasyMedPro Dashboard - Debug Mode
      </h1>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "18px", marginBottom: "10px" }}>
          Dashboard Components Test
        </h2>
        <p>
          If you can see this clearly, the issue is with one of the React
          components.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#f0f9ff",
              padding: "16px",
              borderRadius: "6px",
            }}
          >
            <h3>Test Card 1</h3>
            <p>Sample content</p>
          </div>
          <div
            style={{
              backgroundColor: "#f0fdf4",
              padding: "16px",
              borderRadius: "6px",
            }}
          >
            <h3>Test Card 2</h3>
            <p>More content</p>
          </div>
          <div
            style={{
              backgroundColor: "#fef3f2",
              padding: "16px",
              borderRadius: "6px",
            }}
          >
            <h3>Test Card 3</h3>
            <p>Even more content</p>
          </div>
        </div>
      </div>

      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h2>Next Steps</h2>
        <ol>
          <li>
            If this page displays correctly, we'll gradually add back the
            components
          </li>
          <li>
            If this still has issues, it's a fundamental CSS/styling problem
          </li>
          <li>We'll identify which component is causing the icon overflow</li>
        </ol>
      </div>
    </div>
  );
}
