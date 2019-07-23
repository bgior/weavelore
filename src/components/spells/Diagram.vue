<!-- © Copyright 2019 Bruno Giorello. Released under GNU AGPLv3, see 'LICENSE.md'. -->

<template>
  <canvas id="diagram" v-if="enabled" :width="width" :height="height"></canvas>
</template>
<style>
  #diagram {
    max-width: 100%;
  }
</style>
<script>
import Geometry from '@/util/geometry.js'

const cellSize = 20; // The size of each cell of the grid, in px
const margin = 14; // The margin between the grid and the canvas, in px
const fade = 40; // The width of the fade effect on the edges of the grid, in px
const feetPerCell = 5; // How many feet each cell in the grid represents
const circleRadius = 6; // The radius of the circles that represent the player and the target mob, in px
const pixelsPerFoot = cellSize / feetPerCell; // How many pixels represent each foot
const pixelsPerCell = feetPerCell * pixelsPerFoot; // How many pixels are in each grid cell
const minRange = 10; // The minimum spell range (doesn't make much sense to diagram a 5-feet-range spell unless it's an AOE), in feet
const maxRange = 300; // The maximum spell range (prevent drawing humongous grids for spells with very long range), in feet
const maxAOERadius = 120; // The maximum AOE radius (same reason as above), in feet
const coneAmplitude = Math.atan(0.5) * 2; // The amplitude of the cone AOE, in radians (isosceles triangle where base equals height, ~ 53 degrees)
// const coneSideLengthMultiplier = Math.sqrt(1.5) // The side of the isosceles triangle if cone length = 1
const coneSideLengthMultiplier = 1.115 // TODO: This should be the commented value above. Check math.

