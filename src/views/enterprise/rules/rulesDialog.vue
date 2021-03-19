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
          <el-form-item label="计算公式" prop="ruleDictType">
            <el-select
              v-model="form.ruleDictType"
              placeholder="请选择计算公式"
              class="width-small mr3"
              clearable
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
                <li class="g-text">公式1：运费 = 装货重量 * 运费单价 + 增项 - 减项</li>
                <li class="g-text">公式2：运费 = 卸货重量 * 运费单价 + 增项 - 减项</li>
                <li class="g-text">公式3：运费 = 装卸货最小重量 * 运费单价 + 增项 - 减项</li>
                <li class="g-text">公式4：运费 = 装卸货最大重量 * 运费单价 + 增项 - 减项</li>
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
        <el-form-item v-for="item in form.lossItem" :key="item.code" :label="item.cnName" :prop="item.code">
          <el-input v-if="item.showType === 1" v-model="form.lossItemObj[item.code]" :placeholder="`请输入${item.cnName}`" class="width-small" clearable />
          <template v-if="item.showType === 2">
            <el-input v-model="form.lossItemObj[item.code].start" placeholder="最小值" class="width-small" clearable />
            -
            <el-input v-model="form.lossItemObj[item.code].end" placeholder="最大值" class="width-small" clearable />
          </template>
          <el-select v-if="item.showType === 3" v-model="form.lossItemObj[item.code]" class="width-small" clearable>
            <el-option
              v-for="dict in form[item.dictCode]"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
          <el-radio-group v-if="item.showType === 4" v-model="form.lossItemObj[item.code]">
            <el-radio
              v-for="dict in form[item.dictCode]"
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
          <el-select v-if="item.showType === 3" v-model="form.reduceItemObj[item.code]" class="width-small mr3" clearable>
            <el-option
              v-for="dict in form[item.dictCode]"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
          <el-radio-group v-if="item.showType === 4" v-model="form.reduceItemObj[item.code]">
            <el-radio
              v-for="dict in form[item.dictCode]"
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
          <el-select v-if="item.showType === 3" v-model="form.addItemObj[item.code]" class="width-small mr3" clearable>
            <el-option
              v-for="dict in form[item.dictCode]"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
          <el-radio-group v-if="item.showType === 4" v-model="form.addItemObj[item.code]">
            <el-radio
              v-for="dict in form[item.dictCode]"
              :key="dict.dictValue"
              :label="dict.dictValue"
              class="mr3"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" circle @click="deleteItem('add', item.code)" />
        </el-form-item>
      </el-row>
      <!-- 抹零规则 -->
      <el-form-item label="抹零规则" prop="m0DictValue">
        <el-select v-model="form.m0DictValue" placeholder="请选择抹零规则" class="width-small" clearable>
          <el-option
            v-for="dict in m0DictValueOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
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
      value: '',
      // 计算公式字典
      ruleTypeOptions: [],
      // 抹零规则字典
      m0DictValueOptions: [],
      // 表单参数
      form: {
        addItem: [],
        addItemObj: {},
        reduceItem: [],
        reduceItemObj: {},
        lossItem: [],
        lossItemObj: {}
      },
      // 表单校验
      rules: {},
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
  created() {
    this.getAllDicList();
  },
  methods: {
    // 获取字典
    getAllDicList() {
      // 计算公式
      this.getDicts('ruleFormula').then((response) => {
        this.ruleTypeOptions = response.data;
      });
      // 抹零规则
      this.getDicts('M0').then((response) => {
        this.m0DictValueOptions = response.data;
      });
    },
    // 获取路耗表单list
    getList() {
      getRuleItemList({ ruleType: 1 }).then(response => {
        this.form.lossItem = response.data.list;
        this.form.lossItem.forEach(el => {
          this.$set(this.form.lossItemObj, el.code, null);
          // select或radio类型的表单需要获取option字典
          if (el.dictCode) {
            this.getDicts(el.dictCode).then((response) => {
              this.form[el.dictCode] = response.data;
              this.$forceUpdate();
            });
          }
          // 填范围区域的值要特殊处理
          if (el.showType === 2) {
            this.$set(this.form.lossItemObj, el.code, {});
            this.$set(this.form.lossItemObj[el.code], 'start', '');
            this.$set(this.form.lossItemObj[el.code], 'end', '');
          }
        });
      });
    },
    // 提交按钮
    submitForm() {
      this.$refs['form'].validate(valid => {
        // 构造参数
        const params = {
          name: this.form.name,
          ruleDictType: this.form.ruleDictType,
          shipperCode: this.form.shipperCode,
          m0DictValue: this.form.m0DictValue,
          detailList: []
        };
        this.form.addItem.forEach(el => {
          params.detailList.push({
            ruleItemCode: el.code,
            ruleValue: this.form.addItemObj[el.code],
            type: 1
          });
        });
        this.form.reduceItem.forEach(el => {
          params.detailList.push({
            ruleItemCode: el.code,
            ruleValue: this.form.reduceItemObj[el.code],
            type: 2
          });
        });
        console.log(params);
        if (valid) {
          if (this.form.code != null) {
            updateRules(params).then(response => {
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh');
            });
          } else {
            addRules(params).then(response => {
              this.msgSuccess('新增成功');
              this.close();
              this.$emit('refresh');
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.close();
      this.reset();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 表单重置
    reset() {
      this.form = {
        code: null,
        shipperCode: 'ca8b3f3528a34365b41ad4cdb2074f67',
        name: null,
        ruleDictType: null,
        isLoss: true,
        addItem: [],
        addItemObj: {},
        reduceItem: [],
        reduceItemObj: {},
        lossItem: [],
        lossItemObj: {},
        m0DictValue: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
    },
    // 增减费用项目选择
    chooseItem(type) {
      this.chooseItemOpen = true;
      this.chooseItemType = type;
    },
    setItem(type, arr) {
      if (type === 'add') {
        this.form.addItem = arr;
        this.form.addItem.forEach(el => {
          this.$set(this.form.addItemObj, el.code, null);
        });
      } else if (type === 'reduce') {
        this.form.reduceItem = arr;
        this.form.reduceItem.forEach(el => {
          this.$set(this.form.reduceItemObj, el.code, null);
        });
      }
    },
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
