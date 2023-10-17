import { html, HTMLTemplateResult, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { Task } from '@lit/task';

type Purchase = {
  lines: string[];
}

@customElement('workshop-purchase')
export default class Sample extends LitElement {
  @property() accessor purchaseId: number;

  private _productTask = new Task(this, {
    task: async ([purchaseId], {signal}) => {
      const response = await fetch(`http://workshop.lit/purchase/${purchaseId}`, {signal});
      return await response.json() as Purchase;
    },
    args: () => [this.purchaseId]
  });

  protected override render(): HTMLTemplateResult {
    return this._productTask.render({
      pending: () => html`<p>Loading purchase...</p>`,
      complete: (purchase: Purchase) => html`${map(purchase.lines, line =>
        html`
          <workshop-purchase-line purchaseLine=${line}></workshop-purchase-line>`
      )}`,
      error: (e) => html`<p>Error: ${e}</p>`
    });
  }
}

