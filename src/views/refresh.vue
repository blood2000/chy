<!-- 空页面，负责中转到目标页面 -->
<template>
  <div />
</template>

<script>
export default {
  name: 'Refresh',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$router.replace(from.path);
    });
  },
  data() {
    return {
    };
  }
};

</script>
<style scoped>
</style>
