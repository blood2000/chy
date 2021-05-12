<script>
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  render(h, context) {
    const { icon, title } = context.props;
    const vnodes = [];

    if (icon) {
      const node = <span class='svg-icon-box'><span class='svg-icon-box'><span class={'svg-icon iconfont icon-nav-system icon-nav-' + icon} /></span></span>;
      vnodes.push(node);
    }

    if (title) {
      vnodes.push(<span slot='title' class='label'>{(title)}</span>);
    }
    return vnodes;
  }
};
</script>
