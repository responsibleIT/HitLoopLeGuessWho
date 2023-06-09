<script async setup>
import { ref, reactive, watch, TransitionGroup, Transition } from 'vue'
import * as Tone from 'tone'
// Pack with sample names

import BaseIcon from '@/components/BaseIcon.vue'
import { getSampleData, getSampleFile } from '@/composables/getSampleData.js'
import {
  createSampleObject,
  createSequenceArraySteps,
  createSequenceArrayIndex
} from '@/helpers/toneHelpers.js'
import BaseButton from './BaseButton.vue'
import SequenceItemSelect from './SequenceItemSelect.vue'
import SequenceItem from './SequenceItem.vue'
import SequenceItemArc from './SequenceItemArc.vue'
import { createPinia } from 'pinia'
// Base url for the api
const apiBaseURL = import.meta.env.VITE_API_BASE
const BaseURL = 'https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file='
const isPlaying = ref(false)
const bpm = ref(120)
const columns = ref(9)
const availableSamples = ['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'A4']
const activeSamples = ref(['A3'])

console.log('createSequenceArray(columns.value)')
console.log(createSequenceArrayIndex(columns.value))
console.log('Array(columns.value).fill(false)')
console.log(Array(columns.value).fill(false))

const sampleDataB = await getSampleData(apiBaseURL, 'b', 'list')

const sampleTypeList = ref(['Crash', 'Kick', 'Sfx', 'Snare'])

// This function adds a new row to the sequencer
const addRow = () => {
  let all = sequenceData.length
  let thisSample = availableSamples[all]

  activeSamples.value.push(thisSample)
  sequenceData.push({
    sample: thisSample,
    steps: createSequenceArraySteps(columns.value),
    url: getSampleFile(apiBaseURL, 'b', sampleDataB.value[all].file)
  })
}
console.log('BaseURL + sampleDataB.value[0].file')
console.log(BaseURL + sampleDataB.value[0].file)
// In the sequenceData are the row information stored like: the sample file, steps in the row and the API url
const sequenceData = reactive(
  activeSamples.value.map((sample) => ({
    sample,
    steps: createSequenceArraySteps(columns.value),
    url: getSampleFile(apiBaseURL, 'b', sampleDataB.value[1].file)
  }))
)

const highlighted = ref(-1)

const tick = (time, col) => {
  // highlighted.value = col
  console.log('time')
  console.log(time)
  console.log('col1')
  console.log(col)
  const sampleObject = createSampleObject(sequenceData)
  const sampler = new Tone.Sampler({
    urls: sampleObject,
    onload: () => {
      console.log('loaded')
    }
  }).toDestination()

  Tone.Draw.schedule(() => {
    console.log(time)
    if (isPlaying.value === true) {
      highlighted.value = col
      console.log('col2')
      console.log(col)
    }
  }, time)

  for (const row of sequenceData) {
    console.log('row.steps[col]')
    console.log(row.steps[col])
    if (row.steps[col]) {
      console.log('col3')
      console.log(col)
      console.log('row.steps[col]')
      console.log(row.steps[col])
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

const gapSize = Math.PI / 10

console.log(sequenceData)

const updateURL = (index, newValue) => {
  sequenceData.value[index].url = newValue
}

const arcProps = {
  columns: columns.value
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle)
  const end = polarToCartesian(x, y, radius, startAngle)

  const largeArcFlag = endAngle - startAngle <= Math.PI ? '0' : '1'

  const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ')

  return d
}

function polarToCartesian(centerX, centerY, radius, angleInRadians) {
  const x = centerX + radius * Math.cos(angleInRadians)
  const y = centerY + radius * Math.sin(angleInRadians)
  return { x, y }
}

function getStartAngle(index) {
  return (2 * Math.PI * index) / columns.value + gapSize / 2
}

function getEndAngle(index) {
  return (2 * Math.PI * (index + 1)) / columns.value - gapSize / 2
}
</script>

<template>
  <div id="sequencer">
    <TransitionGroup name="fade" class="container">
      <div v-for="(row, index) in sequenceData" class="row" :key="index">
        <SequenceItem :key="index">
          <template v-slot:select>
            <SequenceItemSelect
              v-model:url="row.url"
              :selectedValue="row.url"
              @update:="updateURL(row, $event)"
              :item="row"
              :id="index"
              :sampleTypeList="sampleTypeList"
              :sampleData="sampleDataB"
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
        <div class="step-container">
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="80" fill="none" stroke="none" />
            <g transform="translate(100,100)">
              <path
                v-for="(step, stepIndex) in columns"
                class="arc-item"
                :key="stepIndex"
                :d="describeArc(0, 0, 80, getStartAngle(stepIndex), getEndAngle(stepIndex))"
                :class="{ active: row.steps[step], highlighted: step === highlighted }"
                @click="toggleStep(row, step, $event)"
                stroke-width="15"
                stroke="blue"
                fill="none"
                stroke-linecap="round"
                :name="stepIndex"
              />
            </g>
          </svg>
        </div>
      </div>
    </TransitionGroup>
    <button v-show="availableSamples > activeSamples" @click="addRow(sequenceData)">
      <BaseIcon name="add" />
    </button>
  </div>
  <div>
    <label for="bpm">BPM:</label>
    <input id="bpm" type="number" min="20" max="300" v-model.number="bpm" />
  </div>
  <!-- <button @click="togglePlay">{{ isPlaying ? 'Pause' : 'Play' }}</button> -->

  <!-- <button @click="togglePlay" v-if="!isPlaying"><BaseIcon name="play_arrow" /></button>
  <button @click="togglePlay" v-else><BaseIcon name="pause" /></button> -->

  <BaseButton v-if="!isPlaying" @click="togglePlay" icon="play_arrow" />
  <BaseButton v-else @click="togglePlay" icon="pause" />
  <!-- <button @click="togglePlay">{{ isPlaying ? 'Pause' : 'Play' }}</button> -->
</template>

<style scoped lang="scss">
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
