
<script setup>
import { ref, reactive, watch } from 'vue';
import * as Tone from 'tone';
import samplePackA from '@/assets/samplePackA.json';

console.log(samplePackA.files)


const sample1 = 'crash_1_0_Tramhalte_Amsterdam.wav'
const sample2 = 'kick_2_0_REPORTAGE OVER DE METRO.wav'
const sample3 = 'snare_1_0_REPORTAGE OVER DE METRO.wav'
const sample4 = 'sfx_2_0_TRAM AMSTERDAM-ZANDVOORT.wav'
const sample5 = 'sfx_2_0_Tramhalte_Amsterdam.wav'

const BaseURL = 'https://api-hitloop.responsible-it.nl/test_samples?sample_pack=a&file='

const URL1 = `https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=${sample1}`
const URL2 = `https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=${sample2}`
const URL3 = `https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=${sample3}`
const URL4 = `https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=${sample4}`
const URL5 = `https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=${sample5}`

let isPlaying = ref(false);
let bpm = ref(120);
 

const notes = ["G4", "G4", "E2", "G2", "C3"];
const availableSamples = ['A3', 'B3', 'C3', 'D3'];

const activeSamples = ["A3","B3"]

const sampleList = ref(samplePackA.files)
console.log(sampleList)





const sequenceData = reactive(activeSamples.map(sample => ({
  sample: sample,
  steps: Array(16).fill(false),
  url: BaseURL + sampleList.value[0]
})));

function addRow() {
  // console.log(i)
  let all = sequenceData.length
  console.log('all');
  console.log(all);
  activeSamples.push('G4')
  sequenceData.push(
    {
      sample: 'G4',
      steps: Array(16).fill(false),
      url: BaseURL + sampleList.value[0]
    });
}


let objects = {};
// for (let i = 0; i < activeSamples.length; i++) {
//   objects[notes[i]] = activeSamples[i];
// }

for (let i = 0; i < sequenceData.length; i++) {
  objects[activeSamples[i]] = sequenceData[i].url;
}
console.log('objects')
console.log(objects)
console.log('sequenceData.length')
console.log(sequenceData.length)


let newObject = reactive({});


const getNewObjects = () => {


}

// sequenceData.value.forEach(obj => {
//   newObject[obj.sample] = obj.url;
// });



console.log('objects')
console.log(objects)


const sampler = new Tone.Sampler(
  objects
).toDestination();



console.log('sequenceData')
console.log(sequenceData)



const arrayOfObjects = [{
  sample: "A3",
  url: "https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=kick_2_3_REPORTAGE OVER DE METRO.wav"
},{
  sample: "B3",
  url: "https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=kick_2_3_REPORTAGE OVER DE TRAM.wav"
}]


const newOObject = {
  A3: "https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=kick_2_3_REPORTAGE OVER DE METRO.wav",
  B3: "https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=kick_2_3_REPORTAGE OVER DE TRAM.wav"
}


const sequence = new Tone.Sequence(async (time, col) => {
  for (const row of sequenceData) {
    if (row.steps[col]) {
      console.log('col')
      console.log(col)
      await sampler.triggerAttackRelease(row.sample,"8n", time);
    }
  }
}, Array.from({ length: 16 }, (_, i) => i), '16n');

Tone.Transport.bpm.value = bpm.value;

watch(bpm, (newBpm) => {
  Tone.Transport.bpm.value = newBpm;
});

function toggleStep(row, step) {
  row.steps[step] = !row.steps[step];
}

function togglePlay() {
  isPlaying.value = !isPlaying.value;
  if (isPlaying.value) {
    Tone.Transport.start();
    sequence.start();
  } else {
    Tone.Transport.stop();
    sequence.stop();
  }
}
</script>
  


<template>
<div id="sequencer">
  <div v-for="(row, index) in sequenceData" :key="index">
    <select v-model="row.url">
      <option v-for="sample in sampleList" :key="sample" :value="BaseURL + sample">{{ sample }}</option>
    </select>
    <div v-for="step in 16" :key="step" class="step" :class="{ 'active': row.steps[step] }"
         @click="toggleStep(row, step)"></div>
  </div>
</div>
<div>

  <label for="bpm">BPM:</label>
  <input id="bpm" type="number" min="20" max="300" v-model.number="bpm" />
</div>
<button @click="togglePlay">{{ isPlaying ? 'Pause' : 'Play' }}</button>
<button @click="addRow">add row </button>
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