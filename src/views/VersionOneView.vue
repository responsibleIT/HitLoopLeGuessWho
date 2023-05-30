<script setup>
import {ref} from 'vue';
import BaseButton from '../components/BaseButton.vue';
import BeatVersionOne from '@/components/BeatVersionOne.vue';

let data = ref('hallo')



</script>

<template>
  <main>
    <BaseButton>{{ data }}</BaseButton>
<BeatVersionOne/>
  </main>
</template>
