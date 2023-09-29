//////////////////Calls to API before window is initialised/////////////////////
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


///////////////// Pipeline for selecting samples/////////////////////////
window.addEventListener('load', function () {

  // Create button variables
  const loopBtn = document.getElementById('loop-btn'); // Loop button 
  const cells = document.querySelectorAll('.cell'); // Cell (from the sequencer grid) 
  const tonebtn = document.getElementById('tone-btn'); // Tone button 
  const clearbtn = document.getElementById('clear_sequencer'); // Clear sequencer grid button 
  const tempoInput = document.getElementById('tempo-input'); // Tempo button 

  const genMuBtn = document.getElementById('gen_music_btn'); // Generate music button 

  const genBeatBtn = document.getElementById('gen_beat_btn'); // Generate music button 
  const genChordBtn = document.getElementById('gen_chord_btn'); // Generate music button 
  const genBassBtn = document.getElementById('gen_bass_btn'); // Generate music button 
  const genMeloBtn = document.getElementById('gen_melo_btn'); // Generate music button 

  const genStart = document.getElementById('gen_start'); // Generate music at start button 
  const scratchStart = document.getElementById('scratch_start'); // Start music from scratch at start button 

  const howGenButn = document.getElementById('how-gen-btn');

  const popupStart = document.getElementById('popup'); // Popup window at the launch of the app
  const popupHow = document.getElementById('how-popup');

  const totalRow = 4; // Total amount of rows in the sequencer

  const closeBtn = document.getElementById('close-btn');

  // Create a variable to store the sampler relevant values for each of the tracks
  let selectedValue0; // track 1
  let selectedValue1; // track 2
  let selectedValue2; // track 3
  let selectedValue3; // track 4


  // Create a variable to store the sampler and audio
  let sampler;
  let audio;


  // Function to update the sampler with a new sample
  function updateSampler(selectedValue, sampleURL) {
    sampler.releaseAll(); // Remove the existing sample
    sampler.add(selectedValue, sampleURL);  // Add the new sample
  }

  // If the popup button to start with a generated button is selected
  genStart.addEventListener('click', function() {
    popupStart.classList.replace('popup', 'popup_hidden'); // hide the popup
    initialSequence(); // generate the initial sequence
  });

    // If the popup button to start from scratch is selected
  scratchStart.addEventListener('click', function() {
    popupStart.classList.replace('popup', 'popup_hidden'); // hide the popup (Grid starts empty)
  });



  ////////////////  Create selection pipelines for each column (0-4)  ////////////////

  // Create the selection for column 0 (Track 1)
  const sampleSelect_col0 = document.getElementById('sampleselect_col0');

  fetch(sample_list_url)
    .then(response => response.json())
    .then(data => {
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
    console.log(selectedValue0);

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
    // console.log(selectedValue1);
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
    console.log(selectedValue2);
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

    console.log(selectedValue3);
    let newSampleURL = sample_url + selectedValue3;
    updateSampler("D2", newSampleURL);
  });



  // Initialize the sampler when tonebtn is pressed //
  tonebtn.addEventListener('click', function () {
    if (sampler === undefined) {
      sampler = new Tone.Sampler({
        urls: {
          D2: sample_url +selectedValue3,
          E2: sample_url +selectedValue2,
          F2: sample_url +selectedValue1,
          G2: sample_url +selectedValue0,
        },
        onload: () => {
          console.log("Sampler loaded");
        }
      }).toDestination();

    // change the tonebtn text to 'update samples'
    tonebtn.classList.add('hidden-button');

    loopBtn.classList.remove('hidden-button');
    loopBtn.classList.add('btn-pos');
    
    clearbtn.classList.remove('hidden-button');
    clearbtn.classList.add('btn-neg');
    } 

    else {
      // Update the sampler
      sampler.dispose();
      sampler = new Tone.Sampler({
        urls: {
                // C2: sample_url +selectedValue4,
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
  });




  /////////////////////// SEQUENCER PIPELINE //////////////////////////////
    let isLoopPlaying = false; // boolean variable to state if the loop is playing or not. Initialised on false

    const numRows = 4; // number of rows
    const numCols = 16; // number of columns

    let col = 0; // Initialize the column index
    let colPrevious = 0;
    let intervalId; // Initialize the intervalId
    let firstRoundDone = false;

    // Notes corresponded to each Column of the grid
    const notes = ['G2', 'F2', 'E2', 'D2']; // 128 official notes in tone.js

    // Decides how long a note can take
    const noteLength = '8n';

    // Sets the seed to 1,2,3 (random beat set for the first 3 tracks)
    let seed = Math.floor(Math.random() * 10);
    //Static seed
    //seed = 120 

    // Uses input BPM to calculate wait-time between columns
    columnTime = (60 / parseFloat(document.getElementById('tempo-input').value)) * 1000;

    // determines the tempo
    tempoInput.addEventListener('input', function () {
      const bpm = parseFloat(tempoInput.value);
      columnTime = (60 / bpm) * 1000;
    });




    ///////////////////// SEQUENCER INITIALISATION ////////////////////////

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
          // 'data' is the 2D array of grid values returned by the API
          for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
              if (data[i][j] == 1.0) {
                document.querySelector(`.cell[data-row="${j}"][data-col="${i}"]`).classList.add('on'); // Cell is ON
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
            } 
          }
        });
    }

    function generateRandomTrack(dataRow) {
      // console.log("this is generate track");
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
            } 
          }  
        });
    }
    
    // Define function to turn cell on/off
    function toggleCell(event) {
      if (event.target.classList.contains('on')) {
        event.target.classList.remove('on');
      } 
      else {
        event.target.classList.add('on');
      }
    }


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



  // Define function for playing a loop
  function playLoop() {

    intervalId = setInterval(function() {
      if (isLoopPlaying) { // Check if isLoopPlaying is true
        playStep(col);

        let previousCol = 1;

        if (col == 0) {
          previousCol = numCols-1;
        }

        if (col > 0) {
          previousCol = col-1; // Holds the indicator of the cell right before the one currently played
        }
        

        // for every row in the sequence
        for (row = 0; row < totalRow; row++) {  
          const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`); // define the current cell that is currently played
          const previousCell = document.querySelector(`.cell[data-row="${row}"][data-col="${(previousCol)}"]`); // define the cell right before the one that is currently played


          if (cell.classList.contains('on')) {
            cell.classList.remove('on');
            cell.classList.add('playing'); // turns white
          }

          if (previousCell.classList.contains('playing')) {
            previousCell.classList.remove('playing');
            previousCell.classList.add('on'); // turns white
          }
        }

        col++;

        if (col === numCols) {
          col = 0; // Reset the index to 0
        }

      }  
    }, columnTime);

      // Set the loopEnd to repeat indefinitely
      Tone.Transport.loopEnd = numCols - 1;
      Tone.Transport.start();
      Tone.Transport.loop = true;
  }
    
    loopBtn.addEventListener('click', function () {
      if (loopBtn.classList.contains('btn-pos')) {
        loopBtn.classList.remove('btn-pos');
        loopBtn.classList.add('btn-med');
        loopBtn.textContent = 'Stop Loop';

        Tone.start();
        isLoopPlaying = true;

        playLoop();
      }
      else if (loopBtn.classList.contains('btn-med')) {
        loopBtn.classList.remove('btn-med');
        loopBtn.classList.add('btn-pos');
        loopBtn.textContent = 'Start Loop';

        isLoopPlaying = false;
        Tone.Transport.stop()
        removePlayingClass(numRows, numCols);

        clearInterval(intervalId); // clear the time interval
        col = 0;
      }
    });
    
    cells.forEach(function (cell) {
      cell.addEventListener('click', function (event) {
        toggleCell(event);
      });
    });



    /* Function for clearing all cells from the sequencer
  
  param numRows: amount of rows - usually same amount for each column
  param numCols: amount of columns - usually same amount for each row
  return: none */
  function removeOnClass(numRows, numCols) {
    for (let row = 0; row <= numRows; row++) {
      for (let col = 0; col <= numCols; col++) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);

        if (cell.classList.contains('on')) {
          cell.classList.remove('on');
        }
      }
    }
  }

  function removePlayingClass(numRows, numCols) {
    console.log("Inside remove Playing Class");
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const cell = document.querySelector(`.cell[data-row="${row}"][data-col="${col}"]`);
        console.log("Cell was playing : ", cell);
        if (cell.classList.contains('playing')) {
          cell.classList.remove('playing');
          cell.classList.add('on');
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

      if (cell.classList.contains('on')) {
        cell.classList.remove('on');
      }
    }
  }
  
  ///////////////// POPUPS EVENTS  ///////////////// 
  // Make a popup appear to show how the composition was generated
  howGenButn.addEventListener('click', function() {
    popupHow.classList.remove('popup_hidden');
    popupHow.classList.add('popup');
  });

  closeBtn.addEventListener('click', function() {
    popupHow.classList.remove('popup');
    popupHow.classList.add('popup_hidden');
  });


  ///////////////// CLEAN CELLS  ///////////////// 

  //clear the whole sequence grid when the clear button is pressed
  clear_sequencer.addEventListener('click', function() {
	  removeOnClass(4, 15);
  });

  // clear the whole sequence grid when the generate music button is pressed
  genMuBtn.addEventListener('click', function() {
	  removeOnClass(4, 15);
  });






  ///////////////// CLEAN CELLS BY ROW   ///////////////// 

  // clear the first row of the sequence grid when the generate beat button is pressed
  genBeatBtn.addEventListener('click', function() {
	  removeOnClassRow(0, 15);
  });

  // clear the second row of the sequence grid when the generate chord button is pressed
  genChordBtn.addEventListener('click', function() {
	  removeOnClassRow(1, 15);
  });

  // clear the third row of the sequence grid when the generate bass button is pressed
  genBassBtn.addEventListener('click', function() {
	  removeOnClassRow(2, 15);
  });

  // clear the fourth row of the sequence grid when the generate melody button is pressed
  genMeloBtn.addEventListener('click', function() {
	  removeOnClassRow(3, 15);
  });
  
});