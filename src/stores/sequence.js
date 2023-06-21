import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import * as Tone from 'tone'
import {
  createSampleObject,
  createSequenceArraySteps,
  createSequenceArrayIndex
} from '@/helpers/toneHelpers.js'

import { getSampleData, getSampleUrl } from '@/composables/getSampleData.js'

const apiBaseURL = import.meta.env.VITE_API_BASE

export const useSequenceStore = defineStore('sequence', () => {
  const isStarted = ref(false)
  async function setStarted() {
    await Tone.start()
    isStarted.value = true
  }
  const currentStepIndex = ref(0)
  function setCurrentStepIndex(i) {
    return (currentStepIndex.value = i)
  }
  const isPlaying = ref(false)
  const bpm = ref(130)
  function moreBPM() {
    bpm.value = bpm.value + 10
  }
  function lessBPM() {
    bpm.value = bpm.value - 10
  }
  const columns = ref(16)
  const availableNotes = ref(['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'A4'])

  const activeNotes = ref(['A3'])
  const availableColors = ref(['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'G3', 'A4'])
  const samplePack = ref('b')
  const sampleTypeList = ref(['Crash', 'Kick', 'Sfx', 'Snare', 'Hi-Hat'])
  // sampleData is array of objects witl sample data. file name, url, type(Crash Hi-hat-Etc)
  const sampleData = ref([])
  // hold the sequence data.sampleNote, sampleURL, steps[false, true], color
  const sequenceDataRef = ref({})

  // activeNotes.value.map((sample) => ({
  //   sample,
  //   steps: createSequenceArraySteps(columns.value),
  //   url: getSampleUrl(apiBaseURL, samplePack.value, sampleData[1].file)
  // }))
  // sets the sample data to sampleData.value
  async function setSampleData() {
    try {
      const data = await getSampleData(apiBaseURL, samplePack.value, 'list')
      return (sampleData.value = data.value)
      // return sampleData.value
    } catch (error) {
      console.log(error)
    }
  }
  // creates sequence data array. based on active notes
  async function setSequenceData() {
    try {
      await setSampleData()
      return (sequenceDataRef.value = activeNotes.value.map((sample) => ({
        sample,
        steps: createSequenceArraySteps(columns.value),
        url: getSampleUrl(apiBaseURL, samplePack.value, sampleData.value[0].file),
        color: 'red'
      })))
    } catch (error) {
      console.log(error)
    }
  }

  setSampleData()
  setSequenceData()
  // adds a sequence to sequenceData array
  const addSequence = () => {
    if (!sequenceDataRef.value) return
    let all = sequenceDataRef.value.length
    let thisSample = availableNotes.value[all]
    let thisColor = availableColors.value[all]
    activeNotes.value.push(thisSample)
    sequenceDataRef.value.push({
      sample: thisSample,
      steps: createSequenceArraySteps(columns.value),
      url: getSampleUrl(apiBaseURL, samplePack.value, sampleData.value[0].file),
      color: thisColor
    })
  }


  //creates a sample object for toneJS to use in sequencer

  // sampleObject.value {
  //   A3: 'https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=crash_1_0_IJ-pont_varen.wav',
  //   B3: 'https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=crash_1_0_IJ-pont_varen.wav'
  // }
  const sampleObject = computed(() => {
    const newObj = {}
    if (sequenceData.value && sequenceData.value && Array.isArray(sequenceData.value)) {
      sequenceData.value.forEach((obj) => {
        if (obj && obj.sample && obj.url) {
          newObj[obj.sample] = obj.url
        }
      })
    }
    return newObj
  })
  
  const sequenceData = computed(() => {
    return sequenceDataRef.value
  })
  function toggleStep(row, step) {
    return (row.steps[step] = !row.steps[step])
  }
  const updateSequenceURL = (index, newValue) => {
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
