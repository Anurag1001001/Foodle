<template>
  <div class="text-white text-lg bg-tomato p-4 mt-2 mb-10 w-full bg-opacity-50">
    <h1><b>Sorry!!</b></h1>
    <p>{{ value }}</p>
  </div>
</template>

<script>
export default {
  name: 'Error',
  props: {
    value: {
      type: String,
      required: true
    }
  }
}
</script>
