let mobilenet, video, label;
function modelReady() {
  mobilenet.predict(gotResults);
}
function gotResults(error, results) {
  if (error) {
    console.log(error);
  } else {
    // console.log(results);
    label = results[0].label;
    mobilenet.predict(gotResults);
  }
}
function setup() {
  createCanvas(640, 550);
  video = createCapture(VIDEO);
  video.size(640, 550);
  video.hide();
  background(0);
  mobilenet = ml5.imageClassifier("MobileNet", video, modelReady);
}
function draw() {
  background(0);
  image(video, 0, 0);
  fill(255);
  textSize(32);
  text(label, 10, height - 20);
}
