/**
 * ------ Solar Panel Interface Controller 3D (SPIC3D) ------
 *                  By Leevon Levasseur
 *                     Version 0.0.3
 */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';

import { Sky } from 'three/addons/objects/Sky.js';
import { Vector2, Vector3 } from 'three';

if ( WebGL.isWebGL2Available() === false ) {

    document.body.appendChild( WebGL.getWebGL2ErrorMessage() );

}

// General Global Variables

let container, stats;
let renderer, scene, camera, sky;
let controls, sun, ambient, nightLight, solar;

let pmremGenerator;
let renderTarget;

// Real-Time Sun Global Variables

let heading, theta = -45, delta = 45, lat, lng;
let xOffset = -1;
let radius = window.innerWidth / 10;
let cursorX, cursorY, animation = false;
let lamp;

let date, hour = 16, minute = 36;

const parameters = {
    hour_param: hour
};

// Time Mesh Global Variables

let hourMesh=null;
let minMesh=null;
let objColor = new THREE.Color('black');
let colonMesh, loadedFont = null;

let textureObj = new THREE.TextureLoader().load("../../textures/sun-tracker/download.jpg");
textureObj.wrapS = THREE.RepeatWrapping;
textureObj.wrapT = THREE.RepeatWrapping;
textureObj.repeat.set(1, 1);

var textureFloor = new THREE.TextureLoader().load("../../textures/terrain/grasslight-big.jpeg");
textureFloor.wrapS = THREE.RepeatWrapping;
textureFloor.wrapT = THREE.RepeatWrapping;
textureFloor.repeat.set(1, 1);

const debug = 1;

const RAD = Math.PI / 180;

init();

function init() {

    container = document.getElementById( 'container' );

    // Renderer

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild( renderer.domElement );

    // Render Shading

    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    if (debug == 1) console.log("Test case Renderer passed!");

    // Scene

    scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

    // Camera

    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.set( -500, 500, -700 );
    camera.up = new THREE.Vector3(0, 1, 0);
    //camera.lookAt(new THREE.Vector3(0, 0, 0));

    if (debug == 1) console.log("Test case Camera passed!");

    // Ground

    function makeGround() {

        let geometry = new THREE.PlaneGeometry(16000, 16000);
        let material = new THREE.MeshLambertMaterial({ map: textureFloor, color: 0X999999, side: THREE.DoubleSide });
        const ground = new THREE.Mesh(geometry, material);
        ground.rotation.x = - Math.PI / 2;
        ground.material.map.repeat.set( 256, 256 );
        ground.material.map.wrapS = THREE.RepeatWrapping;
        ground.material.map.wrapT = THREE.RepeatWrapping;
        ground.material.map.encoding = THREE.sRGBEncoding;

        scene.add( ground );
        // note that because the ground does not cast a shadow, .castShadow is left false
        ground.receiveShadow = true;

        if (debug == 1) console.log("Test case Ground passed!");
    }
    
    makeGround();

    // Sun

    function makeSun() {

        sun = new THREE.DirectionalLight(0xFFFFFF, 0.5);
        sun.castShadow = true;
        scene.add(sun);
        sun.name = "Sun"

    }

    makeSun();

    // Ambient Light
    ambient = new THREE.AmbientLight( 0x222222 );
    scene.add( ambient );

    // Night Light
    nightLight = new THREE.PointLight(new THREE.Color("grey"), 1);
    nightLight.castShadow = true;
    nightLight.name = ("nightlight");
    nightLight.position.x = 30;
    nightLight.position.y = 40;
    nightLight.position.z = 0;

    // Sun Shadow Properties

    sun.shadow.mapSize.width = 512;  // default;
    sun.shadow.mapSize.height = 512; // default;
    sun.shadow.camera.near = 0.5;    // default;
    sun.shadow.camera.far = 500;     // default;

    // Solar Panel
    /* let mtlLoader = new MTLLoader();
    mtlLoader.setPath('../assets/');
    mtlLoader.load('panel_azimuth.mtl', (materials) => {
        materials.preload();

        let objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('../assets/');
        objLoader.load('panel_azimuth.obj', (object) =>  {
            scene.add(object);
        });
    }); */
    /*let objLoader = new OBJLoader();
    objLoader.setPath('../assets/');
    objLoader.load('tree_default.obj', (object) =>  {
        scene.add(object);
    });*/
    /*var mesh = null;

    var mtlLoader = new MTLLoader();
    mtlLoader.setPath( "https://threejs.org/examples/models/obj/walt/" );
    mtlLoader.load( 'WaltHead.mtl', function( materials ) {

        materials.preload();

        var objLoader = new OBJLoader();
        objLoader.setMaterials( materials );
        objLoader.setPath( "https://threejs.org/examples/models/obj/walt/" );
        objLoader.load( 'WaltHead.obj', function ( object ) {

            mesh = object;
            mesh.position.y = -50;
            scene.add( mesh );

        } );

    } );*/
    
    if (debug == 1) console.log("Test case Solar passed!");

    // Stand
    /*mtlLoader.load('mat_stand_azimuth.mtl', (materials) => {
        materials.preload();

        let objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.setPath('../Unit 1 OBJ Files/');
        objLoader.load('stand_azimuth.obj', (object) => {
            object.scale.set(0.01, 0.01, 0.01);
            scene.add(object);
        });
    });*/
    


    // Orbit Controls

    controls = new OrbitControls( camera, renderer.domElement );
    //controls.maxPolarAngle = Math.PI * 0.5;
    controls.target.set( 0, 10, 0 );
    controls.minDistance = 4.0;
    controls.maxDistance = 20000.0;
    controls.update();

    if (debug == 1) console.log("Test case Orbit Controls passed!");

    // Stats

    stats = new Stats();
    container.appendChild( stats.dom );

    if (debug == 1) console.log("Test case Stats passed!");

    // GUI

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

    // Set Date
    //if (date == null) date = new Date();
    date = new Date('December 21, 2022 9:00:00')
    hour = date.getHours();
    minute = date.getMinutes();

    if (animation == true) {
        minute += 1;
        date = new Date(date.getTime()+60000);
    }
    if (minute > 60) {
        hour += 1;
        minute = 0;

        if (hour == 24) {
            hour = 0;
        }
    }

    const position = getCurrentPosition();

    if ((hour + minute / 60 > 17.25) || (hour + minute / 60 < 6.50)) {
        // Evening / Early Morning

        scene.remove(sun);
        scene.add(nightLight);
        scene.background = new THREE.Color("#1a0d00");

    } else {

        // Day
        scene.add(sun);
        sun.position.x = position.x;
        sun.position.y = position.y;
        sun.position.z = position.z;
        console.log(sun.position)
        scene.remove(nightLight);
        scene.background = new THREE.Color('#ccffff');

    }

    requestAnimationFrame( animate );
    render();
    stats.update();

}

