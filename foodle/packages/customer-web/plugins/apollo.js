export default (context) => {
  return {
    httpEndpoint: 'https://foodler.mybigcommerce.com/graphql',

    /*
     * For permanent authentication provide `getAuth` function.
     * The string returned will be used in all requests as authorization header
     */
    getAuth: () => 'Bearer ' + process.env.COMMERCE_GRAPHQL_TOKEN
  }
}
