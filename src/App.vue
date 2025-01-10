<script setup>
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div class="flex flex-row gap-11 justify-center m-9">
    <img src="./assets/vue.svg" alt="vue-logo" class="w-24 h-24 hover:drop-shadow-[0_0_2em_#42b883aa]"/>
    <img src="./assets/vite.svg" alt="vite-logo" class="w-24 h-24 hover:drop-shadow-[0_0_2em_#646cffaa]"/>
    <img src="./assets/tailwind.svg" alt="tailwind-logo" class="w-24 h-24 hover:drop-shadow-[0_0_2em_#646cffaa]"/>
    
  </div>
<HelloWorld msg="Reusable vue + vite + tailwindcss project"/>
</template>