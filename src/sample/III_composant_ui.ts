import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('workshop-sample')
export default class Sample extends LitElement {
  @property() accessor val: number[] = [];

  protected override render(): HTMLTemplateResult {
    return html`
       <custom-element
               class="alert"
               ?disabled=${this.val ?? false}
               .value=${this.val}
               @click=${this.clicked}>
       </custom-element>
   `;
  }

  private clicked(e: Event & {target: {value: number}}): void {
    this.val.push(e.target.value + 10);
  }
}

