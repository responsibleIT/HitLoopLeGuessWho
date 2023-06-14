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
  const isPlaying = ref(false);
  const bpm = ref(130);
  const columns = ref(9); 
  const availableNotes = ref(['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'A4']);
  const activeNotes = ref(['A3']);
  const samplePack = ref('b');
  const sampleTypeList = ref(['Crash', 'Kick', 'Sfx', 'Snare']);
  // const sampleData = await getSampleData(apiBaseURL, samplePack.value, 'list')
  const sampleData = ref();
  // const setSampleData
  console.log(sampleData);
  const sequenceData = ref();

  // activeNotes.value.map((sample) => ({
  //   sample,
  //   steps: createSequenceArraySteps(columns.value),
  //   url: getSampleFile(apiBaseURL, samplePack.value, sampleData[1].file)
  // }))
  async function setSampleData() {
    try {
      const data = await getSampleData(apiBaseURL, samplePack.value, 'list')
      sampleData.value = data.value
      // return sampleData.value
    } catch (error) {
      console.log(error)
    }
  }
  setSampleData()
  async function setSequenceData() {
    await setSampleData();
    return sequenceData.value = activeNotes.value.map((sample) => ({
      sample,
      steps: createSequenceArraySteps(columns.value),
      url: getSampleFile(apiBaseURL, samplePack.value, sampleData.value[0].file)
    }))
  }
  setSequenceData()
  console.log(sequenceData.value)
  const currentStepIndex = ref(0)
  function setCurrentStepIndex(i) {
    return currentStepIndex.value = i
  }
  // const state = reactive({
  //   bpm: bpm,
  //   isPlaying: isPlaying,
  //   columns: columns
  // })
  const getSequenceData = computed(() => {
    return sequenceData.value
  })
  console.log('getSequenceData')
  console.log(getSequenceData.value)
  function toggleStep(row, step) {
      return row.steps[step] = !row.steps[step]
  }
  const updateSequenceURL = (index, newValue) => {
    console.log(index)
    console.log(newValue)
    sequenceData.value[index].url = newValue
  }


  const togglePlayPause = (val) => {
    isPlaying.value = !isPlaying.value
  }
  const addSequence = () => {
    if(!sequenceData.value) return
    let all = sequenceData.value.length
    let thisSample = availableNotes.value[all]
    console.log('thisSample')
console.log(thisSample)
    activeNotes.value.push(thisSample)
    sequenceData.value.push({
      sample: thisSample,
      steps: createSequenceArraySteps(columns.value),
      url: getSampleFile(apiBaseURL, samplePack.value, sampleData.value[all].file)
    })
    return
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
    setCurrentStepIndex
  }
})
