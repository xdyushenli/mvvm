// 初始化时只会执行该函数
function Compile(el, vm) {
    // mvvm实例
    this.$vm = vm;
    // 保存实例对应的html元素
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);

    if (this.$el) {
        // 创建文件碎片
        this.$fragment = this.node2Fragment(this.$el);
        // 根据创建的文本碎片进行编译
        this.init();
        // 将编译好的节点添加到DOM中
        this.$el.appendChild(this.$fragment);
    }
}

Compile.prototype = {
    constructor: Compile,
    node2Fragment: function(el) {
        var fragment = document.createDocumentFragment(),
            child;

        // 将原生节点拷贝到fragment
        while (child = el.firstChild) {
            // 注意：appendChild会把要添加的元素从DOM中移除，然后添加到文本碎片中
            // appendChild用于把一个元素从某个元素移到另一个元素中
            fragment.appendChild(child);
        }

        return fragment;
    },

    init: function() {
        this.compileElement(this.$fragment);
    },

    compileElement: function (el) {
        // 注意：childNodes是一个类数组对象，但不是数组对象，所以不能直接调用slice方法
        var childNodes = el.childNodes,
            me = this;
        
        // 调用slice方法是为了对childNodes数组进行浅复制
        [].slice.call(childNodes).forEach(function(node) {
            var text = node.textContent;
            // 用于匹配双花括号
            var reg = /\{\{(.*)\}\}/;

            // 如果是元素节点，则对附加在其上的指令进行编译
            if (me.isElementNode(node)) {
                me.compile(node);
            // 若是文本节点且包含小胡子语法，则该文本内有数据要进行双向绑定
            } else if (me.isTextNode(node) && reg.test(text)) {
                me.compileText(node, RegExp.$1.trim());
            }

            // 编译子节点
            if (node.childNodes && node.childNodes.length) {
                me.compileElement(node);
            }
        });
    },

    compile: function (node) {
        // 元素节点的属性列表
        var nodeAttrs = node.attributes,
            me = this;

        [].slice.call(nodeAttrs).forEach(function(attr) {
            var attrName = attr.name;
            // 若属性名为内置指令
            if (me.isDirective(attrName)) {
                var exp = attr.value;
                // substring用于提取字符串，接受两个参数，start和stop
                var dir = attrName.substring(2);
                // 事件指令
                if (me.isEventDirective(dir)) {
                    compileUtil.eventHandler(node, me.$vm, exp, dir);
                // 普通指令
                } else {
                    // compileUtil为一个保存所有内置指令的对象
                    compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
                }

                // 删除内置指令属性,防止浏览器对该属性产生奇奇怪怪的反应
                node.removeAttribute(attrName);
            }
        });
    },

    compileText: function(node, exp) {
        compileUtil.text(node, this.$vm, exp);
    },

    isDirective: function(attr) {
        return attr.indexOf('v-') == 0;
    },

    isEventDirective: function(dir) {
        return dir.indexOf('on') === 0;
    },

    isElementNode: function(node) {
        return node.nodeType == 1;
    },

    isTextNode: function(node) {
        return node.nodeType == 3;
    }
};

// 指令处理集合
var compileUtil = {
    text: function(node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },

    html: function(node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },

    model: function(node, vm, exp) {
        this.bind(node, vm, exp, 'model');

        var me = this,
            val = this._getVMVal(vm, exp);
        // 为input元素添加input时间
        node.addEventListener('input', function(e) {
            var newValue = e.target.value;
            if (val === newValue) {
                return;
            }

            me._setVMVal(vm, exp, newValue);
            val = newValue;
        });
    },

    class: function(node, vm, exp) {
        this.bind(node, vm, exp, 'class');
    },

    // 执行命令绑定的最终函数
    bind: function (node, vm, exp, dir) {
        // 更新的函数，只有同时在compileUtil中注册且定义了更新函数的指令才能起作用
        var updaterFn = updater[dir + 'Updater'];

        // 第一次初始化视图
        updaterFn && updaterFn(node, this._getVMVal(vm, exp));

        // 创建订阅器,订阅器与指令及数据绑定的地方一一对应
        // 此操作会在对应的属性消息订阅器中添加了该订阅者watcher
        // 该函数的第三个参数是一个回调函数，用于在这个函数中调用了指令的更新函数
        new Watcher(vm, exp, function (value, oldValue) {
            // 一旦属性值有变化，会收到通知执行此更新函数，更新视图
            updaterFn && updaterFn(node, value, oldValue);
        });
    },

    // 事件处理
    eventHandler: function (node, vm, exp, dir) {
        // 事件类型
        var eventType = dir.split(':')[1];
        // 获取事件处理函数
        var fn = vm.$options.methods && vm.$options.methods[exp];

        if (eventType && fn) {
            // 事件在冒泡阶段执行
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },

    // 从模板的data对象中获取数据
    // 每次从模板的data对象中获取值时，都会先转到mvvm.js的_proxyData设置的get中，之后再跑到Observer.js的defineReactive设置的get中
    _getVMVal: function(vm, exp) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function(k) {
            val = val[k];
        });
        return val;
    },

    // 更换模板中需要被替换的数据
    _setVMVal: function(vm, exp, value) {
        var val = vm; 
        exp = exp.split('.');
        exp.forEach(function(k, i) {
            // 非最后一个key，更新val的值
            if (i < exp.length - 1) {
                val = val[k];
            } else {
                val[k] = value;
            }
        });
    }
};


var updater = {
    textUpdater: function(node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },

    htmlUpdater: function(node, value) {
        node.innerHTML = typeof value == 'undefined' ? '' : value;
    },

    classUpdater: function(node, value, oldValue) {
        var className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, '');

        var space = className && String(value) ? ' ' : '';

        node.className = className + space + value;
    },

    modelUpdater: function(node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value;
    }
};