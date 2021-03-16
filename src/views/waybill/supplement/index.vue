<template>
  <el-tabs type="border-card">
    <el-tab-pane label="运单补录" style="padding:0 30px;">
      <div class="container">
        <el-form ref="form" :model="form" :rules="rules" label-width="140px">
          <el-divider content-position="left"><span class="supplement-title">货源信息</span></el-divider>
          <el-row>
            <el-col :span="8">
              <el-form-item label="货源单号" prop="waybillCode">
                <el-input v-model="form.waybillCode" placeholder="请输入货源单号" class="width90" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="货物名称" prop="waybillCode">
                <el-input v-model="form.waybillCode" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运费单价" prop="waybillCode">
                <el-input v-model="form.waybillCode" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="剩余车数" prop="waybillCode">
                <el-input v-model="form.waybillCode" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="装货地址" prop="waybillCode">
                <el-input v-model="form.waybillCode" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="卸货地址" prop="waybillCode">
                <el-input v-model="form.waybillCode" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider content-position="left"><span class="supplement-title">承运车辆</span></el-divider>
          <el-row>
            <el-col :span="8">
              <el-form-item label="车牌号" prop="waybillCode">
                <el-input v-model="form.waybillCode" placeholder="请输入车牌号" class="width90" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运输许可证" prop="waybillCode">
                <el-input v-model="form.waybillCode" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="车辆载重" prop="waybillCode">
                <el-input v-model="form.waybillCode" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="车辆代码" prop="waybillCode">
                <el-input v-model="form.waybillCode" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider content-position="left"><span class="supplement-title">运单信息</span></el-divider>
          <el-row>
            <el-col :span="8">
              <el-form-item label="装车时间" prop="warningTime">
                <el-date-picker
                  v-model="form.warningTime"
                  clearable
                  size="small"
                  class="width90"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择装车时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="卸车时间" prop="warningTime">
                <el-date-picker
                  v-model="form.warningTime"
                  clearable
                  size="small"
                  class="width90"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择卸车时间"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运单重量" prop="waybillCode">
                <el-input v-model="form.waybillCode" placeholder="请输入运单重量" class="width90" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="运单总价" prop="waybillCode">
                <el-input v-model="form.waybillCode" placeholder="请输入运单总价" class="width90" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运输许可证" prop="waybillCode">
                <el-input v-model="form.waybillCode" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="运输单号" prop="waybillCode">
                <el-input v-model="form.waybillCode" :readonly="true" class="width90" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="装货单据">
                <uploadImage v-model="form.identificationBackImage" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="卸货单据/回执单">
                <uploadImage v-model="form.identificationBackImage" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-row>
          <el-col :span="2" :offset="11">
            <el-button type="primary" @click="submitForm">确 定</el-button>
          </el-col>
        </el-row>
      </div>
    </el-tab-pane>

    <el-tab-pane label="批量补录">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="info"
            icon="el-icon-upload2"
            size="mini"
            @click="handleWaybillImport"
          >运输单批量导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['waybill:abnormal:edit']"
            type="warning"
            icon="el-icon-upload2"
            size="mini"
            @click="handlePictureImport"
          >装/卸货图片导入</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            icon="el-icon-download"
            size="mini"
            @click="handleDownload"
          >下载模板</el-button>
        </el-col>
      </el-row>
    </el-tab-pane>

    <!-- 运输单批量导入 对话框 -->
    <waybillimport-dialog ref="WaybillimportDialog" :title="title" :open.sync="openImport" />
    <!-- 装/卸货图片导入 对话框 -->
    <pictureimport-dialog ref="PictureimportDialog" :title="title" :open.sync="open" />
  </el-tabs>
</template>

<script>
import { updateAbnormal, addAbnormal } from '@/api/waybill/abnormal';
import UploadImage from '@/components/UploadImage/index';
import WaybillimportDialog from './waybillimportDialog';
import PictureimportDialog from './pictureimportDialog';

export default {
  components: {
    UploadImage,
    WaybillimportDialog,
    PictureimportDialog
  },
  data() {
    return {
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      openImport: false,
      // 表单参数
      form: {
      },
      // 表单校验
      rules: {
        description: [
          { required: true, message: '异常说明不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
  },
  created() {
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.waybillCode != null) {
            updateAbnormal(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.close();
              this.getList();
            });
          } else {
            addAbnormal(this.form).then(response => {
              this.msgSuccess('新增成功');
              this.close();
              this.getList();
            });
          }
        }
      });
    },
    // 表单重置
    reset() {
      this.form = {
        waybillCode: null,
        isWarning: null,
        warningTime: null,
        isDel: null,
        createCode: null,
        createTime: null,
        updateCode: null,
        updateTime: null,
        description: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
	    this.form = data;
    },
    /** 运输单批量导入按钮操作 */
    handleWaybillImport() {
      this.openImport = true;
      this.title = '运输单批量导入';
    },
    /** 装/卸货图片导入按钮操作 */
    handlePictureImport() {
      this.open = true;
      this.title = '装/卸货图片导入';
    },
    /** 下载模板 */
    handleDownload() {
      console.log('点击了下载模板按钮');
    //   this.download('assets/driver/importTemplate', {}, `driver_${new Date().getTime()}.xlsx`);
    }
  }
};
</script>

<style>
.container {
  overflow-y: auto;
  height: calc(100vh - 201px);
}
.supplement-title{
    font-size: 18px;
}
.width90{
	width: 90% !important;
}
</style>
