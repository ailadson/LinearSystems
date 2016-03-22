"use strict";
var Vector = require('./vector');

class Plane {
  constructor(normal, k) {
    this.normal = new Vector(normal);
    this.k = k;
    this._setBasePoint();
  }

  isForm0EqualK () {
    return (this.isVariableLeading(this.normal.dimension));
  }

  isVariableLeading(i){
    if(this.k === 0){
        return false;
    }

    for (var i = i-1; i >= 0; i--) {
      if(this.getValueFromPosition(i) !== 0){
        return false;
      }
    }

    return true;
  }

  getValueFromPosition(idx){
    return this.normal.coordinates[idx];
  }

  setValueAtPosition(idx, val){
    this.normal.coordinates[idx] = val;
  }

  forEach(cb, thisArg){
    this.normal.coordinates.forEach(cb, thisArg);
  }

  cleanUpRounding(){
    this.forEach(function(el, i){
      var val = Math.abs(el);

      if(val < 0.000000001 || (1 - val) < 0.000000001){
        this.setValueAtPosition(i, Math.round(el));
      }
    }, this);

    var k = Math.abs(this.k);

    if(k < 0.000000001 || (1 - k) < 0.000000001){
      this.k = Math.round(this.k);
    }
  }

  isParallel(plane){
    return this.normal.isParallel(plane.normal);
  }

  isCoincident(plane){
    var diffVector = this.basepoint.subtract(plane.basepoint);

    if(diffVector.isOrthogonal(this.normal) && diffVector.isOrthogonal(plane.normal)){
      return true;
    }

    return false;
  }

  getIntersection(plane){
    if(this.isParallel(plane)){
      return (this.isCoincident(plane) ? "same plane" : "no intersect");
    } else {
      return "not parallel";
    }
  }

  dup(){
    var normal = [];

    this.normal.coordinates.forEach(function(i){
      normal.push(i);
    });

    return new Plane(normal, this.k);
  }

  print(){
    var str = this.k + ": ";

    this.forEach(function(ele){
      str += (ele + " =|= ");
    });

    console.log(str.slice(0, str.length - 5));
  }

  equalTo(plane){
    var diff = (this.k - plane.k);
    return (diff < 0.0000000000001 && this.normal.equalTo(plane.normal));
  }

  //private
  _setBasePoint(){
    var idx = this._getFirstNonZeroIndex(this.normal.coordinates);
    var initialCoefficient = this.normal.coordinates[idx];
    var basepoint = this._getOriginPoint();

    basepoint[idx] = this.k/initialCoefficient;
    this.basepoint = new Vector(basepoint);
  }

  _getFirstNonZeroIndex(coords){
    for (var i = 0; i < coords.length; i++) {
      if(Math.abs(coords[i]) > 0.000000001){
        return i;
      }
    }
  }

  _getOriginPoint(){
    return this.normal.coordinates.map(function(){
      return 0;
    });
  }
}

Plane.noZeroElementMsg = "No non zero elements in normal";

module.exports = Plane;
