<template>
    <el-dialog :visible="visible" :title="`${dictName} - ${title}`" :class="[{'i-add':title==='新增'}]" width="800px" :close-on-click-modal="false" append-to-body @close="cancel">
        <el-form ref="form" :model="form" :rules="rules" label-width="140px">
            <el-form-item label="名称" prop="mediaTitle">
                <el-input v-model="form.mediaTitle" placeholder="请输入名称" class="width90" clearable />
            </el-form-item>
            <el-form-item label="地址" prop="mediaUrl">
                <el-input v-model="form.mediaUrl" placeholder="请输入地址(URL)" class="width90" clearable />
            </el-form-item>
            <el-form-item label="类型" prop="mediaType">
                <el-select v-model="form.mediaType" placeholder="请选择类型" filterable clearable class="width90">
                    <el-option
                            v-for="dict in mediaTypeOptions"
                            :key="dict.dictValue"
                            :label="dict.dictLabel"
                            :value="dict.dictValue"
                    />
                </el-select>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { addMediaInfo, editMediaInfo, getMediaInfo } from '@/api/system/media';

export default {
  name: 'InfoDialog',
  props: {
    open: Boolean,
    title: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      dictName: null,
      buttonLoading: false,
      // 状态字典
      mediaTypeOptions: [
        { dictLabel: 'pdf', dictValue: 'pdf' },
        { dictLabel: '文档', dictValue: 'word' },
        { dictLabel: '图片', dictValue: 'image' },
        { dictLabel: '音频', dictValue: 'vedio' }
      ],
      form: {},
      rules: {
        mediaTitle: [
          { required: true, message: '参数地址不能为空', trigger: 'blur' }
        ],
        mediaUrl: [
          { required: true, message: '参数地址不能为空', trigger: 'blur' }
        ],
        mediaType: [
          { required: true, message: '类型不能为空', trigger: 'change' }
        ]
      },
      // 字典远程搜索
      loading: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        dictName: null
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
  created() {
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
        mediaCode: undefined,
        dictName: undefined,
        dictCode: undefined,
        mediaTitle: undefined,
        mediaUrl: undefined,
        mediaType: undefined,
        status: 0
      };
      this.resetForm('form');
    },
    // 弹窗赋值
    setAddForm(data) {
      this.dictName = data.dictName;
      this.form.dictCode = data.dictCode;
    },
    setEditForm(data) {
      if (data) {
        getMediaInfo(data).then(response => {
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
          if (this.form.mediaCode) {
            editMediaInfo(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('修改成功');
              this.close();
              this.$emit('refresh', this.form.dictCode);
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            addMediaInfo(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('新增成功');
              this.close();
              this.$emit('refresh', this.form.dictCode);
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
