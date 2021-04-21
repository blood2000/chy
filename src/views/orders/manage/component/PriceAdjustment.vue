<template>
  <div v-loading="loading" class="priceAdjustment">
    <div class="ly-flex-pack-justify">
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="(dict,index) in tabs"
          :key="index"
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

    <div v-for="goods in tabs" :key="goods.activeName">
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

        <!-- 每一小块 -->

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
      <el-button @click="submit(false)">取消</el-button>
      <el-button type="primary" @click="submit(true)">确认</el-button>
    </div>

  </div>
</template>

<script>
import { adjustPrice } from '@/api/order/manage';


// import GoodsInfo from '@/views/orders/release/GoodsInfo';
import AccounTing from '@/views/orders/release/component/AccounTing';
export default {
  components: { AccounTing },

  props: {
    mytabs: {
      type: Array,
      default: () => []
    },
    orderCode: { type: String, default: '' },
    pubilshCode: { type: String, default: '' }
  },

  data() {
    return {
      loading: false, // 加载
      entry: '', // 生效时间
      activeName: '0',
      tabs: [],
      // [
      //   { dictLabel: '无烟煤', // 展示tab
      //     activeName: '0', // 切换tab
      //     goodsPrice: 500, // 商品价格
      //     goodsType: '0001', // 商品divtValue
      //     redis: [{ // 地址1 对应的其他的规则
      //       tin_name: 'A--B', // 地址a到b 显示
      //       ruleCode: '1', // 下拉规则的的值(会改)
      //       ruleDictValue: '1', // 计算规则的值
      //       orderFreightVo: { // 显示具体规则的值
      //         'detailList': [
      //           {
      //             'id': 196,
      //             'code': 'da84a113618749e6b72a3ebe4d96b60c',
      //             'ruleCode': 'd553a41ff0b5474caa46111ae95a50a4',
      //             'ruleItemCode': '12',
      //             'ruleValue': '120',
      //             'type': '2',
      //             'cnName': '卸车费',
      //             'enName': 'DISCHARGE_FARE',
      //             'showType': 1,
      //             'dictCode': null,
      //             'ruleType': 0,
      //             'dictLabel': null,
      //             'unit': null
      //           },
      //           {
      //             'id': 194,
      //             'code': '280fbb2214f14fffa655211777199135',
      //             'ruleCode': 'd553a41ff0b5474caa46111ae95a50a4',
      //             'ruleItemCode': '17',
      //             'ruleValue': '100',
      //             'type': '2',
      //             'cnName': '运费单价',
      //             'enName': 'FREIGHT_COST',
      //             'showType': 1,
      //             'dictCode': null,
      //             'ruleType': 0,
      //             'dictLabel': null,
      //             'unit': null
      //           }
      //         ]
      //       }}],
      //     newRedis: [] // 这个是封装返回的时候使用
      //   },
      totalTypeValue: '', // ??
      myisdisabled: false // 是否预览(组件内要使用)
    };
  },

  computed: {
    goodsUnitName() {
      return '吨';
    }
  },

  created() {
    this.tabs = JSON.parse(JSON.stringify(this.mytabs));

    console.log(this.tabs);
  },

  methods: {
    getGoodsAccounting() {},

    // 确认
    async submit(bool) {
      if (bool) {
        this.loading = true;
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

        console.log(orderFreightBoList, '想要的结构-----');
        console.log(this.entry, '时间----');


        // 提交需要这样的结构
        // 1-1 订单号直接传
        // 1-2 商品code 需要
        // 1-3 地址装--卸code 需要
        const req = {
          'orderCode': this.orderCode,
          orderFreightBoList,
          time: this.entry || undefined
        };

        // 请求接口

        const data = await adjustPrice(req);
        console.log(data);

        this.loading = false;
        this.msgSuccess(data.msg);
        // 全部保存完毕在回调

        this.$emit('submitRes', 'success');
      } else {
        this.$emit('submitRes', false);
      }
    },

    async getdata() {
      // 只能用 for of 遍历
      for (const e of this.tabs) {
        const lists = e.redis.map(async(ee, i) => {
          // 只能调一次
          const accounTing = (await this.$refs['AccounTing' + e.activeName + i][0]._submitForm());
          return {
            ...ee,
            ...accounTing // 返回 ruleDictValue(这个值已经有了) 和 orderFreightBoList(这个是包装完后的)
            // goodsType: e.goodsType
            // goodsBigType: this.goodsBigType
            // ruleInfoShipmentCode: accounTing.orderFreightBoList[0].ruleCode
          };
        });
        e.newRedis = await Promise.all(lists);
      }

      console.log(this.tabs, '处理后的this.tabs');
    }
  }

};
</script>

