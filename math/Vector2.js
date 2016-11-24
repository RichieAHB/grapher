export default class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  scale(sx, sy) {
    return new Vector2(this.x * sx, this.y * sy);
  }

  add(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  subtract(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  rotateAround(v, a) {
    const cosa = Math.cos(a);
    const sina = Math.sin(a);

    const x = this.x - v.x;
    const y = this.y - v.y;

    const x1 = ((x * cosa) - (y * sina)) + v.x;
    const y1 = ((x * sina) + (y * cosa)) + v.y;

    return new Vector2(x1, y1);
  }

  toString() {
    return `{${this.x}, ${this.y}}`;
  }
}
