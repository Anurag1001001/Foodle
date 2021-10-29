<template>
  <section>
    <component :is="story.content.component" v-if="story.content.component" :key="story.content._uid" :content="story.content" />
  </section>
</template>

<script>
export default {
  async asyncData (context) {
    // Check if we are in the editor mode
    const version = context.query._storyblok || context.isDev ? 'draft' : 'published'

    const response = {
      story: {},
      kitchen: null
    }

    await context.app.$storyapi.get('cdn/stories/pages/menys', {
      version
    }).then((res) => {
      response.story = res.data.story
    }).catch((res) => {
      context.error({ statusCode: res.response.status, message: res.response.data })
    })

    if (context.app.router.currentRoute.params.slug !== '' && context.app.router.currentRoute.params.slug !== 'vara-kok') {
      await context.app.$storyapi.get(`cdn/stories/menus/${context.app.router.currentRoute.params.slug}`, {
        version
      }).then((res) => {
        response.kitchen = res.data.story
      }).catch((res) => {
        console.log('Kitchen not found')
      })
    }

    return response
  },
  data () {
    return {
      story: { content: {} },
      kitchen: null
    }
  },
  head () {
    return {
      title: this.kitchen === null ? this.story.content.seo.title : this.kitchen.content.seo.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.kitchen === null ? this.story.content.seo.description : this.kitchen.content.seo.description
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.kitchen === null ? this.story.content.seo.og_title : this.kitchen.content.seo.og_title
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.kitchen === null ? this.story.content.seo.og_image : this.kitchen.content.seo.og_image
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.kitchen === null ? this.story.content.seo.og_description : this.kitchen.content.seo.og_description
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.kitchen === null ? this.story.content.seo.twitter_title : this.kitchen.content.seo.twitter_title
        },
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content: this.kitchen === null ? this.story.content.seo.twitter_image : this.kitchen.content.seo.twitter_image
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: this.kitchen === null ? this.story.content.seo.twitter_description : this.kitchen.content.seo.twitter_description
        }
      ]
    }
  }
}
</script>
