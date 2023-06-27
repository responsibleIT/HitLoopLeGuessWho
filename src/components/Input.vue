
<script setup>
defineProps({
  name: String,
  type: String,
  min: Number,
  max: Number
})
</script>

<template>
<div>
  <label :for='name'>{{ name }}</label>
  <input :type="type" :name="name" :id="name" />
</div>

  


</template>


<style lang="scss" scoped>

</style>