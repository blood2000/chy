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
      vnodes.push(<span class='svg-icon-box'><svg-icon icon-class={icon}/></span>);
    }

    if (title) {
      vnodes.push(<span slot='title' class='label'>{(title)}</span>);
    }
    return vnodes;
  }
};
</script>
