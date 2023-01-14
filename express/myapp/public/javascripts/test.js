/**
 * @license
 * Copyright 2010-2022 Three.js Authors
 * SPDX-License-Identifier: MIT
 */

/**************************************************************************/
/*      Program Information - Express threejs test                        */
/*========================================================================*/
/*  AUTHOR: Leevon Levasseur                                              */
/*  COMPANY: Wisertech Marine Technologies                                */
/*  DATE CREATED: January 13, 2022                                        */
/*  LAST REVISED: Januray 13, 2022                                        */
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

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { GUI } from 'three/addons/libs/dat.gui.module.js'
import Stats from 'three/addons/libs/stats.module.js'
import WebGL from 'three/addons/capabilities/WebGL.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { get } from '../../routes'

/*========================================================================*/
/*      Definitions                                                       */
/*========================================================================*/

const RAD = Math.PI / 180

/*========================================================================*/
/*      Global Variables                                                  */
/*========================================================================*/

let camera, container, controls, gui, renderer, stats, scene
let sun, ground, mountain
let debug = 1

/*========================================================================*/
/*      WebGL Access Check                                                */
/*========================================================================*/

if ( WebGL.isWebGL2Available() === false ) {

    document.body.appendChild( WebGL.getWebGL2ErrorMessage() )

}
/*========================================================================*/
/*      Classes                                                           */
/*========================================================================*/
class leevon {
    constructor() {
        this.name = "Leevon"
    }

    get() {
        return this.name;
    }
}

//! Function to shift items in an array bar, returns updated array
function foo(bar) {
    let tmp = bar[0], ind = 0
    for (ind = 0; ind < bar.length-1; bar++) {
        b[ind] = bar[ind+1]
    }
    bar[ind] = tmp;
    return bar
}


/*========================================================================*/
/*      Functions                                                         */
/*========================================================================*/

function init() {

    // container

    container = document.getElementById( 'container' )

    // renderer

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth, window.innerHeight )
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap // default THREE.PCFShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    container.appendChild( renderer.domElement )

    // stats

    stats = new Stats();
    container.appendChild( stats.dom )

    // camera

    camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 )
    camera.position.set( -50, 50, -70 )
    camera.up = new THREE.Vector3(0, 1, 0)

    // controls
    
    controls = new OrbitControls( camera, renderer.domElement )
    //controls.maxPolarAngle = Math.PI * 0.495;
    controls.target.set( 0, 10, 0 )
    controls.minDistance = 4.0
    controls.maxDistance = 200.0
    controls.update()

    // scene

    scene = new THREE.Scene();
    scene.background = new THREE.Color('Skyblue')

    // Objects

    // GUI
    gui = new GUI();

    // Handle window resize

    window.addEventListener( 'resize', onWindowResize )

    if (debug == 1) console.log("Test case Init passed!")
}

function render() {

    renderer.render( scene, camera )

}

function animate() {

    requestAnimationFrame( animate )
    render()
    stats.update()

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize( window.innerWidth, window.innerHeight )

}

/*========================================================================*/
/*      Function Calls                                                    */
/*========================================================================*/

init()
animate()
