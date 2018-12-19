// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example 
Creating a regression extracting features of MobileNet. Build with p5js.
=== */

let featureExtractor;
let regressor;
let video;
let loss;
let slider;
let samples = 0;
let rectSize = 50;

let lerpedResult = 0.5;

function setup() {
  createCanvas(640,480);
  // Create a video element
  video = createCapture(VIDEO);
  video.size(640,480);
  video.hide();
  // Extract the features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady);
  // Create a new regressor using those features and give the video we want to use
  regressor = featureExtractor.regression(video, videoReady);
  // Create the UI buttons
  setupButtons();
  rectMode(CENTER);
}

function draw() {
  image(video, 0, 0, width, height);
  noStroke();
  fill(255, 0, 0,100);
  
  rectSize = map(slider.value(), 0, 1, 0, width/2);
  rectSize = constrain(rectSize, 0, width/2);
  
  rect(width/2, height/2, rectSize, rectSize);
  
  textSize(slider.value()*100);
  // text("Hello", 50, 100);
}

// A function to be called when the model has been loaded
function modelReady() {
  select('#modelStatus').html('Model loaded!');
}

// A function to be called when the video has loaded
function videoReady() {
  select('#videoStatus').html('Video ready!');
}

// Classify the current frame.
function predict() {
  regressor.predict(gotResults);
}

// A util function to create UI buttons
function setupButtons() {
  slider = select('#slider');
  select('#addSample').mousePressed(function() {
    regressor.addImage(slider.value());
    select('#amountOfSamples').html(samples++);
  });

  // Train Button
  select('#train').mousePressed(function() {
    regressor.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select('#loss').html('Loss: ' + loss);
      } else {
        select('#loss').html('Done Training! Final Loss: ' + loss);
      }
    });
  });

  // Predict Button
  select('#buttonPredict').mousePressed(predict);
}

// Show the results
function gotResults(err, result) {
  if (err) {
    console.error(err);
  }
  
  lerpedResult = lerp(lerpedResult, result, 0.95);
  slider.value(lerpedResult);
  
  predict();
}
