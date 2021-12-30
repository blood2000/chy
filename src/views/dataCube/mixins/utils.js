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
      const { isFitWidth, isFitHeight } = style;
      for (const key in style) {
        if (key === 'width' && isFitWidth) {
          style[key] = style[key] + isFitWidth;
        } else if (key === 'height' && isFitHeight) {
          style[key] = style[key] + isFitHeight;
        } else if (this.numberToPxMap[key]) {
          style[key] = style[key] + 'px';
        }
      }
      if (isFitWidth) delete style[isFitWidth];
      if (isFitHeight) delete style[isFitHeight];
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
