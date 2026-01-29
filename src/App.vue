<template>
  <div class="container">
    <AddTodo @added="handleAddTodo" />
    <div class="filter-tabs">
      <button
        class="tab"
        :class="{ active: currentFilter === 'all' }"
        @click="currentFilter = 'all'"
      >
        All
      </button>
      <button
        class="tab"
        :class="{ active: currentFilter === 'active' }"
        @click="currentFilter = 'active'"
      >
        Active
      </button>
      <button
        class="tab"
        :class="{ active: currentFilter === 'done' }"
        @click="currentFilter = 'done'"
      >
        Done
      </button>
    </div>

    <TodoLists :status="currentFilter" />
    <div class="pending-tasks">
      <span
        >You have <span class="pending-num"> {{ nbOfTodo }} </span> tasks
        pending.</span
      >
      <button class="clear-button" @click="clearAllTodos">Clear All</button>
    </div>
  </div>
</template>
<script>
import { mapState } from "pinia";
import AddTodo from "./components/AddTodo.vue";
import TodoLists from "./components/TodoList.vue";

import { useTodoStore } from "./stores/todo.store";
export default {
  name: "App",
  setup() {
    const store = useTodoStore();
    return {
      store,
    };
  },
  components: {
    AddTodo,
    TodoLists,
  },
  data() {
    return {
      currentFilter: "all",
    };
  },
  computed: {
    ...mapState(useTodoStore, {
      nbOfTodo: "countTodos",
    }),
  },
  methods: {
    handleAddTodo(todo) {
      this.store.addTodo(todo);
    },
    clearAllTodos() {
      console.log("clear");
      this.store.clearAll();
    },
  },
};
</script>
<style>
@import "https://unicons.iconscout.com/release/v4.0.0/css/line.css";
</style>
