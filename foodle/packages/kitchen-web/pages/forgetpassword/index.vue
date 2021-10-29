<template>
  <div>
    <o-forget-password :forget="forget" />
  </div>
</template>

<script>
import OForgetPassword from '@/components/organisms/o-forget-password.vue'
export default {
  components: { OForgetPassword },
  data () {
    return {
      forget: {
        title: 'Ange nytt lösenord',
        label: 'nytt lösenord',
        labelRepeat: 'Repetera nytt lösenord',
        button: 'Logga in'
      }
    }
  }
}
</script>
