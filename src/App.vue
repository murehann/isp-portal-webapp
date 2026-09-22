<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>

<template>
  <RouterView />
  <Toaster
    rich-colors
    :expand="true"
    closeButton
    position="top-right"
    closeButtonPosition="top-left"
  />
</template>

<style scoped></style>
