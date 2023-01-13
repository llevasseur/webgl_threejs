/**************************************************************************/
/*      Program Information - Mountain Example                            */
/*========================================================================*/
/*  AUTHOR: Leevon Levasseur                                              */
/*  COMPANY: Wisertech Marine Technologies                                */
/*  DATE CREATED: January 12, 2022                                        */
/*  LAST REVISED: Januray 12, 2022                                        */
/*  REVISION: Initialization - basic world                                */
/*                                                                        */
/*  PROGRAM OVERVIEW:                                                     */
/*  This program renders a basic grass terrain with a mountain and sun    */
/*                                                                        */
/*  INPUTS:                                                               */
/*                                                                        */
/*  OUTPUTS:                                                              */
/*                                                                        */
/*  REMAINING WORK @ LAST REVISION                                        */
/*                                                                        */
/**************************************************************************/

/*========================================================================*/
/*      Libraries                                                         */
/*========================================================================*/
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { GUI } from 'three/addons/libs/dat.gui.module.js';
import Stats from 'three/addons/libs/stats.module.js';
import WebGL from 'three/addons/capabilities/WebGL.js';
import JSONLoader from 'three/addons/loaders/'

/*========================================================================*/
/*      Definitions                                                       */
/*========================================================================*/

const RAD = Math.PI / 180;

/*========================================================================*/
/*      Global Variables                                                  */
/*========================================================================*/

let camera, container, controls, gui, renderer, stats, scene;
let sun, ground, mountain;

let debug = 1;
/*========================================================================*/
/*      Security Check                                                    */
/*========================================================================*/

if ( WebGL.isWebGL2Available() === false ) {

    document.body.appendChild( WebGL.getWebGL2ErrorMessage() );

}
/*========================================================================*/
/*      Init                                                              */
/*========================================================================*/

function init() {

    container = $('#container')[0];
    
    /** Renderer */

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild( renderer.domElement );

    if (debug == 1) console.log("Test case Renderer passed!");

    /** Stats */

    stats = new Stats();
    container.appendChild( stats.dom );

    /** Camera */

    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.set( -50, 50, -70 );
    camera.up = new THREE.Vector3(0, 1, 0);
    //camera.lookAt(new THREE.Vector3(0, 0, 0));

    /** Controls */

    controls = new OrbitControls( camera, renderer.domElement );
    //controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set( 0, 10, 0 );
    controls.minDistance = 4.0;
    controls.maxDistance = 200.0;
    controls.update();

    /** Scene */

    scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

    /** GUI */

    gui = new GUI();
    let sliders = {
        widthSeg : 1000,
        heightSeg : 1000,
        heightMap : "heightmap.jpeg",
        horTexture: 0,
        vertTexture: 0,
        dispScale: 10
    };
    let ranges = [
        [0, 2000, 10],
        [0, 2000, 10],
        ["heightmap.jpeg", "", ""],
        [0, 3],
        [0, 3],
        [1, 100]
    ];
    gui.add(sliders, sliders.widthSeg, 0, 2000, 10).name("Width");
    gui.add(sliders, sliders.heightSeg, 0, 2000, 10).name("Height");
    //gui.add(sliders, sliders.heightMap).name("Image");
    gui.add(sliders, sliders.horTexture, 0, 3, 1).name("Horizontal Textures");
    gui.add(sliders, sliders.vertTexture, 0, 3, 1).name("Vertical Textures");
    gui.add(sliders, sliders.dispScale, 1, 100, 1).name("Disp Scale");

    /** Ground */

    function makeGround() {

        /*let textureFloor = new THREE.TextureLoader().load("../../textures/terrain/grasslight-big.jpeg");
        textureFloor.wrapS = THREE.RepeatWrapping;
        textureFloor.wrapT = THREE.RepeatWrapping;
        textureFloor.repeat.set(1, 1);

        let geometry = new THREE.PlaneGeometry(16000, 16000);
        let material1 = new THREE.MeshLambertMaterial({ map: textureFloor, color: 0X999999, side: THREE.DoubleSide });
        const ground = new THREE.Mesh(geometry, material1);
        ground.rotation.x = - Math.PI / 2;
        ground.material.map.repeat.set( 256, 256 );
        ground.material.map.wrapS = THREE.RepeatWrapping;
        ground.material.map.wrapT = THREE.RepeatWrapping;
        ground.material.map.encoding = THREE.sRGBEncoding;

        scene.add( ground );
        // note that because the ground does not cast a shadow, .castShadow is left false
        ground.receiveShadow = true;

        if (debug == 1) console.log("Test case Ground passed!");*/

        // 1. Plane Geometry, control width and height using sliders

        // 2. Use a textureLoader to create the displacementMap. Set path using a drop down menu in gui

        // 3. Wrap disMap. Repeat based on a slider

        // 4. Ground Material - use textureFloor here? Also link disMap

        // 5. Ground Mesh, add to scene, position and rotate.
    }
    
    makeGround();

    /** Sun */

    function makeSun() {

        sun = new THREE.DirectionalLight(0xFFFFFF, 0.5);
        sun.castShadow = true;
        scene.add(sun);
        sun.name = "Sun"

    }

    makeSun();


    /** Handle WIndow Resize */

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


    renderer.render( scene, camera );

}

init();
animate();