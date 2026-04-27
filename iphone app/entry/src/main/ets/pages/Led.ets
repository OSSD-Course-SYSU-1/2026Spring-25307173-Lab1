/*
 * Copyright (c) 2025 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { window } from '@kit.ArkUI';
import { Settings } from '../model/Settings';

@ComponentV2
export struct Led {
  @Local settings: Settings = new Settings('', 88, FontWeight.Regular);
  @Local offsetX: number = 0; // 文字偏移量，用于控制滚动

  aboutToAppear(): void {
    // 根据速度计算动画持续时间
    const duration = this.calculateDuration(this.settings.speed);
    // 启动动画
    this.startMarqueeAnimation(duration);
  }

  calculateDuration(speed: number): number {
    // 速度值越大，动画持续时间越短（滚动越快）
    // 速度范围：50-200，对应持续时间：8000ms-2000ms
    return 8000 - (speed - 50) * 40;
  }

  startMarqueeAnimation(duration: number): void {
    // 重置偏移量
    this.offsetX = 0;
    
    // 使用动画实现滚动效果
    animateTo({
      duration: duration,
      curve: Curve.Linear,
      iterations: -1, // 无限循环
      onFinish: () => {
        // 动画完成后重置位置
        this.offsetX = 0;
      }
    }, () => {
      // 从右向左滚动，假设文本宽度为屏幕宽度的2倍
      this.offsetX = -2000; // 滚动的距离
    });
  }

  build() {
    NavDestination() { // 使用NavDestination作为目标页面的根容器
      Column() { // 垂直容器：让文字居中显示
        Row() {
          Text(this.settings.content)
            .fontSize(this.settings.fontSize) // 绑定字号变量
            .fontWeight(this.settings.fontWeight)
            .fontColor('#FFFFFF')
            .offset({ x: this.offsetX }) // 应用水平偏移
        }
        .width('200%') // 宽度设为200%以确保有足够的滚动空间
        .justifyContent(FlexAlign.Start)
      }
      .width('100%')
      .height('100%')
      .justifyContent(FlexAlign.Center)
      .clip(true) // 裁剪超出部分
    }
    .onReady((context: NavDestinationContext) => {
      this.settings = context.pathInfo.param as Settings;
    }) // NavDestination内组件开始加载前执行，可以得到组件上下文信息，并获取到页面跳转时携带的参数
    .width('100%')
    .height('100%')
    .backButtonIcon($r('app.media.chevron_left'))
    .preferredOrientation(window.Orientation.LANDSCAPE) // 强制横屏（弹幕更适合横屏展示）
    .linearGradient({ // 设置背景线性渐变
      direction: GradientDirection.Right, // 渐变方向
      colors: [
        ['#013C9C', 0.0],
        ['#3066E4', 0.5],
        ['#43A1F4', 1.0]
      ]
    })
  }
}

// 构建页面函数，配置在route_map.json5文件中，需要跳转至本页面时自动调用
@Builder
export function LedBuilder() {
  Led();
}