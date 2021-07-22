<template>
  <div class="middle-row-content-item pr" :class="mclassName">
    <div v-once class="middle-row-icon pa" :class="layout.paIcon" />

    <div class="middle-row-tcontent">
      <div v-once class="middle-row-title"><span class="marginright5" :class="layout.color">●</span>{{ layout.title }} <span v-if="layout.z30d" class="z30d">最近30天</span></div>


      <div class="middle-row-btn">
        <div v-for="(item, index) in datas" :key="index">
          <div class="middle-span" :class="!item.mt_show?'mt_show': null">{{ item.mt_show || '...' }}</div>
          <div class="g-text">
            <!-- {{ item.value }} -->
            <count-to :end-val="item.value -0" :decimal-places="item.unit==='万元' || item.unit==='元'? 2:0" />
            <span>{{ item.unit }}</span></div>
        </div>
      </div>

      <div class="middle-row-btn">
        <div v-if="layout.primary1">
          <el-button type="primary" size="mini" @click="$emit('click1')">{{ layout.primary1 }}</el-button>
        </div>
        <div v-if="layout.primary2">
          <el-button type="primary" plain class="bgf" size="mini" @click="$emit('click2')">{{ layout.primary2 }}</el-button>
        </div>
      </div>
    </div>
    <!-- <div class="middle-row-icon icon-zhanghu pa" />
    <div class="middle-row-title"><span class="g-color-error marginright5">●</span>现金账户余额 <span class="z30d">最近30天</span></div>


    <div class="middle-row-btn">
      <div>
        <div class="middle-span mt_show">...</div>
        <div class="g-text">4,369.68 <span>元</span></div>
      </div>
      <div>
        <div class="middle-span mt_show">非公开货源</div>
        <div class="g-text">1369<span>单</span></div>
      </div>
    </div>

    <div class="middle-row-btn">
      <div>
        <el-button type="primary" size="mini">充值</el-button>
      </div>
      <div>
        <el-button type="primary" plain class="bgf" size="mini">提现</el-button>
      </div>
    </div> -->
  </div>
</template>

<script>
import CountTo from '@/components/CountTo';

export default {
  components: { CountTo },
  props: {
    layout: {
      type: Object,
      default: () => {
        return {
          paIcon: 'icon-zhanghu', // 定位的图标
          title: '现金账户余额',
          color: 'g-color-error',
          z30d: false,
          primary1: '充值', // 显示正常的值
          primary2: '提现'
        };
      }
    },
    datas: {
      type: Array,
      default: () => []
    },
    col: {
      type: [String, Number],
      default: 2
    }
  },

  computed: {
    mclassName() {
      let className = null;
      switch (this.col - 0) {
        case 2:
          className = null;
          break;
        case 3:
          className = 'col3';
          break;
      }

      return className;
    }
  }

};
</script>

<style lang="scss" scoped>

.middle-row-content-item{
        width: 50%;
        background-color: #fff;
        margin-left: 15px;
        border-radius: 4px 20px 4px 4px;
        overflow: hidden;
        padding: 6px 30px;

        .middle-row-tcontent{
          display: flex;
          flex-direction: column;
          justify-content: space-around;
        }

        .middle-row-icon{
          top: 0;
          right: 0;
          width: 50px;
          height: 50px;
        }
        .icon-zhanghu{
          background: url('~@/assets/images/workbench/icon-zhanghu.png') no-repeat;
          background-size: 100% 100%;
        }
        .icon-donjie{
          background: url('~@/assets/images/workbench/icon-donjie.png') no-repeat;
          background-size: 100% 100%;
        }
        .icon-fabu{
          background: url('~@/assets/images/workbench/icon-fabu.png') no-repeat;
          background-size: 100% 100%;
        }
        .icon-guanbi{
          background: url('~@/assets/images/workbench/icon-guanbi.png') no-repeat;
          background-size: 100% 100%;
        }
        .icon-yijiedan{
          background: url('~@/assets/images/workbench/icon-yijiedan.png') no-repeat;
          background-size: 100% 100%;
        }
        .icon-yizhuanhuo{
          background: url('~@/assets/images/workbench/icon-yizhuanhuo.png') no-repeat;
          background-size: 100% 100%;
        }
        .icon-yixie{
          background: url('~@/assets/images/workbench/icon-yixie.png') no-repeat;
          background-size: 100% 100%;
        }
        .icon-yifuhe{
          background: url('~@/assets/images/workbench/icon-yifuhe.png') no-repeat;
          background-size: 100% 100%;
        }
        .icon-hesuan{
          background: url('~@/assets/images/workbench/icon-hesuan.png') no-repeat;
          background-size: 100% 100%;
        }
        .icon-yidakuan{
          background: url('~@/assets/images/workbench/icon-yidakuan.png') no-repeat;
          background-size: 100% 100%;
        }
        .icon-yishenqing{
          background: url('~@/assets/images/workbench/icon-yishenqing.png') no-repeat;
          background-size: 100% 100%;
        }
        .icon-daihesuan{
          background: url('~@/assets/images/workbench/icon-daihesuan.png') no-repeat;
          background-size: 100% 100%;
        }
        .icon-yikai{
          background: url('~@/assets/images/workbench/icon-yikai.png') no-repeat;
          background-size: 100% 100%;
        }
        .g-text span{
          color: #B3AFAF;
          margin-left: 10px;
        }

      .middle-row-title{
        display: flex;
        font-size: 14px;
        font-weight: bold;
        color: #262626;
        margin-left: -12px;
        margin-bottom: 6px;
        white-space: nowrap;
      }
      .middle-row-btn{
        display: flex;
        &>div{
          width: 40%;
        }
        .el-button{
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100px;
          height: 30px;
        }
      }

      .middle-span{
        font-size: 12px;
        font-weight: 500;
        line-height: 1;
        color: #B3AFAF;
      }
      .middle-span.mt_show{
        opacity: 0;
      }
      .marginright5{
          margin-right: 5px;
      }
}
@media (max-width:1500px) {
  .middle-row-content-item .middle-row-btn .el-button{
    width: 90% !important;
  }

}

.middle-row-content-item.col3{
    width: 33.3%;
    .middle-row-btn>div{
        width: 50%;
    }
}

.g-text{
  display: flex;
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
      white-space: nowrap;
    }
  }
  .z30d{
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 500;
    line-height: 20px;
    color: #B3AFAF;
    opacity: 1;
    margin-left: 10px;
    white-space: nowrap;
  }
  .bgf{
    background-color: #fff;
  }
</style>
