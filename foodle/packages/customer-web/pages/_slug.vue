<template>
  <section>
    <component :is="story.content.component" v-if="story.content.component" :key="story.content._uid" :content="story.content" />
  </section>
</template>

<script>
export default {
  asyncData (context) {
    // Check if we are in the editor mode
    const version = context.query._storyblok || context.isDev ? 'draft' : 'published'

    const slug = context.params.slug === undefined ? 'hem' : context.params.slug

    // Load the JSON from the API
    return context.app.$storyapi.get(`cdn/stories/pages/${slug}`, {
      version
    }).then((res) => {
      console.log(res.data.story.content)
      return res.data
    }).catch((res) => {
      context.error({ statusCode: res.response.status, message: res.response.data })
    })
  },
  data () {
    return { story: { content: {} } }
  },
  head () {
    return {
      title: this.story.content.seo.title,
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: this.story.content.seo.description
        },
        {
          hid: 'og:title',
          name: 'og:title',
          content: this.story.content.seo.og_title
        },
        {
          hid: 'og:image',
          property: 'og:image',
          content: this.story.content.seo.og_image
        },
        {
          hid: 'og:description',
          property: 'og:description',
          content: this.story.content.seo.og_description
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: this.story.content.seo.twitter_title
        },
        {
          hid: 'twitter:image',
          property: 'twitter:image',
          content: this.story.content.seo.twitter_image
        },
        {
          hid: 'twitter:description',
          property: 'twitter:description',
          content: this.story.content.seo.twitter_description
        }
      ]
    }
  }
}
</script>
