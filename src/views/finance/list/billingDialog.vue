<template>
  <!-- 开票对话框 -->
  <el-dialog :title="title" :visible="visible" width="1400px" append-to-body @close="cancel">
    <RefactorTable :loading="loading" :data="billlist" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
      <!-- <template #lastLoadingTime="{row}">
        <span>{{ parseTime(row.lastLoadingTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template> -->

      <template #edit="{row}">
        <el-button
          size="mini"
          type="text"
          icon="el-icon-document"
          @click="handleWaybill(row)"
        >详情</el-button>
      </template>
    </RefactorTable>
    <el-form ref="form" :model="form" :rules="rules" :disabled="disable" label-width="130px">
      <el-form-item v-if="disable" label="发票号码" prop="loadInfo">
        <el-input v-model="form.loadInfo" placeholder="请输入发票号码" clearable size="small" style="width:90%;" />
      </el-form-item>
      <el-form-item label="发票图片">
        <uploadImage v-model="form.vehicleImage" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即提交</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { childListApi, childList } from '@/api/settlement/adjust';
import { reject } from '@/api/waybill/tracklist';
import UploadImage from '@/components/UploadImage/index';

export default {
  name: 'RejectDialog',
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
      tableColumnsConfig: [],
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 发票列表
      billlist: {
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        wayBillCode: null
      },
      // 审核结果字典
      auditResultOptions: [
        { 'dictLabel': '审核通过', 'dictValue': '0' },
        { 'dictLabel': '审核不通过', 'dictValue': '1' }
      ],
      // 表单参数
      form: {
        wayBillInCode: null,
        driverApplyRemark: null
      },
      // 表单校验
      rules: {
        // goodsBigType: [
        //   { required: true, message: '请选择审核结果', trigger: 'blur' }
        // ]
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
    this.tableHeaderConfig(this.tableColumnsConfig, childListApi, {
      prop: 'edit',
      isShow: true,
      label: '操作',
      width: 100,
      fixed: 'right'
    });
  },
  methods: {
    /** 查询发票列表 */
    getList() {
      this.loading = true;
      childList(this.queryParams).then(response => {
        this.childlist = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          reject(this.form).then(response => {
            this.msgSuccess('申请取消运单成功');
            this.close();
            this.$emit('refresh');
          });
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
      this.form = {
        wayBillInCode: null,
        driverApplyRemark: null
      };
      this.resetForm('form');
    },
    // 表单赋值
    setForm(data) {
      this.queryParams.wayBillCode = data.code;
      this.getList();
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
