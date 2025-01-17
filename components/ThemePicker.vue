<template>
  <div class="absolute top-4 right-4 flex gap-2">
    <button 
      v-for="theme in themes" 
      :key="theme.name"
      @click="$emit('update:currentTheme', theme)"
      :class="[
        'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
        currentTheme.name === theme.name ? 'border-white' : 'border-transparent'
      ]"
      :style="{ background: theme.preview }"
    ></button>
  </div>
</template>

<script setup lang="ts">
import type { Theme } from '~/composables/useTheme'

defineProps<{
  themes: Theme[]
  currentTheme: Theme
}>()

defineEmits<{
  'update:currentTheme': [theme: Theme]
}>()
</script>