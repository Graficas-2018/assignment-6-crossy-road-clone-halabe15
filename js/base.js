// 1. Enable shadow mapping in the renderer.
// 2. Enable shadows and set shadow parameters for the lights that cast shadows.
// Both the THREE.DirectionalLight type and the THREE.SpotLight type support shadows.
// 3. Indicate which geometry objects cast and receive shadows.

var renderer = null,
scene = null,
camera = null,
root = null,
player = null,
car = null,
log = null,
group = null,
orbitControls = null;

var animated = false;

var trees = null,
cars = null,
logs = null;

var pathsPositions = [];

var roadsPosition = [];
var riversPosition = [];
var grassPosition = [];

var playerBBox = null;
var treeBBox = [];
var carBBox = [];
var logBBox = [];

var objLoader = null, jsonLoader = null;

var currentTime = Date.now();
var fowardPosition = 1;
var bestScore = 0;


function loadPaths(order, obj, png){
  if(!objLoader)
      objLoader = new THREE.OBJLoader();

  objLoader.load(
      obj,

      function(object)
      {
          var texture = new THREE.TextureLoader().load(png);
          // var normalMap = new THREE.TextureLoader().load('../models/cerberus/Cerberus_N.jpg');
          // var specularMap = new THREE.TextureLoader().load('../models/cerberus/Cerberus_M.jpg');

          object.traverse( function ( child )
          {
              if ( child instanceof THREE.Mesh )
              {
                  child.castShadow = true;
                  child.receiveShadow = true;
                  child.material.map = texture;
              }
          } );
          object.scale.set(3,3,4);
          object.position.z = (order * 4) - 2;
          object.position.x = 0;
          object.position.y = -4;
          // player.rotation.x = Math.PI / 180 * 15;
          // player.rotation.y = -3;
          scene.add(object);

          // return object;

      },
      function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function ( error ) {

          console.log( 'An error happened' );

      });

    playerBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
}

