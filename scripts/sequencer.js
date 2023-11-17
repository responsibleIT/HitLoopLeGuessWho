////////////////// Calls to API before window is initialised /////////////////////

const Url = 'https://api-hitloop.responsible-it.nl/';
let sample_list_url;
let sample_url; //sequence in sequencer is JSON and samples are MP3

// Check if the url contains a parameter to select a sample pack
const urlParams = new URLSearchParams(window.location.search);

if (urlParams.has("A")) {
  sample_list_url = Url + 'samples_test_list?sample_pack=a';
  sample_url = Url+'test_samples?sample_pack=a&file=';
}

else if (urlParams.has("B")) {
  sample_list_url = Url + 'samples_test_list?sample_pack=b';
  sample_url = Url+'test_samples?sample_pack=b&file=';
}

else {
  sample_list_url = Url + 'samples_list';
  sample_url = Url+'samples?file=';
}


///////////////// Pipeline for selecting samples /////////////////////////
window.addEventListener('load', function () {

  // Create button variables
  const loopBtn = document.getElementById('loop-btn'); // Loop button 
  const loopMobileBtn = document.getElementById('mobile_play'); // play button to appear at the bottom of the grid on the mobile version

  const cells = document.querySelectorAll('.cell'); // Cell (from the sequencer grid) 
  const cells2 = document.querySelectorAll('.cell2'); // Cell (from the sequencer grid 2) 
  const cells3 = document.querySelectorAll('.cell3'); // Cell (from the sequencer grid3) 

  let tempoInput = document.getElementById('tempo-input'); // Tempo button 

  const table1 = document.getElementById("grid"); // first sequencer grid (on top of the white line)
  const table2 = document.getElementById("grid2"); // second sequencer grid (under the white line)
  const table3 = document.getElementById("grid3"); // third sequencer grid (on top of table1)

  const menuBtn = document.getElementById("menu_btn"); // button to open and close the menu
  const sideMenu = document.getElementById("side-menu"); // side menu
  const closeMenuBtn = this.document.getElementById('close_menu'); // button on the side menu to close it (mobile)

  const genMuBtn = document.getElementById('gen_music_btn'); // Generate music button 
  const genBeatBtn = document.getElementById('gen_beat_btn'); // Generate track 0 button 
  const genChordBtn = document.getElementById('gen_chord_btn');  // Generate track 1 button 
  const genBassBtn = document.getElementById('gen_bass_btn'); // Generate track 2 button 
  const genMeloBtn = document.getElementById('gen_melo_btn'); // Generate track 4 button 

  const ogSample_0 = document.getElementById('og-btn0'); // BUTTON: origin sample track 0  
  const ogSample_1 = document.getElementById('og-btn1'); // BUTTON: origin sample track 1  
  const ogSample_2 = document.getElementById('og-btn2'); // BUTTON: origin sample track 2  
  const ogSample_3 = document.getElementById('og-btn3'); // BUTTON: origin sample track 3  

  const closeSampleBtn_0 = document.getElementById('close-btn-0'); // BUTTON: Close origin sample track 0  
  const closeSampleBtn_1 = document.getElementById('close-btn-1'); // BUTTON: Close origin sample track 1 
  const closeSampleBtn_2 = document.getElementById('close-btn-2'); // BUTTON: Close origin sample track 2 
  const closeSampleBtn_3 = document.getElementById('close-btn-3'); // BUTTON: Close origin sample track 3 

  const ogPopup_0 = this.document.getElementById('og-popup0'); // pop origin sample track 0
  const ogPopup_1 = this.document.getElementById('og-popup1'); // pop origin sample track 1
  const ogPopup_2 = this.document.getElementById('og-popup2'); // pop origin sample track 2
  const ogPopup_3 = this.document.getElementById('og-popup3'); // pop origin sample track 3

  const slowBtn = this.document.getElementById('slow_btn'); // BUTTON: Slow tempo 
  const fastBtn = this.document.getElementById('fast_btn'); // BUTTON: Fast tempo 

  let slowBpm = 80; // Define the value of the slow tempo button
  let fastBpm = 300; // Define the value of the fast tempo button

  const genStart = document.getElementById('gen_start'); // BUTTON: Generate music at start  
  const scratchStart = document.getElementById('scratch_start'); // BUTTON: Start music from scratch at start 

  const howGenButn = document.getElementById('how-gen-btn'); // BUTTON: Open te popup explaining how this piece was generated

  const popupStart = document.getElementById('popup'); // POPUP: window at the launch of the app
  const popupHow = document.getElementById('how-popup'); // POPUP: 

  const totalRow = 4; // Total amount of rows in the sequencer

  const closeHowBtn = document.getElementById('close-how-btn'); // BUTTON:



  // Create a variable to store the sampler relevant values for each of the tracks
  let selectedValue0; // track 0 sample selection
  let selectedValue1; // track 1 sample selection
  let selectedValue2; // track 2 sample selection
  let selectedValue3; // track 3 sample selection

  let isLoopPlaying = false; // boolean variable to state if the loop is playing or not. Initialised on false
  const numRows = 4; // number of rows
  const numCols = 16; // number of columns

  let col = 0; // Initialize the column index
  let intervalId; // Initialize the intervalId

  let tableReset1 = ""; // Value of where table1 should go back when the loop is stopped
  let tableReset2 = ""; // Value of where table2 should go back when the loop is stopped
  let tableReset3 = ""; // Value of where table3 should go back when the loop is stopped

  let gridHeight = 960; // Height in pixels of each grid (to use to calculate the speed of the grids descending)
  let speedLoop = 0; // Speed value of the grids descending
  let animation = ""; // String value to store the full animation before passing it to CSS (optional)
  let animStyle = ""; // String value to store which animation is used according to the size of the screen

  // Create a variable to store the sampler and audio for Tone.js
  let sampler;
  let audio;


  menuBtn.addEventListener('click', function() {
    // sideMenu.style.display = "none";
    if (sideMenu.classList == 'popup_hidden') {
      sideMenu.classList.replace('popup_hidden', 'side-menu'); // hide the popup
    }

    else if (sideMenu.classList == 'side-menu') {
      sideMenu.classList.replace('side-menu', 'popup_hidden'); // hide the popup
    }
  });

  // Function to update the sampler with a new sample
  function updateSampler(selectedValue, sampleURL) {
    sampler.releaseAll(); // Remove the existing sample
    sampler.add(selectedValue, sampleURL);  // Add the new sample
  }

  // If the popup button to start with a generated button is selected
  genStart.addEventListener('click', function() {
    popupStart.classList.replace('popup_start', 'popup_hidden'); // hide the popup
    genMuBtn.classList.remove('hidden-button');
    initialSequence(); // generate the initial sequence
  });

  closeMenuBtn.addEventListener('click', function() {
    sideMenu.classList.replace('side-menu', 'popup_hidden'); // hide the popup
  })

    // If the popup button to start from scratch is selected
  scratchStart.addEventListener('click', function() {
    popupStart.classList.replace('popup_start', 'popup_hidden'); // hide the popup (Grid starts empty)
    genMuBtn.classList.remove('hidden-button');
  });

  slowBtn.addEventListener('click', function() {
    tempoInput.value = slowBpm;
    columnTime = (60 / slowBpm) * 1000;
  })

  fastBtn.addEventListener('click', function() {
    tempoInput.value = fastBpm;
    columnTime = (60 / fastBpm) * 1000;
  })

  ////////////////  Create selection pipelines for each column (0-4)  ////////////////

  // Create the selection for column 0 (Track 1)
  const sampleSelect_col0 = document.getElementById('sampleselect_col0');

  fetch(sample_list_url)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      const samples = data.files;

      // Add empty option at start
      const option = document.createElement('option');
      option.value = '';
      option.textContent = '';
      sampleSelect_col0.appendChild(option);

      // Create new option for each sample
      samples.forEach(sample => {
        const option = document.createElement('option');
        option.value = sample;
        option.textContent = sample;
        sampleSelect_col0.appendChild(option);
      });
    
      // Select a random sample after all samples have been loaded
      const randomIndex = Math.floor(Math.random() * samples.length);
      const randomSample = samples[randomIndex];
      sampleSelect_col0.value = randomSample;
      selectedValue0 = randomSample;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });


  // Add an event listener to the select element to detect changes
  sampleSelect_col0.addEventListener('change', (event) => {
    selectedValue0 = event.target.value; // Update the selectedValue variable with the new value and play this audio
    audio = new Audio(sample_url + selectedValue0);
    audio.play();   // Play the audio

    let newSampleURL = sample_url + selectedValue0; // Update the sampler with the new sample
    updateSampler("G2", newSampleURL);
  });



  // Create the selection for column 1 (Track 2)
  const sampleSelect_col1 = document.getElementById('sampleselect_col1');

  fetch(sample_list_url)
    .then(response => response.json())
    .then(data => {
      const samples = data.files;
      const option = document.createElement('option');  // Add empty option at start
      option.value = '';
      option.textContent = '';
      sampleSelect_col1.appendChild(option);
      
      samples.forEach(sample => {  // Create new option for each sample
        const option = document.createElement('option');
        option.value = sample;
        option.textContent = sample;
        sampleSelect_col1.appendChild(option);
      });
      
      const randomIndex = Math.floor(Math.random() * samples.length);  // Select a random sample after all samples have been loaded
      const randomSample = samples[randomIndex];
      sampleSelect_col1.value = randomSample;
      selectedValue1 = randomSample;
    })

    .catch(error => {
      console.error('Error fetching data:', error);
    });

  // Add an event listener to the select element to detect changes
  sampleSelect_col1.addEventListener('change', (event) => {
    selectedValue1 = event.target.value; // Update the selectedValue variable with the new value
    audio = new Audio(sample_url + selectedValue1);
    audio.play();  // Play the audio
    let newSampleURL = sample_url + selectedValue1;
    updateSampler("F2", newSampleURL);

  });



  // Create the selection for column 2 (Track 3)
  const sampleSelect_col2 = document.getElementById('sampleselect_col2');
  fetch(sample_list_url)
    .then(response => response.json())
    .then(data => {
      const samples = data.files;
      const option = document.createElement('option');   // Add empty option at start
      option.value = '';
      option.textContent = '';
      sampleSelect_col2.appendChild(option);
      
      samples.forEach(sample => {  // Create new option for each sample
        const option = document.createElement('option');
        option.value = sample;
        option.textContent = sample;
        sampleSelect_col2.appendChild(option);
      });
      
      const randomIndex = Math.floor(Math.random() * samples.length);   // Select a random sample after all samples have been loaded
      const randomSample = samples[randomIndex];
      sampleSelect_col2.value = randomSample;
      selectedValue2 = randomSample;
    })

    .catch(error => {
      console.error('Error fetching data:', error);
    });

  // Add an event listener to the select element to detect changes
  sampleSelect_col2.addEventListener('change', (event) => {
    // Update the selectedValue variable with the new value
    selectedValue2 = event.target.value;
    audio = new Audio(sample_url + selectedValue2);
    // Play the audio
    audio.play();
    let newSampleURL = sample_url + selectedValue2;
    updateSampler("E2", newSampleURL);
  });


  // Create the selection for column 3 (Track 4)
  const sampleSelect_col3 = document.getElementById('sampleselect_col3');

  fetch(sample_list_url)
    .then(response => response.json())
    .then(data => {
      const samples = data.files;
      const option = document.createElement('option'); // Add empty option at start
      option.value = '';
      option.textContent = '';
      sampleSelect_col3.appendChild(option);
      
      samples.forEach(sample => {  // Create new option for each sample
        const option = document.createElement('option');
        option.value = sample;
        option.textContent = sample;
        sampleSelect_col3.appendChild(option);
      });
      
      const randomIndex = Math.floor(Math.random() * samples.length);  // Select a random sample after all samples have been loaded
      const randomSample = samples[randomIndex];
      sampleSelect_col3.value = randomSample;
      selectedValue3 = randomSample;
    })

    .catch(error => {
      console.error('Error fetching data:', error);
    });



  // Add an event listener to the select element to detect changes
  sampleSelect_col3.addEventListener('change', (event) => {
    selectedValue3 = event.target.value; // Update the selectedValue variable with the new value

    audio = new Audio(sample_url + selectedValue3);
    audio.play(); // Play the audio

    let newSampleURL = sample_url + selectedValue3;
    updateSampler("D2", newSampleURL);
  });


