// src/controller/taskController.js
// This file handles all CRUD business logic and state manipulation.

import { apiSaveTasks } from '../model/taskModel.js';

/* Executes a state change and persists the new state via the Model. */
const updateStateAndPersist = async (setTasks, setLoading, newTasks) => {
    setLoading(true);
    const result = await apiSaveTasks(newTasks);
    if (result.success) {
        setTasks(result.data);
    } else {
        console.error("Controller Error: Failed to save tasks:", result.error);
    }
    setLoading(false);
};

/* Creates a new task. (CREATE) */
export const addTask = async (tasks, setTasks, setLoading, title, description) => {
    const newTask = {
        id: Date.now(),
        title,
        description,
        completed: false,
        createdAt: new Date().toISOString(),
    };
    const newTasks = [...tasks, newTask];
    await updateStateAndPersist(setTasks, setLoading, newTasks);
};

/* Updates an existing task's details. (UPDATE) */
export const updateTask = async (tasks, setTasks, setLoading, id, title, description) => {
    const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, title, description } : task
    );
    await updateStateAndPersist(setTasks, setLoading, updatedTasks);
};

/* Toggles a task's completion status. (UPDATE) */
export const toggleCompletion = async (tasks, setTasks, setLoading, id) => {
    const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    await updateStateAndPersist(setTasks, setLoading, updatedTasks);
};

/* Deletes a task by ID. (DELETE) */
export const deleteTaskById = async (tasks, setTasks, setLoading, id) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    await updateStateAndPersist(setTasks, setLoading, updatedTasks);
};

