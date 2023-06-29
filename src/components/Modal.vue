<script setup>
import BaseButton from '@/components/BaseButton.vue'

const props = defineProps({
  show: Boolean
})
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="modal-mask" v-on-click-outside="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <slot name="header">default header</slot>
          <BaseButton
            icon="close"
            class="modal-default-button"
            @click="$emit('close')"
          ></BaseButton>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"> </slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}

.modal-container {
  width: 50%;
  height: 50%;
  z-index: 9999;
  /* margin-top: auto; */
  padding: 2em 2em;
  /* bottom: 130px; */
  position: relative;
  background-color: var(--color-background);
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  border-radius: 8px;
}

.modal-header h3 {
  margin-top: 0;
  color: var(--color-text);
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  position: absolute;
  top: 2em;
  right: 2em;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1) translateY(+50%);
}
</style>
