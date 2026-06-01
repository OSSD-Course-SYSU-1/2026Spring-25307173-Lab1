if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Splash_Params {
    opacityValue?: number;
    scaleValue?: number;
    rotateAngle?: number;
    sunGlow?: number;
}
import router from "@ohos:router";
class Splash extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__opacityValue = new ObservedPropertySimplePU(0, this, "opacityValue");
        this.__scaleValue = new ObservedPropertySimplePU(0.8, this, "scaleValue");
        this.__rotateAngle = new ObservedPropertySimplePU(0, this, "rotateAngle");
        this.__sunGlow = new ObservedPropertySimplePU(1, this, "sunGlow");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Splash_Params) {
        if (params.opacityValue !== undefined) {
            this.opacityValue = params.opacityValue;
        }
        if (params.scaleValue !== undefined) {
            this.scaleValue = params.scaleValue;
        }
        if (params.rotateAngle !== undefined) {
            this.rotateAngle = params.rotateAngle;
        }
        if (params.sunGlow !== undefined) {
            this.sunGlow = params.sunGlow;
        }
    }
    updateStateVars(params: Splash_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__opacityValue.purgeDependencyOnElmtId(rmElmtId);
        this.__scaleValue.purgeDependencyOnElmtId(rmElmtId);
        this.__rotateAngle.purgeDependencyOnElmtId(rmElmtId);
        this.__sunGlow.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__opacityValue.aboutToBeDeleted();
        this.__scaleValue.aboutToBeDeleted();
        this.__rotateAngle.aboutToBeDeleted();
        this.__sunGlow.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __opacityValue: ObservedPropertySimplePU<number>;
    get opacityValue() {
        return this.__opacityValue.get();
    }
    set opacityValue(newValue: number) {
        this.__opacityValue.set(newValue);
    }
    private __scaleValue: ObservedPropertySimplePU<number>;
    get scaleValue() {
        return this.__scaleValue.get();
    }
    set scaleValue(newValue: number) {
        this.__scaleValue.set(newValue);
    }
    private __rotateAngle: ObservedPropertySimplePU<number>;
    get rotateAngle() {
        return this.__rotateAngle.get();
    }
    set rotateAngle(newValue: number) {
        this.__rotateAngle.set(newValue);
    }
    private __sunGlow: ObservedPropertySimplePU<number>;
    get sunGlow() {
        return this.__sunGlow.get();
    }
    set sunGlow(newValue: number) {
        this.__sunGlow.set(newValue);
    }
    aboutToAppear(): void {
        // 1. 启动封面入场动画
        Context.animateTo({
            duration: 1000,
            curve: Curve.EaseOut
        }, () => {
            this.opacityValue = 1;
            this.scaleValue = 1;
        });
        // 2. 太阳旋转与光晕动画
        Context.animateTo({ duration: 8000, iterations: -1, curve: Curve.Linear }, () => {
            this.rotateAngle = 360;
        });
        Context.animateTo({ duration: 1500, iterations: -1, playMode: PlayMode.Alternate, curve: Curve.EaseInOut }, () => {
            this.sunGlow = 1.2;
        });
        // 3. 关键：3秒后跳转到天气主页
        setTimeout(() => {
            router.replaceUrl({
                url: 'pages/Index' // 确保这里指向你显示天气的那个文件名
            });
        }, 3000); // 3秒持续时间
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.width('100%');
            Stack.height('100%');
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 蓝天背景
            Column.create();
            // 蓝天背景
            Column.width('100%');
            // 蓝天背景
            Column.height('100%');
            // 蓝天背景
            Column.linearGradient({
                angle: 180,
                colors: [['#0d47a1', 0.0], ['#2196f3', 1.0]]
            });
        }, Column);
        // 蓝天背景
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 30 });
            Column.opacity(this.opacityValue);
            Column.scale({ x: this.scaleValue, y: this.scaleValue });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 太阳动画图标
            Stack.create();
            // 太阳动画图标
            Stack.rotate({ angle: this.rotateAngle });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Circle.create();
            Circle.width(150);
            Circle.height(150);
            Circle.fill('#FFEB3B');
            Circle.scale({ x: this.sunGlow, y: this.sunGlow });
            Circle.opacity(0.3);
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 太阳主体
            Circle.create();
            // 太阳主体
            Circle.width(100);
            // 太阳主体
            Circle.height(100);
            // 太阳主体
            Circle.fill('#FFEB3B');
            // 太阳主体
            Circle.shadow({ radius: 20, color: '#FFEB3B' });
        }, Circle);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 太阳光芒
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const angle = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width(4);
                    Row.height(40);
                    Row.backgroundColor('#FFEB3B');
                    Row.rotate({ angle: angle });
                    Row.translate({ x: 0, y: -70 });
                }, Row);
                Row.pop();
            };
            this.forEachUpdateFunction(elmtId, [0, 45, 90, 135, 180, 225, 270, 315], forEachItemGenFunction);
        }, ForEach);
        // 太阳光芒
        ForEach.pop();
        // 太阳动画图标
        Stack.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('宇飞天气');
            Text.fontSize(48);
            Text.fontWeight(FontWeight.Bold);
            Text.fontColor('#FFFFFF');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('准备出门了么？快看看天气');
            Text.fontSize(18);
            Text.fontColor('#E3F2FD');
            Text.opacity(0.8);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部加载小点
            LoadingProgress.create();
            // 底部加载小点
            LoadingProgress.width(40);
            // 底部加载小点
            LoadingProgress.height(40);
            // 底部加载小点
            LoadingProgress.color('#FFFFFF');
            // 底部加载小点
            LoadingProgress.margin({ top: 100 });
        }, LoadingProgress);
        Column.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "Splash";
    }
}
registerNamedRoute(() => new Splash(undefined, {}), "", { bundleName: "xxx.xxx.xxx.xxx", moduleName: "entry", pagePath: "pages/Splash", pageFullPath: "entry/src/main/ets/pages/Splash", integratedHsp: "false", moduleType: "followWithHap" });
