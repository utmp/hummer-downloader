<script setup>
import 'vue'
defineProps({
    msg: String
})
</script>

<template>
 <h2 class="text-center text-4xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">{{ msg }}</h2>
</template>

