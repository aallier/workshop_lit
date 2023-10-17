import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

@customElement('workshop-sample')
export default class Sample extends LitElement {
  @query('#input-button') accessor input: HTMLInputElement;
  @property({
    hasChanged(newVal: string, oldVal: string) {
      return Math.abs(newVal.length - oldVal.length) > 2;
    },
  }) accessor value: string = '';
  @state() accessor open: boolean = false;

  override render(): HTMLTemplateResult {
    return html`
     <div
       class="container"
       style=${styleMap({display: this.open ? 'initial': 'none'})}
     >
        ${this.value}
     </div>
     <input id="input-button" type="button" @click=${this.open = !this.open}>
   `;
  }
}
