<template>
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" label-position="left">
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
      <h5 class="g-title-small g-strong g-color-blue mt10">
        | 关于计算路耗
        <el-switch v-model="form.isLoss" class="isLoss-switch" />
      </h5>
      <el-divider />
      <el-row v-show="form.isLoss">
        <el-form-item v-for="item in lossItem" :key="item.code" :label="item.cnName" :prop="item.code">
          <el-input v-if="item.showType === 1" v-model="lossItemObj[item.code]" :placeholder="`请输入${item.cnName}`" class="width-small" clearable />
          <template v-if="item.showType === 2">
            <el-input v-model="lossItemObj[item.code].start" placeholder="最小值" class="width-small" clearable />
            -
            <el-input v-model="lossItemObj[item.code].end" placeholder="最大值" class="width-small" clearable />
          </template>
          <el-select v-if="item.showType === 3" v-model="lossItemObj[item.code]" class="width-small" clearable filterable>
            <el-option
              v-for="dict in options[item.dictCode]"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
          <el-radio-group v-if="item.showType === 4" v-model="lossItemObj[item.code]">
            <el-radio
              v-for="dict in options[item.dictCode]"
              :key="dict.dictValue"
              :label="dict.dictValue"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
      <!-- 减项 -->
      <h5 class="g-title-small g-strong g-color-blue mt10">
        | 扣费项目
        <el-button class="fr" icon="el-icon-plus" type="primary" plain circle size="mini" @click="chooseItem('reduce')" />
      </h5>
      <el-divider />
      <el-row>
        <el-form-item v-for="item in form.reduceItem" :key="item.code" :label="item.cnName" :prop="item.code">
          <el-input v-if="item.showType === 1" v-model="form.reduceItemObj[item.code]" :placeholder="`请输入${item.cnName}`" class="width-small mr3" clearable />
          <template v-if="item.showType === 2">
            <el-input v-model="form.reduceItemObj[item.code].start" placeholder="最小值" class="width-small mr3" clearable />
            -
            <el-input v-model="form.reduceItemObj[item.code].end" placeholder="最大值" class="width-small mr3" clearable />
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
      <h5 class="g-title-small g-strong g-color-blue mt10">
        | 补贴项目
        <el-button class="fr" icon="el-icon-plus" type="primary" plain circle size="mini" @click="chooseItem('add')" />
      </h5>
      <el-divider />
      <el-row>
        <el-form-item v-for="item in form.addItem" :key="item.code" :label="item.cnName" :prop="item.code">
          <el-input v-if="item.showType === 1" v-model="form.addItemObj[item.code]" :placeholder="`请输入${item.cnName}`" class="width-small mr3" clearable />
          <template v-if="item.showType === 2">
            <el-input v-model="form.addItemObj[item.code].start" placeholder="最小值" class="width-small mr3" clearable />
            -
            <el-input v-model="form.addItemObj[item.code].end" placeholder="最大值" class="width-small mr3" clearable />
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
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
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

export default {
  components: {
    chooseItemDialog
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
  },
  data() {
    return {
      // 计算公式字典
      ruleTypeOptions: [],
      // 表单参数
      form: {
        platformType: 2, // 1运营 2货主
        shipperCode: null, // 角色为货主时要传
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
          { required: true, message: '计算公式不能为空', trigger: 'blur' }
        ]
      },
      // 增减费用项目选择弹出层显示
      chooseItemOpen: false,
      chooseItemType: ''
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
      if (lossList) {
        lossList.forEach(el => {
          this.fillFormItem(el, this.lossItemObj);
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
        // 构造参数
        const params = {
          name: this.form.name,
          ruleDictValue: this.form.ruleDictValue,
          detailList: []
        };
        if (this.form.isLoss) {
          this.setParams(this.lossItem, this.lossItemObj, params);
        }
        this.setParams(this.form.addItem, this.form.addItemObj, params, 1);
        this.setParams(this.form.reduceItem, this.form.reduceItemObj, params, 2);
        if (valid) {
          if (this.form.code) {
            params.code = this.form.code;
            updateRules(params).then(response => {
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh');
            });
          } else {
            params.platformType = this.form.platformType;
            addRules(params).then(response => {
              this.msgSuccess('新增成功');
              this.close();
              this.$emit('refresh');
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
      this.form.platformType = 2; // 1运营 2货主
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
}
</style>>
