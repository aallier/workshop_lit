import { css, html, HTMLTemplateResult, LitElement, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { fireEvent } from '../Helper.js';

@customElement('workshop-chip')
export default class Chip extends LitElement {
  @property() accessor value: string = '';
  @property() accessor close: boolean = false;

  override render(): HTMLTemplateResult {
    return html`
        <div class="container">
            ${this.value}
            ${when(
                    this.close,
                    () => html`
                        <button class="close" @click=${this.#closed}>❌</button>`,
                    () => nothing,
            )}
        </div>
    `;
  }

  #closed(): void {
    fireEvent(this, 'removed', {value: this.value});
  }

  static styles = css`
    :host {
      border: #00000040 solid 0.1px;
      border-radius: 5px;
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
