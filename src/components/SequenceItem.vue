<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import SampleSelect from '@/components/SampleSelect.vue'
import SequenceItemArc from '@/components/SequenceItemArc.vue'
import Modal from '@/components/Modal.vue'
import { useSequenceStore } from '@/stores/sequence.js'
import { storeToRefs } from 'pinia'
import SequenceSteps from '@/components/SequenceSteps.vue'
import BaseButton from './BaseButton.vue'
import * as Tone from 'tone'
import { createSequenceArrayIndex } from '@/helpers/toneHelpers'
const apiBaseURL = import.meta.env.VITE_API_BASE
const props = defineProps({
  item: Object,
  id: Number,
  empty: Boolean
})

const store = useSequenceStore()
// store values to vuejs ref
const { toneS, currentStepIndex, sequenceData, sampleTypeList, isPlaying, columns } =
  storeToRefs(store)

const { toggleStep, updateSequenceURL, removeSequence, updateSequenceSample, setCurrentStepIndex } =
  store
let sequence = null
const showModal = ref(false)
const isThisLoaded = ref(false)
console.log('props.item')
console.log(props.item)
const sampleObject = computed(() => {
  let newObj = {}
  if (props.item) {
    console.log('props.item')
    console.log(props.item)
    let obj = props.item

    if (obj && obj.sample && obj.url) {
      newObj[obj.sample] = obj.url
    }
  }
  console.log('newObj')
  console.log(newObj)
  return newObj
})
console.log('sampleObject.value')
console.log(sampleObject.value)
let sampler = null


sampler = new Tone.Sampler({
  urls: sampleObject.value,
  onload: () => {
    isThisLoaded.value = true
  }
}).toDestination().sync()

const currentStep = ref(currentStepIndex.value)

const tick = (time, col) => {
  Tone.Draw.schedule(() => {
    if (isPlaying.value) {
      console.log(currentStep.value)
      currentStep.value
    }
  }, time)
  
  if (props.item.steps[col] === true) {
    console.log('element')
    console.log(col)
    Tone.loaded().then(() => {
        sampler.triggerAttackRelease(props.item.sample, '16n', time)  
      })

    
  }
}

sequence = new Tone.Sequence(tick, createSequenceArrayIndex(columns.value), '16n')
sequence.humanize = true
sequence.start(Tone.now())

const resetSequence = () => {
  // fires only when state.someObject is replaced
}


const resetSamples = () => {
  // fires only when state.someObject is replaced
  if (sampler) {
      sampler.dispose()
    return  sampler = new Tone.Sampler({
        urls: sampleObject.value,
        onload: () => {
          console.log('2st sampler done')
        }
      }).toDestination()
    }
}

watch(sampleObject, () => {
return  resetSamples()
})

onMounted(() => {

  sampler = new Tone.Sampler({
  urls: sampleObject.value,
  onload: () => {
    isThisLoaded.value = true
  }
}).toDestination().sync()

  if (sequence) {
    sequence.dispose()
    sequence = new Tone.Sequence(tick, createSequenceArrayIndex(columns.value), '16n').start(
      Tone.now()
    )
  }

  Tone.Transport.start(Tone.now())

})

onUnmounted(() => {
  if (sequence) {
    sequence.dispose()
  } 
  if (sampler) {
    sampler.dispose()
  }  
})

</script>
<template>
  <div class="sequence-item">
    <slot name="select" v-if="!empty">
      <BaseButton
        icon="notes"
        class="btn-icon"
        id="show-modal"
        @click="showModal = true"
      ></BaseButton>
    </slot>
    <slot></slot>
    <slot name="steps">
      <SequenceSteps
        v-if="!empty"
        :id="id"
        :item="item"
        :color="item.color"
        :highlighted="currentStepIndex"
      />
    </slot>
    <div v-if="!empty">
      <BaseButton @click="removeSequence(id)" icon="delete" />
    </div>

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
              :value="item.sampleDataId"
              @update:url="updateSequenceURL(id, $event)"
              @change:sampleDataId="updateSequenceSample"
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
