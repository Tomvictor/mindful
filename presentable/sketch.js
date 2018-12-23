// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let video;
let poseNet;
let poses = [];
let e1x;
let e1y;
let e2x;
let e2y;
let nx;
let ny;
let ab;
let bc;
let ca;
var angleA;
var angleB;
var angleC;

var song;
var canvas_w = 1380
var canvas_h = 700


var ctracker;

delete emotionModel['disgusted'];
delete emotionModel['fear'];
var ec = new emotionClassifier();
ec.init(emotionModel);
var emotionData = ec.getBlank();


function setup() {
  createCanvas(canvas_w, canvas_h);
  video = createCapture(VIDEO);
  video.size(canvas_w, canvas_h);
  song = loadSound('beep.mp3');


  ctracker = new clm.tracker();
  ctracker.init(pModel);
  ctracker.start(video.elt);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {



    // clear();
    // darken video bg
    fill(0,150);
    rect(0,0,width,height);
    
    fill(255);
    var positions = ctracker.getCurrentPosition();
    for (var i=0; i<positions.length -3; i++) {
        ellipse(positions[i][0], positions[i][1], 2, 2);
    }


  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  drawSkeleton();

  var cp = ctracker.getCurrentParameters();
  var er = ec.meanPredict(cp);
  
  if (er) {
      // andry=0, sad=1, surprised=2, happy=3
      for (var i = 0;i < er.length;i++) {
          rect(i * 110+20, height-80, 30, -er[i].value * 30);    
      }
  }
  text("ANGRY", 20, height-40);
  text("SAD", 130, height-40);
  text("SURPRISED", 220, height-40);
  text("HAPPY", 340, height-40);
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
	
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
		  //console.log(keypoint)
        fill(255, 0, 0);
        noStroke();
		if (keypoint.part == "nose"){
        ellipse(keypoint.position.x, keypoint.position.y, 5,5);
		nx = keypoint.position.x;
		ny = keypoint.position.y;
		}
		if (keypoint.part == "leftEye"){
		ellipse(keypoint.position.x, keypoint.position.y, 5, 5);
		e1x = keypoint.position.x;
		e1y = keypoint.position.y;
		}
		if (keypoint.part == "rightEye"){
		ellipse(keypoint.position.x, keypoint.position.y, 5, 5);
		e2x = keypoint.position.x;
		e2y = keypoint.position.y;
		}
      }
	  
    }
	triangle(nx,ny,e1x,e1y,e2x,e2y);
	//angle1 = get_angle(nx,ny);
	//angle2 = get_angle(e1x,e1y);
	//angle3 = get_angle(e2x,e2y);
	ab = dist(nx,ny,e1x,e1y);
	bc = dist(e1x,e1y,e2x,e2y);
	ca = dist(e2x,e2y,nx,ny);
	angleA = Math.acos((ca*ca + ab*ab - bc*bc) / (2*ca*ab));
	angleA = (angleA * 180)/Math.PI;
	angleB = Math.acos((bc*bc + ab*ab - ca*ca) / (2*bc*ab));
	angleB = (angleB * 180)/Math.PI;
	angleC = Math.acos((bc*bc + ca*ca - ab*ab) / (2*bc*ca));
	angleC = (angleC * 180)/Math.PI;
	
	text("Distance " + Math.round(ab,2) + "  " + Math.round(bc) + "   " + Math.round(ca) ,10,30);
	// text("\n" + " anglesA " + angleA + " angleB " + angleB + " angleC " + angleC,60,70)
	//text("ATTENTION PLEASE",150,150);
	textSize(20);
	if (angleA<75 || angleA>130 || angleB<30 || angleB>65 || angleC<30 || angleC>65){
      text("ATTENTION PLEASE",150,150);

      song.play();
  }
 
}
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
	  //for (let i =0; i < 3; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
		//for (let j = 0; j < 3 ; j++) {
	 let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
