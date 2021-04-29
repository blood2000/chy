<template>
  <div>
    <el-row>
      <!--产品应用版本树-->
      <el-col :lg="5" :md="6" :sm="7" :xs="24">
        <div class="app-container app-container--tree">
          <div class="head-container">
            <el-input
              v-model="produceName"
              placeholder="请输入关键字"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              class="mb20"
            />
          </div>
          <div class="head-container el-tree-scroll-container">
            <el-tree
              ref="tree"
              :data="produceOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              default-expand-all
              @node-click="handleNodeClick"
            />
          </div>
        </div>
      </el-col>
      <el-col :lg="19" :md="18" :sm="17" :xs="24">
        <div v-show="showSearch" class="app-container app-container--search">
          <el-form ref="queryForm" :model="queryParams" :inline="true">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input
                v-model="queryParams.menuName"
                placeholder="请输入菜单名称"
                clearable
                size="small"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="菜单状态" clearable filterable size="small">
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
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
                v-hasPermi="['system:menu:add']"
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="handleAdd"
              >新增</el-button>
            </el-col>
            <right-toolbar :show-search.sync="showSearch" @queryTable="getList" />
          </el-row>

          <el-table
            v-loading="loading"
            :data="menuList"
            row-key="menuId"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          >
            <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160" />
            <el-table-column prop="icon" label="图标" align="center" width="100">
              <template slot-scope="scope">
                <svg-icon :icon-class="scope.row.icon" />
              </template>
            </el-table-column>
            <el-table-column prop="orderNum" label="排序" width="60" />
            <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true" />
            <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true" />
            <el-table-column prop="status" label="状态" :formatter="statusFormat" width="80" />
            <el-table-column label="创建时间" align="center" prop="createTime">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
              <template slot-scope="scope">
                <el-button
                  v-hasPermi="['system:menu:edit']"
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleUpdate(scope.row)"
                >修改</el-button>
                <el-button
                  v-hasPermi="['system:menu:add']"
                  size="mini"
                  type="text"
                  icon="el-icon-plus"
                  @click="handleAdd(scope.row)"
                >新增</el-button>
                <el-button
                  v-hasPermi="['system:menu:remove']"
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                  @click="handleDelete(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-col :span="24">
            <el-form-item label="产品版本">
              <treeselect
                v-model="form.versionCode"
                :options="produceOptions"
                :normalizer="produceNormalizer"
                :show-count="true"
                placeholder="选择产品版本"
                @select="handleProduceNodeClick"
              />
            </el-form-item>
          </el-col>-->
        <el-row>
          <el-col :span="8">
            <el-form-item label="产品">
              <el-select
                v-model="form.produceCode"
                style="width: 100%;"
                placeholder="产品"
                clearable
                filterable
                @change="changeProduce"
              >
                <el-option
                  v-for="item in produceList"
                  :key="item.produceCode"
                  :label="item.cnName"
                  :value="item.produceCode"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="应用">
              <el-select
                v-model="form.appCode"
                style="width: 100%;"
                placeholder="应用"
                clearable
                filterable
                @change="changeApplication"
              >
                <el-option
                  v-for="item in appList"
                  :key="item.appCode"
                  :label="item.cnName"
                  :value="item.appCode"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="版本">
              <el-select
                v-model="form.versionCode"
                style="width: 100%;"
                placeholder="版本"
                clearable
                filterable
              >
                <el-option
                  v-for="item in appVersionList"
                  :key="item.appVersionCode"
                  :label="item.version"
                  :value="item.appVersionCode"
                  :disabled="item.disabled"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单">
              <treeselect
                v-model="form.parentId"
                :options="menuOptions"
                :normalizer="normalizer"
                :show-count="true"
                placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType != 'F'" :span="24">
            <el-form-item label="菜单图标" prop="icon">
              <el-popover
                placement="bottom-start"
                width="460"
                trigger="click"
                @show="$refs['iconSelect'].reset()"
              >
                <IconSelect ref="iconSelect" @selected="selected" />
                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
                  <svg-icon
                    v-if="form.icon"
                    slot="prefix"
                    :icon-class="form.icon"
                    class="el-input__icon"
                    style="height: 32px;width: 16px;"
                  />
                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />
                </el-input>
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType != 'F'" :span="12">
            <el-form-item label="是否外链">
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType != 'F'" :span="12">
            <el-form-item label="路由地址" prop="path">
              <el-input v-model="form.path" placeholder="请输入路由地址" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType == 'C'" :span="12">
            <el-form-item label="组件路径" prop="component">
              <el-input v-model="form.component" placeholder="请输入组件路径" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType != 'M'" :span="12">
            <el-form-item label="权限标识">
              <el-input v-model="form.perms" placeholder="请权限标识" maxlength="60" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType != 'F'" :span="12">
            <el-form-item label="显示状态">
              <el-radio-group v-model="form.visible">
                <el-radio
                  v-for="dict in visibleOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType != 'F'" :span="12">
            <el-form-item label="菜单状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                >{{ dict.dictLabel }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.menuType == 'C'" :span="12">
            <el-form-item label="是否缓存">
              <el-radio-group v-model="form.isCache">
                <el-radio label="0">缓存</el-radio>
                <el-radio label="1">不缓存</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" :disabled="btnDisabled" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from '@/api/system/menu';
