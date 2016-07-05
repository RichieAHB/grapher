import Grapher from './Grapher';

// The evaluate parameter should be a function that evaluates a formula string,
// as provided by math.js or KAS.
export function graph(evaluate) {
  return (params) => {

    // Better way to do this!  Loop thorug className.
    const optionTypes = ['wrapper', 'step', 'startRange'];
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

    const grapher = new Grapher(options);

    let colorIndex = params.startColor || 0;

    for (let key in params) {

      let matches;
      const regex = new RegExp(`^(${multiTypes.join('|')})\\d*$`);

      if (~singleTypes.indexOf(key)) {
        grapher.add(key);
      } else if (matches = key.match(regex)) {
        const type = matches[1];

        const formula = params[key];
        const expr = evaluate(formula);

        grapher.add(type, {
          ...params,
          color: colors[colorIndex++ % 4], // override colors for closed shorttag variant
          expr: expr,
        });
      }
    }
    return grapher;
  };
}
