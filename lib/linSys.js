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

    // t.planes.forEach(function(plane, i){
    //   var divisor = plane.getValueFromPosition(i);
    //
    //   if(divisor !== 0 && !plane.normal.isZeroVector()){
    //     t.multiplyCoefficientAndRowBang((1/divisor), i);
    //   }
    // });
    //
    // for (var i = t.planes.length-1; i >= 0; i--) {
    //   var plane = t.planes[i];
    //
    //   if(plane.normal.isZeroVector()){
    //     continue;
    //   }
    //
    //   for (var j = i - 1; j >= 0; j--) {
    //     var otherPlane = t.planes[j];
    //     var pivotCoefficient = t.getPivotCoefficient(plane, otherPlane, i);
    //     t.addMultipleTimesRowToRow(pivotCoefficient, i, j);
    //   }
    // }

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
    return (-coef/pCoef);
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
      multipliedNormal[i] = d * coefficient;
    })

    return new Plane(multipliedNormal, row.k * coefficient);
  }

  addMultipleTimesRowToRow(coefficient, addingRow, addedToRow){
    addingRow = this.multiplyCoefficientAndRow(coefficient, addingRow);
    var addedToPlane = this.planes[addedToRow];
    var normal = [];

    addedToPlane.forEach(function(d, i){
      var addVal = addingRow.getValueFromPosition(i);
      normal[i] = (d + addVal);
    });

    this.planes[addedToRow] = new Plane(normal, addedToPlane.k + addingRow.k);
  }

  print(){
    this.planes.forEach(function(plane){
      plane.print();
    });
    console.log("------------")
  }
}


// var p1 = new Plane([1,1,1], 1);
// var p2 = new Plane([0,1,1], 2);
// var s = new LinearSystem([p1,p2]);
// s.print();
// var r = s.computeRREF()
// r.print();
// if not (r[0] == Plane(normal_vector=Vector(['1','0','0']), constant_term='-1') and
//         r[1] == p2):
//     print 'test case 1 failed'



// var p1 = new Plane([1,1,1],1);
// var p2 = new Plane([1,1,1],2);
// var s = new LinearSystem([p1,p2]);
// s.print();
// var r = s.computeRREF()
// r.print();
// // if not (r[0] == p1 and
// //         r[1] == Plane(constant_term='1')):
// //     print 'test case 2 failed'



// var p1 = new Plane([1,1,1], 1);
// var p2 = new Plane([0,1,0], 2);
// var p3 = new Plane([1,1,-1], 3);
// var p4 = new Plane([1,0,-2], 2);
// var s = new LinearSystem([p1,p2,p3,p4]);
// s.print();
// var r = s.computeRREF()
// r.print();
// if not (r[0] == Plane(normal_vector=Vector(['1','0','0']), constant_term='0') and
//         r[1] == p2 and
//         r[2] == Plane(normal_vector=Vector(['0','0','-2']), constant_term='2') and
//         r[3] == Plane()):


// var p1 = new Plane([0,1,1], 1);
// var p2 = new Plane([1,-1,1], 2);
// var p3 = new Plane([1,2,-5], 3);
// var s = new LinearSystem([p1,p2,p3]);
// s.print();
// var r = s.computeRREF()
// r.print();
// if not (r[0] == Plane(normal_vector=Vector(['1','0','0']), constant_term=Decimal('23')/Decimal('9')) and
//         r[1] == Plane(normal_vector=Vector(['0','1','0']), constant_term=Decimal('7')/Decimal('9')) and
//         r[2] == Plane(normal_vector=Vector(['0','0','1']), constant_term=Decimal('2')/Decimal('9'))):
//     print 'test case 4 failed'

var p1 = new Plane([1, 1, 1], 0);
var p2 = new Plane([1, -2, 2], 4);
var p3 = new Plane([1, 2, -1], 2);
var s = new LinearSystem([p1, p2, p3]);
s.print();
var r = s.computeRREF();
r.print();
