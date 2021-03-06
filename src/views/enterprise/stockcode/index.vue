<template>
  <div>
    <div v-show="showSearch" class="app-container app-container--search">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="100px">
        <el-form-item label="货集码名称" prop="cargoCodeName">
          <el-input
            v-model.trim="queryParams.cargoCodeName"
            placeholder="请输入货集码名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button type="primary" plain icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="app-container">
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['assets:shipment:cargocode:add']"
            type="primary"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
          >新增货集码</el-button>
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            v-hasPermi="['assets:shipment:cargocode:edit']"
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
          >修改</el-button>
        </el-col> -->
        <el-col :span="1.5">
          <el-button
            v-hasPermi="['assets:shipment:cargocode:remove']"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
          >删除</el-button>
        </el-col>
        <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
      </el-row>

      <el-table v-loading="loading" :data="stockcodeList" highlight-current-row border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" fixed="left" />
        <el-table-column label="货集码名称" align="center" prop="cargoCodeName" />
        <el-table-column label="货集码" align="center" prop="cargoCodeQr">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleDownloadCode(scope.row)"
            >下载</el-button>
          </template>
        </el-table-column>
        <el-table-column label="关联的货源数" align="center" prop="relationOrderNum">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              @click="handleOrderList(scope.row)"
            >{{ scope.row.relationOrderNum }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="left">
          <template slot-scope="scope">
            <el-button
              v-hasPermi="['assets:shipment:cargocode:edit']"
              size="mini"
              type="text"
              @click="handleUpdate(scope.row)"
            >详情</el-button>
            <el-button
              v-hasPermi="['assets:shipment:cargocode:remove']"
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

      <!-- 添加或修改对话框 -->
      <stockcode-dialog ref="StockcodeDialog" :title="title" :open.sync="open" :shipment-code="shipmentCode" @refresh="getList" />
      <!-- 货集码下的货源列表对话框 -->
      <order-list-dialog :title="title" :open.sync="orderListOpen" :code="classCode" />
    </div>
  </div>
</template>

<script>
import { listStockcode, getStockCode, delStockcode } from '@/api/enterprise/stockcode';
// import { downImgApi } from '@/api/system/image';
import StockcodeDialog from './stockcodeDialog.vue';
import orderListDialog from './orderListDialog.vue';

export default {
  name: 'Stockcode',
  components: {
    StockcodeDialog,
    orderListDialog
  },
  props: {
    shipmentCode: {
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
      stockCodeNames: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      stockcodeList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      orderListOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        code: null,
        cargoCodeName: null,
        cargoCodeQr: null
      },
      // 选中code
      classCode: ''
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询货集码列表 */
    getList() {
      this.loading = true;
      if (this.shipmentCode) {
        this.queryParams.shipmentCode = this.shipmentCode;
      }
      listStockcode(this.queryParams).then(response => {
        this.stockcodeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.stockCodeNames = selection.map(item => item.cargoCodeName);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.$refs.StockcodeDialog.reset();
      this.open = true;
      this.title = '添加';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // console.log(row);
      this.$refs.StockcodeDialog.reset();
      /* let id;
      if (row.id !== '' && row.id !== undefined && row.id != null) {
        id = row.id;
      } else {
        id = this.ids;
      }*/
      getStockCode(row.code).then(response => {
        this.$refs.StockcodeDialog.setForm(response.data);
        this.open = true;
        // this.title = '修改';
        this.title = '详情';
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      const stockCodeNames = row.cargoCodeName || this.stockCodeNames;
      this.$confirm('是否确认货集码名称为"' + stockCodeNames + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delStockcode(ids);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 下载货集码 */
    handleDownloadCode(row) {
      this.handleDownloadQrIMg(row.cargoCodeQR, row.cargoCodeName);
      /*  const params = {
        url: row.cargoCodeQR,
        fileName: row.cargoCodeName
      };
      this.download(downImgApi, params, `货集码`, null, '.jpg');*/
      // 前端下载方法1
      // const image = new Image();
      // image.setAttribute('crossOrigin', 'anonymous');
      // image.src = row.cargoCodeQR;
      // image.onload = () => {
      //   const canvas = document.createElement('canvas');
      //   canvas.width = image.width;
      //   canvas.height = image.height;
      //   const context = canvas.getContext('2d');
      //   context.drawImage(image, 0, 0, image.width, image.height);
      //   canvas.toBlob((blob) => {
      //     const url = URL.createObjectURL(blob);
      //     const a = document.createElement('a');
      //     a.download = `货集码_${new Date().getTime()}`;
      //     a.href = url;
      //     a.click();
      //     a.remove();
      //     URL.revokeObjectURL(url);
      //   });
      // };
      // 前端下载方法2
      // fetch(row.cargoCodeQR).then(res => res.blob().then(blob => {
      //   var a = document.createElement('a');
      //   var url = window.URL.createObjectURL(blob);
      //   var filename = `货集码_${new Date().getTime()}.jpg`;
      //   a.href = url;
      //   a.download = filename;
      //   a.click();
      //   window.URL.revokeObjectURL(url);
      // }));
    },
    /** 获取货集码下的货源列表 */
    handleOrderList(row) {
      this.classCode = row.code;
      this.orderListOpen = true;
      this.title = '关联的货源列表';
    },
    handleDownloadQrIMg(imgUrl, fileName) {
      // 如果浏览器支持msSaveOrOpenBlob方法（也就是使用IE浏览器的时候），那么调用该方法去下载图片
      // console.log(imgUrl);
      if (window.navigator.msSaveOrOpenBlob) {
        const bstr = atob(imgUrl.split(',')[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        const blob = new Blob([u8arr]);
        window.navigator.msSaveOrOpenBlob(blob, fileName + '.' + 'png');
      } else {
        // 这里就按照chrome等新版浏览器来处理
        const a = document.createElement('a');
        a.href = imgUrl;
        a.setAttribute('download', fileName);
        a.click();
      }
    }
  }
};
</script>
