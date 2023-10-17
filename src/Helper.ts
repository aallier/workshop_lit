export type CEvent = keyof CDomEvents;

export interface CDomEvents {
  'chip-closed': {
    value: string;
  };
}

export const fireEvent = (
  node: HTMLElement | Window,
  type: CEvent,
  detail?: CDomEvents[CEvent],
  options?: EventInit,
) => {
  options ??= {};

  // @ts-ignore
  const event = new CustomEvent(type, {
    bubbles: (options.bubbles ?? true),
    cancelable: Boolean(options.cancelable),
    composed: options.composed ?? true,
    detail: detail ?? {},
  });
  node.dispatchEvent(event);

  return event;
};
