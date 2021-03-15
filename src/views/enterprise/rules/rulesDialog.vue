<template>
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
      <el-form-item label="规则名称" prop="ruleName">
        <el-input v-model="form.ruleName" placeholder="请输入规则名称" class="width-small" clearable />
      </el-form-item>
      <el-form-item label="计算公式" prop="ruleType">
        <el-select
          v-model="form.ruleType"
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
            <li class="g-text">公式1：运费 = 装货重量 * 运费单价+ 增项-减项</li>
            <li class="g-text">公式2：运费 = 卸货重量 * 运费单价 + 增项 - 减项</li>
            <li class="g-text">公式3：运费 = 装卸货最小重量 * 运费单价 +增项 - 减项</li>
            <li class="g-text">公式4：运费 = 装卸货最大重量 * 运费单价 + 增项 - 减项</li>
          </ul>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="是否计算亏吨" prop="isLoss">
        <el-switch v-model="form.isLoss" />
      </el-form-item>
      <el-form-item label="亏吨方案" prop="lossType">
        <el-select v-model="form.lossType" placeholder="请选择亏吨方案" class="width-small" clearable>
          <el-option
            v-for="dict in lossTypeOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="亏吨容忍值">
        <el-input v-model="form.lossStart" placeholder="最小值" class="width-small" clearable />
        吨 ~
        <el-input v-model="form.lossEnd" placeholder="最大值" class="width-small" clearable />
        吨
      </el-form-item>

      <h5 class="g-title-small g-strong g-color-blue mb20">| 支出(增项)</h5>
      <el-form-item label="装车费" prop="">
        <el-input v-model="value" placeholder="请输入装车费" class="width-small" clearable />
        元
      </el-form-item>

      <h5 class="g-title-small g-strong g-color-blue mb20">| 收入(减项)</h5>
      <el-row>
        <el-col span="12">
          <el-form-item label="油卡费" prop="">
            <el-input v-model="value" placeholder="请输入油卡费" class="width-small" clearable />
            元
          </el-form-item>
        </el-col>
        <el-col span="12">
          <el-form-item label="ETC费" prop="">
            <el-input v-model="value" placeholder="请输入ETC费" class="width-small" clearable />
            元
          </el-form-item>
        </el-col>
        <el-col span="12">
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
        </el-col>
        <el-col span="12">
          <el-form-item label="亏吨计算方式" prop="lossCalculateType">
            <el-select v-model="form.lossCalculateType" placeholder="请选择亏吨计算方式" class="width-small" clearable>
              <el-option
                v-for="dict in lossCalculateTypeOptions"
                :key="dict.dictValue"
                :label="dict.dictLabel"
                :value="dict.dictValue"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addRules, updateRules } from '@/api/enterprise/rules';

export default {
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
      // 亏吨方案字典
      lossTypeOptions: [
        { dictLabel: '定额', dictValue: 1 },
        { dictLabel: '定律', dictValue: 2 }
      ],
      // 亏吨计算方式字典
      lossCalculateTypeOptions: [
        { dictLabel: '亏吨计算', dictValue: 1 },
        { dictLabel: '减吨计算', dictValue: 2 }
      ],
      // 抹零规则字典
      wipeOffTypeOptions: [
        { dictLabel: '角分抹零', dictValue: 1 },
        { dictLabel: '元抹零', dictValue: 2 }
      ],
      // 表单参数
      form: {},
      // 表单校验
      rules: {}
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
  create() {

  },
  methods: {
    // 提交按钮
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.userCode != null) {
            updateRules(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('getList');
            });
          } else {
            addRules(this.form).then(response => {
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
        userCode: null,
        ruleName: null,
        ruleType: null,
        isLoss: null,
        lossType: null,
        lossStart: null,
        lossEnd: null,
        lossCalculateType: null,
        wipeOffType: null,
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null,
        isDel: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
    }
  }
};
</script>

<style lang="scss" scoped>
.mr3{
  margin-right: 3%;
}
.mb{
  margin-bottom: 22px;
}
.width-small{
  width: 200px;
}
.el-form-item{
  margin-left: 40px;
}
</style>>
