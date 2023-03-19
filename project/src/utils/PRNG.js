export class PRNG {
  constructor() {}

  next() {
    return fxrand();
  }

  list({ size, fillWith = null, unique = false, precision = null }) {
    const values = [];

    if (fillWith === null) {
      for (let i = 0; i < size; i++) {
        let _next = this.next();

        if (precision !== null) {
          _next = +_next.toFixed(precision);
        }

        // The array should only contain unique values
        if (unique) {
          while (values.includes(_next)) {
            _next = this.next();
            _next = +_next.toFixed(precision);
          }
        }

        values.push(_next);
      }
    } else {
      for (let i = 0; i < size; i++) {
        values.push(fillWith);
      }
    }

    return values;
  }
}
