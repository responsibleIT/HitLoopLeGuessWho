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
  computed
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
import StateSequenceItem from '@/components/Versions/StateComponents/StateSequenceItem.vue'
import SequenceItem from './SequenceItem.vue'

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
  bpm
} = storeToRefs(store)

const { toggleStep, setStarted, addSequence, togglePlayPause, setCurrentStepIndex } = store

// Base url for the api

// const bpm = ref(120)
const playTime = ref(null)
let sequence

// const sampler = new Tone.Sampler().toDestination()
const configSequence = () => {
  // tick is callback function which is runned every
  const tick = (time, col) => {
    const sampler = new Tone.Sampler({
      urls: store.sampleObject,
      onload: () => {
        for (const row of sequenceData.value) {
          if (row.steps[col]) {
            sampler.triggerAttackRelease(row.sample, '16n').sync()
          }
        }
      }
    })
    sampler.toDestination()
    Tone.Draw.schedule(() => {
      if (isPlaying.value) {
        setCurrentStepIndex(col)
      }
    }, time)
  }
  sequence = new Tone.Sequence(tick, createSequenceArrayIndex(columns.value), '16n')
}

Tone.Transport.bpm.value = bpm.value

watch(bpm, (newBpm) => {
  Tone.Transport.bpm.value = newBpm
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
    sequence.start('+0.1', now)
    Tone.Transport.start('+0.1', now)
  } else {
    playTime.value = Tone.now()
    sequence.stop()
    Tone.Transport.stop(now)
  }
}

const onKeyDown = (event) => {
  if (event.code === 'Space') {
    togglePlay()
    event.preventDefault()
  }
}

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
        <div v-for="(row, index) in sequenceData" :key="index">
          <SequenceItem :item="row" :id="index" />
        </div>
      </TransitionGroup>
    </Suspense>
    <SequenceItem empty>
      <button v-show="availableNotes > activeNotes" @click="addSequence()">
        <BaseIcon name="add" />
      </button>
    </SequenceItem>
  </div>
  <div class="controlls">
    <div>
      <label for="bpm">BPM:</label>
      <InputBpm />
    </div>
    <Suspense>
      <BaseButton v-if="!isPlaying" @click="togglePlay" icon="play_arrow" />
      <BaseButton v-else @click="togglePlay" icon="pause" />
    </Suspense>
  </div>
  <!-- <HitLoopControl :togglePlay="togglePlay" /> -->
</template>

<style scoped lang="scss">
.controlls {
  padding: 1em;
  display: flex;
  align-items: center;
  gap: 1em;
  position: fixed;
  bottom: 0;
  justify-content: center;
  justify-items: center;
  // margin: 0 auto;
  left: 0;
  right: 0;
}
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
