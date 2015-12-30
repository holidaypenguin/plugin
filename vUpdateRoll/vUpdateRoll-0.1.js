/*
  垂直滚动更新
*/
!(function($){
	
	var method = {
		_init : function(options){
			var el = $(this);
			var ul = el.children('ul');
			var state = {
				itemMargin: 0,
				element: el,
				elementUl: ul,
				animating: false,
				moving: false,
				options: options,
				pausedByCode: false
			};
			$(this).data('state', state);
			
			method._initStyle(state);
			method._initEvent(state);
			
			// test
			//method._animate(state, 1);
			//method.move.call(this);
			state.element.trigger("vuRoll.afterInit");
		},
		_initStyle: function(state){
			// 设置所有节点margin、padding为0，设置节点position属性 
			// remove margin and padding on all DOM css, set position attribute
			state.element.css({overflow: 'hidden', position: 'relative', margin: 0, padding: 0});
			state.elementUl.css({position: 'absolute', margin: 0, padding: 0})
				.children('li').css({margin: 0, padding: 0});
			// set height
			if (isNaN(state.options.height) || state.options.height <= 0) {
				var current;
				state.elementUl.children('li').each(function() {
					current = $(this);
					if (current.height() > state.options.itemHeight)
						state.options.itemHeight = current.height();
				});
				// 移除初始节点
				state.elementUl.children('li').remove();
				
				
				// set element to total height
				state.element.height(state.options.itemHeight * state.options.showItems);
			} else {
				state.element.height(state.options.height);
			}
		},
		_initEvent: function(state){
			state.element.bind("vuRoll.addData", function(event, arg1){
				method._addDom.call(this, arg1.data);
			});
		},
		_addDom : function(data){
			var state = $(this).data("state");
			$(state.options.getUpdataRoll(data)).each(function(i, data){
				if(state.options.direction === 'down'){
					state.elementUl.prepend($(data).css("height", state.options.itemHeight));
				}else{
					state.elementUl.append($(data).css("height", state.options.itemHeight));
				}
			});
			method.move.call(this);
		},
		/**
		 * 
		 */
		_animate: function(state, moveItem) {
			if(isNaN(moveItem) || moveItem < 1){
				state.moving = false;
				return;
			}
			state.moving = true;
			
			state.element.trigger("vuRoll.beforeTick");

			moveItem = parseInt(moveItem);
			if (state.options.direction === 'down') 
				state.elementUl.css('top', '-' + state.options.itemHeight * moveItem + 'px');

			if (state.options && state.options.animate ) {
				if (state.animating) 
					return;
				state.animating = true;
				var opts = {
					top: (state.options.direction === 'up') ? ('-=' + state.options.itemHeight * moveItem + 'px') : 0
				};
				state.elementUl.animate(opts, state.options.speed * moveItem, function() {
					method._moveRemove(state, moveItem);
					method._animateEnd(state, state.elementUl);
					state.animating = false;
				});
			} else {
				method._moveRemove(state);
				method._animateEnd(state);
			}
		},
		_moveRemove: function(state, moveItem){
			if(state.options.direction === 'up'){
				state.elementUl.find("li:lt("+moveItem+")").remove();
			}else{
				var i = moveItem;
				var last = state.elementUl.children(":last");
				while(--i > 0)
					last.prev().remove();
				last.remove();
			}
		},
		_animateEnd : function(state){
			state.elementUl.css('top', '0px');
			state.element.trigger("vuRoll.afterTick");
			state.moving = false;
			state.timeout = setTimeout(function(){
				method.move.call(state.element);
			}, state.options.pause);
		},
		move : function(){
			var state = $(this).data("state");
			if(state.moving){
				return;
			}
			state.moving = true;
			if(state.timeout){
				clearTimeout(state.timeout);
				delete state.timeout;
			}
			/*
			console.log(
				"=============element.length="+state.element.children('ul').children('li').length+
				"===showItems="+state.options.showItems+
				"=====moveItem="+(state.element.children('ul').children('li').length - state.options.showItems)+
				"===========");
			*/
			method._animate(state, state.elementUl.children('li').length - state.options.showItems);
		}
	};
	
	var defaults = {
		speed: 700,					// 滚动速度，单位毫秒。
		pause: 4000,				// 暂停时间，就是滚动多条之后停留的时间，单位毫秒。   
		showItems: 1,				// 显示内容的条数。        
		mousePause: true,			// 鼠标移动到内容上是否暂停滚动，默认为true。    
		height: 0,					// 滚动内容的高度。
		itemHeight: 0,				// 每一行的高度。默认0px
		direction: 'up' ,      		// 滚动的方向，默认为up向上，down则为向下滚动。
		animate: true,				// 是否展示动画，默认为true。 
		mousePause: true,      		// 鼠标移动到内容上是否暂停滚动，默认为true。-- 暂时无用。
		startPaused: false,			// 开始后暂停，默认为false。-- 暂时无用。
		callback: function() {},	// 初始化完成后回掉方法。-- 暂时无用。
		getUpdataRoll: function(data){	// 获得需要展示的dom结构
			var updataRollDom = [], i = 0;
			if(!data || data.length < 1){
				return updataRollDom;
			}
			for(i = 0; i < data.length; i++){
				updataRollDom[i] = "<li>"+data[i]+"</li>";
			}
			return updataRollDom;
		}
	};
	
	/**
	 * 垂直滚动更新
	 * 
	 */
	$.fn.vUpdateRoll = function(options) {
		var _self = this,
			_this = $(this);
		var defaultsClone = $.extend({}, defaults);
		method._init.call(this, $.extend(defaultsClone, options || {}));
		
		return this;
	};
	
	
	
})(jQuery);