// todo 改进目标
// 1. 当data是嵌套对象时,input显示[object object]
// 2. 当在input中输入多个空格时，再输入其他数字，会只有一个空格会在p标签中显示

// todo 下一步要看的计划
// 1. 当有data对象有多个属性时如何区分不同数据
// 2. 如何绑定事件？

function MVVM(options) {
    // 为mvvm对象添加$options属性，用于保存创建mvvm对象时传入的参数
    this.$options = options || {};
    // 为mvvm对象添加_data属性，保存参数中的data对象
    var data = this._data = this.$options.data;
    var me = this;

    // 从作为参数的data对象中取出属性值，并依次挂载在vm对象中,并为该属性设置特性（可枚举，不可设置，get和set和普通属性没啥区别）。
    // 实现 options.data.xxx -> vm.xxx,并为vm.xxx设置特性
    // 使访问vm的属性代理为访问vm._data的属性
    Object.keys(data).forEach(function (key) {
        me._proxyData(key);
    });

    // 初始化模板中的computed对象，实现Vue的computed特性
    this._initComputed();

    // 创建观察者
    // 由于js是引用传值，所以这里的data对象引用与_data和$options.data一致
    // 对于复杂值（如对象数组等），js是引用传值。对于简单值，js是值传递。
    let sss = observe(data, this);
    console.log(sss)

    // 编译指令，绑定事件，替换数据
    this.$compile = new Compile(options.el || document.body, this)
}

MVVM.prototype = {
    constructor: MVVM,
    // todo 作用不明
    // $watch: function(key, cb, options) {
        // new Watcher(this, key, cb);
    // },

    _proxyData: function(key, setter, getter) {
        var me = this;
        setter = setter || 
        Object.defineProperty(me, key, {
            configurable: false,
            enumerable: true,
            get: function proxyGetter() {
                // 将获取值的请求转发到data对象中,最终由Observer.js中的defineReactive进行拦截
                return me._data[key];
            },
            set: function proxySetter(newVal) {
                // 将设置值的请求转发到data对象中,最终由Observer.js中的defineReactive进行拦截
                me._data[key] = newVal;
            }
        });
    },

    _initComputed: function() {
        var me = this;
        var computed = this.$options.computed;
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(function(key) {
                Object.defineProperty(me, key, {
                    get: typeof computed[key] === 'function' 
                            ? computed[key] 
                            : computed[key].get,
                    set: function() {}
                });
            });
        }
    }
};