/////////////   /////////////   /////////////    SEQUENCER PIPELINE    /////////////   /////////////   /////////////   

  const notes = ['G2', 'F2', 'E2', 'D2']; // Notes corresponded to each Column of the grid: 128 official notes in tone.js
  const noteLength = '8n';// Decides how long a note can take

  let seed = Math.floor(Math.random() * 10);  // Sets the seed to 1,2,3 (random beat set for the first 3 tracks)
  columnTime = (60 / parseFloat(document.getElementById('tempo-input').value)) * 1000;// Uses input BPM to calculate wait-time between columns


  // determines the tempo
  tempoInput.addEventListener('input', function () {
    let bpm = parseFloat(tempoInput.value);
    columnTime = (60 / bpm) * 1000;
  });


/////////////   /////////////   /////////////     SEQUENCER INTIALIZATION    /////////////   /////////////   /////////////   

  function initialSequence () {
          // Initialize the MIDI data from sequencer_json [Data coming from the AIs]
    let fetchUrl = ' '

    if (urlParams.has("A")) {
      fetchUrl = Url + 'sequencer_random_json' + '?seed=' + seed;
    }
    else {
        fetchUrl = Url + 'sequencer_json' + '?seed=' + seed;
    }

    fetch(fetchUrl)
      .then(response => response.json())
      .then(data => {
        // 'data' is the 2D array of grid values returned by the API
        for (let i = 0; i < data.length; i++) {
          for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] == 1.0) {
              document.querySelector(`.cell[data-row="${j}"][data-col="${i}"]`).classList.add('on'); // Cell is ON
              document.querySelector(`.cell2[data-row="${j}"][data-col="${i}"]`).classList.add('on'); // Cell is ON
              document.querySelector(`.cell3[data-row="${j}"][data-col="${i}"]`).classList.add('on'); // Cell is ON
            } 
          }
        }
      });
    generateRandomTrack(3); // generate for the tracks after
  }

  function generateMusic() {
    let seed = Math.floor(Math.random()*1000);
    let fetchUrl = ' ';
    if (urlParams.has("A")) {
      fetchUrl = Url + 'sequencer_random_json' + '?seed=' + seed;
    }
    else {
      fetchUrl = Url + 'sequencer_json' + '?seed=' + seed;
    }

    fetch(fetchUrl)
      .then(response => response.json())
      .then(data => {
        for (let i = 0; i < data.length; i++) { // 'data' is the 2D array of grid values returned by the API
          for (let j = 0; j < data[i].length; j++) {
            if (data[i][j] == 1.0) {
              document.querySelector(`.cell[data-row="${j}"][data-col="${i}"]`).classList.add('on'); // Cell is ON
              document.querySelector(`.cell2[data-row="${j}"][data-col="${i}"]`).classList.add('on'); // Cell is ON
              document.querySelector(`.cell3[data-row="${j}"][data-col="${i}"]`).classList.add('on'); // Cell is ON
            } 
          }
        }
      });
      generateRandomTrack(3);
  }

  function generateTrack(dataRow) {
    let seed = Math.floor(Math.random() * 10);  
    let fetchUrl = ' ';

    if (urlParams.has("A")) {
      fetchUrl = Url + 'sequencer_random_json' + '?seed=' + seed;
    }
    else {
        fetchUrl = Url + 'sequencer_json' + '?seed=' + seed;
    }
  

    fetch(fetchUrl)
      .then(response => response.json())
      .then(data => {
        // 'data' is the 2D array of grid values returned by the API
        for (let i = 0; i < data.length; i++) {
          if (data[i][dataRow] == 1.0) {
            // Cell is ON
            document.querySelector(`.cell[data-row="${dataRow}"][data-col="${i}"]`).classList.add('on');
            document.querySelector(`.cell2[data-row="${dataRow}"][data-col="${i}"]`).classList.add('on'); // Cell is ON
            document.querySelector(`.cell3[data-row="${dataRow}"][data-col="${i}"]`).classList.add('on'); // Cell is ON
          } 
        }
      });
  }

  function generateRandomTrack(dataRow) {
    let seed = Math.floor(Math.random() * 10);  
    let fetchUrl = ' ';
    fetchUrl = Url + 'sequencer_random_json' + '?seed=' + seed;
  
    fetch(fetchUrl)
      .then(response => response.json())
      .then(data => {
        // 'data' is the 2D array of grid values returned by the API
        for (let i = 0; i < data.length; i++) {
          if (data[i][dataRow] == 1.0) {
            document.querySelector(`.cell[data-row="${dataRow}"][data-col="${i}"]`).classList.add('on'); // Cell is ON
            document.querySelector(`.cell2[data-row="${dataRow}"][data-col="${i}"]`).classList.add('on'); // Cell is ON
            document.querySelector(`.cell3[data-row="${dataRow}"][data-col="${i}"]`).classList.add('on'); // Cell is ON
          } 
        }  
      });
  }
  
  // Define function to turn cell on/off
  function toggleCell(event, cell) {
    let row = Number(cell.attributes['data-row'].value);
    let col = Number(cell.attributes['data-col'].value);

    const cell1 = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
    const cell2 = document.querySelector(`.cell2[data-row="${row}"][data-col="${col}"]`);
    const cell3 = document.querySelector(`.cell3[data-row="${row}"][data-col="${col}"]`);

    // Sequencer grid 1
    if (cell1.classList.contains('on')) {
      cell1.classList.remove('on');
    } 
    else {
      cell1.classList.add('on');
    }
    // Sequencer grid 2
    if (cell2.classList.contains('on')) {
      cell2.classList.remove('on');
    } 
    else {
      cell2.classList.add('on');
    }
    // Sequencer grid 3
    if (cell3.classList.contains('on')) {
      cell3.classList.remove('on');
    } 
    else {
      cell3.classList.add('on');
    }
  }

