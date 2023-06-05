<template>
  <div id="sequencer">
    <div v-for="(row, index) in sequenceData" :key="index">
      <select v-model="row.sample" @change="updateSampler(row)">
        <option v-for="sample in availableSamples" :key="sample" :value="sample">
          {{ sample }}
        </option>
      </select>
      <div
        v-for="step in 16"
        :key="step"
        class="step"
        :class="{ active: row.steps[step] }"
        @click="toggleStep(row, step)"
      ></div>
      <button @click="deleteRow(index)">Delete Row</button>
    </div>
  </div>
  <button @click="addRow">Add Row</button>
  <div>
    <label for="bpm">BPM:</label>
    <input id="bpm" type="number" min="20" max="300" v-model.number="bpm" />
  </div>
  <button @click="togglePlay">{{ isPlaying ? 'Pause' : 'Play' }}</button>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import * as Tone from 'tone'

const sample1 = 'crash_1_0_Tramhalte_Amsterdam.wav'
const sample2 = 'kick_2_0_REPORTAGE OVER DE METRO.wav'
const sample3 = 'snare_1_0_REPORTAGE OVER DE METRO.wav'
const sample4 = 'sfx_2_0_TRAM AMSTERDAM-ZANDVOORT.wav'
const sample5 = 'sfx_2_0_Tramhalte_Amsterdam.wav'

const URL1 = `https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=${sample1}`
const URL2 = `https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=${sample2}`
const URL3 = `https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=${sample3}`
const URL4 = `https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=${sample4}`
const URL5 = `https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=${sample5}`

const availableSamples = [URL1, URL2, URL3, URL4, URL5]

const sequenceData = reactive(
  availableSamples.map((sample) => ({
    sample,
    steps: Array(16).fill(false),
    sampler: new Tone.Sampler({ C4: sample }).toDestination()
  }))
)

let isPlaying = ref(false)
let bpm = ref(120)

const sequence = new Tone.Sequence(
  (time, col) => {
    for (const row of sequenceData) {
      if (row.steps[col]) {
        row.sampler.triggerAttack('C4', time)
      }
    }
  },
  Array.from({ length: 16 }, (_, i) => i),
  '16n'
)

Tone.Transport.bpm.value = bpm.value

watch(bpm, (newBpm) => {
  Tone.Transport.bpm.value = newBpm
})

function addRow() {
  sequenceData.push({
    sample: availableSamples[0],
    steps: Array(16).fill(false),
    sampler: new Tone.Sampler({ C4: `samples/${availableSamples[0]}.mp3` }).toDestination()
  })
}

function updateSampler(row) {
  row.sampler.dispose()
  row.sampler = new Tone.Sampler({ C4: `samples/${row.sample}.mp3` }).toDestination()
}

function deleteRow(index) {
  sequenceData[index].sampler.dispose()
  sequenceData.splice(index, 1)
}

function toggleStep(row, step) {
  row.steps[step] = !row.steps[step]
}

// function togglePlay() {
//   isPlaying.value = !isPlaying.value

//   if (isPlaying.value) {
//     Tone.Transport.start()
//     sequence.start()
//   } else {
//     Tone.Transport.stop()
//     sequence.stop()
//   }
// }

function togglePlay() {
  isPlaying.value = !isPlaying.value

  if (isPlaying.value) {
    if (Tone.Transport.state !== 'started') {
      Tone.Transport.start()
    }
    if (sequence.state !== 'started') {
      sequence.start()
    }
  } else {
    Tone.Transport.stop()
    sequence.stop()
  }
}
</script>

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
