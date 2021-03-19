<template>
  <el-dialog class="component-choose-rule-item" title="增减费用项目选择" :visible="visible" width="500px" append-to-body @close="cancel">
    <el-checkbox-group v-model="checkGroup" size="medium" class="ml20">
      <el-row>
        <el-col v-for="item in formGroup" :key="item.code" class="mb20">
          <el-checkbox :label="item.name" :disabled="item.disabled" border />
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
      formGroup: [
        { name: '装车费', code: 'zcf', disabled: false },
        { name: '卸车费', code: 'xcf', disabled: false },
        { name: '油费', code: 'yf', disabled: false },
        { name: 'ETC费', code: 'etcf', disabled: false },
        { name: '超时费', code: 'csf', disabled: false },
        { name: '扣回单费', code: 'khdf', disabled: false }
      ],
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
  methods: {
    reset() {
      this.formGroup.forEach(el => {
        el.disabled = false;
      });
    },
    /**
     * 选择增项的时候,已选择的增项回显,已选择的减项不可选
     */
    setForm() {
      if (this.itemType === 'add') {
        // 回显
        if (this.addCheckedItem.length === 0) {
          this.checkGroup = [];
        } else {
          const arr = this.addCheckedItem.map(el => {
            return el.name;
          });
          this.checkGroup = arr;
        }
        // 设置disable
        for (let i = 0; i < this.formGroup.length; i++) {
          for (let j = 0; j < this.reduceCheckedItem.length; j++) {
            if (this.reduceCheckedItem[j].name === this.formGroup[i].name) {
              this.formGroup[i].disabled = true;
              this.$set(this.formGroup[i], 'disabled', true);
            }
          }
        }
      } else if (this.itemType === 'reduce') {
        // 回显
        if (this.reduceCheckedItem.length === 0) {
          this.checkGroup = [];
        } else {
          const arr = this.reduceCheckedItem.map(el => {
            return el.name;
          });
          this.checkGroup = arr;
        }
        // 设置disable
        for (let i = 0; i < this.formGroup.length; i++) {
          for (let j = 0; j < this.addCheckedItem.length; j++) {
            if (this.addCheckedItem[j].name === this.formGroup[i].name) {
              this.$set(this.formGroup[i], 'disabled', true);
            }
          }
        }
      }
    },
    // 提交
    submitForm() {
      const arr = [];
      for (let i = 0; i < this.formGroup.length; i++) {
        for (let j = 0; j < this.checkGroup.length; j++) {
          if (this.checkGroup[j] === this.formGroup[i].name) {
            arr.push(this.formGroup[i]);
          }
        }
      }
      this.$emit('refresh', this.itemType, arr);
      this.close();
    },
    // 取消按钮zhen
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
