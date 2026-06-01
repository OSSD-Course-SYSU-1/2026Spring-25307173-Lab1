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
    // 修复：强转为安全的映射对象，防止系统报错
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
      // 头部导航栏
      // 头部导航栏 - 包含更加美观的返回图标
      Row() {
        // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
        // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
        Text('<')
          .fontSize(32)
          .fontWeight(FontWeight.Lighter) // 💡 修复这里：加上 er，变成 Lighter
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
          .margin({ right: 50 }) // 右侧占位，确保中间的文字绝对居中
      }
      .width('100%')
      .padding({ top: 50, bottom: 15 })
      .backgroundColor('#2196f3')

      // 内容区域
      if (this.isLoading) {
        Column() {
          LoadingProgress().width(50).height(50).color('#2196f3')
          Text('正在努力加载5天预报...').fontColor('#666666').margin({ top: 10 })
        }.flexGrow(1).justifyContent(FlexAlign.Center)
      } else if (this.errorMsg) {
        Column() {
          Text(this.errorMsg).fontColor(Color.Red).fontSize(16)
        }.flexGrow(1).justifyContent(FlexAlign.Center)
      } else {
        List({ space: 12 }) {
          // 修复：为 ForEach 提供严格的字符串 Key 标识生成器，防止编译报错
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
            }
          }, (item: ForecastItem) => item.date)
        }
        .width('92%')
        .margin({ top: 15 })
        .flexGrow(1)
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F7FA')
  }

  async get5DayForecast(): Promise<void> {
    const httpRequest = http.createHttp();
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${this.cityPinyin}&appid=4f7d7b0a2a44edd8d940c704485b2b3b&units=metric&lang=zh_cn`;

    try {
      const res = await httpRequest.request(url, { method: http.RequestMethod.GET });
      if (res.responseCode === 200) {
        const data = JSON.parse(res.result as string) as ApiForecastResponse;
        let processedList: Array<ForecastItem> = [];
        let items = data.list;

        for (let i = 0; i < items.length; i++) {
          let rawItem = items[i];
          // 挑选每天中午 12 时的快照作为全天晴雨温度趋势代表
          if (rawItem.dt_txt.indexOf('12:00:00') !== -1) {
            let dateStr = rawItem.dt_txt.substring(5, 10).replace('-', '/');
            processedList.push({
              date: dateStr,
              text: rawItem.weather[0].description,
              tempMin: Math.round(rawItem.main.temp_min).toString(),
              tempMax: Math.round(rawItem.main.temp_max).toString()
            });
          }
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