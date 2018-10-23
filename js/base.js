// 1. Enable shadow mapping in the renderer.
// 2. Enable shadows and set shadow parameters for the lights that cast shadows.
// Both the THREE.DirectionalLight type and the THREE.SpotLight type support shadows.
// 3. Indicate which geometry objects cast and receive shadows.

var renderer = null,
scene = null,
camera = null,
root = null,
player = null,
monster = null,
group = null,
orbitControls = null;

var objLoader = null, jsonLoader = null;

var duration = 20000; // ms
var currentTime = Date.now();

function loadObj(){
  if(!objLoader)
      objLoader = new THREE.OBJLoader();

  objLoader.load(
      './assets/models/characters/chicken/0.obj',

      function(object)
      {
          var texture = new THREE.TextureLoader().load('./assets/models/characters/chicken/0.png');
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
          scene.add(object);
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
    var angle = Math.PI * 2 * fract;

    if(player)
        player.rotation.y += angle / 2;

    if(monster)
        monster.rotation.y += angle / 2;
}

function run() {
    requestAnimationFrame(function() { run(); });

        // Render the scene
        renderer.render( scene, camera );

        // Spin the cube for next frame
        // animate();
        KF.update();

        // Update the camera controller
        orbitControls.update();
}

function onKeyDown(event){
  console.log(event.keyCode);
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


}

async function animations(vector){
    // position animation
    if (player.animation)
        player.animation.stop();

    player.animation = new KF.KeyFrameAnimator;
    player.animation.init({
        interps:
            [
                // {
                //     keys:[0, .25, .5, 1],
                //     values:[
                //             { x : 0 },
                //             { x : -Math.PI /8 },
                //             { x : -Math.PI /4},
                //             { x : -Math.PI /2},
                //             ],
                //     target:player.position
                // },
                {
                    keys:[0, .1, .2, .3],
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
        duration:1000,
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
    camera.position.set(-2, 6, 12);
    scene.add(camera);

    // Create a group to hold all the objects
    root = new THREE.Object3D;



    ambientLight = new THREE.AmbientLight ( 0xffffff );
    root.add(ambientLight);

    // Create the objects
    loadObj();

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

    animations(new THREE.Vector3());
}
