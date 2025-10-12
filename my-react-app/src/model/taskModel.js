// src/model/taskModel.js
// This file simulates the database interaction layer (like Mongoose/MongoDB)

const LOCAL_STORAGE_KEY = 'mvc_sim_tasks';

/* Fetches all tasks from the simulated database. (READ operation) */
export const apiFetchTasks = () => new Promise(resolve => {
    try {
        const storedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
        resolve(storedTasks ? JSON.parse(storedTasks) : []);
    } catch (error) {
        console.error("Model Error: Failed to read from localStorage:", error);
        resolve([]);
    }
});

/* Saves the entire list of tasks to the simulated database. (CREATE/UPDATE operation) */
export const apiSaveTasks = (tasks) => new Promise(resolve => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
        resolve({ success: true, data: tasks });
    } catch (error) {
        console.error("Model Error: Failed to write to localStorage:", error);
        resolve({ success: false, error: "Database write error" });
    }
});

