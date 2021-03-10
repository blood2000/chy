<template>
  <div >
    <el-row>
      <el-col :span="4" v-if="false">
        <el-card class="card-left">
            <div slot="header">
              <div class="left_v"></div>
              <span>地区列表</span>
            </div>
            <!-- 树形结构 -->
            <el-tree
              :data="data"
              show-checkbox
              node-key="id"
              :default-expanded-keys="[2, 3]"
              :default-checked-keys="[5]"
              :props="{children: 'children',label: 'label'}">
            </el-tree>
          </el-card>
      </el-col>
      <el-col :span="24">
        <el-card class="card-rigth">
            <div slot="header" v-if="false">
              <div class="left_v"></div>
              <span>院区列表</span>
            </div>
            <!-- 右边 -->
            <div>
                  <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px" class="clearfix">
                    <el-form-item label="下单客户" prop="testName">
                        <el-input
                        v-model="queryParams.testName"
                        placeholder="请输入公司名称/客户姓名/手机号"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>

                    <el-form-item label="转货信息" prop="testName1">
                        <el-input
                        v-model="queryParams.testName1"
                        placeholder="装货地/装货电话/装货人"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>

                    <el-form-item label="收货信息" prop="testName2">
                        <el-input
                        v-model="queryParams.testName2"
                        placeholder="目的地/收货电话/收货人"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>

                    <el-form-item label="货物类型" prop="testName2">
                        <el-select v-model="queryParams.testName3" placeholder="----请选择----" style="width: 215px">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="货物描述" prop="testName2">
                        <el-input
                            v-model="queryParams.testName4"
                            placeholder="目的地/收货电话/收货人"
                            clearable
                            size="small"
                            @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>

                    <el-form-item label="货源单号" prop="testName2">
                        <el-input
                        v-model="queryParams.testName5"
                        placeholder="目的地/收货电话/收货人"
                        clearable
                        size="small"
                        @keyup.enter.native="handleQuery"
                        />
                    </el-form-item>

                    <el-form-item label="订单状态" prop="testName2">
                        <el-select v-model="queryParams.testName6" placeholder="----请选择----" style="width: 215px">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="货源类型" prop="testName2">
                        <el-select v-model="queryParams.testName7" placeholder="----请选择----" style="width: 215px">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="是否拼单" prop="testName2">
                        <el-select v-model="queryParams.testName8" placeholder="----请选择----" style="width: 215px">
                            <el-option label="区域一" value="shanghai"></el-option>
                            <el-option label="区域二" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="创建时间" prop="testName2">
                        <el-date-picker
                        v-model="queryParams.testName9"
                        size="small"
                        style="width: 215px"
                        value-format="yyyy-MM-dd"
                        type="daterange"
                        range-separator="-"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        ></el-date-picker>
                    </el-form-item>

                    <el-form-item label="可抢单量" prop="testName2">
                        <div style="width: 215px" class="flex_b">
                            <el-input
                                v-model="queryParams.testName10"
                                placeholder="目的地/收货电话/收货人"
                                clearable
                                size="small"
                                style="width:100px;"
                                @keyup.enter.native="handleQuery"
                            />
                            <span>-</span>
                            <el-input
                                v-model="queryParams.testName2"
                                placeholder="目的地/收货电话/收货人"
                                clearable
                                size="small"
                                style="width:100px;"
                                @keyup.enter.native="handleQuery"
                            />
                        </div>
                    </el-form-item>
                    
                    <el-form-item class="fr">
                      <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                      <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                      <el-button
                        type="primary"
                        icon="el-icon-plus"
                        size="mini"
                        @click="handleAdd"
                        v-hasPermi="['system:test:add']"
                      >新增</el-button>
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        size="mini"
                        :disabled="multiple"
                        @click="handleDelete"
                        v-hasPermi="['system:test:remove']"
                      >删除</el-button>
                      <el-button
                        type="warning"
                        icon="el-icon-download"
                        size="mini"
                        @click="handleExport"
                        v-hasPermi="['system:test:export']"
                      >导出</el-button>
                    </el-form-item>
                  </el-form>

              <!--<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="100px">
                 <el-form-item label="系统模块" prop="title">
                  <el-input
                    v-model="queryParams.title"
                    placeholder="请输入系统模块"
                    clearable
                    style="width: 240px;"
                    size="small"
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
                <el-form-item label="操作人员" prop="operName">
                  <el-input
                    v-model="queryParams.operName"
                    placeholder="请输入操作人员"
                    clearable
                    style="width: 240px;"
                    size="small"
                    @keyup.enter.native="handleQuery"
                  />
                </el-form-item>
                <el-form-item label="类型" prop="businessType">
                  <el-select
                    v-model="queryParams.businessType"
                    placeholder="操作类型"
                    clearable
                    size="small"
                    style="width: 240px"
                  >
                    <el-option
                      v-for="dict in typeOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                  <el-select
                    v-model="queryParams.status"
                    placeholder="操作状态"
                    clearable
                    size="small"
                    style="width: 240px"
                  >
                    <el-option
                      v-for="dict in statusOptions"
                      :key="dict.dictValue"
                      :label="dict.dictLabel"
                      :value="dict.dictValue"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="操作时间">
                  <el-date-picker
                    v-model="dateRange"
                    size="small"
                    style="width: 240px"
                    value-format="yyyy-MM-dd"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  ></el-date-picker>
                </el-form-item> 
                <el-form-item>
                  <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                  <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
                </el-form-item>
              </el-form>-->

              <el-row :gutter="10" class="mb8">
                <!-- <el-col :span="1.5">
                  <el-button
                    type="primary"
                    icon="el-icon-plus"
                    size="mini"
                    @click="handleAdd"
                    v-hasPermi="['system:test:add']"
                  >新增</el-button>
                </el-col>
                <el-col :span="1.5">
                  <el-button
                    type="success"
                    icon="el-icon-edit"
                    size="mini"
                    :disabled="single"
                    @click="handleUpdate"
                    v-hasPermi="['system:test:edit']"
                  >修改</el-button>
                </el-col>
                <el-col :span="1.5">
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    :disabled="multiple"
                    @click="handleDelete"
                    v-hasPermi="['system:test:remove']"
                  >删除</el-button>
                </el-col>
                <el-col :span="1.5">
                  <el-button
                    type="warning"
                    icon="el-icon-download"
                    size="mini"
                    @click="handleExport"
                    v-hasPermi="['system:test:export']"
                  >导出</el-button>
                </el-col> -->

                <el-col :span="1.5">
                  <tablec-cascader :options='options' v-model="tableColumnsConfig"></tablec-cascader>
                </el-col>
                <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
              </el-row>
            
              <RefactorTable :loading='loading' :data='list' :tableColumnsConfig='tableColumnsConfig' @selection-change="handleSelectionChange">
                <template #status="{row}">
                    <span>{{row.status}}</span>
                </template>
                <template #accessTime="{row}">
                    <span>{{ row.accessTime }}</span>
                </template>
                <template #edit="{row}">
                    <el-button size="mini"
                        type="text"
                        icon="el-icon-edit"
                        @click="handleUpdate(row)"
                        v-hasPermi="['system:menu:edit']"
                    >修改</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-plus"
                        @click="handleAdd(row)"
                        v-hasPermi="['system:menu:add']"
                    >新增</el-button>
                    <el-button
                        size="mini"
                        type="text"
                        icon="el-icon-delete"
                        @click="handleDelete(row)"
                        v-hasPermi="['system:menu:remove']"
                    >删除</el-button>
                </template>
              </RefactorTable>

            <pagination
              v-show="total>0"
              :total="total"
              :page.sync="queryParams.pageNum"
              :limit.sync="queryParams.pageSize"
              @pagination="getList"
            />
            
            </div>
          </el-card>
      </el-col>
    </el-row>



    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="${comment}" prop="testName">
          <el-input v-model="form.testName" placeholder="请输入${comment}" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listTest, getTest, delTest, addTest, updateTest } from "@/api/test/test";