function loadObj(obj, png){
  if(!objLoader)
      objLoader = new THREE.OBJLoader();

  objLoader.load(
      obj,

      function(object)
      {
          var texture = new THREE.TextureLoader().load(png);
          // var normalMap = new THREE.TextureLoader().load('../models/cerberus/Cerberus_N.jpg');
          // var specularMap = new THREE.TextureLoader().load('../models/cerberus/Cerberus_M.jpg');

          object.traverse( function ( child )
          {
              if ( child instanceof THREE.Mesh )
              {
                  child.castShadow = true;
                  child.receiveShadow = true;
                  child.material.map = texture;
              }
          } );

          player = object;
          player.scale.set(3,3,3);
          player.position.z = 2;
          player.position.x = 0;
          player.position.y = -2.8;
          // player.rotation.x = Math.PI / 180 * 15;
          // player.rotation.y = -3;
          // console.log(player);
          player.add(camera);
          scene.add(player);

          // return object;

      },
      function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function ( error ) {

          console.log( 'An error happened' );

      });

    playerBBox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
}
function loadCar(obj, png, i){
  if(!objLoader)
      objLoader = new THREE.OBJLoader();

  objLoader.load(
      obj,

      function(object)
      {
          var texture = new THREE.TextureLoader().load(png);

          object.traverse( function ( child )
          {
              if ( child instanceof THREE.Mesh )
              {
                  child.castShadow = true;
                  child.receiveShadow = true;
                  child.material.map = texture;
              }
          } );

          var rand = Math.floor(Math.random()*roadsPosition.length);

          car = object;
          car.scale.set(4,4,4);
          car.rotation.y = -Math.PI/2;
          car.position.z = (i * 4) - 2;
          car.position.x = 35;
          car.position.y = -3.3;
          car.name = carBBox.length - 1;
          cars.add(car);

          // return object;

      },
      function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function ( error ) {

          console.log( 'An error happened' );

      });

      carBBox.push(new THREE.Box3(new THREE.Vector3(), new THREE.Vector3()));


}
function loadLogs(obj, png, i){
  if(!objLoader)
      objLoader = new THREE.OBJLoader();

  objLoader.load(
      obj,

      function(object)
      {
          var texture = new THREE.TextureLoader().load(png);

          object.traverse( function ( child )
          {
              if ( child instanceof THREE.Mesh )
              {
                  child.castShadow = true;
                  child.receiveShadow = true;
                  child.material.map = texture;
              }
          } );

          var rand = Math.floor(Math.random()*riversPosition.length);

          log = object;
          log.scale.set(4,4,4);
          // log.rotation.y = -Math.PI/2;
          log.position.z = (i * 4) - 2;
          log.position.x = 35;
          log.position.y = -5;
          log.name = (i * 4) - 2;
          logs.add(log);

          // return object;

      },
      function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function ( error ) {

          console.log( 'An error happened' );

      });

      logBBox.push(new THREE.Box3(new THREE.Vector3(), new THREE.Vector3()));


}
function loadTree(obj, png){
  if(!objLoader)
      objLoader = new THREE.OBJLoader();


  objLoader.load(
      obj,

      function(object)
      {
          var texture = new THREE.TextureLoader().load(png);
          // var normalMap = new THREE.TextureLoader().load('../models/cerberus/Cerberus_N.jpg');
          // var specularMap = new THREE.TextureLoader().load('../models/cerberus/Cerberus_M.jpg');

          object.traverse( function ( child )
          {
              if ( child instanceof THREE.Mesh )
              {
                  child.castShadow = true;
                  child.receiveShadow = true;
                  child.material.map = texture;
              }
          } );

          // player = object;
          var x, rand;
          do {
            x = random(-36,36);
          } while (x % 4 != 0);

          do {
            rand = Math.floor(Math.random()*grassPosition.length);
          } while (rand == 1);


          object.scale.set(4,4,4);
          object.position.z = (grassPosition[rand]*4)-2;
          object.position.x = x;
          object.position.y = -3;
          // player.rotation.x = Math.PI / 180 * 15;
          // player.rotation.y = -3;
          tmp = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
          tmp.setFromObject(object);
          treeBBox.push(tmp);
          trees.add(object);

          // return object;

      },
      function ( xhr ) {

          console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function ( error ) {

          console.log( 'An error happened' );

      });


}

function animate() {

  var duration1 = 800;
  var duration2 = 650;
  var duration3 = 600;
  var duration4 = 400;
  var now = Date.now();
  var deltat = now - currentTime;
  currentTime = now;
  var fract1 = deltat / duration1;
  var fract2 = deltat / duration2;
  var fract3 = deltat / duration3;
  var fract4 = deltat / duration4;
  var velocity1 = Math.PI * 2 * fract1;
  var velocity2 = Math.PI * 2 * fract2;
  var velocity3 = Math.PI * 2 * fract3;
  var velocity4 = Math.PI * 2 * fract4;

  for (var i in cars.children) {
    var rand = random(1,10);
    if(rand < 5)
      cars.children[i].position.x -= velocity3;
    else
      cars.children[i].position.x -= velocity4;


    if(cars.children[i].position.x < -35 )
      cars.children[i].position.x = 35;
  }

  for (var i in logs.children) {

    rand = random(1,10);
    if(rand < 5)
      logs.children[i].position.x -= velocity1;
    else
      logs.children[i].position.x -= velocity2;

    if(logs.children[i].position.x < -35 )
      logs.children[i].position.x = 35;
  }
}

function run() {
  requestAnimationFrame(function() { run(); });

  // Render the scene
  renderer.render( scene, camera );

  // Spin the cube for next frame
  animate();
  KF.update();

  // Update the camera controller
  orbitControls.update();

  addScore();

  if (player.animation.running == false) {
    if (pathsPositions[fowardPosition] == 'road') {
      // $('#prompt').text(fowardPosition);
      player.position.y = -3.3;
    } else if (pathsPositions[fowardPosition] == 'grass') {
      // $('#prompt').text(fowardPosition);
      player.position.y = -2.8;
    } else if (pathsPositions[fowardPosition] == 'river') {
      // $('#prompt').text(fowardPosition);
      player.position.y = -3.05;
      var drawn = true;
      for (var i in logBBox) {
        if (logBBox[i].containsPoint(player.position)) {
          drawn = false;
          break;
          // resetPlayer();
          // console.log(logBBox[i].containsPoint(player.position));
        }
      }
      if (drawn) {
        resetPlayer();
      } else {
        // player.position.x = logBBox[i].position.x;
      }
    }
  }

  playerBBox.setFromObject(player)

  for (var element in carBBox) {
    carBBox[element].setFromObject(cars.children[element])
    if(carBBox[element].containsPoint(player.position)){
      resetPlayer();
    }
  }

  for (var element in logBBox) {
    logBBox[element].setFromObject(logs.children[element])
    if(logBBox[element].containsPoint(player.position)){
      // console.log(logs.children[element].position);
      player.position.x = logs.children[element].position.x;
    }
  }
}

function onKeyDown(event){
  // console.log(event.keyCode);
  switch (event.keyCode) {
    case 65:
      var crash = false;
      for (var i in treeBBox) {
        // // IZQ
        // if(treeBBox[i].containsPoint(new THREE.Vector3(player.position.x+1, player.position.y, player.position.z)))
        //   {crash = true; break;} else
        // if(treeBBox[i].containsPoint(new THREE.Vector3(player.position.x+2, player.position.y, player.position.z)))
        //   {crash = true; break;} else
        // if(treeBBox[i].containsPoint(new THREE.Vector3(player.position.x+3, player.position.y, player.position.z)))
        //   {crash = true; break;} else
        if(treeBBox[i].containsPoint(new THREE.Vector3(player.position.x+4, player.position.y, player.position.z)))
          {crash = true; break;}
      }
      if (crash == true)
        break;
      // console.log(new THREE.Vector3(player.position.x+4, player.position.y, player.position.z));
      // console.log(treeBBox.containsPoint(new THREE.Vector3(player.position.x, player.position.y, player.position.z)));
      animations(new THREE.Vector3(1,0,0));
      player.animation.start();
    break;

    case 87:
      for (var i in treeBBox) {
        // ARRIBA
        // if(treeBBox[i].containsPoint(new THREE.Vector3(player.position.x, player.position.y, player.position.z+1)))
        //   {crash = true; break;} else
        // if(treeBBox[i].containsPoint(new THREE.Vector3(player.position.x, player.position.y, player.position.z+2)))
        //   {crash = true; break;} else
        // if(treeBBox[i].containsPoint(new THREE.Vector3(player.position.x, player.position.y, player.position.z+3)))
        //   {crash = true; break;} else
        if(treeBBox[i].containsPoint(new THREE.Vector3(player.position.x, player.position.y, player.position.z+4)))
          {crash = true; break;}
      }

      if (crash == true)
        break;

      animations(new THREE.Vector3(0,0,1));
      player.animation.start();
      fowardPosition++;
    break;

    case 68:
      for (var i in treeBBox) {
        // DER
        // if(treeBBox[i].containsPoint(new THREE.Vector3(player.position.x-1, player.position.y, player.position.z)))
        //   {crash = true; break;} else
        // if(treeBBox[i].containsPoint(new THREE.Vector3(player.position.x-2, player.position.y, player.position.z)))
        //   {crash = true; break;} else
        // if(treeBBox[i].containsPoint(new THREE.Vector3(player.position.x-3, player.position.y, player.position.z)))
        //   {crash = true; break;} else
        if(treeBBox[i].containsPoint(new THREE.Vector3(player.position.x-4, player.position.y, player.position.z)))
          {crash = true; break;}
      }

      if (crash == true)
        break;

      animations(new THREE.Vector3(-1,0,0));
      player.animation.start();
    break;

    case 83:
      for (var i in treeBBox) {
        // ABAJO
        // if(treeBBox[i].containsPoint(new THREE.Vector3(player.position.x, player.position.y, player.position.z-1)))
        //   {crash = true; break;} else
        // if(treeBBox[i].containsPoint(new THREE.Vector3(player.position.x, player.position.y, player.position.z-2)))
        //   {crash = true; break;} else
        // if(treeBBox[i].containsPoint(new THREE.Vector3(player.position.x, player.position.y, player.position.z-3)))
        //   {crash = true; break;} else
        if(treeBBox[i].containsPoint(new THREE.Vector3(player.position.x, player.position.y, player.position.z-4)))
          {crash = true; break;}
      }

      if (crash == true)
        break;

      animations(new THREE.Vector3(0,0,-1));
      player.animation.start();
      fowardPosition--;

    break;


  }

  animated = true;
  // console.log(playerBBox);

}

async function animations(vector){
    // position animation
    if(animated && player.animation.running)
      return;

    player.animation = new KF.KeyFrameAnimator;
    player.animation.init({
        interps:
            [
                {
                    keys:[0, .25, .5, 1],
                    values:[
                            { x: player.position.x + (vector.x * 1), y : player.position.y, z: player.position.z + (vector.z * 1) },
                            { x: player.position.x + (vector.x * 2) , y : -2, z: player.position.z + (vector.z * 2) },
                            { x: player.position.x + (vector.x * 3) , y : -2, z: player.position.z + (vector.z * 3) },
                            { x: player.position.x + (vector.x * 4) , y : player.position.y, z: player.position.z + (vector.z * 4) },
                            ],
                    target:player.position
                },
            ],
        loop: false,
        duration:300,
        // easing:TWEEN.Easing.Bounce.InOut,
    });
}

var directionalLight = null;
var spotLight = null;
var ambientLight = null;
var mapUrl = "./images/real_grass.jpg";

var SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 2048;

function createScene(canvas) {

    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Turn on shadows
    renderer.shadowMap.enabled = true;
    // Options are THREE.BasicShadowMap, THREE.PCFShadowMap, PCFSoftShadowMap
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.set(-10, 10, -10);
    // camera.rotation.set(30, 30, 30);
    // player = new THREE.Object3D;
    scene.add(camera);

    // Create a group to hold all the objects
    root = new THREE.Object3D;

    ambientLight = new THREE.AmbientLight ( 0xffffff );
    root.add(ambientLight);

    trees = new THREE.Object3D;
    cars = new THREE.Object3D;
    logs = new THREE.Object3D;

    scene.add(trees);
    scene.add(cars);
    scene.add(logs);

    fowardPosition = 1;

    var rand;

    for (var i = 0; i < 50; i++) {
      var obj = [
        './assets/models/environment/road/0/0.obj', './assets/models/environment/road/1/0.obj',
        './assets/models/environment/grass/0/0.obj', './assets/models/environment/grass/1/0.obj',
        './assets/models/environment/river/0.obj'
      ];
      var png = [
        './assets/models/environment/road/0/0.png', './assets/models/environment/road/1/0.png',
        './assets/models/environment/grass/0/0.png', './assets/models/environment/grass/1/0.png',
        './assets/models/environment/river/0.png'
      ];
      rand = Math.floor(Math.random()*(4-0+1)+0);
      if(i < 2)
        rand = 2;
      if (rand == 0 || rand == 1) {
        roadsPosition.push(i);
        pathsPositions.push('road');
      } else if (rand == 2 || rand == 3) {
        grassPosition.push(i);
        pathsPositions.push('grass');
      } else if (rand == 4) {
        riversPosition.push(i);
        pathsPositions.push('river');
      }
      loadPaths(i, obj[rand], png[rand]);
      if (rand == 0 || rand == 1) {
        loadCar('./assets/models/vehicles/blue_car/0.obj', './assets/models/vehicles/blue_car/0.png', i);
      } else if (rand == 4) {
        loadLogs('./assets/models/environment/log/0/0.obj', './assets/models/environment/log/0/0.png', i);
      }
    }

    rand = random(10, 100);
    // Create the objects
    loadObj('./assets/models/characters/chicken/0.obj', './assets/models/characters/chicken/0.png');
    for (var i = 0; i < rand; i++) {
      let type = random(0,3);
      loadTree('./assets/models/environment/tree/'+type+'/0.obj', './assets/models/environment/tree/'+type+'/0.png');
    }
    // loadObj('./assets/models/characters/chicken/0.obj');

    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Now add the group to our scene
    scene.add( root );

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    animations(new THREE.Vector3(0,0,0));
}

function random(min, max){
  return Math.floor(Math.random()*(max-min+1)+min);
}

function resetPlayer(){
  player.animation.stop();
  player.position.set(0,-2.8,2);
  $('#animations').text('Score: 0');
  fowardPosition = 1;
}

function addScore(){
  if(bestScore < fowardPosition - 1){
    bestScore = fowardPosition - 1;
    $('#animations').text('Score: '+bestScore);
  }

}
