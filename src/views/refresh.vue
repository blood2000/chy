<!-- 空页面，负责中转到目标页面 -->
<template>
  <div />
</template>

<script>
export default {
  name: 'Refresh',
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.$router.replace({ path: from.path, query: vm.$store.getters.parameters });
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
