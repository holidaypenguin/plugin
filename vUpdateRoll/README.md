# vUpdateRoll
添加数据，实现向上滚动或者向下滚动

如下为该组件使用的dom结构说明<br>
div#test1 ul li  移除margin、padding，只是作为骨架来展示内容，如果需要额外的功能，需要在外层嵌套控制样式的dom。

\<div class="wrap"> // 给内层提供显示位置
	/<div id="test1" class="example"> // 作为包裹ul的容器，将移除margin、padding，紧紧包裹ul，如果需要控制显示，可在外层div添加css。
		<ul> // 移除margin、padding
			<li></li> // 移除margin、padding
		</ul>
	</div>
</div>

# vUpdateRoll-0.1
信息传递方式：事件传播<br>
数据保存方式：保存在dom结构中<br>
结果：在向上滚动时出现非预期效果<br>

# vUpdateRoll-1.0
信息传递方式：事件传播 <br>
数据保存方式：js数组<br>
结果：结果与预期相同<br>

