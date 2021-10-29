<template>
  <div>
    <Navbar :navbar="navbar" />
    <Nuxt />
    <Footer :footer="footer" />
  </div>
</template>

<script>
import Footer from '~/components/sections/footer/Footer'
import Navbar from '~/components/sections/header/Navbar'

export default {
  components: { Footer, Navbar },
  data () {
    return {
      navbar: {},
      footer: {}
    }
  },
  async fetch () {
    const context = this.$nuxt.context

    // Check if we are in the editor mode
    const version = context.query._storyblok || context.isDev ? 'draft' : 'published'

    // Load the JSON from the API
    await context.app.$storyapi.get('cdn/stories/global', {
      version
    }).then((res) => {
      const navbar = res.data.story.content.navbar[0]
      this.navbar = {
        logo: navbar.logo.filename,
        navLinks: navbar.nav_links.map(link => ({
          text: link.name,
          url: link.link.cached_url.replace('pages/', '/')
        }))
      }

      const footer = res.data.story.content.footer[0]
      this.footer = {
        logo: footer.logo.filename,
        columns: footer.columns.map(column => ({
          navs: column.nav_links.map(link => ({
            text: link.name,
            url: link.link.cached_url.replace('pages/', '/'),
            icon: {
              type: link.icon.type,
              icon: link.icon.icon
            }
          }))
        }))
      }
    }).catch((res) => {
      context.error({ statusCode: res.response.status, message: res.response.data })
    })
  }
}
</script>

<style>
  body {
    margin: 0;
  }

</style>
