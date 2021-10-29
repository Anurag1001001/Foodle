<template>
  <div>
    <AHiddenColorSamples />
    <m-slide-over :slide-over="slideOver" />
    <Nuxt />
  </div>
</template>

<script>
import MSlideOver from '@/components/molecules/m-slide-over'
import AHiddenColorSamples from '@/components/atoms/a-hidden-color-samples'
export default {
  components: { MSlideOver, AHiddenColorSamples },
  data () {
    return {
    }
  },
  computed: {
    slideOver () {
      return {
        title: this.title,
        button: 'Logga ut',
        timeslotButton: 'Till Tidsslot'
      }
    },
    title () {
      return this.$store.state.user.role === 'headchef' ? 'Aktiva kök' : this.$store.state.user.kitchenName
    }
  },
  mounted () {
    this.$fire.auth.onAuthStateChanged((user) => {
      if (!user) {
        this.$router.replace('/')
      } else {
        // Get user role info
        this.$fire.firestore.collection('users').where('emailId', '==', user.email).onSnapshot((querySnapshot) => {
          if (querySnapshot.empty) {
            this.$router.replace('/')
          } else {
            querySnapshot.forEach((doc) => {
              this.$store.dispatch('setUser', doc.data())
            })
          }
        })

        this.$fire.firestore.collection('kitchens').orderBy('sort_order').onSnapshot((querySnapshot) => {
          this.$store.dispatch('setKitchens', [])
          querySnapshot.forEach((doc) => {
            this.$store.dispatch('addKitchen', {
              content: doc.data().name,
              id: doc.data().id,
              selected: this.$store.state.user.role === 'headchef' ? true : doc.data().id === this.$store.state.user.kitchenId
            })
          })
        })
      }
    })
  }
}
</script>

<style>
html {
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
