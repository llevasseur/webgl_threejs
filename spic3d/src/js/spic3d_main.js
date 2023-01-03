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
import { ShadowMesh } from 'three/addons/objects/ShadowMesh.js';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import { Vector2, Vector3 } from 'three';
// Import scene classes:
// Sun, Ground, Solar Panel, House

if ( WebGL.isWebGL2Available() === false ) {

    document.body.appendChild( WebGL.getWebGL2ErrorMessage() );

}

let container, stats;
let renderer, scene, camera;
let controls, sun, solar, solarShadow;

const normalVector = new THREE.Vector3( 0, 1, 0 );
const planeConstant = 0.01; // this value must be slightly higher than the groundMesh's y position of 0.0
const groundPlane = new THREE.Plane( normalVector, planeConstant );

let light1 = null;
let light2 = null;
let light3 = null;

let arrowHelper1, arrowHelper2, arrowHelper3;
const arrowDirection = new THREE.Vector3();
let arrowPosition1 = new THREE.Vector3();
const arrowPosition2 = new THREE.Vector3();
const arrowPosition3 = new THREE.Vector3();

const lightPosition4D = new THREE.Vector4();

const debug = 1;

const ARROW_DIST = 50;

init();
animate();

function init() {

    container = document.getElementById( 'container' );

    // Renderer

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild( renderer.domElement );

    // Render Shading

    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    if (debug == 1) console.log("Test case Renderer passed!");

    // Scene

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( scene.background, 50, 15000 );
    scene.background = new THREE.Color().setHSL( 0.51, 0.4, 0.01 );

    // Camera

    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.set( 100, 60, 150 );

    if (debug == 1) console.log("Test case Camera passed!");

    // Ambient Light

    scene.add( new THREE.AmbientLight( 0x222222 ) );

    // Ground

    function makeGround() {

        const gt = new THREE.TextureLoader().load( '../../textures/terrain/grasslight-big.jpeg' );
		const gg = new THREE.PlaneGeometry( 16000, 16000 );
        const gm = new THREE.MeshPhongMaterial( { color: 0xffffff, map: gt } );

        const ground = new THREE.Mesh( gg, gm );
        ground.rotation.x = - Math.PI / 2;
        ground.material.map.repeat.set( 64, 64 );
        ground.material.map.wrapS = THREE.RepeatWrapping;
        ground.material.map.wrapT = THREE.RepeatWrapping;
        ground.material.map.encoding = THREE.sRGBEncoding;
        // note that because the ground does not cast a shadow, .castShadow is left false
        ground.receiveShadow = true;

        scene.add( ground );

        if (debug == 1) console.log("Test case Ground passed!");
    }
    
    makeGround();

    // Skybox

    const sky = new Sky();
    sky.scale.setScalar( 10000 );
    scene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 0.558;
    skyUniforms[ 'mieCoefficient' ].value = 0.009;
    skyUniforms[ 'mieDirectionalG' ].value = 0.9;

    const parameters = {
        elevation: 12,
        azimuth: 150
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

        // lensflares
        const textureLoader = new THREE.TextureLoader();

        const textureFlare0 = textureLoader.load( '../../textures/lensflare/lensflare0.png' );
        const textureFlare3 = textureLoader.load( '../../textures/lensflare/lensflare3.png' );
        const lensflare = new Lensflare();

        if (light3) scene.remove( light3 );
        light3 = new THREE.PointLight( 0xffffff, 1.5, 2000 );
        light3.color.setHSL( 0.995, 0.5, 0.9 );
        light3.position.set( sun.x*10000, sun.y*10000, sun.z*10000 );
        scene.add( light3 );
        lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, light3.color ) );

        lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
        lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );

        light3.add( lensflare );

        // Yellow Arrow Helpers
        if (arrowHelper1) scene.remove( arrowHelper1 );
        if (arrowHelper2) scene.remove( arrowHelper2 );
        if (arrowHelper3) scene.remove( arrowHelper3 );

        arrowDirection.subVectors( scene.position, sun ).normalize();

        arrowPosition1 = new Vector3( sun.x * ARROW_DIST, sun.y * ARROW_DIST + 10, sun.z * ARROW_DIST );
        arrowHelper1 = new THREE.ArrowHelper( arrowDirection, arrowPosition1, 10, 0xffff00, 1.5, 1 );
        arrowHelper1.visible = true;
        scene.add( arrowHelper1 );

        arrowPosition2.copy( arrowPosition1 ).add( new THREE.Vector3( 0, sun.z * 2, sun.y * 2 ) );
        arrowHelper2 = new THREE.ArrowHelper( arrowDirection, arrowPosition2, 10, 0xffff00, 1.5, 1 );
        scene.add( arrowHelper2 );

        arrowPosition3.copy( arrowPosition1 ).add( new THREE.Vector3( 0, sun.z * -2, sun.y * -2 ) );
        arrowHelper3 = new THREE.ArrowHelper( arrowDirection, arrowPosition3, 10, 0xffff00, 1.5, 1 );
        scene.add( arrowHelper3 );

        // Update lightPosition

        lightPosition4D.x = sun.x;
        lightPosition4D.y = sun.y;
        lightPosition4D.z = sun.z;
        lightPosition4D.w = 0.001;
        if (Math.abs(lightPosition4D.x) < 0.05) lightPosition4D.x = Math.sign(lightPosition4D.x) * 0.05;
        if (Math.abs(lightPosition4D.y) < 0.05) lightPosition4D.y = Math.sign(lightPosition4D.y) * 0.05;
        if (Math.abs(lightPosition4D.z) < 0.05) lightPosition4D.z = Math.sign(lightPosition4D.z) * 0.05;

    }

    updateSun();

    if (debug == 1) console.log("Test case Sun passed!");

    // Solar Panel (Black Box)

    function makeSolar() {

        const geometry = new THREE.BoxGeometry( 30, 30, 30 );
        const material = new THREE.MeshStandardMaterial( { roughness: 0 } );

        solar = new THREE.Mesh( geometry, material );
        solar.position.y = 15;
        scene.add( solar );

        solarShadow = new ShadowMesh( solar );
        scene.add( solarShadow );

        if (debug == 1) console.log("Test case Solar Panel passed!");

    }

    makeSolar();

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
    render();
    stats.update();

}

function render() {

    const time = performance.now() * 0.001;

    // Update Shadows
    
    solarShadow.update( groundPlane, lightPosition4D );


    renderer.render( scene, camera );

}