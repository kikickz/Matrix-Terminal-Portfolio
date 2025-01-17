import { ref } from 'vue'

export interface FileSystemNode {
  type: 'dir'
  contents: string[]
}

export interface FileSystem {
  [path: string]: FileSystemNode
}

export const useFileSystem = () => {
  const fileSystem: FileSystem = {
    '~': {
      type: 'dir',
      contents: ['skills', 'projects', 'studies', 'contact', 'scripts']
    },
    '~/skills': {
      type: 'dir',
      contents: [
        'Frontend Development',
        '├── React',
        '├── NuxtJS',
        '├── SwiftUI',
        'Backend Development',
        '├── MongoDB',
        'Data & Analytics',
        '├── BigQuery',
        '├── Data Scraping',
        '├── Playwright',
        'DevOps',
        'AI/ML',
        'Project Management'
      ]
    },
    '~/projects': {
      type: 'dir',
      contents: [
        'rovesup.com (Ongoing) - A job finding platform',
        'thecalendarcorp.com (Completed) - Calendar management system'
      ]
    },
    '~/studies': {
      type: 'dir',
      contents: [
        'Epitech Paris MSc Pro (2022 - Present)',
        '├── Current Master\'s degree in Software Development',
        'ISG Paris Bachelor (2020 - 2022)',
        '├── Bachelor\'s degree in Finance',
        'Epita Paris Prépa (2019 - 2020)',
        '├── Preparatory year at Epitech'
      ]
    },
    '~/contact': {
      type: 'dir',
      contents: [
        'Kieran Boudouin',
        'kieran.boudouin@epitech.eu',
        '<a href="https://www.linkedin.com/in/kieranbdn/" target="_blank" class="hover:underline cursor-pointer">@linkedin</a>'
      ]
    },
    '~/scripts': {
      type: 'dir',
      contents: ['dance.sh']
    }
  }

  const currentPath = ref('~')

  const getDirectory = (path: string) => {
    const fullPath = path === '~' ? '~' : `~/${path}`
    return fileSystem[fullPath]
  }

  const isValidPath = (path: string) => {
    return !!getDirectory(path)
  }

  return {
    currentPath,
    fileSystem,
    getDirectory,
    isValidPath
  }
}