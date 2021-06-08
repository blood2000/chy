<template>
  <!-- 重写菜单-仅支持到3级菜单 -->
  <div class="s-side-menu-content">
    <el-scrollbar ref="elScroll" :class="settings.sideTheme" style="height: 100%">
      <ul class="s-side-menu">
        <li
          v-for="(item, index) in sidebarMenu"
          :ref="item.path + index"
          :key="item.path + index"
          :class="{isOpen: isOpen === item.path + index}"
          class="s-side-menu-item"
          @mouseenter="openMenu(item.path + index, item)"
          @mouseleave="closeMenu()"
        >
          <a v-if="item.children && item.children.length > 0" class="ly-flex-v ly-flex-pack-center ly-flex-align-center">
            <span class="iconfont" :class="'icon-' + item.meta.icon" />
            <span class="label">{{ item.meta.title }}</span>
          </a>
          <app-link v-else :to="item.path" class="ly-flex-v ly-flex-pack-center ly-flex-align-center">
            <span class="iconfont" :class="'icon-' + item.meta.icon" />
            <span class="label">{{ item.meta.title }}</span>
          </app-link>
          <!-- 展开的菜单 -->
          <div
            v-if="item.children && item.children.length > 0"
            :style="[{top: panelTop},{bottom: panelBottom},{width: panelWidth}]"
            :class="{show: isOpen === item.path + index}"
            class="s-side-menu-item__panel"
          >
            <ul>
              <template v-for="(value, vi) in item.children">
                <li v-if="!value.hidden" :key="value.path + vi" class="panel-item">
                  <a v-if="value.children && value.children.length === 0" class="second-menu">{{ value.meta.title }}</a>
                  <app-link v-else :to="value.path" :class="{isActive: value.path == activeMenu}" class="panel-item-router">{{ value.meta.title }}</app-link>
                </li>
              </template>
            </ul>
          </div>
        </li>
      </ul>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import AppLink from '../Sidebar/Link';

export default {
  components: {
    AppLink
  },
  data() {
    return {
      sidebarMenu: [],
      isOpen: '',
      panelTop: '',
      panelBottom: '',
      panelWidth: '160px'
    };
  },
  computed: {
    ...mapState(['settings']),
    ...mapGetters(['sidebarRouters']),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    }
  },
  mounted() {
    this.setNewMenu();
    this.handleScroll();
  },
  methods: {
    // 重新构造菜单结构
    setNewMenu() {
      this.sidebarMenu = JSON.parse(JSON.stringify(this.sidebarRouters));
      this.sidebarMenu.forEach(firstMenu => {
        if (firstMenu.children && firstMenu.children.length > 0) {
          const child = JSON.parse(JSON.stringify(firstMenu.children));
          firstMenu.children = [];
          this.eachMenu(firstMenu, child, firstMenu.path);
        }
      });
      // console.log('原路由:', this.sidebarRouters);
      // console.log('重构目录:', this.sidebarMenu);
    },
    eachMenu(firstMenu, children, path) {
      children.forEach(el => {
        if (path && !this.isExternal(path) && !this.isExternal(el.path)) {
          el.path = path + '/' + el.path;
        }
        firstMenu.children.push(el);
        if (el.children && el.children.length > 0) {
          const child = JSON.parse(JSON.stringify(el.children));
          el.children = [];
          this.eachMenu(firstMenu, child, el.path);
        }
      });
    },
    isExternal(path) {
      return /^(https?:|mailto:|tel:)/.test(path);
    },
    openMenu(path, item) {
      this.isOpen = path;
      this.setPanelPosition(path, item);
    },
    closeMenu() {
      this.isOpen = '';
    },
    handleScroll() {
      const scrollbarEl = this.$refs.elScroll.wrap;
      scrollbarEl.onscroll = () => {
        this.closeMenu();
      };
    },
    // 计算展开菜单的位置
    setPanelPosition(refDom, item) {
      this.panelWidth = '160px';
      if (item.children && item.children.length > 0) {
        const child = item.children.filter(el => {
          if (!el.hidden) return true;
        });
        const headerHeight = 70; // 70: headerHeight
        const $clintHeight = document.documentElement.clientHeight;
        const $panelHeight = 44 * child.length + 40; // 40: padding  44: panelItemHeight
        const $offsetTop = this.$refs[refDom][0].offsetTop;
        const $scrollHeight = this.$refs.elScroll.wrap.scrollTop;

        // console.log('clintHeight: ', $clintHeight);
        // console.log('panelHeight: ', $panelHeight);
        // console.log('offsetTop:', $offsetTop);
        // console.log('scrollHeight: ', $scrollHeight);
        // console.log('======================');

        const panelTop = ($offsetTop - $scrollHeight + headerHeight) - ($panelHeight / 2) + 43; // 43 = 86 / 2
        // console.log(panelTop);

        if ($panelHeight + headerHeight > $clintHeight) {
          // console.log('高度撑满');
          this.panelTop = headerHeight + 'px';
          this.panelBottom = 0 + 'px';
          // 菜单超出, 设置panel宽度
          const oneColumnItemNum = parseInt(($clintHeight - headerHeight - 40) / 44);
          const columnNum = Math.ceil(child.length / oneColumnItemNum);
          this.panelWidth = columnNum * 160 + 'px';
        } else if (panelTop < headerHeight) {
          // console.log('顶部超出');
          this.panelTop = headerHeight + 'px';
          this.panelBottom = '';
        } else if (panelTop + $panelHeight > $clintHeight) {
          // console.log('底部超出');
          this.panelTop = '';
          this.panelBottom = 0 + 'px';
        } else {
          // console.log('默认位置');
          this.panelTop = panelTop + 'px';
          this.panelBottom = '';
        }
      }
    }
  }
};
</script>

