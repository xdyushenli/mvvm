// 创建观察者最终调用的函数
function observe() {

};

// 观察者的构造函数
function Observer() {

}

Observer.prototype = {
    constructor: Observer,
    walk: function() {
        // 为data对象的每个属性设置特性
    },
    convert: function() {

    },

    // 最终拦截，所有获取和设置data对象的行为都要经过这里
    defineReactive: function() {
        // 若子属性也是对象，需要为子属性设置观察者

            // 可枚举
            // 不能再define
                // 若target指向某个Watcher对象，则将该对象添加到订阅者队列中

                // 新的值是object的话，进行监听

                // 通知订阅者
                // 通过闭包访问当前数据对应的订阅器列表（dep）
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

}

// 指指向新创建的或当前触发更新的Watcher对象，用于暂存Watcher实例
Dep.target = null;

Dep.prototype = {
    addSub: function () {
        
    },

    depend: function () {
        // 调用订阅者对象的addDep函数，传入当前Dep实例
        
    },

    removeSub: function () {
        
    },

    notify: function () {
        // 依次执行保存的订阅者的更新函数
        
    }
};