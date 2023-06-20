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
  function setStarted() {
    isStarted.value = true
  }
  const currentStepIndex = ref(0)
  function setCurrentStepIndex(i) {
    return (currentStepIndex.value = i)
  }
  const isPlaying = ref(false)
  const bpm = ref(130)
  const columns = ref(16)
  const availableNotes = ref(['A3', 'B3', 'C3', 'D3', 'E3', 'F3', 'G3', 'A4'])
  const availableColors = ref(['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'G3', 'A4'])
  const activeNotes = ref(['A3'])
  const samplePack = ref('b')
  const sampleTypeList = ref(['Crash', 'Kick', 'Sfx', 'Snare', 'Hi-Hat'])
  const sampleData = ref([
    {
      sample: 'A3',
      steps: [false, false, false, false, false, false, false, false, false, false, false, false],
      url: 'https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=crash_1_0_IJ-pont_varen.wav',
      color: 'red'
    }
  ])
  const sequenceData = ref({})

  // activeNotes.value.map((sample) => ({
  //   sample,
  //   steps: createSequenceArraySteps(columns.value),
  //   url: getSampleUrl(apiBaseURL, samplePack.value, sampleData[1].file)
  // }))
  async function setSampleData() {
    try {
      const data = await getSampleData(apiBaseURL, samplePack.value, 'list')
      return (sampleData.value = data.value)
      // return sampleData.value
    } catch (error) {
      console.log(error)
    }
  }

  async function setSequenceData() {
    try {
      await setSampleData();
      return (sequenceData.value = activeNotes.value.map((sample) => ({
        sample,
        steps: createSequenceArraySteps(columns.value),
        url: 'https://api-hitloop.responsible-it.nl/test_samples?sample_pack=b&file=crash_1_0_IJ-pont_varen.wav',
        color: 'red'
      })))
    } catch (error) {
      console.log(error)
    }
  }

  setSampleData()
  setSequenceData()

  const addSequence = () => {
    if (!sequenceData.value) return
    let all = sequenceData.value.length
    let thisSample = availableNotes.value[all]
    let thisColor = availableColors.value[all]
    activeNotes.value.push(thisSample)
    sequenceData.value.push({
      sample: thisSample,
      steps: createSequenceArraySteps(columns.value),
      url: getSampleUrl(apiBaseURL, samplePack.value, sampleData.value[0].file),
      color: thisColor
    })
  }

  // const state = reactive({
  //   bpm: bpm,
  //   isPlaying: isPlaying,
  //   columns: columns
  // })
  const sampleObject = computed(() => {
    const newObj = {}

    if (getSequenceData.value && getSequenceData.value && Array.isArray(getSequenceData.value)) {
      getSequenceData.value.forEach((obj) => {
        if (obj && obj.sample && obj.url) {
          newObj[obj.sample] = obj.url
        }
      })
    }
    return newObj
  })
  const getSequenceData = computed(() => {
    return sequenceData.value
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
