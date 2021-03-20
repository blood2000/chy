<template>
  <div v-if="pubilshCode">
    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="110px"
      :label-position="'left'"
    >
      <el-form-item label="选择所属项目" prop="tin3">
        <el-select
          v-model="formData.tin3"
          placeholder="请选择项目"
          clearable
          :style="{ width: '100%' }"
          @change="handleTin3"
        >
          <el-option
            v-for="dict in tin3Optin"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="选择货物类别" prop="tin2">
        <el-radio-group
          v-model="formData.tin2"
          size="medium"
          @change="handletin2(false)"
        >
          <el-radio
            v-for="dict in tin2Option"
            :key="dict.dictValue"
            class="radio_item"
            :label="dict.dictValue"
          >{{ dict.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <template v-if="formData.tin2">
        <!-- isMultiGoods true->多商品 ; false->单商品 -->
        <el-form-item v-if="isMultiGoods" label="货物类型(多)" prop="tin2_1">
          <el-checkbox-group v-model="formData.tin2_1" size="medium">
            <el-checkbox
              v-for="dict in tin2_Option"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-else label="货物类型(单)" prop="tin2_2">
          <el-radio-group v-model="formData.tin2_2" size="medium">
            <el-radio
              v-for="dict in tin2_Option"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>

      <el-form-item label="发布位置" prop="tin4">
        <el-radio-group
          v-model="formData.tin4"
          size="medium"
          @change="handleTin4"
        >
          <el-radio
            v-for="dict in tin4Option"
            :key="dict.dictValue"
            :label="dict.dictValue"
          >{{ dict.dictLabel }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <template v-if="formData.tin4 === '0'">
        <el-form-item label="指定接单人" prop="tin5">
          <el-radio-group v-model="formData.tin5" size="medium">
            <el-radio
              v-for="dict in tin5Option"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="formData.tin5 === '1'" label=" ">
          <div class="ly-flex">
            <el-button type="primary" @click="open1">指定接单人</el-button>
            <div class="ml0">调度者: {{ formData.tin6_1.length }} 人</div>
            <div class="ml0">司机: {{ formData.tin6_2.length }} 人</div>
          </div>
        </el-form-item>

        <el-form-item label="货集码" prop="tin6">
          <el-select
            v-model="formData.tin6"
            placeholder="选择货集码"
            clearable
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="dict in tin6Option"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
      </template>

      <el-form-item label="备注信息" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          placeholder="请输入任何您想说的话..."
          :autosize="{ minRows: 4, maxRows: 4 }"
          :style="{ width: '100%' }"
        />
      </el-form-item>
    </el-form>

    <el-dialog
      title="指定接单人"
      :visible.sync="open"
      width="80%"
      append-to-body
    >
      <open-dialog v-if="open" @handleSelectionChange="handleSelectionChange" />
    </el-dialog>
  </div>
</template>

<script>
import { listInfo } from '@/api/enterprise/project';
import { listStockcode } from '@/api/enterprise/stockcode';
import OpenDialog from '../manage/component/OpenDialog';

// import OpenDialog from './OpenDialog';

export default {
  components: { OpenDialog },
  props: {
    // 货主的code, 必传
    pubilshCode: {
      type: String,
      required: true
    },

    value: [Boolean]
  },
  data() {
    const tin5_validator = (rule, value, callback) => {
      // 通过 callback(); // 不过 callback(new Error('请输入密码'));
      if (
        this.formData.tin5 === '1' &&
        (!this.formData.tin6_1.length || !this.formData.tin6_2.length)
      ) {
        // callback(new Error('请选择调度者/或司机'));
        callback();
      } else {
        callback();
      }
    };
    return {
      open: false,
      formData: {
        tin3: '0', // 选择所属项目 0表示没有
        tin2: '', // 货物类别(大类)
        tin2_1: [], // 小类(多商品)
        tin2_2: '', // 小类(单商品)
        tin4: '1', // 发布位置 1=公开 0=非公开
        tin5: '0', // 指定接单人 1=是 0=否
        tin6_1: [], // 调度者
        tin6_2: [], // 司机
        tin6: '', // 货集码

        remark: ''
      },
      rules: {
        tin3: [{ required: true, message: '选择所属项目', trigger: 'change' }],
        tin2: [{ required: true, message: '选择所属项目', trigger: 'change' }],
        tin2_1: [
          { required: true, message: '选择所属项目', trigger: 'change' }
        ],
        tin2_2: [
          { required: true, message: '选择所属项目', trigger: 'change' }
        ],
        tin4: [{ required: true, message: '选择所属项目', trigger: 'change' }],
        tin5: [
          { required: true, message: '选择所属项目', trigger: 'change' },
          { validator: tin5_validator, trigger: 'change' }
        ],
        tin6: [{ required: false, message: '选择所属项目', trigger: 'change' }],
        remark: [
          { required: false, message: '选择所属项目', trigger: 'change' }
        ]
      },

      // 字典集合
      tin3Optin: [{ dictValue: '0', dictLabel: '无所属项目' }], // 货主项目
      tin2Option: [], // 大类
      tin2_Option: [], // 小类
      tin4Option: [
        { dictValue: '1', dictLabel: '公开货源(所有人可接)' },
        { dictValue: '0', dictLabel: '非公开货源(私密货源)' }
      ],
      tin5Option: [
        { dictValue: '1', dictLabel: '是' },
        { dictValue: '0', dictLabel: '否' }
      ],
      tin6Option: []
    };
  },

  computed: {
    isMultiGoods() {
      return (
        this._zhaovalue(this.tin2Option, this.formData.tin2).isCheckbox === '1'
      );
    }
  },

  watch: {
    pubilshCode(value) {
      this.$refs['elForm'].resetFields();
      this.tin3Optin = [{ dictValue: '0', dictLabel: '无所属项目' }]; // 货主项目
      this.tin2Option = []; // 大类
      this.tin2_Option = []; // 小类
      this.tin4Option = [
        { dictValue: '1', dictLabel: '公开货源(所有人可接)' },
        { dictValue: '0', dictLabel: '非公开货源(私密货源)' }
      ];
      this.tin5Option = [
        { dictValue: '1', dictLabel: '是' },
        { dictValue: '0', dictLabel: '否' }
      ];
      this.tin6Option = [];

      this.api_tin3Optin();
    }
  },
  created() {
    // 获取
    this.api_tin3Optin();

    // 获取字典
    this.api_dictInit();
  },

  methods: {
    // api相关
    // 2. 获取初始的字典值
    async api_dictInit() {
      const { data } = await this.listByDict({
        dictPid: '0',
        dictType: 'goodsType'
      });
      // 假数据
      // const data = [
      //   { dictValue: '112121', dictLabel: '煤', isCheckbox: '1' },
      //   { dictValue: '11782121', dictLabel: '矿', isCheckbox: '2' }
      // ];

      this.tin2Option = data;
    },
    // 1. 获取项目
    async api_tin3Optin() {
      if (!this.pubilshCode) return;

      const query = {
        shipmentCode: this.pubilshCode
      };
      const { rows } = await listInfo(query);

      // 假数据
      // const rows = [
      //   {
      //     code: '123142', // 项目编码	query	false
      //     commodityCategoryCode: '112121', // 商品类别编码	query	false
      //     commoditySubclassCodes: '1,3,4', // 商品小类code,多个以,分割	query	false
      //     projectName: '煤矿哈哈多', // 项目名称	query	false
      //     projectRemark: '' // 备注	query	false
      //   },
      //   {
      //     code: '99987', // 项目编码	query	false
      //     commodityCategoryCode: '11782121', // 商品类别编码	query	false
      //     commoditySubclassCodes: '1', // 商品小类code,多个以,分割	query	false
      //     projectName: '煤矿哈哈单', // 项目名称	query	false
      //     projectRemark: '' // 备注	query	false
      //   }
      // ];

      this.tin3Optin = this.tin3Optin.concat(
        this._baozhuan(rows, 'code', 'projectName')
      );
    },

    // 4. 选择所属项目
    handleTin3() {
      if (this.formData.tin3 === '0') {
        this.formData.tin2 = '';
        this.formData.tin2_2 = '';
        this.formData.tin2_1 = [];
        this.tin2_Option = [];
        return;
      }

      const tin3item = this._zhaovalue(this.tin3Optin, this.formData.tin3);

      this.formData.tin2 = tin3item.commodityCategoryCode;
      this.handletin2(tin3item);
    },

    // 3. 获取小类列表
    async handletin2(tin3item) {
      this.$emit('input', this.isMultiGoods);
      const { data } = await this.listByDict({
        dictPid: this.tin2,
        dictType: 'goodsType'
      });

      // 假数据
      // const data = [
      //   { dictValue: '1', dictLabel: '傻子' },
      //   { dictValue: '2', dictLabel: '疯子' },
      //   { dictValue: '3', dictLabel: '多疯子' }
      // ];
      this.tin2_Option = data;

      console.log(this.tin2_Option);
      if (!tin3item) return;

      if (this.isMultiGoods) {
        this.formData.tin2_1 = tin3item.commoditySubclassCodes.split(',');
        this.formData.tin2_2 = '';
      } else {
        this.formData.tin2_1 = [];
        this.formData.tin2_2 = tin3item.commoditySubclassCodes;
      }
    },

    // 5. 打开弹框选取调度者或司机
    open1() {
      this.open = true;
    },

    // 6. 选取后回调
    handleSelectionChange(obj, bool) {
      if (bool) {
        this.formData.tin6_1 = obj['listInfo'] || [];
        this.formData.tin6_2 = obj['listDriver'] || [];

        if (this.formData.tin6_1.length > 1) {
          this.msgInfo('调度者只能选择一个');
          return;
        }
      }
      this.open = false;
      this.title = '';
    },

    // 7. 发布位置切换
    async handleTin4() {
      if (this.formData.tin4 === '1') {
        this.formData.tin5 = '0';
        this.formData.tin6 = '';
        this.formData.tin6_1 = []; // 调度者
        this.formData.tin6_2 = []; // 司机
      } else {
        if (this.tin6Option.length) return;
        const query = {
          shipmentCode: this.pubilshCode
        };
        const { rows } = await listStockcode(query);

        // 假数据
        // const rows = [
        //   {
        //     cargoCodeName: '货源码名称', // 货源码名称
        //     cargoCodeQR: 'deqdq434', // 货源码
        //     code: '123'
        //   },
        //   {
        //     cargoCodeName: '货源码名称2', // 货源码名称
        //     cargoCodeQR: 'de455434', // 货源码
        //     code: '1245'
        //   }
        // ];

        this.tin6Option = this._baozhuan(rows, 'cargoCodeQR', 'cargoCodeName');
      }
    },

    // 8. 提交
    _submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            const tin6_1 = this.formData.tin6_1.map((e) => {
              return {
                driverInfoCode: '',
                teamInfoCode: e.code,
                userType: 1
              };
            });
            const tin6_2 = this.formData.tin6_2.map((e) => {
              return {
                driverInfoCode: e.code,
                teamInfoCode: '',
                userType: 2
              };
            });
            resolve({
              classList: [
                {
                  classCode: this.formData.tin6
                }
              ],
              isPublic: this.formData.tin4 === '1', //	是否公开货源 0.非公开 1.公开,
              isSpecified: this.formData.tin5 === '1', // 是否指定接单人 0否 1是		false
              // 'loadType': 0,
              orderFreightBoList: [
                {
                  // 'balanceRuleCode': '',
                  goodsBigType: this.formData.tin2,
                  goodsType: this.isMultiGoods
                    ? this.formData.tin2_1
                    : this.formData.tin2_2
                  // 'orderGoodsCode': '',
                  // 'ruleItemValue': '',
                  // 'type': 0
                }
              ],
              orderGoodsList: [
                {
                  // 'addressList': [
                  //   {
                  //     'adcode': '',
                  //     'addressAlias': '',
                  //     'addressType': 0,
                  //     'city': '',
                  //     'citycode': '',
                  //     'contact': '',
                  //     'contactPhone': '',
                  //     'country': '',
                  //     'detail': '',
                  //     'district': '',
                  //     'formattedAddress': '',
                  //     'level': '',
                  //     'location': [],
                  //     'province': '',
                  //     'provinceCode': '',
                  //     'street': ''
                  //   }
                  // ],
                  // 'balanceRuleCode': '',
                  goodsBigType: this.formData.tin2,
                  goodsType: this.isMultiGoods
                    ? this.formData.tin2_1
                    : this.formData.tin2_2
                  // 'goodsUnit': '',
                  // 'isModifyFinish': true,
                  // 'isOneselfLoad': true,
                  // 'isOneselfUnload': true,
                  // 'limitWastage': '',
                  // 'perWeight': 0,
                  // 'priceWastage': 0,
                  // 'shipmentPrice': 0,
                  // 'totalType': '',
                  // 'vehicleLength': '',
                  // 'vehicleType': '',
                  // 'weight': 0
                }
              ],
              orderSpecifiedList: tin6_1.concat(tin6_2),
              projectCode: this.formData.tin3 === '0' ? '' : this.formData.tin3,
              pubilshCode: this.pubilshCode,
              remark: this.formData.remark
            });
          } else {
            return false;
          }
        });
      });
    },

    // 工具
    // 根据value匹配数组中的一项
    _zhaovalue(arr, value) {
      return arr.filter((e) => {
        return e.dictValue === value;
      })[0];
    },

    // 包装成
    _baozhuan(arr, dictValue, dictLabel) {
      return arr.map((e) => {
        return {
          ...e,
          dictValue: e[dictValue],
          dictLabel: e[dictLabel]
        };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.radio_item {
  padding: 5px 10px 5px 0;
}
</style>
