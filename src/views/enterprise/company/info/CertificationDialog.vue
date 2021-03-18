<template>
  <el-dialog title="货主/企业认证" :visible="visible" width="800px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px">
      <el-form-item label="网商汇款账号" prop="name1">
        <el-input v-model="form.name1" class="width90" clearable />
      </el-form-item>
      <el-form-item label="手机号码" prop="name">
        <el-input v-model="form.name" class="width90" clearable />
      </el-form-item>
      <el-form-item label="联系人" prop="name">
        <el-input v-model="form.name" class="width90" clearable />
      </el-form-item>
      <el-form-item label="身份证" prop="name">
        <el-input v-model="form.name" class="width90" clearable />
      </el-form-item>
      <el-form-item label="公司名称" prop="name">
        <el-input v-model="form.name" class="width90" clearable />
      </el-form-item>
      <el-form-item label="统一社会信用代码" prop="name">
        <el-input v-model="form.name" class="width90" clearable />
      </el-form-item>

      <!-- 选择省/市/区 -->
      <province-city-county
        ref="ChooseArea"
        :visible="visible"
        :prop-province-code="form.provinceCode"
        :prop-city-code="form.cityCode"
        :prop-county-code="form.countyCode"
        @refresh="(data) => {
          form.provinceCode = data.provinceCode;
          form.cityCode = data.cityCode;
          form.countyCode = data.countyCode;
        }"
      />

      <el-form-item label="详细地址" prop="name">
        <el-input v-model="form.name" class="width90" clearable />
      </el-form-item>
      <el-form-item>
        <el-row>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">身份证正面照</p>
            <upload-image :value="form.name" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">身份证反面照</p>
            <upload-image :value="form.name" />
          </el-col>
          <el-col :span="7" class="mb">
            <p class="upload-image-label">本人手持身份证正面</p>
            <upload-image :value="form.name" />
          </el-col>
          <el-col :span="7">
            <p class="upload-image-label">统一社会信用代码照片</p>
            <upload-image :value="form.name" />
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {} from '@/api/enterprise/company/info';
import UploadImage from '@/components/UploadImage/index';
import ProvinceCityCounty from '@/components/ProvinceCityCounty';

export default {
  components: {
    UploadImage,
    ProvinceCityCounty
  },
  props: {
    open: Boolean
  },
  data() {
    return {
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        name: [
          { required: true, trigger: 'blur', message: '不能为空' }
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
  create() {

  },
  methods: {
    // 提交按钮
    submitForm: function() {
      const flag = this.$refs.ChooseArea.submit();
      this.$refs['form'].validate(valid => {
        if (valid && flag) {
          this.msgSuccess('修改成功');
          this.close();
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

      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm() {
      this.form = {

      };
    }
  }
};
</script>

<style lang="scss" scoped>
.width90{
  width: 90%;
}
</style>
