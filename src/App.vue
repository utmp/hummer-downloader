<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <RouterLink to="/">Main page</RouterLink>
  <RouterLink to="/about">Go-to-About</RouterLink>
<RouterView />
</template>