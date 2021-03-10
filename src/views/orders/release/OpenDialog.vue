<template>
  <div>
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="100px" class="clearfix">
        <el-form-item label="转货地址" prop="testName">
            <el-input
            v-model="queryParams.testName"
            placeholder="请输入公司名称/客户姓名/手机号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
            />
        </el-form-item>

        <el-form-item label="转货电话" prop="testName1">
            <el-input
            v-model="queryParams.testName1"
            placeholder="装货地/装货电话/装货人"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
            />
        </el-form-item>

        <el-form-item label="发货人" prop="testName2">
            <el-input
            v-model="queryParams.testName2"
            placeholder="目的地/收货电话/收货人"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
            />
        </el-form-item>

                
        <el-form-item class="fr">
            <el-button type="cyan" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            
        </el-form-item>
    </el-form>

    <div class="mb8">
        <tablec-cascader :options='options' v-model="tableColumnsConfig"></tablec-cascader>
    </div>
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
                        
                    >选择</el-button>
                    
                </template>
        </RefactorTable>

        <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getList" />


  </div>
</template>

<script>

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
    name:'OpenDialog',
    data(){
        return {
            // 遮罩层
            loading: false,
            // 总条数
            total: 0,
            // 查询参数
            // 表格数据
            list: [],
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
        }
    },

    created(){
        this.getList();
        // 这个可以做个判断如果有存则取存的东西, 没有就去全部
        this.tableColumnsConfig = this.options
    },

    methods:{
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
        /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
      },
       /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },

      handleUpdate(){

      }
    }
}
</script>

<style>

</style>