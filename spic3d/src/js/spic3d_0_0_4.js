/** 
 * @file Sets THREEJS Scene and Renderer embedded in the html.
 * @author Leevon Levasseur <wisertechleevon@gmail.com>
 * @version 0.0.4
 * @copyright Wisertech
 * 
 * @todo Test more jsdoc tags
 * @todo Create a visible sun using a point light
 * @todo Create a mountain using a heightmap
 * @todo Import a house into the scene
 * @todo Import multiple lightbulb's with wire connected to solar panel
 * @todo Add material to solar panel obj
 * @todo Animate solar panels to track sun. Keep stand static
 * @todo Animate lightbulb's to light up
 * @todo Add particle system to indicate energy moving from solar to bulb
 * @todo Convert to ECS
 * @todo Tidy into production level
*/

import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

import { GUI } from 'three/addons/libs/lil-gui.module.min.js'
import Stats from 'three/addons/libs/stats.module.js'
import WebGL from 'three/addons/capabilities/WebGL.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'

import { Sky } from 'three/addons/objects/Sky.js'
import { Vector2, Vector3 } from 'three'

if ( WebGL.isWebGL2Available() === false ) {

    document.body.appendChild( WebGL.getWebGL2ErrorMessage() )

}