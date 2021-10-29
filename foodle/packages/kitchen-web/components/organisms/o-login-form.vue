<template>
  <a-auth-layout>
    <a-auth-card>
      <form @submit.prevent="pressed">
        <a-auth-title>
          {{ login.title }}
        </a-auth-title>

        <a-auth-label forwhat="email">
          {{ login.labelEmail }}
        </a-auth-label>
        <a-auth-input id="email" v-model="email" type="email" />

        <a-auth-label forwhat="password">
          {{ login.labelPassword }}
        </a-auth-label>
        <a-auth-input id="password" v-model="password" type="password" />

        <a-alert v-if="errors !== ''" :error="1 === 1">
          {{ errors }}
        </a-alert>

        <button class="w-full h-16.25 text-14-lineHeight-1.43 rounded-5 font-foodle font-bold text-white focus:outline-none uppercase mt-5.5 mb-5 flex items-center justify-center" type="submit" :disabled="loading" :class="{ 'bg-gray-400': loading, 'bg-light-royal-blue hover:bg-blue-600': !loading }">
          <template v-if="!loading">
            {{ login.button }}
          </template>
          <template v-else>
            Vänta...
          </template>
        </button>
      </form>
    </a-auth-card>
  </a-auth-layout>
</template>

<script>
import firebase from 'firebase/app'
import AAuthCard from '@/components/atoms/a-auth-card.vue'
import AAuthLayout from '@/components/atoms/a-auth-layout.vue'
import AAuthTitle from '@/components/atoms/a-auth-title.vue'
import AAuthLink from '@/components/atoms/a-auth-link.vue'
import AAuthInput from '../atoms/a-auth-input.vue'
import AAuthLabel from '../atoms/a-auth-label.vue'
import AAlert from '../atoms/a-alert.vue'
require('firebase/auth')
export default {
  components: {
    AAuthCard,
    AAuthLayout,
    AAuthTitle,
    AAuthLink,
    AAuthInput,
    AAuthLabel,
    AAlert
  },
  props: {
    login: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      headchef: '',
      chef: '',
      email: '',
      password: '',
      errors: '',
      user: ''
    }
  },
  methods: {
    pressed () {
      this.loading = true
      this.errors = ''
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
        return firebase.auth().signInWithEmailAndPassword(this.email, this.password).then((user) => {
          this.loading = false
          try {
            this.$fire.firestore.collection('users').where('emailId', '==', this.email).onSnapshot((querySnapshot) => {
              if (querySnapshot.empty) {
                this.errors = 'Please check with admin to setup your role.'
              } else {
                querySnapshot.forEach((doc) => {
                  this.redirectForUser(doc.data())
                })
              }
            })
          } catch (e) {
            console.log(e)
            this.errors = e
          }
        }).catch((error) => {
          this.loading = false
          this.errors = error
        })
      })
    }
  }
}
</script>
