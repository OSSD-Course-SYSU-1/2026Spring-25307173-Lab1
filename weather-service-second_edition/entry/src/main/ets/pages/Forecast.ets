import http from '@ohos.net.http';
import router from '@ohos.router';

interface ForecastItem {
  date: string;
  text: string;
  tempMin: string;
  tempMax: string;
}

interface ApiForecastMain {
  temp_min: number;
  temp_max: number;
}

interface ApiForecastWeather {
  description: string;
}

interface ApiForecastList {
  dt_txt: string;
  main: ApiForecastMain;
  weather: Array<ApiForecastWeather>;
}

interface ApiForecastResponse {
  list: Array<ApiForecastList>;
}

@Entry
@Component
struct Forecast {
  @State cityName: string = '未知城市';
  @State cityPinyin: string = '';
  @State isLoading: boolean = true;
  @State errorMsg: string = '';
  @State forecastData: Array<ForecastItem> = [];

  aboutToAppear() {
    let params = router.getParams() as Record<string, Object>;
    if (params) {
      if (params.cityName !== undefined) {
        this.cityName = params.cityName.toString();
      }
      if (params.cityPinyin !== undefined) {
        this.cityPinyin = params.cityPinyin.toString();
      }
    }
    this.get5DayForecast();
  }

  build() {
    Column() {
      // 头部导航栏 - 极简白字设计
      Row() {
        Text('<')
          .fontSize(32)
          .fontWeight(FontWeight.Lighter)
          .fontColor('#FFFFFF')
          .width(50)
          .padding({ left: 15 })
          .onClick(() => {
            router.back();
          })

        Text(`${this.cityName} 未来5天预报`)
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .fontColor('#FFFFFF')
          .flexGrow(1)
          .textAlign(TextAlign.Center)
          .margin({ right: 50 })
      }
      .width('100%')
      .padding({ top: 50, bottom: 15 }) // 顶部50的防遮挡你已经写得很棒了
      .backgroundColor('#2196f3')

      // 内容区域
      if (this.isLoading) {
        Column() {
          LoadingProgress().width(50).height(50).color('#2196f3')
          Text('正在努力加载5天预报...').fontColor('#666666').margin({ top: 10 })
        }
        .flexGrow(1)
        .justifyContent(FlexAlign.Center)
        .constraintSize({ maxWidth: 600 }) // ✨ [核心修改 1/2] 平板自适应：加载状态防拉伸
      } else if (this.errorMsg) {
        Column() {
          Text(this.errorMsg).fontColor(Color.Red).fontSize(16)
        }
        .flexGrow(1)
        .justifyContent(FlexAlign.Center)
        .constraintSize({ maxWidth: 600 }) // ✨ [核心修改 1/2] 平板自适应：错误状态防拉伸
      } else {
        List({ space: 12 }) {
          ForEach(this.forecastData, (item: ForecastItem) => {
            ListItem() {
              Row() {
                Text(item.date)
                  .fontSize(16)
                  .fontWeight(FontWeight.Medium)
                  .fontColor('#333333')
                  .width('30%')

                Text(item.text)
                  .fontSize(16)
                  .fontColor('#666666')
                  .width('30%')
                  .textAlign(TextAlign.Center)

                Text(`${item.tempMin}° ~ ${item.tempMax}°C`)
                  .fontSize(16)
                  .fontWeight(FontWeight.Bold)
                  .fontColor('#2196f3')
                  .width('40%')
                  .textAlign(TextAlign.End)
              }
              .width('100%')
              .padding(18)
              .backgroundColor('#FFFFFF')
              .borderRadius(12)
              .shadow({ radius: 2, color: 'rgba(0,0,0,0.05)', offsetX: 0, offsetY: 1 })
            }
          }, (item: ForecastItem) => item.date)
        }
        .width('92%')
        .margin({ top: 15 })
        .flexGrow(1)
        .constraintSize({ maxWidth: 600 }) // ✨ [核心修改 1/2] 平板自适应：列表内容防拉伸，保证卡片在大屏居中展现
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F7FA')
    // ✨ [核心修改 2/2] 沉浸式全屏：让灰白色的列表底色贯穿到底部导航条区域
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM])
  }

  async get5DayForecast(): Promise<void> {
    const httpRequest = http.createHttp();
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${this.cityPinyin}&appid=4f7d7b0a2a44edd8d940c704485b2b3b&units=metric&lang=zh_cn`;

    try {
      const res = await httpRequest.request(url, { method: http.RequestMethod.GET });
      if (res.responseCode === 200) {
        const data = JSON.parse(res.result as string) as ApiForecastResponse;

        // 按天聚合数据
        let dayMap: Record<string, Array<ApiForecastList>> = {};
        let items = data.list;

        for (let i = 0; i < items.length; i++) {
          let rawItem = items[i];
          let dateKey = rawItem.dt_txt.split(' ')[0];
          if (!dayMap[dateKey]) {
            dayMap[dateKey] = [];
          }
          dayMap[dateKey].push(rawItem);
        }

        let processedList: Array<ForecastItem> = [];
        let dateKeys = Object.keys(dayMap);

        for (let j = 0; j < dateKeys.length && processedList.length < 5; j++) {
          let dateStr = dateKeys[j];
          let dayItems = dayMap[dateStr];

          let maxTemp = -999;
          let minTemp = 999;
          let midIndex = Math.floor(dayItems.length / 2);
          let weatherText = dayItems[midIndex].weather[0].description;

          for (let k = 0; k < dayItems.length; k++) {
            if (dayItems[k].main.temp_max > maxTemp) {
              maxTemp = dayItems[k].main.temp_max;
            }
            if (dayItems[k].main.temp_min < minTemp) {
              minTemp = dayItems[k].main.temp_min;
            }
          }

          let formattedDate = dateStr.substring(5).replace('-', '/');

          processedList.push({
            date: formattedDate,
            text: weatherText,
            tempMin: Math.round(minTemp).toString(),
            tempMax: Math.round(maxTemp).toString()
          });
        }

        this.forecastData = processedList;
        this.isLoading = false;
      } else {
        this.errorMsg = `数据加载失败: ${res.responseCode}`;
        this.isLoading = false;
      }
    } catch (err) {
      this.errorMsg = '网络连接超时';
      this.isLoading = false;
    } finally {
      httpRequest.destroy();
    }
  }
}