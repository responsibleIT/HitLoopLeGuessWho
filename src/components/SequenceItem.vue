<script setup>
import SequenceItemSelect from '@/components/SequenceItemSelect.vue'
import SequenceItemArc from '@/components/SequenceItemArc.vue'
defineProps({
  sampleTypeList: Array,
  sampleData: Array,
  item: Object,
  url: String,
  highlighted: Number,
  id: Number,
  columns: Number,
  row: Object,
  col: Number
})
</script>
<template>
  <div class="sequence-item">
    <slot name="select">
      <SequenceItemSelect
        :@update="$emit('update:url', $event.target.value)"
        :selectedValue="row.url"
        @update:="updateURL(row, $event)"
        :item="row"
        :id="index"
        :sampleTypeList="sampleTypeList"
        :sampleData="sampleDataB"
      />
    </slot>
    <slot name="arc">
      <SequenceItemArc
        :columns="columns"
        :row="row"
        :highlighted="highlighted"
        @toggle-step="toggleStep"
      />
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.sequence-item {
  border: 1px solid var(--color-background-mute);
  padding: 1em;
  display: flex;
  gap: 1em;
  flex-direction: column;
  align-items: center;
  border-radius: 1em;
}
</style>
