<script setup>
import { ref, reactive, watch } from 'vue'
import * as Tone from 'tone'
// Pack with sample names
import samplePackB from '@/assets/samplePackB.json'
import BaseIcon from '@/components/BaseIcon.vue'
// Base url for the api
const BaseURL = 'https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file='
const isPlaying = ref(false)
const bpm = ref(120)
const columns = ref(8)
const availableSamples = ['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'A4']
const activeSamples = ref(['A3'])
const sampleList = ref(samplePackB.files)

// This function adds a new row to the sequencer
function addRow() {
  let all = sequenceData.length
  let thisSample = availableSamples[all]

  activeSamples.value.push(thisSample)
  sequenceData.push({
    sample: thisSample,
    steps: Array(8).fill(false),
    url: BaseURL + sampleList.value[all]
  })
}

// In the sequenceData are the row information stored like: the sample file, steps in the row and the API url
const sequenceData = reactive(
  activeSamples.value.map((sample) => ({
    sample,
    steps: Array(8).fill(false),
    url: BaseURL + sampleList.value[0]
  }))
)

const createSampleObject = (sequenceData) => {
  const newObject = reactive({})
  sequenceData.forEach((obj) => {
    newObject[obj.sample] = obj.url
  })
  return newObject
}
// createSampleObject(sequenceData)
const highlighted = ref(-1)
const tick = (time, col) => {
  const newSampleObject = createSampleObject(sequenceData)
  const sampler = new Tone.Sampler({
    urls: newSampleObject,
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
      Tone.loaded().then(async () => {
        await sampler.triggerAttackRelease(row.sample, '16n')
      })
    }
  }
}

const indexArray = (count) => {
  const indices = ref([])
  for (let i = 0; i < count; i++) {
    indices.value.push(i)
  }
  return indices.value
}

const sequence = new Tone.Sequence(tick, indexArray(columns.value), '16n')

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
</script>

<template>
  <div id="sequencer">
    <div v-for="(row, index) in sequenceData" class="row" :key="index">
      <select v-model="row.url" :id="index">
        <option v-for="sample in sampleList" :key="sample" :value="BaseURL + sample">
          {{ sample }}
        </option>
      </select>
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <line
          v-for="(step, stepIndex) in row.steps"
          :key="stepIndex"
          :x1="100 + 80 * Math.cos((2 * Math.PI * stepIndex) / columns - Math.PI / 2)"
          :y1="100 + 80 * Math.sin((2 * Math.PI * stepIndex) / columns - Math.PI / 2)"
          :x2="100 + 90 * Math.cos((2 * Math.PI * stepIndex) / columns - Math.PI / 2)"
          :y2="100 + 90 * Math.sin((2 * Math.PI * stepIndex) / columns - Math.PI / 2)"
          :class="{ active: step, highlighted: stepIndex === highlighted }"
          @click="toggleStep(row, stepIndex)"
          stroke-width="50"
          stroke="#8B8B8B"
        />
      </svg>
    </div>
  </div>
  <div>
    <label for="bpm">BPM:</label>
    <input id="bpm" type="number" min="20" max="300" v-model.number="bpm" />
  </div>

  <button @click="togglePlay" v-if="!isPlaying"><BaseIcon name="play_arrow" /></button>
  <button @click="togglePlay" v-else><BaseIcon name="pause" /></button>
  <button v-show="availableSamples > activeSamples" @click="addRow(sequenceData)">add row</button>
</template>

<style scoped lang="scss">
svg {
  width: 10rem;
}

.line {
  cursor: pointer;
}

.active {
  stroke: #2ecd71;
}

.highlighted {
  stroke: #acf9cc;
}

#sequencer {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* see notes below */
  grid-gap: 1em;
  padding: 2rem;
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
</style>
