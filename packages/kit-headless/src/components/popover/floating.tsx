import { PopoverImpl } from './popover-impl';

import {
  component$,
  useTask$,
  useSignal,
  type Signal,
  Slot,
  PropsOf,
} from '@builder.io/qwik';
import {
  ReferenceElement,
  autoUpdate,
  computePosition,
  offset as _offset,
  flip as _flip,
  shift as _shift,
  hide as _hide,
} from '@floating-ui/dom';

declare global {
  interface Document {
    __NEEDS_POPOVER__?: true;
  }
  interface HTMLDivElement {
    popover?: 'manual' | 'auto';
  }
}

export type FloatingProps = PropsOf<'div'> & {
  id: string;
  anchorRef?: Signal<HTMLElement | undefined>;
  popoverRef?: Signal<HTMLElement | undefined>;
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end';
  ancestorScroll?: boolean;
  ancestorResize?: boolean;
  elementResize?: boolean;
  layoutShift?: boolean;
  animationFrame?: boolean;
  gutter?: number;
  shift?: boolean;
  flip?: boolean;
  size?: boolean;
  hide?: 'referenceHidden' | 'escaped';
  inline?: boolean;
  transform?: string;
};

export const FloatingPopover = component$(
  ({
    anchorRef,
    gutter,
    flip = true,
    placement = 'bottom',
    shift,
    hide,
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = true,
    animationFrame = false,
    transform,
    ...props
  }: FloatingProps) => {
    const myRef = useSignal<HTMLElement | undefined>();
    const popoverRef = props.popoverRef || myRef;

    // sets floating UI config
    useTask$(async ({ track, cleanup }) => {
      const anchor = track(() => anchorRef?.value);
      const popover = track(() => popoverRef.value);
      if (!popover || !anchor) return;

      popover.hidden = false;

      const updatePosition = async () => {
        const middleware = [
          _offset(gutter),
          _hide({ strategy: hide }),
          flip && _flip(),
          shift && _shift(),
        ];

        await computePosition(anchor as ReferenceElement, popover, {
          placement,
          middleware,
        }).then(async (resolvedData) => {
          const { x, y } = resolvedData;

          Object.assign(popover.style, {
            left: `${x}px`,
            top: `${y}px`,
            transform,
          });
        });
      };

      const cleanupFunc = autoUpdate(
        anchor as ReferenceElement,
        popover,
        updatePosition,
        {
          ancestorScroll,
          ancestorResize,
          elementResize,
          animationFrame,
        },
      );
      cleanup(cleanupFunc);
    });

    return (
      <PopoverImpl hidden={true} {...props} ref={popoverRef}>
        <Slot />
      </PopoverImpl>
    );
  },
);
