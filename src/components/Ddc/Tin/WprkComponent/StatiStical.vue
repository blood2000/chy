<template>
  <div class="shujubox-rowitem">

    <div v-for="(item,index) in datas" :key="index" class="shujubox-rowitem-item">
      <div class="shujubox-rowitem-item-t" :class="!item.name?'text_none': null">{{ item.name || '***' }}</div>
      <div class="g-text">{{ item.value }} <span>{{ item.unit }}</span></div>
    </div>

    <!-- <div v-if="(item,index) in datas" :key="index" class="shujubox-rowitem-item">
      <div class="shujubox-rowitem-item-t">{{ item.name }}</div>
      <div class="g-text">123 <span>个</span></div>
    </div>
    <div class="shujubox-rowitem-item">
      <div class="shujubox-rowitem-item-t">合作车辆</div>
      <div class="g-text">266 <span>辆</span></div>
    </div>
    <div class="shujubox-rowitem-item">
      <div class="shujubox-rowitem-item-t">合作司机</div>
      <div class="g-text">266.5 <span>人</span></div>
    </div> -->

  </div>
</template>

<script>
export default {
  props: {
    datas: {
      type: Array,
      default: () => []
    //   [
    //     {
    //       name: '合作车队',
    //       value: '123',
    //       unit: '个'
    //     },
    //     {
    //       name: '合作车辆',
    //       value: '123',
    //       unit: '辆'
    //     },
    //     {
    //       name: '合作司机',
    //       value: '123',
    //       unit: '个'
    //     }
    //   ]
    }
  }

};
</script>

<style lang="scss" scoped>
.shujubox{
//   flex-direction: column;
//   justify-content: space-between;
//   height: 100%;
  &-rowitem{
    height: 20%;
    color: #fff;
    display: flex;
    align-items: center;
    &-item{
      width: 33.33%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      &-t{
        font-size: 12px;
        color: #FFFFFF;
      }
      .text_none{
        opacity: 0;
      }
      .g-text,.g-text span{
        color: #FFFFFF;
      }

    }
  }
}
.g-text{
    font-size: 24px;
    font-weight: bold;
    font-family: Bahnschrift;
    color: #262626;
    margin-top: 5px;
    margin-bottom: 2px;
    span{
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 22px;
      color: #262626;
    }
  }


</style>