import { listProduce } from '@/api/system/produce';
import { listApplication } from '@/api/system/application';
import { listAppVersion } from '@/api/system/appVersion';
import { versionTreeList } from '@/api/system/menu';
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import IconSelect from '@/components/IconSelect';

export default {
  name: 'Menu',
  components: { Treeselect, IconSelect },
  data() {
    return {
      // 遮罩层
      loading: true,
      btnDisabled: false,
      // 显示搜索条件
      showSearch: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 显示状态数据字典
      visibleOptions: [],
      // 菜单状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        menuName: undefined,
        visible: undefined
      },
      // 产品列表
      produceList: [],
      // 应用列表
      appList: [],
      // 版本列表
      appVersionList: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        menuName: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ],
        orderNum: [
          { required: true, message: '菜单顺序不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '路由地址不能为空', trigger: 'blur' }
        ],
        icon: [
          { required: true, message: '菜单图标不能为空', trigger: 'blur' }
        ]
      },
      // 产品应用版本名称
      produceName: undefined,
      // 产品应用版本树选项
      produceOptions: undefined,
      defaultProps: {
        children: 'children',
        label: 'cnName'
      }
    };
  },
  watch: {
    // 根据名称筛选产品版本树
    produceName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getVersionTreeselect();
    this.getList();
    this.getDictOption();
    this.getProduceList();
  },
  methods: {
    /** 获取字典**/
    getDictOption() {
      this.getDicts('sys_show_hide').then(response => {
        this.visibleOptions = response.data;
      });
      this.getDicts('sys_normal_disable').then(response => {
        this.statusOptions = response.data;
      });
    },
    /** 产品列表**/
    getProduceList() {
      listProduce().then(response => {
        this.produceList = response.data;
      });
    },
    changeProduce(e) {
      this.getApplicationList({ produceCode: e });
    },
    /** 应用列表 **/
    getApplicationList(data) {
      listApplication(data).then(response => {
        this.appList = response.data;
      });
    },
    changeApplication(e) {
      this.getAppVersionList({ appCode: e });
    },
    /** 版本列表**/
    getAppVersionList(data) {
      listAppVersion(data).then(response => {
        this.appVersionList = response.data;
      });
    },
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      listMenu(this.queryParams).then(response => {
        this.menuList = this.handleTree(response.data, 'menuId');
        this.loading = false;
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      };
    },
    /** 查询菜单下拉树结构 */
    getTreeselect(data = {}) {
      listMenu(data).then(response => {
        this.menuOptions = [];
        const menu = { menuId: 0, menuName: '主类目', children: [] };
        menu.children = this.handleTree(response.data, 'menuId');
        this.menuOptions.push(menu);
      });
    },
    // 显示状态字典翻译
    visibleFormat(row, column) {
      if (row.menuType === 'F') {
        return '';
      }
      return this.selectDictLabel(this.visibleOptions, row.visible);
    },
    // 菜单状态字典翻译
    statusFormat(row, column) {
      if (row.menuType === 'F') {
        return '';
      }
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        menuId: undefined,
        produceCode: undefined,
        appCode: undefined,
        versionCode: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        menuType: 'M',
        orderNum: undefined,
        isFrame: '1',
        isCache: '0',
        visible: '0',
        status: '0'
      };
      this.resetForm('form');
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm');
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.menuId) {
        this.form.parentId = row.menuId;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = '添加菜单';
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getMenu(row.menuId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = '修改菜单';
      });
    },
    /** 提交按钮 */
    submitForm: function() {
      this.btnDisabled = true;
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.menuId !== undefined) {
            updateMenu(this.form).then(response => {
              this.msgSuccess('修改成功');
              this.open = false;
              this.btnDisabled = false;
              this.getList();
            });
          } else {
            addMenu(this.form).then(response => {
              this.msgSuccess('新增成功');
              this.open = false;
              this.btnDisabled = false;
              this.getList();
            });
          }
        } else {
          this.btnDisabled = false;
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除名称为"' + row.menuName + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delMenu(row.menuId);
      }).then(() => {
        this.getList();
        this.msgSuccess('删除成功');
      });
    },
    /** 产品应用版本树 */
    getVersionTreeselect() {
      versionTreeList({ orgCode: this.companyCode }).then(response => {
        this.produceOptions = response.data;
      });
    },
    // 产品应用版本树筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.cnName.indexOf(value) !== -1;
    },
    // 产品应用版本树节点单击事件
    handleNodeClick(data) {
      if (data.type === 'produce') {
        this.queryParams.produceCode = data.code;
        this.queryParams.appCode = null;
        this.queryParams.versionCode = null;
      } else if (data.type === 'application') {
        this.queryParams.appCode = data.code;
        this.queryParams.produceCode = null;
        this.queryParams.versionCode = null;
      } else if (data.type === 'version') {
        this.queryParams.versionCode = data.code;
        this.queryParams.produceCode = null;
        this.queryParams.appCode = null;
      }
      this.getList();
    },
    // 转换产品数据结构
    produceNormalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.code,
        label: node.cnName,
        children: node.children
      };
    },
    // 产品树与上级菜单树联动
    handleProduceNodeClick(data) {
      const params = {};
      if (data.type === 'produce') {
        params.produceCode = data.code;
      } else if (data.type === 'application') {
        params.appCode = data.code;
      } else if (data.type === 'version') {
        params.versionCode = data.code;
      }
      this.getTreeselect(params);
    }
  }
};
</script>
