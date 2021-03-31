<template>
  <el-dialog :title="title" :visible="visible" width="1200px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="司机实收现金">
        <el-input v-model="form.name" readonly class="input-width" clearable />
      </el-form-item>
    </el-form>
    <el-button
      type="primary"
      icon="el-icon-plus"
      size="mini"
      class="fr mb10"
      @click="handleAdd"
    >新增</el-button>
    <el-table :data="infoList">
      <el-table-column label="序号" type="index" min-width="5%" />
      <el-table-column label="支付批次号" align="center" prop="name">
        <template scope="scope">
          <el-input v-model="scope.row.name" size="small" clearable />
        </template>
      </el-table-column>
      <el-table-column label="支付金额" align="center" prop="name">
        <template scope="scope">
          <el-input v-model="scope.row.name" size="small" clearable />
        </template>
      </el-table-column>
      <el-table-column label="上传回单" align="center">
        <template scope="scope">
          <upload-image v-model="scope.row.name" />
        </template>
      </el-table-column>
      <el-table-column label="删除" align="center">
        <template scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row, scope.$index)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">保 存</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
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
      infoList: [{
        name: 'http://third-image.oss-cn-hangzhou.aliyuncs.com/6f5d123880c848948cf3e2ae64602aac.png'
      }]
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
  watch: {
    open(val) {
      if (val) {
        this.getBatch();
      }
    }
  },
  methods: {
    /** 查询批次号 */
    getBatch() {

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
        name: null
      };
      this.resetForm('form');
    },
    // 新增按钮
    handleAdd() {
      this.infoList.push({});
    },
    // 删除按钮
    handleDelete(row, index) {
      if (this.infoList.length <= 1) {
        this.$message({ showClose: true, message: '请保留至少一条信息', type: 'warning' });
        return;
      }
      this.infoList.splice(index, 1);
    },
    // 保存
    submitForm() {
      console.log(this.infoList);
    }
  }
};
</script>

<style scoped>
.input-width{
  width: 400px;
}
</style>
