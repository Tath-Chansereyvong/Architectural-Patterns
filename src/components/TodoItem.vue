<template>
  <li class="list pending" @click="toggleStatus(todo.id)">
    <input
      type="checkbox"
      :checked="todo.is_done"
      @click.stop
      @change="toggleStatus(todo.id)"
    />
    <span class="task">{{ todo.title }}</span>
    <i class="uil" :class="icon"></i>
  </li>
</template>
<script>
import { useTodoStore } from "../stores/todo.store";
export default {
  setup() {
    const todoStore = useTodoStore();
    return { todoStore };
  },
  props: ["todo", "icon"],
  methods: {
    toggleStatus(todoId) {
      this.todoStore.toggleStatus(todoId);
    },
  },
};
</script>
