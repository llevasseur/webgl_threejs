/**
 * @file Class for ground component in THREEJS.
 * @module ground
 * @author Leevon Levasseur <wisertechleevon@gmail.com>
 * @version 0.0.1
 * @copyright Wisertech
 * 
 * @todo Create constructor
 * @todo Test jsdoc 3 for a module/class
 * @todo Add functions to get,set,delete,rename,etc
 */

/** Imports */
import * as THREE from 'three';

/**
 * Create a ground plane for a THREEjs world.
 * @constructor
 */
class ground {

    constructor(name = 'ground') {
        this._name = name;
        this._position = new THREE.Vector3(0.0, 0.0, 0.0);
        this._geometry = new THREE.PlaneGeometry(16000, 16000);
        this._material = new THREE.MeshLambertMaterial({
            map: textureFloor,
            color: 0X999999,
            side: THREE.DoubleSide
        });
    }

    get name() {
        return this._name;
    }

    get position() {
        return this._position;
    }

    /**
     * @public
     * @param {string} newName 
     */
    set name(newName) {
        this._name = newName;
    }

    /**
     * @public
     * @param {THREE.Vector3} vec
     */
    set position(vec) {
        this._position.set(vec);
    }

    //set material(map, color = 0X999999, side = THREE.DoubleSide) {}
    
}

module.exports = ground;