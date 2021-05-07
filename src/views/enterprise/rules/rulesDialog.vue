<template>
  <el-dialog :title="title" :class="[{'i-add':title==='添加'}]" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" label-position="left" :disabled="!isAdmin && form.platformType === 1">
      <el-row>
        <el-col :span="12">
          <el-form-item label="规则名称" prop="name">
            <el-input v-model="form.name" placeholder="请输入规则名称" class="width-small" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="计算公式" prop="ruleDictValue">
            <el-select
              v-model="form.ruleDictValue"
              placeholder="请选择计算公式"
              class="width-small mr3"
              clearable
              filterable
            >
              <el-option
                v-for="dict in ruleTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
            <el-tooltip
              class="item"
              effect="light"
              placement="right"
            >
              <i class="el-icon-info" />
              <ul slot="content">
                <li v-for="(item, index) in ruleTypeOptions" :key="item.dictValue" class="g-text">{{ `公式${index + 1}:${item.dictLabel}` }}</li>
              </ul>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 计算路耗 -->
      <!-- 备注：开启路耗之后，路耗的所有项都必填 -->
      <h5 class="g-card-title g-strong mt10">
        关于计算路耗
        <el-switch v-model="form.isLoss" class="isLoss-switch" />
      </h5>
      <el-divider />
      <div v-show="!form.isLoss" class="none-box">未计算路耗</div>
      <el-row v-if="form.isLoss">
        <el-form-item
          v-for="item in lossItem"
          :key="item.code"
          :prop="item.code"
        >
          <label slot="label"><span style="color: #ff4949">* </span>{{ item.cnName }}</label>
          <el-input-number v-if="item.showType === 1" v-model="lossItemObj[item.code]" :controls="false" :precision="2" :placeholder="`请输入${item.cnName}`" class="width-small" clearable />
          <template v-if="item.showType === 2">
            -
            <el-input-number v-model="lossItemObj[item.code].start" :controls="false" :precision="2" :min="0" :max="currentRadio === 'DE' ? 100000 : 100" placeholder="最小值" class="width-small" clearable />
            <span v-show="currentRadio && currentRadio !== ''" class="unit-span-l g-color-gray">{{ currentRadio === 'DE' ? 'kg' : '%' }}</span>
            <span style="margin: 0 15px">至</span>
            <el-input-number v-model="lossItemObj[item.code].end" :controls="false" :precision="2" :min="0" :max="currentRadio === 'DE' ? 100000 : 100" placeholder="最大值" class="width-small" clearable />
            <span v-show="currentRadio && currentRadio !== ''" class="unit-span-r g-color-gray">{{ currentRadio === 'DE' ? 'kg' : '%' }}</span>
          </template>
          <el-select v-if="item.showType === 3" v-model="lossItemObj[item.code]" class="width-small" clearable filterable>
            <el-option
              v-for="dict in options[item.dictCode]"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
          <el-radio-group v-if="item.showType === 4" v-model="lossItemObj[item.code]" @change="radioChange">
            <el-radio
              v-for="dict in options[item.dictCode]"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <!-- 减项 -->
      <!-- 备注：没有填值的减项不会被提交 -->
      <h5 class="g-card-title g-strong mt10">
        扣费项目
        <el-button class="fr" icon="el-icon-plus" type="primary" plain circle size="mini" @click="chooseItem('reduce')" />
      </h5>
      <el-divider />
      <div v-show="form.reduceItem.length === 0" class="none-box">未添加项目</div>
      <el-row>
        <el-form-item v-for="item in form.reduceItem" :key="item.code" :label="item.cnName" :prop="item.code">
          <el-input-number v-if="item.showType === 1" v-model="form.reduceItemObj[item.code]" :min="0" :controls="false" :placeholder="`请输入${item.cnName}`" class="width-small mr3" clearable />
          <template v-if="item.showType === 2">
            <el-input-number v-model="form.reduceItemObj[item.code].start" :controls="false" placeholder="最小值" class="width-small mr3" clearable />
            -
            <el-input-number v-model="form.reduceItemObj[item.code].end" :controls="false" placeholder="最大值" class="width-small mr3" clearable />
          </template>
          <el-select v-if="item.showType === 3" v-model="form.reduceItemObj[item.code]" class="width-small mr3" clearable filterable>
            <el-option
              v-for="dict in options[item.dictCode]"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
          <el-radio-group v-if="item.showType === 4" v-model="form.reduceItemObj[item.code]">
            <el-radio
              v-for="dict in options[item.dictCode]"
              :key="dict.dictValue"
              :label="dict.dictValue"
              class="mr3"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" circle @click="deleteItem('reduce', item.code)" />
        </el-form-item>
      </el-row>
      <!-- 增项 -->
      <!-- 备注：没有填值的增项不会被提交 -->
      <h5 class="g-card-title g-strong mt10">
        补贴项目
        <el-button class="fr" icon="el-icon-plus" type="primary" plain circle size="mini" @click="chooseItem('add')" />
      </h5>
      <el-divider />
      <div v-show="form.addItem.length === 0" class="none-box">未添加项目</div>
      <el-row>
        <el-form-item v-for="item in form.addItem" :key="item.code" :label="item.cnName" :prop="item.code">
          <el-input-number v-if="item.showType === 1" v-model="form.addItemObj[item.code]" :min="0" :controls="false" :placeholder="`请输入${item.cnName}`" class="width-small mr3" clearable />
          <template v-if="item.showType === 2">
            <el-input-number v-model="form.addItemObj[item.code].start" :controls="false" placeholder="最小值" class="width-small mr3" clearable />
            -
            <el-input-number v-model="form.addItemObj[item.code].end" :controls="false" placeholder="最大值" class="width-small mr3" clearable />
          </template>
          <el-select v-if="item.showType === 3" v-model="form.addItemObj[item.code]" class="width-small mr3" clearable filterable>
            <el-option
              v-for="dict in options[item.dictCode]"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
          <el-radio-group v-if="item.showType === 4" v-model="form.addItemObj[item.code]">
            <el-radio
              v-for="dict in options[item.dictCode]"
              :key="dict.dictValue"
              :label="dict.dictValue"
              class="mr3"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" circle @click="deleteItem('add', item.code)" />
        </el-form-item>
      </el-row>
    </el-form>
    <div v-if="isAdmin || form.platformType !== 1" slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>

    <!-- 增减费用项目选择弹出层 -->
    <choose-item-dialog
      :open.sync="chooseItemOpen"
      :item-type="chooseItemType"
      :add-checked-item="form.addItem"
      :reduce-checked-item="form.reduceItem"
      @refresh="setItem"
      @getOptionsByCode="getOptionsByCode"
    />
  </el-dialog>
