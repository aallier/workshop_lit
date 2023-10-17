import { Directive, directive } from 'lit/directive.js';

class MaxDirective extends Directive {
  #maxValue = Number.MIN_VALUE;

  override render(value: number, minValue = Number.MIN_VALUE) {
    this.#maxValue = Math.max(value, this.#maxValue, minValue);

    return this.#maxValue;
  }
}

export const max = directive(MaxDirective);
