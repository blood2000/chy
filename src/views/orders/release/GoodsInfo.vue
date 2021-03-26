<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="(dict,index) in tabs"
        :key="index"
        :label="dict.dictLabel"
        :name="dict.activeName"
      />
    </el-tabs>
    <div v-for="(good,index) in tabs" :key="index">
      <div v-show="good.activeName === activeName">
        <GoodsAccounting :ref="'GoodsAccounting'+ good.activeName" :cb-data="good.goodsAccounting" @getGoodsUnitName="(data)=> goodsUnitName = data" />
        <!--规则又是根据地址-->
        <el-divider />

        <div v-for="(redi,i) in good.redis" :key="i">

          <AccounTing :ref="'AccounTing'+i" :pubilsh-code="pubilshCode" :redis="redi" :goods-unit-name="goodsUnitName" />
        </div>

      </div>
    </div>

    <el-button @click="_submitForm">测试</el-button>
  </div>
</template>

<script>
import GoodsAccounting from './component/GoodsAccounting';
import AccounTing from './component/AccounTing';
export default {
  components: { GoodsAccounting, AccounTing },
  props: {
    goods: { type: Array, default: () => [] },
    addrAdd: { type: Array, default: () => [] },
    addrXie: { type: Array, default: () => [] },
    pubilshCode: { type: String, default: '' },
    goodsBigType: { type: [String, Number], default: '' },
    cbGoodsAccounting: { type: Array, default: () => [] }
  },

  data() {
    return {
      activeName: '0',
      tabs: [],
      goodsUnitName: '吨'
    };
  },

  created() {
    console.log(this.goods);
    console.log(this.addrAdd);
    console.log(this.addrXie);
    console.log(this.pubilshCode);
    console.log(this.cbGoodsAccounting); // 创建的时候 null

    this.init();
  },

  methods: {
    async getGoodsAccounting() {
      // 这里是获取商品的信息
      const arr = this.tabs.map(async e => {
        return {
          ...e,
          orderGood: (await this.$refs['GoodsAccounting' + e.activeName][0]._submitForm())
        };
      });

      return await Promise.all(arr);
    },
    // 获取规格
    async getAccounTing() {
      this.tabs = await this.getGoodsAccounting(); // 结构就是 this.tabs

      for (const e of this.tabs) {
        const lists = e.redis.map(async(ee, i) => {
          const accounTing = (await this.$refs['AccounTing' + i][0]._submitForm());
          return {
            ...ee,
            orderFreightBoList: (await this.$refs['AccounTing' + i][0]._submitForm()).orderFreightBoList,
            goodsType: e.goodsType,
            goodsBigType: this.goodsBigType,
            ruleDictValue: accounTing.ruleDictValue,
            ruleInfoShipmentCode: accounTing.orderFreightBoList[0].ruleCode
          };
        });
        e.newRedis = await Promise.all(lists);
      }


      //   this.tabs.forEach(async e => {
      //     const lists = e.redis.map(async(ee, i) => {
      //       const accounTing = (await this.$refs['AccounTing' + i][0]._submitForm());

      //       return {
      //         ...ee,
      //         orderFreightBoList: (await this.$refs['AccounTing' + i][0]._submitForm()).orderFreightBoList,
      //         goodsType: e.goodsType,
      //         goodsBigType: this.goodsBigType,
      //         ruleInfoShipmentCode: accounTing.orderFreightBoList[0].ruleCode
      //       };
      //     });

      //     console.log(lists);


      //     e.newRedis = await Promise.all(lists);
      //   });

    //   return this.tabs; // 返回处理后的this.tabs
    },
    // 返回数据
    async _submitForm() {
      await this.getAccounTing();
      console.log(this.tabs);


      return this.tabs;
    },

    // 数据初始化(created的时候)
    init() {
      this.tabs = this.goods.map((e, index) => {
        // 回填有值的时候
        if (this.cbGoodsAccounting) {
          this.cbGoodsAccounting.forEach(ee => {
            if (e.dictCode === ee.goodsType) {
              e.goodsAccounting = ee;
            }
          });
        }

        return {
        //   ...e, 先存这三个
          dictLabel: e.dictLabel,
          dictCode: e.dictCode,
          goodsType: e.dictCode,
          redis: this.addressInit(), // 规则
          activeName: index + ''
        };
      });
      this.activeName = '0';

      console.log(this.tabs);
    },

    // 判断规则是多装还是多卸, 并处理装地址--卸地址
    addressInit() {
      let arr = [];

      if (this.addrXie.length >= 2) {
        arr = this.addrXie.map(e => {
          return {
            ...e,
            tin_name: this.addrAdd[0].detail + '--' + e.detail
          };
        });
      } else {
        arr = this.addrAdd.map(e => {
          return {
            ...e,
            tin_name: e.detail + '--' + this.addrXie[0].detail
          };
        });
      }

      return arr;
    }
  }
};
</script>


<style lang="scss" scoped>

.header {
  padding-bottom: 10px;
  position: relative;
  font-weight: 700;
  &::before {
    content: "";
    position: absolute;
    width: 3px;
    height: 20px;
    left: -15px;
    top: 1px;
    background-color: #1890ff;
  }
}


</style>
