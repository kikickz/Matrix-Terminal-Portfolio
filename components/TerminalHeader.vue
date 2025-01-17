<template>
  <div :class="textClass" class="mb-4">
    <!-- Mobile version -->
    <pre class="text-xl font-bold md:hidden">
 _  ___                      
| |/ (_) ___ _ __ __ _ _ __  
| ' /| |/ _ \ '__/ _` | '_ \ 
| . \| |  __/ | | (_| | | | |
|_|\_\_|\___|_|  \__,_|_| |_|
    </pre>
    <!-- Desktop version -->
    <pre class="hidden md:block text-xs md:text-sm">
 _  ___                        ____                  _             _       
| |/ (_) ___ _ __ __ _ _ __   | __ )  ___  _   _  __| | ___  _   _(_)_ __  
| ' /| |/ _ \ '__/ _` | '_ \  |  _ \ / _ \| | | |/ _` |/ _ \| | | | | '_ \ 
| . \| |  __/ | | (_| | | | | | |_) | (_) | |_| | (_| | (_) | |_| | | | | |
|_|\_\_|\___|_|  \__,_|_| |_| |____/ \___/ \__,_|\__,_|\___/ \__,_|_|_| |_|</pre>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  textClass: string
}>()
</script>