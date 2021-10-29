<template>
  <footer v-if="footer" class="bg-tomato">
    <div class="max-w-screen-lg mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
      <div class="mt-12 grid grid-cols-1 justify-items lg:grid-cols-4 gap-8 xl:mt-0 xl:col-span-2 text-center lg:text-left gap-y-20">
        <div class="logo-image space-y-8 xl:col-span-1 flex justify-center lg:justify-start">
          <img class="h-8" src="/images/logo.png" alt="Foodle">
        </div>
        <div v-for="(column, columnIndex) in footer.columns" :key="columnIndex">
          <ul class="space-y-4">
            <li v-for="(navLink, index) in column.navs" :key="index">
              <FooterLink v-if="navLink.icon.icon === ''" :url="navLink.url">
                {{ navLink.text }}
              </FooterLink>
              <FooterLink v-else :url="navLink.url">
                <div class="flex flex-col lg:flex-row gap-y-1">
                  <font-awesome-icon :icon="[navLink.icon.type, navLink.icon.icon.substring(3)]" class="w-6 h-6 inline mr-2 place-self-center" />
                  <div>{{ navLink.text }}</div>
                </div>
              </FooterLink>
            </li>
          </ul>
        </div>
      </div>
      <!-- Copyright -->
      <div class="mt-12 pt-8">
        <p class="leading-6 text-white px-20 text-center lg:text-left lg:px-0">
          &copy; Foodle AB 2020
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
import FooterLink from '~/components/elements/FooterLink'
export default {
  name: 'Footer',
  components: { FooterLink },
  props: {
    footer: {
      type: Object,
      default: () => {
      }
    }
  }
}
</script>

<style scoped>
.logo-image {
  text-align: -webkit-center;
}
</style>
