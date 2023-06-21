<script setup>
import { RouterLink, RouterView } from 'vue-router'


document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
    // special hack to prevent zoom-to-tabs gesture in safari
    document.body.style.zoom = 1;
});

document.addEventListener('gesturechange', function(e) {
    e.preventDefault();
    // special hack to prevent zoom-to-tabs gesture in safari
    document.body.style.zoom = 1;
});

document.addEventListener('gestureend', function(e) {
    e.preventDefault();
    // special hack to prevent zoom-to-tabs gesture in safari
    document.body.style.zoom = 1;
});
</script>

<template>
  <!-- <header>
    <div>
      <img alt="Hitloop logo" class="logo" src="@/assets/Logo.svg" width="50" height="50" />
    </div>
    <nav>
      <RouterLink to="/">Home</RouterLink>
    </nav>
  </header> -->
  <RouterView />
</template>

<style scoped lang="scss">
// header {
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
// }
</style>
