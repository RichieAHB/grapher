export default class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  scale(sx, sy) {
    return new Vector2(this.x * sx, this.y * sy);
  }
}