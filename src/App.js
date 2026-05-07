import React, { useState, useEffect } from "react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function App() {
  const [projects, setProjects] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [task, setTask] = useState({
    projectId: "",
    name: "",
    priority: "Medium",
    day: "",
    hours: ""
  });

  // ✅ Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ai_dash");
    if (saved) setProjects(JSON.parse(saved));
  }, []);

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem("ai_dash", JSON.stringify(projects));
  }, [projects]);

  const addProject = () => {
    if (!projectName) return;
    setProjects([
      ...projects,
      { id: Date.now(), name: projectName, tasks: [] }
    ]);
    setProjectName("");
  };

  const addTask = () => {
    if (!task.name || !task.projectId) return;

    setProjects(
      projects.map((p) =>
        p.id === Number(task.projectId)
          ? {
              ...p,
              tasks: [
                ...p.tasks,
                {
                  ...task,
                  id: Date.now(),
                  done: false,
                  hours: Number(task.hours || 0)
                }
              ]
            }
          : p
      )
    );

    setTask({
      projectId: "",
      name: "",
      priority: "Medium",
      day: "",
      hours: ""
    });
  };

  const toggleTask = (pid, tid) => {
    setProjects(
      projects.map((p) =>
        p.id === pid
          ? {
              ...p,
              tasks: p.tasks.map((t) =>
                t.id === tid ? { ...t, done: !t.done } : t
              )
            }
          : p
      )
    );
  };

  // ✅ AI: Suggest best day
  const suggestDay = () => {
    const load = days.map((d) => ({
      day: d,
      hours: projects.reduce(
        (acc, p) =>
          acc +
          p.tasks
            .filter((t) => t.day === d)
            .reduce((sum, t) => sum + t.hours, 0),
        0
      )
    }));

    const best = load.sort((a, b) => a.hours - b.hours)[0];
    setTask({ ...task, day: best.day });
  };

  // ✅ AI: priority scoring
  const scorePriority = () => {
    let priority = "Low";
    if (task.hours >= 4) priority = "High";
    else if (task.hours >= 2) priority = "Medium";

    setTask({ ...task, priority });
  };

  // ✅ AI: auto rebalance
  const rebalance = () => {
    let allTasks = projects.flatMap((p) =>
      p.tasks.map((t) => ({ ...t, projectId: p.id }))
    );

    let sorted = [...allTasks].sort((a, b) => b.hours - a.hours);
    let distribution = days.map((d) => ({ day: d, hours: 0 }));

    sorted.forEach((t) => {
      distribution.sort((a, b) => a.hours - b.hours);
      let target = distribution[0];
      t.day = target.day;
      target.hours += t.hours;
    });

    const updated = projects.map((p) => ({
      ...p,
      tasks: p.tasks.map((t) => {
        const newTask = sorted.find((x) => x.id === t.id);
        return newTask || t;
      })
    }));

    setProjects(updated);
  };

  // ✅ Build calendar
  const calendar = days.map((d) => ({
    day: d,
    tasks: projects.flatMap((p) => p.tasks.filter((t) => t.day === d))
  }));

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>AI Project Dashboard</h1>

      {/* Add Project */}
      <div style={{ marginBottom: "10px" }}>
        <input
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Project name"
        />
        <button onClick={addProject}>Add Project</button>
      </div>

      {/* Add Task */}
      <div style={{ border: "1px solid #ccc", padding: "10px" }}>
        <h3>Add Task</h3>

        <select
          value={task.projectId}
          onChange={(e) =>
            setTask({ ...task, projectId: e.target.value })
          }
        >
          <option value="">Select Project</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>

        <br />

        <input
          placeholder="Task"
          value={task.name}
          onChange={(e) => setTask({ ...task, name: e.target.value })}
        />

        <br />

        <input
          type="number"
          placeholder="Hours"
          value={task.hours}
          onChange={(e) => setTask({ ...task, hours: e.target.value })}
        />

        <br />

        <button onClick={scorePriority}>Auto Priority</button>

        <button onClick={suggestDay}>Suggest Day</button>

        <br />

        <select
          value={task.day}
          onChange={(e) => setTask({ ...task, day: e.target.value })}
        >
          <option value="">Assign Day</option>
          {days.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>

        <br />

        <button onClick={addTask}>Add Task</button>
      </div>

      {/* AI Controls */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={rebalance}>⚡ Auto-Rebalance Week</button>
      </div>

      {/* Calendar */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "10px",
          marginTop: "20px"
        }}
      >
        {calendar.map((col) => (
          <div key={col.day} style={{ border: "1px solid gray", padding: "10px" }}>
            <strong>{col.day}</strong>

            {col.tasks.map((t) => (
              <div
                key={t.id}
                onClick={() =>
                  toggleTask(
                    projects.find((p) =>
                      p.tasks.some((x) => x.id === t.id)
                    ).id,
                    t.id
                  )
                }
                style={{
                  cursor: "pointer",
                  textDecoration: t.done ? "line-through" : "none",
                  fontSize: "12px"
                }}
              >
                • {t.name} ({t.hours}h)
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
