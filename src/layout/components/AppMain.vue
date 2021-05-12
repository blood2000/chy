<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key" />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    },
    key() {
      return this.$route.path;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-main {
  // 70: headerHeight
  min-height: calc(100vh - 70px);
  width: 100%;
  position: relative;
  // overflow: hidden;
  padding-top: 10px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 70 + 49 */
    min-height: calc(100vh - 119px);
  }
}

.fixed-header+.app-main{
  height: calc(100vh - 119px);
  overflow-y: auto;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
// .el-popup-parent--hidden {
//   .fixed-header {
//     padding-right: 15px;
//   }
// }
</style>
