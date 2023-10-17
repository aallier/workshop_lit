import { css, html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { fireEvent } from '../Helper';

@customElement('workshop-chip')
export default class Chip extends LitElement {
  @property() accessor value: string = '';
  @property() accessor close: boolean = false;

  override render(): HTMLTemplateResult {
    return html`
        <div class="container">
            ${this.value}
            ${this.close ? this.renderClose() : ''}
        </div>
    `;
  }

  private renderClose(): HTMLTemplateResult {
    return html`
        <button class="close" @click=${this.closed}>❌</button>
    `;
  }

  private closed(): void {
    fireEvent(this, 'removed', {value: this.value});
  }

  private clicked(key: string): void {
    fireEvent(this, 'selected', {value: key});
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
