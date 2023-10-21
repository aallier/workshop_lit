import { html, LitElement, css, CSSResultGroup, HTMLTemplateResult } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { fireEvent } from '../Helper.js';

export type Items = Record<string, string>;

@customElement('workshop-dropdown')
export default class Dropdown extends LitElement {
  @property() accessor items: Items;
  @query('#menu') accessor menu: HTMLMenuElement;

  #maxItems = 10;

  override render(): HTMLTemplateResult {
    if (!Object.keys(this.items).length) return html``;

    return html`
        <menu id="menu">
            ${map(Object.entries(this.items), ([key, value]) => html`
                <li @click=${() => this.#clicked(key)}>${unsafeHTML(value)}</li>`)}
        </menu>
    `;
  }

  #clicked(key: string): void {
    fireEvent(this, 'selected', {value: key});
  }

  static get styles(): CSSResultGroup {
    return css`
      :host {
        width: 100%;
      }

      menu {
        list-style-type: none;
        padding: 0;
        margin: 0;
      }

      menu > li {
        background: var(--workshop-dropdown-background-color, white);
        transition: background-color 0.5s ease-in-out;
      }

      menu > li:hover {
        background: var(--workshop-dropdown-background-color-hover, grey);
      }
    `;
  }
}
