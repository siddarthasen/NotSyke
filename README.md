A multiplayer online game that allows friends to answer interesting questions about each other. The idea came about when my friends and I were bored during the COVID pandemic, and we needed a game to keep us occupied. I decided to take the lead and build this app using a Node.js backend, and a React.js frontend. Socket.io was also used to connect multiple players in a room, and Express.js was the framework for connecting all the respective parts of the app. The app is currently in the beta testing phase, where I am tweaking all the minor bugs and UI complications. Node.js backend is actively running on an AWS EC2 instance.


# Object Detection 
<h>Updated merges with Master as of May 22, 2020</p>
<div>
<p> <b>Current State</b>: There are currently separate functions made for image cleaning, cropping, color detection, shape detection, and letter detection. 
<p> <b>Next Steps</b>: We will combine the image cleaning with color detection, and cropping with shape detection before removing the image cleaning branch. Shape detection and letter detection will work on using Keras to increase accuracy.

<div>
<div>
# Image Cleaning
<div>
<p> <b>Current State</b>: Cable to remove small markings from an image with a shape. (isolates the shape). Stil having some trouble with identiying larged bodies since they are disconnected pixels.</p>
</div>

<div>
<p><strong>Latest Change</strong>: Using a dictionary to calculate the number of pixels (using highest R or G or B value) </p>

How it works:
-------------
<h> We will take advantage of a supervised learning technique known as KNearestNeighbor (KNN) <h>
 
<b>Step 1: Pass image to morphology library</b>
 <div>
   <p>Filters the uneccessary pixels but is unable to detect larger bodies</p> 
   <p>Kernel can be manipulated to have a threshold for size but can be innaccurate the smaller the threshold <p>

 </div>
<b>Step 2: Pass Pixels into dictionary" </b>
<div>
   <p>Counts the number of highest taken RGB value for each pixel and places into a dictionary</p>
   <p>Filter the values with a number greater than 600 and smaller than 200</p>
</div>
<b>Step 2: Delete Pixels" </b>
<div>
   <p>Iterate through the pixels and store the ones that are beyond the threshold.</p>
</div>

![](example_output.png)
