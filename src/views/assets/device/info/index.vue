<template>
  <div class="device-info">
    <el-row :gutter="15">
      <el-col :xl="5" :lg="6" :md="8" :sm="9" :xs="24">
        <div class="device-info-left">
          <div class="head-container">
            <el-input
              v-model="typeName"
              placeholder="请输入设备类型"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              class="mb20"
            />
          </div>
          <div class="head-container el-tree-scroll-container">
            <el-tree
              ref="tree"
              :data="deviceTreeOptions"
              :props="defaultTreeProps"
              :expand-on-click-node="true"
              :filter-node-method="filterNode"
              :indent="0"
              :highlight-current="true"
              node-key="code"
              :current-node-key="typeCode"
              default-expand-all
              @node-click="handleNodeClick"
            >
              <span slot-scope="{ node, data }">
                <span class="node-label">
                  <i class="tree-node-icon" :class="data.icon" />
                  {{ node.label }}
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </el-col>
      <el-col :xl="19" :lg="18" :md="16" :sm="15" :xs="24">
        <div class="device-info-right">
          <div v-show="showSearch" class="device-info-right-top">
            <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
              <el-form-item label="设备标识" prop="factoryOnlyCode">
                <el-input
                  v-model="queryParams.factoryOnlyCode"
                  placeholder="请输入设备标识"
                  clearable
                  size="small"
                  style="width: 200px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item label="设备状态" prop="status">
                <el-select
                  v-model="queryParams.status"
                  clearable
                  filterable
                  style="width: 200px"
                  size="small"
                >
                  <el-option
                    v-for="dict in statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="绑定车牌" prop="isBindingCar">
                <el-select
                  v-model="queryParams.isBindingCar"
                  clearable
                  filterable
                  style="width: 200px"
                  size="small"
                >
                  <el-option
                    v-for="dict in isBindingCarOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="车牌号" prop="licenseNumber">
                <el-input
                  v-model="queryParams.licenseNumber"
                  placeholder="请输入车牌号"
                  clearable
                  size="small"
                  style="width: 200px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <!-- <el-form-item label="激活状态" prop="activationFlag">
                <el-select
                  v-model="queryParams.activationFlag"
                  clearable
                  filterable
                  style="width: 200px"
                  size="small"
                >
                  <el-option
                    v-for="dict in activationFlagOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="过期状态" prop="expireFlag">
                <el-select
                  v-model="queryParams.expireFlag"
                  clearable
                  filterable
                  style="width: 200px"
                  size="small"
                >
                  <el-option
                    v-for="dict in expireFlagOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>-->
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="device-info-right-bottom">
            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="handleAdd"
                >新增</el-button>
              </el-col>
              <el-col :span="1.5">
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
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="warning"
                  icon="el-icon-magic-stick"
                  size="mini"
                  :disabled="multiple"
                  :loading="downloadLoading"
                  @click="handleDownloadAll"
                >批量下载二维码</el-button>
                <el-button
                  type="warning"
                  icon="el-icon-magic-stick"
                  size="mini"
                  :disabled="multiple"
                  :loading="downloadLoading"
                  @click="handleDownloadAllSVG"
                >批量下载SVG二维码</el-button>
              </el-col>
              <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
            </el-row>

            <el-table v-loading="loading" highlight-current-row border :data="deviceList" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="二维码" align="center" prop="device_qr_code">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleDownload(scope.row)"
                  >下载</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="handleDownloadSVG(scope.row)"
                  >下载svg</el-button>
                </template>
              </el-table-column>
              <!-- <el-table-column label="编码" align="center" prop="deviceNumber"></el-table-column>-->
              <el-table-column label="设备编码" align="center" prop="factory_only_code" />
              <el-table-column label="状态" align="center" prop="status" width="100px">
                <template slot-scope="scope">
                  <span>{{ selectDictLabel(statusOptions, scope.row.status) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="绑定车牌" align="center" prop="license_number" />
              <!-- <el-table-column label="激活状态" align="center" prop="activation_flag">
                <template slot-scope="scope">
                  <span>{{ selectDictLabel(activationFlagOptions, scope.row.activation_flag) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="过期状态" align="center" prop="expire_flag">
                <template slot-scope="scope">
                  <span>{{ selectDictLabel(expireFlagOptions, scope.row.expire_flag) }}</span>
                </template>
              </el-table-column>-->
              <el-table-column v-for="item in devicefield" :key="item.code" :label="item.fieldCnname" :prop="item.fieldMappingName" align="center" />
              <el-table-column label="创建时间" align="center" prop="create_time" width="160">
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.create_time) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" fixed="left" width="120">
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
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 添加或修改设备信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="130px" style="width:98%">
        <el-form-item label="设备类型" prop="typeCode">
          <treeselect
            v-model="form.typeCode"
            :options="deviceTreeOptions"
            :normalizer="normalizer"
            :show-count="true"
            placeholder="请选择设备类型"
            disabled
          />
        </el-form-item>
        <el-form-item v-if="!!form.code" label="设备编码" prop="deviceNumber">
          <el-input v-model="form.deviceNumber" disabled />
        </el-form-item>
        <!-- 固定字段 -->
        <el-form-item label="厂家" prop="vendorCode">
          <el-select
            v-model="form.vendorCode"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="dict in deviceVendorOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备状态" prop="status">
          <el-select
            v-model="form.status"
            clearable
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="dict in statusOptions"
              :key="dict.dictValue"
              :label="dict.dictLabel"
              :value="dict.dictValue"
            />
          </el-select>
        </el-form-item>
        <!-- 动态字段 -->
        <el-form-item v-for="(item, index) in addDeviceField" :key="item.code + index" :label="item.fieldCnname" :prop="item.fieldMappingName" :rules="[{ required: item.isRequire === 0, message: `${item.fieldCnname}不能为空`, trigger: 'blur' }]">
          <!-- 1.input -->
          <el-input
            v-if="item.fieldFormType === 1"
            v-model="form[item.fieldMappingName]"
            :disabled="item.isRead === 0"
            :placeholder="`请输入${item.fieldCnname}`"
            clearable
          />
          <!-- 2.number -->
          <el-input-number
            v-else-if="item.fieldFormType === 2"
            v-model="form[item.fieldMappingName]"
            controls-position="right"
            :precision="item.fieldDit ? item.fieldDit : 0"
            :step="1"
            :min="0"
            style="width: 100%"
          />
          <!-- 3.date -->
          <el-date-picker
            v-else-if="item.fieldFormType === 3"
            v-model="form[item.fieldMappingName]"
            clearable
            type="datetime"
            placeholder="请选择"
            style="width: 100%"
            :disabled="item.isRead === 0"
          />
          <!-- 4.select -->
          <el-select
            v-else-if="item.fieldFormType === 4"
            v-model="form[item.fieldMappingName]"
            clearable
            filterable
            style="width: 100%"
            :disabled="item.isRead === 0"
          >
            <el-option
              v-for="dict in item.optionList"
              :key="dict.optionValue"
              :label="dict.optionName"
              :value="dict.optionValue"
            />
          </el-select>
          <!-- 5.radio -->
          <el-radio-group
            v-else-if="item.fieldFormType === 5"
            v-model="form[item.fieldMappingName]"
          >
            <el-radio
              v-for="dict in item.optionList"
              :key="dict.optionValue"
              :label="dict.optionValue"
              :disabled="item.isRead === 0"
            >{{ dict.optionName }}</el-radio>
          </el-radio-group>
          <!-- 6.checkbox -->
          <el-checkbox
            v-else-if="item.fieldFormType === 6"
            v-model="form[item.fieldMappingName]"
            :disabled="item.isRead === 0"
          >{{ item.fieldCnname }}</el-checkbox>
          <!-- 7.img -->
          <upload-image v-else-if="item.fieldFormType === 7" v-model="form[item.fieldMappingName]" :disabled="item.isRead === 0" />
          <!-- else -->
          <el-input v-else v-model="form[item.fieldMappingName]" :placeholder="`请输入${item.fieldCnname}`" clearable :disabled="item.isRead === 0" />
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" />
        </el-form-item>
        <el-form-item v-if="!!form.code" label="二维码" prop="deviceQrCode">
          <img class="device-qr-Code" :src="form.deviceQrCode">
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { getDeviceTypeTreeAll, getDeviceInfoList, getDeviceForm, addDeviceInfo, updateDeviceInfo, getDeviceDetail, delDriverInfo } from '@/api/assets/device.js';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { downImgApi } from '@/api/system/image';
import UploadImage from '@/components/UploadImage/index';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { getFile } from '@/libs/batchCompression';
export default {
  name: 'DeviceInfo',
  components: {
    Treeselect,
    UploadImage
  },
  data() {
    return {
      typeName: undefined,
      deviceTreeOptions: undefined,
      defaultTreeProps: {
        children: 'children',
        label: 'typeName'
      },
      normalizer(node) {
        return {
          id: node.code, // 键名转换，方法默认是label和children进行树状渲染
          label: node.typeName,
          children: node.children
        };
      },
      // 当前选中的类型
      typeCode: undefined,
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
      devicefield: [],
      deviceList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        typeCode: undefined,
        factoryOnlyCode: undefined,
        activationFlag: undefined,
        expireFlag: undefined,
        licenseNumber: undefined,
        isBindingCar: undefined,
        status: undefined
      },
      exportLoading: false,
      // 设备状态字典
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
      isBindingCarOptions: [
        { dictLabel: '是', dictValue: 0 },
        { dictLabel: '否', dictValue: 1 }
      ],
      // 厂家字典
      deviceVendorOptions: [],
      // 新增/编辑
      title: '',
      open: false,
      buttonLoading: false,
      form: {},
      rules: {
        status: [
          { required: true, message: '设备状态不能为空', trigger: ['blur', 'change'] }
        ]
      },
      // 动态表单
      addDeviceField: [],
      // 批量下载二维码
      downloadLoading: false,
      selectList: []
    };
  },
  watch: {
    typeName(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.getDictsList();
    this.getTree();
  },
  methods: {
    getDictsList() {
      this.getDicts('device_vendors').then(response => {
        this.deviceVendorOptions = response.data;
      });
    },
    /** 查询设备类型树 */
    getTree() {
      const _this = this;
      getDeviceTypeTreeAll().then(response => {
        this.deviceTreeOptions = JSON.parse(JSON.stringify(response.data));// 这里不知道为什么reduce会影响原数组，先简单的深拷贝
        // 将树扁平化为一个数组
        const treeArr = response.data.reduce(function sum(total, cur) {
          total.push(cur);
          if (cur.children && cur.children.length > 0) cur.children.reduce(sum, total);// 判断当前参数中是否存在children，有则递归处理
          return total;
        }, []).map((cur) => {
          cur.children = [];
          return cur;
        });
        // 取第一个objectType为模型实体的code去获取列表
        try {
          treeArr.forEach(function(cur, i) {
            if (cur.objectType === 2) {
              _this.$nextTick(() => {
                _this.$refs.tree.setCurrentKey(cur.code);
              });
              _this.typeCode = cur.code;
              _this.getList();
              throw Error();
            }
          });
        } catch (e) {
          // console.log(e);
        }
      });
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.typeName.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      if (data.objectType !== 2) {
        this.$refs.tree.setCurrentKey(this.typeCode);
        return;
      }
      this.typeCode = data.code;
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 获取列表数据 */
    getList() {
      this.loading = true;
      this.queryParams.typeCode = this.typeCode;
      getDeviceInfoList(this.queryParams).then((response) => {
        this.devicefield = response.data.field;
        this.deviceList = response.data.data;
        this.total = response.data.count;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.code);
      this.names = selection.map(item => item.name);
      this.selectList = selection;
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form.typeCode = this.typeCode;
      getDeviceForm(this.typeCode).then(response => {
        this.open = true;
        this.title = '添加设备';
        // 动态表单
        this.addDeviceField = response.data.deviceFieldInfoVoList;
        this.addDeviceField.forEach(el => {
          // 复选框回显特殊处理
          if (el.fieldFormType === 6) {
            this.$set(this.form, el.fieldMappingName, !!(el.defaultValue === 'true'));
          } else {
            this.$set(this.form, el.fieldMappingName, el.defaultValue);
          }
        });
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ids = row.code || this.ids;
      getDeviceDetail(ids).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改设备信息';
        // 动态表单
        this.addDeviceField = response.data.deviceFieldInfoVoList;
        this.addDeviceField.forEach(el => {
          // 复选框回显特殊处理
          if (el.fieldFormType === 6) {
            this.$set(this.form, el.fieldMappingName, !!(el.value === 'true'));
          } else {
            this.$set(this.form, el.fieldMappingName, el.value);
          }
        });
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.code || this.ids;
      this.$confirm('是否确认删除选中的设备?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delDriverInfo(ids);
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
          // 构造数据
          const params = {
            code: this.form.code,
            typeCode: this.form.typeCode,
            vendorCode: this.form.vendorCode,
            status: this.form.status,
            remark: this.form.remark,
            deviceSingleInsertBoList: []
          };
          this.addDeviceField.forEach(el => {
            params.deviceSingleInsertBoList.push({
              mappingName: el.fieldMappingName,
              value: this.form[el.fieldMappingName]
            });
          });
          if (this.form.code !== undefined) {
            updateDeviceInfo(params).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            addDeviceInfo(params).then(response => {
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
        name: undefined
      };
      this.resetForm('form');
    },
    // 下载二维码
    handleDownload(row) {
      const params = {
        url: row.device_qr_code,
        fileName: `${row.factory_only_code}_二维码`
      };
      this.download(downImgApi, params, `${row.factory_only_code}_二维码`, null, '.jpg');
    },
    // 批量下载二维码
    async handleDownloadAll() {
      this.msgInfo('导出中，请稍候');
      this.downloadLoading = true;
      const zip = new JSZip();
      const cache = {};
      const promises = [];
      await this.selectList.forEach(item => {
        const str = (item.device_qr_code.split('.com'))[1];
        const promise = getFile(`/pdf${str}`).then(data => { // 下载文件, 并存成ArrayBuffer对象
          const file_name = item.factory_only_code + '.jpg';
          zip.file(file_name, data, {
            binary: true
          }); // 逐个添加文件
          cache[file_name] = data;
        });
        promises.push(promise);
      });
      Promise.all(promises).then(() => {
        zip.generateAsync({
          type: 'blob'
        }).then(content => { // 生成二进制流
          this.msgSuccess('导出成功');
          this.downloadLoading = false;
          FileSaver.saveAs(content, '设备二维码_' + this.parseTime(new Date(), '{y}{m}{d}{h}{i}') + '.zip'); // 利用file-saver保存文件
        });
      }).catch(() => {
        this.msgError('导出失败');
        this.downloadLoading = false;
      });
    },
    // 下载svg二维码
    handleDownloadSVG(row) {
      var Qrcodesvg = require('qrcodesvg');
      var qrcode = new Qrcodesvg('https://api.chaohaoyun.cn/assets/grant/' + row.code, 250);
      var data = qrcode.generate();
      console.log(data);
      var image = new Image();
      image.src = 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(data))); // 给图片对象写入base64编码的svg流
      var a = document.createElement('a');
      a.href = image.src; // 直接导出SVG
      a.download = `${row.factory_only_code}_二维码`; // 设定下载名称
      a.click(); // 点击触发下载
    },
    // 图片转base64
    getBase64Image(img) {
      console.log(img.width, img.height, img);
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase();
      console.log(ext);
      var dataURL = canvas.toDataURL('image/' + ext);
      console.log(dataURL);
      return dataURL;
    },
    // 批量下载svg二维码
    async handleDownloadAllSVG() {
      this.msgInfo('导出中，请稍候');
      this.downloadLoading = true;
      const zip = new JSZip();
      await this.selectList.forEach(item => {
        var Qrcodesvg = require('qrcodesvg');
        var qrcode = new Qrcodesvg('https://api.chaohaoyun.cn/assets/grant/' + item.code, 250);
        var data = qrcode.generate();
        const file_name = item.factory_only_code + '.svg';
        zip.file(file_name, data, {
          binary: true
        }); // 逐个添加文件
      });
      zip.generateAsync({
        type: 'blob'
      }).then(content => { // 生成二进制流
        FileSaver.saveAs(content, Date.now() + '.zip'); // 利用file-saver保存文件
        this.downloadLoading = false;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.device-info{
  margin: 0 15px;
  @mixin box-shadow{
    margin: 0 0 15px;
    padding: 20px;
    background: #fff;
    box-shadow: 0px 2px 3px 0px rgba(51, 153, 255, 0.1);
    border-radius: 3px;
  }

  .device-info-left{
    @include box-shadow;
    min-height: calc(100vh - 146px);
  }

  .device-info-right{
    .device-info-right-top{
      @include box-shadow;
      padding-bottom: 8px;
    }
    .device-info-right-bottom{
      @include box-shadow;
    }
  }
}

/* 二维码样式 */
.device-qr-Code{
  width: 180px;
}

/* 计数器样式 */
.el-input-number ::v-deep.el-input__inner{
  text-align: left;
}
</style>
