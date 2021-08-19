<template>
  <div v-loading="loading" class="priceAdjustment">
    <div class="ly-flex-pack-justify">
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="(dict,index) in tabs"
          :key="index + '' + dict.dictLabel"
          :label="dict.dictLabel"
          :name="dict.activeName"
        />
      </el-tabs>

      <div v-if="false">
        <el-form label-position="left" inline>
          <el-form-item label="生效时间">
            <el-date-picker
              v-model="entry"
              type="datetime"
              placeholder="选择日期时间"
              clearable
              class="width28"
              value-format="yyyy-MM-dd HH:mm:ss"
              default-time="00:00:00"
            />
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div v-for="(goods,index) in tabs" :key="goods.activeName +''+ index">
      <div v-show="activeName === goods.activeName">
        <el-form :model="goods">
          <el-form-item label="货物单价: ">
            <el-input-number
              v-model="goods.goodsPrice"
              :controls="false"
              placeholder="货物单价"
              :precision="2"
              :step="0.01"
              controls-position="right"
              :style="{ width: '200px' }"
            />
            <span class="pl-5">元/{{ goodsUnitName }}</span>
          </el-form-item>
        </el-form>

        <div v-for="(redi,i) in goods.redis" :key="i" class="mt20">
          <AccounTing
            :ref="'AccounTing'+goods.activeName+i"
            :pubilsh-code="pubilshCode"
            :redis="redi"
            :goods-unit-name="goodsUnitName"
            :total-type-value="totalTypeValue"
            :myisdisabled="myisdisabled"
            :goods-submit-form="getGoodsAccounting"
            :showbudget="true"
          />
        </div>
      </div>
    </div>


    <div class="mt20 ly-t-center">
      <el-button type="primary" plain @click="submit(false)">取消</el-button>
      <el-button type="primary" @click="submit(true)">确认</el-button>
    </div>

  </div>
</template>

<script>
import { adjustPrice } from '@/api/order/manage';

import AccounTing from '@/views/orders/release/component/AccounTing';
export default {
  components: { AccounTing },

  props: {
    mytabs: {
      type: Array,
      default: () => []
    },
    orderCode: { type: String, default: '' },
    pubilshCode: { type: String, default: '' },
    stowageStatus: {
      type: [String],
      default: null
    }
  },

  data() {
    return {
      loading: false, // 加载
      entry: '', // 生效时间
      activeName: '0',
      tabs: [],
      totalTypeValue: '',
      myisdisabled: false // 是否预览(组件内要使用)
    };
  },

  computed: {
    goodsUnitName() {
      return this.stowageStatus;
    }
  },

  created() {
    this.tabs = JSON.parse(JSON.stringify(this.mytabs));
  },

  methods: {
    getGoodsAccounting() {},
    // 确认
    async submit(bool) {
      if (bool) {
        await this.getdata();

        const orderFreightBoList = this.tabs.map(e => {
          const orderAddressBoList = e.newRedis.map(ee => {
            return {
              addressIdentification: ee.addressIdentification,
              orderFreightBoList: ee.orderFreightBoList
            };
          });
          return {
            goodsCode: e.goodsCode,
            goodsPrice: e.goodsPrice,
            orderAddressBoList
          };
        });

        const req = {
          'orderCode': this.orderCode,
          orderFreightBoList,
          time: this.entry || undefined
        };

        // 请求接口
        this.loading = true;
        try {
          const data = await adjustPrice(req);
          this.msgSuccess(data.msg);
          this.$emit('submitRes', 'success');
          this.loading = false;
        } catch (error) {
          this.loading = false;
        }
      } else {
        this.$emit('submitRes', false);
      }
    },

    async getdata() {
      // 只能用 for of 遍历
      for (const e of this.tabs) {
        const lists = e.redis.map(async(ee, i) => {
          const accounTing = (await this.$refs['AccounTing' + e.activeName + i][0]._submitForm());
          return {
            ...ee,
            ...accounTing
          };
        });
        e.newRedis = await Promise.all(lists);
      }
    }
  }

};
</script>

