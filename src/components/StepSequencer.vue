
<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import * as Tone from 'tone';
import { useToggle } from '@vueuse/core';
// import style from './step-sequencer.scss';
const props = defineProps({
  playPause: Boolean
})
const columns = ref(16);
const rows = ref(4);
const subdivision = ref('8n');
const sequencer = ref(null);
const matrix = ref([]);
const highlighted = ref(-1);
const started = ref(false);

const indexArray = (count) => {
  const indices = ref([]);
  for (let i = 0; i < count; i++) {
    indices.value.push(i);
  }
  return indices.value;
};

// 

const tick = (time, index) => {
  console.log('time')
  console.log('index')
  console.log(time)
  console.log(index)
  Tone.Draw.schedule(() => {
    if (started.value === true) {
      highlighted.value = index;
      console.log(index)
    }
  }, time);
  matrix.value[index].forEach((value, row) => {
    if (value) {
      console.log(value)
      console.log(row)
      row = rows.value - row - 1;
      console.log(row)
      const event = new CustomEvent('trigger', {
        detail: {
          time,
          row,
        },
        composed: true,
      });
      document.dispatchEvent(event);
    }
  });
};

const updateCell = (column, row) => {
  matrix.value[column][row] = !matrix.value[column][row];
};

const mouseover = (column, row) => {
  if (event.buttons) {
    updateCell(column, row);
  }
};

const container = ref(null);
const width = ref(10);
watch(rows, () => {
  console.log(width)
  width.value = container.value.offsetWidth;
  console.log(container.value)
});

const cellWidth = computed(() => width.value / columns.value);
console.log(cellWidth.value)
watch(cellWidth, () => {
  container.value.style.height = `${cellWidth.value * rows.value}px`;
});

onMounted(() => {
  sequencer.value = new Tone.Sequence(tick, indexArray(columns.value), subdivision.value).start(0);
  matrix.value = indexArray(columns.value).map(() => {
    return indexArray(rows.value).map(() => false);
  });

  console.log(started.value)
  Tone.Transport.on('start', () => (started.value = true));
  Tone.Transport.on('stop', () => {
    highlighted.value = -1;
    console.log(started.value)
    started.value = false;
    console.log(started.value)
  });
});


const togglePlayPause = async (e) => {
  console.log(started.value)
  const togglePlayState = useToggle(started);
  togglePlayState()
  if (e) {
    await Tone.start()
  }
  if (started.value === true) {
    await Tone.Transport.start()

  } else {
    await Tone.start()
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
  }
}

const stopM = async (e) => {
  if (e) {
    await Tone.Transport.stop()
  }
}



</script>


<template>
<div id="container" ref="container">
  <div v-for="(column, x) in matrix" :key="x" class="column" :class="{ highlighted: x === highlighted }">
    <button v-for="(cell, y) in column" :key="y" @mouseover="mouseover(x, y)"
            @mousedown="mouseover(x, y)" class="cell" :class="{ filled: cell }">
      {{ x }} <br/> {{ highlighted }}
    </button>
  </div>

</div>
<p>{{ started }} - {{ highlighted }}</p>
<p>{{ matrix }}</p>
<button @click="stopM">Stop</button>
<button @click="startM">Start</button>
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
