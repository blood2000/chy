<template>
    <div class="app-container">
        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                        type="primary"
                        icon="el-icon-plus"
                        size="mini"
                        @click="handleAdd"
                >新增</el-button>
            </el-col>
        </el-row>
        <el-table v-loading="loading" highlight-current-row border :data="dataList">
            <el-table-column label="厂商" align="center" prop="vendorName" />
            <el-table-column label="车牌号" align="center" prop="licenseNumber" />
            <el-table-column label="设备IMEI" align="center" prop="deviceImei" />
            <el-table-column label="创建时间" align="center" prop="createTime">
                <template slot-scope="scope">
                    <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
                </template>
            </el-table-column>
            <el-table-column v-if="vehicleCode" label="操作" align="center" fixed="left" prop="edit">
                <template slot-scope="scope">
                    <el-button
                            size="mini"
                            type="text"
                            @click="handleEdit(scope.row)"
                    >编辑</el-button>
                    <el-button
                            size="mini"
                            type="text"
                            @click="handleDel(scope.row)"
                    >删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="车牌号">
                            <el-input v-model="nowLicenseNumber" disabled />
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="设备厂商" prop="vendorCode">
                            <el-select v-model="form.vendorCode" placeholder="请选择" clearable filterable style="width: 100%">
                                <el-option
                                        v-for="dict in deviceVendorOptions"
                                        :key="dict.dictValue"
                                        :label="dict.dictLabel"
                                        :value="dict.dictValue"
                                />
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="设备IMEI码" prop="deviceImei">
                            <el-input v-model="form.deviceImei" placeholder="请输入设备IMEI码" />
                        </el-form-item>
                    </el-col>
                </el-row>
                <div class="dialog-footer" style="float: right">
                    <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { listDevice, addDevice, updateDevice, delDevice, getDevice } from '@/api/assets/vehicleDevice';
export default {
  props: {
    vehicleCode: {
      type: String,
      default: null
    },
    licenseNumber: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      loading: true,
      dataList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        vehicleCode: undefined
      },
      form: {
        licenseNumber: undefined,
        vendorCode: undefined,
        vehicleCode: undefined,
        deviceImei: undefined
      },
      open: false,
      title: '',
      deviceVendorOptions: [],
      buttonLoading: false,
      nowLicenseNumber: undefined,
      rules: {
        vendorCode: [
          { required: true, message: '设备厂商不能为空', trigger: 'blur,change' }
        ],
        deviceImei: [
          { required: true, message: '设备IMEI码不能为空', trigger: 'blur' }
        ]
      }
    };
  },
  watch: {
    vehicleCode: {
      handler: function(val) {
        if (val) {
          this.queryParams.vehicleCode = val;
          this.nowLicenseNumber = this.licenseNumber;
          this.getDictsList();
        }
      },
      immediate: true
    }
  },
  methods: {
    getDictsList() {
      this.getDicts('device_vendors').then(response => {
        this.deviceVendorOptions = response.data;
      });
    },
    getList() {
      this.loading = true;
      listDevice(this.queryParams).then(response => {
        this.dataList = response.rows;
        this.loading = false;
      });
    },
    handleAdd() {
      this.open = true;
      this.form.vehicleCode = this.vehicleCode;
      this.title = '新增车辆设备';
    },
    handleEdit(row) {
      this.open = true;
      this.title = '修改车辆设备';
      getDevice(row.code).then(response => {
        this.form = response.data;
      });
      // this.form = row;
    },
    handleDel(row) {
      this.$confirm('是否确认删除设备IMEI为"' + row.deviceImei + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delDevice(row.code.split(','));
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.code !== undefined) {
            updateDevice(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.open = false;
              this.buttonLoading = false;
              this.getList();
              this.reset();
            }).catch(() => { this.buttonLoading = false; });
          } else {
            addDevice(this.form).then(response => {
              this.msgSuccess('新增成功');
              this.open = false;
              this.buttonLoading = false;
              this.getList();
              this.reset()
            }).catch(() => { this.buttonLoading = false; });
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
        vendorCode: undefined,
        vehicleCode: undefined,
        deviceImei: undefined
      };
      this.resetForm('form');
    }
  }
};
</script>
