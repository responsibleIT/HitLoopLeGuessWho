<script setup>
import { storeToRefs } from 'pinia'
import Modal from './Modal.vue'
import { useSequenceStore } from '@/stores/sequence.js'
import { ref } from 'vue'
// import { ref,useAttrs } from 'vue';
defineProps({
  item: Object,
  url: String,
  id: Number
})

const store = useSequenceStore()

const { sampleData, sampleTypeList } = storeToRefs(store)

const showModal = ref(false)
</script>

<template>
  <button class="btn-icon" id="show-modal" @click="showModal = true">Edit Sound</button>

  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <modal :show="showModal" @close="showModal = false">
      <template #header>
        <h3>Sound</h3>
        <select @input="$emit('update:url', $event.target.value)">
          <template v-for="sampleType in sampleTypeList" :key="sampleType">
            <optgroup :label="sampleType">
              <template v-for="sample in sampleData">
                <option v-if="sample.type === sampleType" :key="sample.file" :value="sample.blob">
                  {{ sample.version }} {{ sample.name }}
                </option>
              </template>
            </optgroup>
          </template>
        </select>
      </template>
    </modal>
  </Teleport>
</template>

<style lang="scss" scoped>
select {
  max-width: 100%;

  padding: 0.3em;
  margin-right: 1em;
  // background: -var(--color-background-soft);
  // color: var(--color-text);
}
option {
  font-family: monospace;
}
</style>
