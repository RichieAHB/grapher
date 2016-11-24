import Grapher from './Grapher';

// The evaluate parameter should be a function that evaluates a formula string,
// as provided by math.js or KAS.
export function graph(evaluate) {
  return (params) => {
    // Better way to do this!  Loop thorug className.
    const optionTypes = ['wrapper', 'step', 'startRange'];
    const singleTypes = ['grid', 'axis', 'scale'];
    const multiTypes = ['line', 'points'];
    const colors = ['#9d4db8', '#8cb65a', '#4ca4f5', '#ff9900'];

    const options = {};

    optionTypes.forEach((option) => {
      const value = params[option];
      if (value) {
        options[option] = value;
      }
    });

    const grapher = new Grapher(options);

    let colorIndex = params.startColor || 0;

    Object.keys(params).forEach((key) => {
      const regex = new RegExp(`^(${multiTypes.join('|')})\\d*$`);
      const matches = key.match(regex);

      if (~singleTypes.indexOf(key)) {
        const _params = Object.assign({}, params);
        // Remove line width from the global
        delete _params.lineWidth;
        grapher.add(key, _params);
      } else if (matches) {
        const type = matches[1];

        const formula = params[key];
        const expr = evaluate(formula);
        colorIndex += 1;

        grapher.add(type, {
          ...params,
          color: colors[colorIndex % 4], // override colors for closed shorttag variant
          expr,
        });
      }
    });
    return grapher;
  };
}
