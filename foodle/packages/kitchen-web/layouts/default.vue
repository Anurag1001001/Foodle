<template>
  <div>
    <Nuxt v-if="!loading" />
    <div v-else class="min-h-screen items-center justify-center">
      Loading....
    </div>
  </div>
</template>

<script>
export default {
  created () {
    this.loading = true
    this.$fire.auth.onAuthStateChanged((user) => {
      if (user && user.email) {
        this.$fire.firestore.collection('users').where('emailId', '==', user.email).onSnapshot((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            this.redirectForUser(doc.data())
          })
        })
      } else {
        this.loading = false
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
