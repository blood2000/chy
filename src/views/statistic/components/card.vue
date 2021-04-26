<template>
  <div class="card">
    <slot />
  </div>
</template>

<script>
export default {
  prop: {
    icon: {
      type: String,
      default: null
    }
  }
};
</script>

<style lang="scss" scoped>
.card {

}
</style>
