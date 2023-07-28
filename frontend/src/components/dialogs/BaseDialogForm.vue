<script setup lang="ts">
import { computed } from 'vue'
import GButton from '@/components/gotbit-ui-kit/GButton.vue'
import CloseIcon from '@/components/gotbit-ui-kit/icons/CloseIcon.vue'

import { useDialogs } from '@/store/ui/dialogs'

const dialogsStore = useDialogs()

const hasCross = computed(
  () =>
    !(
      dialogsStore.currentDialog?.params?.notClosable ||
      dialogsStore.currentDialog?.params?.noCross
    ),
)
</script>

<template>
  <Transition>
    <div
      v-show="dialogsStore.currentDialog !== undefined && dialogsStore.show !== false"
      @click="dialogsStore.closeCurrentDialog()"
      class="custom-dialog"
    >
      <div class="gradient-border">
        <div @click.stop class="wrapper">
          <div class="dialog-form">
            <div v-if="hasCross" class="flex justify-end md:mt-[-16px] md:mr-[-6px]">
              <GButton @click="dialogsStore.closeCurrentDialog()">
                <CloseIcon color="#fff" size="16" />
              </GButton>
            </div>
            <component
              :is="dialogsStore.currentDialog?.name"
              v-bind="dialogsStore.currentDialog?.props"
            >
            </component>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
@import '@/assets/config.scss';

.move-enter-active,
.move-leave-active {
  transition: all 0.4s ease;
}
.move-enter-from,
.move-leave-to {
  opacity: 0;
  transform: translateY(50px);
}

.custom-dialog {
  position: fixed;
  top: -50px;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
}

.wrapper {
  position: relative;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  background: $white-color;
  border: 0.75px solid #ffffffcc;
  box-shadow: 0px 32px 64px rgba(36, 37, 38, 0.12);
  border-radius: 24px;
  background: linear-gradient(
    170.16deg,
    rgba(0, 16, 24, 0.5328) 6.14%,
    rgba(0, 14, 22, 0.2368) 92.61%
  );
}

.gradient-border {
  position: fixed;
  top: 53%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  z-index: 0;
}

.dialog-form {
  padding: 16px;
  border-radius: 16px;

  @media (min-width: 768px) {
    padding: 32px;
  }
}

.close-cross {
  position: absolute;
  align-self: flex-end;
  margin-bottom: 4px;
}
</style>
