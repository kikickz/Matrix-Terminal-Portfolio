import { ref, onMounted } from 'vue'
import type { FileSystem } from './useFileSystem'
import type { Theme } from './useTheme'

export interface CommandEntry {
  command: string
  output: string
}

export const useTerminal = (
  fileSystem: FileSystem,
  currentPath: Ref<string>,
  themes: Theme[],
  currentTheme: Ref<Theme>,
  showMatrixOverlay: Ref<boolean>,
  matrixOutput: Ref<string>
) => {
  const commandHistory = ref<CommandEntry[]>([])
  const currentCommand = ref('')
  const commandInput = ref<HTMLInputElement | null>(null)
  const historyIndex = ref(-1)
  const commandBuffer = ref<string[]>([])
  const tempCommand = ref('')
  const matrixChoiceMode = ref(false)
  const selectedPill = ref<'red' | 'blue' | null>(null)
  const matrixColumns = ref<number[]>([])

  // Load command history from localStorage on mount
  onMounted(() => {
    const savedHistory = localStorage.getItem('commandBuffer')
    if (savedHistory) {
      commandBuffer.value = JSON.parse(savedHistory)
    }
  })

  const danceFrames = [
    `  o 
 /|\\
 / \\`,
    `  o 
 \\|/
 / \\`,
    `  o 
  |_
 / \\`,
    `  o 
 _|
 / \\`
  ]

  const bluePillArt = `
    <span class="text-blue-500">╔════════╗</span>   ╔════════╗
    <span class="text-blue-500">║        ║</span>   ║        ║
    <span class="text-blue-500">║  BLUE  ║</span>   ║  RED   ║
    <span class="text-blue-500">║  PILL  ║</span>   ║  PILL  ║
    <span class="text-blue-500">║        ║</span>   ║        ║
    <span class="text-blue-500">╚════════╝</span>   ╚════════╝

    What pill will you choose?
    Use ← → arrows to select, Enter to confirm
  `

  const redPillArt = `
    ╔════════╗   <span class="text-red-500">╔════════╗</span>
    ║        ║   <span class="text-red-500">║        ║</span>
    ║  BLUE  ║   <span class="text-red-500">║  RED   ║</span>
    ║  PILL  ║   <span class="text-red-500">║  PILL  ║</span>
    ║        ║   <span class="text-red-500">║        ║</span>
    ╚════════╝   <span class="text-red-500">╚════════╝</span>

    What pill will you choose?
    Use ← → arrows to select, Enter to confirm
  `

  const bluePillScene = `
    <span class="text-blue-500">
    
    Ignorance is bliss...
    The illusion continues, and you remain in your comfortable reality.
    
    </span>
  `

  const redPillScene = `
    <span class="text-red-500">

    YOU HAVE LEFT THE MATRIX
    Welcome to the desert of the real...
    
    </span>
  `

  const getRandomChar = () => {
    const chars = '゠アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンヺ日月火水木金土年月日時分秒週年円ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()'
    return chars[Math.floor(Math.random() * chars.length)]
  }

  const generateMatrixRain = () => {
    const screenWidth = Math.floor(window.innerWidth / 12)
    const screenHeight = Math.floor(window.innerHeight / 24)

    // Initialize columns if not already done
    if (matrixColumns.value.length === 0) {
      matrixColumns.value = Array(screenWidth).fill(0)
    }

    // Create the output matrix
    const matrix = Array(screenHeight).fill(0).map(() => Array(screenWidth).fill(' '))

    // Update each column
    for (let x = 0; x < screenWidth; x++) {
      if (matrixColumns.value[x] > 0) {
        // Draw the trail
        for (let y = 0; y < Math.min(matrixColumns.value[x], screenHeight); y++) {
          const brightness = y === matrixColumns.value[x] - 1 ? 'opacity-100' : 'opacity-25'
          matrix[y][x] = `<span class="${brightness}">${getRandomChar()}</span>`
        }
        matrixColumns.value[x]++

        // Reset column when it reaches bottom
        if (matrixColumns.value[x] >= screenHeight + 5) {
          matrixColumns.value[x] = 0
        }
      } else {
        // Randomly start new drops
        if (Math.random() < 0.05) {
          matrixColumns.value[x] = 1
        }
      }
    }

    // Convert matrix to string
    return matrix.map(row => row.join('')).join('\n')
  }

  let animationInterval: NodeJS.Timeout | null = null

  const commands = {
    help: () => `Available commands:
  ls - List directory contents
  cd [dir] - Change directory
  pwd - Print working directory
  clear - Clear terminal
  tree - Display directory structure
  color [theme] - Change color theme (available: matrix, cyber, synthwave)
  matrix - What will you choose?
  @linkedin - Open LinkedIn profile
  ./dance.sh - Run a fun animation
  help - Show this help message
  
Use ↑/↓ arrow keys to navigate command history`,
    
    ls: () => {
      const path = currentPath.value === '~' ? '~' : `~/${currentPath.value}`
      const dir = fileSystem[path]
      if (!dir) return 'Directory not found'
      return dir.contents.join('\n')
    },
    
    cd: (args: string) => {
      if (!args || args === '~') {
        currentPath.value = '~'
        return ''
      }
      
      if (args === '..' || args === '../') {
        currentPath.value = '~'
        return ''
      }
      
      const newPath = `~/${args}`
      if (fileSystem[newPath]) {
        currentPath.value = args
        return ''
      }
      
      return 'Directory not found'
    },
    
    pwd: () => currentPath.value === '~' ? '/home/kieran' : `/home/kieran/${currentPath.value}`,
    
    clear: () => {
      return 'CLEAR_TERMINAL'
    },

    color: (args: string) => {
      const themeName = args.toLowerCase()
      const theme = themes.find(t => t.name === themeName)
      
      if (!theme) {
        return `Theme not found. Available themes: ${themes.map(t => t.name).join(', ')}`
      }
      
      currentTheme.value = theme
      return `Theme changed to ${themeName}`
    },

    matrix: () => {
      if (animationInterval) {
        clearInterval(animationInterval)
      }

      matrixChoiceMode.value = true
      selectedPill.value = null
      showMatrixOverlay.value = true
      matrixOutput.value = ''
      matrixColumns.value = []
      
      let rainDuration = 0
      animationInterval = setInterval(() => {
        if (rainDuration < 5000) { // Run for 5 seconds
          matrixOutput.value = generateMatrixRain()
          rainDuration += 100
        } else {
          clearInterval(animationInterval)
          matrixOutput.value = bluePillArt
        }
      }, 100) // Update every 100ms for smoother animation

      return ''
    },

    tree: () => {
      const buildTree = (path: string, prefix = '') => {
        const dir = fileSystem[path]
        if (!dir) return ''
        
        let output = ''
        const items = dir.contents
        
        items.forEach((item, index) => {
          const isLast = index === items.length - 1
          const connector = isLast ? '└── ' : '├── '
          const newPrefix = isLast ? '    ' : '│   '
          
          output += prefix + connector + item + '\n'
          
          const subPath = path === '~' ? `~/${item}` : `${path}/${item}`
          if (fileSystem[subPath]) {
            output += buildTree(subPath, prefix + newPrefix)
          }
        })
        
        return output
      }
      
      return '.\n' + buildTree('~')
    },

    '@linkedin': () => {
      window.open('https://www.linkedin.com/in/kieranbdn/', '_blank')
      return 'Opening LinkedIn profile in a new tab...'
    },

    './dance.sh': () => {
      if (currentPath.value !== 'scripts') {
        return 'Error: dance.sh not found in current directory'
      }

      let frameIndex = 0
      if (animationInterval) {
        clearInterval(animationInterval)
      }

      const animate = () => {
        commandHistory.value[commandHistory.value.length - 1].output = danceFrames[frameIndex]
        frameIndex = (frameIndex + 1) % danceFrames.length
      }

      animationInterval = setInterval(animate, 500)
      setTimeout(() => {
        if (animationInterval) {
          clearInterval(animationInterval)
        }
      }, 5000)

      return danceFrames[0]
    }
  }

  const handleTabCompletion = () => {
    const input = currentCommand.value.trim()
    const [cmd, ...args] = input.split(' ')
    
    if (cmd === 'cd' && args.length <= 1) {
      const partial = args[0] || ''
      const currentDir = currentPath.value === '~' ? '~' : `~/${currentPath.value}`
      const dir = fileSystem[currentDir]
      
      if (dir) {
        const matches = dir.contents.filter(item => 
          item.toLowerCase().startsWith(partial.toLowerCase()) &&
          fileSystem[`${currentDir}/${item}`]
        )
        
        if (matches.length === 1) {
          currentCommand.value = `cd ${matches[0]}`
        }
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (matrixChoiceMode.value) {
      e.preventDefault()
      if (e.key === 'ArrowLeft') {
        selectedPill.value = 'blue'
        matrixOutput.value = bluePillArt + '\n\nSelected: BLUE PILL'
      } else if (e.key === 'ArrowRight') {
        selectedPill.value = 'red'
        matrixOutput.value = redPillArt + '\n\nSelected: RED PILL'
      } else if (e.key === 'Enter' && selectedPill.value) {
        if (selectedPill.value === 'blue') {
          matrixOutput.value = bluePillScene
          setTimeout(() => {
            matrixChoiceMode.value = false
            showMatrixOverlay.value = false
            commandHistory.value[commandHistory.value.length - 1].output = 'You chose to stay in the illusion. Life continues as normal...'
          }, 5000)
        } else {
          matrixOutput.value = redPillScene
          setTimeout(() => {
            matrixChoiceMode.value = false
            showMatrixOverlay.value = false
            commandHistory.value[commandHistory.value.length - 1].output = 'You chose the truth. Welcome to the real world...'
          }, 5000)
        }
      }
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex.value === -1) {
        tempCommand.value = currentCommand.value
      }
      if (historyIndex.value < commandBuffer.value.length - 1) {
        historyIndex.value++
        currentCommand.value = commandBuffer.value[commandBuffer.value.length - 1 - historyIndex.value]
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex.value > -1) {
        historyIndex.value--
        if (historyIndex.value === -1) {
          currentCommand.value = tempCommand.value
        } else {
          currentCommand.value = commandBuffer.value[commandBuffer.value.length - 1 - historyIndex.value]
        }
      }
    }
  }

  const executeCommand = () => {
    if (matrixChoiceMode.value) {
      return
    }

    const input = currentCommand.value.trim()
    if (input) {
      commandBuffer.value.push(input)
      if (commandBuffer.value.length > 50) {
        commandBuffer.value.shift()
      }
      localStorage.setItem('commandBuffer', JSON.stringify(commandBuffer.value))
    }

    const [cmd, ...args] = input.split(' ')
    
    let output = ''
    if (commands[cmd as keyof typeof commands]) {
      output = commands[cmd as keyof typeof commands](args.join(' '))
      
      if (output === 'CLEAR_TERMINAL') {
        commandHistory.value = []
        currentCommand.value = ''
        historyIndex.value = -1
        tempCommand.value = ''
        return
      }
    } else if (input !== '') {
      output = `Command not found: ${cmd}`
    }
    
    commandHistory.value.push({
      command: input,
      output
    })
    
    currentCommand.value = ''
    historyIndex.value = -1
    tempCommand.value = ''
    
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight)
    }, 0)
  }

  return {
    commandHistory,
    currentCommand,
    commandInput,
    handleTabCompletion,
    executeCommand,
    handleKeyDown
  }
}