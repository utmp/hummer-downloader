<script setup>
  import { ref,computed } from 'vue'
  import { FwbSelect } from 'flowbite-vue'
  import { useRoute } from 'vue-router'
  import {useStore} from 'vuex'
  const store = useStore()
  const videoData = computed( ()=>store.getters.getVideoData)
  const selected = ref('')
  const countries = [
    { value: 'us', name: 'United States' },
    { value: 'ca', name: 'Canada' },
    { value: 'fr', name: 'France' },
  ]
  
const router = useRoute()
  </script>
<template>
  <div v-if="videoData">
    <img :src="videoData.thumbnail" alt="thumbnail">
    <h2 class="text-blue-600">Duration: {{ videoData.duration }}</h2>
    <p>Filename: {{ videoData.filename }}</p>
  </div>
    <h2 class="text-blue-600">{{ aboutData }}</h2>
    <fwb-select
      v-model="selected"
      :options="countries"
      label="Select a quality"
    />
  </template>
