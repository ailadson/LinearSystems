"use strict";
var Vector = require('./vector');

class Plane {
  constructor(normal, k) {
    this.normal = new Vector(normal);
    this.k = k;
    this._setBasePoint();
  }

  getValueFromPosition(idx){
    return this.normal.coordinates[idx];
  }

  setValueAtPosition(idx, val){
    this.normal.coordinates[idx] = val;
  }

  forEach(cb){
    this.normal.coordinates.forEach(cb);
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
      str += (ele + "|");
    });

    console.log(str);
  }

  equalTo(plane){
    return (this.k === plane.k && this.normal.equalTo(plane.normal));
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
