
<script setup>
import { ref, reactive, watch } from 'vue'
import * as Tone from 'tone'

const availableNotes = ['C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4']

const synth = new Tone.PolySynth(Tone.Synth).toDestination()

const BPM = ref(120);

const subNote = ref('8n');
const rows = ref(16);



const sequenceData = reactive(
  availableNotes.map((note) => ({
    note,
    steps: Array(16).fill(false)
  }))
)

let isPlaying = ref(false)

const sequence = new Tone.Sequence(
  (time, col) => {
    for (const row of sequenceData) {
      if (row.steps[col]) {
        synth.triggerAttackRelease(row.note, '8n', time)
      }
    }
  },
  Array.from({ length: 16 }, (_, i) => i),
  '8n'
)

Tone.Transport.bpm.value = BPM.value

function toggleStep(row, step) {
  row.steps[step] = !row.steps[step]
}

function togglePlay() {
  isPlaying.value = !isPlaying.value

  if (isPlaying.value) {
    Tone.Transport.start()
    sequence.start()
  } else {
    Tone.Transport.stop()
    sequence.stop()
  }
}


function updateBPM(event) {
  BPM.value = +event.target.value;
  Tone.Transport.bpm.value = BPM.value
}


watch(BPM.value, (newBPM) => {
  Tone.Transport.bpm.value = newBPM.value
})

</script>

<template>
      <label for='BPM'> {{ BPM }}</label>
    <input id="BPM" v-model.number="BPM"  @input="updateBPM" type='number'  placeholder="129" default="BPM">
  <div id="sequencer">


    <div v-for="(row, index) in sequenceData" :key="index">
      <select v-model="row.note">
        <option v-for="note in availableNotes" :key="note" :value="note">{{ note }}</option>
      </select>
      <div
        v-for="step in 16"
        :key="step"
        class="step"
        :class="{ active: row.steps[step] }"
        @click="toggleStep(row, step)"
      ></div>
    </div>
  </div>
  <button @click="togglePlay">{{ isPlaying ? 'Pause' : 'Play' }}</button>
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
