<template>
  <div :class="{'has-logo':showLogo}" :style="{ backgroundColor: settings.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <el-scrollbar :class="settings.sideTheme" wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="settings.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg"
        :text-color="settings.sideTheme === 'theme-dark' ? variables.menuText : 'rgba(0,0,0,.65)'"
        :unique-opened="true"
        :active-text-color="settings.theme"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(route, index) in sidebarMenu"
          :key="route.path + index"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import Logo from './Logo';
import SidebarItem from './SidebarItem';
import variables from '@/assets/styles/variables.scss';

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      sidebarMenu: []
    };
  },
  computed: {
    ...mapState(['settings']),
    ...mapGetters(['sidebarRouters', 'sidebar']),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  mounted() {
    this.setNewMenu();
  },
  methods: {
    // 重新构造菜单结构
    setNewMenu() {
      this.sidebarMenu = JSON.parse(JSON.stringify(this.sidebarRouters));
      this.sidebarMenu.forEach(firstMenu => {
        if (firstMenu.children && firstMenu.children.length > 0) {
          const child = JSON.parse(JSON.stringify(firstMenu.children));
          firstMenu.children = [];
          this.eachMenu(firstMenu, child);
        }
      });
      // console.log('原路由:', this.sidebarRouters);
      // console.log('重构目录:', this.sidebarMenu);
    },
    eachMenu(firstMenu, children, path) {
      children.forEach(el => {
        if (path) {
          el.path = path + '/' + el.path;
        }
        firstMenu.children.push(el);
        if (el.children && el.children.length > 0) {
          const child = JSON.parse(JSON.stringify(el.children));
          el.children = [];
          this.eachMenu(firstMenu, child, el.path);
        }
      });
    }
  }
};
</script>
