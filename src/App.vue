<script setup>
import { RouterLink, RouterView } from 'vue-router'
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <header>
    <div>
      <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
    </div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav>
  </header>
  <RouterView />
</template>

<style scoped>

</style>
