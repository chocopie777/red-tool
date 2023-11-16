import {createSlice} from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    todos: [],
  },
  reducers: {
    addTodo(state, action) {
      state.todos.push({
        id: new Date().toISOString(),
        text: action.payload.text,
        completed: false,
      })
    },
    removeTodo(state, action) {
      state.todos = state.todos.filter(t => t.id !== action.payload.id);
    },
    toggleTodoComplete(state, action) {
      const toggledTodo = state.todos.find(t => t.id === action.payload.id);
      toggledTodo.completed = !toggledTodo.completed;
    },
  },
})

export const {addTodo, removeTodo, toggleTodoComplete} = todoSlice.actions;
export const todoReducer = todoSlice.reducer;