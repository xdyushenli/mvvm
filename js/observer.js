// 创建观察者最终调用的函数
function observe(value, vm) {
    if (!value || typeof value !== 'object') {
        return;
    }

    return new Observer(value);
};

// 观察者的构造函数
function Observer(data) {
    this.data = data;
    this.walk(data);
}

Observer.prototype = {
    constructor: Observer,
    walk: function(data) {
        var me = this;
        // 为data对象的每个属性设置特性
        Object.keys(data).forEach(function (key) {
            me.convert(key, data[key]);
        });
    },
    convert: function(key, val) {
        this.defineReactive(this.data, key, val);
    },

    // 最终拦截，所有获取和设置data对象的行为都要经过这里
    defineReactive: function(data, key, val) {
        var dep = new Dep();
        // 若子属性也是对象，需要为子属性设置观察者
        var childObj = observe(val);

        Object.defineProperty(data, key, {
            enumerable: true, // 可枚举
            configurable: false, // 不能再define
            get: function () {
                // 若target指向某个Watcher对象，则将该对象添加到订阅者队列中
                if (Dep.target) {
                    dep.depend();
                }
                return val;
            },
            set: function(newVal) {
                if (newVal === val) {
                    return;
                }
                val = newVal;
                // 新的值是object的话，进行监听
                childObj = observe(newVal);
                // 通知订阅者
                // 通过闭包访问当前数据对应的订阅器列表（dep）
                dep.notify();
            }
        });
    }
};

// Dep、Watcher实例的关系？
// Dep实例与mvvm实例中的data对象中属性一一对应。
// 一个Dep实例对应多个Watcher实例。
// 一个Watcher实例对应一个需要应用该数据的地方。
// Observer观察者只有一个！

// 统计Dep总数,Dep实例总数和data对象的属性数目一致
var uid = 0;

function Dep() {
    this.id = uid++;
    this.subs = [];
}

// 指指向新创建的或当前触发更新的Watcher对象，用于暂存Watcher实例
Dep.target = null;

Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },

    depend: function () {
        // 调用订阅者对象的addDep函数，传入当前Dep实例
        Dep.target.addDep(this);
    },

    removeSub: function(sub) {
        var index = this.subs.indexOf(sub);
        if (index != -1) {
            this.subs.splice(index, 1);
        }
    },

    notify: function () {
        // 依次执行保存的订阅者的更新函数
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
};