<script setup>
import { ref, computed } from 'vue'
import { FwbSelect, FwbToggle, FwbButton } from 'flowbite-vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const videoData = computed(() => store.getters.getVideoData)
const selected = ref('')

const qualityOptions = computed(() => {
  if (videoData.value && videoData.value.formatEntries) {
    return videoData.value.formatEntries.map(format => ({
      value: format.id,
      name: `${format.resolution} (${format.ext}) +  best-audio`
    }))
  }
  return []
})

const router = useRouter()

const download = async () => {
  if (selected.value && videoData.value) {
    try {
      await fetch('http://localhost:3002/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          formatId: selected.value,
          url: videoData.value.url // Make sure to include the URL in videoData
        })
      });
      router.push('/dwn');
    } catch (error) {
      console.error('Error starting download:', error);
    }
  }
}
</script>
<template>
  <div v-if="videoData" class="flex flex-col items-center gap-4 p-4">
    <img :src="videoData.thumbnail" alt="thumbnail-not-found" class="rounded-lg shadow-lg max-w-md">
    
    <div class="flex w-full max-w-md flex-col gap-4">
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="#AA60C8" viewBox="0 0 24 24">
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
          <path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"/>
        </svg>
        <h2 class="text-white">Duration: {{ videoData.duration }}</h2>
      </div>
      
      <div class="flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="#AA60C8" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zm0 16H5V5h14v14z"/>
          <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/>
        </svg>
        <p class="text-white truncate max-w-[300px]">{{ videoData.title }}</p>
      </div>

      <div class="w-full space-y-4">
        <fwb-toggle label="Embed thumbnail to video" color="purple" />
        <fwb-select
          v-model="selected"
          :options="qualityOptions"
          label="Select a quality"
        />
        <fwb-button @click="download" gradient="purple-pink" size="lg" outline>Download</fwb-button>
      </div>
    </div>
  </div>
</template>