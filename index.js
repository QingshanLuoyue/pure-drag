export const Drag = class Drag {
    constructor(option) {
        this.oldX = 0
        this.oldY = 0
        this.newX = 0
        this.newY = 0
        this.maxMoveWidth = 0
        this.maxMoveHeight = 0

        this.isMobile = false
        if ('ontouchstart' in window) {
            this.isMobile = true
        }

        this.eventType = {
            start: this.isMobile ? 'ontouchstart' : 'onmousedown',
            move: this.isMobile ? 'ontouchmove' : 'onmousemove',
            end: this.isMobile ? 'ontouchend' : 'onmouseup',
        }

        if (!option.dragEle) throw '拖拽元素 dragEle 必须传递'
        this.dragSon = option.dragEle

        if (option.parent) {
            this.dragParent = option.parent
            this.maxMoveWidth = this.dragParent.clientWidth - this.dragSon.clientWidth
            this.maxMoveHeight = this.dragParent.clientHeight - this.dragSon.clientHeight
        }

        this.init()
    }
    // 初始化
    init() {
        // 鼠标按下
        this.dragSon[this.eventType['start']] = e => {
            // 兼容 IE
            let ev = e || window.event

            // 阻止默认事件 ，即鼠标悬停在拖拽元素上，系统选中内容
            if (window.event) {
                // 兼容 IE
                window.event.returnValue = false;
            } else {
                ev.preventDefault()
            }

            if (this.isMobile) {
                ev = ev.touches[0]
            }

            // 存储当前鼠标位置
            this.oldX = ev.clientX
            this.oldY = ev.clientY

            this.dragMove()
        }
        
        // 鼠标松开
        document.documentElement[this.eventType['end']] = e => {
            // 函数赋值为 null，让函数失效，便于浏览器垃圾回收
            document.documentElement[this.eventType['move']] = null
        }
    }
    // 鼠标移动
    dragMove() {
        // 因为鼠标移动过快，可能会移出拖拽元素的范围
        // 这里使用 document.documentElement.onmousemove 来解决
        document.documentElement[this.eventType['move']] = e => {
            let ev = e || window.event, endX, endY

            // 阻止默认事件 ，即鼠标悬停在拖拽元素上，系统选中内容
            if (window.event) {
                // 兼容 IE
                window.event.returnValue = false;
            } else {
                ev.preventDefault()
            }
            
            if (this.isMobile) {
                ev = ev.touches[0]
            }

            this.newX = ev.clientX,
            this.newY = ev.clientY,
            // 拖拽元素 距离 `定位参考父级` 左侧的距离 + `移动鼠标位置 X 轴值` 减去 `之前记录的鼠标位置 X 轴值`
            // offsetLeft: 拖拽元素与父级左侧的距离长度（不含父级边框）
            endX = this.dragSon.offsetLeft + this.newX - this.oldX,
            // 拖拽元素 距离 `定位参考父级` 顶部的距离 + `移动鼠标位置 Y 轴值` 减去 `之前记录的鼠标位置 Y 轴值`
            // offsetTop: 拖拽元素与父级顶部的距离长度（不含父级边框）
            endY = this.dragSon.offsetTop + this.newY - this.oldY
            
            // 若存在父级，限制在父级范围内移动
            if (this.dragParent) {
                let { limitEndX, limitEndY } = this.limitRange(endX, endY)
                endX = limitEndX
                endY = limitEndY
            }

            // 设置拖拽元素位置
            this.dragSon.style.left = endX + 'px'
            this.dragSon.style.top = endY + 'px'

            // 新旧值交换
            this.oldX = this.newX
            this.oldY = this.newY
        }
    }
    
    // 限制移动范围
    limitRange(endX, endY) {
        // 限制在 定位参考父级元素 内移动
        // 左边界
        if (endX <= 0) {
            endX = 0
        }
        // 右边界
        // X 轴方向可移动距离 = 父级内部宽度 - 拖拽元素宽度
        if (endX >= this.maxMoveWidth) {
            endX = this.maxMoveWidth
        }
        
        // 上边界
        if (endY <= 0) {
            endY = 0
        }
        // 下边界
        // Y 轴方向可移动距离 = 父级内部高度 - 拖拽元素高度
        if (endY >= this.maxMoveHeight) {
            endY = this.maxMoveHeight
        }
        return { limitEndX: endX, limitEndY: endY }
    }
}

export default Drag