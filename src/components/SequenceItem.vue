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
import { toReactive } from '@vueuse/core'
const apiBaseURL = import.meta.env.VITE_API_BASE
const props = defineProps({
  item: Object,
  id: Number,
  empty: Boolean,
  reverb: Number,
  volume: Number
})

const store = useSequenceStore()
// store values to vuejs ref
const { currentStepIndex, sequenceData, sampleTypeList, isPlaying, columns } = storeToRefs(store)

const {
  toggleStep,
  updateSequenceURL,
  removeSequence,
  updateSequenceSample,
  setCurrentStepIndex,
  randomSequenceSteps
} = store

const itemData = toReactive(sequenceData.value[props.id])

defineEmits(['update:volume', 'update:reverb'])

let sequence = null
const showModal = ref(false)
const isThisLoaded = ref(false)
console.log('props.item')
console.log(props.item)
const sampleObject = computed(() => {
  let newObj = {}
  if (props.item) {
    let obj = props.item
    if (obj && obj.sample && obj.url) {
      newObj[obj.sample] = obj.url
    }
  }
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
})
  .toDestination()
  .sync()

const currentStep = ref(currentStepIndex.value)
const vol = new Tone.Volume(props.volume).toDestination();
let rev = new Tone.Reverb({
      ready: () => {
        rev.set({
      reverb: props.reverb
        })
        console.log('rev.get()')
    console.log(rev.get())
    sampler.connect(rev)
  }
}).toDestination()

const tick = (time, col) => {
  console.log(rev.get())

  Tone.Draw.schedule(() => {
    if (isPlaying.value) {
      console.log(currentStep.value)
      currentStep.value
    }
  }, time)

  console.log(itemData)
  if (itemData.reverb !== 0) {
    // sampler.chain(rev, Tone.Destination)
  } else {
    if (rev) {
      // rev.dispose()
    }

    // sampler.chain(pitchShift, Tone.Destination)
  }

  // vol.set(itemData.volume)

  sampler.connect(vol)
  sampler.connect(rev)

  if (props.item.steps[col] === true) {
    Tone.loaded().then(() => {
      sampler.triggerAttackRelease(props.item.sample, '8n', time)
    })
  }
}

sequence = new Tone.Sequence(tick, createSequenceArrayIndex(columns.value), '16n')
sequence.humanize = true
sequence.start(0)

const resetSequence = () => {
  // fires only when state.someObject is replaced
}

const resetSamples = () => {
  // fires only when state.someObject is replaced
  if (sampler) {
    sampler.dispose()
    return (sampler = new Tone.Sampler({
      urls: sampleObject.value,
      onload: () => {
        console.log('2st sampler done')
      }
    }).toDestination())
  }
}

watch(sampleObject, () => {
  return resetSamples()
})

watch(
  () => props.volume,
  (nVol) => {
    console.log(`vol is: ${nVol}`)
    if (vol) {
      vol.set({ volume: nVol })
    }
  }
)

watch(
  () => props.reverb,
  (newRev) => {
    if (rev) {
      rev.set({ decay: newRev })
    }
  }
)

onMounted(() => {
  sampler = new Tone.Sampler({
    urls: sampleObject.value,
    onload: () => {
      isThisLoaded.value = true
    }
  })
    .toDestination()
    .sync()

  if (sequence) {
    sequence.dispose()
    sequence = new Tone.Sequence(tick, createSequenceArrayIndex(columns.value), '16n').start(0)
  }
  // if (isPlaying.value) return Tone.Transport.start(Tone.now())
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
    <BaseButton icon="tune" class="btn-icon" id="show-modal" @click="showModal = true"></BaseButton>

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
    <BaseButton
      icon="sync"
      class="btn-icon"
      id="show-modal"
      @click="randomSequenceSteps(id)"
    ></BaseButton>
    <div v-if="!empty">
      <BaseButton @click="removeSequence(id)" icon="delete" />
    </div>

    <Teleport to="main" v-if="!empty">
      <!-- use the modal component, pass in the prop -->
      <Modal :show="showModal" @close="showModal = false">
        <template #header>
          <h3>Edit sound</h3>
        </template>
        <template #body>
          <div class="input-group">
            <label for="reverb">Reverb:</label>
            <Suspense>
              <SampleSelect
                class="sample-select"
                :value="item.sampleDataId"
                @update:url="updateSequenceURL(id, $event)"
                @change:sampleDataId="updateSequenceSample"
                :item="item"
                :id="id"
              />
            </Suspense>
          </div>
          <div class="input-group">
            <label for="reverb">Reverb:</label>
            <input
              id="reverb"
              type="number"
              min="0"
              max="10"
              @input="$emit('update:reverb', $event.target.value)"
              :value="reverb"
              step="0.1"
            />
          </div>
          <div class="input-group">
            <label for="volume">Volume:</label>
            <input
              id="volume"
              type="range"
              min="-70"
              max="0"
              @input="$emit('update:volume', $event.target.value)"
              :value="volume"
              step="1"
            />
          </div>
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

.input-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
</style>
