export default {
  methods: {
    redirectForUser (user) {
      if (user.role === 'headchef') {
        this.$router.push('/headchef')
      } else if (user.role === 'chef') {
        this.$router.push({
          name: 'chef',
          params: { kitchen_id: user.kitchenId }
        })
      }
    },
    formatOrder (firebaseOrder, firebaseDocumentId) {
      const arTime = new Date(firebaseOrder.createdAt.seconds * 1000)
      const esTimeFrom = new Date(firebaseOrder.estimatedDeliveryFrom.seconds * 1000)
      const esTimeTo = new Date(firebaseOrder.estimatedDeliveryTo.seconds * 1000)
      const dishes = []
      const kitchens = []
      firebaseOrder.kitchens.forEach((kitchen) => {
        if (!kitchens.includes(kitchen.kitchenId)) {
          kitchens.push(kitchen.kitchenId)
        }
        // kitchens.kitchenName = kitchen.kitchenName
        kitchen.dishes.forEach((dish) => {
          const dishSingle = {
            name: '',
            removeIngredient: [],
            sides: [],
            drink: [],
            extra: [],
            accessory: [],
            status: 'new'
          }
          dishSingle.name = dish.name
          dish.removeIngredients.forEach((remove) => {
            dishSingle.removeIngredient.push(remove)
          })
          dish.side.forEach((addOn) => {
            dishSingle.sides.push(addOn.name)
          })
          dish.drink.forEach((drinks) => {
            dishSingle.drink.push(drinks.name)
          })
          dish.extra.forEach((extras) => {
            dishSingle.extra.push(extras.name)
          })
          dish.accessory.forEach((accessories) => {
            dishSingle.accessory.push(accessories.name)
          })
          dishSingle.status = dish.dishStatus
          dishSingle.kitchenName = kitchen.kitchenName
          dishSingle.variant = dish.variant
          dishSingle.quantity = dish.quantity
          dishes.push(dishSingle)
        })
      })
      return {
        firebaseDocumentId,
        orderno: firebaseOrder.number,
        status: firebaseOrder.status,
        arrivedTime: this.numberPad(arTime.getHours()) + ':' + this.numberPad(arTime.getMinutes()) + ':' + this.numberPad(arTime.getSeconds()),
        estimatedTime: this.$moment(esTimeFrom).format('DD MMM') + ' ' + this.numberPad(esTimeFrom.getHours()) + ':' + this.numberPad(esTimeFrom.getMinutes()) + '-' + this.numberPad(esTimeTo.getHours()) + ':' + this.numberPad(esTimeTo.getMinutes()),
        items: dishes,
        address: 'Leveransadress',
        street_1: firebaseOrder.deliveryAddress.street_1,
        street_2: firebaseOrder.deliveryAddress.street_2,
        city: firebaseOrder.deliveryAddress.city,
        state: firebaseOrder.deliveryAddress.state,
        zip: firebaseOrder.deliveryAddress.zip,
        country: firebaseOrder.deliveryAddress.country,
        deliveredAt: firebaseOrder.deliveredAt ? firebaseOrder.deliveredAt.seconds : 0,
        telephone: 'TEL',
        telephoneVal: firebaseOrder.meta.phoneNumber,
        code: 'PORTKOD',
        codeVal: firebaseOrder.meta.doorCode,
        message: 'MEDDELANDE',
        messageVal: firebaseOrder.meta.message,
        delivery: firebaseOrder.delivery,
        kitchens
      }
    },
    formatDish (firebaseDish, firebaseDocumentId) {
      const arTime = new Date(firebaseDish.createdAt.seconds * 1000)
      const esTimeFrom = new Date(firebaseDish.estimatedDeliveryFrom.seconds * 1000)
      const esTimeTo = new Date(firebaseDish.estimatedDeliveryTo.seconds * 1000)
      const dishes = []
      const kitchens = []
      let kitchenCounter = 0
      firebaseDish.kitchens.forEach((kitchen) => {
        kitchenCounter++
        let counter = 0
        this.$store.dispatch('addOrder', {
          doc_id: firebaseDocumentId,
          order: firebaseDish
        })
        if (!kitchens.includes(kitchen.kitchenId)) {
          kitchens.push(kitchen.kitchenId)
        }
        kitchen.dishes.forEach((dish) => {
          counter++
          const dishSingle = {
            name: '',
            variant: '',
            removeIngredient: [],
            sides: [],
            drink: [],
            extra: [],
            accessory: []
          }
          dishSingle.name = dish.name
          dishSingle.dishStatus = dish.dishStatus
          dishSingle.variant = dish.variant
          dishSingle.quantity = dish.quantity
          dish.removeIngredients.forEach((remove) => {
            dishSingle.removeIngredient.push(remove)
          })
          dish.side.forEach((addOn) => {
            dishSingle.sides.push(addOn.name)
          })
          dish.drink.forEach((drinks) => {
            dishSingle.drink.push(drinks.name)
          })
          dish.extra.forEach((extras) => {
            dishSingle.extra.push(extras.name)
          })
          dish.accessory.forEach((accessories) => {
            dishSingle.accessory.push(accessories.name)
          })
          dishSingle.orderno = firebaseDish.number
          dishSingle.status = firebaseDish.status
          dishSingle.arrivedTime = this.numberPad(arTime.getHours()) + ':' + this.numberPad(arTime.getMinutes()) + ':' + this.numberPad(arTime.getSeconds())
          dishSingle.estimatedTime = this.$moment(esTimeFrom).format('DD MMM') + ' ' + this.numberPad(esTimeFrom.getHours()) + ':' + this.numberPad(esTimeFrom.getMinutes()) + '-' + this.numberPad(esTimeTo.getHours()) + ':' + this.numberPad(esTimeTo.getMinutes())
          dishSingle.messageVal = firebaseDish.meta.message
          dishSingle.preference = firebaseDish.preference
          dishSingle.orderno = firebaseDish.number
          dishSingle.kitchens = [kitchen.kitchenId]
          dishSingle.counter = counter
          dishSingle.kitchenCounter = kitchenCounter
          dishSingle.firebaseDocumentId = firebaseDocumentId
          dishes.push(dishSingle)
        })
      })
      return dishes
    },
    numberPad (number) {
      return ('0' + number).slice(-2)
    },
    getBackgrounColorString (status) {
      let color = 'foodle-red'
      switch (status) {
        case 'PROCESSING':
          color = 'pale-gold'
          break
        case 'READY':
          color = 'light-royal-green'
          break
        case 'SHIPPED':
          color = 'white'
          break
        case 'DELIVERED':
          color = 'white'
          break
        case 'HOLD':
          color = 'foodle-red'
          break
      }

      return color
    },
    logout () {
      this.$store.dispatch('logout')
    }
  },
  data () {
    return {
      loading: false
    }
  },
  computed: {
    selectedKitchenIdList () {
      return this.$store.state.kitchens.filter((kitchen) => {
        return kitchen.selected
      }).map(kitchen =>
        kitchen.id
      )
    },
    isHeadchef () {
      return this.$store.state.user.role === 'headchef'
    }
  }
}
