<template>
  <div id="sequencer">
  <div v-for="sample in samples" :key="sample">
  <div 
          v-for="step in 16" :key="step"
          class="step"
          :class="{ 'active': sequenceData[sample][step] }"
          @click="toggleStep(sample, step)"
  ></div>
  </div>
  </div>
  <button @click="togglePlay">{{ isPlaying ? 'Pause' : 'Play' }}</button>
  </template>
  
   
  
  <script setup>
  import { ref, reactive } from 'vue';
  import * as Tone from 'tone';
  
  const notes = ref(['G2', 'F2', 'E2', 'D2', 'C2'])
  
  const samples = ['G2', 'F2', 'E2', 'D2'];
  
   

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


  
  const sampler = new Tone.Sampler({
    'G2': URL1,
    'F2': URL2,
    'E2': URL3,
    'D2': URL4,
  }).toDestination();
  
   
  console.log( Array(16).fill(false))
  const sequenceData = reactive({
    'G2': Array(16).fill(false),
    'F2': Array(16).fill(false),
    'E2': Array(16).fill(false),
    'D2': Array(16).fill(false),
  });
  
   
  
  let isPlaying = ref(false);
  
   
  
  const sequence = new Tone.Sequence((time, col) => {
    for (const sample of samples) {
      if (sequenceData[sample][col]) {
        sampler.triggerAttack(sample, time);
      }
    }
  }, Array.from({ length: 16 }, (_, i) => i), '16n');
  
   
  
  Tone.Transport.bpm.value = 120;
  
   
  
  function toggleStep(sample, step) {
    sequenceData[sample][step] = !sequenceData[sample][step];
  }
  
   
  
  function togglePlay() {
    isPlaying.value = !isPlaying.value;
  
   
  
    if (isPlaying.value) {
      Tone.Transport.start();
      sequence.start();
    } else {
      Tone.Transport.stop();
      sequence.stop();
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