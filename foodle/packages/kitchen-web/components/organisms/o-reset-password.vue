<template>
  <a-auth-layout>
    <a-reset-card>
      <form action="#" method="POST">
        <a-auth-title>
          {{ reset.title }}
        </a-auth-title>

        <a-auth-label forwhat="email">
          {{ reset.label }}
        </a-auth-label>
        <a-auth-input id="email" type="email" />

        <a-auth-button url="forgetpassword">
          {{ reset.button }}
        </a-auth-button>
      </form>
    </a-reset-card>
  </a-auth-layout>
</template>

<script>
import AResetCard from '@/components/atoms/a-reset-card.vue'
import AAuthLayout from '@/components/atoms/a-auth-layout.vue'
import AAuthTitle from '@/components/atoms/a-auth-title.vue'
import AAuthButton from '@/components/atoms/a-auth-button.vue'
import AAuthInput from '../atoms/a-auth-input.vue'
import AAuthLabel from '../atoms/a-auth-label.vue'
export default {
  components: {
    AResetCard,
    AAuthLayout,
    AAuthTitle,
    AAuthButton,
    AAuthInput,
    AAuthLabel
  },
  props: {
    reset: {
      type: Object,
      required: true
    }
  }
}
</script>
