<template>
  <div>
    <svg-icon icon-class="question" @click="goto"/>
  </div>
</template>

<script>
export default {
  name: 'ddcDoc',
  data() {
    return {
      url: 'https://ddcwl.com/'
    }
  },
  methods: {
    goto() {
      window.open(this.url)
    }
  }
}
</script>
