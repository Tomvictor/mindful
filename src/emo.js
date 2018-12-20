console.log("code starts ...")
// util functions

// mobilenet =  tf.loadModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json')

var IMAGE_SIZE = 224;


// mobilenet.predict(tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3])).dispose();





async function main(){
    console.log("loading model");
    const model = await tf.loadModel('http://localhost:8000/srv/emo/model.json');
    console.log("model loaded..");
    // const cat = tf.fromPixels(catElement);
    const catElement = document.getElementById('cat');
    console.log(catElement);
    
    if (catElement.complete && catElement.naturalHeight !== 0) {
        predict(catElement);
        catElement.style.display = '';
      } else {
        catElement.onload = () => {
          predict(catElement);
          catElement.style.display = '';
        }
      }
}


console.log("starting...");
main();
