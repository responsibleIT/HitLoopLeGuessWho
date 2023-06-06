<script setup>
import {
  ref,
  onMounted,
  watch,
  watchEffect,
  computed,
  onUpdated,
  reactive,
  TransitionGroup
} from 'vue'
import * as Tone from 'tone'
import { useFetch, useToggle } from '@vueuse/core'
// import style from './step-sequencer.scss';
const props = defineProps({
  playPause: Boolean
})

// https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=crash_1_0_Tramhalte_Amsterdam.wav

// https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=

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

const columns = ref(16)
const notes = ref(['G2', 'F2', 'E2', 'D2', 'C2'])
const rows = ref(5)
const subdivision = ref('8n')
const sequencer = ref(null)
const matrix = ref([])

const highlighted = ref(-1)
const started = ref(false)
const playing = ref(false)
const bpm = ref(130)

const indexArray = (count) => {
  const indices = ref([])
  for (let i = 0; i < count; i++) {
    indices.value.push(i)
  }
  return indices.value
}

const tick = (time, index) => {
  // const player = new Tone.Player(Tone.Player)
  const synth = new Tone.PolySynth(Tone.Synth).toDestination()
  const now = Tone.now()

  let newSampler = new Tone.Sampler({
    urls: {
      C2: URL1,
      D2: URL2,
      E2: URL3,
      F2: URL4,
      G2: URL5
    },
    onload: () => {
      console.log('Sampler loaded')
    }
  }).toDestination()

  Tone.Draw.schedule(() => {
    if (started.value === true) {
      highlighted.value = index
    }
  }, time)

  matrix.value[index].forEach((value, row) => {
    // console.log(value)

    // value = true when cell is active
    if (value) {
      // row = current row that must make a sound, so when its active
      row = rows.value - row - 1

      // idk what this does
      const event = new CustomEvent('trigger', {
        detail: {
          time,
          row
        },
        composed: true
      })

      Tone.loaded().then(() => {
        newSampler.triggerAttackRelease(notes.value[row], subdivision.value)
      })
      // make a sound when note is active.
      // synth.triggerAttackRelease(notes.value[row],subdivision.value)
      document.dispatchEvent(event)
    }
  })
}

const updateCell = (column, row) => {
  matrix.value[column][row] = !matrix.value[column][row]
}

const mouseover = (column, row) => {
  if (event.buttons) {
    updateCell(column, row)
  }
}

const clickCell = (col, row) => {
  if (event) {
    updateCell(col, row)
  }
}

const container = ref(null)
const width = ref(10)
watch(rows, () => {
  width.value = container.value.offsetWidth
})

const cellWidth = computed(() => {
  return width.value / columns.value
})

watch(cellWidth, () => {
  container.value.style.height = `${cellWidth.value * rows.value}px`
})
onMounted(() => {
  sequencer.value = new Tone.Sequence(tick, indexArray(columns.value), subdivision.value).start(0)
  
  matrix.value = indexArray(columns.value).map(() => {
    return indexArray(rows.value).map(() => false)
  })

  Tone.Transport.on('start', () => {
    started.value = true
    Tone.getDestination().volume.rampTo(-10, 0.001)
  })
  Tone.Transport.on('stop', () => {
    started.value = false
  })
})

const togglePlayPause = async (e) => {
  const toggleStarted = useToggle(started)
  const togglePlayPause = useToggle(playing)
  if (!started.value) {
    await Tone.start()
    Tone.getDestination().volume.rampTo(-10, 0.001)
    started.value = true
  }
  if (e && playing.value) {
    await Tone.Transport.start()
    togglePlayPause()
  } else {
    await Tone.Transport.stop()
    togglePlayPause()
  }
}
const togglePlayPauseButton = async (e) => {
  if (e) {
    await Tone.start()
  }
}

const startM = async (e) => {
  if (e) {
    await Tone.Transport.start()
    // Tone.getDestination().volume.rampTo(-10, 0.001);
  }
}

const stopM = async (e) => {
  // const now = Tone.now()
  if (e) {
    await Tone.Transport.stop()
  }
}
</script>

<template>
  <div id="container" ref="container">
    <TransitionGroup>
      <div
        v-for="(column, x) in matrix"
        :key="x"
        class="column"
        :class="{ highlighted: x === highlighted }"
      >
        <button
          v-for="(cell, y) in column"
          :key="y"
          @mouseover="mouseover(x, y)"
          @click="clickCell(x, y)"
          :x="x"
          :y="y"
          class="cell"
          :class="{ filled: cell }"
        >
          <!-- {{ x }} <br/> {{ highlighted }} -->
        </button>
      </div>
    </TransitionGroup>
  </div>
  <p>Started = {{ started }}</p>
  <p>highlighted = {{ highlighted }}</p>
  <button @click="stopM">Stop</button>
  <button @click="startM">Start</button>
  <button @click="columns++">addRow</button>
  <pre>{{ matrix }}</pre>
</template>

<style scoped lang="scss">
#container,
.column {
  gap: 0em;
}

#container {
  width: 100%;
  overflow-x: scroll;
  display: flex;
  flex-direction: row;
  // justify-content: center;
  // align-items: center;
}

.column {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;

  &.highlighted {
    border: 1px solid red;
  }
}

.cell {
  width: 3em;
  height: 3em;
}

.filled {
  background: var(--color-primary);
}

/* @import "./step-sequencer.scss"; */
</style>

<!-- <script setup>
import {ref} from 'vue';
defineProps({
  columns: Number,
  rows: Number,
  subdivision: String,
})
</script>

<template>
  <div class="container">

    <template v-for="(column, index) in columns">
      <div class='column' :highlighted="index ===  ">
        
      </div>
    </template>
    
    
  </div>
</template>


<style lang="scss" scoped> -->
