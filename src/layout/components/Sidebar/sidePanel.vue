<template>
  <div class="side-panel">
    123
  </div>
</template>

<script>
export default {
  name: 'SidePanel',
  data() {
    return {

    };
  },
  methods: {

  }
};
</script>

<style lang="scss" scoped>
.side-panel{
  position: fixed;
  left: 72px;
  top: 70px;
  width: 160px;
  height: calc(100% - 72px);
  background: #fff;
  box-shadow: 5px 0px 16px rgba(145, 147, 148, 0.31);
}
</style>
