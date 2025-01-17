<template>
  <div :class="currentTheme.bgClass" class="min-h-screen p-4 flex flex-col">
    <div class="container mx-auto max-w-3xl flex-grow px-0 sm:px-4">
      <TerminalHeader :text-class="currentTheme.textClass" />

      <TerminalWindow
        :command-history="commandHistory"
        v-model:currentCommand="currentCommand"
        :current-path="currentPath"
        :text-class="currentTheme.textClass"
        :border-class="currentTheme.borderClass"
        :command-input="commandInput"
        :handle-tab-completion="handleTabCompletion"
        :execute-command="executeCommand"
        :handle-key-down="handleKeyDown"
      />

      <!-- Help Text -->
      <div class="mt-4 text-sm" :class="currentTheme.helpTextClass">
        Type 'help' to see available commands
      </div>
    </div>

    <!-- Matrix Overlay -->
    <div v-if="showMatrixOverlay" class="fixed inset-0 bg-black z-50 font-mono text-matrix-light p-8 overflow-hidden">
      <pre v-html="matrixOutput" class="whitespace-pre-wrap text-center"></pre>
    </div>

    <!-- Footer -->
    <footer :class="[currentTheme.textClass, 'mt-8 text-center text-sm font-mono']">
      © 2025 
      <a 
        href="https://www.linkedin.com/in/kieranbdn/" 
        target="_blank" 
        class="hover:underline cursor-pointer"
      >@kieranboudouin</a>
      . All rights reserved.
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useFileSystem } from '~/composables/useFileSystem'
import { useTheme } from '~/composables/useTheme'
import { useTerminal } from '~/composables/useTerminal'

const { currentPath, fileSystem } = useFileSystem()
const { themes, currentTheme } = useTheme()
const showMatrixOverlay = ref(false)
const matrixOutput = ref('')

const {
  commandHistory,
  currentCommand,
  commandInput,
  handleTabCompletion,
  executeCommand,
  handleKeyDown
} = useTerminal(fileSystem, currentPath, themes, currentTheme, showMatrixOverlay, matrixOutput)

onMounted(() => {
  commandHistory.value.push({
    command: '',
    output: `Welcome to the Terminal!
Type 'help' to see available commands.`
  })
  
  // Focus input on mount and when clicking anywhere in the terminal
  commandInput.value?.focus()
  document.addEventListener('click', () => {
    commandInput.value?.focus()
  })
})
</script>