/**
* Patch
* @constructor
*/
function Patch(scene, orderU, orderV, divX, divY, controlPoints) {
  this.scene = scene;

  console.log("PATCH ");

  getKnotsVector = function (degree) {
    var v = new Array();
    for (var i=0; i<=degree; i++) {
      v.push(0);
    }
    for (var i=0; i<=degree; i++) {
      v.push(1);
    }
    return v;
  };

  getSurfacePoint = function(u, v) {
    return nurbsSurface.getPoint(u, v);
  };

  var knots1 = getKnotsVector(orderU);
  var knots2 = getKnotsVector(orderV);
  console.log(controlPoints);

  var nurbsSurface = new CGFnurbsSurface(orderU, orderV, knots1, knots2, controlPoints);
  this.obj = new CGFnurbsObject(this.scene, getSurfacePoint, divX, divY);
};

Patch.prototype = Object.create(CGFobject.prototype);
Patch.prototype.constructor = Patch;

Patch.prototype.display = function () {
  this.obj.display();
};
