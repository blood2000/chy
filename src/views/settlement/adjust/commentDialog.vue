<template>
  <!-- 评价对话框 -->
  <el-dialog class="i-comment" :title="title" :visible="visible" width="1400px" append-to-body @close="cancel">
    <el-table v-loading="loading" :data="commentlist" border stripe>
      <el-table-column type="index" label="序号" align="center" width="50" />
      <el-table-column width="150" label="运输单号" align="center" prop="waybillNo" />
      <el-table-column width="120" label="车牌号" align="center" prop="licenseNumber" />
      <el-table-column width="100" label="司机" align="center" prop="driverName" />
      <el-table-column width="120" label="司机电话" align="center" prop="driverPhone" />
      <el-table-column width="180" label="装货地" align="center" prop="loadAddress" show-overflow-tooltip />
      <el-table-column width="180" label="卸货地" align="center" prop="unloadAddress" show-overflow-tooltip />
      <el-table-column width="100" label="装货重量" align="center" prop="loadWeight" />
      <el-table-column width="100" label="卸货重量" align="center" prop="unloadWeight" />
      <el-table-column width="280" label="评价内容" align="center" fixed="right" prop="content">
        <template #default="scope">
          <el-input v-model="scope.row.content" placeholder="请输入评价内容" clearable />
        </template>
      </el-table-column>
      <el-table-column width="180" label="评分" align="center" fixed="right" prop="score">
        <template #default="scope">
          <el-rate v-model="scope.row.score" show-score allow-half text-color="#FFBB00" />
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">保存</el-button>
      <el-button @click="cancel">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { batchAdd } from '@/api/settlement/adjust';
// import UploadImage from '@/components/UploadImage/index';

export default {
  name: 'CommentDialog',
  components: {
    // UploadImage
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    open: Boolean
    // disable: Boolean
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 评价列表
      commentlist: [],
      batchBo: {
        batchList: []
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
      this.batchBo.batchList = this.commentlist.map(function(res) {
        return { content: res.content, score: res.score, waybillCode: res.wayBillCode };
      });
      console.log(this.batchBo);
      batchAdd(this.batchBo).then(response => {
        this.$message({ type: 'success', message: '批量评价成功！' });
        this.close();
        this.$emit('refresh');
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
        waybillCode: null,
        rebutRemark: null
      };
      this.resetForm('form');
    },
    // 获取列表
    setForm(data) {
      console.log(data);
      this.commentlist = data;
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
