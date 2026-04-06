import test from "node:test";
import assert from "node:assert/strict";
import { calculateMetrics, isTaskOverdue, sortTasks } from "../src/task-utils.js";

const taskA = {
  id: "1",
  title: "Write docs",
  description: "",
  deadlineIso: "2026-04-08T10:00:00Z",
  completed: false,
};

const taskB = {
  id: "2",
  title: "Add feature",
  description: "",
  deadlineIso: "2026-04-07T10:00:00Z",
  completed: true,
};

const taskC = {
  id: "3",
  title: "Bug fix",
  description: "",
  deadlineIso: "2026-04-06T10:00:00Z",
  completed: false,
};

test("sortTasks sorts by title", () => {
  const result = sortTasks([taskA, taskB, taskC], "Sort-Title");
  assert.deepEqual(
    result.map((task) => task.title),
    ["Add feature", "Bug fix", "Write docs"],
  );
});

test("sortTasks sorts by due date", () => {
  const result = sortTasks([taskA, taskB, taskC], "Sort-Due-Date");
  assert.deepEqual(
    result.map((task) => task.id),
    ["3", "2", "1"],
  );
});

test("isTaskOverdue ignores completed tasks", () => {
  const now = new Date("2026-04-09T00:00:00Z");
  assert.equal(isTaskOverdue(taskB, now), false);
});

test("calculateMetrics returns expected totals", () => {
  const now = new Date("2026-04-07T12:00:00Z");
  const metrics = calculateMetrics([taskA, taskB, taskC], now);

  assert.deepEqual(metrics, {
    total: 3,
    completed: 1,
    pending: 2,
    overdue: 1,
    completionRate: 33,
  });
});
