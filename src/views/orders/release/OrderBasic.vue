<template>
  <div>
    <el-form
      ref="elForm"
      :disabled="myisdisabled"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="110px"
      :label-position="'left'"
    >
      <div class="app-container">

        <div class="header mb8">基本信息</div>

        <el-form-item label="选择所属项目" prop="tin3">
          <el-select
            v-model="formData.tin3"
            placeholder="请选择项目"
            filterable
            @change="handleTin3"
          >
            <el-option
              v-for="(dict,index) in tin3Optin"
              :key="index + '' + dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="货物大类" prop="tin2">
          <template v-if="goodsBigTypes && goodsBigTypes.length > 1">
            <template v-for="(dict,index) in tin2Option">
              <el-radio
                v-if="dict.status === '0'"
                :key="index + '' + dict.dictValue"
                :value="dict.checkedValue"
                class="mb10 m_radio"
                border
                disabled
                :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio>
            </template>
          </template>

          <el-radio-group
            v-else
            v-model="formData.tin2"
            :disabled="false"
            size="medium"
            @change="handletin2(false)"
          >
            <template v-for="(dict,index) in tin2Option">
              <el-radio
                v-if="dict.status === '0'"
                :key="index + '' + dict.dictValue"
                class="mb10 m_radio"
                border
                :label="dict.dictValue"
              >{{ dict.dictLabel }}</el-radio>
            </template>
          </el-radio-group>

        </el-form-item>

        <template v-if="formData.tin2">
          <el-form-item v-if="isMultiGoods" label="货物小类" prop="tin2_1">
            <el-checkbox-group v-model="formData.tin2_1" size="medium" :disabled="false">
              <template v-for="(dict,index) in tin2_Option">
                <el-checkbox
                  v-if="dict.status === '0'"
                  :key="index + '' + dict.dictValue"
                  class="ml0 mb10"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-checkbox>
              </template>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-else label="货物小类" prop="tin2_2">
            <el-radio-group v-model="formData.tin2_2" size="medium" :disabled="false">
              <template v-for="(dict,index) in tin2_Option">
                <el-radio
                  v-if="dict.status === '0'"
                  :key="index + '' + dict.dictValue"
                  class="ml0 mb10 mt10"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </template>

            </el-radio-group>
          </el-form-item>
        </template>
      </div>

      <div class="app-container">
        <div class="header mb8">发布集其他信息</div>
        <el-form-item label="发布至" prop="publishMode">
          <el-radio-group
            v-model="formData.publishMode"
            size="medium"
            @change="()=>{}"
          >
            <el-radio
              v-for="(dict,index) in tin4Option"
              :key="index + '' + dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>


        <el-row>
          <el-col :span="12">
            <el-form-item label="指定联系人" prop="tin5">
              <el-radio-group v-model="formData.tin5" size="medium">
                <el-radio
                  v-for="(dict,index) in tin5Option"
                  :key="index + '' + dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="关联货集码" prop="tin6">
              <el-select
                v-model="formData.tin6"
                placeholder="选择货集码"
                clearable
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="(dict,index) in tin6Option"
                  :key="index + '' + dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>


        <el-form-item v-if="formData.tin5 === '1'" label="指定联系人" prop="tin6_1">
          <div class="ly-flex-align-center m_warp">
            <el-tag
              v-for="(tag, index) in formData['tin6_' + actionIndex]"
              :key="tag.name + '' + index"
              class="mr10"
              :class="actionIndex == 1? 'team':'driver'"
              :closable="!myisdisabled"
              :disable-transitions="true"
              :type="'info'"
              @close="closable(index)"
            >
              {{ tag.driverName || tag.teamName }}
            </el-tag>
            <template v-if="!myisdisabled">
              <el-button type="primary" size="mini" @click="open1">请选择</el-button>
              <div class="ml0">调度者: {{ formData.tin6_1.length }} 人</div>
              <div v-if="false" class="ml0">司机: {{ formData.tin6_2.length }} 人</div>
            </template>
          </div>
        </el-form-item>


        <el-row v-if="!isShipment">
          <el-col :span="6">
            <el-form-item label="装货时是否必须上传凭证" label-width="200px">
              <el-switch
                v-model="formData.uploadLoadVoucher"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="卸货时是否必须上传凭证" label-width="200px">
              <el-switch
                v-model="formData.uploadUnloadVoucher"
              />
            </el-form-item>
          </el-col>
        </el-row>




        <el-form-item label="货源备注信息" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            placeholder="请输入备注信息"
            :autosize="{ minRows: 4, maxRows: 4 }"
            maxlength="100"
            show-word-limit
            :style="{ width: '100%' }"
          />
        </el-form-item>

        <slot />
      </div>
    </el-form>

    <el-dialog
      title="指定接单人"
      :visible.sync="open"
      width="80%"
      append-to-body
      class="m_elDialog"
      :close-on-click-modal="false"
    >
      <!-- 掉用原来的 -->
      <!-- <open-dialog v-if="false && open" :cb-data="[...formData['tin6_' + actionIndex]]" :action-index="actionIndex" :pubilsh-code="pubilshCode" @handleSelectionChange="handleSelectionChange" /> -->

      <div v-if="open">
        <GroupIndex ref="GroupIndex" :shipment-code="pubilshCode" :iscomponent="true" :cb-data-by-keyword="cbDataByKeyword" @groupSelected="(data)=> orderSpecifiedList = data" />

        <el-form-item>
          <div class="ly-t-right">
            <el-button type="primary" plain @click="open = false">取 消</el-button>
            <el-button type="primary" @click="handleTin6_1">确 定</el-button>
          </div>
        </el-form-item>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listInfo } from '@/api/enterprise/project';
