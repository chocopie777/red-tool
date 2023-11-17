import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";

export const fetchTodos = createAsyncThunk(
  'todos/fetchTodos',
  async function (_, thunkAPI) {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
      if (!response.ok) {
        throw new Error('ServerError!');
      }
      const data = await response.json();
      return data;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
)

export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async function(id, thunkAPI) {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE',
      })
      if(!response.ok) {
        throw new Error('Can\'t delete task. Server error.')
      }
      thunkAPI.dispatch(removeTodo({id}));
    } catch (e) {
      thunkAPI.rejectWithValue(e.message);
    }
  }
)

export const toggleStatus = createAsyncThunk(
  'todos/toggleStatus',
  async function(id, thunkAPI){
    const todo = thunkAPI.getState().todos.todos.find(todo => todo.id === id)
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          completed: !todo.completed,
        })
      })
      if(!response.ok) {
        throw new Error('Can\'t toggle status. Server error.')
      }
      thunkAPI.dispatch(toggleTodoComplete({id}));
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
)

export const addNewTodo = createAsyncThunk(
  'todos/addNewTodo',
  async function(text, thunkAPI) {
    try {
      const todo = {
        title: text,
        userId: 1,
        completed: false,
      };
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(todo),
      })
      if(!response.ok) {
        throw new Error('Can\'t add task. Server error.');
      }
      const data = await response.json();
      thunkAPI.dispatch(addTodo(data))
    } catch (e) {
      return thunkAPI.rejectWithValue(e.message);
    }
  }
)

const setError = (state, action) => {
  state.status = 'rejected';
  state.error = action.payload;
}

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    todos: [],
    status: null,
    error: null,
  },
  reducers: {
    addTodo(state, action) {
      state.todos.push(action.payload);
    },
    removeTodo(state, action) {
      state.todos = state.todos.filter(t => t.id !== action.payload.id);
    },
    toggleTodoComplete(state, action) {
      const toggledTodo = state.todos.find(t => t.id === action.payload.id);
      toggledTodo.completed = !toggledTodo.completed;
    },
  },
  extraReducers: {
    [fetchTodos.pending]: (state) => {
      state.status = 'loading';
      state.error = null;
    },
    [fetchTodos.fulfilled]: (state, action) => {
      state.status = 'resolved';
      state.todos = action.payload;
    },
    [fetchTodos.rejected]: setError,
    [deleteTodo.rejected]: setError,
    [toggleStatus.rejected]: setError,
  },
})

const {addTodo, removeTodo, toggleTodoComplete} = todoSlice.actions;
export const todoReducer = todoSlice.reducer;