<template>
  <!-- 评价对话框 -->
  <el-dialog :title="title" :visible="visible" width="1400px" append-to-body @close="cancel">
    <RefactorTable :loading="loading" :data="commentlist" :table-columns-config="tableColumnsConfig"><!-- @selection-change="handleSelectionChange" -->
      <!-- <template #lastLoadingTime="{row}">
        <span>{{ parseTime(row.lastLoadingTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <template #orderTime="{row}">
        <span>{{ parseTime(row.orderTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <template #receiveTime="{row}">
        <span>{{ parseTime(row.receiveTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template>
      <template #wayBillUpdateTime="{row}">
        <span>{{ parseTime(row.wayBillUpdateTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
      </template> -->

      <template #comment="{row}">
        <el-input v-model="row.comment" placeholder="请输入评价内容" clearable />
      </template>
      <template #score="{row}">
        <el-rate v-model="row.score" show-score allow-half text-color="#ff9900" />
      </template>
    </RefactorTable>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">立即评价</el-button>
      <el-button @click="cancel">返回</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { childListApi, childList } from '@/api/settlement/adjust';
// import UploadImage from '@/components/UploadImage/index';

export default {
  name: 'ChildDialog',
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
      tableColumnsConfig: [],
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 评价列表
      commentlist: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        wayBillCode: null
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
      prop: 'comment',
      isShow: true,
      label: '评价内容',
      width: 240,
      fixed: 'right'
    }, {
      prop: 'score',
      isShow: true,
      label: '评分星级',
      width: 150,
      fixed: 'right'
    });
  },
  methods: {
    /** 提交按钮 */
    submitForm() {
      console.log('点击');
    },
    /** 查询评价列表 */
    getList() {
      this.loading = true;
      childList(this.queryParams).then(response => {
        console.log(response);
        this.commentlist = response.rows;
        this.total = response.total;
        this.loading = false;
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
      this.queryParams.wayBillCode = data.wayBillCode;
      this.getList();
    },
    // 查看运单详情
    handleWaybill(row) {
      this.$refs.DetailDialog.reset();
      this.currentId = row.wayBillCode;
      this.opendetail = true;
      this.detailtitle = '运输单信息';
      this.formDisable = true;
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
