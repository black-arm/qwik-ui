import {
  component$,
  QwikIntrinsicElements,
  Slot,
  useContext,
  useSignal,
  useVisibleTask$,
} from '@builder.io/qwik';
import SelectContextId from './select-context-id';

export type SelectListBoxProps = QwikIntrinsicElements['ul'];

export const SelectListBox = component$((props: SelectListBoxProps) => {
  const indexDiffSignal = useSignal<number | undefined>(undefined);
  const listBoxRefSignal = useSignal<HTMLElement>();
  const selectContextSignal = useContext(SelectContextId);
  const prevTimeoutSignal = useSignal<undefined | NodeJS.Timeout>(undefined);
  const inputStrgSignal = useSignal('');
  const fullStrgSearchFailedSignal = useSignal(false);
  const listBoxRef = useSignal<HTMLElement>();
  const selectContext = useContext(SelectContextId);
  selectContext.listBoxRefSig = listBoxRef;

  useVisibleTask$(function setKeyHandler({ cleanup }) {
    function keyHandler(e: KeyboardEvent) {
      const availableOptions = selectContext.optionsStore.filter(
        (option) => !(option?.getAttribute('aria-disabled') === 'true'),
      );
      const target = e.target as HTMLElement;
      const currentIndex = availableOptions.indexOf(target);

      if (
        e.key === 'ArrowDown' ||
        e.key === 'ArrowUp' ||
        e.key === 'Home' ||
        e.key === 'End' ||
        e.key === ' '
      ) {
        e.preventDefault();
      }

      if (e.key === 'ArrowDown') {
        if (currentIndex === availableOptions.length - 1) {
          availableOptions[0]?.focus();
        } else {
          availableOptions[currentIndex + 1]?.focus();
        }
      }

      if (e.key === 'ArrowUp') {
        if (currentIndex <= 0) {
          availableOptions[availableOptions.length - 1]?.focus();
        } else {
          availableOptions[currentIndex - 1]?.focus();
        }
      }

      if (prevTimeoutSignal.value === undefined) {
        prevTimeoutSignal.value = setTimeout(() => {
          inputStrgSignal.value = '';
        }, 500);
      } else {
        clearTimeout(prevTimeoutSignal.value);
        prevTimeoutSignal.value = setTimeout(() => {
          inputStrgSignal.value = '';
        }, 500);
      }
      const searchFirstCharOnly =
        inputStrgSignal.value.length < 1 || fullStrgSearchFailedSignal.value;
      if (searchFirstCharOnly) {
        const charOptions: Readonly<string[]> = availableOptions.map((e) => {
          return e.textContent!.slice(0, 1).toLowerCase();
        });
        const currentChar = e.key.toLowerCase();
        if (!fullStrgSearchFailedSignal.value) {
          inputStrgSignal.value += currentChar;
        }
        const charIndex = charOptions.indexOf(currentChar);
        if (charIndex !== -1) {
          if (indexDiffSignal.value === undefined) {
            availableOptions[charIndex].focus();
            indexDiffSignal.value = charIndex + 1;
          } else {
            const isRepeat = charOptions[indexDiffSignal.value - 1] === currentChar;
            if (isRepeat) {
              const nextChars = charOptions.slice(indexDiffSignal.value);
              const repeatIndex = nextChars.indexOf(currentChar);
              if (repeatIndex !== -1) {
                const nextIndex = repeatIndex + indexDiffSignal.value;
                availableOptions[nextIndex].focus();
                indexDiffSignal.value = nextIndex + 1;
              } else {
                availableOptions[charIndex].focus();
                indexDiffSignal.value = charIndex + 1;
              }
            } else {
              availableOptions[charIndex].focus();
              // bc char has changed, user is typing  a new strg
              fullStrgSearchFailedSignal.value = false;
              indexDiffSignal.value = charIndex + 1;
            }
          }
        }
      } else {
        const strgOptions: Readonly<string[]> = availableOptions.map((e) => {
          return e.textContent!.toLowerCase();
        });
        const searchStrg = inputStrgSignal.value + e.key.toLowerCase();
        const firstPossibleOption = strgOptions.findIndex((e) => {
          const size = searchStrg.length;
          return e.substring(0, size) === searchStrg;
        });
        if (firstPossibleOption !== -1) {
          availableOptions[firstPossibleOption].focus();
          inputStrgSignal.value = searchStrg;
          indexDiffSignal.value = firstPossibleOption + 1;
        } else {
          clearTimeout(prevTimeoutSignal.value);
          fullStrgSearchFailedSignal.value = true;
        }
      }
    }
    listBoxRef.value?.addEventListener('keydown', keyHandler);
    cleanup(() => {
      listBoxRef.value?.removeEventListener('keydown', keyHandler);
    });
  });

  return (
    <ul
      ref={listBoxRef}
      role="listbox"
      tabIndex={0}
      hidden={!selectContext.isListboxHiddenSig.value}
      style={`
        display: ${selectContext.isOpenSig.value ? 'block' : 'none'};
        position: absolute;
        z-index: 1;
        ${props.style}
      `}
      class={props.class}
    >
      <Slot />
    </ul>
  );
});
