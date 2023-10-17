import { css, html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('workshop-sample')
export default class Sample extends LitElement {
  @property() accessor value: string = '';
  @property() accessor upper: boolean = false;

  override render(): HTMLTemplateResult {
    return html`
       <div class="container">
           <h1>${this.upper ? this.value.toUpperCase() : this.upper}</h1>
           <slot></slot>
       </div>
   `;
  }

  static styles = css`
   :host {
     min-width: 100px;
   }

   .container {
     color: lightblue;
   }
 `;
}
