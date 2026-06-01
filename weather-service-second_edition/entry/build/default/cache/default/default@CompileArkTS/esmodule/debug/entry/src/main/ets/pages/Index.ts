if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    isLoading?: boolean;
    errorMsg?: string;
    weather?: WeatherData;
    isRefreshing?: boolean;
    cityList?: Array<CityInfo>;
    currentCity?: CityInfo;
}
import http from "@ohos:net.http";
import router from "@ohos:router";
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
interface HttpRequestOptions {
    method: http.RequestMethod;
}
interface CityInfo {
    name: string;
    pinyin: string;
}
interface LifeIndexItem {
    title: string;
    icon: string;
}
// ✨ 新增：定义主题颜色结构
interface ThemeColors {
    pageBg: string; // 整个页面的背景色
    cardBg: string; // 面板/卡片的背景色（使用半透明，实现毛玻璃融合效果）
    mainText: string; // 主标题/大字颜色
    subText: string; // 次要文字颜色
}
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__isLoading = new ObservedPropertySimplePU(false, this, "isLoading");
        this.__errorMsg = new ObservedPropertySimplePU('', this, "errorMsg");
        this.__weather = new ObservedPropertyObjectPU(initWeatherData(), this, "weather");
        this.__isRefreshing = new ObservedPropertySimplePU(false, this, "isRefreshing");
        this.cityList = [
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
        this.__currentCity = new ObservedPropertyObjectPU({ name: '北京', pinyin: 'Beijing' }, this, "currentCity");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.errorMsg !== undefined) {
            this.errorMsg = params.errorMsg;
        }
        if (params.weather !== undefined) {
            this.weather = params.weather;
        }
        if (params.isRefreshing !== undefined) {
            this.isRefreshing = params.isRefreshing;
        }
        if (params.cityList !== undefined) {
            this.cityList = params.cityList;
        }
        if (params.currentCity !== undefined) {
            this.currentCity = params.currentCity;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMsg.purgeDependencyOnElmtId(rmElmtId);
        this.__weather.purgeDependencyOnElmtId(rmElmtId);
        this.__isRefreshing.purgeDependencyOnElmtId(rmElmtId);
        this.__currentCity.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isLoading.aboutToBeDeleted();
        this.__errorMsg.aboutToBeDeleted();
        this.__weather.aboutToBeDeleted();
        this.__isRefreshing.aboutToBeDeleted();
        this.__currentCity.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __errorMsg: ObservedPropertySimplePU<string>;
    get errorMsg() {
        return this.__errorMsg.get();
    }
    set errorMsg(newValue: string) {
        this.__errorMsg.set(newValue);
    }
    private __weather: ObservedPropertyObjectPU<WeatherData>;
    get weather() {
        return this.__weather.get();
    }
    set weather(newValue: WeatherData) {
        this.__weather.set(newValue);
    }
    private __isRefreshing: ObservedPropertySimplePU<boolean>;
    get isRefreshing() {
        return this.__isRefreshing.get();
    }
    set isRefreshing(newValue: boolean) {
        this.__isRefreshing.set(newValue);
    }
    private cityList: Array<CityInfo>;
    private __currentCity: ObservedPropertyObjectPU<CityInfo>;
    get currentCity() {
        return this.__currentCity.get();
    }
    set currentCity(newValue: CityInfo) {
        this.__currentCity.set(newValue);
    }
    aboutToAppear() {
        this.getWeather();
    }
    // 🔥 核心 UI 逻辑：根据天气动态生成主题色
    getThemeColors(): ThemeColors {
        const text = this.weather.text || '';
        // 晴天：浅蓝色系
        if (text.includes('晴')) {
            return { pageBg: '#5E92F3', cardBg: 'rgba(255, 255, 255, 0.25)', mainText: '#FFFFFF', subText: '#E3F2FD' };
        }
        // 多云/阴天：灰色系
        else if (text.includes('云') || text.includes('阴')) {
            return { pageBg: '#78909C', cardBg: 'rgba(255, 255, 255, 0.2)', mainText: '#FFFFFF', subText: '#ECEFF1' };
        }
        // 下雨：湖蓝色系
        else if (text.includes('雨') || text.includes('暴')) {
            return { pageBg: '#0277BD', cardBg: 'rgba(0, 0, 0, 0.15)', mainText: '#FFFFFF', subText: '#B3E5FC' };
        }
        // 下雪：浅灰蓝色
        else if (text.includes('雪') || text.includes('冰')) {
            return { pageBg: '#90A4AE', cardBg: 'rgba(255, 255, 255, 0.3)', mainText: '#FFFFFF', subText: '#F5F7F8' };
        }
        // 雾霾/沙尘：棕灰色
        else if (text.includes('霾') || text.includes('沙') || text.includes('尘')) {
            return { pageBg: '#8D6E63', cardBg: 'rgba(255, 255, 255, 0.2)', mainText: '#FFFFFF', subText: '#D7CCC8' };
        }
        // 默认/其他：清爽蓝
        else {
            return { pageBg: '#4FC3F7', cardBg: 'rgba(255, 255, 255, 0.25)', mainText: '#FFFFFF', subText: '#E3F2FD' };
        }
    }
    getLifeIndexData(): Array<LifeIndexItem> {
        const w = this.weather;
        const temp = w.temp;
        const text = w.text;
        let indexList: Array<LifeIndexItem> = [];
        if (temp >= 26)
            indexList.push({ title: '适宜短袖', icon: '👕' });
        else if (temp >= 15 && temp < 26)
            indexList.push({ title: '适宜长袖', icon: '👔' });
        else if (temp >= 5 && temp < 15)
            indexList.push({ title: '适宜大衣', icon: '🧥' });
        else
            indexList.push({ title: '需穿羽绒服', icon: '🧥' });
        if (text.includes('晴') || w.uvIndex >= 6)
            indexList.push({ title: '注意防晒', icon: '🕶️' });
        else
            indexList.push({ title: '紫外线较弱', icon: '☁️' });
        const isBadWeatherForOutdoor = text.includes('雨') || text.includes('雪') || text.includes('沙') || text.includes('霾');
        if (w.aqi > 100 || isBadWeatherForOutdoor)
            indexList.push({ title: '宜室内运动', icon: '🏠' });
        else
            indexList.push({ title: '适宜户外', icon: '🏃' });
        if (w.willRainInFuture)
            indexList.push({ title: '不宜洗车', icon: '🌧️' });
        else
            indexList.push({ title: '适宜洗车', icon: '🚗' });
        if (text.includes('雨') || text.includes('雪') || text.includes('暴'))
            indexList.push({ title: '记得带伞', icon: '☔' });
        else
            indexList.push({ title: '不用带伞', icon: '🌂' });
        if (temp < 10 || isBadWeatherForOutdoor)
            indexList.push({ title: '极易感冒', icon: '💊' });
        else if (temp >= 10 && temp < 20)
            indexList.push({ title: '较易感冒', icon: '🤧' });
        else
            indexList.push({ title: '少发感冒', icon: '🛡️' });
        return indexList;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Context.animation({ duration: 500, curve: Curve.EaseInOut });
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(this.getThemeColors().pageBg);
            Context.animation(null);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 1. 标题栏 (改成透明背景，文字跟着主题变)
            Row.create();
            // 1. 标题栏 (改成透明背景，文字跟着主题变)
            Row.width('100%');
            // 1. 标题栏 (改成透明背景，文字跟着主题变)
            Row.padding({ top: 40, bottom: 10 });
            // 1. 标题栏 (改成透明背景，文字跟着主题变)
            Row.backgroundColor(Color.Transparent);
            // 1. 标题栏 (改成透明背景，文字跟着主题变)
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('宇飞天气');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(this.getThemeColors().subText);
        }, Text);
        Text.pop();
        // 1. 标题栏 (改成透明背景，文字跟着主题变)
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Refresh.create({ refreshing: { value: this.isRefreshing, changeEvent: newValue => { this.isRefreshing = newValue; } } });
            Refresh.onRefreshing(() => {
                this.getWeather();
            });
            Refresh.layoutWeight(1);
        }, Refresh);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.scrollBar(BarState.Off);
            Scroll.width('100%');
            Scroll.height('100%');
            Scroll.align(Alignment.Top);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 15 });
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 城市切换选择器
            Row.create({ space: 10 });
            // 城市切换选择器
            Row.width('90%');
            // 城市切换选择器
            Row.justifyContent(FlexAlign.Start);
            // 城市切换选择器
            Row.padding({ left: 10, top: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('选择城市:');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Medium);
            Text.fontColor(this.getThemeColors().mainText);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Select.create(this.getSelectOptions());
            Select.selected(0);
            Select.value(this.currentCity.name);
            Select.font({ size: 16, weight: FontWeight.Medium });
            Select.fontColor(this.getThemeColors().mainText);
            Select.selectedOptionFont({ size: 16, weight: FontWeight.Medium });
            Select.optionFont({ size: 16, weight: FontWeight.Normal });
            Select.backgroundColor(Color.Transparent);
            Select.onSelect((index: number) => {
                this.currentCity = this.cityList[index];
                this.getWeather();
            });
        }, Select);
        Select.pop();
        // 城市切换选择器
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 天气主要信息
            Column.create({ space: 10 });
            // 天气主要信息
            Column.width('100%');
            // 天气主要信息
            Column.padding({ bottom: 40 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.currentCity.name} 实时天气`);
            Text.fontSize(22);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.getThemeColors().mainText);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.weather.temp}°C`);
            Text.fontSize(58);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.getThemeColors().mainText);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.weather.text);
            Text.fontSize(20);
            Text.fontColor(this.getThemeColors().subText);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 详细数据面板
            Column.create({ space: 10 });
            // 详细数据面板
            Column.padding(15);
            // 详细数据面板
            Column.backgroundColor(this.getThemeColors().cardBg);
            // 详细数据面板
            Column.borderRadius(12);
            // 详细数据面板
            Column.width('90%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('体感温度');
            Text.fontSize(15);
            Text.fontColor(this.getThemeColors().subText);
            Text.flexGrow(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.weather.feelsLike}°C`);
            Text.fontSize(15);
            Text.fontColor(this.getThemeColors().mainText);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('湿度');
            Text.fontSize(15);
            Text.fontColor(this.getThemeColors().subText);
            Text.flexGrow(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.weather.humidity}%`);
            Text.fontSize(15);
            Text.fontColor(this.getThemeColors().mainText);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('更新时间');
            Text.fontSize(15);
            Text.fontColor(this.getThemeColors().subText);
            Text.flexGrow(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.weather.obsTime);
            Text.fontSize(15);
            Text.fontColor(this.getThemeColors().mainText);
        }, Text);
        Text.pop();
        Row.pop();
        // 详细数据面板
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.errorMsg) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMsg);
                        Text.fontColor(Color.Red);
                        Text.fontSize(14);
                        Text.backgroundColor('rgba(255,255,255,0.8)');
                        Text.padding(4);
                        Text.borderRadius(4);
                    }, Text);
                    Text.pop();
                });
            }
            // 未来五天天气预报卡片
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 未来五天天气预报卡片
            Row.create();
            // 未来五天天气预报卡片
            Row.width('90%');
            // 未来五天天气预报卡片
            Row.padding(15);
            // 未来五天天气预报卡片
            Row.margin({ top: 15 });
            // 未来五天天气预报卡片
            Row.backgroundColor(this.getThemeColors().cardBg);
            // 未来五天天气预报卡片
            Row.borderRadius(12);
            // 未来五天天气预报卡片
            Row.shadow({ radius: 4, color: 'rgba(0,0,0,0.1)', offsetX: 0, offsetY: 2 });
            // 未来五天天气预报卡片
            Row.onClick(() => {
                router.pushUrl({
                    url: 'pages/Forecast',
                    params: {
                        'cityName': this.currentCity.name,
                        'cityPinyin': this.currentCity.pinyin
                    }
                });
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.alignItems(HorizontalAlign.Start);
            Column.flexGrow(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('查看未来 5 天天气预报');
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor(this.getThemeColors().mainText);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('包含多云、晴天趋势及温度变化范围');
            Text.fontSize(13);
            Text.fontColor(this.getThemeColors().subText);
            Text.margin({ top: 4 });
        }, Text);
        Text.pop();
        Column.pop();
        // 未来五天天气预报卡片
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 动态生活指数网格卡片
            Grid.create();
            // 动态生活指数网格卡片
            Grid.columnsTemplate('1fr 1fr 1fr');
            // 动态生活指数网格卡片
            Grid.rowsTemplate('1fr 1fr');
            // 动态生活指数网格卡片
            Grid.width('90%');
            // 动态生活指数网格卡片
            Grid.height(180);
            // 动态生活指数网格卡片
            Grid.margin({ top: 15 });
            // 动态生活指数网格卡片
            Grid.padding(5);
            // 动态生活指数网格卡片
            Grid.backgroundColor(this.getThemeColors().cardBg);
            // 动态生活指数网格卡片
            Grid.borderRadius(20);
            // 动态生活指数网格卡片
            Grid.shadow({ radius: 6, color: 'rgba(0,0,0,0.1)', offsetX: 0, offsetY: 3 });
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                {
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        GridItem.create(() => { }, false);
                        GridItem.border({
                            width: { right: 0.5, bottom: 0.5 },
                            color: 'rgba(255, 255, 255, 0.15)'
                        });
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation2(itemCreation2, GridItem);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Column.create({ space: 8 });
                            Column.justifyContent(FlexAlign.Center);
                            Column.alignItems(HorizontalAlign.Center);
                            Column.width('100%');
                            Column.height('100%');
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item.icon);
                            Text.fontSize(28);
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item.title);
                            Text.fontSize(14);
                            Text.fontColor(this.getThemeColors().mainText);
                            Text.fontWeight(FontWeight.Medium);
                        }, Text);
                        Text.pop();
                        Column.pop();
                        GridItem.pop();
                    };
                    observedDeepRender();
                }
            };
            this.forEachUpdateFunction(elmtId, this.getLifeIndexData(), forEachItemGenFunction);
        }, ForEach);
        ForEach.pop();
        // 动态生活指数网格卡片
        Grid.pop();
        // 天气主要信息
        Column.pop();
        Column.pop();
        Scroll.pop();
        Refresh.pop();
        Column.pop();
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
            }
            else {
                this.errorMsg = `错误：${res.responseCode}`;
            }
        }
        catch (err) {
            this.errorMsg = '网络错误';
        }
        finally {
            this.isLoading = false;
            this.isRefreshing = false;
            httpRequest.destroy();
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Index";
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
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "xxx.xxx.xxx.xxx", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
