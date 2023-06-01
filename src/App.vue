<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div>
      <img alt="Vue logo" class="logo" src="@/assets/Logo.svg" width="50" height="50" />
    </div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
      </nav>
  </header>
  <RouterView />
</template>

<style scoped lang="scss">
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
