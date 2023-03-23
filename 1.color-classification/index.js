let data, model, xs, ys, rSlider, gSlider, bSlider, labelP, lossP;
let labelList = [
  "red-ish",
  "green-ish",
  "blue-ish",
  "orange-ish",
  "yellow-ish",
  "pink-ish",
  "purple-ish",
  "brown-ish",
  "gray-ish",
];
function preload() {
  data = loadJSON("colorData.json");
}
function setup() {
  labelP = createP("label");
  lossP = createP("loss");
  rSlider = createSlider(0, 255, 255);
  gSlider = createSlider(0, 255, 0);
  bSlider = createSlider(0, 255, 255);
  let colors = [];
  let labels = [];
  for (let record of data.entries) {
    let col = [record.r / 255, record.g / 255, record.b / 255];
    labels.push(labelList.indexOf(record.label));
    colors.push(col);
  }
  xs = tf.tensor2d(colors);
  let labelsTensor = tf.tensor1d(labels, "int32");
  ys = tf.oneHot(labelsTensor, 9).cast("float32");
  labelsTensor.dispose();

  model = tf.sequential();
  let hidden = tf.layers.dense({
    units: 16,
    activation: "sigmoid",
    inputDim: 3,
  });
  let output = tf.layers.dense({
    units: 9,
    activation: "softmax",
  });
  model.add(hidden);
  model.add(output);
  //   optimizer

  const learningRate = 0.2;
  const optimizer = tf.train.sgd(learningRate);

  model.compile({
    optimizer: optimizer,
    loss: "categoricalCrossentropy",
  });
  train();
}
async function train() {
  return await model.fit(xs, ys, {
    shuffle: true,
    validationSplit: 0.1,
    epochs: 100,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        console.log(epoch);
        lossP.html("loss " + logs.loss.toFixed(5));
      },
      onBatchEnd: async (batch, logs) => {
        await tf.nextFrame();
      },
      onTrainEnd: () => {
        console.log("finished");
      },
    },
  });
}
function draw() {
  let r = rSlider.value();
  let g = gSlider.value();
  let b = bSlider.value();
  background(r, g, b);
  strokeWeight(2);
  stroke(255);
  line(frameCount % innerWidth, 0, frameCount % innerWidth, height);
  tf.tidy(() => {
    const iput = tf.tensor2d([[r, g, b]]);
    let results = model.predict(iput);
    let argMax = results.argMax(1);
    let index = argMax.dataSync()[0];
    let label = labelList[index];
    labelP.html(label);
  });
}
