<template>
  <div>
    <el-row>
      <!--部门数据-->
      <el-col :lg="5" :md="6" :sm="7" :xs="24">
        <div class="app-container app-container--tree">
          <div class="head-container">
            <el-input
              v-model.trim="deptName"
              placeholder="请输入组织名称"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              class="mb20"
            />
          </div>
          <div class="head-container el-tree-scroll-container">
            <el-tree
              ref="tree"
              :data="deptOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              :indent="0"
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
      <!--用户数据-->
      <el-col :lg="19" :md="18" :sm="17" :xs="24">
        <div v-show="showSearch" class="app-container app-container--search">
          <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
            <el-form-item label="用户名称" prop="userName">
              <el-input
                v-model.trim="queryParams.userName"
                placeholder="请输入用户名称"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input
                v-model.trim="queryParams.phonenumber"
                placeholder="请输入手机号码"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="用户状态"
                clearable
                filterable
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
            <el-form-item label="创建时间" prop="dateRange">
              <el-date-picker
                v-model="dateRange"
                size="small"
                style="width: 240px"
                value-format="yyyy-MM-dd"
                type="daterange"
                unlink-panels
                :picker-options="pickerOptions"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
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
                v-hasPermi="['system:user:add']"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
              >新增</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-hasPermi="['system:user:edit']"
                type="success"
                icon="el-icon-edit"
                size="mini"
                :disabled="single"
                @click="handleUpdate"
              >修改</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-hasPermi="['system:user:remove']"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple"
                @click="handleDelete"
              >删除</el-button>
            </el-col>
            <!--  <el-col :span="1.5">
              <el-button
                v-hasPermi="['system:user:import']"
                type="info"
                icon="el-icon-upload2"
                size="mini"
                @click="handleImport"
              >导入</el-button>
            </el-col>-->
            <el-col :span="1.5">
              <el-button
                v-hasPermi="['system:user:export']"
                type="warning"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
              >导出</el-button>
            </el-col>
            <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
          </el-row>

          <el-table v-loading="loading" highlight-current-row border :data="userList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50" align="center" />
            <!-- <el-table-column label="用户编号" align="center" prop="userId" />-->
            <el-table-column label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true" />
            <el-table-column label="用户昵称" align="center" prop="nickName" :show-overflow-tooltip="true" />
            <el-table-column label="组织" align="center" prop="orgName" :show-overflow-tooltip="true" />
            <el-table-column label="手机号码" align="center" prop="phonenumber" width="120" />
            <el-table-column label="角色" align="center" prop="roleNames" :show-overflow-tooltip="true" />
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-value="0"
                  inactive-value="1"
                  @change="handleStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" width="160">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              fixed="left"
              width="160"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  v-hasPermi="['system:user:edit']"
                  size="mini"
                  type="text"
                  @click="handleUpdate(scope.row)"
                >修改</el-button>
                <el-button
                  v-if="scope.row.userId !== 1"
                  v-hasPermi="['system:user:remove']"
                  size="mini"
                  type="text"
                  @click="handleDelete(scope.row)"
                >删除</el-button>
                <el-button
                  v-hasPermi="['system:user:resetPwd']"
                  size="mini"
                  type="text"
                  @click="handleResetPwd(scope.row)"
                >重置</el-button>
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
      </el-col>
    </el-row>

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属组织" prop="orgCode">
              <treeselect
                v-model="form.orgCode"
                :options="deptOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="请选择归属组织"
                @select="selectOrgCode"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input v-model="form.phonenumber" placeholder="请输入手机号码" maxlength="11" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户名称" prop="userName">
              <el-input v-model="form.userName" placeholder="请输入用户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
              <el-input v-model="form.password" placeholder="请输入用户密码" type="password" />
             <!-- <span class="g-color-blue">(初始密码为{{ initPassword }})</span>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择" clearable filterable>
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!--  <el-col :span="12">
            <el-form-item label="岗位">
              <el-select v-model="form.postIds" multiple placeholder="请选择" clearable filterable>
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>-->
          <el-col :span="12">
            <el-form-item label="角色" prop="roleCodes">
              <el-select v-model="form.roleCodes" multiple placeholder="请选择" clearable filterable :disabled="roleDisabled">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleCode"
                  :label="item.roleName"
                  :value="item.roleCode"
                  :disabled="item.status == 1 || (item.isSystem == 1) "
                />
              </el-select>
            </el-form-item>
          </el-col>
          <!--<el-col v-if="!form.userId" :span="12">
            <el-form-item label="是否创建银行账号" label-width="140px">
              <el-radio-group v-model="form.isCreate">
                <el-radio
                  v-for="dict in createOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>-->
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body :close-on-click-modal="false">
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload" />
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div slot="tip" class="el-upload__tip">
          <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate">下载模板</el-link>
        </div>
        <div slot="tip" class="el-upload__tip" style="color:red">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 重置密码弹窗 -->
    <el-dialog :title="pwTitle" :visible.sync="pwOpen" width="500px" append-to-body :modal-append-to-body="false" :close-on-click-modal="false" @close="pwReset">
      <el-form ref="pwForm" :model="pwForm" :rules="pwRules" label-width="0px">
        <el-form-item prop="password">
          <el-input v-model="pwForm.password" placeholder="请输入密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="resetLoading" @click="submitResetPwd">确 定</el-button>
        <el-button @click="pwOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus } from '@/api/system/user';
