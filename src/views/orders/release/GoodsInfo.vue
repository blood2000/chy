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
        <GoodsAccounting
          :ref="'GoodsAccounting'+ good.activeName"
          :cb-data="good.goodsAccounting"
          :myisdisabled="myisdisabled"
          :now-goods="good"
          @getGoodsUnitName="(data)=> goodsUnitName = data"
          @totalTypeValue="(data)=> totalTypeValue = data"
          @validatePass="validatePass"
        />
        <el-divider />

        <div v-for="(redi,i) in good.redis" :key="i">

          <AccounTing
            :ref="'AccounTing' +good.activeName +i"
            :pubilsh-code="pubilshCode"
            :redis="redi"
            :goods-unit-name="goodsUnitName"
            :total-type-value="totalTypeValue"
            :myisdisabled="myisdisabled"
            :good="good"
            :goods-submit-form="getGoodsAccounting"
            @showisweitian="showisweitian"
          />
        </div>

      </div>
    </div>

  </div>
</template>

<script>
import GoodsAccounting from './component/GoodsAccounting';
import AccounTing from './component/AccounTing';
export default {
  components: { GoodsAccounting, AccounTing },
  props: {
    goods: { type: Array, default: () => [] },
    cbOrderFreight: { type: Array, default: () => [] },
    addrAdd: { type: Array, default: () => [] },
    addrXie: { type: Array, default: () => [] },
    pubilshCode: { type: String, default: '' },
    myisdisabled: { type: Boolean, default: false },
    goodsBigType: { type: [String, Number], default: '' },
    cbGoodsAccounting: { type: Array, default: () => [] }
  },

  data() {
    return {
      activeName: '0',
      tabs: [],
      goodsUnitName: '吨',
      totalTypeValue: '1'
    };
  },

  watch: {
    goods: {
      handler() {
        this.init();
      },
      immediate: true,
      deep: true
    },
    addrAdd: {
      handler() {
        this.init();
      },
      deep: true
    }

  },

  methods: {
    handlerTotalTypeValue(good, data) {
      this.form['totalTypeValue' + good.activeName] = data;
    },
    handlerGoodsUnitName(good, data) {
      this.form['goodsUnitName' + good.activeName] = data;
    },

    async getGoodsAccounting() {
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
      const newArr = await this.getGoodsAccounting();
      // 只能用 for of 遍历
      const arrarr = [];

      for (const e of newArr) {
        const lists = e.redis.map(async(ee, i) => {
          // 只能调一次
          const accounTing = (await this.$refs['AccounTing' + e.activeName + i][0]._submitForm());

          return {
            ...ee,
            orderFreightBoList: accounTing.orderFreightBoList,
            goodsType: e.goodsType,
            goodsBigType: this.goodsBigType
          };
        });

        e.newRedis = await Promise.all(lists);

        arrarr.push(e);
      }

      this.tabs = arrarr;
    },
    // 返回数据
    async _submitForm() {
      await this.getAccounTing();


      return this.tabs;
    },

    init() {
      if (!this.goods || (this.goods && !this.goods[0])) return;

      this.tabs = this.goods.map((e, index) => {
        if (this.cbGoodsAccounting) {
          this.cbGoodsAccounting.forEach(ee => {
            if (e.dictValue === ee.goodsType) {
              e.goodsAccounting = ee;
            }
          });
        }
        // 规则
        if (this.cbOrderFreight && this.cbOrderFreight.length) {
          this.cbOrderFreight.forEach(ee => {
            if (ee.goodsCode === (e.goodsAccounting && e.goodsAccounting.code)) {
              e.redis = this.handlerPrice(ee.redisOrderAddressInfoVoList);
            }
          });
        }

        return {

          goodsAccounting: e.goodsAccounting || {},
          dictLabel: e.dictLabel,
          dictCode: e.dictCode,
          goodsType: e.dictValue,
          redis: e.redis || this.addressInit() || [], // 规则
          activeName: index + ''
        };
      });
      this.activeName = '0';
    },

    addressInit() {
      let arr = [];
      if (this.addrXie.length >= 2) {
        arr = this.addrXie.map(e => {
          return {
            ...e,
            tin_name: (this.addrAdd[0] && this.addrAdd[0].addressName || '自装') + '--' + (e.addressName || '')
          };
        });
      } else {
        arr = this.addrAdd.map(e => {
          return {
            ...e,
            tin_name: (e.addressName || '') + '--' + (this.addrXie[0] && this.addrXie[0].addressName || '自卸')
          };
        });
      }
      return arr;
    },
    handlerPrice(addressIdentification) {
      const redis = this.addressInit().map(e => {
        addressIdentification.forEach(ee => {
          const addressCodeArr = ee.addressCode.split(':');

          if ((e.code + '') === (addressCodeArr[0] + '') || (e.code + '') === (addressCodeArr[1] + '')) {
            e.orderFreightVo = ee.orderFreightVo;
            e.redisOrderFreightVoList = ee.redisOrderFreightVoList;
            e.ruleCode = ee.ruleCode;
          }
        });

        return e;
      });

      return redis;
    },

    validatePass(data) {
      this.activeName = data;
    },

    showisweitian(data) {
      this.activeName = data;
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