/////////////   /////////////   /////////////   GENERATE FUNCTIONS    /////////////   /////////////   /////////////   

  genMuBtn.addEventListener('click', function () { // Call the generate functionality for the whole music
    generateMusic();
  });
  genBeatBtn.addEventListener('click', function () { // Call the generate functionality for the beat track
    generateTrack(0);
  });
  genChordBtn.addEventListener('click', function () { // Call the generate functionality for the beat track
    generateTrack(1);
  });
  genBassBtn.addEventListener('click', function () { // Call the generate functionality for the beat track
    generateTrack(2);
  });
  genMeloBtn.addEventListener('click', function () { // Call the generate functionality for the beat track
    generateRandomTrack(3);
  });

/////////////   /////////////   /////////////   PLAY STEP   /////////////   /////////////   /////////////   

  function playStep(col) {
    const playedNotes = {}; 
    const headerElements = document.querySelectorAll('.cell-header'); // Remove 'current' class from all header elements

    headerElements.forEach((header) => {
      header.classList.remove('current');
    });
    
    const currentHeader = document.querySelector(`.cell-header[data-col="${col}"]`); // Set the 'current' class for the header element corresponding to the given column

    if (currentHeader) {
      currentHeader.classList.add('current');
    }

    for (let row = 0; row < numRows; row++) {
      const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

      if (cell && cell.classList.contains('on')) {
        const note = notes[row];
        if (!playedNotes[note]) {
          sampler.triggerAttackRelease(note, noteLength);
          playedNotes[note] = true;
        }
      }
    }
  }

