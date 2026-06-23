import http from '@ohos.net.http';
import router from '@ohos.router';
import dataPreferences from '@ohos.data.preferences';

// ======================
// 类型定义
// ======================
interface WeatherData {
  obsTime: string;
  temp: number;
  feelsLike: string;
  text: string;
  windDir: string;
  windScale: string;
  humidity: string;
  uvIndex: number;
  aqi: number;
  willRainInFuture: boolean;
}

interface WeatherMain {
  temp: number;
  feels_like: number;
  humidity: number;
}

interface WeatherItem {
  description: string;
  main?: string;
}

interface WeatherWind {
  speed: number;
}

interface WeatherResponse {
  main: WeatherMain;
  weather: Array<WeatherItem>;
  wind: WeatherWind;
}

interface CityInfo {
  name: string;
  pinyin: string;
}

interface LifeIndexItem {
  title: string;
  icon: string;
}

interface ThemeColors {
  pageBg: string;
  cardBg: string;
  mainText: string;
  subText: string;
}

@Entry
@Component
struct Index {
  @State isLoading: boolean = false;
  @State errorMsg: string = '';
  @State isRefreshing: boolean = false;

  @State @Watch('onWeatherChange') weather: WeatherData = initWeatherData();

  @State currentTheme: ThemeColors = { pageBg: '#4FC3F7', cardBg: 'rgba(255, 255, 255, 0.25)', mainText: '#FFFFFF', subText: '#E3F2FD' };
  @State lifeIndexData: Array<LifeIndexItem> = [];

  private cityList: Array<CityInfo> = [
    { name: '北京', pinyin: 'Beijing' },
    { name: '上海', pinyin: 'Shanghai' },
    { name: '广州', pinyin: 'Guangzhou' },
    { name: '深圳', pinyin: 'Shenzhen' },
    { name: '天津', pinyin: 'Tianjin' },
    { name: '重庆', pinyin: 'Chongqing' },
    { name: '石家庄', pinyin: 'Shijiazhuang' },
    { name: '太原', pinyin: 'Taiyuan' },
    { name: '呼和浩特', pinyin: 'Hohhot' },
    { name: '沈阳', pinyin: 'Shenyang' },
    { name: '长春', pinyin: 'Changchun' },
    { name: '哈尔滨', pinyin: 'Harbin' },
    { name: '南京', pinyin: 'Nanjing' },
    { name: '杭州', pinyin: 'Hangzhou' },
    { name: '合肥', pinyin: 'Hefei' },
    { name: '福州', pinyin: 'Fuzhou' },
    { name: '南昌', pinyin: 'Nanchang' },
    { name: '济南', pinyin: 'Jinan' },
    { name: '郑州', pinyin: 'Zhengzhou' },
    { name: '武汉', pinyin: 'Wuhan' },
    { name: '长沙', pinyin: 'Changsha' },
    { name: '南宁', pinyin: 'Nanning' },
    { name: '海口', pinyin: 'Haikou' },
    { name: '成都', pinyin: 'Chengdu' },
    { name: '贵阳', pinyin: 'Guiyang' },
    { name: '昆明', pinyin: 'Kunming' },
    { name: '拉萨', pinyin: 'Lhasa' },
    { name: '西安', pinyin: "Xi'an" },
    { name: '兰州', pinyin: 'Lanzhou' },
    { name: '西宁', pinyin: 'Xining' },
    { name: '银川', pinyin: 'Yinchuan' },
    { name: '乌鲁木齐', pinyin: 'Urumqi' },
    { name: '香港', pinyin: 'Hong Kong' },
    { name: '澳门', pinyin: 'Macau' },
    { name: '台北', pinyin: 'Taipei' }
  ];

  @State currentCity: CityInfo = { name: '北京', pinyin: 'Beijing' };

  aboutToAppear() {
    this.initApp();
  }

  async initApp() {
    await this.loadCityPreference();
    this.getWeather();
  }

  async loadCityPreference() {
    try {
      let pref = await dataPreferences.getPreferences(getContext(this), 'WeatherStore');
      let savedCityName = await pref.get('savedCity', '北京') as string;
      let foundCity = this.cityList.find(c => c.name === savedCityName);
      if (foundCity) {
        this.currentCity = foundCity;
      }
    } catch (err) {
      console.error('加载本地城市偏好失败');
    }
  }

