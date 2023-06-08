<script async setup>
import { ref, reactive, watch } from 'vue'
import * as Tone from 'tone'
// Pack with sample names
import samplePackB from '@/assets/samplePackB.json'
import BaseIcon from '@/components/BaseIcon.vue'
import { getSampleData } from '@/composables/getSampleData.js'
// Base url for the api
const apiBaseURL = import.meta.env.VITE_API_BASE
const BaseURL = 'https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file='
const isPlaying = ref(false)
const bpm = ref(120)
const columns = ref(16)
const availableSamples = ['A3', 'B3', 'C3', 'D3']
const activeSamples = ref(['A3', 'B3'])
const sampleList = ref(samplePackB.files)

const sampleDataB = await getSampleData(apiBaseURL, 'b', 'list')
console.log('sampleDataB')
console.log(sampleDataB)

const sampleTypeList = ref(['Crash', 'Kick', 'Sfx', 'Snare'])

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
        <template v-for="(sampleType, i) in sampleTypeList" :key="i">
          <optgroup :label="sampleType">
            <template v-for="(sample, sIndex) in sampleDataB">
              <option v-if="sample.type === sampleType" :key="sample" :value="BaseURL + sample.file">
                {{ sample.version }} - {{ sample.name }}
              </option>
            </template>
          </optgroup>
        </template>
      </select>
      <div class="step-container">
        <button
          v-for="step in columns"
          :key="step"
          class="step"
          :class="{ active: row.steps[step], highlighted: step === highlighted }"
          @click="toggleStep(row, step)"
        ></button>
      </div>
    </div>
    <button v-show="availableSamples > activeSamples" @click="addRow(sequenceData)">add row</button>
  </div>
  <div>
    <label for="bpm">BPM:</label>
    <input id="bpm" type="number" min="20" max="300" v-model.number="bpm" />
  </div>
  <!-- <button @click="togglePlay">{{ isPlaying ? 'Pause' : 'Play' }}</button> -->

  <button @click="togglePlay" v-if="!isPlaying"><BaseIcon name="play_arrow" /></button>
  <button @click="togglePlay" v-else><BaseIcon name="pause" /></button>
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
  transition: all 1ms ease-in-out;
  position: absolute;

  &.highlighted {
    border: 4px solid var(--color-orange);
  }
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
  background-color: var(--color-black-mute);
}
</style>
