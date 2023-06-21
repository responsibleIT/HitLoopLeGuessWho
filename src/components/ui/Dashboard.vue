<script setup></script>

<template>
  <main>
    <div class="sequencer-wrapper">
      <div class="line"></div>
      <div class="line2"></div>
      <div class="line3"></div>
      <div class="sequencer-row">
        <div class="custom-select" style="width: 200px">
          <select>
            <option value="0">Select sound:</option>
            <option value="1">Audi</option>
            <option value="2">BMW</option>
            <option value="3">Citroen</option>
            <option value="4">Ford</option>
            <option value="5">Honda</option>
            <option value="6">Jaguar</option>
            <option value="7">Land Rover</option>
            <option value="8">Mercedes</option>
            <option value="9">Mini</option>
            <option value="10">Nissan</option>
            <option value="11">Toyota</option>
            <option value="12">Volvo</option>
          </select>
        </div>
        <div class="sequencer">
          <div class="sequencer-step selected"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step active"></div>
          <div class="sequencer-step selected"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step selected"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step selected"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
        </div>
      </div>
      <div class="sequencer-row">
        <div class="custom-select" style="width: 200px">
          <select>
            <option value="0">Select sound:</option>
            <option value="1">Audi</option>
            <option value="2">BMW</option>
            <option value="3">Citroen</option>
            <option value="4">Ford</option>
            <option value="5">Honda</option>
            <option value="6">Jaguar</option>
            <option value="7">Land Rover</option>
            <option value="8">Mercedes</option>
            <option value="9">Mini</option>
            <option value="10">Nissan</option>
            <option value="11">Toyota</option>
            <option value="12">Volvo</option>
          </select>
        </div>
        <div class="sequencer">
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step active"></div>
          <div class="sequencer-step selected"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step selected"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
        </div>
      </div>
      <div class="sequencer-row">
        <div class="custom-select" style="width: 200px">
          <select>
            <option value="0">Select sound:</option>
            <option value="1">Audi</option>
            <option value="2">BMW</option>
            <option value="3">Citroen</option>
            <option value="4">Ford</option>
            <option value="5">Honda</option>
            <option value="6">Jaguar</option>
            <option value="7">Land Rover</option>
            <option value="8">Mercedes</option>
            <option value="9">Mini</option>
            <option value="10">Nissan</option>
            <option value="11">Toyota</option>
            <option value="12">Volvo</option>
          </select>
        </div>
        <div class="sequencer">
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step selected"></div>
          <div class="sequencer-step active"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step selected"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step selected"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step"></div>
          <div class="sequencer-step selected"></div>
          <div class="sequencer-step"></div>
        </div>
      </div>
      <div class="sequencer-row">
        <button class="add-btn">
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 7.00002H7M7 7.00002H13M7 7.00002V13M7 7.00002V1.00002"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
    <div class="controls-wrapper">
      <div class="bpm-wrapper">
        <button class="play-btn">
          <img class="play-icon" src="play-icon.svg" alt="play button" />
        </button>
        <input type="number" value="120" />
        <p>BPM</p>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
:root {
  --dark-color: #1b1b1b;
  --light-color: #343434;
  --color-green: #baf35b;
  --color-white: white;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  width: 100%;
  height: 100vh;
  padding: 8px;
  background-color: var(--light-color);
  font-style: inter;
}

main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;

  width: 100%;
  height: 90vh;
  background-color: var(--dark-color);
  border-radius: 8px;
  padding: 8px;

  box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.sequencer-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;

  width: 100%;
  height: 7rem;
  padding: 2rem;
}

.sequencer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}

.controls-wrapper {
  display: flex;
  justify-content: end;
  align-items: center;

  width: 100%;
  height: 7rem;
  background-color: var(--light-color);
  border-radius: 8px;
}

/*the container must be positioned relative:*/
.custom-select {
  position: relative;
  font-family: Arial;
}

.custom-select select {
  display: none; /*hide original SELECT element:*/
}

.select-selected {
  background-color: var(--light-color);
  border-radius: 4px;
}

/*style the arrow inside the select element:*/
.select-selected:after {
  position: absolute;
  content: '';
  top: 14px;
  right: 10px;
  width: 0;
  height: 0;
  border: 6px solid transparent;
  border-color: #fff transparent transparent transparent;
}

/*point the arrow upwards when the select box is open (active):*/
.select-selected.select-arrow-active:after {
  border-color: transparent transparent #fff transparent;
  top: 7px;
}

/*style the items (options), including the selected item:*/
.select-items div,
.select-selected {
  color: #ffffff;
  padding: 8px 16px;
  border: 1px solid transparent;
  border-color: transparent transparent rgba(0, 0, 0, 0.1) transparent;
  cursor: pointer;
  user-select: none;
}

/*style items (options):*/
.select-items {
  position: absolute;
  background-color: var(--light-color);
  top: 100%;
  left: 0;
  right: 0;
  z-index: 99;
}

/*hide the items when the select box is closed:*/
.select-hide {
  display: none;
}

.select-items div:hover,
.same-as-selected {
  background-color: rgba(0, 0, 0, 0.1);
}

.sequencer {
  display: flex;
  gap: 2.3rem;
}

.sequencer-step {
  width: 1rem;
  height: 1rem;
  border-radius: 0.5rem;
  background: rgba(255, 255, 255, 0.12);
}

.sequencer-step.selected {
  background-color: var(--color-green);
  transform: scale(2);
}

.sequencer-step.active {
  background-color: var(--color-white);
}

.add-btn {
  border: none;
  background: var(--light-color);
  color: white;
  height: 37px;
  width: 200px;
  border-radius: 4px;
}

.line {
  position: absolute;
  width: 0px;
  height: 558px;
  left: 509px;
  top: 27px;
  border: 1px dashed var(--light-color);
}

.line2 {
  position: absolute;
  width: 0px;
  height: 558px;
  left: 719px;
  top: 27px;
  border: 1px dashed var(--light-color);
}

.line3 {
  position: absolute;
  width: 0px;
  height: 558px;
  left: 932px;
  top: 27px;
  border: 1px dashed var(--light-color);
}

.hva-logo {
  margin-top: 1.3rem;
  height: 1.7rem;
  margin-left: 2rem;
  opacity: 0.5;
}

.bpm-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background-color: var(--dark-color);
  border-radius: 8px;
  gap: 1rem;
  margin-right: 1rem;
}

.play-btn {
  position: relative;
  border: none;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  background-color: var(--color-green);
}

.play-icon {
  position: absolute;
  width: 2rem;
  left: 9px;
  top: 8px;
}

.bpm-wrapper input {
  background-color: transparent;
  border: none;
  color: var(--color-white);
  width: 3rem;
  font-size: 1.5rem;
  text-align: center;
}

.bpm-wrapper p {
  color: var(--color-white);
}
</style>
