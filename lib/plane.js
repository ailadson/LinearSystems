"use strict";
var Vector = require('./vector');

class Plane {
  constructor(normal, k) {
    this.normal = new Vector(normal);
    this.k = k;
    this._setBasePoint();
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

    throw Plane.noZeroElementMsg;
  }

  _getOriginPoint(){
    return this.normal.coordinates.map(function(){
      return 0;
    });
  }
}

Plane.noZeroElementMsg = "No non zero elements in normal";

var p1 = new Plane([-7.926, 8.625, -7.212], -7.952);
var p2 = new Plane([-2.642, 2.875, -2.404], 2.443);

console.log(p1.getIntersection(p2));