const data = [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
}]
const options = [
        {
            prop: 'infoId',
            label: '访问编号',
            fixed:'left'
            // width: ,
            // align: 'center'
        },
        {
            prop: 'userName',
            label: '用户名称',
            // width: ,
            // align: 'center'
        },{
            prop: 'ipaddr',
            label: '地址',
            width: 130,
            tooltip: true
            // align: 'center'
        },{
            prop: 'status',
            label: '状态'
        },{
            prop: 'msg',
            label: '描述',
            // width: ,
            // align: 'center'
        },{
            prop: 'accessTime',
            label: '访问时间',
            width: 180,
            // align: 'center'
        },
        {
            prop: 'type',
            label: '访问时间',
            width: 250,
            // align: 'center'
        },
        {
            prop: 'terminalType',
            label: '访问时间',
            width: 250,
            // align: 'center'
        },
        {
            prop: 'edit',
            label: '操作',
            width: 180,
            fixed:'right'
        }
]

const listData = {
    "total": 269,
    "rows": [
        {
            "searchValue": null,
            "createCode": null,
            "createBy": null,
            "createTime": null,
            "updateCode": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "params": {},
            "infoId": 608,
            "userName": "admin",
            "operUserCode": null,
            "ipaddr": "192.168.176.12",
            "status": "0",
            "msg": "退出成功",
            "accessTime": "2021-03-09 13:36:53",
            "type": 2,
            "terminalType": 2,
            "appCode": "3f78fbfc13b14fa4b3d78665124ef4bb"
        },
        {
            "searchValue": null,
            "createCode": null,
            "createBy": null,
            "createTime": null,
            "updateCode": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "params": {},
            "infoId": 607,
            "userName": "admin",
            "operUserCode": null,
            "ipaddr": "192.168.176.12",
            "status": "0",
            "msg": "登录成功",
            "accessTime": "2021-03-09 11:55:22",
            "type": 1,
            "terminalType": 2,
            "appCode": "3f78fbfc13b14fa4b3d78665124ef4bb"
        },
        {
            "searchValue": null,
            "createCode": null,
            "createBy": null,
            "createTime": null,
            "updateCode": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "params": {},
            "infoId": 606,
            "userName": "admin",
            "operUserCode": null,
            "ipaddr": "192.168.176.5",
            "status": "0",
            "msg": "登录成功",
            "accessTime": "2021-03-09 11:41:21",
            "type": 1,
            "terminalType": 2,
            "appCode": "3f78fbfc13b14fa4b3d78665124ef4bb"
        },
        {
            "searchValue": null,
            "createCode": null,
            "createBy": null,
            "createTime": null,
            "updateCode": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "params": {},
            "infoId": 605,
            "userName": "admin",
            "operUserCode": null,
            "ipaddr": "192.168.176.5",
            "status": "0",
            "msg": "登录成功",
            "accessTime": "2021-03-09 11:33:51",
            "type": 1,
            "terminalType": 2,
            "appCode": "3f78fbfc13b14fa4b3d78665124ef4bb"
        },
        {
            "searchValue": null,
            "createCode": null,
            "createBy": null,
            "createTime": null,
            "updateCode": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "params": {},
            "infoId": 604,
            "userName": "admin",
            "operUserCode": null,
            "ipaddr": "192.168.176.5",
            "status": "0",
            "msg": "登录成功",
            "accessTime": "2021-03-09 11:31:27",
            "type": 1,
            "terminalType": 2,
            "appCode": "3f78fbfc13b14fa4b3d78665124ef4bb"
        },
        {
            "searchValue": null,
            "createCode": null,
            "createBy": null,
            "createTime": null,
            "updateCode": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "params": {},
            "infoId": 603,
            "userName": "admin",
            "operUserCode": null,
            "ipaddr": "192.168.176.5",
            "status": "0",
            "msg": "退出成功",
            "accessTime": "2021-03-09 11:31:22",
            "type": 2,
            "terminalType": 2,
            "appCode": "3f78fbfc13b14fa4b3d78665124ef4bb"
        },
        {
            "searchValue": null,
            "createCode": null,
            "createBy": null,
            "createTime": null,
            "updateCode": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "params": {},
            "infoId": 602,
            "userName": "admin",
            "operUserCode": null,
            "ipaddr": "192.168.176.5",
            "status": "0",
            "msg": "登录成功",
            "accessTime": "2021-03-09 11:29:00",
            "type": 1,
            "terminalType": 2,
            "appCode": "3f78fbfc13b14fa4b3d78665124ef4bb"
        },
        {
            "searchValue": null,
            "createCode": null,
            "createBy": null,
            "createTime": null,
            "updateCode": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "params": {},
            "infoId": 601,
            "userName": "admin",
            "operUserCode": null,
            "ipaddr": "192.168.176.5",
            "status": "0",
            "msg": "退出成功",
            "accessTime": "2021-03-09 11:28:58",
            "type": 2,
            "terminalType": 2,
            "appCode": "3f78fbfc13b14fa4b3d78665124ef4bb"
        },
        {
            "searchValue": null,
            "createCode": null,
            "createBy": null,
            "createTime": null,
            "updateCode": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "params": {},
            "infoId": 600,
            "userName": "admin",
            "operUserCode": null,
            "ipaddr": "192.168.176.5",
            "status": "0",
            "msg": "登录成功",
            "accessTime": "2021-03-09 11:28:42",
            "type": 1,
            "terminalType": 2,
            "appCode": "3f78fbfc13b14fa4b3d78665124ef4bb"
        },
        {
            "searchValue": null,
            "createCode": null,
            "createBy": null,
            "createTime": null,
            "updateCode": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "params": {},
            "infoId": 599,
            "userName": "admin",
            "operUserCode": null,
            "ipaddr": "192.168.176.5",
            "status": "0",
            "msg": "退出成功",
            "accessTime": "2021-03-09 11:28:39",
            "type": 2,
            "terminalType": 2,
            "appCode": "3f78fbfc13b14fa4b3d78665124ef4bb"
        }
    ],
    "code": 200,
    "msg": "查询成功"
}

