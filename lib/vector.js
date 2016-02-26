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
      var aRounded = Math.round(a[i] * 1000) / 1000;
      var bRounded = Math.round(b[i] * 1000) / 1000;
      if ( aRounded !== bRounded) return false;
    }
    return true;
  }

  add(vector){
    var newVec = [];

    for(var i = 0; i < this.coordinates.length; i +=1){
      newVec[i] = this.coordinates[i] + vector.coordinates[i];
    }

    return new Vector(newVec);
  }

  subtract(vector){
    var newVec = [];

    for(var i = 0; i < this.coordinates.length; i +=1){
      newVec[i] = this.coordinates[i] - vector.coordinates[i];
    }

    return new Vector(newVec);
  }

  multiply(scalar){
    var newVec = [];

    for(var i = 0; i < this.coordinates.length; i +=1){
      newVec[i] = this.coordinates[i] * scalar;
    }

    return new Vector(newVec);
  }

  magnitude(){
    var sum = 0;

    this.coordinates.forEach(function(coord){
      sum += (coord * coord);
    });

    return Math.sqrt(sum);
  }

  isZeroVector(){
    for(var i = 0; i < this.coordinates.length; i +=1){
      if(this.coordinates[i] != 0){ return false ;}
    }
    return true;
  }

  normalize(){
    if(this.isZeroVector()){ return 0; }
    return this.multiply(1/this.magnitude());
  }

  dotProduct(vector){
    var sum = 0;

    for(var i = 0; i < this.coordinates.length; i +=1){
      sum += this.coordinates[i] * vector.coordinates[i];
    }

    return sum;
  }

  angle(vector, inDegrees){
    if(this.isZeroVector() || vector.isZeroVector()){ return 0; }

    var dotProduct = this.dotProduct(vector);
    var arcos = dotProduct/(this.magnitude() * vector.magnitude());

    if(inDegrees){
      return (Math.acos(arcos) * 180)/Math.PI;
    }
    return Math.acos(arcos);
  }

  abs(){
    var absVec = [];

    for(var i = 0; i < this.coordinates.length; i +=1){
      absVec[i] = Math.abs(this.coordinates[i]);
    }

    return new Vector(absVec);
  }

  isParallel(vector){
    if(this.isZeroVector() || vector.isZeroVector()){
      return true;
    }

    if(this.abs().normalize().equalTo(vector.abs().normalize())){
      return true;
    }

    return false;
  }

  isOrthogonal(vector){
    return this.round(this.dotProduct(vector)) === 0;
  }

  round(num){
    return Math.abs(Math.round(num * 1000) / 1000);
  }

  projectionOf(vector){
    var product = vector.dotProduct(this.normalize())
    return this.normalize().multiply(product);
  }

  orthogonalOf(vector){
    var projection = this.projectionOf(vector);
    return vector.subtract(projection);
  }

  crossProduct(vector){
    var x1 = this.coordinates[0];
    var y1 = this.coordinates[1];
    var z1 = this.coordinates[2];

    var x2 = vector.coordinates[0];
    var y2 = vector.coordinates[1];
    var z2 = vector.coordinates[2];

    var crossCoords = [
      ((y1 * z2) - (y2 * z1)),
      (-1 * ((x1 * z2) - (x2 * z1))),
      ((x1 * y2) - (x2 * y1))
    ];

    return new Vector(crossCoords);
  }

  areaOfParallelogram(vector){
    var crossProduct = this.crossProduct(vector);
    return crossProduct.magnitude();
  }

  areaOfTriangle(vector){
    return (this.areaOfParallelogram(vector) / 2);
  }
}

module.exports = Vector;
