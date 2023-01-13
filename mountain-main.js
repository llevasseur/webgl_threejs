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
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import Stats from 'three/addons/libs/stats.module.js';
import WebGL from 'three/addons/capabilities/WebGL.js';

/*========================================================================*/
/*      Definitions                                                       */
/*========================================================================*/

const VIEW_ANGLE = 45;
const NEAR = 0.1;
const FAR = 10000;
const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight
const ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT

/*========================================================================*/
/*      Global Variables                                                  */
/*========================================================================*/

let camera, container, controls, gui, renderer, stats, scene;
let sun, ground, mountain;
let clock, mesh;

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

    /** Stats */

    stats = new Stats();
    container.appendChild( stats.dom );

    /** Debug/GUI */

    gui = new GUI();

    /** Scene */

    scene = new THREE.Scene();

    /** Camera */

    camera = new THREE.PerspectiveCamera(
        VIEW_ANGLE, ASPECT, NEAR, FAR
    );
    camera.position.set( 100, 100, -100);
    const cameraFolder = gui.addFolder( "Camera" );
    cameraFolder.add(camera.position.x, "x", 0, 180, 0.1);
    cameraFolder.open();

}

init();

/*
#Variables
scene = undefined
camera = undefined
renderer = undefined
container = undefined
controls = undefined
clock = undefined
mesh = undefined
rotate = true

#Scene Start
start = ->
  scene = new THREE.Scene
  VIEW_ANGLE = 45
  NEAR = 0.1
  FAR = 10000
  SCREEN_WIDTH = window.innerWidth
  SCREEN_HEIGHT = window.innerHeight
  ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT
  #Create camera
  camera = new THREE.PerspectiveCamera VIEW_ANGLE, ASPECT, NEAR, FAR
  camera.position.set 107.82504298529939, 104.02121980722944, -114.02178601347767
  camera.rotation.set -2.4020274682629177, 0.6097939469542306, 2.6601321578044113
  camera.lookAt scene.position
  scene.add camera
  #Renderer
  renderer = new THREE.WebGLRenderer
    antialias: true
    alpha: true
  renderer.setSize SCREEN_WIDTH, SCREEN_HEIGHT
  #Window resize helper
  THREEx.WindowResize renderer, camera
  #Append Element
  container = document.getElementById('threejs')
  container.appendChild renderer.domElement
  #Add clock
  clock = new THREE.Clock
  #Orbit Controls
  controls = new THREE.OrbitControls camera, renderer.domElement

#
draw = ->
  #Add Hemisphere Light
  hemiLight = new THREE.HemisphereLight 0xffffff, 0xffffff, 0.6
  hemiLight.color.setHSL 0.6, 1, 0.6
  hemiLight.groundColor.setHSL 0.095, 1, 0.75
  hemiLight.position.set 0, 500, 0
  scene.add hemiLight

  #Add Directional light
  light = new THREE.DirectionalLight 0xffffff, 5
  light.position.set -2000, 0, -500
  light.castShadow = true
  scene.add light
  
  #Load Blender Model
  jsonLoader = new THREE.JSONLoader
  jsonLoader.load 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/150586/mountain.js?v=2.1', addMesh

#Add a model to the scene
addMesh = (geometry, materials) ->
  material = new THREE.MeshFaceMaterial materials
  mesh = new THREE.Mesh geometry, material
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.scale.set 12, 12, 12
  mesh.position.set 0, 0, -18
  scene.add mesh

#Animation Loop
animate = ->
  requestAnimationFrame animate
  controls.update()
  if rotate and mesh
    mesh.rotation.y += 0.2 * clock.getDelta()
  renderer.render scene, camera

#Start all the things!
start()
draw()
animate()
*/