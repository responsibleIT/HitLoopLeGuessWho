# HitLoop Project - Le Guess Who 2023
HitLoop is a music composition project from the Responsible IT office, at the HvA, in collaboration with Digital Society School. This version of the project is the Web App version that will be presented at "Le Guess Who" music festival in Utrecht, in November 2023.

# Technologies
HTML, CSS & JavaScript.


## V1:
Front end and back end by Erik Slingerland in the context of a Master's thesis (4 months), with the design process in collaboration with Yuri Westplat. 
This first version consisted in: Creating the datasets, training the models, doing user testing, making a working prototype, integrating Tone.js, etc.

## V2: Le Guess Who
Started officially on September 18th 2023, this new version of the project explores a more innovative interface to present for the festival. This version of the project will be ended in early November.

## How to Use
LOCALLY
1. Clone the repository
2. Open the HTML file (index.html)
(All required libraries are installed in the repository)

## Requirements
TBD

## How to Contribute
If contributing, keep this version of the project unaltered and follow the steps described below to be able to freely modify the project:
1. Fork the repository & rename it 
2. Document the difference of the new version
3. Create a branch for each new major functionality or development phases
4. Once that functionality or development phases are stable and implemented, merge with the main branch
5. Open a pull request on the original repository and describe your proposed changes

## Issues & Recomendations
1. Change BPM During Playback:
Changing BPM while the loop plays affects the music looping due to a tone.js buffer issue. Changing BPM while the loop is stopped doesn't cause issues.Consider exploring similar issues in tone.js documentation to resolve this.

2. Sample Change During Playback:
Similar issue to point 1 happens when changing samples during playback, this is most likely also related to the tone.js buffer. Changing samples while the loop is stopped doesn't cause issues.

3. Future Improvement: Flexbox Implementation:
Implement Flexbox for the sequencer grid and side menu (70/30 distribution). This change in HTML and CSS structure would significantly enhance responsiveness. Consider replacing tables with grids for better responsiveness, albeit requiring a substantial code structure alteration.

## Future Prospects
1. Code Optimization and Function Integration:
Integrate additional functions for code optimization, reducing line counts, and organizing scripts into separate JS files. This may pose challenges with tone.js integration apparently causing errors within functions.

2. Endpoint Creation for Track Generation:
Create an endpoint to send pre-generated tracks. This endpoint could generate a specific track considering the rest of the composition and return it to the interface script using arrays, simplifying track management.

3. Dynamic Track Addition:
Current code supports adding tracks for a fixed amount. Modify the code structure to accommodate user-created tracks dynamically. This would involve adapting functions related to grids and associated elements.

4. Sequencer Grid Orientation:
In this project version, the sequencer grid is rotated by 270 degrees, inverting rows and columns. Consider changing this orientation in future versions to avoid confusion.

5. Tone.js Library Update:
The GitHub link connects to a specific version of Tone.js hosted online. Users can freely switch to other versions of the Tone.js library as needed.

6. Mobile Device Optimization:
The looping animation may require adjustments (speed or grid spacing) on mobile devices based on their size, OS, and browser. Testing on intended devices is recommended for optimal functionality.

7. iOS Touch Feature Disablement:
Disable iOS-specific touch features to prevent unintended scrolling and zooming, ensuring a consistent user experience across platforms.

8. Note Interaction Detection:
Implement functionality to detect when played notes touch the line to activate sound and playing effect, enhancing responsiveness.

9. Pause Functionality Addition:
Add the ability to pause the sequencer grid without resetting it entirely, offering users greater control.


## Licence
Creative Common Licence.
