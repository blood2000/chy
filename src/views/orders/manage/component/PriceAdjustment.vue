<template>
  <div class="priceAdjustment">
    <el-tabs v-model="activeName">
      <el-tab-pane
        v-for="(dict,index) in tabs"
        :key="index"
        :label="dict.dictLabel"
        :name="dict.activeName"
      />
    </el-tabs>

    <div v-for="goods in tabs" :key="goods.activeName">
      <div v-show="activeName === goods.activeName">
        <el-form :model="goods">
          <el-form-item label="货物单价: ">
            <el-input-number
              v-model="goods.goodsPrice"
              :controls="false"
              placeholder="货物单价"
              step-strictly
              controls-position="right"
              :style="{ width: '200px' }"
            />
            <span class="pl-5">元/{{ goodsUnitName }}</span>
          </el-form-item>
        </el-form>

        <!-- 每一小块 -->

        <div v-for="(redi,i) in goods.redis" :key="i" class="mt20">
          <AccounTing
            :ref="'AccounTing'+i"
            :pubilsh-code="pubilshCode"
            :redis="redi"
            :goods-unit-name="goodsUnitName"
            :total-type-value="totalTypeValue"
            :myisdisabled="myisdisabled"
            :good="goods"
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
  data() {
    return {
      activeName: '0',
      tabs: [
        { dictLabel: '无烟煤', // 展示tab
          activeName: '0', // 切换tab
          goodsPrice: 500, // 商品价格
          goodsType: '0001', // 商品divtValue
          redis: [{ // 地址1 对应的其他的规则
            tin_name: 'A--B', // 地址a到b 显示
            ruleInfoShipmentCode: '1', // 下拉规则的的值(会改)
            ruleDictValue: '1', // 计算规则的值
            orderFreightVo: { // 显示具体规则的值
              'lossList': [
                {
                  'id': 190,
                  'code': '2e5720b4661b4c87b2b45acf76433841',
                  'ruleCode': 'd553a41ff0b5474caa46111ae95a50a4',
                  'ruleItemCode': '1',
                  'ruleValue': 'DE',
                  'type': null,
                  'cnName': '路耗 亏吨方案',
                  'enName': 'LOSS_PLAN',
                  'showType': 4,
                  'dictCode': 'lossPlan',
                  'ruleType': 1,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 189,
                  'code': '42bfd8472c63464f9e162a948b377d8d',
                  'ruleCode': 'd553a41ff0b5474caa46111ae95a50a4',
                  'ruleItemCode': '2',
                  'ruleValue': '["-1","5"]',
                  'type': null,
                  'cnName': '路耗 容忍值',
                  'enName': 'LOSS_TOLERANCE',
                  'showType': 2,
                  'dictCode': null,
                  'ruleType': 1,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 188,
                  'code': 'd5215e2add7948629f3d9d366223a0f1',
                  'ruleCode': 'd553a41ff0b5474caa46111ae95a50a4',
                  'ruleItemCode': '3',
                  'ruleValue': '1',
                  'type': null,
                  'cnName': '路耗 规则',
                  'enName': 'LOSS_RULE',
                  'showType': 3,
                  'dictCode': 'lossRule',
                  'ruleType': 1,
                  'dictLabel': null,
                  'unit': null
                }
              ],
              'detailList': [
                {
                  'id': 196,
                  'code': 'da84a113618749e6b72a3ebe4d96b60c',
                  'ruleCode': 'd553a41ff0b5474caa46111ae95a50a4',
                  'ruleItemCode': '12',
                  'ruleValue': '120',
                  'type': '2',
                  'cnName': '卸车费',
                  'enName': 'DISCHARGE_FARE',
                  'showType': 1,
                  'dictCode': null,
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 195,
                  'code': '741481324965450fa09bde1ce22c22a1',
                  'ruleCode': 'd553a41ff0b5474caa46111ae95a50a4',
                  'ruleItemCode': '15',
                  'ruleValue': '50',
                  'type': '2',
                  'cnName': '超时费',
                  'enName': 'OVERTIME_FEE',
                  'showType': 1,
                  'dictCode': null,
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 194,
                  'code': '280fbb2214f14fffa655211777199135',
                  'ruleCode': 'd553a41ff0b5474caa46111ae95a50a4',
                  'ruleItemCode': '17',
                  'ruleValue': '100',
                  'type': '2',
                  'cnName': '运费单价',
                  'enName': 'FREIGHT_COST',
                  'showType': 1,
                  'dictCode': null,
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 193,
                  'code': '390662ca170844fb8e3e7b5000163585',
                  'ruleCode': 'd553a41ff0b5474caa46111ae95a50a4',
                  'ruleItemCode': '18',
                  'ruleValue': '5',
                  'type': '2',
                  'cnName': '抹零规则',
                  'enName': 'M0',
                  'showType': 3,
                  'dictCode': 'M0',
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 192,
                  'code': '2245728e235741cc87463ae2ac2159ca',
                  'ruleCode': 'd553a41ff0b5474caa46111ae95a50a4',
                  'ruleItemCode': '11',
                  'ruleValue': '400',
                  'type': '1',
                  'cnName': '装车费',
                  'enName': 'LOADING_FEE',
                  'showType': 1,
                  'dictCode': null,
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                },
                {
                  'id': 191,
                  'code': '5951d29fe33141f88734eb08557df368',
                  'ruleCode': 'd553a41ff0b5474caa46111ae95a50a4',
                  'ruleItemCode': '16',
                  'ruleValue': '50',
                  'type': '1',
                  'cnName': '扣回单费',
                  'enName': 'RECEIPT_FEE',
                  'showType': 1,
                  'dictCode': null,
                  'ruleType': 0,
                  'dictLabel': null,
                  'unit': null
                }
              ]
            }}],
          newRedis: [] // 这个是封装返回的时候使用
        }
        // { dictLabel: '精美', activeName: '1', redis: [], goodsPrice: 600 },
        // { dictLabel: '垃圾煤', activeName: '2', redis: [], goodsPrice: 700 }
      ],
      formData: {
        goodsPrice: 500
      },
      pubilshCode: '80ceee84f9d34ed69a8467b2970f1c2b', // 当前用户的code 由外面传进来(做请求使用)
      totalTypeValue: '', // ??
      myisdisabled: false // 是否预览(组件内要使用)
    };
  },

  computed: {
    goodsUnitName() {
      return '吨';
    }
  },

  methods: {
    getGoodsAccounting() {},

    // 确认
    async submit(bool) {
      if (bool) {
        this.getdata();

        console.log(this.tabs, '修改后的tabs');


        this.tabs.forEach(e => {
          // 问题是多商品 一个商品请求一次?
          // 每个商品的id 是从列表中获取到


          const req = {
            'goodsPrice': e.goodsPrice, // 货物单价
            'id': 0, // 商品id? 还是 code??
            'oderCode': '', // 货源编码??
            'orderFreightBoList': [ // 这里是规则细项了?? 多个细则怎么传??
              {
                'code': '',
                'ruleCode': '',
                'ruleDetailShipmentCode': '',
                'ruleItemCode': '',
                'ruleValue': '',
                'type': 0
              }
            ],
            'shipmentPrice': 0 // 运输单价
          };

          // const data = await adjustPrice(req);
          // // 在这里去请求修改的接口
          // console.log(data);
        });


        // 全部保存完毕在回调


        this.$emit('submitRes', 'success');
      }
    },

    async getdata() {
      // 只能用 for of 遍历
      for (const e of this.tabs) {
        const lists = e.redis.map(async(ee, i) => {
          // 只能调一次
          const accounTing = (await this.$refs['AccounTing' + i][0]._submitForm());
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
    }
  }

};
</script>

