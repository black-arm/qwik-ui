import { component$, useSignal, useStyles$ } from '@builder.io/qwik';
import { Modal } from '@qwik-ui/headless';
import styles from '../snippets/modal.css?inline';

export default component$(() => {
  useStyles$(styles);
  const isOpen = useSignal(false);

  return (
    <div>
      <button class="modal-trigger" onClick$={() => (isOpen.value = true)}>
        Open Modal
      </button>
      <Modal class="modal" bind:show={isOpen}>
        Modal Content
      </Modal>
    </div>
  );
});
