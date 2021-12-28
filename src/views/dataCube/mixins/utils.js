export default {
  data() {
    return {
      numberToPxMap: {
        'width': true,
        'height': true,
        'top': true,
        'left': true,
        'font-size': true,
        'letter-spacing': true,
        'line-height': true,
        'border-radius': true,
        'border-width': true
      },
      removePropertyMap: {
        'position': true,
        'top': true,
        'left': true
      }
    };
  },
  methods: {
    numberToPx(obj) {
      const style = Object.assign({}, obj);
      for (const key in style) {
        if (this.numberToPxMap[key]) {
          style[key] = style[key] + 'px';
        }
      }
      return style;
    },
    removePosition(obj) {
      const style = Object.assign({}, obj);
      for (const key in style) {
        if (this.removePropertyMap[key]) {
          delete style[key];
        }
      }
      return style;
    }
  }
};
