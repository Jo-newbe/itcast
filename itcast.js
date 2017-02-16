(function(global) {
	var init,
			itcast = function(selector, context) {
				return new itcast.fn.init(selector, context);
			};

	itcast.fn = itcast.prototype = {
		constructor: itcast
	};

	init = itcast.fn.init = function(selector, context) {};

	init.prototype = itcast.fn;
	// 提供可扩展的接口
	itcast.extend = itcast.fn.extend = function(source) {
		// 枚举 source对象上所有属性
		for(var k in source){
			// 添加到调用者身上
			this[k] = source[k];
		}
	};
	itcast.extend({
		each: function(obj, callback) {
			var i = 0,
					l = obj.length;

			for(; i < l; i++){
				if(callback.call(obj[i], obj[i], i) === false){
					break;
				}
			}
		}
	});

	itcast.fn.extend({
		addClass: function() {
			console.log('addClass');
		}
	});
	// 选择器引擎
	// 通过select函数 来查询dom元素
	var select = 	function(selector, context) {		
			var ret = [];
			var doms;
			var els = [];
			var i, l;

			// 如果context不为 undefined， null
			// 如果context为 单个dom元素
			if(context.nodeType && context.nodeType === 1){
				doms = context.querySelectorAll(selector);
				ret = Array.prototype.slice.call(doms);
			}
			// 如果context类型为 dom数组 或 伪数组对象
			else if(typeof context === 'object' && 
				(context instanceof Array || 'length' in context)){
				// 遍历context
				for(i = 0, l = context.length; i < l; i++){
					// 使用当前遍历到的dom对象，获取dom
					doms = context[i].querySelectorAll(selector);
					for(var j = 0, len = doms.length; j < len; j++){
						ret.push(doms[j]);
					}
				}
			} else {
				selector = context + ' ' + selector;
				doms = document.querySelectorAll(selector);
				ret = Array.prototype.slice.call(doms);
			}	
			return ret;
		};

	global.$ = global.itcast = itcast;
}(window));