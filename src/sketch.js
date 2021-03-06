let video;
let poseNet;
let poses = [];
let skeletons = [];
let noseWindow = [] ;
let nose_i = 0 ;
let angle1 = 0;
let angle2 = 0;
let deviation = 0;
let win_size = 40;


const weightManifestUrl = "http://dev.technorip.com/ml/emo/model.json";


function setup() {
  createCanvas(900, 650);
  video = createCapture(VIDEO);
  video.size(width, height);
  console.log("width : " + width);
  console.log("Height : " + height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function (results) {
    poses = results;
  });
  // Hide the video element, and just show the canvas
  video.hide();
}

function modelReady() {
  select('#status').hide();
}

function draw() {
  image(video, 0, 0, width, height);

  // We can call both functions to draw all keypoints and the skeletons
  drawKeypoints();
  // drawSkeleton();
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints()  {
  // Loop through all the poses detected
 
  fill(0,0,255);
  textSize(32);
  text("Detected " + poses.length + " Faces", 10, 70);
  

  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    for (let j = 0; j < poses[i].pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = poses[i].pose.keypoints[j];

      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
<<<<<<< HEAD
        fill(255, 0, 0);
        noStroke();
=======
        // fill(255, 0, 0);
        // noStroke();
>>>>>>> skelton
        // ellipse(keypoint.position.x, keypoint.position.y, 10, 10);

        if(keypoint.part=="nose"){
          // console.log(keypoint)
          // ellipse(keypoint.position.x, keypoint.position.y, 25, 25);

<<<<<<< HEAD
          rect(keypoint.position.x-180, keypoint.position.y-180, 360, 360);
          fill(0, 0, 255);
          textSize(32);
          let x = round(keypoint.position.x, 3);
          let y = round(keypoint.position.y,3);
          
          text("Detected Nose at " + x + "," + y, 10, 30);
=======
          rect(keypoint.position.x-180, keypoint.position.y-180, 360, 360);          
          let x = round(keypoint.position.x, 3);
          let y = round(keypoint.position.y,3);
          
          // text("Detected Nose at " + x + "," + y, 10, 30);
>>>>>>> skelton

          noseWindow[nose_i] = [x,y] ;
          nose_i += 1 ;

          // console.log(noseWindow[0][0]);
          // console.log(noseWindow[0][19]);
<<<<<<< HEAD
          if(nose_i>=20){
=======
          if(nose_i>=win_size+1){
>>>>>>> skelton
            // console.log(noseWindow);
            angle1 = angle2; 

            angle2 = get_angle(
              noseWindow[0][1],
              noseWindow[0][0],
<<<<<<< HEAD
              noseWindow[19][1],
              noseWindow[19][0]
=======
              noseWindow[win_size][1],
              noseWindow[win_size][0]
>>>>>>> skelton
            );
            // console.log(angle1) ;
            noseWindow = []
            nose_i = 0 ;
            deviation = Math.abs(angle2-angle1) ;
<<<<<<< HEAD
            console.log("Angle deviation : " + deviation) ;

          }
        
=======
            
            console.log("Angle deviation : " + deviation) ;
            

          }
          fill(255, 0, 0);

          text("Angle of deviation : " + round(deviation*100,3)/100, 10, 100);
          fill(0, 0, 255);
>>>>>>> skelton

        }
      }
    }
  }
}


function get_angle(y1,y2,x1,x2){

    var dx = x1 - x2;
    var dy = y1 - y2;

    var theta = Math.atan2(-dy, -dx); // [0, Ⲡ] then [-Ⲡ, 0]; clockwise; 0° = east
    theta *= 180 / Math.PI;           // [0, 180] then [-180, 0]; clockwise; 0° = east
    if (theta < 0) theta += 360; 
    return theta

}
// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    // For every skeleton, loop through all body connections
    for (let j = 0; j < poses[i].skeleton.length; j++) {
      let partA = poses[i].skeleton[j][0];
      let partB = poses[i].skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}