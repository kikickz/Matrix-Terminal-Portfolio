import { ref, watch, onMounted } from 'vue'

export interface Theme {
  name: string
  textClass: string
  borderClass: string
  helpTextClass: string
  bgClass: string
  preview: string
}

export const useTheme = () => {
  const themes: Theme[] = [
    {
      name: 'matrix',
      textClass: 'text-matrix-light',
      borderClass: 'border-matrix',
      helpTextClass: 'text-matrix-dark',
      bgClass: 'bg-black',
      preview: 'linear-gradient(45deg, #003b00, #008f11, #00ff41)'
    },
    {
      name: 'cyber',
      textClass: 'text-cyan-400',
      borderClass: 'border-cyan-500',
      helpTextClass: 'text-cyan-800',
      bgClass: 'bg-slate-900',
      preview: 'linear-gradient(45deg, #0e7490, #22d3ee, #67e8f9)'
    },
    {
      name: 'synthwave',
      textClass: 'text-fuchsia-400',
      borderClass: 'border-fuchsia-500',
      helpTextClass: 'text-fuchsia-900',
      bgClass: 'bg-gradient-to-br from-purple-900 via-violet-900 to-fuchsia-900',
      preview: 'linear-gradient(45deg, #701a75, #a21caf, #e879f9)'
    }
  ]

  const currentTheme = ref(themes[0])

  // Load theme from localStorage on mount
  onMounted(() => {
    const savedThemeName = localStorage.getItem('selectedTheme')
    if (savedThemeName) {
      const savedTheme = themes.find(theme => theme.name === savedThemeName)
      if (savedTheme) {
        currentTheme.value = savedTheme
      }
    }
  })

  // Save theme to localStorage when it changes
  watch(() => currentTheme.value, (newTheme) => {
    localStorage.setItem('selectedTheme', newTheme.name)
  }, { deep: true })

  return {
    themes,
    currentTheme
  }
}