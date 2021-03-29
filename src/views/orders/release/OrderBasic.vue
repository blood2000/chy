<template>
  <div v-if="pubilshCode">
    <el-form
      ref="elForm"
      :disabled="myisdisabled"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="110px"
      :label-position="'left'"
    >
      <el-divider />
      <div class="header mb8">基本信息</div>

      <el-form-item label="选择所属项目" prop="tin3">
        <el-select
          v-model="formData.tin3"
          placeholder="请选择项目"
          clearable
          filterable
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
          dislabe
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
              class="radio_item"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-else label="货物类型(单)" prop="tin2_2">
          <el-radio-group v-model="formData.tin2_2" size="medium">
            <el-radio
              v-for="dict in tin2_Option"
              :key="dict.dictValue"
              class="radio_item"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </template>

      <el-divider />

      <div class="header mb8">发布集其他信息</div>


      <el-form-item label="发布至" prop="tin4">
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

        <el-row>
          <el-col :span="12">
            <el-form-item label="指定联系人" prop="tin5">
              <el-radio-group v-model="formData.tin5" size="medium">
                <el-radio
                  v-for="dict in tin5Option"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联货源码" prop="tin6">
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
          </el-col>
        </el-row>


        <el-form-item v-if="formData.tin5 === '1'" label=" " prop="tin6_1">
          <div class="ly-flex">
            <el-button type="primary" @click="open1">请选择</el-button>
            <div class="ml0">调度者: {{ formData.tin6_1.length }} 人</div>
            <div class="ml0">司机: {{ formData.tin6_2.length }} 人</div>
          </div>
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

      <el-divider />
    </el-form>

    <el-dialog
      title="指定接单人"
      :visible.sync="open"
      width="80%"
      append-to-body
    >
      <open-dialog v-if="open" :cb-data="formData['tin6_' + actionIndex]" :action-index="actionIndex" @handleSelectionChange="handleSelectionChange" />
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
    // 回填信息
    cbData: {
      type: Object,
      default: null
    },
    // 使用v-model
    value: [Boolean],
    myisdisabled: {
      type: Boolean,
      default: false
    }
    // active: {
    //   type: Number,
    //   default: 0
    // }
  },
  data() {
    // const tin5_validator = (rule, value, callback) => {
    //   // 通过 callback(); // 不过 callback(new Error('请输入密码'));
    //   if (
    //     this.formData.tin5 === '1' &&
    //     (!this.formData.tin6_1.length || !this.formData.tin6_2.length)
    //   ) {
    //     callback(new Error('请选择调度者/或司机'));
    //     // callback();
    //   } else {
    //     callback();
    //   }
    // };
    return {
      // myisdisabled: false,
      orderSpecifiedList: null, // 调度者信息
      actionIndex: '2', // 控制弹框显示谁
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
        tin2: [{ required: true, message: '选择货物类别', trigger: 'change' }],
        tin2_1: [
          { required: true, message: '选择货物类型', trigger: 'change' }
        ],
        tin2_2: [
          { required: true, message: '选择货物类型', trigger: 'change' }
        ],
        tin4: [{ required: true, message: '选择是否公开货源', trigger: 'change' }],
        tin5: [
          { required: true, message: '选择指定接单人', trigger: 'change' }
        ],
        tin6: [{ required: false, message: '选择所属项目', trigger: 'change' }],
        // tin6_1: [{ validator: tin5_validator, trigger: 'change' }],
        remark: [
          { required: false, message: '选择所属项目', trigger: 'change' }
        ]
      },

      // 字典集合
      tin3Optin: [{ dictValue: '0', dictLabel: '无所属项目' }], // 货主项目
      tin2Option: [], // 大类
      tin2_Option: [], // 小类
      tin4Option: [
        { dictValue: '1', dictLabel: '货源大厅(所有人可接)' },
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
    // 多商品计算(根据大类中的isCheckbox判断) true=>多 false=>单
    isMultiGoods() {
      const tin2Obj = this._zhaovalue(this.tin2Option, this.formData.tin2);
      let bool = false;
      if (tin2Obj && tin2Obj.isCheckbox) {
        bool = tin2Obj.isCheckbox === '1';
      }

      return bool;
    }

    // isdisabled(value) {
    //   console.log(value);

    //   return this.active === 4;
    // }
    // InfoCodes() {
    //   return this.formData.tin6_1.concat(this.formData.tin6_2);
    // }
  },

  watch: {
    // 监听外面 pubilshCode 变化则 全部要跟着初始化
    pubilshCode(value) {
      this.$refs['elForm'] && this.$refs['elForm'].resetFields();
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

      !this.tin2Option.length && this.api_tin3Optin();
      this.api_dictInit();
    },
    // isdisabled(value) {
    //   console.log(value);
    // },

    // 回填数据
    cbData: {
      async handler() {
        // 获取字典
        await this.api_dictInit();
        // 获取
        await this.api_tin3Optin();
        // 货集码
        await this.handleTin4();

        if (!this.cbData) return;

        // goodsType 是包装成数组 [code1, code2]
        const { projectCode, isPublic, isSpecified, remark, orderSpecifiedList, goodsBigType, goodsType, classList } = this.cbData;

        // 1.基本的赋值
        this.formData.tin3 = projectCode || '0';
        this.formData.tin4 = isPublic ? '1' : '0';
        this.formData.tin5 = isSpecified ? '1' : '0';
        this.formData.remark = remark;
        this.tin2Option.forEach(e => {
          if (goodsBigType === e.dictCode) {
            this.formData.tin2 = e.dictValue;
          }
        });

        // 2.去根据大类去请求下数据
        await this.handletin2();

        // 3.回填 小类(商品)
        if (this.isMultiGoods) {
          this.formData.tin2_1 = this._handlreMultiGoodsType(goodsType, this.tin2_Option);
        } else {
          this.tin2_Option.forEach(e => {
            if (goodsType[0] === e.dictCode) {
              this.formData.tin2_2 = e.dictValue;
            }
          });
        }

        // 4.处理调度者
        this.orderSpecifiedList = orderSpecifiedList;
        this.orderSpecifiedList.forEach(e => {
          if (e.userType + '' === '1') {
            e.code = e.teamInfoCode;
          } else {
            e.code = e.driverInfoCode;
          }
          this.actionIndex = e.userType + '';
          this.formData['tin6_' + e.userType] = this.orderSpecifiedList;
        });

        // 5.货集码只做单选处理
        this.formData.tin6 = classList[0].classCode;
      },
      immediate: true
    },
    'formData.tin2_1': {
      handler(arr) {
        const goods = arr.map(e => {
          return this._zhaovalue(this.tin2_Option, e);
        });
        this.$emit('goods', goods);
      },
      immediate: true
    },
    'formData.tin2_2': {
      handler(value) {
        this.$emit('goods', [this._zhaovalue(this.tin2_Option, value)]);
      },
      immediate: true
    }
  },
  created() {

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
        dictPid: this._zhaovalue(this.tin2Option, this.formData.tin2).dictCode,
        dictType: 'goodsType'
      });


      this.tin2_Option = data;

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

        if (this.formData.tin6_2.length > 0) {
          this.actionIndex = '2';
        } else {
          this.actionIndex = '1';
        }

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

            let orderGoodsList = [];
            if (this.isMultiGoods) {
              orderGoodsList = this.formData.tin2_1.map(e => {
                return {
                  goodsBigType: this._zhaovalue(this.tin2Option, this.formData.tin2).dictCode,
                  goodsType: this._zhaovalue(this.tin2_Option, e).dictCode
                };
              });
            } else {
              orderGoodsList = [{
                goodsBigType: this._zhaovalue(this.tin2Option, this.formData.tin2).dictCode,
                goodsType: this._zhaovalue(this.tin2_Option, this.formData.tin2_2).dictCode
              }];
            }


            resolve({
              classList: [
                {
                  classCode: this.formData.tin6
                }
              ],
              isPublic: this.formData.tin4 === '1', //	是否公开货源 0.非公开 1.公开,
              isSpecified: this.formData.tin5 === '1', // 是否指定接单人 0否 1是		false
              // 'loadType': 0,
              orderGoodsList,
              orderSpecifiedList: tin6_1.concat(tin6_2),
              projectCode: this.formData.tin3 === '0' ? '' : this.formData.tin3,
              pubilshCode: this.pubilshCode,
              remark: this.formData.remark
              // ruleInfoShipmentCode: ''
            });
          } else {
            return false;
          }
        });
      });
    },


    // 处理小类传入[1,2] =>
    _handleGoodsType(arr) {
      // 获取子类的code数组
      const tae1 = arr.map(e => {
        return this._zhaovalue(this.tin2_Option, e).dictCode;
      });
      // 把子类转出字符串逗号隔开

      return tae1.join(',');
    },

    // 回填多商品处理code
    _handlreMultiGoodsType(arr1, options) {
      const arr2 = [];
      arr1.forEach(e => {
        options.forEach(ee => {
          if (ee.dictCode + '' === e + '') {
            arr2.push(ee.dictValue);
          }
        });
      });
      return arr2;
    },

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
  padding: 0 10px 10px 0;
}
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