function render() {

    const time = performance.now() * 0.001;


    renderer.render( scene, camera );

}

{
    navigator.geolocation.getCurrentPosition(setPos);
    function setPos(position) {

        lat = position.coords.latitude;
        lng = position.coords.longitude;

        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', function(evt) {
                if (evt.alpha !== null) {
                    heading = compassHeading(evt.alpha, evt.beta, evt.gamma);
                }
            }, false);
        } else {
            alert("not supported");
        }
        animate();

    }
}

function getCurrentPosition() {

    const sunLocation = getSunLocation(date);
    let offset = 0;
    
    if (heading != null) {
        offset = heading - 180;
    }

    // Set -x axis as East
    theta = - (sunLocation.azimuth + 90 + offset);

    delta = sunLocation.altitude;
    const apparentRadius = radius * Math.cos(delta * RAD);

    return new THREE.Vector3(
        apparentRadius * Math.cos(theta * RAD),
        apparentRadius * Math.sin(theta * RAD),
        apparentRadius * Math.sin(delta * RAD)
    );

}

function getSunLocation(date) {

    const location = SunCalc.getPosition(date, lat, lng);
    const fromSouth = toDegree(location.azimuth);
    let fromNorth = fromSouth;

    if (fromSouth < 0) {
        fromNorth += 180;
    } else {
        fromNorth -= 180;
    }

    return {
        azimuth: fromNorth,
        altitude: toDegree(location.altitude)
    };

}

function toDegree(rad) {

    return rad * 180 / Math.PI;

}

function compassHeading(alpha, beta, gamma) {

    // Convert degrees to radians
    const alphaRad = alpha * RAD;
    const betaRad = beta * RAD;
    const gammaRad = gamma * RAD;

    // Calculate equation components
    const cA = Math.cos(alphaRad);
    const sA = Math.sin(alphaRad);
    const cB = Math.cos(betaRad);
	const sB = Math.sin(betaRad);
	const cG = Math.cos(gammaRad);
	const sG = Math.sin(gammaRad);

    // Calculate A, B, C rotation components
	const rA = - cA * sG - sA * sB * cG;
	const rB = - sA * sG + cA * sB * cG;
	const rC = - cB * cG;

    // Calculate compass heading
	const compassHeading = Math.atan(rA / rB);

    // Convert from half unit circle to whole unit circle
	if (rB < 0) {
		compassHeading += Math.PI;
	} else if (rA < 0) {
		compassHeading += 2 * Math.PI;
	}
	// Convert radians to degrees
	compassHeading = toDegree(compassHeading);

	return compassHeading;
}