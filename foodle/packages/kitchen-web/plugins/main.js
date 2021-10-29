import Vue from 'vue'
import VueHtmlToPaper from 'vue-html-to-paper'

const options = {
  name: 'Foodle',
  specs: [
    'fullscreen=no',
    'titlebar=no',
    'scrollbars=no'
  ],
  styles: [
    'https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/1.4.6/tailwind.min.css'
  ],
  timeout: 1000, // default timeout before the print window appears
  autoClose: true, // if false, the window will not close after printing
  windowTitle: 'Order Summary'
}

Vue.use(VueHtmlToPaper, options)

// or, using the defaults with no stylesheet
// Vue.use(VueHtmlToPaper);
