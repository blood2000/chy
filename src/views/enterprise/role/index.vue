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
              :data="deptTreeOptions"
              :props="defaultTreeProps"
              :expand-on-click-node="false"
              :filter-node-method="filterDepNode"
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
      <el-col :lg="19" :md="18" :sm="17" :xs="24">
        <div class="app-container app-container--search">
          <el-form v-show="showSearch" ref="queryForm" :model="queryParams" :inline="true" label-width="80px">
            <el-form-item label="角色名称" prop="roleName">
              <el-input
                v-model.trim="queryParams.roleName"
                placeholder="请输入角色名称"
                clearable
                size="small"
                style="width: 240px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <!-- <el-form-item label="权限字符" prop="roleKey">
                          <el-input
                            v-model="queryParams.roleKey"
                            placeholder="请输入权限字符"
                            clearable
                            size="small"
                            style="width: 240px"
                            @keyup.enter.native="handleQuery"
                          />
                        </el-form-item>-->
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="角色状态"
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
            <!-- <el-form-item label="产品" prop="produceCode">
              <el-select
                v-model="queryParams.produceCode"
                placeholder="所属产品"
                clearable
                filterable
                size="small"
                style="width: 240px"
              >
                <el-option
                  v-for="item in produceList"
                  :key="item.produceCode"
                  :label="item.cnName"
                  :value="item.produceCode"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item> -->
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
                v-hasPermi="['system:role:add']"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
              >新增</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-hasPermi="['system:role:edit']"
                type="success"
                icon="el-icon-edit"
                size="mini"
                :disabled="single || isSystemDisabled"
                @click="handleUpdate"
              >修改</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-hasPermi="['system:role:remove']"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                :disabled="multiple || isSystemDisabled"
                @click="handleDelete"
              >删除</el-button>
            </el-col>
            <el-col :span="1.5">
              <el-button
                v-hasPermi="['system:role:export']"
                type="warning"
                icon="el-icon-download"
                size="mini"
                @click="handleExport"
              >导出</el-button>
            </el-col>
            <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
          </el-row>

          <el-table v-loading="loading" :data="roleList" highlight-current-row border @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="所属产品" prop="produceName" align="center" />
            <el-table-column label="角色名称" prop="roleName" align="center" :show-overflow-tooltip="true" />
            <!-- <el-table-column label="权限字符" prop="roleKey" align="center" :show-overflow-tooltip="true" /> -->
            <el-table-column label="显示顺序" prop="roleSort" align="center" />
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-value="0"
                  inactive-value="1"
                  :disabled="isOperate(scope.row)"
                  @change="handleStatusChange(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" fixed="left" width="160">
              <template slot-scope="scope">
                <el-button
                  v-hasPermi="['system:role:edit']"
                  size="mini"
                  type="text"
                  :disabled="isOperate(scope.row)"
                  @click="handleUpdate(scope.row)"
                >修改</el-button>
                <el-button
                  v-hasPermi="['system:role:edit']"
                  size="mini"
                  type="text"
                  :disabled="isOperate(scope.row)"
                  @click="handleDataScope(scope.row)"
                >数据权限</el-button>
                <el-button
                  v-hasPermi="['system:role:remove']"
                  size="mini"
                  type="text"
                  :disabled="isOperate(scope.row)"
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
      </el-col>
    </el-row>

    <!-- 添加或修改角色配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="1000px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item v-if="!form.roleId" label="所属组织" prop="orgCode" :rules="[{ required: true, message: '所属组织不能为空', trigger: 'change' }]">
              <!-- <el-tree
                ref="tree"
                class="tree-border"
                :data="deptTreeOptions"
                :props="defaultTreeProps"
                :expand-on-click-node="false"
                :indent="0"
                @node-click="handleOrgClick"
              /> -->
              <treeselect
                v-model="form.orgCode"
                :options="deptTreeOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="请选择所属组织"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="所属产品" prop="produceCode">
              <el-select v-model="form.produceCode" disabled clearable filterable placeholder="请选择所属产品" style="width: 100%">
                <el-option
                  v-for="item in produceList"
                  :key="item.produceCode"
                  :label="item.cnName"
                  :value="item.produceCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="form.roleName" placeholder="请输入角色名称" />
            </el-form-item>
            <!--<el-form-item label="权限字符" prop="roleKey">
                          <el-input v-model="form.roleKey" placeholder="请输入权限字符" />
                        </el-form-item>-->
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="权限范围" prop="dataScope">
              <el-select v-model="form.dataScope" clearable filterable style="width: 100%">
                <el-option
                  v-for="item in dataScopeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="角色顺序" prop="roleSort">
              <el-input-number v-model="form.roleSort" style="width: 90%;" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col :span="7">
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
        <el-form-item v-show="form.dataScope == 2" label="数据权限">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
          <el-tree
            ref="dept"
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            node-key="code"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="暂无数据"
            :props="defaultProps"
            :indent="0"
          />
        </el-form-item>
        <el-form-item label="菜单权限" class="mb0">
          <el-checkbox v-model="menuExpand" @change="handleCheckedTreeExpand($event, 'menu')">展开/折叠</el-checkbox>
          <el-checkbox v-model="menuNodeAll" @change="handleCheckedTreeNodeAll($event, 'menu')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.menuCheckStrictly" @change="handleCheckedTreeConnect($event, 'menu')">父子联动</el-checkbox>
          <el-row :gutter="12" class="mb20">
            <!-- <el-col :span="10">
              <el-tree
                ref="versionTree"
                class="tree-border"
                :data="produceOptions"
                :props="produceDefaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                default-expand-all
                :indent="0"
                @node-click="handleVersionNodeClick"
              />
            </el-col> -->
            <el-col :span="24">
              <el-tree
                ref="menu"
                class="tree-border own-version-menu-tree"
                :data="menuOptions"
                show-checkbox
                node-key="code"
                :check-strictly="!form.menuCheckStrictly"
                :indent="0"
                empty-text="暂无数据"
                :props="defaultProps"
                :default-expanded-keys="defaultExpandedKeys"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="buttonLoading" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 分配角色数据权限对话框 -->
    <el-dialog :title="title" :visible.sync="openDataScope" width="60%" append-to-body :close-on-click-modal="false">
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="form.roleName" :disabled="true" />
        </el-form-item>
        <!-- <el-form-item label="权限字符">
                  <el-input v-model="form.roleKey" :disabled="true" />
                </el-form-item>-->
        <el-form-item label="权限范围">
          <el-select v-model="form.dataScope" clearable filterable>
            <el-option
              v-for="item in dataScopeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-show="form.dataScope == 2" label="数据权限">
          <el-checkbox v-model="deptExpand" @change="handleCheckedTreeExpand($event, 'dept')">展开/折叠</el-checkbox>
          <el-checkbox v-model="deptNodeAll" @change="handleCheckedTreeNodeAll($event, 'dept')">全选/全不选</el-checkbox>
          <el-checkbox v-model="form.deptCheckStrictly" @change="handleCheckedTreeConnect($event, 'dept')">父子联动</el-checkbox>
          <el-tree
            ref="dept"
            class="tree-border"
            :data="deptOptions"
            show-checkbox
            default-expand-all
            node-key="code"
            :check-strictly="!form.deptCheckStrictly"
            empty-text="暂无数据"
            :indent="0"
            :props="defaultProps"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="dataScopeLoading" @click="submitDataScope">确 定</el-button>
        <el-button @click="cancelDataScope">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listRole, getRole, delRole, addRole, updateRole, dataScope, changeRoleStatus, producelist } from '@/api/system/role';
