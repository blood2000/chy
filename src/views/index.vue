<template>
  <div style="height: 100%">
    <WorkBanch v-if="false" :width="screenWidth" />

    <WorkbanchShipper />
  </div>
</template>

<script>
import { ThrottleFun } from '@/utils/index.js';
// import { color } from 'echarts';
import WorkBanch from '../components/Ddc/Tin/WorkBanch';// 客服工作台

import WorkbanchShipper from '../components/Ddc/Tin/WorkBanchShipper'; // 货主工作台
export default {
  name: 'Index',
  components: {
    WorkBanch, WorkbanchShipper
  },
  data() {
    return {
      // 版本号
      version: '1.2.4.0',
      activeName: '0',
      screenWidth: document.body.clientWidth
    };
  },
  mounted() {
    window.addEventListener('resize', this.resizeFun);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFun);
  },
  created() {
    this.changeWidth();
  },
  methods: {
    resizeFun() {
      const throttle = ThrottleFun(this.changeWidth, 500);
      throttle();
    },
    goTarget(href) {
      window.open(href, '_blank');
    },
    changeWidth() {
      window.screenWidth = document.body.clientWidth;
      this.screenWidth = window.screenWidth;
      console.log(this.screenWidth);
      if (this.screenWidth > 1366) {
        this.activeName = '0';
      } else {
        this.activeName = '1';
      }
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

