<template>
  <ul class="todoLists">
    <template v-if="status == 'done'">
      <TodoItem v-for="todo of doneTodos" :key="todo.id" icon="uil-adobe-alt" :todo="todo" />
    </template>
    <template v-else-if="status == 'active'">
      <TodoItem v-for="todo of activeTodos" :key="todo.id" icon="uil-adobe-alt" :todo="todo" />
    </template>
    <template v-else>
      <TodoItem v-for="todo of allTodos" :key="todo.id" icon="uil-adobe-alt" :todo="todo" />
    </template>
  </ul>
</template>
<script>
import { mapState } from "pinia";
import TodoItem from "./TodoItem.vue";
import { useTodoStore } from "../stores/todo.store";

export default {
  setup() {
    const todoStore = useTodoStore();
    return { todoStore };
  },
  name: "TodoList",
  props: ["status"],
  components: {
    TodoItem,
  },
  data() {
    return {
      color: "red",
    };
  },
  async mounted() {
    // we will call action fetchTodos
    await this.todoStore.fetchTodos();
  },
  computed: {
    ...mapState(useTodoStore, ["todos"]),
    allTodos() {
      return this.todos;
    },
    doneTodos() {
      return this.todos.filter((todo) => todo.is_done === true);
    },
    activeTodos() {
      return this.todos.filter((todo) => todo.is_done === false);
    },
  },
  watch: {
    todos: {
      immediate: true,
      handler: function (dataChanged) {
        console.log("todos are changed");
      },
    },
  },
};
</script>
