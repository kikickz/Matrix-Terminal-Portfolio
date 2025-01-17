<template>
  <div :class="[borderClass, 'bg-black p-4 rounded border w-full']">
    <!-- Command History -->
    <div class="mb-4">
      <div v-for="(entry, index) in commandHistory" :key="index" class="mb-2">
        <div :class="textClass">
          kieran@portfolio:{{ currentPath }}$ {{ entry.command }}
        </div>
        <div v-if="entry.output" :class="[textClass, 'whitespace-pre-wrap']" v-html="formatOutput(entry.output)"></div>
      </div>
    </div>

    <!-- Current Command Line -->
    <div class="flex items-center w-full">
      <span :class="textClass">kieran@portfolio:{{ currentPath }}$&nbsp;</span>
      <input
        ref="commandInput"
        :value="currentCommand"
        @input="$emit('update:currentCommand', ($event.target as HTMLInputElement).value)"
        @keyup.enter="executeCommand"
        @keydown.tab.prevent="handleTabCompletion"
        @keydown="handleKeyDown"
        :class="[textClass, 'flex-1 bg-transparent border-none outline-none focus:ring-0 w-full']"
        type="text"
        spellcheck="false"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CommandEntry } from '~/composables/useTerminal'

const props = defineProps<{
  commandHistory: CommandEntry[]
  currentCommand: string
  currentPath: string
  textClass: string
  borderClass: string
  commandInput: HTMLInputElement | null
  handleTabCompletion: () => void
  executeCommand: () => void
  handleKeyDown: (e: KeyboardEvent) => void
}>()

defineEmits<{
  'update:currentCommand': [value: string]
}>()

const formatOutput = (output: string) => {
  // Make @linkedin clickable
  if (output === '@linkedin') {
    return `<a href="https://www.linkedin.com/in/kieranbdn/" target="_blank" class="${props.textClass} hover:underline cursor-pointer">@linkedin</a>`
  }
  return output
}
</script>