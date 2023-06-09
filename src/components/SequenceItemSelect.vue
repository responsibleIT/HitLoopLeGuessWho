<script setup>
// import { ref,useAttrs } from 'vue';
defineProps({
  id: Number,
  sampleTypeList: Array,
  sampleData: Array,
  item: Object,
  url: String,
  highlighted: Number
})
</script>

<template>
<select :value="url" @input="$emit('update:url', $event.target.value)">
          <template v-for="(sampleType, i) in sampleTypeList" :key="i">
            <optgroup :label="sampleType">
              <template v-for="(sample) in sampleData">
                <option
                  v-if="sample.type === sampleType"
                  :key="sample"
                  :value="sample.url">
                  {{ sample.version }} - {{ sample.name }}
                </option>
              </template>
            </optgroup>
          </template>
        </select>
</template>



<style lang="scss" scoped>

</style>
