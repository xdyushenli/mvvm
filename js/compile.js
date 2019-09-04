// 初始化时只会执行该函数
function Compile() {
    // mvvm实例

    // 保存实例对应的html元素


        // 创建文件碎片

        // 根据创建的文本碎片进行编译

        // 将编译好的节点添加到DOM中
}

Compile.prototype = {
    constructor: Compile,
    node2Fragment: function () {
        
        // 将原生节点拷贝到fragment

            // 注意：appendChild会把要添加的元素从DOM中移除，然后添加到文本碎片中
            // appendChild用于把一个元素从某个元素移到另一个元素中
    },

    init: function() {

    },

    compileElement: function () {
        // 注意：childNodes是一个类数组对象，但不是数组对象，所以不能直接调用slice方法
        
        // 调用slice方法是为了对childNodes数组进行浅复制
            // 用于匹配双花括号

            // 如果是元素节点，则对附加在其上的指令进行编译
        
            // 若是文本节点且包含小胡子语法，则该文本内有数据要进行双向绑定
        
            // 编译子节点
    },

    compile: function () {
        // 元素节点的属性列表
        

            // 若属性名为内置指令
        
                // substring用于提取字符串，接受两个参数，start和stop

                // 事件指令
        
                // 普通指令

                    // compileUtil为一个保存所有内置指令的对象

                // 删除内置指令属性,防止浏览器对该属性产生奇奇怪怪的反应
    },

    compileText: function () {
        
    },

    isDirective: function() {

    },

    isEventDirective: function() {

    },

    isElementNode: function() {

    },

    isTextNode: function() {

    }
};

// 指令处理集合
var compileUtil = {
    text: function() {

    },

    html: function() {

    },

    model: function() {

        // 为input元素添加input时间
    },

    class: function() {

    },

    // 执行命令绑定的最终函数
    bind: function () {
        // 更新的函数，只有同时在compileUtil中注册且定义了更新函数的指令才能起作用

        // 第一次初始化视图

        // 创建订阅器,订阅器与指令及数据绑定的地方一一对应
        // 此操作会在对应的属性消息订阅器中添加了该订阅者watcher
        // 该函数的第三个参数是一个回调函数，用于在这个函数中调用了指令的更新函数

            // 一旦属性值有变化，会收到通知执行此更新函数，更新视图
    },

    // 事件处理
    eventHandler: function () {
        // 事件类型

        // 获取事件处理函数


            // 事件在冒泡阶段执行
    },

    // 从模板的data对象中获取数据
    // 每次从模板的data对象中获取值时，都会先转到mvvm.js的_proxyData设置的get中，之后再跑到Observer.js的defineReactive设置的get中
    _getVMVal: function () {
        
    },

    // 更换模板中需要被替换的数据
    _setVMVal: function () {
           // 非最后一个key，更新val的值
    }
};


var updater = {
    textUpdater: function() {

    },

    htmlUpdater: function() {

    },

    classUpdater: function() {

    },

    modelUpdater: function() {

    }
};