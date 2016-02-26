"use strict";
var Vector = require('./vector');

class Line {
  constructor(normal, k) {
    this.normal = new Vector(normal);
    this.k = k;
    this._setBasePoint();
  }

  isParallel(line){
    return this.normal.isParallel(line.normal);
  }

  isCoincident(line){
    var diffVector = this.basepoint.subtract(line.basepoint);

    if(diffVector.isOrthogonal(this.normal) && diffVector.isOrthogonal(line.normal)){
      return true;
    }

    return false;
  }

  getIntersection(line){
    if(this.isParallel(line)){
      return (this.isCoincident(line) ? "same line" : "no intersect");
    } else {
      return [this._getXIntersect(line) , this._getYIntersect(line)];
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
      if(coords[i] !== 0){
        return i;
      }
    }

    throw Line.noZeroElementMsg;
  }

  _getOriginPoint(){
    return this.normal.coordinates.map(function(){
      return 0;
    });
  }

  _getXIntersect(line){
    var D = line.normal.coordinates[1];
    var B = this.normal.coordinates[1];
    var denominator = this._getInterectDenominator(line);

    return ((D * this.k) - (B * line.k)) / denominator;
  }

  _getYIntersect(line){
    var C = line.normal.coordinates[0];
    var A = this.normal.coordinates[0];
    var denominator = this._getInterectDenominator(line);

    return ((A * line.k) - (C * this.k)) / denominator;
  }

  _getInterectDenominator(line){
    var A = this.normal.coordinates[0];
    var B = this.normal.coordinates[1];
    var C = line.normal.coordinates[0];
    var D = line.normal.coordinates[1];
    return ((A * D) - (B * C));
  }
}

Line.noZeroElementMsg = "No non zero elements in normal";

var l1 = new Line([1.182, 5.562], 6.744);
var l2 = new Line([1.773, 8.343], 9.525);

console.log(l1.getIntersection(l2));
