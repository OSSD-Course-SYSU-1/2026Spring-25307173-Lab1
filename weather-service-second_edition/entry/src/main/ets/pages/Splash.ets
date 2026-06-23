import router from '@ohos.router';

@Entry
@Component
struct Splash {
  @State opacityValue: number = 0;
  @State scaleValue: number = 0.8;
  @State rotateAngle: number = 0;
  @State sunGlow: number = 1;

  aboutToAppear(): void {
    // 1. 启动封面入场动画
    animateTo({
      duration: 1000,
      curve: Curve.EaseOut
    }, () => {
      this.opacityValue = 1;
      this.scaleValue = 1;
    });

    // 2. 太阳旋转与光晕动画
    animateTo({ duration: 8000, iterations: -1, curve: Curve.Linear }, () => {
      this.rotateAngle = 360;
    });
    animateTo({ duration: 1500, iterations: -1, playMode: PlayMode.Alternate, curve: Curve.EaseInOut }, () => {
      this.sunGlow = 1.2;
    });

    // 3. 关键：3秒后跳转到天气主页
    setTimeout(() => {
      router.replaceUrl({
        url: 'pages/Index' // 确保这里指向你显示天气的那个文件名
      });
    }, 3000); // 3秒持续时间
  }

  build() {
    Stack() {
      // 蓝天背景
      Column()
        .width('100%')
        .height('100%')
        .linearGradient({
          angle: 180,
          colors: [['#0d47a1', 0.0], ['#2196f3', 1.0]]
        })

      // 核心内容容器
      Column({ space: 30 }) {
        // 太阳动画图标
        Stack() {
          Circle()
            .width(150)
            .height(150)
            .fill('#FFEB3B')
            .scale({ x: this.sunGlow, y: this.sunGlow })
            .opacity(0.3)

          // 太阳主体
          Circle()
            .width(100)
            .height(100)
            .fill('#FFEB3B')
            .shadow({ radius: 20, color: '#FFEB3B' })

          // 太阳光芒
          ForEach([0, 45, 90, 135, 180, 225, 270, 315], (angle: number) => {
            Row()
              .width(4)
              .height(40)
              .backgroundColor('#FFEB3B')
              .rotate({ angle: angle })
              .translate({ x: 0, y: -70 })
          })
        }
        .rotate({ angle: this.rotateAngle })

        Text('宇飞天气')
          .fontSize(48)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFFFFF')

        Text('准备出门了么？快看看天气')
          .fontSize(18)
          .fontColor('#E3F2FD')
          .opacity(0.8)

        // 底部加载小点
        LoadingProgress()
          .width(40)
          .height(40)
          .color('#FFFFFF')
          .margin({ top: 100 })
      }
      .opacity(this.opacityValue)
      .scale({ x: this.scaleValue, y: this.scaleValue })
      // ✨ [核心修改 1/2] 平板自适应：保证里面的太阳和文字在超大屏幕上也是居中聚拢的，不会散开
      .constraintSize({ maxWidth: 600 })
    }
    .width('100%')
    .height('100%')
    // ✨ [核心修改 2/2] 沉浸式全屏：让蓝天背景的渐变色彻底铺满刘海屏和底部导航条区域
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
  }
}