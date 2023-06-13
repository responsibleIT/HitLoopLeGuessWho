import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import * as Tone from 'tone'
import {
  createSampleObject,
  createSequenceArraySteps,
  createSequenceArrayIndex
} from '@/helpers/toneHelpers.js'

import { getSampleData, getSampleFile } from '@/composables/getSampleData.js'

const apiBaseURL = import.meta.env.VITE_API_BASE

export const useSequenceStore = defineStore('sequence', async () => {
  const isPlaying = ref(false)
  const bpm = ref(130)
  const columns = ref(9)
  const availableNotes = ref(['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'A4'])
  const activeNotes = ref(['A3'])
  const samplePack = ref('b')
  const sampleTypeList = ref(['Crash', 'Kick', 'Sfx', 'Snare'])
  const sampleData = await getSampleData(apiBaseURL, samplePack.value, 'list')
  // const setSampleData
  console.log(sampleData)
  const sequenceData = activeNotes.value.map((sample) => ({
      sample,
      steps: createSequenceArraySteps(columns.value),
      url: getSampleFile(apiBaseURL, samplePack.value, sampleData[1].file)
    }))

  const currentStepIndex = ref(0)
  function setCurrentStepIndex(i) {
    currentStepIndex.value = i 
  }
  // const state = reactive({
  //   bpm: bpm,
  //   isPlaying: isPlaying,
  //   columns: columns
  // })

  function toggleStep(row, step) {
    console.log(row)
    console.log(step)
    for (const item of sequenceData) {
      if (row === item) {
        console.log(`${row} is ${item}`)
      }
      row.steps[step] = !row.steps[step]
    }
}
  const updateSequenceURL = (index, newValue) => {
    sequenceData.value[index].url = newValue
  }
  const togglePlayPause = () => {
    isPlaying.value = !isPlaying.value
    if (isPlaying.value) {
      Tone.Transport.start()
    } else {
      Tone.Transport.stop()
    }
  }
  const addSequence = () => {
    let all = sequenceData.length
    let thisSample = availableNotes[all]

    activeNotes.value.push(thisSample)
    sequenceData.push({
      sample: thisSample,
      steps: createSequenceArraySteps(columns.value),
      url: getSampleFile(apiBaseURL, samplePack.value, sampleData.value[all].file)
    })
  }
  return {
    bpm,
    isPlaying,
    samplePack,
    sampleData,
    columns,
    availableNotes,
    activeNotes,
    currentStepIndex,
    addSequence,
    toggleStep,
    updateSequenceURL,
    togglePlayPause,
    sampleTypeList,
    setCurrentStepIndex
  }
})
