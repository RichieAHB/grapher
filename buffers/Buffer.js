import Optionable from '../Optionable';
import { lerp } from '../utils/NumberUtils';

export default class Buffer extends Optionable {
  constructor(context, options = {}) {
    super(options);
    this.context = context;

    // If data has been passed in then use it
    this.data = (this.settings.data || []).slice(0);

    // Don't build as data already exists!
    if (!this.data.length) {
      this._build();
    }
  }

  _build(oldSettings = {}, lerpFactor) {
    const {width, minX, maxX, expr, fillWidth, transpose} = this.settings;
    const vAR = this.context.visibleAxisRange;

    const _minX = fillWidth ? vAR.minX : minX;
    const _maxX = fillWidth ? vAR.maxX : maxX;

    for (let i = 0; i < width; i++) {
      const factor = width - 1 > 0 ? i / (width - 1) : 0.5;

      const x = lerp(_minX, _maxX, factor);
      let   y = expr(x);

      if (oldSettings.expr) {
        const y0 = oldSettings.expr(x);
        y = lerp(y0, y, lerpFactor);
      }

      this.data[i * 2]     = transpose ? y : x;
      this.data[i * 2 + 1] = transpose ? x : y;
    }
  }
}