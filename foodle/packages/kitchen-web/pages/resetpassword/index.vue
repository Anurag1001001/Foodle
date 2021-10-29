<template>
  <div>
    <o-reset-password :reset="reset" />
  </div>
</template>

<script>
import OResetPassword from '@/components/organisms/o-reset-password.vue'
export default {
  components: { OResetPassword },
  data () {
    return {
      reset: {
        title: 'Ange din e-postadress',
        label: 'E-Postadress',
        button: 'Återställ lösenord'
      }
    }
  }
}
</script>
