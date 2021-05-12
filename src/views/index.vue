<template>
  <div>
    <index1920 v-if="activeName === '0'" />
    <index1366 v-if="activeName === '1'" />
  </div>
</template>

<script>
// import { color } from 'echarts';
import index1920 from '../components/Ddc/Tin/index1920';// 首页分辨率1920*1080
import index1366 from '../components/Ddc/Tin/index1366';// 首页分辨率1366*768
export default {
  name: 'Index',
  components: {
    index1920,
    index1366
  },
  data() {
    return {
      // 版本号
      version: '1.2.4.0',
      activeName: '0'
    };
  },
  methods: {
    goTarget(href) {
      window.open(href, '_blank');
    }
  }
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "Bahnschrif";
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

