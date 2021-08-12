<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >绑定</el-button>
      </el-col>
    </el-row>
    <el-table v-loading="loading" highlight-current-row border :data="dataList">
      <el-table-column label="厂商" align="center" prop="vendorName" />
      <el-table-column label="设备标识" align="center" prop="factoryOnlyCode" />
      <el-table-column label="状态" align="center" prop="status" width="100px">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(statusOptions, scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="激活状态" align="center" prop="activationFlag">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(activationFlagOptions, scope.row.activationFlag) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="过期状态" align="center" prop="expireFlag">
        <template slot-scope="scope">
          <span>{{ selectDictLabel(expireFlagOptions, scope.row.expireFlag) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="160">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="vehicleCode" label="操作" align="center" fixed="left" prop="edit">
        <template slot-scope="scope">
          <!-- <el-button
            size="mini"
            type="text"
            @click="handleEdit(scope.row)"
          >编辑</el-button>-->
          <el-button
            size="mini"
            type="text"
            @click="handleDel(scope.row)"
          >解绑</el-button>
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
              <el-select v-model="form.vendorCode" placeholder="请选择" @change="changeVendor" clearable filterable style="width: 100%">
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
            <el-form-item label="设备" prop="deviceCode">
                <el-select
                        style="width: 100%"
                        clearable
                        v-model="form.deviceCode"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入设备编码"
                        :remote-method="remoteMethod"
                        :loading="loading">
                    <el-option
                            v-for="item in deviceList"
                            :key="item.code"
                            :label="item.factoryOnlyCode"
                            :value="item.code">
                    </el-option>
                </el-select>
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
import { listDevice, addDevice, updateDevice, delDevice, getDevice, listAll } from '@/api/assets/vehicleDevice';
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
      dataParams: {
        vendorCode: undefined,
        factoryOnlyCode: undefined,
        isfilterBinding: 1
      },
      form: {
        vendorCode: undefined,
        vehicleCode: undefined,
        deviceCode: undefined
      },
      open: false,
      title: '',
      deviceVendorOptions: [],
      buttonLoading: false,
      nowLicenseNumber: undefined,
      statusOptions: [
        { dictLabel: '离线', dictValue: 0 },
        { dictLabel: '在线', dictValue: 1 }
      ],
      activationFlagOptions: [
        { dictLabel: '未激活', dictValue: 0 },
        { dictLabel: '激活', dictValue: 1 }
      ],
      expireFlagOptions: [
        { dictLabel: '过期', dictValue: 0 },
        { dictLabel: '未过期', dictValue: 1 }
      ],
      rules: {
        vendorCode: [
          { required: true, message: '设备厂商不能为空', trigger: 'blur,change' }
        ],
        deviceCode: [
          { required: true, message: '设备不能为空', trigger: 'blur,change' }
        ]
      },
      deviceList: []
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
    getDeviceList() {
      listAll(this.dataParams).then(response => {
        this.loading = false;
        this.deviceList = response.rows;
      });
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        this.dataParams.factoryOnlyCode = query;
        this.deviceList = [];
        this.getDeviceList();
      } else {
        this.deviceList = [];
      }
    },
    changeVendor(value) {
      this.dataParams.vendorCode = value;
    },
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
      this.title = '绑定车辆设备';
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
      this.$confirm('是否确认解绑设备为"' + row.factoryOnlyCode + '"的数据项?', '警告', {
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
              this.reset();
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
      this.dataParams = {
        vendorCode: undefined,
        factoryOnlyCode: undefined,
        isfilterBinding: 1
      };
      this.resetForm('form');
    }
  }
};
</script>
