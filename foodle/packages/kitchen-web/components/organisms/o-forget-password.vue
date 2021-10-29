<template>
  <a-auth-layout>
    <a-forget-card>
      <form action="#" method="POST">
        <a-auth-title>
          {{ forget.title }}
        </a-auth-title>

        <a-auth-label forwhat="password">
          {{ forget.label }}
        </a-auth-label>
        <a-auth-input id="password" type="password" />

        <a-auth-label forwhat="password">
          {{ forget.labelRepeat }}
        </a-auth-label>
        <a-auth-input id="password" type="password" />

        <a-auth-button url="headchef">
          {{ forget.button }}
        </a-auth-button>
      </form>
    </a-forget-card>
  </a-auth-layout>
</template>

<script>
import AForgetCard from '@/components/atoms/a-forget-card.vue'
import AAuthLayout from '@/components/atoms/a-auth-layout.vue'
import AAuthTitle from '@/components/atoms/a-auth-title.vue'
import AAuthButton from '@/components/atoms/a-auth-button.vue'
import AAuthInput from '../atoms/a-auth-input.vue'
import AAuthLabel from '../atoms/a-auth-label.vue'
export default {
  components: {
    AForgetCard,
    AAuthLayout,
    AAuthTitle,
    AAuthButton,
    AAuthInput,
    AAuthLabel
  },
  props: {
    forget: {
      type: Object,
      required: true
    }
  }
}
</script>
