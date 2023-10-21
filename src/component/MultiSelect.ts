import { css, html, LitElement, nothing, PropertyDeclaration, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { when } from 'lit/directives/when.js';
import { styleMap, StyleInfo } from 'lit/directives/style-map.js';

import Dropdown, { Items } from './Dropdown.js';
import { fireEvent } from '../Helper.js';

import './Dropdown.js';
import './Chip.js';

export type Filter = 'auto' | 'manual' | 'none';
type DropStyle = {
  left: string;
  top: string;
  width: string;
} & StyleInfo;

@customElement('workshop-multiselect')
export default class MultiSelect extends LitElement {
  private static nbInstance = 0;
  @query('#dropdown') accessor dropdown: Dropdown;
  @query('#input') accessor input: HTMLInputElement;
  @property() accessor items: Items = {};
  @property() accessor filter: Filter = 'auto';
  @property() accessor name;
  @property({type: Boolean}) accessor required;
  @state() accessor filters = '';
  @state() accessor dropStyle: DropStyle;
  private internals: ElementInternals;
  #instance: number;

  constructor() {
    super();
    this.#instance = MultiSelect.nbInstance++;
    this.internals = this.attachInternals();
  }

  @state() accessor _values: string[] = [];

  get values(): string[] {
    return this._values
  }

  set values(value: string[]) {
    this._values = value
    this.internals.setFormValue(this.#getFormData());
    this.#updateValidity();
  }

  override render() {
    this.#updateDropdowStyle();

    return html`
        <style>
            :host {
                --h: ${Math.min(Object.keys(this.#getItems()).length, 10) * 19 + 3}px;
            }
        </style>
        <div class="container">
            <div class="field" @click=${this.#focused}>
                ${map(this.values, val => html`
                    <workshop-chip
                            .value=${val}
                            .close=${true}
                            @removed=${this.#removeItem}>
                    </workshop-chip>`)}
                ${when(
                        this.filter !== 'none',
                        () => html`<input type="text" @input=${this.#filterChange} id="input" autocomplete="off">`,
                        () => nothing
                )}
            </div>
            <div class="buttonField">
                <button popovertarget="dropdown">↓</button>
            </div>
            <workshop-dropdown
                    id="dropdown"
                    style=${styleMap({...this.dropStyle})}
                    .items=${this.#getItems()}
                    @selected=${this.#select}
                    @beforetoggle=${this.#updateDropdowStyle}
                    popover
            ></workshop-dropdown>
        </div>
    `;
  }

  protected override firstUpdated(_changedProperties: PropertyValues) {
    super.firstUpdated(_changedProperties);
    this.internals.labels.forEach(label => label.addEventListener('click', () => this.#focused()));
    this.#updateValidity();
  }

  #filterChange(e: Event & { target: HTMLInputElement }): void {
    this.filters = e.target.value;
    fireEvent(this, 'filter-changed', {value: this.filters})
  }

  #focused(): void {
    this.dropdown.showPopover();
    this.input.focus();
  }

  #getItems(): Items {
    return Object.fromEntries(
      Object.entries(this.items)
        .filter(([k]) => !this.values.includes(k))
        .filter(([k, v]) => this.filter !== 'auto' || v.match(new RegExp(this.filters)))
        .map(([k, v]) => [k, String(v).replace(new RegExp(this.filters), `<b>${this.filters}</b>`)])
    );
  }

  #updateDropdowStyle(): void {
    setTimeout(() => {
      this.dropStyle = {
        left: `${this.offsetLeft}px`,
        top: `${this.offsetTop + this.offsetHeight}px`,
        width: `${this.offsetWidth - 12}px`,
      }
      this.requestUpdate('dropStyle');
    });
  }

  #select(ev: CustomEvent): void {
    this.values = [...this.values, ev.detail.value];
  }

  #removeItem(ev: CustomEvent): void {
    this.values = this.values.filter(value => value !== ev.detail.value);
  }

  #getFormData(): FormData {
    const formData = new FormData();
    this._values.forEach(v => formData.append(this.name ?? `${this.tagName.toLowerCase()}[${this.#instance}]`, v))
    return formData;
  }

  #updateValidity(): void {
    this.internals.setValidity({valueMissing: this.required && !Boolean(this._values.length)}, 'Veuillez selectionner au moin un élément', this.input);
  }

  static formAssociated = true;

  static override styles = css`
    :host {
      width: 211px;
      display: block;
    }

    .container {
      display: flex;
      border: #00000040 solid 0.1px;
      border-radius: 5px;
    }

    .field {
      display: flex;
      flex: 1;
      padding: 2px;
      flex-wrap: wrap;
      justify-content: flex-start;
    }

    .values {
      min-width: 150px;
    }

    button {
      font-size: 24px;
      background: none;
      border: none;
      padding-top: 0;
      padding-bottom: 0;
      margin-left: auto;
    }

    .buttonField {
      border-left: solid lightgray 0.5px;
    }

    input {
      border: none;
    }

    input:focus {
      outline: none;
    }

    workshop-dropdown {
      --workshop-dropdown-background-color-hover: rgb(67, 156, 144);
    }

    workshop-chip {
      padding: 1px 2px;
      margin: 1px;
    }

    [popover] {
      position: fixed;
      width: fit-content;
      height: fit-content;
      border: #00000040 solid 0.1px;
      border-radius: 5px;
      padding: 5px;
      cursor: default;
      margin: 0;

      &:popover-open {
        min-height: var(--h);
        max-height: var(--h);

      @starting-style {
        min-height: 0;
        max-height: 0;
      }
      }

      min-height: 0;
      max-height: 0;

      transition: max-height 0.5s, min-height 0.5s, display 0.4s;
      transition-behavior: allow-discrete;
      will-change: max-height;
    }
  `;
}
