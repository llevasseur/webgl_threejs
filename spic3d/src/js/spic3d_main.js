/**
 * ------ Solar Panel Interface Controller 3D (SPIC3D) ------
 *                  By Leevon Levasseur
 *                     Version 0.0.1
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import WebGL from 'three/addons/capabilities/WebGL.js';

import { Sky } from 'three/addons/objects/Sky.js';
// Import scene classes:
// Sun, Ground, Solar Panel, House

console.log(THREE);

if ( WebGL.isWebGL2Available() === false ) {

    document.body.appendChild( WebGL.getWebGL2ErrorMessage() );

}
let container, stats;
let renderer, scene, camera;
let controls, ground, sun, solar;

const debug = 1;

init();
animate();

function init() {

    // Renderer

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container = document.getElementById( 'container' )
    container.appendChild( renderer.domElement );

    if (debug == 1) console.log("Test case Renderer passed!");

    // Scene

    scene = new THREE.Scene();

    // Camera

    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.set( 30, 30, 100 );

    if (debug == 1) console.log("Test case Camera passed!");

    // Ground

    let groundMesh;
    const normalVector = new THREE.Vector3( 0, 1, 0 );
    const planeConstant = 0.01; // this value must be slightly higher than the groundMesh's y position of 0.0
    let groundPlane = new THREE.Plane( normalVector, planeConstant );

    const groundGeometry = new THREE.BoxGeometry( 30, 0.01, 40 );
    const groundMaterial = new THREE.MeshLambertMaterial( { color: 'rgb(0,130,0)' } );
    groundMesh = new THREE.Mesh( groundGeometry, groundMaterial );
    groundMesh.position.y = 0.0; //this value must be slightly lower than the planeConstant
    scene.add( groundMesh );

    if (debug == 1) console.log("Test case Ground passed!");

    // Skybox

    const sky = new Sky();
    sky.scale.setScalar( 10000 );
    scene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const parameters = {
        elevation: 2,
        azimuth: 180
    };

    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    let renderTarget;

    if (debug == 1) console.log("Test case Skybox passed!");

    // Sun

    sun = new THREE.Vector3();

    function updateSun() {

        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );

        if ( renderTarget !== undefined ) renderTarget.dispose();

        renderTarget = pmremGenerator.fromScene( sky );

        scene.environment = renderTarget.texture;

    }

    updateSun();

    if (debug == 1) console.log("Test case Sun passed!");

    // Solar Panel (Black Box)

    const geometry = new THREE.BoxGeometry( 30, 30, 30 );
    const material = new THREE.MeshStandardMaterial( { roughness: 0 } );

    solar = new THREE.Mesh( geometry, material );
    solar.position.y = 20;
    scene.add( solar );

    if (debug == 1) console.log("Test case Solar Panel passed!");

    // Orbit Controls

    controls = new OrbitControls( camera, renderer.domElement );
    //controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set( 0, 10, 0 );
    controls.minDistance = 40.0;
    controls.maxDistance = 200.0;
    controls.update();

    if (debug == 1) console.log("Test case Orbit Controls passed!");

    // Stats

    stats = new Stats();
    container.appendChild( stats.dom );

    if (debug == 1) console.log("Test case Stats passed!");

    // GUI

    const gui = new GUI();

    const folderSky = gui.addFolder( 'Sky' );
    folderSky.add( parameters, 'elevation', 0, 180, 0.1 ).onChange( updateSun );
    folderSky.add( parameters, 'azimuth', - 180, 180, 0.1 ).onChange( updateSun );
    folderSky.open();

    if (debug == 1) console.log("Test case GUI passed!");

    // Handle Window Resize

    window.addEventListener( 'resize', onWindowResize );

    if (debug == 1) console.log("Test case Init passed!");
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );
    //render();
    renderer.render( scene, camera );
    stats.update();

}

function render() {

    const time = performance.now() * 0.001;

    mesh.position.y = Math.sin( time ) * 20 + 5;
    mesh.rotation.x = time * 0.5;
    mesh.rotation.z = time * 0.51;

    water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

    renderer.render( scene, camera );

}