</template>

<script>
import { addRules, updateRules, getRuleItemList } from '@/api/enterprise/rules';
import chooseItemDialog from './chooseItemDialog.vue';
import { getUserInfo } from '@/utils/auth';

const { isAdmin = false } = getUserInfo() || {};

export default {
  components: {
    chooseItemDialog
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    shipmentCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      buttonLoading: false,
      isAdmin,
      // 计算公式字典
      ruleTypeOptions: [],
      // 表单参数
      form: {
        platformType: 2, // 1运营 2货主
        shipperCode: null, // 角色为1时要传
        addItem: [],
        addItemObj: {},
        reduceItem: [],
        reduceItemObj: {}
      },
      // 路耗
      lossItem: [],
      lossItemObj: {},
      // 字典管理
      options: {},
      // 表单校验
      rules: {
        name: [
          { required: true, message: '规则名称不能为空', trigger: 'blur' }
        ],
        ruleDictValue: [
          { required: true, message: '计算公式不能为空', trigger: 'change' }
        ]
      },
      // 增减费用项目选择弹出层显示
      chooseItemOpen: false,
      chooseItemType: '',
      // 储存选择的 定额/定率
      currentRadio: 'DE'
    };
  },
  computed: {
    visible: {
      get() {
        return this.open;
      },
      set(v) {
        this.$emit('update:open', v);
      }
    }


  },
  mounted() {
    this.getAllDicList();
  },
  methods: {
    /**
     * 获取字典
     */
    getAllDicList() {
      // 计算公式
      this.getDicts('ruleFormula').then((response) => {
        this.ruleTypeOptions = response.data;
      });
      // 获取路耗表单
      getRuleItemList({ ruleType: 1 }).then(response => {
        this.lossItem = response.data.list;
        this.lossItem.forEach(el => {
          if (el.dictCode) {
            this.getOptionsByCode(el.dictCode);
          }
        });
        this.setLossList();
      });
    },
    /**
     * 生成路耗表单
     */
    setLossList(lossList) {
      this.lossItem.forEach(el => {
        this.fillFormItem(el, this.lossItemObj);
      });
      this.setLossStartAndEndDefault();
      if (lossList) {
        lossList.forEach(el => {
          this.fillFormItem(el, this.lossItemObj);
          if (el.ruleValue === 'DE' || el.ruleValue === 'DL') {
            this.radioChange(el.ruleValue);
          }
        });
      }
    },
    /**
     * 根据dictCode获取select或radio类型表单的字典
     */
    getOptionsByCode(dictCode) {
      this.getDicts(dictCode).then((response) => {
        this.options[dictCode] = response.data;
      });
    },
    /**
     * 回填表单的值(路耗/增项/减项通用)
     */
    fillFormItem(el, obj) {
      if (el.ruleItemCode) {
        el.code = el.ruleItemCode;
      }
      if (el.showType === 2) { // 回填范围区域，2个值
        this.$set(obj, el.code, {});
        this.$set(obj[el.code], 'start', el.ruleValue ? JSON.parse(el.ruleValue)[0] : '');
        this.$set(obj[el.code], 'end', el.ruleValue ? JSON.parse(el.ruleValue)[1] : '');
      } else { // 回填单个值
        this.$set(obj, el.code, el.ruleValue ? el.ruleValue : null);
      }
    },
    /**
     * 提交按钮
     */
    submitForm() {
      this.$refs['form'].validate(valid => {
        this.buttonLoading = true;
        // 构造参数
        const params = {
          name: this.form.name,
          ruleDictValue: this.form.ruleDictValue,
          detailList: []
        };
        if (this.form.isLoss) {
          // 开启路耗，所有项都要必填
          if (!this.isLossFill()) {
            return;
          }
          this.setParams(this.lossItem, this.lossItemObj, params);
        }
        this.setParams(this.form.addItem, this.form.addItemObj, params, 1);
        this.setParams(this.form.reduceItem, this.form.reduceItemObj, params, 2);
        if (valid) {
          if (this.form.code) {
            params.code = this.form.code;
            updateRules(params).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh');
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            if (this.shipmentCode) {
              params.shipperCode = this.shipmentCode;
              params.platformType = 2;
            } else {
              params.platformType = this.form.platformType;
            }
            addRules(params).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('新增成功');
              this.close();
              this.$emit('refresh');
            }).catch(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    /**
     * 构造提交按钮的请求参数
     */
    setParams(list, obj, params, type) {
      list.forEach(el => {
        // 范围区间,2个值
        if (el.showType === 2) {
          // 忽略值为空的项
          if (obj[el.code].start === '' && obj[el.code].end === '') return;
          if (obj[el.code].start === null && obj[el.code].end === null) return;
          if (obj[el.code].start === undefined && obj[el.code].end === undefined) return;
          // 判断是不是增项或减项,增项或减项要传type,路耗不用传type
          if (type) {
            params.detailList.push({
              ruleItemCode: el.code,
              ruleValue: JSON.stringify([obj[el.code].start, obj[el.code].end]),
              type: type
            });
          } else {
            params.detailList.push({
              ruleItemCode: el.code,
              ruleValue: JSON.stringify([obj[el.code].start, obj[el.code].end])
            });
          }
        } else { // 单个值
          if (obj[el.code] !== '' && obj[el.code] !== undefined && obj[el.code] !== null) {
            if (type) {
              params.detailList.push({
                ruleItemCode: el.code,
                ruleValue: obj[el.code],
                type: type
              });
            } else {
              params.detailList.push({
                ruleItemCode: el.code,
                ruleValue: obj[el.code]
              });
            }
          }
        }
      });
    },
    /**
     * 验证路耗必填
     */
    isLossFill() {
      const _this = this;
      const flag = _this.lossItem.some(function(el) {
        if (el.showType === 2) {
          if (_this.lossItemObj[el.code].start === '' ||
              _this.lossItemObj[el.code].end === '' ||
              _this.lossItemObj[el.code].start === null ||
              _this.lossItemObj[el.code].end === null ||
              _this.lossItemObj[el.code].start === undefined ||
              _this.lossItemObj[el.code].end === undefined
          ) {
            _this.msgWarning(`“${el.cnName}”项不能为空`);
            return true;
          }
        } else {
          if (_this.lossItemObj[el.code] === '' || _this.lossItemObj[el.code] === undefined || _this.lossItemObj[el.code] === null) {
            _this.msgWarning(`“${el.cnName}”项不能为空`);
            return true;
          }
        }
      });
      return !flag;
    },
    /**
     * 取消按钮
     */
    cancel() {
      this.close();
      this.reset();
    },
    /**
     * 关闭弹窗
     */
    close() {
      this.$emit('update:open', false);
    },
    /**
     * 表单重置
     */
    reset() {
      this.buttonLoading = false;
      this.currentRadio = 'DE';
      this.form = {
        platformType: 2, // 1运营 2货主
        code: null,
        name: null,
        ruleDictValue: null,
        isLoss: true,
        addItem: [],
        addItemObj: {},
        reduceItem: [],
        reduceItemObj: {}
      };
      this.resetForm('form');
    },
    /**
     * 表单回填
     */
    setForm(data) {
      this.form.platformType = data.ruleInfo.platformType === 1 ? 1 : 2; // 1运营 2货主
      this.form.code = data.ruleInfo.code;
      this.form.name = data.ruleInfo.name;
      this.form.ruleDictValue = data.ruleInfo.ruleDictValue;
      this.form.isLoss = data.lossList.length > 0;
      // 回填路耗
      this.setLossList(data.lossList);
      // 回填增减项
      data.detailList.forEach(el => {
        if (el.type === '1') {
          // 增项
          this.form.addItem.push(el);
          this.fillFormItem(el, this.form.addItemObj);
        } else if (el.type === '2') {
          // 减项
          this.form.reduceItem.push(el);
          this.fillFormItem(el, this.form.reduceItemObj);
        }
      });
    },
    /**
     * 新增细项
     */
    chooseItem(type) {
      this.chooseItemOpen = true;
      this.chooseItemType = type;
    },
    /**
     * 将勾选的细项回显
     */
    setItem(type, arr) {
      if (type === 'add') {
        const itemList = JSON.parse(JSON.stringify(this.form.addItem));
        const itemObj = JSON.parse(JSON.stringify(this.form.addItemObj));
        this.form.addItem = arr;
        this.form.addItemObj = {};
        // 新勾选的细项与已勾选的细项求交集
        for (let i = 0; i < this.form.addItem.length; i++) {
          this.$set(this.form.addItemObj, this.form.addItem[i].code, null);
          for (let j = 0; j < itemList.length; j++) {
            // 如果新勾选的细项已经存在，则回填上之前存的值，避免已勾选的细项值被覆盖清空
            if (itemList[j].code === this.form.addItem[i].code) {
              this.form.addItem[i] = itemList[j];
              this.$set(this.form.addItemObj, this.form.addItem[i].code, itemObj[this.form.addItem[i].code]);
            }
          }
        }
      } else if (type === 'reduce') {
        const itemList = JSON.parse(JSON.stringify(this.form.reduceItem));
        const itemObj = JSON.parse(JSON.stringify(this.form.reduceItemObj));
        this.form.reduceItem = arr;
        this.form.reduceItemObj = {};
        for (let i = 0; i < this.form.reduceItem.length; i++) {
          this.$set(this.form.reduceItemObj, this.form.reduceItem[i].code, null);
          for (let j = 0; j < itemList.length; j++) {
            if (itemList[j].code === this.form.reduceItem[i].code) {
              this.form.reduceItem[i] = itemList[j];
              this.$set(this.form.reduceItemObj, this.form.reduceItem[i].code, itemObj[this.form.reduceItem[i].code]);
            }
          }
        }
      }
    },
    /**
     * 删除细项
     */
    deleteItem(type, code) {
      if (type === 'add') {
        this.form.addItem = this.form.addItem.filter(el => {
          return el.code !== code;
        });
      } else if (type === 'reduce') {
        this.form.reduceItem = this.form.reduceItem.filter(el => {
          return el.code !== code;
        });
      }
      this.$forceUpdate();
    },
    /**
     * 选择亏吨方案
     */
    radioChange(data) {
      this.currentRadio = data;
      if (data === 'DL') {
        this.setLossStartAndEnd(100);
      }
    },
    /**
     * 路耗容忍值-赋值
     */
    setLossStartAndEnd(val) {
      this.lossItem.forEach(el => {
        if (el.showType === 2) {
          if (this.lossItemObj[el.code].start > 100) this.lossItemObj[el.code].start = val;
          if (this.lossItemObj[el.code].end > 100) this.lossItemObj[el.code].end = val;
        }
      });
    },
    /**
     * 路耗容忍值-设默认值
     */
    setLossStartAndEndDefault() {
      this.lossItem.forEach(el => {
        if (el.showType === 4) {
          this.lossItemObj[el.code] = 'DE';
        }
        if (el.showType === 2) {
          this.lossItemObj[el.code].start = 5;
          this.lossItemObj[el.code].end = 5;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.el-form{
  margin: 0 20px;
  .mr3{
    margin-right: 3%;
  }
  .mt10{
    margin-top: 10px;
  }
  .width-small{
    width: 200px;
  }
  .isLoss-switch{
    margin: -4px 0 0 6px;
  }
  .el-divider{
    margin: 10px 0 20px;
  }
  /* 计数器样式 */
  .el-input-number ::v-deep.el-input__inner{
    text-align: left;
    padding-right: 30px;
  }
  /* 单位 */
  .unit-span-l{
    position: absolute;
    left: 184px;
    top: 0;
  }
  .unit-span-r{
    position: absolute;
    left: 428px;
    top: 0;
  }
  /* 暂无数据 */
  .none-box{
    text-align: center;
    padding: 10px 0 15px;
  }
}
</style>>