  async saveCityPreference(cityName: string) {
    try {
      let pref = await dataPreferences.getPreferences(getContext(this), 'WeatherStore');
      await pref.put('savedCity', cityName);
      await pref.flush();
    } catch (err) {
      console.error('保存城市偏好失败');
    }
  }

  onWeatherChange() {
    this.currentTheme = this.getThemeColors();
    this.lifeIndexData = this.getLifeIndexData();
  }

  getThemeColors(): ThemeColors {
    const text = this.weather.text || '';
    if (text.includes('晴')) return { pageBg: '#5E92F3', cardBg: 'rgba(255, 255, 255, 0.25)', mainText: '#FFFFFF', subText: '#E3F2FD' };
    else if (text.includes('云') || text.includes('阴')) return { pageBg: '#78909C', cardBg: 'rgba(255, 255, 255, 0.2)', mainText: '#FFFFFF', subText: '#ECEFF1' };
    else if (text.includes('雨') || text.includes('暴')) return { pageBg: '#0277BD', cardBg: 'rgba(0, 0, 0, 0.15)', mainText: '#FFFFFF', subText: '#B3E5FC' };
    else if (text.includes('雪') || text.includes('冰')) return { pageBg: '#90A4AE', cardBg: 'rgba(255, 255, 255, 0.3)', mainText: '#FFFFFF', subText: '#F5F7F8' };
    else if (text.includes('霾') || text.includes('沙') || text.includes('尘')) return { pageBg: '#8D6E63', cardBg: 'rgba(255, 255, 255, 0.2)', mainText: '#FFFFFF', subText: '#D7CCC8' };
    else return { pageBg: '#4FC3F7', cardBg: 'rgba(255, 255, 255, 0.25)', mainText: '#FFFFFF', subText: '#E3F2FD' };
  }

  getLifeIndexData(): Array<LifeIndexItem> {
    const w = this.weather;
    const temp = w.temp;
    const text = w.text;
    let indexList: Array<LifeIndexItem> = [];

    if (temp >= 26) indexList.push({ title: '适宜短袖', icon: '👕' });
    else if (temp >= 15 && temp < 26) indexList.push({ title: '适宜长袖', icon: '👔' });
    else if (temp >= 5 && temp < 15) indexList.push({ title: '适宜大衣', icon: '🧥' });
    else indexList.push({ title: '需穿羽绒服', icon: '🧥' });

    if (text.includes('晴') || w.uvIndex >= 6) indexList.push({ title: '注意防晒', icon: '🕶️' });
    else indexList.push({ title: '紫外线较弱', icon: '☁️' });

    const isBadWeatherForOutdoor = text.includes('雨') || text.includes('雪') || text.includes('沙') || text.includes('霾');
    if (w.aqi > 100 || isBadWeatherForOutdoor) indexList.push({ title: '宜室内运动', icon: '🏠' });
    else indexList.push({ title: '适宜户外', icon: '🏃' });

    if (w.willRainInFuture) indexList.push({ title: '不宜洗车', icon: '🌧️' });
    else indexList.push({ title: '适宜洗车', icon: '🚗' });

    if (text.includes('雨') || text.includes('雪') || text.includes('暴')) indexList.push({ title: '记得带伞', icon: '☔' });
    else indexList.push({ title: '不用带伞', icon: '🌂' });

    if (temp < 10 || isBadWeatherForOutdoor) indexList.push({ title: '极易感冒', icon: '💊' });
    else if (temp >= 10 && temp < 20) indexList.push({ title: '较易感冒', icon: '🤧' });
    else indexList.push({ title: '少发感冒', icon: '🛡️' });

    return indexList;
  }

