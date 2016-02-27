"use strict";
var Plane = require('./plane');
var Decimal = require('decimal');

class LinearSystem {
  constructor(planes) {
    this.planes = planes;
    this.dimensions = planes.length;
  }

  computeRREF(){
    var t = this.computeTriangularForm();

    t.planes.forEach(function(plane, i){
      var divisor = plane.getValueFromPosition(i);

      if(divisor !== 0 && !plane.normal.isZeroVector()){
        t.multiplyCoefficientAndRowBang(Decimal(1).div(divisor), i);
      }
    });

    for (var i = t.planes.length-1; i >= 0; i--) {
      var plane = t.planes[i];

      if(plane.normal.isZeroVector()){
        continue;
      }

      for (var j = i - 1; j >= 0; j--) {
        var otherPlane = t.planes[j];
        var pivotCoefficient = t.getPivotCoefficient(plane, otherPlane, i);
        t.addMultipleTimesRowToRow(pivotCoefficient, i, j);
      }
    }

    return t;
  }

  computeTriangularForm(){
    var triLinSys = this.dup();
    var order = triLinSys._getSwapOrder();
    triLinSys._runSwaps(order);

    triLinSys.planes.forEach(function(plane, i){
      this.computeRow(plane, i);
    }, triLinSys);

    return triLinSys;
  }

  computeRow(plane, currentIdx){
    for (var i = currentIdx + 1; i < this.planes.length; i++) {
      var otherPlane = this.planes[i];
      var pivotCoefficient = this.getPivotCoefficient(plane, otherPlane, currentIdx);
      this.addMultipleTimesRowToRow(pivotCoefficient, currentIdx, i);
    }
  }

  getPivotCoefficient(plane, otherPlane, pivot){
    var pCoef = plane.getValueFromPosition(pivot);
    var coef = otherPlane.getValueFromPosition(pivot);
    return Decimal(-coef).div(pCoef).toNumber();
  }

  dup(){
    var planes = this.planes.map(function(plane){
      return plane.dup();
    });

    return new LinearSystem(planes);
  }

  _runSwaps(order){
    var i = 0;
    while(i < order.length){
      var swappedIdx = order[i];
      var diff = swappedIdx - i;


      if(diff){
        this.swapRows(i, i + diff);
        var temp = order[i];
        order[i] = order[i + diff];
        order[i + diff] = temp;
      } else {
        i+=1;
      }
    }
  }

  _getSwapOrder(){
    var order = [];

    for (var i = 0; i < this.dimensions; i += 1) {
      order.push(this.findFirstNonZeroCoefficient(i, order));
    }
    return order;
  }

  findFirstNonZeroCoefficient(d, alreadyFound){
    var first = Infinity;

    this.planes.forEach(function(plane, i){
      if ( (alreadyFound.indexOf(i) === -1) && (i < first) && plane.getValueFromPosition(d) !== 0) {
        first = i;
      }
    });

    return first;
  }

  swapRows(row1, row2){
    row1 = this.planes[row1];
    row2 = this.planes[row2];

    row1.forEach(function(ele, i){
      row1.setValueAtPosition(i, row2.getValueFromPosition(i));
      row2.setValueAtPosition(i, ele);
    });

    var temp = row1.k;
    row1.k = row2.k;
    row2.k = temp;
  }

  multiplyCoefficientAndRowBang(coefficient, row){
    var p = this.multiplyCoefficientAndRow(coefficient, row);
    this.planes[row] = p;
  }

  multiplyCoefficientAndRow(coefficient, row){
    row = this.planes[row];
    var multipliedNormal = [];

    row.forEach(function(d, i){
      multipliedNormal[i] = Decimal(d).mul(coefficient).toNumber();
    })

    return new Plane(multipliedNormal, Decimal(row.k).mul(coefficient).toNumber());
  }

  addMultipleTimesRowToRow(coefficient, addingRow, addedToRow){
    addingRow = this.multiplyCoefficientAndRow(coefficient, addingRow);
    var addedToPlane = this.planes[addedToRow];
    var normal = [];

    addedToPlane.forEach(function(d, i){
      var addVal = addingRow.getValueFromPosition(i);
      normal[i] = Decimal(d).add(addVal).toNumber();
    });

    this.planes[addedToRow] = new Plane(normal, Decimal(addedToPlane.k).add(addingRow.k));
  }

  print(){
    this.planes.forEach(function(plane){
      plane.print();
    });
    console.log("------------")
  }
}