export default {
  name: 'Diagram',
  props: {
    app: Object,
    range: Number, // The range of the spell, in feet
    aoe: Object, // A hash that represents the Area Of Effect of this spell,
  },
  data: () => { return {
    // 'caster' and 'target' will be used, but they needn't be reactive so no need to declare them here.
  }},
  computed: {
    width() { // The width of the canvas, in pixels
      return this.cols * cellSize + margin * 2;
    },
    height() { // The height of the canvas, in pixels
      return this.rows * cellSize + margin * 2;
    },
    rows() { // The amount of rows in the grid
      return this.getOptimalRowAmount();
    },
    cols() { // The amount of columns in the grid
      return this.getOptimalColAmount();
    },
    enabled() { // Whether this diagram should be drawn, or adds no value to the given spell and should be hidden
      return this.range <= maxRange && (this.range >= minRange || this.aoe);
    }
  },
  mounted() { // When the Diagram is rendered for the first time, draw the canvas
    this.draw();
  },
  updated() { // When the Diagram is updated (because the user clicked on another spell), re-draw the canvas
    this.draw();
  },
  methods: {
    draw() {
      if (!this.enabled) return;
      if (this.aoe && this.aoe.type == "cone" && !this.aoe.angle) {
        this.aoe.angle = 0;
      }
      const canvas = document.getElementById("diagram");
      const ctx = canvas.getContext("2d");
      ctx.font = "12px Ubuntu";
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Remove any previous drawings
      ctx.setLineDash([]); // Remove any previous line dash
      this.positionCaster();
      this.positionTarget();
      this.drawGrid(ctx);
      this.drawAOE(ctx);
      this.drawCaster(ctx);
      this.drawTarget(ctx);
    },
    drawGrid: function(ctx) {
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#333";
      const rowCount = this.rows, colCount = this.cols;
      const maxX = this.width, maxY = this.height;
      for (let rowNumber = 0; rowNumber <= rowCount; rowNumber++) {
        ctx.beginPath();
        ctx.moveTo(0, margin + rowNumber * cellSize);
        ctx.lineTo(maxX, margin + rowNumber * cellSize);
        ctx.stroke();
      }
      for (let colNumber = 0; colNumber <= colCount; colNumber++) {
        ctx.beginPath();
        ctx.moveTo(margin + colNumber * cellSize, 0);
        ctx.lineTo(margin + colNumber * cellSize, maxY);
        ctx.stroke();
      }
      //Simulate a "fade" effect on the edges using a dark gradient
      [ // [gradientOriginX, gradientOriginY, gradientEndX, gradientEndY]
        [0, 0, fade, 0], // Left edge
        [maxX, 0, maxX - fade, 0], // Right edge
        [0, 0, 0, fade], // Top edge
        [0, maxY, 0, maxY - fade], // Bottom edge
      ].forEach(p => {
        var grd = ctx.createLinearGradient(p[0], p[1], p[2], p[3]);
        grd.addColorStop(0, "#1b1b1bff");
        grd.addColorStop(1, "#1b1b1b00");
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, maxX, maxY);
      });
    },
    positionCaster: function() {
      this.caster = { x: margin + cellSize * 1.5, y: margin + cellSize * this.rows / 2 };
      // If the AOE is big enough to include the caster, we need to make more room to the left of the caster to draw the AOE
      if (this.aoe) {
        switch (this.aoe.type) {
          case "sphere":
            this.caster.x += Math.max((this.range - this.aoe.radius + feetPerCell) * -pixelsPerFoot, 0);
            break;
          case "cube":
            this.caster.x += Math.max((this.range - Math.ceil(Math.ceil((this.aoe.edge / 2) - feetPerCell) / feetPerCell) * feetPerCell) * -pixelsPerFoot, 0);
            break;
          case "cone":
            this.caster.x += Math.max((this.range - Math.ceil((this.aoe.length * coneSideLengthMultiplier * 0.95) / feetPerCell) * feetPerCell) * -pixelsPerFoot, 0); // 0.95 fixes off-center caster
            break;
        }
      }
    },
    positionTarget: function() {
      this.target = { x: this.caster.x + this.range * pixelsPerFoot, y: this.caster.y }
      if (this.aoe) {
        if (this.aoe.type == 'cone') {
          const angleInDegrees = this.aoe.angle / (Math.PI / 180);
          // Target position within the cell depends on the direction of the cone
          if (angleInDegrees < 45 || angleInDegrees >= 315) {
            this.target.x += cellSize / 2;
            this.target.y += Math.tan(this.aoe.angle) * cellSize / 2;
          } else if (angleInDegrees >= 45 && angleInDegrees < 135) {
            this.target.x -= Math.tan(this.aoe.angle - Math.PI / 2) * cellSize / 2;
            this.target.y += cellSize / 2;
          } else if (angleInDegrees >= 135 && angleInDegrees < 225) {
            this.target.x -= cellSize / 2;
            this.target.y -= Math.tan(this.aoe.angle) * cellSize / 2;
          } else { // 225 to 315
            this.target.x -= Math.tan(3 * Math.PI / 2 - this.aoe.angle) * cellSize / 2;
            this.target.y -= cellSize / 2;
          }

        } else if (!(this.aoe.type == 'cube' && this.aoe.edge % 10 != 0)) {
          // Target should be a grid intersection point instead of the center of a cell
          this.target.x += cellSize / 2;
          this.target.y += cellSize / 2;
        }
      }
    },
    drawAOE: function(ctx) {
      const target = this.target;
      if (this.aoe) {
        ctx.setLineDash([4, 6]); // 5px long, 3px separated
        switch (this.aoe.type) {
          case "sphere":
            if (this.aoe.radius <= maxAOERadius) {
              const radiusInPixels = this.aoe.radius * pixelsPerFoot;
              ctx.beginPath();
              ctx.strokeStyle = "#ff444444";
              ctx.arc(target.x, target.y, radiusInPixels, 0, 2 * Math.PI);
              ctx.stroke();
              ctx.fillStyle = "#ccc";
              ctx.fillText(this.aoe.radius + "-feet radius", target.x - 38, target.y - radiusInPixels - 4); // 38 and 4 are values to roughly center the text
              // Highligh individual squares
              ctx.setLineDash([]);
              ctx.strokeStyle = "#913a3a";
              for (let x = target.x - radiusInPixels; x < target.x + radiusInPixels; x += pixelsPerCell) {
                for (let y = target.y - radiusInPixels; y < target.y + radiusInPixels; y += pixelsPerCell) {
                  // Highlight a cell only if its center point is within the circle (distanceToCenter < radius)
                  if (Math.sqrt(Math.pow(target.x - x - cellSize / 2, 2) + Math.pow(target.y - y - cellSize / 2, 2)) <= radiusInPixels) {
                    ctx.beginPath();
                    ctx.rect(x, y, cellSize, cellSize);
                    ctx.stroke();
                  }

                }
              }
            }
            break;
          case "cube": {
            const halfEdge = this.aoe.edge / 2;
            if (halfEdge <= maxAOERadius) {
              ctx.beginPath();
              ctx.strokeStyle = "#913a3a";
              ctx.rect(target.x - halfEdge * pixelsPerFoot, target.y - halfEdge * pixelsPerFoot, this.aoe.edge * pixelsPerFoot, this.aoe.edge * pixelsPerFoot);
              ctx.stroke();
              ctx.fillStyle = "#ccc";
              ctx.fillText(this.aoe.edge + "-feet cube", target.x - 38, target.y - halfEdge * pixelsPerFoot - 4);
              // Highligh individual squares
              ctx.setLineDash([]);
              for (let x = target.x - halfEdge * pixelsPerFoot; x < target.x + halfEdge * pixelsPerFoot; x += pixelsPerCell) {
                for (let y = target.y - halfEdge * pixelsPerFoot; y < target.y + halfEdge * pixelsPerFoot; y += pixelsPerCell) {
                  ctx.beginPath();
                  ctx.rect(x, y, cellSize, cellSize);
                  ctx.stroke();
                }
              }
            }
            break;
          }
          case "cone":
            if (this.aoe.length <= maxAOERadius) {
              const angle1 = this.aoe.angle - coneAmplitude / 2;
              const angle2 = this.aoe.angle + coneAmplitude / 2;
              const origin = { x: target.x, y: target.y };
              ctx.strokeStyle = "#913a3a";
              // Draw the triangle
              const coneSideLengthPixels = this.aoe.length * pixelsPerFoot * coneSideLengthMultiplier;
              const end1 = { x: origin.x + Math.cos(angle1) * coneSideLengthPixels, y: origin.y + Math.sin(angle1) * coneSideLengthPixels };
              ctx.beginPath();
              ctx.moveTo(origin.x, origin.y);
              ctx.lineTo(end1.x, end1.y);
              ctx.stroke();
              const end2 = { x: origin.x + Math.cos(angle2) * coneSideLengthPixels, y: origin.y + Math.sin(angle2) * coneSideLengthPixels };
              ctx.beginPath();
              ctx.moveTo(origin.x, origin.y);
              ctx.lineTo(end2.x, end2.y);
              ctx.stroke();
              ctx.lineTo(end1.x, end1.y);
              ctx.stroke();
              // Highligh individual squares
              ctx.setLineDash([]);
              // Narrow down the cells that are candidates to be highlighted to minimize the amount of intersection calculations we have to do
              const minX = Math.min(origin.x, end1.x, end2.x), maxX = Math.max(origin.x, end1.x, end2.x);
              const minY = Math.min(origin.y, end1.y, end2.y), maxY = Math.max(origin.y, end1.y, end2.y);
              for (let x = margin + Math.floor((minX - margin) / cellSize) * cellSize; x < Math.ceil((maxX - margin) / cellSize) * cellSize; x += pixelsPerCell) {
                for (let y = margin + Math.floor((minY - margin)/ cellSize) * cellSize; y < Math.ceil((maxY - margin) / cellSize) * cellSize; y += pixelsPerCell) {
                  // A cell is highlighted if the cell center point is within the cone triangle OR any of the triangle edges touches the cell's inscribed circle
                  // Relevant discussion: https://rpg.stackexchange.com/questions/46492/how-do-i-map-a-15-cone-to-a-1-grid
                  if (Geometry.pointIsWithinTriangle(x + cellSize / 2, y + cellSize / 2, origin.x, origin.y, end1.x, end1.y, end2.x, end2.y) ||
                  Geometry.segmentIntersectsCircle(origin.x, origin.y, end1.x, end1.y, x + cellSize / 2, y + cellSize / 2, cellSize / 2) ||
                  Geometry.segmentIntersectsCircle(origin.x, origin.y, end2.x, end2.y, x + cellSize / 2, y + cellSize / 2, cellSize / 2) ||
                  Geometry.segmentIntersectsCircle(end1.x, end1.y, end2.x, end2.y, x + cellSize / 2, y + cellSize / 2, cellSize / 2)) {
                    ctx.beginPath();
                    ctx.rect(x, y, cellSize, cellSize);
                    ctx.stroke();
                  }
                }
              }
            }
            break;
        }
      }
    },
    drawCaster(ctx) {
      const caster = this.caster;
      ctx.beginPath();
      ctx.strokeStyle = "#9bd0ff";
      ctx.arc(caster.x, caster.y, circleRadius, 0, 2 * Math.PI);
      ctx.stroke();
    },
    drawTarget(ctx) {
      const caster = this.caster, target = this.target;
      if (this.range >= minRange) {
        // Draw the target mob
        if (!this.aoe) {
          ctx.beginPath();
          ctx.strokeStyle = "#f44";
          if (this.aoe) {
            ctx.arc(target.x - cellSize / 2, target.y - cellSize / 2, circleRadius, 0, 2 * Math.PI);
          } else {
            ctx.arc(target.x, target.y, circleRadius, 0, 2 * Math.PI);
          }
          ctx.stroke();
        }

        // Draw the line connecting caster and target
        ctx.beginPath();
        ctx.strokeStyle = "#ccc";
        ctx.moveTo(caster.x + circleRadius, caster.y);
        ctx.lineTo(this.aoe ? target.x : target.x - circleRadius, target.y); // unless spell is AOE, end the line a bit earlier so that it doesn't overlap the mob circle
        ctx.setLineDash([4, 6]); // 5px long, 3px separated
        ctx.stroke();
        // Add range legend above the line
        ctx.fillStyle = "#ccc";
        ctx.fillText(this.range + " feet", caster.x + this.range * pixelsPerFoot / 2 - 20, caster.y - cellSize / 2); // -20px is to roughly center the text
      }
    },
    // Calculate the optimal amount of grid rows that should be used to represent this spell
    getOptimalRowAmount: function() {
      if (this.aoe) {
        switch (this.aoe.type) {
          case "sphere":
            return this.aoe.radius <= maxAOERadius ? 3 + Math.max(Math.ceil((this.aoe.radius - feetPerCell) / feetPerCell) * 2, 0) : 3;
          case "cube":
            return this.aoe.edge / 2 <= maxAOERadius ? 3 + Math.max(Math.ceil((this.aoe.edge / 2 - feetPerCell) / feetPerCell) * 2, 0) : 3;
          case "cone":
            return this.aoe.length <= maxAOERadius ? 3 + Math.max(Math.ceil((this.aoe.length * coneSideLengthMultiplier - feetPerCell) / feetPerCell) * 2, 0) : 3;
          default:
            throw("Unrecognized AOE type: " + this.aoe.type);
        }
      }
      return 3;
    },
    // Calculate the optimal amount of grid cols that should be used to represent this spell
    getOptimalColAmount: function() {
      let baseCols = this.range / feetPerCell + 3;
      if (this.aoe) {
        switch (this.aoe.type) {
          case "sphere":
            return this.aoe.radius <= maxAOERadius ?
              Math.max(Math.ceil(this.aoe.radius / feetPerCell - 1) + baseCols,
              this.aoe.radius * 2 / feetPerCell + 2
            ) : baseCols;
          case "cube": {
            let cols = this.aoe.edge / 2 <= maxAOERadius ?
              Math.max(
                Math.ceil((this.aoe.edge / 2) / feetPerCell - 1) + baseCols,
                this.aoe.edge / feetPerCell + 2
              ):
              baseCols;
            if (this.aoe.edge < 15) { // Prevent text from escaping the diagram if the cube is small
              cols += 1;
            }
            return cols;
          }
          case "cone":
            return this.aoe.length <= maxAOERadius ?
              Math.max(Math.ceil(this.aoe.length * coneSideLengthMultiplier / feetPerCell - 1) + baseCols,
              this.aoe.length * 2 / feetPerCell + 5
            ) : baseCols;
          default:
            throw("Unrecognized AOE type: " + this.aoe.type);
        }
      }
      return baseCols;
    }
  }
}
</script>