  build() {
    Column() {
      // 标题栏
      Row() {
        Text('宇飞天气')
          .fontSize(16)
          .fontWeight(FontWeight.Medium)
          .fontColor(this.currentTheme.subText)
      }
      .width('100%')
      // ✨ [核心修改 1/3] 防刘海遮挡：将原本的 top: 40 加大到了 top: 50
      .padding({ top: 50, bottom: 10 })
      .backgroundColor(Color.Transparent)
      .justifyContent(FlexAlign.Center)

      Refresh({ refreshing: $$this.isRefreshing }) {
        Scroll() {
          Stack({ alignContent: Alignment.Center }) {

            // 🎈 底层：主要内容区域
            Column({ space: 15 }) {
              // 城市切换选择器
              Row({ space: 10 }) {
                Text('选择城市:')
                  .fontSize(18)
                  .fontWeight(FontWeight.Medium)
                  .fontColor(this.currentTheme.mainText)

                Select(this.getSelectOptions())
                  .selected(0)
                  .value(this.currentCity.name)
                  .font({ size: 16, weight: FontWeight.Medium })
                  .fontColor(this.currentTheme.mainText)
                  .selectedOptionFont({ size: 16, weight: FontWeight.Medium })
                  .optionFont({ size: 16, weight: FontWeight.Normal })
                  .backgroundColor(Color.Transparent)
                  .onSelect((index: number) => {
                    this.currentCity = this.cityList[index];
                    this.saveCityPreference(this.currentCity.name);
                    this.getWeather();
                  })
              }
              .width('90%')
              .justifyContent(FlexAlign.Start)
              .padding({ left: 10, top: 10 })

              // 天气主要信息
              Column({ space: 10 }) {
                Text(`${this.currentCity.name} 实时天气`)
                  .fontSize(22)
                  .fontWeight(FontWeight.Bold)
                  .fontColor(this.currentTheme.mainText);

                Text(`${this.weather.temp}°C`)
                  .fontSize(58)
                  .fontWeight(FontWeight.Bold)
                  .fontColor(this.currentTheme.mainText);

                Text(this.weather.text)
                  .fontSize(20)
                  .fontColor(this.currentTheme.subText);

                // 详细数据面板
                Column({ space: 10 }) {
                  Row() { Text('体感温度').fontSize(15).fontColor(this.currentTheme.subText).flexGrow(1); Text(`${this.weather.feelsLike}°C`).fontSize(15).fontColor(this.currentTheme.mainText) }.width('100%')
                  Row() { Text('湿度').fontSize(15).fontColor(this.currentTheme.subText).flexGrow(1); Text(`${this.weather.humidity}%`).fontSize(15).fontColor(this.currentTheme.mainText) }.width('100%')
                  Row() { Text('更新时间').fontSize(15).fontColor(this.currentTheme.subText).flexGrow(1); Text(this.weather.obsTime).fontSize(15).fontColor(this.currentTheme.mainText) }.width('100%')
                }
                .padding(15)
                .backgroundColor(this.currentTheme.cardBg)
                .borderRadius(12)
                .width('90%')

                if (this.errorMsg) {
                  Text(this.errorMsg).fontColor(Color.Red).fontSize(14).backgroundColor('rgba(255,255,255,0.8)').padding(4).borderRadius(4);
                }

                // 未来五天天气预报卡片
                Row() {
                  Column() {
                    Text('查看未来 5 天天气预报')
                      .fontSize(16)
                      .fontWeight(FontWeight.Bold)
                      .fontColor(this.currentTheme.mainText)
                    Text('包含多云、晴天趋势及温度变化范围')
                      .fontSize(13)
                      .fontColor(this.currentTheme.subText)
                      .margin({ top: 4 })
                  }
                  .alignItems(HorizontalAlign.Start)
                  .flexGrow(1)
                }
                .width('90%')
                .padding(15)
                .margin({ top: 15 })
                .backgroundColor(this.currentTheme.cardBg)
                .borderRadius(12)
                .shadow({ radius: 4, color: 'rgba(0,0,0,0.1)', offsetX: 0, offsetY: 2 })
                .onClick(() => {
                  router.pushUrl({
                    url: 'pages/Forecast',
                    params: {
                      'cityName': this.currentCity.name,
                      'cityPinyin': this.currentCity.pinyin
                    }
                  }).catch(() => {});
                })

                // 动态生活指数网格卡片
                Grid() {
                  ForEach(this.lifeIndexData, (item: LifeIndexItem) => {
                    GridItem() {
                      Column({ space: 8 }) {
                        Text(item.icon).fontSize(28)
                        Text(item.title).fontSize(14).fontColor(this.currentTheme.mainText).fontWeight(FontWeight.Medium)
                      }
                      .justifyContent(FlexAlign.Center)
                      .alignItems(HorizontalAlign.Center)
                      .width('100%')
                      .height('100%')
                    }
                    .border({
                      width: { right: 0.5, bottom: 0.5 },
                      color: 'rgba(255, 255, 255, 0.15)'
                    })
                  })
                }
                .columnsTemplate('1fr 1fr 1fr')
                .rowsTemplate('1fr 1fr')
                .width('90%')
                .height(180)
                .margin({ top: 15 })
                .padding(5)
                .backgroundColor(this.currentTheme.cardBg)
                .borderRadius(20)
                .shadow({ radius: 6, color: 'rgba(0,0,0,0.1)', offsetX: 0, offsetY: 3 })

              }
              .width('100%')
              .padding({ bottom: 40 })
            }
            .width('100%')
            // ✨ [核心修改 2/3] 平板自适应防拉伸：限制所有卡片的最大宽度为 600
            .constraintSize({ maxWidth: 600 })
            .opacity((this.isLoading && !this.isRefreshing) ? 0.3 : 1.0)
            .animation({ duration: 300, curve: Curve.EaseInOut })

            // 🎈 顶层：加载动画悬浮层
            if (this.isLoading && !this.isRefreshing) {
              Column({ space: 15 }) {
                LoadingProgress()
                  .width(60)
                  .height(60)
                  .color(this.currentTheme.mainText)
                Text('获取气象数据中...')
                  .fontSize(14)
                  .fontColor(this.currentTheme.mainText)
              }
              .padding(30)
              .backgroundColor(this.currentTheme.cardBg)
              .borderRadius(20)
              .shadow({ radius: 10, color: 'rgba(0,0,0,0.15)', offsetX: 0, offsetY: 5 })
            }

          }
          .width('100%')
        }
        .scrollBar(BarState.Off)
        .width('100%')
        .height('100%')
        .align(Alignment.Top)
      }
      .onRefreshing(() => {
        this.getWeather();
      })
      .layoutWeight(1)
    }
    .width('100%')
    .height('100%')
    .backgroundColor(this.currentTheme.pageBg)
    .animation({ duration: 500, curve: Curve.EaseInOut })
    // ✨ [核心修改 3/3] 沉浸式全屏：让背景色顶破天际线，延伸到状态栏和导航栏区域
    .expandSafeArea([SafeAreaType.SYSTEM], [SafeAreaEdge.TOP, SafeAreaEdge.BOTTOM]);
  }

