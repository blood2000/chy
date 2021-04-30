<template>
  <!-- 修改批次号（该页面逻辑暂时不确定） -->
  <el-dialog :title="title" :visible="visible" width="1200px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="司机实收现金" prop="amount">
        <el-input v-model="form.amount" readonly class="input-width" clearable />
      </el-form-item>
    </el-form>
    <!-- <el-button
      type="primary"
      icon="el-icon-plus"
      size="mini"
      class="fr mb10"
      @click="handleAdd"
    >新增</el-button> -->
    <el-table :data="infoList">
      <el-table-column label="序号" align="center" type="index" min-width="5%" />
      <el-table-column label="支付批次号" align="center" prop="bizNo">
        <template scope="scope">
          <el-input v-model="scope.row.bizNo" size="small" clearable />
        </template>
      </el-table-column>
      <!-- 金额暂时不可修改 -->
      <el-table-column label="支付金额" align="center" prop="amount">
        <template scope="scope">
          <el-input v-model="scope.row.amount" readonly size="small" clearable />
        </template>
      </el-table-column>
      <el-table-column label="上传回单" align="center" prop="payReceiptImg">
        <template scope="scope">
          <upload-image v-model="scope.row.payReceiptImg" />
        </template>
      </el-table-column>
      <!-- <el-table-column label="删除" align="center">
        <template scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row, scope.$index)"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">保 存</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { editBzno } from '@/api/capital/payrecord';
import UploadImage from '@/components/UploadImage/index';

export default {
  components: {
    UploadImage
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
  },
  data() {
    return {
      // 表单参数
      form: {},
      // 表格数据
      infoList: []
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
        amount: null
      };
      this.infoList = [];
      this.resetForm('form');
    },
    // 表单赋值
    setForm(row) {
      this.form = row;
      let bizNoArr = [];
      let payReceiptImgArr = [];
      // 批次号
      if (this.form.bizNo.indexOf(',') !== -1) {
        bizNoArr = this.form.bizNo.split(',');
      } else {
        bizNoArr.push(this.form.bizNo);
      }
      // 回单
      if (this.form.bizNo.indexOf(',') !== -1) {
        payReceiptImgArr = this.form.payReceiptImg.split(',');
      } else {
        payReceiptImgArr.push(this.form.payReceiptImg);
      }
      // 构造列表数据
      bizNoArr.forEach((el, index) => {
        this.infoList.push({
          bizNo: el,
          amount: this.form.amount, // 金额暂时用同一个
          payReceiptImg: payReceiptImgArr[index] ? payReceiptImgArr[index] : ''
        });
      });
    },
    // 新增按钮
    handleAdd() {
      this.infoList.push({
        bizNo: '',
        amount: this.form.amount, // 金额暂时用同一个
        payReceiptImg: ''
      });
    },
    // 删除按钮
    handleDelete(row, index) {
      if (this.infoList.length <= 1) {
        this.msgWarning('请保留至少一条信息');
        return;
      }
      this.infoList.splice(index, 1);
    },
    // 保存
    submitForm() {
      const bizNoArr = [];
      const payReceiptImgArr = [];
      this.infoList.forEach(el => {
        if (el.bizNo !== '') bizNoArr.push(el.bizNo);
        if (el.payReceiptImg !== '') payReceiptImgArr.push(el.payReceiptImg);
      });
      // 构造参数
      const params = {
        id: this.form.id,
        amount: this.form.amount, // 金额暂时用同一个
        bizNo: bizNoArr.join(','),
        payReceiptImg: payReceiptImgArr.join(',')
      };
      editBzno(params).then(response => {
        this.msgSuccess('修改成功');
        this.cancel();
        this.$emit('refresh');
      });
    }
  }
};
</script>

<style scoped>
.input-width{
  width: 400px;
}
</style>
