var assert = require('assert');

var LinearSystem = require("../lib/linSys");
var Plane = require("../lib/plane");
var Vector = require("../lib/vector");
var Decimal = require('decimal.js');

describe("Linear System", function () {
  describe("Row Opertations", function () {
    var p0 = new Plane([1,1,1], 1);
    var p1 = new Plane([0,1,0], 2);
    var p2 = new Plane([1,1,-1], 3);
    var p3 = new Plane([1,0,-2], 2);
    var s = new LinearSystem([p0.dup(),p1.dup(),p2.dup(),p3.dup()]);

    it("should swap rows", function(){
      s.swapRows(0,1);
      assert(s.planes[0].equalTo(p1), "*Bad Swap 0 - 1");
      assert(s.planes[1].equalTo(p0), "Bad Swap* 0 - 1");
      assert(s.planes[2].equalTo(p2), "Bad Swap 0 - 1");
      assert(s.planes[3].equalTo(p3), "Bad Swap 0 - 1");

      s.swapRows(1,3)
      assert(s.planes[0].equalTo(p1), "Bad Swap 1 - 3");
      assert(s.planes[1].equalTo(p3), "*Bad Swap 1 - 3");
      assert(s.planes[2].equalTo(p2), "Bad Swap 1 - 3");
      assert(s.planes[3].equalTo(p0), "Bad Swap* 1 - 3");

      s.swapRows(3,1)
      assert(s.planes[0].equalTo(p1), "Bad Swap 3 - 1");
      assert(s.planes[1].equalTo(p0), "Bad Swap* 3 - 1");
      assert(s.planes[2].equalTo(p2), "Bad Swap 3 - 1");
      assert(s.planes[3].equalTo(p3), "*Bad Swap 3 - 1");
    });

    it("should be able to multiply coefficient by row", function () {
      s.multiplyCoefficientAndRowBang(1,0)
      assert(s.planes[0].equalTo(p1), "*Unable to multiply coefficient by row 1 - 0");
      assert(s.planes[1].equalTo(p0), "Unable to multiply coefficient by row 1 - 0");
      assert(s.planes[2].equalTo(p2), "Unable to multiply coefficient by row 1 - 0");
      assert(s.planes[3].equalTo(p3), "Unable to multiply coefficient by row 1 - 0");

      s.multiplyCoefficientAndRowBang(-1,2)
      assert(s.planes[0].equalTo(p1), "Unable to multiply coefficient by row -1 - 2");
      assert(s.planes[1].equalTo(p0), "Unable to multiply coefficient by row -1 - 2");
      assert(s.planes[2].equalTo(new Plane([-1,-1,1], -3)), "*Unable to multiply coefficient by row -1 - 2");
      assert(s.planes[3].equalTo(p3), "Unable to multiply coefficient by row -1 - 2");

      s.multiplyCoefficientAndRowBang(10,1)
      assert(s.planes[0].equalTo(p1), "Unable to multiply coefficient by row 10 - 1");
      assert(s.planes[1].equalTo(new Plane([10,10,10], 10)), "*Unable to multiply coefficient by row 10 - 1");
      assert(s.planes[2].equalTo(new Plane([-1,-1,1], -3)), "Unable to multiply coefficient by row 10 - 1");
      assert(s.planes[3].equalTo(p3), "Unable to multiply coefficient by row 10 - 1");
    });

    it('should be able to add a row to another row N number of times', function () {
      s.addMultipleTimesRowToRow(0,0,1);
      assert(s.planes[0].equalTo(p1), "*Unable to add row N times to another row n=0, 0 - 1");
      assert(s.planes[1].equalTo(new Plane([10,10,10], 10)), "Unable to add row N times to another row* n=0, 0 - 1");
      assert(s.planes[2].equalTo(new Plane([-1,-1,1], -3)), "*Unable to add row N times to another row n=0, 0 - 1");
      assert(s.planes[3].equalTo(p3), "Unable to add row N times to another row n=0, 0 - 1");

      s.addMultipleTimesRowToRow(1,0,1);
      assert(s.planes[0].equalTo(p1), "*Unable to add row N times to another row n=1, 0 - 1");
      assert(s.planes[1].equalTo(new Plane([10,11,10], 12)), "Unable to add row N times to another row* n=1, 0 - 1");
      assert(s.planes[2].equalTo(new Plane([-1,-1,1], -3)), "Unable to add row N times to another row n=1, 0 - 1");
      assert(s.planes[3].equalTo(p3), "Unable to add row N times to another row n=1, 0 - 1");

      s.addMultipleTimesRowToRow(-1,1,0);
      assert(s.planes[0].equalTo(new Plane([-10,-10,-10], -10)), "Unable to add row N times to another row* n=-1, 1 - 0");
      assert(s.planes[1].equalTo(new Plane([10,11,10], 12)), "*Unable to add row N times to another row n=-1, 1 - 0");
      assert(s.planes[2].equalTo(new Plane([-1,-1,1], -3)), "Unable to add row N times to another row n=-1, 1 - 0");
      assert(s.planes[3].equalTo(p3), "Unable to add row N times to another row n=-1, 1 - 0");
    });
  });

  describe("Triangular Form", function () {
    it("should compute triangular form", function () {
      var p1 = new Plane([1,1 ,1], 1);
      var p2 = new Plane([0,1 ,1], 2);
      var s = new LinearSystem([p1.dup(),p2.dup()]);
      var t = s.computeTriangularForm();
      assert(t.planes[0].equalTo(p1));
      assert(t.planes[1].equalTo(p2));

      p1 = new Plane([1,1 ,1], 1);
      p2 = new Plane([1,1 ,1], 2);
      s = new LinearSystem([p1,p2])
      t = s.computeTriangularForm();
      assert(t.planes[0].equalTo(p1));
      assert(t.planes[1].equalTo(new Plane([0, 0, 0], 1)));

      p1 = new Plane([1,1 ,1], 1);
      p2 = new Plane([0,1 ,0], 2);
      var p3 = new Plane([1,1 ,-1], 3);
      var p4 = new Plane([1,0 ,-2], 2);
      s = new LinearSystem([p1,p2,p3,p4])
      t = s.computeTriangularForm();
      assert(t.planes[0].equalTo(p1));
      assert(t.planes[1].equalTo(p2));
      assert(t.planes[2].equalTo(new Plane([0 ,0 ,-2], 2)));
      assert(t.planes[3].equalTo(new Plane([0, 0, 0], 0)));


      p1 = new Plane([0,1 ,1], 1)
      p2 = new Plane([1,-1,1], 2)
      p3 = new Plane([1,2 ,-5], 3)
      s = new LinearSystem([p1,p2,p3])
      t = s.computeTriangularForm();
      assert(t.planes[0].equalTo(new Plane([1 ,-1,1], 2)));
      assert(t.planes[1].equalTo(new Plane([0 ,1 ,1], 1)));
      assert(t.planes[2].equalTo(new Plane([0 ,0 ,-9], -2)));
    });
  });

  describe("RREF", function () {
    it("should compute RREF", function () {
      var p1 = new Plane([1,1,1], 1);
      var p2 = new Plane([0,1,1], 2);
      var s = new LinearSystem([p1,p2]);
      var r = s.computeRREF();
      assert(r.planes[0].equalTo(new Plane([1,0,0], -1)));
      assert(r.planes[1].equalTo(p2));

      p1 = new Plane([1,1,1], 1)
      p2 = new Plane([1,1,1], 2)
      s = new LinearSystem([p1,p2])
      r = s.computeRREF();
      assert(r.planes[0].equalTo(p1));
      assert(r.planes[1].equalTo(new Plane([0,0,0], 1)));

      p1 = new Plane([1,1,1], 1)
      p2 = new Plane([0,1,0], 2)
      var p3 = new Plane([1,1,-1], 3)
      var p4 = new Plane([1,0,-2], 2)
      s = new LinearSystem([p1,p2,p3,p4])
      r = s.computeRREF();
      assert(r .planes[0].equalTo(new Plane([1,0,0], 0)));
      assert(r.planes[1].equalTo(p2));
      assert(r.planes[2].equalTo(new Plane([0,0,1], -1)));
      assert(r.planes[3].equalTo(new Plane([0,0,0], 0)));

      p1 = new Plane([0,1,1], 1);
      p2 = new Plane([1,-1,1], 2);
      p3 = new Plane([1,2,-5], 3);
      s = new LinearSystem([p1,p2,p3]);
      r = s.computeRREF();

      assert(r.planes[0].equalTo(new Plane([1,0,0], Decimal(23).div(9).toNumber())));
      assert(r.planes[1].equalTo(new Plane([0,1,0], Decimal(7).div(9).toNumber())));
      assert(r.planes[2].equalTo(new Plane([0,0,1], Decimal(2).div(9).toNumber())));
    });
  });

  describe('getSolution', function () {
    it('should tell you if no solution', function () {
      var p1 = new Plane([5.862,1.178,-10.366], -8.15);
      var p2 = new Plane([-2.931,-0.589,5.183], -4.075);
      var s = new LinearSystem([p1,p2]);

      assert(s.getSolution() === false);
    });

    it('should tell you if there are infinite solutions', function () {
      var p1 = new Plane([8.631,5.112,-1.816], -5.113);
      var p2 = new Plane([4.315,11.132,-5.27], -6.775);
      var p3 = new Plane([-2.158,3.01,-1.727], -0.831);
      var s = new LinearSystem([p1,p2,p3]);

      assert(s.getSolution() === Infinity);
    });

    it('should return interection - simple', function () {
      var p1 = new Plane([2, -3], -2);
      var p2 = new Plane([4, 1], 24);
      var s = new LinearSystem([p1,p2]);

      var intersect = s.getSolution();

      assert(intersect.equalTo(new Vector([5, 4])));
    });

    it('should return interection - complex', function () {
      var p1 = new Plane([5.262, 2.739, -9.878], -3.441);
      var p2 = new Plane([5.111, 6.358, 7.638], -2.152);
      var p3 = new Plane([2.016, -9.924, -1.367], -9.278);
      var p4 = new Plane([2.167, -13.543, -18.883], -10.567);
      var s = new LinearSystem([p1,p2,p3,p4]);

      var intersect = s.getSolution();

      assert(intersect.equalTo(new Vector([-1.177, 0.707, -0.083])));
    });

  })
});
