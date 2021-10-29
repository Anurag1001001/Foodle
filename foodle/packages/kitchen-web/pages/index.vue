<template>
  <div>
    <o-login-form :login="login" />
  </div>
</template>

<script>
import OLoginForm from '@/components/organisms/o-login-form.vue'
export default {
  components: { OLoginForm },
  data () {
    return {
      login: {
        title: 'Logga in',
        labelEmail: 'E-Postadress',
        labelPassword: 'Lösenord',
        button: 'Logga in',
        link: 'Glömt lösenord?'
      }
    }
  }
}
</script>
