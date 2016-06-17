import Grapher from './Grapher';
import math from 'mathjs';

export const graph = (params) => {
  const optionTypes = ['step'];
  const singleTypes = ['grid', 'axis', 'scale'];
  const multiTypes = ['line', 'points'];
  const colors = [ '#9d4db8', '#8cb65a', '#4ca4f5', '#ff9900' ];

  const options = {};

  optionTypes.forEach(option => {
    const value = params[option];
    if (value) {
      options[option] = value;
    }
  });

  options.wrapper = document.getElementById('graph-wrapper');

  const grapher = new Grapher(options);

  let i = 0;

  for (let key in params) {

    let matches;
    const regex = new RegExp(`^(${multiTypes.join('|')})\\d*$`);

    if (~singleTypes.indexOf(key)) {
      grapher[key]();
    } else if (matches = key.match(regex)) {
      const type = matches[1];

      const node = math.compile(params[key]);
      const expr = (x) => node.eval({ x });

      grapher[type]({
        color: colors[i % 4],
        expr: expr,
      });

      i++;
    }
  }
}