<style lang="scss" soped>
// 70: headerHeight
.s-side-menu-content{
  width: 72px;
  height: calc(100% - 70px);
  position: absolute;
  left: 0;
  top: 70px;
  .s-side-menu{
    padding-top: 20px;
    .s-side-menu-item{
      width: 52px;
      height: 86px;
      padding-left: 4px;
      margin-left: 8px;
      margin-right: 12px;
      color: #9FA2B5;
      cursor: pointer;
      transition: color 0.3s;
      position: relative;
      .iconfont{
        font-size: 24px;
        margin-bottom: 8px;
      }
      .label{
        font-size: 12px;
      }
      >a{
        z-index: 1;
        height: 100%;
        position: relative;
      }
      &::after{
        content: '';
        position: absolute;
        top: 50%;
        margin-top: -57px;
        left: 0;
        width: 0px;
        height: 114px;
        background: url('~@/assets/images/navBar/nav_bg.png') no-repeat;
        background-size: 100% 100%;
        z-index: 0;
        opacity: 0;
        transition: opacity 0.3s;
      }

      // 选中菜单样式
      &.isOpen{
        color: #409EFF;
        transition: color 0.3s;
        &::after{
          opacity: 1;
          transition: opacity 0.3s;
          width: 64px;
        }
      }

      // 展开的目录
      .s-side-menu-item__panel{
        position: fixed;
        left: 72px;
        padding: 20px 0;
        background: #F2F7FC;
        box-shadow: 8px 0px 8px rgba(145, 147, 148, 0.15);
        display: none;
        z-index: 2100;
        opacity: 0;
        &.show{
          display: block;
          animation: show-panel 0.3s;
          opacity: 1;
        }
        @keyframes show-panel {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        >ul{
          height: 100%;
          display: flex;
          flex-direction: column;
          flex-wrap: wrap;
          animation: show-panel 0.3s;
          justify-content: flex-start;
        }

        .panel-item{
          width: 160px;
          height: 44px;
          line-height: 44px;
          color: #717171;
          >a{
            display: block;
            width: 100%;
            height: 100%;
          }
          >.panel-item-router{
            position: relative;
            padding: 0 20px 0 28px;
            transition: all 0.3s;
            &::before{
              content: '';
              width: 2px;
              height: 2px;
              border-radius: 2px;
              background: #717171;
              position: absolute;
              left: 18px;
              top: 50%;
              transition: all 0.3s;
            }
            &::after{
              content: '';
              width: 3px;
              height: 100%;
              position: absolute;
              right: 0;
              top: 0;
              background: #409EFF;
              opacity: 0;
              transition: all 0.3s;
            }

            // 选中样式
            &:hover{
              background: rgba(215, 234, 253, 0.5) !important;
              color: #409EFF;
              &::before{
                background: #409EFF;
                transition: all 0.3s;
              }
              &::after{
                opacity: 0.9;
                transition: all 0.3s;
              }
            }
            &.isActive{
              background: #D7EAFD !important;
              font-weight: bold;
              color: #409EFF;
              transition: all 0.3s;
              &::before{
                background: #409EFF;
                transition: all 0.3s;
              }
              &::after{
                opacity: 1;
                transition: all 0.3s;
              }
            }
          }
          >.second-menu{
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #717171;
            padding: 0 20px 0 18px;
          }
        }
      }

    }
  }

  .el-scrollbar__bar.is-vertical{
    display: none !important;
  }
}
</style>
