<template>
  <!-- 添加或修改运输异常对话框 -->
  <el-dialog :title="title" :visible="visible" width="800px" append-to-body destroy-on-close @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="130px">
      <el-form-item label="货源单号" prop="mainOrderNumber">
        <el-input v-model="form.mainOrderNumber" placeholder="请输入货源单号" :disabled="formDisable" class="width90" />
      </el-form-item>
      <el-form-item label="运输单号" prop="waybillNo">
        <el-input v-model="form.waybillNo" placeholder="请输入运输单号" :disabled="formDisable" class="width90" />
      </el-form-item>
      <el-form-item label="司机姓名" prop="driverName">
        <el-input v-model="form.driverName" placeholder="请输入司机姓名" :disabled="formDisable" class="width90" />
      </el-form-item>
      <el-form-item label="司机手机" prop="driverPhone">
        <el-input v-model="form.driverPhone" placeholder="请输入司机手机" :disabled="formDisable" class="width90" />
      </el-form-item>
      <el-form-item label="货主姓名" prop="shipperName">
        <el-input v-model="form.shipperName" placeholder="请输入货主姓名" :disabled="formDisable" class="width90" />
      </el-form-item>
      <el-form-item label="货主手机" prop="shipperPhone">
        <el-input v-model="form.shipperPhone" placeholder="请输入货主手机" :disabled="formDisable" class="width90" />
      </el-form-item>

      <el-divider v-if=" form.attachmentCodes " content-position="left"><span class="supplement-title">照片</span></el-divider>

      <el-form-item prop="attachmentCodes">
        <el-row :gutter="20">
          <el-col v-for="(images, index) in imageList" :key="index" :span="6">
            <el-image
              style="width: 150px; height: 150px"
              :src="images.url"
              :fit="cover"
            />
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item label="投诉说明" prop="description">
        <el-input v-model="form.description" type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="请输入投诉说明" :disabled="formDisable" class="width90" />
      </el-form-item>
      <el-form-item label="罚款金额" prop="penalty">
        <el-input-number v-model="form.penalty" placeholder="请输入罚款金额" :precision="2" :disabled="disable" controls-position="right" :min="0" :max="9999999" class="width90" />
      </el-form-item>
      <el-form-item label="处理结果" prop="handleResult">
        <el-input v-model="form.handleResult" type="textarea" :autosize="{ minRows: 3, maxRows: 4}" placeholder="请输入处理结果" :disabled="disable" class="width90" />
      </el-form-item>

    </el-form>
    <div slot="footer" class="dialog-footer" :class=" disable === true ?'display':''">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { handleComplaint } from '@/api/waybill/complaint';
import { getFile } from '@/api/system/image';

export default {
  components: {
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
      imageList: [],
      formDisable: true,
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        handleResult: [
          { required: true, message: '处理结果不能为空', trigger: 'blur' }
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
          handleComplaint(this.form).then(response => {
            this.msgSuccess('处理成功');
            this.close();
            this.$emit('refresh');
          });
        }
      });
    },
    // 取消按钮
    cancel() {
      this.close();
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        code: null,
        mainOrderNumber: null,
        waybillNo: null,
        waybillCode: null,
        driverName: null,
        driverPhone: null,
        shipperName: null,
        shipperPhone: null,
        attachmentCodes: null,
        description: null,
        penalty: null,
        handleResult: null
      };
      this.imageList = [];
      this.resetForm('form');
    },
    // 关闭弹窗
    close() {
	    this.$emit('update:open', false);
      // this.$emit('refresh');
    },
    // 表单赋值
    setForm(data) {
	    this.form = data;
      getFile(this.form.attachmentCodes).then(response => {
        this.imageList = response.data.map(function(res) {
          return { url: res.attachUrl, code: res.code };
        });
      });
    }
  }
};
</script>

<style scoped>
	.mr3{
	  margin-right: 3%;
	}
	.width90{
	  width: 90% !important;
	}
	.width28{
	  width: 28%;
	}
	.el-input-number ::v-deep.el-input__inner{
	  text-align: left;
	}
  .el-radio{
    line-height: 36px !important;
  }
  .supplement-title{
    font-size: 18px;
  }
  .display{
    display: none;
  }
</style>
