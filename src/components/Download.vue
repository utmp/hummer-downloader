<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { FwbProgress } from "flowbite-vue";
const progress = ref(0);
const isComplete = ref(false);
let eventSource = null;

onMounted(() => {
  // Reset state
  progress.value = 0;
  isComplete.value = false;

  // Create new EventSource connection
  eventSource = new EventSource("http://localhost:3002/progress");

  // Handle incoming messages immediately
  eventSource.addEventListener('message', (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log('Real-time progress:', data); // Debug log

      if (typeof data.progress === 'number') {
        progress.value = data.progress;
      }

      if (data.complete) {
        isComplete.value = true;
        eventSource.close();
      }
    } catch (error) {
      console.error('Error parsing progress data:', error);
    }
  });

  // Handle connection opened
  eventSource.onopen = () => {
    console.log('SSE connection opened');
  };

  // Handle errors
  eventSource.onerror = (error) => {
    console.error('SSE connection error:', error);
    eventSource.close();
  };
});

onUnmounted(() => {
  if (eventSource) {
    eventSource.close();
  }
});
</script>

<template>
  <fwb-progress  :progress="progress"
    label-position="inside"
    label-progress
    size="xl"
    color="purple"
    label="Downloading"  />
</template>