import { css, html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fireEvent } from '../Helper.js';

@customElement('workshop-chip')
export default class Chip extends LitElement {
  @property() accessor value: string = '';
  @property() accessor close: boolean = false;

  override render(): HTMLTemplateResult {
    return html`
        <div class="container">
            ${this.value}
            ${this.close ? this.#renderClose() : nothing}
        </div>
    `;
  }

  #renderClose(): HTMLTemplateResult {
    return html`
        <button class="close" @click=${this.#closed}>❌</button>
    `;
  }

  #closed(): void {
    fireEvent(this, 'chip-closed', {value: this.value});
  }

  static styles = css`
    :host {
      display: block;
      border: #00000040 solid 0.1px;
      border-radius: 5px;
      padding: 2px;
      width: fit-content;
    }

    .container {
      border-radius: 1px;
    }

    button {
      margin-left: auto;
      background: none;
      border: none;
      font-weight: bold;
    }
  `;
}
