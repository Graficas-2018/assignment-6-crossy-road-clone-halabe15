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
group = null,
orbitControls = null;

var animated = false;

var playerBox = null;

var objLoader = null, jsonLoader = null;

var duration = 300; // ms
var currentTime = Date.now();

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
          player.position.z = 0;
          player.position.x = 0;
          player.position.y = -4;
          // player.rotation.x = Math.PI / 180 * 15;
          // player.rotation.y = -3;
          console.log(player);
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

}
function loadCar(obj, png){
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

          car = object;
          car.scale.set(5,5,5);
          car.rotation.y = -Math.PI/2;
          car.position.z = 15;
          car.position.x = 25;
          car.position.y = -4;
          scene.add(car);

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
          object.scale.set(4,4,4);
          object.position.z = 5;
          object.position.x = 3;
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

}

function animate() {

    var now = Date.now();
    var deltat = now - currentTime;
    currentTime = now;
    var fract = deltat / duration;
    var velocity = Math.PI * 2 * fract;

    car.position.x -= velocity;

    if(car.position.x < -25 )
      car.position.x = 25;
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
}

function onKeyDown(event){
  // console.log(event.keyCode);
  switch (event.keyCode) {
    case 65:
      // IZQ
      animations(new THREE.Vector3(1,0,0));
      player.animation.start();
    break;

    case 87:
      // ARRIBA
      animations(new THREE.Vector3(0,0,1));
      player.animation.start();
    break;

    case 68:
      // DER
      animations(new THREE.Vector3(-1,0,0));
      player.animation.start();
    break;

    case 83:
      // ABAJO
      animations(new THREE.Vector3(0,0,-1));
      player.animation.start();
    break;


  }

  animated = true;


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
                            { x: player.position.x + (vector.x * 1), y : -4, z: player.position.z + (vector.z * 1) },
                            { x: player.position.x + (vector.x * 2) , y : -3, z: player.position.z + (vector.z * 2) },
                            { x: player.position.x + (vector.x * 3) , y : -3, z: player.position.z + (vector.z * 3) },
                            { x: player.position.x + (vector.x * 4) , y : -4, z: player.position.z + (vector.z * 4) },
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
    scene.add(camera);

    // Create a group to hold all the objects
    root = new THREE.Object3D;



    ambientLight = new THREE.AmbientLight ( 0xffffff );
    root.add(ambientLight);

    // Create the objects
    loadObj('./assets/models/characters/chicken/0.obj', './assets/models/characters/chicken/0.png');
    loadTree('./assets/models/environment/tree/3/0.obj', './assets/models/environment/tree/3/0.png');
    loadCar('./assets/models/vehicles/blue_car/0.obj', './assets/models/vehicles/blue_car/0.png');
    // loadObj('./assets/models/characters/chicken/0.obj');

    // Create a group to hold the objects
    group = new THREE.Object3D;
    root.add(group);

    // Create a texture map
    var map = new THREE.TextureLoader().load(mapUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    var color = 0xffffff;

    // Put in a ground plane to show off the lighting
    geometry = new THREE.PlaneGeometry(200, 200, 50, 50);
    var mesh = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({color:color, map:map, side:THREE.DoubleSide}));

    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = -4.02;

    // Add the mesh to our group
    group.add( mesh );
    mesh.castShadow = false;
    mesh.receiveShadow = true;

    // Now add the group to our scene
    scene.add( root );

    orbitControls = new THREE.OrbitControls(camera, renderer.domElement);

    animations(new THREE.Vector3(0,0,0));
}
