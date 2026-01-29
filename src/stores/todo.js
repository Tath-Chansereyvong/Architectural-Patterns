import { defineStore } from "pinia";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
  }),
  getters: {
    countTodos: (state) => state.todos.length,
  },
  actions: {
    async fetchTodos() {
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 1,
              name: "Clean house",
              description: "cleaning house in detail .....",
              createdAt: "2024-15-07 07:50:00",
              completedAt: null,
            },
            {
              id: 2,
              name: "Do homework",
              description: "Instruction on doing homework ....",
              createdAt: "2024-05-07 08:00:00",
              completedAt: "2024-05-07 08:10:00",
            },
          ]);
        }, 1000);
      }).then((todos) => (this.todos = todos));
    },
    toggleStatus(id) {
      const foundIndex = this.todos.findIndex((t) => t.id == id);
      if (foundIndex >= 0) {
        if (this.todos[foundIndex].completedAt != null) {
          this.todos[foundIndex].completedAt = null;
        } else {
          this.todos[foundIndex].completedAt = new Date().toISOString();
        }
      }
    },
    addTodo(todo) {
      this.todos.push({
        id: this.todos.length + 1,
        name: todo,
        description: "description",
        createdAt: new Date().toISOString(),
        completedAt: null,
      });
      this.todos = JSON.parse(JSON.stringify(this.todos));
    },
    clearAll() {
      this.todos = [];
    },
  },
});
