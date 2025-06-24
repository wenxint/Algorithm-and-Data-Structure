/**
 * LeetCode 155. 最小栈
 *
 * 问题描述：
 * 设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。
 *
 * 核心思想：
 * 辅助栈：使用两个栈，一个存数据，一个存对应的最小值
 *
 * 示例：
 * MinStack minStack = new MinStack();
 * minStack.push(-2);
 * minStack.push(0);
 * minStack.push(-3);
 * minStack.getMin(); // 返回 -3
 */

/**
 * 最小栈
 */
class MinStack {
    constructor() {
        // TODO: 初始化最小栈
        console.log("最小栈初始化待实现");
    }

    /**
     * @param {number} val
     * @return {void}
     */
    push(val) {
        // TODO: 实现push操作
        console.log("push操作待实现");
    }

    /**
     * @return {void}
     */
    pop() {
        // TODO: 实现pop操作
        console.log("pop操作待实现");
    }

    /**
     * @return {number}
     */
    top() {
        // TODO: 实现top操作
        console.log("top操作待实现");
        return 0;
    }

    /**
     * @return {number}
     */
    getMin() {
        // TODO: 实现getMin操作
        console.log("getMin操作待实现");
        return 0;
    }
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MinStack
    };
}