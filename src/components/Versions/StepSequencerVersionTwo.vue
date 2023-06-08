<script setup>
import { ref, reactive, watch } from 'vue'
import * as Tone from 'tone'
import samplePackA from '@/assets/samplePackA.json'
import samplePackB from '@/assets/samplePackB.json'

console.log(samplePackA.files)

// const sample1 = 'crash_1_0_Tramhalte_Amsterdam.wav'
// const sample2 = 'kick_2_0_REPORTAGE OVER DE METRO.wav'
// const sample3 = 'snare_1_0_REPORTAGE OVER DE METRO.wav'
// const sample4 = 'sfx_2_0_TRAM AMSTERDAM-ZANDVOORT.wav'
// const sample5 = 'sfx_2_0_Tramhalte_Amsterdam.wav'

const BaseURL = 'https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file='

// const URL1 = `https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=${sample1}`
// const URL2 = `https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=${sample2}`
// const URL3 = `https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=${sample3}`
// const URL4 = `https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=${sample4}`
// const URL5 = `https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=${sample5}`

const isPlaying = ref(false)
const bpm = ref(120)

const columns = ref(16)
// const notes = ["G4", "G4", "E2", "G2", "C3"];
const availableSamples = ['A3', 'B3', 'C3', 'D3']

const activeSamples = ref(['A3', 'B3'])

const sampleList = ref(samplePackB.files)
console.log(sampleList)

function addRow(sData) {
  console.log(sData)
  // console.log(i)
  let all = sequenceData.length
  console.log('all')
  console.log(all)
  console.log('availableSamples[all]')
  let thisSample = availableSamples[all]
  console.log(thisSample)

  console.log('activeSamples.value')
  console.log(activeSamples.value)
  activeSamples.value.push(thisSample)
  sequenceData.push({
    sample: thisSample,
    steps: Array(16).fill(false),
    url: BaseURL + sampleList.value[all]
  })
}

const sequenceData = reactive(
  activeSamples.value.map((sample) => ({
    sample,
    steps: Array(16).fill(false),
    url: BaseURL + sampleList.value[0]
  }))
)

const objects = reactive({})
// for (let i = 0; i < activeSamples.length; i++) {
//   objects[notes[i]] = activeSamples[i];
// }

sequenceData.forEach((obj) => {
  objects[obj.sample] = obj.url
})

// for (let i = 0; i < sequenceData.length; i++) {
//   objects[sequenceData[i].sample] = sequenceData[i].url;
// }

// watch(sequenceData)

// watch(sequenceData, () => {
//   for (let i = 0; i < sequenceData.length; i++) {
//   objects[sequenceData[i].sample] = sequenceData[i].url;
// }
// });

console.log('objects')
console.log(objects)
console.log('sequenceData.length')
console.log(sequenceData.length)

// let newObject = reactive({});

// const getNewObjects = () => {

// }

// sequenceData.value.forEach(obj => {
//   newObject[obj.sample] = obj.url;
// });

console.log('objects')
console.log(objects)

// let sampler = new Tone.Sampler({
//   urls: objects
// },
//   onload: () => {
//   console.log('Sampler loaded')
// }).toDestination()

const createSampleObject = (sequenceData) => {
  let newObjects = reactive({})
  sequenceData.forEach((obj) => {
    newObjects[obj.sample] = obj.url
  })
  return newObjects
}
createSampleObject(sequenceData)
// const newSampleObject = createSampleObject(sequenceData)

console.log('sequenceData')
console.log(sequenceData)

// const arrayOfObjects = [{
//   sample: "A3",
//   url: "https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=kick_2_3_REPORTAGE OVER DE METRO.wav"
// },{
//   sample: "B3",
//   url: "https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=kick_2_3_REPORTAGE OVER DE TRAM.wav"
// }]

// const newOObject = {
//   A3: "https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=kick_2_3_REPORTAGE OVER DE METRO.wav",
//   B3: "https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=kick_2_3_REPORTAGE OVER DE TRAM.wav"
// }

const tick = (time, col) => {
  console.log('objects')
  console.log(objects)
  const newSampleObject = createSampleObject(sequenceData)
  console.log('newSampleObject')
  console.log(newSampleObject)
  const sampler = new Tone.Sampler({
    urls: newSampleObject,
    onload: () => {
      console.log('loaded')
    }
  }).toDestination()

  for (const row of sequenceData) {
    if (row.steps[col]) {
      console.log('col')
      console.log(row.steps[col])
      console.log('row.sample')
      console.log(row.sample)
      console.log('row.url')
      console.log(row.url)

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

console.log('array from')
console.log(Array.from({ length: 16 }, (_, i) => i))
const sequenceArray = sequenceData.steps
console.log('sequenceArray')
console.log(sequenceArray)
console.log('indexArray(columns.value)')
console.log(indexArray(columns.value))

const sequence = new Tone.Sequence(tick, indexArray(columns.value), '16n')

Tone.Transport.bpm.value = bpm.value

watch(bpm, (newBpm) => {
  Tone.Transport.bpm.value = newBpm
})

function toggleStep(row, step) {
  row.steps[step] = !row.steps[step]
}

async function togglePlay() {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    // await Tone.start()
    console.log('sequenceData')
    console.log(sequenceData)
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
