import Grapher from './Grapher';

// The evaluate parameter should be a function that evaluates a formula string,
// as provided by math.js or KAS.
export function graph(evaluate) {
  return (params) => {
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
        grapher.add(key);
      } else if (matches = key.match(regex)) {
        const type = matches[1];

        const formula = params[key];
        const expr = evaluate(formula);

        grapher.add(type, {
          ...params,
          color: colors[i % 4], // override colors for closed shorttag variant
          expr: expr,
        });

        i++;
      }
    }
    return grapher;
  };
}
