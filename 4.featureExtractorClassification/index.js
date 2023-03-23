let mobilenet, classifier, video;
let label = "loading model";
let remoteBtn, mobileBtn, trainBtn, saveBtn, up, down;

function modelReady() {
  console.log("Model is ready");
  classifier.load("./model.json", customModelReady);
}
function customModelReady() {
  console.log("Custom model is ready");
  label = "model is ready"
  classifier.classify(gotResults);
}
function videoReady() {
  console.log("Video is ready");
}
function whileTraining(loss) {
  if (loss == null) {
    console.log("Training Complete");
    classifier.classify(gotResults);
  } else {
    console.log(loss);
  }
}

function gotResults(error, result) {
  if (error) {
    console.error(error);
  } else {
    label = result[0].label;

    classifier.classify(gotResults);
  }
}

function setup() {
  createCanvas(320, 270);
  video = createCapture(VIDEO);

  video.size(320, 270);
  video.hide();
  background(0);
  mobilenet = ml5.featureExtractor("MobileNet", modelReady);
  classifier = mobilenet.classification(video, videoReady);
  remoteBtn = createButton("remote");
  remoteBtn.mousePressed(function () {
    classifier.addImage("remote");
  });
  mobileBtn = createButton("mobile");
  mobileBtn.mousePressed(function () {
    classifier.addImage("mobile");
  });

  trainBtn = createButton("train");
  trainBtn.mousePressed(function () {
    classifier.train(whileTraining);
  });
  saveBtn = createButton("save");
  saveBtn.mousePressed(function () {
    classifier.save();
  });
}
function draw() {
  background(0);
  image(video, 0, 0);
  fill(255);
  textSize(34);
  text(label, 10, height - 10);
}
