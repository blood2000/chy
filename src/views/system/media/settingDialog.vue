<template>
  <el-dialog :visible="visible" :title="title" :class="[{'i-add':title==='新增'}]" width="800px" :close-on-click-modal="false" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="类型名称" prop="dictName">
        <el-input v-model="form.dictName" placeholder="请输入类型名称" class="width90" clearable />
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getMediaType, addMediaTypeTree, editMediaTypeTree } from '@/api/system/media';

export default {
  name: 'MediaDialog',
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
        { dictLabel: 'mp3', dictValue: 'mp3' },
        { dictLabel: 'mp4', dictValue: 'mp4' },
        { dictLabel: 'word', dictValue: 'word' },
        { dictLabel: 'pdf', dictValue: 'pdf' },
        { dictLabel: '图片', dictValue: 'img' }
      ],
      form: {},
      rules: {
        dictName: [
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
        dictCode: undefined,
        dictName: undefined,
        dictPCode: undefined
      };
      this.resetForm('form');
    },
    // 弹窗赋值
    setAddForm(data) {
      this.form.dictPCode = data.code;
    },
    setEditForm(data) {
      if (data.code) {
        getMediaType(data.code).then(response => {
          this.form = response.data;
        }).catch(() => {
        });
      }
    },
    // 提交
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.dictCode) {
            editMediaTypeTree(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh');
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            addMediaTypeTree(this.form).then(response => {
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
