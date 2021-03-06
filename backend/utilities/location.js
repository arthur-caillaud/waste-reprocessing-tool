var location = {};


function getDistance(longA, latA, longB, latB, callback) {

    var PI = Math.PI;
    var sin = Math.sin;
    var cos = Math.cos;
    var acos = Math.acos;

    longA = longA * Math.PI / 180;
    longB = longB * Math.PI / 180;

    latA = latA * Math.PI / 180;
    latB = latB * Math.PI / 180;

    var result = acos(sin(latA)*sin(latB) + cos(latA)*cos(latB)*cos(longA-longB))*6371;

    callback(result);
}

location.getDistance = getDistance;

module.exports = location;
