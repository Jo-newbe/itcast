(function(global) {
	var document = global.document,
			arr = [],
			slice = arr.slice,
			push = arr.push;


	var init,
			itcast = function(selector, context) {
				return new itcast.fn.init(selector, context);
			};

	itcast.fn = itcast.prototype = {
		constructor: itcast,
		length: 0, // 保持itcast对象 在任何条件下都是 伪数组对象
		toArray: function() {
			return slice.call( this );
		},
		get: function(index) {
			// 如果 index 为null 或undefined值，就将所有元素以数组形式返回。
			if(index == null){
				return slice.call(this);
			}
			// 根据索引值 获取对应的dom元素
			return this[index >= 0 ? index - 0 : index - 0 + this.length];
		},
		eq: function(index) {
			return itcast(this.get(index));
		},
		first: function() {
			return itcast(this.get(0));
		},
		last: function() {
			return itcast(this.get(-1));
		}
	};

	init = itcast.fn.init = function(selector, context) {
		// 处理null undefined ''
		if (!selector) {
			return this;
		}
		// 处理字符串类型
		if (itcast.isString(selector)) {
			// html字符串
			if (itcast.isHTML(selector)) {
				// 创建dom
				// var doms = itcast.parseHTML(selector);
				// 以伪数组形成存储在this上
				push.apply(this, itcast.parseHTML(selector));
			} else { // 选择器
				// var doms = select(selector, context);
				push.apply(this, select(selector, context));
			}
		}
		// 处理Dom对象
		else if(itcast.isDOM(selector)){
			// Array.prototype.push.call(this, selector);
			this[0] = selector;
			this.length = 1;
		}
		// 处理DOM数组或者伪数组对象
		else if(itcast.isArrayLike(selector)){
			push.apply(this, selector);
		}
		// 处理函数
		else if(typeof selector === 'function'){
			// 首先判断dom树是否加载完毕，
			// 如果已加载完毕，就直接执行该函数
			if(itcast.isReady){
				selector();
			} else { // 如果没有加载完毕，就将该函数注册到DOMContentLoaded这个事件上
				document.addEventListener('DOMContentLoaded', function() {
					itcast.isReady = true;
					selector();
				});
			}
		}
	};

	init.prototype = itcast.fn;
	// 提供可扩展的接口
	itcast.extend = itcast.fn.extend = function(source) {
		// 枚举 source对象上所有属性
		for (var k in source) {
			// 添加到调用者身上
			this[k] = source[k];
		}
	};
	// 工具类
	// 类型判断方法
	itcast.extend({
		isString: function(obj) {
			return typeof obj === 'string';
		},
		// 判断是否为html字符串
		isHTML: function(obj) {
			return (obj + '').charAt(0) === '<' && // 以 '<' 开头
				(obj + '').charAt((obj + '').length - 1) === '>' && // 以 '>' 结尾
				(obj + '').length >= 3; // 最小长度 为 3
		},
		// 判断是否为元素节点
		isDOM: function(obj) {
			return 'nodeType' in obj && obj.nodeType === 1;
		},
		// 判断是否为全局window对象
		isWindow: function(obj) {
			return !!obj && obj.window === obj;
		},
		// 判断是否为数组或伪数组对象
		isArrayLike: function(obj) {
			// 如果obj不为null或undefined，并且具有length属性，就获取其length值
			// 否则 length为 bool值。
			var length = !!obj && 'length' in obj && obj.length, 
					type = itcast.type(obj); // 存储obj的类型

			// 过滤函数和window对象
			if(type === 'function' || itcast.isWindow(obj)){
				return false;
			}

			return type === 'array' || length === 0 || 
				typeof length === 'number' && length > 0 && (length - 1) in obj;
		}
	});	
	itcast.extend({
		isReady: false,
		each: function(obj, callback) {
			var i = 0,
				l = obj.length;

			for (; i < l; i++) {
				if (callback.call(obj[i], obj[i], i) === false) {
					break;
				}
			}
		},
		// 将html字符串 转化成 html元素
		parseHTML: function(html) {
			// 存储所有创建出来的元素节点
			var ret = [];
			// 动态创建一个div，使用其innerHML属性，来将html字符串转换成元素
			var div = document.createElement('div');
			div.innerHTML = html;
			// 遍历div所有子节点
			for (var i = 0, l = div.childNodes.length; i < l; i++) {
				// 如果类型为 元素节点，就是要创建的元素节点
				// 就追加到ret内。
				if (div.childNodes[i].nodeType === 1) {
					ret.push(div.childNodes[i]);
				}
			}
			// 返回结果
			return ret;
		},
		type: function(obj) {
			if(obj == null){
				return obj + '';
			}
			return typeof obj === 'object' ? 
				Object.prototype.toString.call(obj).slice(8, -1).toLowerCase() :
				typeof obj;
		}
	});

	itcast.fn.extend({
		addClass: function() {
			console.log('addClass');
		}
	});
	// 选择器引擎
	// 通过select函数 来查询dom元素
	var select = function(selector, context) {
		// 存储所有获取到的dom元素
		var ret = [];
		// 判断是否指定了context
		if (context) {
			// context 是 dom对象
			// 使用context调用querySelectorAll 获取dom元素
			// 将其转换成真数组返回
			if (context.nodeType === 1) {
				return Array.prototype.slice.call(context.querySelectorAll(selector));
			}
			// context 是 dom数组或伪数组
			// 遍历context，使用当前遍历到的元素调用querySelectorAll 获取dom元素
			// 得到结果doms，要将其所有dom元素 追加到 ret数组内，
			else if (context instanceof Array ||
				(typeof context === 'object' && 'length' in context)) {
				for (var i = 0, l = context.length; i < l; i++) {
					var doms = context[i].querySelectorAll(selector);
					for (var j = 0, k = doms.length; j < k; j++) {
						ret.push(doms[j]);
					}
				}
			}
			// context 为 字符串即选择器
			else {
				return Array.prototype.slice.call(
					document.querySelectorAll(context + ' ' + selector));
			}
			return ret;
		}
		// 如果context没有传入实参
		// 通过document调用querySelectorAll来直接获取dom元素
		else {
			return Array.prototype.slice.call(document.querySelectorAll(selector));
		}
	};

	global.$ = global.itcast = itcast;
	// 注册DOM树加载完毕的时间
	// 用来更新itcast.isReady值
	document.addEventListener('DOMContentLoaded', function() {
		itcast.isReady = true;
	});
}(window));