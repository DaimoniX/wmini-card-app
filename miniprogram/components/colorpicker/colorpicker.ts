Component({
  properties: {
    r: Number,
    g: Number,
    b: Number
  },
  observers: {
    "r, g, b" : function(r, g, b) {
      this.triggerEvent("change", { r, g, b, rgb: `rgb(${r}, ${g}, ${b})` });
    }
  },
  methods: {
    setR(arg : WechatMiniprogram.CustomEvent) {
      this.setData({
        r: arg.detail.value
      })
    },
    setG(arg : WechatMiniprogram.CustomEvent) {
      this.setData({
        g: arg.detail.value
      })
    },
    setB(arg : WechatMiniprogram.CustomEvent) {
      this.setData({
        b: arg.detail.value
      })
    }
  }
})
