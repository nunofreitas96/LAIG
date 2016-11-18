/**
* Plane
* @constructor
*/
function Plane(scene, dX, dY, divX, divY) {
  this.scene = scene;

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

  var knots1 = getKnotsVector(1);
  var knots2 = getKnotsVector(1);

  var controlvertexes = [	// U = 0
    [ // V = 0..1;
      [-2.0, -2.0, 0.0, 1 ],
      [-2.0,  2.0, 0.0, 1 ]

    ],
    // U = 1
    [ // V = 0..1
      [ 2.0, -2.0, 0.0, 1 ],
      [ 2.0,  2.0, 0.0, 1 ]
    ]
  ];

  var nurbsSurface = new CGFnurbsSurface(1, 1, knots1, knots2, controlvertexes);



  this.obj = new CGFnurbsObject(this.scene, getSurfacePoint, divX, divY );


};



Plane.prototype = Object.create(CGFobject.prototype);
Plane.prototype.constructor = Plane;

Plane.prototype.display = function () {
  this.obj.display();
};
