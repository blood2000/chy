<template>
  <el-dialog :visible="visible" title="字典管理" width="1000px" :close-on-click-modal="false" append-to-body @close="selfCancel">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <!-- <el-col :span="1.5">
        <el-button
          type="success"
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col> -->
      <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
    </el-row>

    <el-table v-loading="loading" highlight-current-row border :data="dataList" @selection-change="handleSelectionChange">
      <!-- <el-table-column type="selection" width="55" align="center" /> -->
      <el-table-column label="序号" align="center" fixed="left" type="index" min-width="5%" />
      <el-table-column label="选项名" align="center" prop="optionName" />
      <el-table-column label="选项值" align="center" prop="optionValue" />
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="left" width="160">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改设备字典字段对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" style="width: 98%">
        <el-form-item label="选项名" prop="optionName">
          <el-input v-model="form.optionName" placeholder="请输入选项名" clearable />
        </el-form-item>
        <el-form-item label="选项值" prop="optionValue">
          <el-input v-model="form.optionValue" placeholder="请输入选项值" clearable />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
import { getDeviceFieldOptionList, addDeviceFieldOption, updateDeviceFieldOption, getDeviceFieldOptionDetail, delDriverFieldOption } from '@/api/assets/device.js';
export default {
  name: 'SetOptionDialog',
  props: {
    selfOpen: Boolean,
    fieldCode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      names: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      dataList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 新增/编辑
      title: '',
      open: false,
      buttonLoading: false,
      form: {},
      rules: {
        optionName: [
          { required: true, message: '选项名不能为空', trigger: 'blur' }
        ],
        optionValue: [
          { required: true, message: '选项值不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    visible: {
      get() {
        return this.selfOpen;
      },
      set(v) {
        this.$emit('update:selfOpen', v);
      }
    }
  },
  watch: {
    selfOpen(val) {
      if (val) {
        this.queryParams.pageNum = 1;
        this.getList();
      }
    }
  },
  methods: {
    // 取消按钮
    selfCancel() {
      this.selfClose();
    },
    // 关闭弹窗
    selfClose() {
      this.$emit('update:selfOpen', false);
    },
    getList() {
      this.loading = true;
      getDeviceFieldOptionList(Object.assign({}, this.queryParams, { fieldCode: this.fieldCode })).then((response) => {
        this.dataList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.code);
      this.names = selection.map(item => item.optionName);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = '添加字典字段';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ids = row.code || this.ids;
      getDeviceFieldOptionDetail(ids).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改字典字段';
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.code || this.ids;
      const names = row.optionName || this.names;
      this.$confirm('是否确认删除字典字段名称为"' + names + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delDriverFieldOption(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.code !== undefined) {
            updateDeviceFieldOption(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            this.form.fieldCode = this.fieldCode;
            addDeviceFieldOption(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('新增成功');
              this.open = false;
              this.getList();
            }).catch(() => {
              this.buttonLoading = false;
            });
          }
        }
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        code: undefined,
        fieldCode: undefined,
        mappingValue: undefined,
        optionName: undefined,
        optionValue: undefined
      };
      this.resetForm('form');
    }
  }
};
</script>
