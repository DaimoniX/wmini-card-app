Component({
  properties: {
    r: Number,
    g: Number,
    b: Number
  },
  data: {
    rv: 125,
    gv: 125,
    bv: 125
  },
  observers: {
    "rv, gv, bv" : function(r, g, b) {
      this.triggerEvent("change", { r, g, b, rgb: `rgb(${r}, ${g}, ${b})` });
    }
  },
  methods: {
    setR(arg : WechatMiniprogram.CustomEvent) {
      this.setData({
        rv: arg.detail.value
      })
    },
    setG(arg : WechatMiniprogram.CustomEvent) {
      this.setData({
        gv: arg.detail.value
      })
    },
    setB(arg : WechatMiniprogram.CustomEvent) {
      this.setData({
        bv: arg.detail.value
      })
    }
  },
  lifetimes: {
    ready() {
      this.setData({
        rv: this.data.r,
        gv: this.data.g,
        bv: this.data.b
      })
    }
  }
})
