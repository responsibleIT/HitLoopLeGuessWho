<script setup>
import { ref, reactive, watch } from 'vue'
import * as Tone from 'tone'
// Pack with sample names
import samplePackB from '@/assets/samplePackB.json'

// Base url for the api
const BaseURL = 'https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file='
const isPlaying = ref(false)
const bpm = ref(120)
const columns = ref(16)
const availableSamples = ['A3', 'B3', 'C3', 'D3']
const activeSamples = ref(['A3', 'B3'])
const sampleList = ref(samplePackB.files)

// This function adds a new row to the sequencer
function addRow() {
  let all = sequenceData.length
  let thisSample = availableSamples[all]

  activeSamples.value.push(thisSample)
  sequenceData.push({
    sample: thisSample,
    steps: Array(16).fill(false),
    url: BaseURL + sampleList.value[all]
  })
}

// In the sequenceData are the row information stored like: the sample file, steps in the row and the API url
const sequenceData = reactive(
  activeSamples.value.map((sample) => ({
    sample,
    steps: Array(16).fill(false),
    url: BaseURL + sampleList.value[0]
  }))
)

const objects = reactive({})

sequenceData.forEach((obj) => {
  objects[obj.sample] = obj.url
})

const createSampleObject = (sequenceData) => {
  let newObjects = reactive({})
  sequenceData.forEach((obj) => {
    newObjects[obj.sample] = obj.url
  })
  return newObjects
}
createSampleObject(sequenceData)

const tick = (time, col) => {
  const newSampleObject = createSampleObject(sequenceData)
  const sampler = new Tone.Sampler({
    urls: newSampleObject,
    onload: () => {
      console.log('loaded')
    }
  }).toDestination()

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

function toggleStep(row, step) {
  row.steps[step] = !row.steps[step]
}

// With this function you can play or pause the sequencer
async function togglePlay() {
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
    <div v-for="(row, index) in sequenceData" :key="index">
      <select v-model="row.url" :id="index">
        <option v-for="sample in sampleList" :key="sample" :value="BaseURL + sample">
          {{ sample }}
        </option>
      </select>
      <div
        v-for="step in columns"
        :key="step"
        class="step"
        :id="step"
        :class="{ active: row.steps[step] }"
        @click="toggleStep(row, step)"
      ></div>
    </div>
  </div>
  <div>
    <label for="bpm">BPM:</label>
    <input id="bpm" type="number" min="20" max="300" v-model.number="bpm" />
  </div>
  <button @click="togglePlay">{{ isPlaying ? 'Pause' : 'Play' }}</button>
  <button @click="addRow(sequenceData)">add row</button>
</template>

<style scoped lang="scss">
.step {
  width: 20px;
  height: 20px;
  border: 1px solid #000;
}

#sequencer {
  display: flex;
  flex-direction: column;

  div {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;

    div {
      display: flex;
    }
  }
}

.active {
  background-color: #000;
}
</style>
