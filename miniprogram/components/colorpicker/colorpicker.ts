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
    setR(e : WechatMiniprogram.CustomEvent) {
      this.setData({
        r: e.detail.value
      })
    },
    setG(e : WechatMiniprogram.CustomEvent) {
      this.setData({
        g: e.detail.value
      })
    },
    setB(e : WechatMiniprogram.CustomEvent) {
      this.setData({
        b: e.detail.value
      })
    }
  }
})