export default {
  name: "testlog",
    data() {
      return {
        // 树形数据
        data,

        // 遮罩层
        loading: false,
        // 选中数组
        ids: [],
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 表格数据
        list: [],
        // 是否显示弹出层
        open: false,
        // 类型数据字典
        typeOptions: [],
        // 类型数据字典
        statusOptions: [],
        // 日期范围
        dateRange: [],
        // 表单参数
        form: {},
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          title: undefined,
          operName: undefined,
          businessType: undefined,
          status: undefined
        },
        // 表头动态值
      tableColumnsConfig:[],

      // 下拉框展示所有的值-其中每一项就是配置项的值
      options

      
      };
    },
    created() {
      this.getList();
      // 这个可以做个判断如果有存则取存的东西, 没有就去全部
      this.tableColumnsConfig = this.options
    },
    methods: {
      /** 查询【请填写功能名称】列表 */
      getList() {
        // this.loading = true;
        // listTest(this.queryParams).then(response => {
        //   this.testList = response.rows;
        //   this.total = response.total;
        //   this.loading = false;
        // }).catch(err=>{
        //   this.loading = false;
        // })

        // 测试,上面打开,下面就要删掉
          this.list = listData.rows;
          this.total = listData.total;
          this.loading = false;

        
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          testId: null,
          testName: null
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.testId)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加【请填写功能名称】";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const testId = row.testId || this.ids
        getTest(testId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改【请填写功能名称】";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.testId != null) {
              updateTest(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addTest(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const testIds = row.testId || this.ids;
        this.$confirm('是否确认删除【请填写功能名称】编号为"' + testIds + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delTest(testIds);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('system/test/export', {
          ...this.queryParams
        }, `system_test.xlsx`)
      }
    }
}
</script>


<style scoped lang='scss'>
.card-rigth{
  position: relative;
  margin: 0 15px 15px;
  overflow-y: auto;
  height: calc(100vh - 145px);
}
.card-left{
  position: relative;
  margin-left: 15px;
  margin-bottom: 15px;
  height: calc(100vh - 145px);
}
.left_v{
  position: absolute;
  width: 3px;
  height: 20px;
  left: 0;
  top: 14px;
  background-color: #1890ff;
}

.flex_b{
    display: flex;
    justify-content: space-between;
}

</style>