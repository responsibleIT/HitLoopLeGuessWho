
<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import * as Tone from 'tone';
import { useToggle } from '@vueuse/core';
// import style from './step-sequencer.scss';
const props = defineProps({
  playPause: Boolean
})
const columns = ref(16);
const notes = ref(['F4', 'Eb4', 'C4', 'Bb3'])
const rows = ref(4);
const subdivision = ref('8n');
const sequencer = ref(null);
const matrix = ref([]);
const highlighted = ref(-1);
const started = ref(false);
const playing = ref(false);
const bpm = ref(130);


const indexArray = (count) => {
  const indices = ref([]);
  for (let i = 0; i < count; i++) {
    indices.value.push(i);
  }
  return indices.value;
};

// 

const tick = (time, index) => {
  const synth = new Tone.PolySynth(Tone.Synth).toDestination();
const now = Tone.now()


  console.log(now)
  Tone.Draw.schedule(() => {
    if (started.value === true) {
      highlighted.value = index;
    }
  }, time);

  matrix.value[index].forEach((value, row) => {
    // console.log(value)

    // value = true when cell is active 
    if (value) {

      // row = current row that must make a sound, so when its active
      row = rows.value - row - 1;

      //

      console.log(row)
      // idk what this does
      const event = new CustomEvent('trigger', {
        detail: {
          time,
          row,
        },
        composed: true,
      });

      console.log(notes.value[row])


      // make a sound when note is active. 
      synth.triggerAttackRelease(notes.value[row],subdivision.value)
      document.dispatchEvent(event);
    }
  });
};

const updateCell = (column, row) => {
  matrix.value[column][row] = !matrix.value[column][row];
};

const mouseover =  (column, row) => {
  if (event.buttons) {
    updateCell(column, row);
  }
};

const clickCell = (col, row) => {
  if (event) {
    updateCell(col, row);
  }
};


const container = ref(null);
const width = ref(10);
watch(rows, () => {
  console.log(width)
  width.value = container.value.offsetWidth;
  console.log(container.value)
});

const cellWidth = computed(() => {
  console.log(width.value)
  console.log(columns.value)

  return width.value / columns.value
});
console.log(cellWidth.value);
watch(cellWidth, () => {
  container.value.style.height = `${cellWidth.value * rows.value}px`;
});




onMounted(() => {
  sequencer.value = new Tone.Sequence(tick, indexArray(columns.value), subdivision.value).start(0);
  matrix.value = indexArray(columns.value).map(() => {
    return indexArray(rows.value).map(() => false);
  });
  console.log(started.value)
  Tone.Transport.on('start', () => {
    started.value = true
    Tone.getDestination().volume.rampTo(-10, 0.001);
  });
  Tone.Transport.on('stop', () => {
    // highlighted.value = -1;
    console.log(started.value)
    started.value = false;
    console.log(started.value)
  });
});


const togglePlayPause = async (e) => {
  const toggleStarted = useToggle(started);
  const togglePlayPause = useToggle(playing);
  if (!started.value) {
    await Tone.start()
    Tone.getDestination().volume.rampTo(-10, 0.001);
    started.value = true
  }
  if (e && playing.value) {
    await Tone.Transport.start();
    togglePlayPause()
  } else {
    await Tone.Transport.stop();
    togglePlayPause()
  }





}
const togglePlayPauseButton = async (e) => {
  if (e) {
    await Tone.start();
  }

}

const startM = async (e) => {
  if (e) {
    await Tone.Transport.start()
    // Tone.getDestination().volume.rampTo(-10, 0.001);
  }
}

const stopM = async (e) => {
  const now = Tone.now()
  if (e) {
    await Tone.Transport.stop(now)
  }
}



</script>


<template>
<div id="container" ref="container">
  <div v-for="(column, x) in matrix" :key="x" class="column" :class="{ highlighted: x === highlighted }">
    <button v-for="(cell, y) in column" :key="y" @mouseover="mouseover(x, y)"
             @click="clickCell(x,y)" :x="x" :y="y" class="cell" :class="{ filled: cell }">
      <!-- {{ x }} <br/> {{ highlighted }} -->
    </button>
  </div>
</div>
<p>{{ started }} - {{ highlighted }}</p>
<p>{{ matrix }}</p>

<button v-if="!playing" @click="togglePlayPause()">play</button>
<button v-else @click="togglePlayPause()">pause</button>

<button @click="stopM">Stop</button>
<button @click="startM">Start</button>
<button @click="rows+=1">addRow</button>
</template>


<style scoped lang="scss">
#container,
.column {
  gap: 0em;
}


#container {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
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
