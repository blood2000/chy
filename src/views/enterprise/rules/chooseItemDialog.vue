<template>
  <el-dialog class="component-choose-rule-item" title="增减费用项目选择" :visible="visible" width="500px" append-to-body @close="cancel">
    <el-checkbox-group v-model="checkGroup" size="medium" class="ml20">
      <el-row>
        <el-col v-for="item in formGroup" :key="item.code" class="mb20">
          <el-checkbox :label="item.cnName" :disabled="item.disabled" border />
        </el-col>
      </el-row>
    </el-checkbox-group>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getRuleItemList } from '@/api/enterprise/rules';

export default {
  props: {
    open: Boolean,
    itemType: {
      type: String,
      default: null
    },
    addCheckedItem: {
      type: Array,
      default: function() {
        return [];
      }
    },
    reduceCheckedItem: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {
      formGroup: [],
      checkGroup: []
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
  watch: {
    open(val) {
      if (!val) return;
      this.reset();
      this.setForm();
    }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      getRuleItemList({ ruleType: 0 }).then(response => {
        this.formGroup = response.data.list;
        this.formGroup.forEach(el => {
          el.disabled = false;
        });
      });
    },
    reset() {
      this.formGroup.forEach(el => {
        el.disabled = false;
      });
    },
    setForm() {
      if (this.itemType === 'add') {
        this.setFormCheckAndDisable(this.addCheckedItem, this.reduceCheckedItem);
      } else if (this.itemType === 'reduce') {
        this.setFormCheckAndDisable(this.reduceCheckedItem, this.addCheckedItem);
      }
    },
    /**
     * 选择增项的时候,已选择的增项回显,已选择的减项不可选
     * 选择减项的时候,已选择的减项回显,已选择的增项不可选
     */
    setFormCheckAndDisable(item1, item2) {
      // 回显
      if (item1.length === 0) {
        this.checkGroup = [];
      } else {
        this.checkGroup = item1.map(el => {
          return el.cnName;
        });
      }
      // 设置disable
      for (let i = 0; i < this.formGroup.length; i++) {
        for (let j = 0; j < item2.length; j++) {
          if (item2[j].cnName === this.formGroup[i].cnName) {
            this.$set(this.formGroup[i], 'disabled', true);
          }
        }
      }
    },
    // 提交
    submitForm() {
      const arr = [];
      for (let i = 0; i < this.formGroup.length; i++) {
        for (let j = 0; j < this.checkGroup.length; j++) {
          if (this.checkGroup[j] === this.formGroup[i].cnName) {
            arr.push(this.formGroup[i]);
          }
        }
      }
      this.$emit('refresh', this.itemType, arr);
      this.close();
    },
    // 取消按钮
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    }
  }
};
</script>

<style lang="scss" scoped>
.component-choose-rule-item{
  .ml20{
    margin-left: 20px;
  }
}
</style>