import { treeselect2 as menuTreeselect, roleMenuTreeselect2, versionTreeList } from '@/api/system/menu';
import { treeselect as deptTreeselect, roleDeptTreeselect } from '@/api/system/dept';
import { mapGetters } from 'vuex';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import { getUserInfo } from '@/utils/auth';
import { pickerOptions } from '@/utils/dateRange';

export default {
  name: 'CompanyRole',
  components: {
    Treeselect
  },
  data() {
    return {
      pickerOptions,
      companyCode: undefined,
      userCode: undefined,
      showShipment: true,
      orgType: 1,
      buttonLoading: false,
      dataScopeLoading: false,
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
      // 角色表格数据
      roleList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层（数据权限）
      openDataScope: false,
      menuExpand: false,
      menuNodeAll: false,
      deptExpand: true,
      deptNodeAll: false,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 数据范围选项
      dataScopeOptions: [
        {
          value: '1',
          label: '全部数据权限'
        },
        {
          value: '2',
          label: '自定数据权限'
        },
        {
          value: '3',
          label: '本部门数据权限'
        },
        {
          value: '4',
          label: '本部门及以下数据权限'
        },
        {
          value: '5',
          label: '仅本人数据权限'
        },
        {
          value: '6',
          label: '本部门网点及以下数据权限'
        }
      ],
      // 菜单列表
      menuOptions: [],
      menuAllKeys: [],
      // 部门列表
      deptOptions: [],
      // 产品列表
      produceList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        roleName: undefined,
        roleKey: undefined,
        status: undefined,
        orgCode: undefined,
        produceCode: '776ca8e240574192b6e0f69b417163df'
      },
      // 表单参数
      form: {
        dataScope: '6'
      },
      defaultProps: {
        children: 'children',
        label: 'cnName'
      },
      defaultExpandedKeys: [],
      // 表单校验
      rules: {
        /* orgCode: [
          { required: true, message: '所属组织不能为空', trigger: 'change' }
        ],*/
        produceCode: [
          { required: true, message: '所属产品不能为空', trigger: 'change' }
        ],
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ],
        roleKey: [
          { required: true, message: '权限字符不能为空', trigger: 'blur' }
        ],
        roleSort: [
          { required: true, message: '角色顺序不能为空', trigger: 'blur' }
        ],
        dataScope: [
          { required: true, message: '数据权限不能为空', trigger: 'blur' }
        ]
      },
      // 部门名称
      deptName: undefined,
      // 部门树选项
      deptTreeOptions: undefined,
      defaultTreeProps: {
        children: 'children',
        label: 'label'
      },
      // 部门树键值转换
      normalizer(node) {
        return {
          id: node.code, // 键名转换，方法默认是label和children进行树状渲染
          label: node.label,
          children: node.children
        };
      },
      // 产品应用版本树选项
      produceOptions: undefined,
      produceDefaultProps: {
        children: 'children',
        label: 'cnName'
      },
      isSystemDisabled: false,
      currentOrgCode: undefined
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
    this.getProduceList();
    this.getDeptTree();
    this.getList();
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data;
    });
    if (!this.isAdmin) {
      this.dataScopeOptions = [
        {
          value: '3',
          label: '本部门数据权限'
        },
        {
          value: '4',
          label: '本部门及以下数据权限'
        },
        {
          value: '5',
          label: '仅本人数据权限'
        },
        {
          value: '6',
          label: '本部门网点及以下数据权限'
        }];
    }
    this.form.dataScope = '4';
  },
  methods: {
    getProduceList() {
      producelist().then(response => {
        this.produceList = response.data;
      });
    },
    /** 查询角色列表 */
    getList() {
      this.loading = true;
      if (this.currentOrgCode) {
        this.queryParams.orgCode = this.currentOrgCode;
      } else if (this.companyCode) {
        this.queryParams.orgCode = this.companyCode;
      }
      if (this.showShipment) {
        this.queryParams.showShipment = this.showShipment;
      }
      if (this.orgType) {
        this.queryParams.orgType = this.orgType;
      }
      listRole(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.roleList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询菜单树结构 */
    getMenuTreeselect(data = { produceCode: '776ca8e240574192b6e0f69b417163df' }) {
      menuTreeselect(data, this.userCode).then(response => {
        this.menuOptions = response.data;
        this.defaultExpandedKeys = response.expandKeys;
        this.menuAllKeys = response.allKeys;
      });
    },
    /** 查询部门树结构 */
    getDeptTreeselect() {
      deptTreeselect().then(response => {
        this.deptOptions = response.data;
      });
    },
    // 所有菜单节点数据
    getMenuAllCheckedKeys() {
      // 目前被选中的菜单节点
      const checkedKeys = this.$refs.menu.getCheckedKeys();
      // 半选中的菜单节点
      const halfCheckedKeys = this.$refs.menu.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    // 所有部门节点数据
    getDeptAllCheckedKeys() {
      // 目前被选中的部门节点
      const checkedKeys = this.$refs.dept.getCheckedKeys();
      // 半选中的部门节点
      const halfCheckedKeys = this.$refs.dept.getHalfCheckedKeys();
      checkedKeys.unshift.apply(checkedKeys, halfCheckedKeys);
      return checkedKeys;
    },
    /** 根据角色ID查询菜单树结构 */
    getRoleMenuTreeselect(roleId, data) {
      return roleMenuTreeselect2(roleId, data).then(response => {
        this.menuOptions = response.menus;
        this.defaultExpandedKeys = response.expandKeys;
        this.menuAllKeys = response.allKeys;
        return response;
      });
    },
    /** 根据角色ID查询部门树结构 */
    getRoleDeptTreeselect(roleId) {
      return roleDeptTreeselect(roleId).then(response => {
        this.deptOptions = response.depts;
        return response;
      });
    },
    // 角色状态修改
    handleStatusChange(row) {
      const text = row.status === '0' ? '启用' : '停用';
      this.$confirm('确认要"' + text + '""' + row.roleName + '"角色吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return changeRoleStatus(row.roleCode, row.status);
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
    // 取消按钮（数据权限）
    cancelDataScope() {
      this.openDataScope = false;
      this.reset();
    },
    // 表单重置
    reset() {
      if (this.$refs.menu !== undefined) {
        this.$refs.menu.setCheckedKeys([]);
      }
      this.menuExpand = false;
      this.menuNodeAll = false;
      this.deptExpand = true;
      this.deptNodeAll = false;
      this.form = {
        roleId: undefined,
        roleName: undefined,
        produceCode: '776ca8e240574192b6e0f69b417163df',
        roleKey: undefined,
        roleSort: 0,
        status: '0',
        menuCodes: [],
        /*  menuIds: [],*/
        orgCodes: [],
        menuCheckStrictly: true,
        deptCheckStrictly: true,
        remark: undefined,
        currentOrgCode: undefined
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm('queryForm');
      this.queryParams.orgCode = undefined;
      this.currentOrgCode = undefined;
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      // 判断内置角色不允许操作
      this.isSystemDisabled = false;
      selection.map(item => {
        if (this.isOperate(item)) {
          this.isSystemDisabled = true;
          return;
        }
      });
      // console.log(this.isSystemDisabled);
      this.ids = selection.map(item => item.roleId);
      this.names = selection.map(item => item.roleName);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand(value, type) {
      if (type === 'menu') {
        const treeList = this.menuOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.menu.store.nodesMap[treeList[i].code].expanded = value;
        }
      } else if (type === 'dept') {
        const treeList = this.deptOptions;
        for (let i = 0; i < treeList.length; i++) {
          this.$refs.dept.store.nodesMap[treeList[i].code].expanded = value;
        }
      }
    },
    // 树权限（全选/全不选）
    handleCheckedTreeNodeAll(value, type) {
      if (type === 'menu') {
        this.$refs.menu.setCheckedKeys(value ? this.menuAllKeys : []);
        // this.$refs.menu.setCheckedNodes(value ? this.menuOptions : []);
      } else if (type === 'dept') {
        this.$refs.dept.setCheckedNodes(value ? this.deptOptions : []);
      }
    },
    // 树权限（父子联动）
    handleCheckedTreeConnect(value, type) {
      if (type === 'menu') {
        this.form.menuCheckStrictly = !!value;
      } else if (type === 'dept') {
        this.form.deptCheckStrictly = !!value;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      // this.getVersionTreeselect();
      this.getMenuTreeselect();
      this.getProduceList();
      this.open = true;
      this.title = '添加角色';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      // this.getVersionTreeselect();
      const roleId = row.roleId || this.ids;
      const roleMenu = this.getRoleMenuTreeselect(roleId, { produceCode: '776ca8e240574192b6e0f69b417163df' });
      this.getProduceList();
      getRole(roleId).then(response => {
        this.form = response.data;
        this.open = true;
        this.$nextTick(() => {
          roleMenu.then(res => {
            this.$refs.menu.setCheckedKeys(res.checkedKeys);
          });
        });
        this.title = '修改角色';
      });
    },
    /** 分配数据权限操作 */
    handleDataScope(row) {
      this.reset();
      const roleDeptTreeselect = this.getRoleDeptTreeselect(row.roleId);
      getRole(row.roleId).then(response => {
        this.form = response.data;
        this.openDataScope = true;
        this.$nextTick(() => {
          roleDeptTreeselect.then(res => {
            this.$refs.dept.setCheckedKeys(res.checkedKeys);
          });
        });
        this.title = '分配数据权限';
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.buttonLoading = true;
          this.form.menuCodes = this.getMenuAllCheckedKeys();
          if (this.form.roleId !== undefined) {
            updateRole(this.form).then(response => {
              this.buttonLoading = false;
              this.msgSuccess('修改成功');
              this.open = false;
              this.getList();
            }).catch(() => {
              this.buttonLoading = false;
            });
          } else {
            addRole(this.form).then(response => {
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
    /** 提交按钮（数据权限） */
    submitDataScope: function() {
      if (this.form.roleId !== undefined) {
        this.dataScopeLoading = true;
        this.form.orgCodes = this.getDeptAllCheckedKeys();
        dataScope(this.form).then(response => {
          this.msgSuccess('修改成功');
          this.openDataScope = false;
          this.dataScopeLoading = false;
          this.getList();
        }).catch(() => {
          this.dataScopeLoading = false;
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const roleIds = row.roleId || this.ids;
      const names = row.roleName || this.names;
      this.$confirm('是否确认删除角色名称为"' + names + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delRole(roleIds);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/role/export', {
        ...this.queryParams
      }, `角色信息`);
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeselect({ orgCode: this.companyCode, userCode: this.userCode, showShipment: this.showShipment, orgType: this.orgType }).then(response => {
        this.deptTreeOptions = response.data;
      });
    },
    // 部门树筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 部门树节点单击事件
    handleNodeClick(data) {
      this.currentOrgCode = data.code;
      this.getList();
    },
    filterDepNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleOrgClick(data) {
      this.form.orgCode = data.code;
    },
    // 产品应用版本树
    getVersionTreeselect() {
      versionTreeList({ orgCode: this.companyCode }).then(response => {
        this.produceOptions = response.data;
      });
    },
    // 版本树节点单击事件
    // handleVersionNodeClick(data) {
    //   const params = {};
    //   if (data.type === 'produce') {
    //     params.produceCode = data.code;
    //   } else if (data.type === 'application') {
    //     params.appCode = data.code;
    //   } else if (data.type === 'version') {
    //     params.versionCode = data.code;
    //   }
    //   if (this.form.roleId !== undefined) {
    //     const roleMenu = this.getRoleMenuTreeselect(this.form.roleId, params);
    //     roleMenu.then(res => {
    //       this.$refs.menu.setCheckedKeys(res.checkedKeys);
    //     });
    //   } else {
    //     this.getMenuTreeselect(params);
    //   }
    // },
    // 判断操作是否禁用
    isOperate(row) {
      const some = this.defaultRoleCode.split(',').some(el => {
        return el === row.roleCode || row.isSystem === 1;
      });
      if (!this.isAdmin && some) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss">
.own-version-menu-tree{
  .el-tree-node__content{
    .el-checkbox{
      &.is-disabled{
        display: none;
      }
    }
  }
}
</style>
