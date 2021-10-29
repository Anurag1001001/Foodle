import Cookies from 'js-cookie'

export const state = () => ({
  categories: [],
  kitchens: [],
  delivery: {},
  cart: {
    total: 0,
    items: []
  },
  customer: {},
  location: {},
  serviceable: true,
  order: 0,
  coupon: null
})

export const mutations = {
  categories (state, categories) {
    state.categories = categories
  },
  kitchens (state, kitchens) {
    state.kitchens = kitchens
  },
  addOns (state, payload) {
    state[payload.name] = payload.addOns
  },
  addItemToCart (state, payload) {
    // add Item to cart first
    state.cart.total += payload.item.price
    state.cart.items.push(payload.item)
  },
  addLocation (state, location) {
    state.location = location
  },
  isServiceable (state, payload) {
    state.serviceable = payload
  },
  removeItemFromCart (state, payload) {
    // remove Item from cart
    state.cart.total -= payload.item.price
    state.cart.items.splice(payload.index, 1)
  },
  updateItemFromCart (state, payload) {
    // update Item from cart
    state.cart.total = payload.total
  },
  setCart (state, cart) {
    // add Item to cart first
    state.cart = cart
  },
  updateOrder (state, orderInfo) {
    // add Item to cart first
    state.order = orderInfo.id
  },
  updateCustomer (state, customerInfo) {
    // add Item to cart first
    state.customer = customerInfo
  },
  updateDelivery (state, deliveryInfo) {
    // update Delivery info
    state.delivery = deliveryInfo
  },
  setDeliveryType (state, payload) {
    state.delivery.type = payload
  },
  updateCoupon (state, coupon) {
    state.coupon = coupon
  }
}

