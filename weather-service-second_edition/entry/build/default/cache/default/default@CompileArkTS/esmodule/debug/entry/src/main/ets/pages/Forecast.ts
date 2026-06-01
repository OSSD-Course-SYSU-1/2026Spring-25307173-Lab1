if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Forecast_Params {
    cityName?: string;
    cityPinyin?: string;
    isLoading?: boolean;
    errorMsg?: string;
    forecastData?: Array<ForecastItem>;
}
import http from "@ohos:net.http";
import router from "@ohos:router";
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
class Forecast extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__cityName = new ObservedPropertySimplePU('未知城市', this, "cityName");
        this.__cityPinyin = new ObservedPropertySimplePU('', this, "cityPinyin");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__errorMsg = new ObservedPropertySimplePU('', this, "errorMsg");
        this.__forecastData = new ObservedPropertyObjectPU([], this, "forecastData");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Forecast_Params) {
        if (params.cityName !== undefined) {
            this.cityName = params.cityName;
        }
        if (params.cityPinyin !== undefined) {
            this.cityPinyin = params.cityPinyin;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.errorMsg !== undefined) {
            this.errorMsg = params.errorMsg;
        }
        if (params.forecastData !== undefined) {
            this.forecastData = params.forecastData;
        }
    }
    updateStateVars(params: Forecast_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__cityName.purgeDependencyOnElmtId(rmElmtId);
        this.__cityPinyin.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__errorMsg.purgeDependencyOnElmtId(rmElmtId);
        this.__forecastData.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__cityName.aboutToBeDeleted();
        this.__cityPinyin.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__errorMsg.aboutToBeDeleted();
        this.__forecastData.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __cityName: ObservedPropertySimplePU<string>;
    get cityName() {
        return this.__cityName.get();
    }
    set cityName(newValue: string) {
        this.__cityName.set(newValue);
    }
    private __cityPinyin: ObservedPropertySimplePU<string>;
    get cityPinyin() {
        return this.__cityPinyin.get();
    }
    set cityPinyin(newValue: string) {
        this.__cityPinyin.set(newValue);
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
    private __forecastData: ObservedPropertyObjectPU<Array<ForecastItem>>;
    get forecastData() {
        return this.__forecastData.get();
    }
    set forecastData(newValue: Array<ForecastItem>) {
        this.__forecastData.set(newValue);
    }
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F7FA');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 头部导航栏
            // 头部导航栏 - 包含更加美观的返回图标
            Row.create();
            // 头部导航栏
            // 头部导航栏 - 包含更加美观的返回图标
            Row.width('100%');
            // 头部导航栏
            // 头部导航栏 - 包含更加美观的返回图标
            Row.padding({ top: 50, bottom: 15 });
            // 头部导航栏
            // 头部导航栏 - 包含更加美观的返回图标
            Row.backgroundColor('#2196f3');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
            // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
            Text.create('<');
            // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
            // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
            Text.fontSize(32);
            // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
            // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
            Text.fontWeight(FontWeight.Lighter);
            // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
            // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
            Text.fontColor('#FFFFFF');
            // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
            // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
            Text.width(50);
            // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
            // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
            Text.padding({ left: 15 });
            // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
            // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
            Text.onClick(() => {
                router.back();
            });
        }, Text);
        // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
        // 使用 Text 代替 Button，去掉难看的底色，实现极简设计
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.cityName} 未来5天预报`);
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FFFFFF');
            Text.flexGrow(1);
            Text.textAlign(TextAlign.Center);
            Text.margin({ right: 50 });
        }, Text);
        Text.pop();
        // 头部导航栏
        // 头部导航栏 - 包含更加美观的返回图标
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 内容区域
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.flexGrow(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        LoadingProgress.create();
                        LoadingProgress.width(50);
                        LoadingProgress.height(50);
                        LoadingProgress.color('#2196f3');
                    }, LoadingProgress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('正在努力加载5天预报...');
                        Text.fontColor('#666666');
                        Text.margin({ top: 10 });
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else if (this.errorMsg) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.flexGrow(1);
                        Column.justifyContent(FlexAlign.Center);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.errorMsg);
                        Text.fontColor(Color.Red);
                        Text.fontSize(16);
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        List.create({ space: 12 });
                        List.width('92%');
                        List.margin({ top: 15 });
                        List.flexGrow(1);
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 修复：为 ForEach 提供严格的字符串 Key 标识生成器，防止编译报错
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const item = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    ListItem.create(deepRenderFunction, true);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create();
                                        Row.width('100%');
                                        Row.padding(18);
                                        Row.backgroundColor('#FFFFFF');
                                        Row.borderRadius(12);
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.date);
                                        Text.fontSize(16);
                                        Text.fontWeight(FontWeight.Medium);
                                        Text.fontColor('#333333');
                                        Text.width('30%');
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(item.text);
                                        Text.fontSize(16);
                                        Text.fontColor('#666666');
                                        Text.width('30%');
                                        Text.textAlign(TextAlign.Center);
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`${item.tempMin}° ~ ${item.tempMax}°C`);
                                        Text.fontSize(16);
                                        Text.fontWeight(FontWeight.Bold);
                                        Text.fontColor('#2196f3');
                                        Text.width('40%');
                                        Text.textAlign(TextAlign.End);
                                    }, Text);
                                    Text.pop();
                                    Row.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.forecastData, forEachItemGenFunction, (item: ForecastItem) => item.date, false, false);
                    }, ForEach);
                    // 修复：为 ForEach 提供严格的字符串 Key 标识生成器，防止编译报错
                    ForEach.pop();
                    List.pop();
                });
            }
        }, If);
        If.pop();
        Column.pop();
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
            }
            else {
                this.errorMsg = `数据加载失败: ${res.responseCode}`;
                this.isLoading = false;
            }
        }
        catch (err) {
            this.errorMsg = '网络连接超时';
            this.isLoading = false;
        }
        finally {
            httpRequest.destroy();
        }
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Forecast";
    }
}
registerNamedRoute(() => new Forecast(undefined, {}), "", { bundleName: "xxx.xxx.xxx.xxx", moduleName: "entry", pagePath: "pages/Forecast", pageFullPath: "entry/src/main/ets/pages/Forecast", integratedHsp: "false", moduleType: "followWithHap" });
