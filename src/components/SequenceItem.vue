<script setup>
import { ref } from 'vue'
import SampleSelect from '@/components/SampleSelect.vue'
import SequenceItemArc from '@/components/SequenceItemArc.vue'
import Modal from '@/components/Modal.vue'
import { useSequenceStore } from '@/stores/sequence.js'
import { storeToRefs } from 'pinia'
import SequenceSteps from '@/components/SequenceSteps.vue'
import BaseButton from './BaseButton.vue'
const apiBaseURL = import.meta.env.VITE_API_BASE
const props = defineProps({
  item: Object,
  id: Number,
  empty: Boolean
})

const store = useSequenceStore()
// store values to vuejs ref
// const { samplePack, currentStepIndex, sequenceData, sampleTypeList } = storeToRefs(store)

const { toggleStep, updateSequenceURL, removeSequence, updateSequenceByValue } = store

const showModal = ref(false)
</script>
<template>
  <div class="sequence-item">
    <slot name="select" v-if="!empty">
      <button class="btn-icon" id="show-modal" @click="showModal = true">{{id}}</button>
    </slot>
    <slot></slot>
    <slot name="steps">
      <SequenceSteps v-if="!empty" :id="id" :item="item" :color="item.color" />
    </slot>
    <div v-if="!empty">
      <BaseButton @click="removeSequence(id)" icon="delete" />
    </div>
    <KeepAlive>
    <Teleport to="main" v-if="!empty">
      <!-- use the modal component, pass in the prop -->
      <Modal :show="showModal" @close="showModal = false">
        
        <template #header>
          <h3>Sound</h3>
        </template>
        <template #body>
          <Suspense>
            <SampleSelect
              class="sample-select"
              @update:url="updateSequenceURL(id, $event)"
              @update="updateSequenceByValue"
              :item="item"
              :id="id"
            />
            <!-- @update:url="updateSequenceURL(id, $event)" -->
          </Suspense>
          <label for="volume">Volume:</label>
        <input id="volume" type="range" min="-60" max="0" :v-model="props.item.volume" step="1" />
        </template>
      </Modal>
    </Teleport>
    </KeepAlive>
  </div>
</template>

<style lang="scss" scoped>
.sequence-item {
  // grid-template-columns:auto 1fr auto;
  display: flex;
  // overflow-x: visible;
  // overflow-y: scroll;
  align-items: center;
  // justify-content: space-between;
  gap: 1em;
}

.sample-select {
  max-width: 12em;

  background: -var(--color-background-mute);
}
</style>
