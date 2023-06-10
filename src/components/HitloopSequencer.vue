<script async setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import * as Tone from 'tone'
// Pack with sample names
import { getSampleData, getSampleFile } from '@/composables/getSampleData.js'

import {
  createSampleObject,
  createSequenceArraySteps,
  createSequenceArrayIndex
} from '@/helpers/toneHelpers.js'

import BaseIcon from '@/components/BaseIcon.vue'
import BaseButton from './BaseButton.vue'
import SequenceItemSelect from './SequenceItemSelect.vue'
import SequenceItem from './SequenceItem.vue'
import SequenceItemArc from './SequenceItemArc.vue'

// Base url for the api
const apiBaseURL = import.meta.env.VITE_API_BASE
const isPlaying = ref(false)
const bpm = ref(120)
const columns = ref(9)
const availableSamples = ['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'A4']
const activeSamples = ref(['A3'])
const samplePack = ref('b')
const sampleData = await getSampleData(apiBaseURL, samplePack.value, 'list')

const sampleTypeList = ref(['Crash', 'Kick', 'Sfx', 'Snare'])
const timeNow = ref(0)
// This function adds a new row to the sequencer
const addRow = () => {
  let all = sequenceData.length
  let thisSample = availableSamples[all]

  activeSamples.value.push(thisSample)
  sequenceData.push({
    sample: thisSample,
    steps: createSequenceArraySteps(columns.value),
    url: getSampleFile(apiBaseURL, samplePack.value, sampleData.value[all].file)
  })
}

// In the sequenceData are the row information stored like: the sample file, steps in the row and the API url
const sequenceData = reactive(
  activeSamples.value.map((sample) => ({
    sample,
    steps: createSequenceArraySteps(columns.value),
    url: getSampleFile(apiBaseURL, samplePack.value, sampleData.value[1].file)
  }))
)

const highlighted = ref(0)

const tick = (time, col) => {
  timeNow.value = time
  // highlighted.value = col
  const sampleObject = createSampleObject(sequenceData)
  const sampler = new Tone.Sampler({
    urls: sampleObject,
    onload: () => {
      console.log('loaded')
    }
  }).toDestination()

  Tone.Draw.schedule(() => {
    if (isPlaying.value === true) {
      highlighted.value = col
    }
  }, time)

  for (const row of sequenceData) {
    if (row.steps[col]) {
      Tone.loaded().then(() => {
        sampler.triggerAttackRelease(row.sample, '16n')
      })
    }
  }
}

const sequence = new Tone.Sequence(tick, createSequenceArrayIndex(columns.value), '16n')

Tone.Transport.bpm.value = bpm.value

watch(bpm, (newBpm) => {
  Tone.Transport.bpm.value = newBpm
})

const toggleStep = (row, step) => {
  row.steps[step] = !row.steps[step]
}

// With this function you can play or pause the sequencer
const togglePlay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    Tone.Transport.start()
    sequence.start()
  } else {
    Tone.Transport.stop()
    sequence.stop()
  }
}

const onKeyDown = (event) => {
  if (event.code === 'Space') {
    togglePlay()
    event.preventDefault()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})

const updateURL = (index, newValue) => {
  sequenceData.value[index].url = newValue
}
</script>

<template>
  <div id="sequencer">
    <TransitionGroup name="fade">
      <div v-for="(row, index) in sequenceData" class="row" :key="index">
        <SequenceItem>
          <template v-slot:select>
            <SequenceItemSelect
              v-model:url="row.url"
              :selectedValue="row.url"
              @update:="updateURL(row, $event)"
              :item="row"
              :sampleTypeList="sampleTypeList"
              :sampleData="sampleData"
            />
          </template>
          <template v-slot:arc>
            <SequenceItemArc
              :columns="columns"
              :row="row"
              :highlighted="highlighted"
              @toggle-step="toggleStep"
            />
          </template>
        </SequenceItem>
      </div>
    </TransitionGroup>
    <button v-show="availableSamples > activeSamples" @click="addRow(sequenceData)">
      <BaseIcon name="add" />
    </button>
  </div>
  <div class="controlls">
    <div>
      <label for="bpm">BPM:</label>
      <input id="bpm" type="number" min="20" max="300" v-model.number="bpm" />
    </div>
    <BaseButton v-if="!isPlaying" @click="togglePlay" icon="play_arrow" />
    <BaseButton v-else @click="togglePlay" icon="pause" />
  </div>
</template>

<style scoped lang="scss">
.controlls {
  padding: 1em;
  display: flex;
  align-items: center;
  gap: 1em;
  position: fixed;
  bottom: 0;
  justify-content: center;
  justify-items: center;
  // margin: 0 auto;
  left: 0;
  right: 0;
}
.sequencer {
  font-size: 1.5em;
}

.step-container {
  display: flex;
  flex-direction: column;
  margin-top: 0.1em;
  margin-bottom: 0.1em;
}
// .step:first-child {
//   height: 10rem;
// }
.step {
  width: 3em;
  height: 3em;
  border: 1px solid var(--color-black);
  // transition: all 1ms ease-in-out;
  position: absolute;

  &.highlighted {
    border: 4px solid var(--color-orange);
  }
}

svg {
  width: 10rem;
  line {
    cursor: pointer;
  }
}
.arc-item {
  stroke: #cbcbcb;
}
.active {
  stroke-opacity: 50%;
  stroke: #2ecd71;
}

.highlighted {
  stroke-opacity: 50%;

  // stroke: green;
}

.highlighted.active {
  stroke-width: 22;
}

#sequencer {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* see notes below */
  grid-gap: 1em;
  padding: 2rem;

  // div {
  //   display: flex;
  //   flex-wrap: wrap;
  //   flex-direction: row;

  //   div {
  //     display: flex;
  //   }
  // }
}
.row {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  overflow: hidden;
}

select {
  width: 100%;
}
.active {
  background-color: var(--color-black-mute);
}

/* 1. declare transition */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}
</style>
