<script setup>
import {ref} from 'vue';
import BaseButton from '../components/BaseButton.vue';
import TheWelcome from '../components/TheWelcome.vue';

let data = ref('hallo')

</script>

<template>
  <main>
    <BaseButton>{{ name }}</BaseButton>
    <TheWelcome />
    
  </main>
</template>
