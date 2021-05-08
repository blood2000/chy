<template>
  <el-dialog :visible="visible" :title="title" :class="[{'i-add':title==='新增'}]" width="800px" :close-on-click-modal="false" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item v-if="title==='新增'" label="类型编码" prop="typeCode">
        <el-input v-model="form.typeCode" placeholder="请输入类型编码" class="width90" clearable />
      </el-form-item>
      <el-form-item label="类型名称" prop="typeName">
        <el-input v-model="form.typeName" placeholder="请输入类型名称" class="width90" clearable />
      </el-form-item>
      <!-- <el-form-item label="类型" prop="typeForm">
        <el-select v-model="form.typeForm" placeholder="请选择类型" filterable clearable class="width90">
          <el-option
            v-for="dict in typeFormOptions"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item> -->
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addParamTree, editParamTree } from '@/api/system/param';

export default {
  name: 'ParamDialog',
  props: {
    open: Boolean,
    title: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      buttonLoading: false,
      typeFormOptions: [
        { dictLabel: '系统内置', dictValue: 1 },
        { dictLabel: '业务开关', dictValue: 2 }
      ],
      form: {},
      rules: {
        typeCode: [
          { required: true, message: '类型编码不能为空', trigger: 'blur' }
        ],
        typeName: [
          { required: true, message: '类型名称不能为空', trigger: 'blur' }
        ]
      }
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
  methods: {
    // 取消按钮
    cancel() {
      this.close();
    },
    // 关闭弹窗
    close() {
      this.$emit('update:open', false);
    },
    // 重置弹窗
    reset() {
      this.form = {
        id: undefined,
        typeName: undefined,
        pid: undefined,
        typeCode: undefined,
        typeForm: undefined
      };
      this.resetForm('form');
    },
    // 弹窗赋值
    setAddForm(data) {
      this.form.pid = data.id;
      this.form.typeForm = 2; // 默认类型是业务开关
    },
    setEditForm(data) {
      this.form.id = data.id;
      this.form.typeName = data.label;
    },
    // 提交
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.id) {
            editParamTree(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh');
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            addParamTree(this.form).then(response => {
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
    }
  }
};
</script>

<style lang="scss" scoped>
.width90{
  width: 90%;
}
</style>
