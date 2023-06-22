<!-- eslint-disable vue/multi-word-component-names -->
<script async setup>
import {
  ref,
  reactive,
  watch,
  onMounted,
  onUnmounted,
  TransitionGroup,
  Transition,
  computed,
watchEffect
} from 'vue'

import { storeToRefs } from 'pinia'
import * as Tone from 'tone'
// Pack with sample names
import { useSequenceStore } from '@/stores/sequence.js'
const store = useSequenceStore()
import InputBpm from '@/components/InputBpm.vue'
import {
  createSampleObject,
  createSequenceArraySteps,
  createSequenceArrayIndex
} from '@/helpers/toneHelpers.js'

import BaseIcon from '@/components/BaseIcon.vue'
import BaseButton from '@/components/BaseButton.vue'
import SequenceItem from '@/components/SequenceItem.vue'
import SequenceItemControl from '@/components/SequenceItemControl.vue'

// store values to vuejs ref
const {
  availableNotes,
  activeNotes,
  currentStepIndex,
  sampleData,
  isPlaying,
  columns,
  sequenceData,
  isStarted,
  bpm,
  reverb,
  chorus
} = storeToRefs(store)

const { toggleStep, setStarted, addSequence, togglePlayPause, setCurrentStepIndex } = store

// Base url for the api

// const bpm = ref(120)
const playTime = ref(null)
// let sequence

// const sampler = new Tone.Sampler().toDestination()
let sequence


const configSequence = () => {

let rev = new Tone.Reverb(store.reverb.value).toDestination()
console.log()
let chor = new Tone.Chorus(store.reverb.value).toDestination()

  // tick is callback function which is runned every
  const tick = (time, col) => {
    const sampler = new Tone.Sampler({
      urls: store.sampleObject,
      onload: () => {
        for (const row of sequenceData.value) {
          if (row.steps[col]) {
            sampler
              .triggerAttackRelease(row.sample, '16n', time)
              .sync()
          }
        }
      }
    })
    sampler.toDestination().chain(rev, chor, Tone.Destination)
    Tone.Draw.schedule(() => {
      if (isPlaying.value) {
        setCurrentStepIndex(col)
      }
    }, time)
  }
  sequence = new Tone.Sequence(tick, createSequenceArrayIndex(columns.value), '16n')
  sequence.humanize = true
  console.log(sequence.get())
}

Tone.Transport.bpm.value = bpm.value

watch(bpm, (newBpm) => {
  Tone.Transport.bpm.value = newBpm
  configSequence()
})

const togglePlay = () => {
  if (!isStarted.value) {
    // Tone.start()
    Tone.getDestination().volume.rampTo(-10, 0.001)
    setStarted()
  }

  let now = Tone.now()
  togglePlayPause()
  if (isPlaying.value) {
    // get current time
    let now = Tone.now()
    //set playtime to current time
    // playtime is state
    playTime.value = now
    //start sequence +0.1 in the fututre
    Tone.Transport.start()
    sequence.start()
  } else {
    playTime.value = Tone.now()
    Tone.Transport.pause()
    // sequence.stop()
  }
}

const onKeyDown = (event) => {
  if (event.code === 'Space') {
    togglePlay()
    event.preventDefault()
  }
}

// watchEffect(() => {
//   bpm.value
//   chorus.value
//   reverb.value
//   // rev = new Tone.Reverb(reactiveReverb).toDestination()
// console.log(reverb.value)
//   // sequence.chain(rev)
//   configSequence()
// })



onMounted(() => {
  // Tone.start()
  configSequence()
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <div id="sequencer" v-if="sequenceData">
    <Suspense>
      <TransitionGroup name="fade">
        <template v-for="(row, index) in sequenceData" :key="index">
          <SequenceItem :item="row" :id="index" />
        </template>
      </TransitionGroup>
    </Suspense>
    <SequenceItem empty>
      <button v-show="availableNotes > activeNotes" @click="addSequence()">
        <BaseIcon name="add" />
      </button>
    </SequenceItem>
  </div>
  <div class="controlls">
    <InputBpm />
    <label for='reverb'>reverb</label>
    <input id="reverb" type='range' v-model.number="reverb.decay" step=".01">
    <Suspense>
      <BaseButton v-if="!isPlaying" @click="togglePlay" icon="play_arrow" />
      <BaseButton v-else @click="togglePlay" icon="pause" />
    </Suspense>
  </div>
  
    <SequenceItemControl v-show="false"/>
  
</template>

<style scoped lang="scss">
.controlls {
  display: flex;
  justify-content: end;
  align-items: center;
  align-content: center;
  gap: 1em;
  width: 100%;
  height: 7rem;
  background-color: var(--light-color);
  border-radius: 8px;
}
.sequencer {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  width: 100%;
  height: 7rem;
  padding: 2rem;
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
  display: flex;
  flex-direction: column;
  // grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* see notes below */
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