/////////////   /////////////   /////////////   MUSICAL LOOP  /////////////   /////////////   /////////////   

/* Play loop function: Activated when the user presses on the play (loop) button.
no param */
function playLoop() {
  intervalId = setInterval(function() {
    if (isLoopPlaying) { // Check if isLoopPlaying is true
      playStep(col);
    
      // For wide screens
      if (window.screen.width > 950) {
        loopPosition = "-1577px";
        // gridHeight = 960;
        animStyle = "looping ";

        tableReset1 = "-603px";
        tableReset2 = "341px";
        tableReset3 = "-1547px";
      }

      // For smaller screens
      if (window.screen.width < 950) {
        loopPosition = "-1627px";
        // gridHeight = 960;
        animStyle = "loopingSmall ";

        tableReset1 = "-631px";
        tableReset2 = "368px";
        tableReset3 = "-1629px";
      }

      speedLoop = (gridHeight) / tempoInput.value;

      /////////////   /////////////   /////////////   MOVE THE LOOP  /////////////   /////////////   /////////////   

      animation = animStyle + speedLoop + "s linear infinite";
      table1.style.animation = animation;
      table2.style.animation = animation;
      table3.style.animation = animation;


      let previousCol = 1; // variable to store the index of the previous column
      if (col == 0) { // if we are currently playing the first column (index 0), the previous column is the last one (index : total amount of coloums - 1)
        previousCol = numCols-1;
      }
      if (col > 0) { // if we are currently playing any other column
        previousCol = col-1; // Holds the indicator of the cell right before the one currently played
      }

      // for every row in the sequence
      for (row = 0; row < totalRow; row++) {  
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`); // define the current cell that is currently played
        const previousCell = document.querySelector(`.cell[data-row="${row}"][data-col="${(previousCol)}"]`); // define the cell right before the one that is currently played

        const cell2 = document.querySelector(`.cell2[data-row="${row}"][data-col="${col}"]`); // define the current cell that is currently played (for the second grid)
        const previousCell2 = document.querySelector(`.cell2[data-row="${row}"][data-col="${(previousCol)}"]`); // define the cell right before the one that is currently played

        const cell3 = document.querySelector(`.cell3[data-row="${row}"][data-col="${col}"]`); // define the current cell that is currently played (for the third grid)
        const previousCell3 = document.querySelector(`.cell3[data-row="${row}"][data-col="${(previousCol)}"]`); // define the cell right before the one that is currently played

        if (cell.classList.contains('on')) { // if the current cell played is "on", change it to "playing" (white) [GRID 1]
          cell.classList.remove('on');
          cell.classList.add('playing'); 
        }
        if (previousCell.classList.contains('playing')) { // if the cell right before the one currently played is "playing" (white) give it back its original "on" colour [GRID 1]
          previousCell.classList.remove('playing');
          previousCell.classList.add('on'); 
        }

        if (cell2.classList.contains('on')) { // if the current cell played is "on", change it to "playing" (white) [GRID 2]
          cell2.classList.remove('on');
          cell2.classList.add('playing'); 
        }
        if (previousCell2.classList.contains('playing')) { // if the cell right before the one currently played is "playing" (white) give it back its original "on" colour [GRID 2]
          previousCell2.classList.remove('playing');
          previousCell2.classList.add('on'); 
        }

        if (cell3.classList.contains('on')) { // if the current cell played is "on", change it to "playing" (white) [GRID 2]
          cell3.classList.remove('on');
          cell3.classList.add('playing'); 
        }
        if (previousCell3.classList.contains('playing')) { // if the cell right before the one currently played is "playing" (white) give it back its original "on" colour [GRID 3]
          previousCell3.classList.remove('playing');
          previousCell3.classList.add('on'); 
        }
      }

      col++; // Increment the column count
      if (col === numCols) { // if the column count is at the end of the grid (total amount of columns) reset it to 0
        col = 0; 
      }
    }  
  }, columnTime);

  // Set the loopEnd to repeat indefinitely
  Tone.Transport.loopEnd = numCols - 1;
  Tone.Transport.start();
  Tone.Transport.loop = true;
}
  
  loopBtn.addEventListener('click', function () {
    if (loopBtn.classList.contains('btn-med')) {
      loopBtn.classList.remove('btn-med');
      loopBtn.classList.add('btn-pos');
      loopBtn.textContent = 'Play';

      table1.style.top = "50%";
      table1.style.animation = "";
      table1.style.marginTop = tableReset1;

      table2.style.top = "50%";
      table2.style.animation = "";
      table2.style.marginTop = tableReset2;

      table3.style.top = "50%";
      table3.style.animation = "";
      table3.style.marginTop = tableReset3;

      isLoopPlaying = false;
      Tone.Transport.stop();
      removePlayingClass(numRows, numCols);

      clearInterval(intervalId); // clear the time interval
      col = 0;
    }

    else if (loopBtn.classList.contains('btn-pos')) {
      if (sampler === undefined) {
        sampler = new Tone.Sampler({
          urls: { //urls to the sample that are associated with the musical notes D2, E2, F2, G2 with Tone.JS. Each note represents a track in the sequencer
            D2: sample_url +selectedValue3,
            E2: sample_url +selectedValue2,
            F2: sample_url +selectedValue1,
            G2: sample_url +selectedValue0,
          },
          onload: () => {
            console.log("Sampler loaded");
          }
        }).toDestination();
      } 
  
      else {
        // Update the sampler
        sampler.dispose();
        sampler = new Tone.Sampler({
          urls: { //urls to the sample that are associated with the musical notes D2, E2, F2, G2 with Tone.JS. Each note represents a track in the sequencer
                  D2: sample_url +selectedValue3,
                  E2: sample_url +selectedValue2,
                  F2: sample_url +selectedValue1,
                  G2: sample_url +selectedValue0,
                },
                onload: () => {
                              console.log("Sampler loaded");
                }
        }).toDestination();
      }
      loopBtn.classList.remove('btn-pos');
      loopBtn.classList.add('btn-med');
      loopBtn.textContent = 'Stop';
  
      Tone.start();
      isLoopPlaying = true;

      playLoop();
    }  
  });
  
  /* Function for when the user manually clicks on a cell in the sequencer to turn it on or off
  
  @param {Number} numRows: total amount of rows in a sequencer
  @param {Number} numCols: total amount of columns in a sequencer
  @return {void}*/
  function turnCellOn(cells) {
    cells.forEach(function (cell) {
      cell.addEventListener('click', function (event) {
        // console.log("This is the cell clicked : ", cell);
        toggleCell(event, cell);
      });
    });
  }

  turnCellOn(cells);
  turnCellOn(cells2);
  turnCellOn(cells3);

  /* Function for clearing all cells from the sequencer
  
  @param {Number} numRows: total amount of rows in a sequencer
  @param {Number} numCols: total amount of columns in a sequencer
  @return {void}*/
  function removeOnClass(numRows, numCols) {
    for (let row = 0; row <= numRows; row++) {
      for (let col = 0; col <= numCols; col++) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        const cell2 = document.querySelector(`.cell2[data-row="${row}"][data-col="${col}"]`);
        const cell3 = document.querySelector(`.cell3[data-row="${row}"][data-col="${col}"]`);

        if ((cell.classList.contains('on')) || (cell.classList.contains('playing'))) {
          cell.classList.remove('on');
          cell.classList.remove('playing');
        }
        if ((cell2.classList.contains('on')) || (cell2.classList.contains('playing'))) {
          cell2.classList.remove('on');
          cell2.classList.remove('playing');
        }
        if ((cell3.classList.contains('on')) || (cell3.classList.contains('playing'))) {
          cell3.classList.remove('on');
          cell3.classList.remove('playing');
        }
      }
    }
  }
  /* Function to remove the 'playing' attribute of all cells that have it active

  param numRows: total amount of rows in a sequencer
  param numCols: total amount of columns in a sequencer
  return: none */
  function removePlayingClass(numRows, numCols) {
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        const cell2 = document.querySelector(`.cell2[data-row="${row}"][data-col="${col}"]`);
        const cell3 = document.querySelector(`.cell3[data-row="${row}"][data-col="${col}"]`);

        if (cell.classList.contains('playing')) {
          cell.classList.remove('playing');
          cell.classList.add('on');
        }
        if (cell2.classList.contains('playing')) {
          cell2.classList.remove('playing');
          cell2.classList.add('on');
        }
        if (cell3.classList.contains('playing')) {
          cell3.classList.remove('playing');
          cell3.classList.add('on');
        }
      }
    }
  }

  /* Function to remove all the cells that are turned 'ON' on one row

  param idRow: the row where "ON" cells are going to be removed
  param numCols: amount of columns - usually same amount for each row
  return: none */
  function removeOnClassRow(idRow, numCols) {
    for (let col = 0; col <= numCols; col++) {
      const cell = document.querySelector(`.cell[data-row="${idRow}"][data-col="${col}"]`);
      const cell2 = document.querySelector(`.cell2[data-row="${idRow}"][data-col="${col}"]`);
      const cell3 = document.querySelector(`.cell3[data-row="${idRow}"][data-col="${col}"]`);

      if (cell.classList.contains('on')) {
        cell.classList.remove('on');
      }
      if (cell2.classList.contains('on')) {
        cell2.classList.remove('on');
      }
      if (cell3.classList.contains('on')) {
        cell3.classList.remove('on');
      }
    }
  }
  
  ///////////////// POPUPS EVENTS  ///////////////// 
  
  howGenButn.addEventListener('click', function() {  // Make a popup appear to show how the composition was generated
    popupHow.classList.remove('popup_hidden');
    popupHow.classList.add('popup');
  });
  closeHowBtn.addEventListener('click', function() { 
    popupHow.classList.remove('popup');
    popupHow.classList.add('popup_hidden');
  });

  /////////////////   OPEN SAMPLE ORIGIN POPUP WINDOWS  ///////////////// 

  function popupSample(button, popup, action) {
    if (action == 1) {
      button.addEventListener('click', function() { // Show popup window about the sample origin of track 1 (index 0)
        popup.classList.replace('popup_hidden', 'popup');
      });
    }
    else {
      button.addEventListener('click', function() { // Show popup window about the sample origin of track 1 (index 0)
        popup.classList.replace('popup', 'popup_hidden');
      });
    }

  }

  popupSample(ogSample_0, ogPopup_0, 1);
  popupSample(ogSample_1, ogPopup_1, 1);
  popupSample(ogSample_2, ogPopup_2, 1);
  popupSample(ogSample_3, ogPopup_3, 1);

  popupSample(closeSampleBtn_0, ogPopup_0, 0);
  popupSample(closeSampleBtn_1, ogPopup_1, 0);
  popupSample(closeSampleBtn_2, ogPopup_2, 0);
  popupSample(closeSampleBtn_3, ogPopup_3, 0);


  /////////////////   CLEAN CELLS  ///////////////// 

  clear_sequencer.addEventListener('click', function() {  //clear the whole sequence grid when the clear button is pressed
	  removeOnClass(4, 15);
  });
  genMuBtn.addEventListener('click', function() {  // clear the whole sequence grid when the generate music button is pressed
	  removeOnClass(4, 15);
  });

  /////////////////   CLEAN CELLS BY ROW   ///////////////// 

  function genTrackOnClick(track, row) {
    track.addEventListener('click', function() {  // clear the first row of the sequence grid when the generate beat button is pressed
      removeOnClassRow(row, 15);
    });
  }

  genTrackOnClick(genBeatBtn, 0);
  genTrackOnClick(genChordBtn, 1);
  genTrackOnClick(genBassBtn, 2);
  genTrackOnClick(genMeloBtn, 3);

});