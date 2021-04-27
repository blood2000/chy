<template>
  <div class="g-statistic">
    <!-- left -->
    <div class="ly-left ly-border">
      <div class="ly-left-top mb1rem ly-flex-pack-justify ly-border">
        <div class="ly-left-top-left ly-border">
          <Title class="title_1" icon="1">监管数据<span>Regulatory data</span></Title>
          <RegulatoryData />
        </div>
        <div class="ly-left-top-right ly-border">
          <Title class="title_2" icon="2">用户情况<span>User situation</span></Title>
          <UserInfo />
        </div>
      </div>
      <div class="ly-left-center mb1rem ly-border">
        <Title class="title_3" icon="3">运力情况<span>Capacity situation</span></Title>
        <CapacityInfo />
      </div>
      <div class="ly-left-bottom ly-border">
        <Title class="title_3" icon="4">业绩数据<span>Performance data</span></Title>
        <div class="ly-left-bottom-box ly-flex-pack-justify">
          <div class="ly-left-bottom-left ly-border">
            左-下-左
          </div>
          <div class="ly-left-bottom-right ly-border">
            左-下-右
          </div>
        </div>
      </div>
    </div>

    <!-- center -->
    <div class="ly-center ly-border">
      中
    </div>

    <!-- right -->
    <div class="ly-right ly-flex-pack-justify ly-border">
      <div class="ly-right-left ly-border">
        <div class="ly-right-left-top mb1rem ly-border">
          <Title class="title_4" icon="5">运营情况<span>Operation situation</span></Title>
          右-左-上
        </div>
        <div class="ly-right-left-bottom ly-border">
          <Title class="title_5" icon="6">目标达成情况<span>Achievement of Goals</span></Title>
          右-左-下
        </div>
      </div>
      <div class="ly-right-right ly-border">
        <Title class="title_4" icon="7">总排名<span>Total number</span></Title>
        <div class="ly-right-right-top mb1rem ly-border">
          右-右-上
        </div>
        <div class="ly-right-right-bottom mb1rem ly-border">
          右-右-下
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from './components/title';
import RegulatoryData from './RegulatoryData';
import UserInfo from './UserInfo';
import CapacityInfo from './CapacityInfo';
export default {
  name: 'Statistic',
  components: {
    Title,
    RegulatoryData,
    UserInfo,
    CapacityInfo
  }
};
</script>

<style lang="scss" scoped>
// 辅助线
.ly-border {
  box-sizing: border-box;
  border: 1px dashed rgb(255, 255, 255, 0.2);
}

// 设计稿大小：3200*1080
// 1rem = 20px;
.g-statistic {
  //variabbles
  $width: 160rem;
  $width_left: 53.8rem;
  $width_right: 48rem;
  $mb1rem: 1rem;

  //base
  position: relative;
  color: #fff;
  font-size: 0.7rem;
  background-color: #011c5f;

  //unSelect
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  //layout
  width: $width;
  height: 100%;
  padding: 2.3rem 1.6rem 1.4rem;
  overflow: hidden;
  .mb1rem{
    margin-bottom: $mb1rem;
  }
  .ly-left {
    width: $width_left;
    height: 100%;
    float: left;
    .ly-left-top, .ly-left-center {
      height: calc(21.87% - #{$mb1rem});
      .ly-left-top-left {
        width: 19.6rem;
      }
      .ly-left-top-right {
        width: 32.6rem;
      }
    }
    .ly-left-bottom {
      height: calc(100% - 21.87% * 2);
      .ly-left-bottom-box{
        height: calc(100% - 2.9rem);
        .ly-left-bottom-left {
          width: 28.4rem;
        }
        .ly-left-bottom-right {
          width: 23.8rem;
        }
      }
    }
  }
  .ly-center {
    width: calc(100% - #{$width_left} - #{$width_right});
    height: 100%;
    float: left;
  }
  .ly-right {
    width: $width_right;
    height: 100%;
    float: right;
    .ly-right-left {
      width: 23.4rem;
      .ly-right-left-top {
        height: calc(100% - 26.5% - #{$mb1rem});
      }
      .ly-right-left-bottom {
        height: 26.5%;
      }
    }
    .ly-right-right {
      width: 23rem;
      .ly-right-right-top, .ly-right-right-bottom {
        height: calc(50% - #{$mb1rem} - 0.95rem);
      }
    }
  }

  // comment

  //style

}
</style>
