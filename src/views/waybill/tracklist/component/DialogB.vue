<template>
  <!-- 添加或修改调度者对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="80px">
      <el-form-item label="运输单号" prop="tin1">
        <el-input v-model="form.tin1" class="width90" disabled />
      </el-form-item>
      <el-form-item label="服务态度" prop="tin4">
        <el-rate v-model="form.tin4" allow-half />
      </el-form-item>
      <el-form-item label="运输速度" prop="tin5">
        <el-rate v-model="form.tin5" allow-half />
      </el-form-item>
      <el-form-item label="运输安全" prop="tin6">
        <el-rate v-model="form.tin6" allow-half />
      </el-form-item>
      <el-form-item label="满意度" prop="tin7">
        <el-rate v-model="form.tin7" allow-half />
      </el-form-item>

      <el-form-item label="是否异常" prop="tin8">
        <el-checkbox v-model="form.tin8">如有异常请勾选</el-checkbox>
      </el-form-item>

      <template v-if="form.tin8">
        <el-form-item label="异常内容" prop="tin9">
          <el-input
            v-model="form.tin9"
            class="width90"
            type="textarea"
            :rows="2"
            placeholder="请输入异常内容"
          />
        </el-form-item>
        <!-- 多图框 -->
        <el-form-item label="照片" prop="tin2">
          <div class="ly-flex">
            <div
              v-for="(item, index) in form.tin2"
              :key="index"
              class="mr5 ml5"
            >
              <uploadImage v-model="item.url" @input="handleUploadSuccess" />
            </div>
          </div>
        </el-form-item>
      </template>

      <el-form-item label="评价内容" prop="tin10">
        <el-input
          v-model="form.tin10"
          class="width90"
          type="textarea"
          :rows="2"
          placeholder="请输入评价内容"
        />
      </el-form-item>

      <!-- 多图框 -->
      <el-form-item label="照片" prop="tin2">
        <div class="ly-flex">
          <div
            v-for="(item, index) in form.tin2"
            :key="index"
            class="mr5 ml5"
          >
            <uploadImage v-model="item.url" @input="handleUploadSuccess" />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="投诉说明" prop="tin3">
        <el-input
          v-model="form.tin3"
          class="width90"
          type="textarea"
          :rows="2"
          placeholder="请输入投诉说明内容"
        />
      </el-form-item>


    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即提交</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { addInfo, updateInfo } from '@/api/assets/team';
import UploadImage from '@/components/UploadImage/index';

export default {
  name: 'DialogA',
  components: {
    UploadImage
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean,
    disable: Boolean
  },
  data() {
    return {
      // 表单参数
      form: {
        tin1: undefined,
        tin2: [
          { url: '' }
        ],
        tin3: undefined,

        tin4: undefined,
        tin5: undefined,
        tin6: undefined,
        tin7: undefined,
        tin8: undefined,
        tin9: undefined,
        tin10: undefined
      },
      // 表单校验
      rules: {

        tin3: [
          { required: true, message: '请输入投诉说明内容', trigger: 'blur' }
        ],
        tin9: [
          { required: true, message: '请输入异常内容', trigger: 'blur' }
        ],
        tin10: [
          { required: true, message: '请输入评价内容', trigger: 'blur' }
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
  created() {

  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          console.log(this.form);

          // if (this.form.id != null) {
          //   updateInfo(this.form).then(response => {
          //     this.msgSuccess('修改成功');
          //     this.close();
          //     this.$emit('refresh');
          //   });
          // } else {
          //   addInfo(this.form).then(response => {
          //     this.msgSuccess('新增成功');
          //     this.close();
          //     this.$emit('refresh');
          //   });
          // }
        }
      });
    },
    /** 取消按钮 */
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
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.form = data;
    },

    // 图片上传成功会掉
    handleUploadSuccess() {
      console.log('添加图片成功 动态加一项');
    }
  }
};
</script>

<style>
.mr3 {
  margin-right: 3%;
}
.width90 {
  width: 90%;
}
.width28 {
  width: 28%;
}
.el-input-number ::v-deep.el-input__inner {
  text-align: left;
}
</style>

