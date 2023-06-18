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

export const useSequenceStore = defineStore('sequence', () => {
  const isStarted = ref(false);
  function setStarted() {
    isStarted.value = true
  }

  const isPlaying = ref(false);
  const bpm = ref(130)
  const columns = ref(12)
  const availableNotes = ref(['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'A4'])
  const activeNotes = ref(['A3'])
  const samplePack = ref('b')
  const sampleTypeList = ref(['Crash', 'Kick', 'Sfx', 'Snare', 'Hi-Hat'])
  const sampleData = ref()
  const sequenceData = ref(null)

  // activeNotes.value.map((sample) => ({
  //   sample,
  //   steps: createSequenceArraySteps(columns.value),
  //   url: getSampleFile(apiBaseURL, samplePack.value, sampleData[1].file)
  // }))
  async function setSampleData() {
    try {
      const data = await getSampleData(apiBaseURL, samplePack.value, 'list')
      sampleData.value = data.value
      return
      // return sampleData.value
    } catch (error) {
      console.log(error)
    }
  }
  setSampleData()
  async function setSequenceData() {
    try {
      await setSampleData()
      return (sequenceData.value = activeNotes.value.map((sample) => ({
        sample,
        steps: createSequenceArraySteps(columns.value),
        url: getSampleFile(apiBaseURL, samplePack.value, sampleData.value[0].file)
      })))  
    } catch (error) {
      console.log(error)
    }
  }
  setSequenceData()
  console.log(sequenceData.value)
  const currentStepIndex = ref(0)
  function setCurrentStepIndex(i) {
    return (currentStepIndex.value = i)
  }
  // const state = reactive({
  //   bpm: bpm,
  //   isPlaying: isPlaying,
  //   columns: columns
  // })
  const sampleObject = computed(() => {
    const newObj = ref({})
    getSequenceData.value.forEach((obj) => {
      newObj.value[obj.sample] = obj.url
    })
    console.log(newObj.value)
    return newObj.value
  })
  const getSequenceData = computed(() => {
    return sequenceData.value
  })
  function toggleStep(row, step) {
    return (row.steps[step] = !row.steps[step])
  }
  const updateSequenceURL = (index, newValue) => {
    console.log(index)
    console.log(newValue)
    sequenceData.value[index].url = newValue
  }

  const togglePlayPause = (val) => {
    isPlaying.value = !isPlaying.value
  }

  const togglePlay = (val) => {
    togglePlayPause()
    if (isPlaying.value) {
      Tone.Transport.start()
    } else {
      Tone.Transport.stop()
    }
  }

  const addSequence = () => {
    if (!sequenceData.value) return
    let all = sequenceData.value.length
    let thisSample = availableNotes.value[all]

    activeNotes.value.push(thisSample)
    sequenceData.value.push({
      sample: thisSample,
      steps: createSequenceArraySteps(columns.value),
      url: getSampleFile(apiBaseURL, samplePack.value, sampleData.value[0].file)
    })
  }

  return {
    bpm,
    sequenceData,
    isPlaying,
    samplePack,
    sampleData,
    columns,
    availableNotes,
    activeNotes,
    currentStepIndex,
    addSequence,
    getSequenceData,
    toggleStep,
    updateSequenceURL,
    togglePlayPause,
    sampleTypeList,
    setCurrentStepIndex,
    sampleObject,
    togglePlay,
    isStarted,
    setStarted
  }
})