import { treeselect } from '@/api/system/dept';
import { getToken } from '@/utils/auth';
import { authorPre } from '@/headers';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { mapGetters } from 'vuex';
import { getUserInfo } from '@/utils/auth';
import { pickerOptions } from '@/utils/dateRange';
export default {
  name: 'CompanyUser',
  components: { Treeselect },
  data() {
    return {
      pickerOptions,
      companyCode: undefined,
      userCode: undefined,
      showShipment: true,
      orgType: 1,
      // 遮罩层
      loading: true,
      // 按钮loading
      buttonLoading: false,
      resetLoading: false,
      // 选中数组
      ids: [],
      userNames: [],
      userCodes: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: '',
      // 部门树选项
      deptOptions: undefined,
      // 部门树键值转换
      normalizer(node) {
        return {
          id: node.code, // 键名转换，方法默认是label和children进行树状渲染
          label: node.label,
          children: node.children
        };
      },
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: '',
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      createOptions: [
        { dictLabel: '是', dictValue: '1' },
        { dictLabel: '否', dictValue: '2' }
      ],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: authorPre + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/system/user/importData'
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined,
        orgCode: undefined
      },
      // 表单校验
      rules: {
        userName: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' },
          { validator: this.formValidate.passWord, trigger: 'blur' }
        ],
        orgCode: [
          { required: true, message: '归属组织不能为空', trigger: ['change', 'blur'] }
        ],
        phonenumber: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: this.formValidate.telphone, trigger: 'blur' }
        ],
        email: [
          { validator: this.formValidate.email, trigger: 'blur' }
        ],
        roleCodes: [
          { required: true, message: '角色不能为空', trigger: ['change', 'blur'] }
        ]
      },
      // 重置密码
      pwTitle: '',
      pwOpen: false,
      userId: null,
      pwForm: {
        password: undefined
      },
      pwRules: {
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: this.formValidate.passWord, trigger: 'blur' }
        ]
      },
      roleDisabled: false
    };
  },
  computed: {
    ...mapGetters(['isAdmin', 'defaultRoleCode'])
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    const { user = {}} = getUserInfo() || {};
    this.companyCode = user.org.orgCode;
    this.userCode = user.userCode;
    this.getList();
    this.getTreeselect();
    /** 状态*/
    this.getDictsByType({ dictType: 'sys_normal_disable', dictPid: '0' }).then(response => {
      this.statusOptions = response.data;
    });
    /** 性别**/
    this.getDictsByType({ dictType: 'sys_user_sex', dictPid: '0' }).then(response => {
      this.sexOptions = response.data;
    });
    this.getConfigKey('sys.user.initPassword').then(response => {
      this.initPassword = response.msg;
    });
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      if (this.companyCode) {
        this.queryParams.orgCode = this.companyCode;
      }
      if (this.queryParams.orgCode1) {
        this.queryParams.orgCode = this.queryParams.orgCode1;
      }
      if (this.showShipment) {
        this.queryParams.showShipment = this.showShipment;
      }
      if (this.orgType) {
        this.queryParams.orgType = this.orgType;
      }
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      }
      );
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      // 只展示普通企业（1:发货企业 2:普通组织 3：发货企业下的组织）
      treeselect({ orgCode: this.companyCode, userCode: this.userCode, showShipment: this.showShipment, orgType: this.orgType }).then(response => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.orgCode1 = data.code;
      this.getList();
    },
    // 用户状态修改
    handleStatusChange(row) {
      const text = row.status === '0' ? '启用' : '停用';
      this.$confirm('确认要"' + text + '""' + row.userName + '"用户吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeUserStatus(row.userCode, row.status);
      }).then(() => {
        this.msgSuccess(text + '成功');
      }).catch(function() {
        row.status = row.status === '0' ? '1' : '0';
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        orgCode: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: '0',
        remark: undefined,
        isCreate: '2',
        postIds: [],
        roleCodes: []
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm('queryForm');
      this.queryParams.orgCode1 = undefined;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.userNames = selection.map(item => item.userName);
      this.userCodes = selection.map(item => item.userCode);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getTreeselect();
      getUser(null, { orgCode: this.companyCode, orgType: this.orgType, showShipment: this.showShipment }).then(response => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.open = true;
        this.title = '添加用户';
        this.form.password = this.initPassword;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      this.roleDisabled = false;
      const userId = row.userId || this.ids;
      getUser(userId, { orgCode: this.companyCode, orgType: this.orgType, showShipment: this.showShipment }).then(response => {
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.$set(this.form, 'postIds', response.roleCodes);
        this.$set(this.form, 'roleCodes', response.roleCodes);
        this.open = true;
        this.title = '修改用户';
        this.form.password = '';
        response.roleCodes.forEach(role => {
          if (this.defaultRoleCode.split(',').indexOf(role) > -1) {
            this.roleDisabled = true;
            return;
          }
        });
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.pwTitle = '请输入"' + row.userName + '"的新密码';
      this.userId = row.userId;
      this.pwOpen = true;
    },
    // 密码表单重置
    pwReset() {
      this.pwOpen = false;
      this.pwForm = {
        password: undefined
      };
      this.resetForm('pwForm');
    },
    submitResetPwd() {
      this.$refs['pwForm'].validate(valid => {
        if (valid) {
          this.resetLoading = true;
          resetUserPwd(this.userId, this.pwForm.password).then(response => {
            this.msgSuccess('修改成功，新密码是：' + this.pwForm.password);
            this.pwReset();
            this.resetLoading = false;
          }).catch(() => { this.resetLoading = false; });
        }
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          if (this.form.userId !== undefined) {
            updateUser(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.open = false;
              this.buttonLoading = false;
              this.getList();
            }).catch(() => { this.buttonLoading = false; });
          } else {
            addUser(Object.assign(this.form, { showShipment: this.showShipment })).then(response => {
              this.msgSuccess('新增成功');
              this.open = false;
              this.buttonLoading = false;
              this.getList();
            }).catch(() => { this.buttonLoading = false; });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      const userNames = row.userName || this.userNames;
      const userCodes = row.userCode || this.userCodes;
      const cantDelete = this.userCode === (Array.isArray(userCodes) ? userCodes.find(res => res === this.userCode) : userCodes);
      if (cantDelete) {
        this.msgWarning('无法删除当前账号');
      } else {
        this.$confirm('是否确认删除用户名为"' + userNames + '"的数据项?', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delUser(userIds);
        }).then(() => {
          this.getList();
          this.msgSuccess('删除成功');
        });
      }
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/user/export', {
        ...this.queryParams
      }, `用户信息`);
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = '用户导入';
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('system/user/importTemplate', {
        ...this.queryParams
      }, `用户信息模板`);
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    // 手动刷新校验
    selectOrgCode() {
      this.$nextTick(() => {
        this.$refs.form.validateField('orgCode');
      });
    }
  }
};
</script>