export const actions = {
  setCategoriesData ({ commit }, categories) {
    commit('categories', categories)
  },
  setKitchenData ({ commit }, values) {
    const kitchenArray = []
    const kitchens = values[0].data.stories
    const newData = values[1]

    newData.brands.forEach((kitchen, idx) => {
      const menuItems = []

      const options = {}

      if ('products' in kitchen) {
        if ('dishes' in kitchen.products) {
          kitchen.products.dishes.forEach((dish) => {
            // parse dish ingredients from custom field
            const ingredientsNode = dish.custom_fields.find(node => node.name === 'Ingredienser')
            const variants = []
            let ingredients = []
            if (ingredientsNode != null) {
              ingredients = ingredientsNode.value.split(',').map(i => i.trim())
            }
            if ('variants' in dish) {
              // console.log('This is my dish ', dish)
              if (dish.variants.length > 1) {
                dish.variants.forEach((variant) => {
                  variants.push({
                    variant_id: variant.id,
                    product_id: variant.product_id,
                    sku: variant.sku,
                    sku_id: variant.sku_id,
                    price: variant.calculated_price - dish.price,
                    options: [{
                      id: (variant.option_values[0]).id,
                      label: (variant.option_values[0]).label
                    }]
                  })
                })
              }
            }
            menuItems.push({
              heading: dish.name,
              description: dish.description,
              price: parseFloat(dish.price),
              outOfStock: dish.availability !== 'available',
              productId: dish.id,
              sku: dish.sku,
              customizations: {
                customize: {
                  title: 'Ta bort ingredienser',
                  items: ingredients
                }
              },
              variants,
              selectedItems: 1,
              image: dish.images ? dish.images[0] : null
            })
          })
        }

        const optionCategories = this.app.$config.addons.split(',').map(i => i.trim())
        optionCategories.forEach((categoryNameFromConfig) => {
          const categoryName = categoryNameFromConfig.toLowerCase()
          options[categoryName] = []
          if (categoryName in kitchen.products) {
            kitchen.products[categoryName].forEach((option) => {
              options[categoryName].push({
                id: option.id,
                name: option.name,
                price: option.price,
                sku: option.sku
              })
            })
          }
        })
      }
      // Find kitchen from CMS
      const kitchenStoryblok = kitchens.find((kit) => {
        return kit.name === kitchen.name
      })

      if (kitchenStoryblok && (!('enabled' in kitchenStoryblok.content.kitchen.content) || kitchenStoryblok.content.kitchen.content.enabled === 'yes')) {
        const kitchenData = {
          name: kitchenStoryblok.name,
          brandId: kitchen.id,
          storyId: kitchenStoryblok.id,
          slug: kitchenStoryblok.slug,
          storyUuid: kitchenStoryblok.uuid,
          moduleType: kitchenStoryblok.content.kitchen.content.module_type,
          background: kitchenStoryblok.content.background.filename,
          title: kitchenStoryblok.content.kitchen.content.logo.filename,
          image: kitchenStoryblok.content.image.filename,
          description: kitchenStoryblok.content.kitchen.content.description,
          thumbnail: kitchenStoryblok.content.kitchen.content.thumbnail.filename,
          menu: menuItems,
          options
        }
        kitchenArray.push(kitchenData)
      }
    })

    commit('kitchens', kitchenArray)
  },
  setAddOnsData ({ commit }, payload) {
    const addOnsArray = []
    if (payload.addOns) {
      payload.addOns.forEach((addOn) => {
        const addOnData = {
          id: parseInt(addOn.id),
          name: addOn.name,
          price: parseFloat(addOn.price),
          sku: addOn.sku
        }
        addOnsArray.push(addOnData)
      })
    }
    commit('addOns', { name: payload.name, addOns: addOnsArray })
  },
  clearCart ({ commit }) {
    // Clear all items first
    let cart = Cookies.get('cart')
    if (!cart) {
      // initialize cart
      cart = {
        total: 0,
        items: []
      }
    } else {
      cart = JSON.parse(cart)
    }

    cart.items.forEach((key) => {
      Cookies.remove(key)
    })

    Cookies.remove('cart')
    commit('setCart', { total: 0, items: [] })
    // Remove Coupon
    Cookies.remove('coupon')
    commit('updateCoupon', null)
    // Remove payable amount
    Cookies.remove('payableAmount')
  },
  clearDelivery ({ commit }) {
    Cookies.remove('delivery')
    commit('updateDelivery', { })
  },
  addItemToCart ({ commit }, payload) {
    let cart = Cookies.get('cart')
    if (!cart) {
      // initialize cart
      cart = {
        total: 0,
        items: []
      }
    } else {
      cart = JSON.parse(cart)
    }

    let lastIndex = Cookies.get('lastIndex')
    if (!lastIndex) {
      lastIndex = 0
    } else {
      lastIndex = parseInt(lastIndex) + 1
    }
    // Generate new cart item key
    const newKey = 'item-' + lastIndex

    // Create Item with selected fields
    const newItem = {
      customizations: payload.item.customizations,
      heading: payload.item.heading,
      outOfStock: payload.item.outOfStock,
      price: payload.item.price,
      productId: payload.item.productId,
      sku: payload.item.sku,
      kitchen: payload.item.kitchen,
      kitchenModuleType: payload.item.kitchenModuleType
    }
    Cookies.set(newKey, newItem)

    cart.items.push(newKey)
    cart.total += newItem.price
    Cookies.set('lastIndex', lastIndex)
    Cookies.set('cart', JSON.stringify(cart))
    // sync state
    commit('addItemToCart', { key: newKey, item: newItem })
  },
  isServiceable ({ commit }, payload) {
    commit('isServiceable', payload)
  },
  addLocation ({ commit }, payload) {
    const location = payload
    Cookies.set('location', JSON.stringify(location))
    // sync state
    commit('addLocation', location)
  },
  removeItemFromCart ({ commit }, payload) {
    let cart = Cookies.get('cart')
    if (!cart) {
      cart = {
        total: 0,
        items: []
      }
    } else {
      cart = JSON.parse(cart)
    }
    const keyToRemove = cart.items[payload.index]
    cart.total -= payload.item.price
    cart.items.splice(payload.index, 1)
    Cookies.set('cart', JSON.stringify(cart))
    Cookies.remove(keyToRemove)
    commit('removeItemFromCart', { index: payload.index, item: payload.item })
  },
  updateItemFromCart ({ commit }, payload) {
    let cart = Cookies.get('cart')
    if (!cart) {
      cart = {
        total: 0,
        items: []
      }
    } else {
      cart = JSON.parse(cart)
    }
    const itemName = cart.items[payload.index]
    let item = Cookies.get(itemName)
    item = JSON.parse(item)
    const pervPrice = item.price
    cart.total = (cart.total - pervPrice) + payload.item.price
    Cookies.set('cart', JSON.stringify(cart))
    Cookies.set(itemName, JSON.stringify(payload.item))
    commit('updateItemFromCart', { index: payload.index, item: payload.item, total: cart.total })
  },
  updateOrder ({ commit }, payload) {
    commit('updateOrder', payload)
    localStorage.setItem('order', payload.id)
  },
  updateCustomer ({ commit }, payload) {
    Cookies.set('customer', JSON.stringify(payload))
    commit('updateCustomer', payload)
  },
  checkout ({ commit }) {
    this.$axios.$post('v2/orders', JSON.stringify({
      billing_address: {
        first_name: 'Jane',
        last_name: 'Doe',
        street_1: '123 Main Street',
        city: 'Austin',
        state: 'Texas',
        zip: '78751',
        country: 'United States',
        country_iso2: 'US',
        email: 'janedoe@email.com'
      },
      products: [
        {
          product_id: 130,
          product_options: [
            {
              id: '114',
              value: '98'
            }
          ],
          quantity: 1,
          price_inc_tax: 50,
          price_ex_tax: 45
        }
      ]
    })
    )
  },
  updateDelivery ({ commit }, payload) {
    Cookies.set('delivery', JSON.stringify(payload))
    commit('updateDelivery', payload)
  },
  setDeliveryType ({ commit }, payload) {
    commit('setDeliveryType', payload)
  },
  updateCoupon ({ commit }, payload) {
    if (payload !== null) {
      Cookies.set('coupon', JSON.stringify(payload))
    } else {
      Cookies.remove('coupon')
    }
    commit('updateCoupon', payload)
  },
  updateCartPayableAmount ({ commit }, payload) {
    Cookies.set('payableAmount', payload)
  }
}

export const getters = {
  getCartDetails (state) {
    return state.cart
  },
  getSavedOrder: (state) => {
    if (state.order.id) {
      return state.order.id
    }
    if (localStorage.getItem('order')) {
      return localStorage.getItem('order')
    } else {
      return 0
    }
  }
}
