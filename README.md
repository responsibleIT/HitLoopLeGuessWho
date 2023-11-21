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
Changing the BPM value while the loop plays affects the music looping, probably due to a Tone.js buffer issue. Changing the BPM while the loop is stopped doesn't cause issues. Consider exploring similar issues in tone.js documentation to resolve this and exploring synchronous functions to prevent the error from happening.

2. Sample Change During Playback:
Similar issue to point 1 happens when changing samples for a track during playback, this is most likely also related to the Tone.js buffer. Changing samples while the loop is stopped doesn't cause issues.

3. Recommended Browser:
This project has been mainly tested on Google Chrome. When tested on other browsers such as Safari and Firefox with mobile devices, it worked as well but required a tweaking of the speed. Therefore, using the project on other browsers might require to alter the speed of the looping and the positions of the sequencer grids by a few pixels. 

4. To Adapt the Speed of the Loop
In the JS script, the variable "gridHeight" represents the length in pixels of each sequencer grid. It is divided by the BPM value to have the speed at which the animation should be completed for each sequencer grid. Increasing its value will make the speed of the looping slower, decreasing the variable value will make the speed faster.

## Future Prospects
1. Code Optimization and Function Integration:
Additional functions could be integrated and organizing scripts into separate JS files could increase readibility, optimise the code and reduce the script line counts,. This may pose challenges with Tone.js integration possibly causing errors when called and manipulated within functions.

2. Endpoint Creation for Track Generation:
For the implemetation of the generation of one track in relation to the tracks that are already generated, create an endpoint to send the other pre-generated tracks as arrays, and feed those array to the AI to generate that other track, then return it to the interface script using an array as well.

3. Dynamic Track Addition:
Current code supports adding tracks for a fixed amount of tracks. The code structure should be modified to accommodate user-created tracks dynamically, to add the adequate HTML elements, as well as the functions required for each track (generate, clear, sample selection, etc.). This would involve adapting features related to the sequencer grids and associated elements to repeat the creation of the tracks.

4. Sequencer Grid Orientation:
In this project version, the sequencer grid is rotated by 270 degrees, inverting rows and columns. Consider changing this orientation in future versions to avoid confusion.

5. Tone.js Library Update:
The GitHub link connects to a specific version of Tone.js hosted online by Digital Society School (https://dss.cloud/cdn/tone/build/Tone.js). Users can freely switch to other versions of the Tone.js library as needed.

6. Mobile Device Optimization:
As already mentioned in "Issues & Recommendations", the looping animation may require adjustments (speed or grid spacing) on mobile devices based on their size, OS, and browser. Testing on intended devices is recommended for optimal testing and adjustment.

7. iOS Touch Feature Disablement:
Disable the iOS-specific touch features to prevent unintended scrolling and zooming, ensuring a consistent user experience across platforms. This is already working well on other platforms (Computer, Android).

8. Played Notes Detection:
Implementing a functionality to detect when played notes touch the play line (horiontal white line in the middle of the screen) to activate the sound and the white coloured note effect would be a good addition tot he project. Right now this effect is created by placing the sequencer grids and animation a certain way, but this would ensure a better experience accross all devices and platfroms, notably on a responsiveness level.

9. Pause Functionality Addition:
Adding the ability to pause the sequencer grid without resetting it entirely (Stop feature), could be a good addition to the project, offering users greater control.

10. Flexbox Implementation:
Implement Flexbox for the sequencer grid and side menu (70/30 distribution). This change in HTML and CSS structure would significantly enhance responsiveness. Consider replacing tables with grids for better responsiveness, albeit requiring a substantial code structure alteration. This could also simplify the code by requiring less media queries.

## Licence
Creative Common Licence.
