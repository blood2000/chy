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
      <el-row>
        <el-form-item v-for="item in form.lossItem" :key="item.code" :label="item.cnName" :prop="item.code">
          <el-input v-model="form.lossItemObj[item.code]" :placeholder="`请输入${item.cnName}`" class="width-small" clearable />
          <!-- <template v-if="item.showType === 2">
            <el-input v-model="form.lossItemObj[item.code]" placeholder="最小值" class="width-small" clearable />
            -
            <el-input v-model="form.lossItemObj[item.code]" placeholder="最大值" class="width-small" clearable />
          </template>
          <el-select v-if="item.showType === 3" v-model="form.lossItemObj[item.code]" class="width-small" clearable>
            <el-option
              v-for="dict in lossCalculateTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
          <el-radio-group v-if="item.showType === 4" v-model="form.lossItemObj[item.code]">
            <el-radio
              v-for="dict in lossCalculateTypeOptions"
              :key="dict.dictValue"
              :label="parseInt(dict.dictValue)"
            >{{ dict.dictLabel }}</el-radio>
          </el-radio-group> -->
        </el-form-item>
      </el-row>
      <!-- 减项 -->
      <h5 class="g-title-small g-strong g-color-blue mt10">
        | 扣费项目
        <el-button class="fr" icon="el-icon-plus" type="primary" plain circle size="mini" @click="chooseItem('reduce')" />
      </h5>
      <el-divider />
      <el-row>
        <el-form-item label="抹零规则" prop="wipeOffType">
          <el-select v-model="form.wipeOffType" placeholder="请选择抹零规则" class="width-small" clearable>
            <el-option
              v-for="dict in wipeOffTypeOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-for="item in form.reduceItem" :key="item.code" :label="item.cnName" :prop="item.code">
          <el-input v-model="item.enName" :placeholder="`请输入${item.cnName}`" class="width-small mr3" clearable />
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
          <el-input v-model="item.enName" :placeholder="`请输入${item.cnName}`" class="width-small mr3" clearable />
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
      ruleTypeOptions: [
        { dictLabel: '公式1', dictValue: 1 },
        { dictLabel: '公式2', dictValue: 2 },
        { dictLabel: '公式3', dictValue: 3 },
        { dictLabel: '公式4', dictValue: 4 }
      ],
      // 是否计算亏吨字典
      isLossOptions: [
        { dictLabel: '否', dictValue: 0 },
        { dictLabel: '是 = 卸货重量 * 运费单价 + 增项 - 减项', dictValue: 1 }
      ],
      // 计算方式字典
      lossTypeOptions: [
        { dictLabel: '定额(kg/车)', dictValue: 1 },
        { dictLabel: '定律(%o/车)', dictValue: 2 }
      ],
      // 亏吨计算方式字典
      lossCalculateTypeOptions: [
        { dictLabel: '(重量差 - 容忍值) * 货物单价', dictValue: 1 },
        { dictLabel: '重量差 * 货物单价', dictValue: 2 }
      ],
      // 抹零规则字典
      wipeOffTypeOptions: [
        { dictLabel: '角分抹零', dictValue: 1 },
        { dictLabel: '元抹零', dictValue: 2 }
      ],
      // 表单参数
      form: {
        addItem: [],
        reduceItem: [],
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
  mounted() {
    this.$nextTick(_ => {
      this.getList();
    });
  },
  methods: {
    // 获取路耗表单list
    getList() {
      getRuleItemList({ ruleType: 1 }).then(response => {
        this.$set(this.form, 'lossItem', response.data.list);
        this.form.lossItem.forEach(el => {
          this.$set(this.form.lossItemObj, el.code, null);
          this.form.lossItemObj[el.code] = null;
        });
      });
      console.log(this.form);
    },
    // 提交按钮
    submitForm() {
      this.$refs['form'].validate(valid => {
        // 构造参数
        const params = {
          name: this.form.name,
          ruleDictType: this.form.ruleDictType,
          shipperCode: this.form.shipperCode,
          detailList: [{
            ruleCode: '',
            ruleItemCode: '',
            ruleValue: '',
            type: 1
          }]
        };
        if (valid) {
          if (this.form.code != null) {
            updateRules(params).then(response => {
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('getList');
            });
          } else {
            addRules(params).then(response => {
              this.msgSuccess('新增成功');
              this.close();
              this.$emit('getList');
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
        reduceItem: [],
        lossItem: [],
        lossItemObj: {}
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
      } else if (type === 'reduce') {
        this.form.reduceItem = arr;
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
