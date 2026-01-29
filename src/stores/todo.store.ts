import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apolloClient } from '../apollo/client'
import { GET_TODOS, ADD_TODO, TOGGLE_TODO, DELETE_TODO, TODOS_SUB } from '../graphql/todos'
import type { FetchResult } from '@apollo/client/core'

export type Todo = {
  id: string
  title: string
  is_done: boolean
  created_at: string
}

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters for your UI
  const countTodos = computed(() => todos.value.filter(t => !t.is_done).length)

  async function fetchTodos() {
    loading.value = true
    try {
      const { data } = await apolloClient.query<{ todos: Todo[] }>({
        query: GET_TODOS,
        fetchPolicy: 'network-only',
      })
      if (data) todos.value = data.todos
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function addTodo(title: string) {
    if (!title.trim()) return
    const tempId = `temp-${Date.now()}`
    const optimisticTodo: Todo = {
      id: tempId,
      title,
      is_done: false,
      created_at: new Date().toISOString(),
    }
    todos.value = [optimisticTodo, ...todos.value]
    try {
      const result = await apolloClient.mutate<{ insert_todos_one: Todo }>({
        mutation: ADD_TODO,
        variables: { title },
      })
      const inserted = result.data?.insert_todos_one
      if (inserted) {
        const tempIndex = todos.value.findIndex(t => t.id === tempId)
        const wasDone = tempIndex >= 0 ? todos.value[tempIndex].is_done : false
        const idx = todos.value.findIndex(t => t.id === tempId)
        if (idx >= 0) {
          todos.value[idx] = inserted
        } else {
          todos.value = [inserted, ...todos.value]
        }
        if (wasDone) {
          await toggleStatus(inserted.id)
        }
        return
      }
    } finally {
      // If not using subscriptions, we manual fetch
      await fetchTodos()
    }
  }

  async function toggleStatus(id: string) {
    const todo = todos.value.find(t => t.id === id)
    if (!todo) return
    if (id.startsWith('temp-')) {
      todos.value = todos.value.map(t =>
        t.id === id ? { ...t, is_done: !t.is_done } : t
      )
      return
    }
    const previous = todo.is_done
    todos.value = todos.value.map(t =>
      t.id === id ? { ...t, is_done: !previous } : t
    )
    try {
      await apolloClient.mutate({
        mutation: TOGGLE_TODO,
        variables: { id, done: !previous },
      })
    } finally {
      await fetchTodos()
    }
  }

  async function clearAll() {
    if (!todos.value.length) return
    await Promise.all(
      todos.value.map((todo) =>
        apolloClient.mutate({
          mutation: DELETE_TODO,
          variables: { id: todo.id },
        })
      )
    )
    await fetchTodos()
  }

  function startRealtime() {
    const obs = apolloClient.subscribe<{ todos: Todo[] }>({ query: TODOS_SUB })
    const sub = obs.subscribe({
      next: (result: FetchResult<{ todos: Todo[] }>) => {
        if (result.data?.todos) todos.value = result.data.todos
      },
      error: (e) => console.error('Subscription error', e)
    })
    return () => sub.unsubscribe()
  }

  return {
    todos,
    loading,
    error,
    countTodos,
    fetchTodos,
    addTodo,
    toggleStatus,
    clearAll,
    startRealtime,
  }
})
