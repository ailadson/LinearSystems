/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	"use strict";

	class Vector {
	  constructor(coordinates) {
	    this.coordinates = coordinates;
	    this.dimension = coordinates.length;
	  }

	  equalTo(vector){
	    var a = this.coordinates;
	    var b = vector.coordinates;

	    if (a === b) return true;
	    if (a == null || b == null) return false;
	    if (a.length != b.length) return false;

	    for (var i = 0; i < a.length; i += 1) {
	      if (a[i] !== b[i]) return false;
	    }
	    return true;
	  }

	  add(vector){
	    var newVec = [];

	    for(var i = 0; i < this.coordinates.length; i +=1){
	      newVec[i] = this.coordinates[i] + vector.coordinates[i];
	    }

	    return newVec
	  }

	  subtract(vector){
	    var newVec = [];

	    for(var i = 0; i < this.coordinates.length; i +=1){
	      newVec[i] = this.coordinates[i] - vector.coordinates[i];
	    }

	    return newVec
	  }

	  multiply(scalar){
	    var newVec = [];

	    for(var i = 0; i < this.coordinates.length; i +=1){
	      newVec[i] = this.coordinates[i] * scalar;
	    }

	    return newVec
	  }
	}

	var v1 = new Vector([1.671, -1.012, -0.318]);

	console.log(v1.multiply(7.41))


/***/ }
/******/ ]);