<script setup>
import { storeToRefs } from 'pinia'
import { useSequenceStore } from '@/stores/sequence.js'
import { ref } from 'vue'
// import { ref,useAttrs } from 'vue';
defineProps({
  sampleTypeList: Array,
  item: Object,
  url: String,
  highlighted: Number,
  id: Number
})

const store = await useSequenceStore()

const { sampleData } = storeToRefs(store)
</script>

<template>
  <select @input="$emit('update:url', $event.target.value)">
    <template v-for="(sampleType, i) in sampleTypeList" :key="i">
      <optgroup :label="sampleType">
        <template v-for="sample in sampleData">
          <option v-if="sample.type === sampleType" :key="sample" :value="sample.url">
            {{ sample.version }} {{ sample.name }}
          </option>
        </template>
      </optgroup>
    </template>
  </select>
</template>

<style lang="scss" scoped>
select {
  max-width: 100%;
  padding: 0.5em;
}
option {
  font-family: monospace;
}
</style>
