// © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'.

// This static class contains some generic geometry-related functions.
// Here be secrets more arcane than the spells themselves.
class Geometry {

  // Determine whether or not the point P lies within the triangle ABC
  // Adapted from answer at https://stackoverflow.com/questions/2049582/how-to-determine-if-a-point-is-in-a-2d-triangle
  static pointIsWithinTriangle(px, py, ax, ay, bx, by, cx, cy) {
    const as_x = px - ax;
    const as_y = py - ay;
    const s_ab = (bx - ax) * as_y - (by - ay) * as_x > 0;
    if ((cx - ax) * as_y - (cy - ay) * as_x > 0 == s_ab) return false;
    if ((cx - bx) * (py - by) - (cy - by) * (px - bx) > 0 != s_ab) return false;
    return true;
  }

  // Find the intersection points between the line defined by the points A and B, and the circle with center C
  // Adapted from answer at https://stackoverflow.com/questions/13053061/circle-line-intersection-points
  static findCircleLineIntersections(ax, ay, bx, by, cx, cy, radius) {
    const baX = bx - ax;
    const baY = by - ay;
    const caX = cx - ax;
    const caY = cy - ay;
    const a = baX * baX + baY * baY;
    const bBy2 = baX * caX + baY * caY;
    const c = caX * caX + caY * caY - radius * radius;
    const pBy2 = bBy2 / a;
    const q = c / a;
    const disc = pBy2 * pBy2 - q;
    const tmpSqrt = Math.sqrt(disc);
    const abScalingFactor1 = -pBy2 + tmpSqrt;
    const abScalingFactor2 = -pBy2 - tmpSqrt;
    const p1 = { x: ax - baX * abScalingFactor1, y: ay- baY * abScalingFactor1 };
    return disc == 0 ? [p1] : [p1, { x: ax - baX * abScalingFactor2, y: ay - baY * abScalingFactor2 }];
  }

  // Defines whether or not the line segment defined by the points A and B intersects the circle with center C
  static segmentIntersectsCircle(ax, ay, bx, by, cx, cy, radius) {
    const intersections = this.findCircleLineIntersections(ax, ay, bx, by, cx, cy, radius);
    // Even if the (infinite) line has intersections, we need to check that at least one intersection lies within the given line segment
    return intersections.length > 1 && intersections.some(p => p.x >= Math.min(ax, bx) && p.x <= Math.max(ax, bx) && p.y >= Math.min(ay, by) && p.y <= Math.max(ay, by));
  }
}
export default Geometry;
