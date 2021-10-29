export default function ({ $axios, redirect }) {
  $axios.setHeader('Accept', 'application/json')
  $axios.setHeader('Content-Type', 'application/json')
  $axios.setHeader('x-auth-token', process.env.COMMERCE_TOKEN)
}
