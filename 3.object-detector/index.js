let video, detector;
let detections = [];
function preload() {
  detector = ml5.objectDetector("cocossd");
}
function gotDetections(error, results) {
  if (error) {
    console.log(error);
  } else {
    detections = results;
    detector.detect(video, gotDetections);
  }
}
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  video = createCapture(VIDEO);
  
  video.size(window.innerWidth, window.innerHeight);
  video.hide();
  detector.detect(video, gotDetections);
}
function draw() {
  image(video, 0, 0);

  for (let i = 0; i < detections.length; i++) {
    const object = detections[i];
    // console.log(object);
    stroke(0, 255, 0);
    strokeWeight(4);
    noFill();
    rect(object.x, object.y, object.width, object.height);
    noStroke();
    fill(255);
    textSize(34);
    text(object.label, object.x + 10, object.y + 24);
  }
}