import { listStockcode } from '@/api/enterprise/stockcode';
// import OpenDialog from '../manage/component/OpenDialog';

import GroupIndex from '@/views/enterprise/group';

import { getUserInfo } from '@/utils/auth';

export default {
  components: {
    // OpenDialog,
    GroupIndex },
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
    // 当前用户的信息
    shipmentInfo: {
      type: Object,
      default: null
    },
    // 使用v-model
    value: [Boolean],
    myisdisabled: {
      type: Boolean,
      default: false
    },
    goodsBigTypes: {
      type: Array,
      default: null
    },
    isT: [Boolean]
  },
  data() {
    return {
      'orderSpecifiedList': [], // 选中的调度

      // orderSpecifiedList: [],
      actionIndex: '1', // 控制弹框显示谁
      open: false,
      classList: null, // 修改的时候
      InfoCode: null, // 修改临时存放code

      formData: {
        tin3: '0', // 选择所属项目 0表示没有
        tin2: '', // 货物类别(大类)
        tin2_1: [], // 小类(多商品)
        tin2_2: '', // 小类(单商品)
        publishMode: '0', // 发布方式 0 货源大厅不可见 1 可见
        tin4: '1', // 发布位置 1=公开 0=非公开
        tin5: '0', // 指定接单人 1=是 0=否
        tin6_1: [], // 调度者
        tin6_2: [], // 司机
        tin6: '', // 货集码

        uploadLoadVoucher: true, // 装货时是否必须上传凭证 7/8追加字段
        uploadUnloadVoucher: true, // 卸货时是否必须上传凭证 7/8追加字段

        remark: ''
      },

      // s= 7/22 追加判断字段 -chj
      singleSourceMultiCommodity: false,

      // e=

      rules: {
        tin3: [{ required: false, message: '选择所属项目', trigger: 'change' }],
        tin2: [{ required: true, message: '选择货物大类', trigger: 'change' }],
        tin2_1: [
          { required: true, message: '选择货物小类', trigger: 'change' }
        ],
        tin2_2: [
          { required: true, message: '选择货物小类', trigger: 'change' }
        ],
        // publishMode: [{ required: true, message: '选择是否公开货源', trigger: 'change' }],
        tin5: [
          { required: true, message: '选择指定接单人', trigger: 'change' }
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
        { dictValue: '1', dictLabel: '货源大厅可见' },
        { dictValue: '0', dictLabel: '货源大厅不可见' }
      ],
      tin5Option: [
        { dictValue: '1', dictLabel: '是' },
        { dictValue: '0', dictLabel: '否' }
      ],
      tin6Option: [],
      isShipment: false
    };
  },

  computed: {
    // 多商品计算(根据大类中的isCheckbox判断) true=>多 false=>单
    isMultiGoods() {
      // 7/22 之前 -chj
      // const tin2Obj = this._zhaovalue(this.tin2Option, this.formData.tin2);
      // let bool = false;
      // if (tin2Obj && tin2Obj.isCheckbox) {
      //   bool = tin2Obj.isCheckbox === '1';
      // }

      // return bool;

      // 7/22 修改 -chj
      return this.singleSourceMultiCommodity;
    },

    cbDataByKeyword() {
      let obj = {};
      if (this.orderSpecifiedList.length) {
        obj = { disUserCode: this.orderSpecifiedList.map(e => e.disUserCode || e.code) };
      }
      return obj;
    }
  },
  watch: {
    // 获取当前用户的信息
    shipmentInfo: {
      handler(info) {
        if (info) {
          // isNeedLoadingCertificate 是否需要装货凭证 0：是 1：否
          // noNeedUnloadImg 是否不需要卸货图片  0，需要  1，不需要
          // 修改司机实收金额 0:允许 1:不允许： editDriverActualAmount
          // 单货源多商品 0：允许 1:不允许  singleSourceMultiCommodity
          // 单货源多装货地 0:允许 1:不允许  singleSourceMultiLoadingLocations
          // 单货源多卸货地 0:允许 1:不允许  singleSourceMultiUnloadingLocations
          // 是否需要申请打款环节 0：需要 1:不需要  isNeedApplicationForPayment
          const {
            isNeedLoadingCertificate,
            noNeedUnloadImg,
            singleSourceMultiCommodity
          } = info;


          this.formData.uploadLoadVoucher = isNeedLoadingCertificate === 0;
          this.formData.uploadUnloadVoucher = noNeedUnloadImg === 0;
          this.singleSourceMultiCommodity = singleSourceMultiCommodity === 0;
        }
      },
      immediate: true
    },

    // 监听外面 pubilshCode 变化则 全部要跟着初始化
    pubilshCode: {
      handler(value) {
        if (!value) return;
        this.$refs['elForm'] && this.$refs['elForm'].resetFields();
        this.tin3Optin = [{ dictValue: '0', dictLabel: '无所属项目' }]; // 货主项目
        this.tin2_Option = []; // 小类
        this.tin4Option = [
          { dictValue: '1', dictLabel: '货源大厅不可见' },
          { dictValue: '0', dictLabel: '货源大厅可见' }
        ];
        this.tin5Option = [
          { dictValue: '1', dictLabel: '是' },
          { dictValue: '0', dictLabel: '否' }
        ];
        this.tin6Option = [];

        this.api_tin3Optin();
        this.handleTin4();
      },
      immediate: true
    },


    // 回填数据
    cbData: {
      async handler(val) {
        await this.api_dictInit();

        if (!this.cbData) return;

        // 获取字典
        await this.api_tin3Optin();
        // 货集码
        await this.handleTin4();
        const { code, projectCode, isPublic, isSpecified, remark, orderSpecifiedList, goodsBigType, goodsType, classList, publishMode } = this.cbData;



        // 1.基本的赋值

        this.formData.uploadLoadVoucher = this.cbData.uploadLoadVoucher + '' === '1';
        this.formData.uploadUnloadVoucher = this.cbData.uploadUnloadVoucher + '' === '1';

        this.formData.publishMode = publishMode + '';
        this.formData.tin4 = isPublic + '';
        this.formData.tin5 = isSpecified + '';
        this.formData.remark = remark;
        this.tin2Option.forEach(e => {
          if (goodsBigType === e.dictValue) {
            this.formData.tin2 = e.dictValue;
          }
        });


        // 4.处理调度者
        this.orderSpecifiedList = orderSpecifiedList.map(e => {
          if (e.userType + '' === '1') {
            e.code = e.teamInfoCode;
          } else {
            e.code = e.driverInfoCode;
          }
          this.actionIndex = e.userType + '';

          return {
            ...e, // 需要其他再加
            teamName: e.teamName,
            type: 'info',
            userType: 1
          };
        });

        this.formData['tin6_' + this.actionIndex] = this.orderSpecifiedList;

        // 2.去根据大类去请求下数据
        await this.handletin2();


        // 3.回填 小类(商品)
        if (this.isMultiGoods) {
          this.formData.tin2_1 = goodsType;
        } else {
          this.tin2_Option.forEach(e => {
            if (goodsType[0] === e.dictValue) {
              this.formData.tin2_2 = e.dictValue;
            }
          });
        }


        // 5.货集码只做单选处理
        // this.handleTin4();
        this.formData.tin6 = classList[0] ? classList[0].classCode : '';
        this.classList = classList;
        this.InfoCode = code;

        this.formData.tin3 = projectCode || '0';

        // 6. 特殊处理
        if (this.goodsBigTypes && this.goodsBigTypes.length > 1) {
          this.tin2Option = this.tin2Option.map(e => {
            e.checkedValue = undefined;
            this.goodsBigTypes.forEach(ee => {
              if (ee === e.dictValue) {
                e.checkedValue = ee;
              }
            });
            return e;
          });
        }
      },
      immediate: true
    },
    'formData.tin2_1': {
      handler(arr) {
        if (!arr.length) return;
        const goods = arr.map(e => {
          return this._zhaovalue(this.tin2_Option, e);
        });

        this.$emit('goods', goods);
      },
      immediate: true
    },
    'formData.tin2_2': {
      handler(value) {
        if (!value) return;
        const obj = this._zhaovalue(this.tin2_Option, value);

        this.$emit('goods', [obj || this._zhaovalue(this.tin2Option, value)]);
      },
      immediate: true
    },
    'formData.tin6_1': {
      handler(value) {
        if (!value) return;
        this.$store.commit('orders/SET_TIMELIST', value);
      },
      immediate: true
    }

  },
  created() {
    const { isShipment = false } = getUserInfo() || {};
    this.isShipment = isShipment;
  },

  methods: {
    // 获取初始的字典值
    async api_dictInit() {
      const goodsBigType_option = this.$store.getters.goodsBigType_option;
      if (goodsBigType_option) {
        this.tin2Option = goodsBigType_option;
      } else {
        const { data } = await this.listByDict({
          dictPid: '0',
          dictType: 'goodsType'
        });

        this.tin2Option = data;
        this.$store.dispatch('orders/store_goodsBigType_option', data);
      }
    },
    // 获取项目
    async api_tin3Optin() {
      if (!this.pubilshCode) return;
      const query = {
        shipmentCode: this.pubilshCode
      };
      const { rows } = await listInfo(query);

      this.tin3Optin = [{ dictValue: '0', dictLabel: '无所属项目' }];
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

    // 3. 选择大类后 ==>根据大类获取小类列表
    async handletin2(tin3item) {
      // this.formData.tin3 = '0'; // 项目清0

      // 触发一下看看是都必填的吗
      this.$refs['elForm'] && this.$refs['elForm'].validate();

      this.$emit('input', this.isMultiGoods);

      try {
        const { data } = await this.listByDict({
          dictPid: this._zhaovalue(this.tin2Option, this.formData.tin2).dictCode,
          dictType: 'goodsType'
        });
        this.tin2_Option = data;
      } catch (error) {
        this.tin2_Option = [];
      }



      if (!this.isMultiGoods) {
        this.formData.tin2_2 = this.tin2_Option[0] ? this.tin2_Option[0].dictValue : this.formData.tin2;
        this.formData.tin2_1 = [];
      } else {
        this.formData.tin2_2 = '';
      }

      if (!tin3item || !tin3item.dictValue) return;
      // 选择了项目后触发了这个, 改版后可能会没有值存在了
      this.formData.tin3 = tin3item.dictValue;

      if (this.isMultiGoods) {
        this.formData.tin2_1 = tin3item.commoditySubclassCodes ? tin3item.commoditySubclassCodes.split(',') : [];

        this.formData.tin2_2 = '';
      } else {
        this.formData.tin2_1 = [];
        this.formData.tin2_2 = tin3item.commoditySubclassCodes || '';
      }
    },

    // 5. 打开弹框选取调度者或司机
    open1() {
      this.open = true;
    },

    // 关闭调度组弹框
    handleTin6_1() {
      /*
          code: "af555489e55d4167b625af1721123389"
          companyName: "测试支付宝运输有限公司"
          createCode: "afd5c0dcdaab45bb9c2160eb91a443db"
          createTime: "2021-08-16 16:00:00"
          disName: "钓鱼台"
          disUserCode: "48afcf3384984445a10dd631094139ef"
          disUserName: "钓鱼台"
          disUserPhone: "18912345678"
          id: 292
          isDel: 0
          isNotInvoice: 0
          isOften: 0
          tel: null
          wayCount: 437
      */

      this.formData.tin6_1 = this.orderSpecifiedList.map(e => {
        return {
          ...e, // 需要其他再加
          _tinCode: e.code,
          code: e.disUserCode,
          teamName: e.disName,
          type: 'info',
          userType: 1
        };
      });

      this.open = false;
      this.title = '';
    },

    // 6. 选取后回调
    handleSelectionChange(obj, bool) {
      // 就处理调度组的
      if (bool) {
        this.formData.tin6_1 = obj['listInfo'] || [];

        this.formData.tin6_2 = obj['listDriver'] || [];

        if (this.formData.tin6_2.length > 0) {
          this.actionIndex = '2';
        } else {
          this.actionIndex = '1';
        }

        const listDriver = (obj['listDriver'] || []).map(e => {
          return {
            ...e, // 需要其他再加
            code: e.code,
            driverName: e.name,
            type: 'info',
            userType: 2
          };
        });
        const listInfo = (obj['listInfo'] || []).map(e => {
          return {
            ...e, // 需要其他再加
            code: e.code,
            teamName: e.name,
            type: 'info',
            userType: 1
          };
        });


        this.orderSpecifiedList = [...listDriver, ...listInfo];
        this.formData['tin6_' + this.actionIndex] = this.orderSpecifiedList;

        // if (this.formData.tin6_1.length > 1) {
        //   this.msgInfo('调度者只能选择一个');
        //   return;
        // }
      }
      this.open = false;
      this.title = '';
    },

    // 7. 发布位置切换
    async handleTin4() {
      // if (this.formData.tin4 === '1') {
      //   this.formData.tin5 = '0';
      //   this.formData.tin6 = '';
      //   this.formData.tin6_1 = []; // 调度者
      //   this.formData.tin6_2 = []; // 司机
      // } else {
      //   }
      if (this.tin6Option.length) return;
      const query = {
        shipmentCode: this.pubilshCode
      };
      const { rows } = await listStockcode(query);

      this.tin6Option = this._baozhuan(rows, 'code', 'cargoCodeName');
    },

    // 8. 提交
    _submitForm() {
      return new Promise((resolve, reject) => {
        this.$refs['elForm'].validate((valid) => {
          if (valid) {
            if (this.formData.tin5 === '1' && !this.formData.tin6_1.length && !this.formData.tin6_2.length) {
              this.msgInfo('请选择指定联系人');
              return;
            }

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
                const obj = this._zhaovalue(this.tin2_Option, e);
                const obj2 = this._zhaovalue(this.tin2Option, this.formData.tin2);
                return {
                  goodsBigType: this.formData.tin2,
                  goodsBigTypeName: obj2.dictLabel,
                  goodsType: e,
                  goodsTypeName: obj ? obj.dictLabel : obj2.dictLabel
                };
              });
            } else {
              const obj = this._zhaovalue(this.tin2_Option, this.formData.tin2_2);
              const obj2 = this._zhaovalue(this.tin2Option, this.formData.tin2);
              orderGoodsList = [{
                goodsBigType: this.formData.tin2,
                goodsBigTypeName: obj2.dictLabel,
                goodsType: this.formData.tin2_2,
                goodsTypeName: obj ? obj.dictLabel : obj2.dictLabel
              }];
            }

            resolve({
              InfoCode: this.InfoCode,
              classList: [
                {
                  classCode: this.formData.tin6
                }
              ],
              publishMode: this.formData.publishMode - 0,
              isPublic: this.formData.tin5 === '1' ? 0 : 1, //	是否公开货源 0.非公开 1.公开,
              isSpecified: this.formData.tin5 === '1', // 是否指定接单人 0否 1是		false
              orderGoodsList,
              orderSpecifiedList: tin6_1.concat(tin6_2),
              projectCode: this.formData.tin3 === '0' ? '' : this.formData.tin3,
              pubilshCode: this.pubilshCode,
              remark: this.formData.remark,

              uploadLoadVoucher: this.formData.uploadLoadVoucher,
              uploadUnloadVoucher: this.formData.uploadUnloadVoucher
            });
          } else {
            return false;
          }
        });
      });
    },

    /* 关闭 */
    closable(index) {
      this.orderSpecifiedList.splice(index, 1);



      this.formData['tin6_1'] = this.orderSpecifiedList.map(e => {
        return {
          ...e, // 需要其他再加
          teamName: e.disName || e.teamName
        };
      });

      console.log(this.formData['tin6_1']);

      console.log(this.actionIndex);
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
.el-tag.driver{
  color: #000;
  padding-left: 30px;
  background: #EDF5FE url('~@/assets/images/order_siji.png') no-repeat 5px 3px;
}
.el-tag.team{
  color: #000;
  padding-left: 30px;
  background: #FDF2E7 url('~@/assets/images/order_chedui.png') no-repeat 5px 3px;
}

.m_radio{
  margin-left: 0;
  margin-right: 5px;
  ::v-deep .el-radio__input{
      display: none;
  }
}
.m_warp{
  flex-wrap: wrap;
}

.m_radio.is-checked{
    background-color: #edf5fe;
    position: relative;
    &::after{
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      right: -1px;
      bottom: -1px;
      background: url('~@/assets/images/order_xiabiao.png') no-repeat;
      background-size: 100% 100%;
    }
}
</style>