  getSelectOptions(): Array<SelectOption> {
    let options: Array<SelectOption> = [];
    for (let i = 0; i < this.cityList.length; i++) {
      let item: SelectOption = { value: this.cityList[i].name };
      options.push(item);
    }
    return options;
  }

  async getWeather(): Promise<void> {
    this.isLoading = true;
    this.errorMsg = '';
    const httpRequest = http.createHttp();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${this.currentCity.pinyin}&appid=4f7d7b0a2a44edd8d940c704485b2b3b&units=metric&lang=zh_cn`;

    try {
      const res = await httpRequest.request(url, { method: http.RequestMethod.GET });
      if (res.responseCode === 200) {
        const data = JSON.parse(res.result as string) as WeatherResponse;
        this.weather = getWeatherDataFromResponse(data);
      } else {
        this.errorMsg = `错误：${res.responseCode}`;
      }
    } catch (err) {
      this.errorMsg = '网络错误';
    } finally {
      this.isLoading = false;
      this.isRefreshing = false;
      httpRequest.destroy();
    }
  }
}

function initWeatherData(): WeatherData {
  return {
    obsTime: '', temp: 0, feelsLike: '--', text: '暂无数据',
    windDir: '--', windScale: '--', humidity: '--',
    uvIndex: 0, aqi: 0, willRainInFuture: false
  };
}

function getWeatherDataFromResponse(data: WeatherResponse): WeatherData {
  const textDesc = data.weather[0].description;
  const simulatedAqi = textDesc.includes('霾') ? 150 : (textDesc.includes('雨') ? 30 : 60);
  const simulatedUv = textDesc.includes('晴') ? 8 : 3;
  const simulatedFutureRain = Math.random() > 0.7;

  return {
    obsTime: new Date().toLocaleTimeString(),
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like).toString(),
    text: textDesc,
    windDir: '东风',
    windScale: data.wind.speed.toFixed(1),
    humidity: data.main.humidity.toString(),
    uvIndex: simulatedUv,
    aqi: simulatedAqi,
    willRainInFuture: simulatedFutureRain
  };
}