/**
 * LeetCode 225: 用队列实现栈 (Implement Stack using Queues)
 *
 * 题目描述：
 * 请你仅使用两个队列实现一个后入先出（LIFO）的栈，并支持普通栈的全部四种操作（push、top、pop 和 empty）。
 *
 * 核心思想：
 * 队列是先进先出(FIFO)，栈是后进先出(LIFO)
 * 关键在于如何用FIFO的数据结构模拟LIFO的行为
 *
 * 实现策略：
 * 方法一：两个队列，push时保持一个队列为空，pop时倒腾元素
 * 方法二：一个队列，push后将前面的元素重新排列
 */

/**
 * 解法一：使用两个队列实现栈（推荐）
 *
 * 核心思想：
 * - 始终保持一个队列为主队列存储数据，另一个为辅助队列
 * - push: 直接加入主队列
 * - pop: 将主队列中除最后一个元素外的所有元素转移到辅助队列，
 *        取出最后一个元素，然后交换两个队列的角色
 *
 * @time push: O(1), pop: O(n), top: O(n), empty: O(1)
 * @space O(n) 需要额外的队列空间
 */
class MyStack {
    constructor() {
        // 主队列，存储栈的元素
        this.queue1 = [];
        // 辅助队列，用于倒腾元素
        this.queue2 = [];
    }

    /**
     * 将元素压入栈顶
     * @param {number} x - 要压入的元素
     * @returns {void}
     */
    push(x) {
        // 直接将元素加入主队列末尾
        this.queue1.push(x);
    }

    /**
     * 移除并返回栈顶元素
     * @returns {number} 栈顶元素
     */
    pop() {
        if (this.empty()) {
            throw new Error('栈为空，无法执行pop操作');
        }

        // 将主队列中除最后一个元素外的所有元素转移到辅助队列
        while (this.queue1.length > 1) {
            this.queue2.push(this.queue1.shift());
        }

        // 取出最后一个元素（即栈顶元素）
        const topElement = this.queue1.shift();

        // 交换两个队列的角色，使辅助队列成为新的主队列
        [this.queue1, this.queue2] = [this.queue2, this.queue1];

        return topElement;
    }

    /**
     * 返回栈顶元素但不移除
     * @returns {number} 栈顶元素
     */
    top() {
        if (this.empty()) {
            throw new Error('栈为空，无法获取栈顶元素');
        }

        // 先执行pop获取栈顶元素，然后再push回去
        const topElement = this.pop();
        this.push(topElement);
        return topElement;
    }

    /**
     * 检查栈是否为空
     * @returns {boolean} 栈是否为空
     */
    empty() {
        return this.queue1.length === 0 && this.queue2.length === 0;
    }

    /**
     * 获取栈的大小
     * @returns {number} 栈中元素的数量
     */
    size() {
        return this.queue1.length + this.queue2.length;
    }
}

/**
 * 解法二：使用一个队列实现栈（优化版）
 *
 * 核心思想：
 * - push: 将新元素加入队列，然后将之前的所有元素重新排列
 * - 具体做法：push后，将前面的n-1个元素依次出队再入队
 * - 这样最新的元素就会位于队列前端，模拟栈的后进先出
 *
 * @time push: O(n), pop: O(1), top: O(1), empty: O(1)
 * @space O(n) 只需要一个队列
 */
class MyStackOptimized {
    constructor() {
        this.queue = [];
    }

    /**
     * 将元素压入栈顶
     * @param {number} x - 要压入的元素
     * @returns {void}
     */
    push(x) {
        const size = this.queue.length;

        // 将新元素加入队列末尾
        this.queue.push(x);

        // 将之前的所有元素重新排列，使新元素位于队列前端
        for (let i = 0; i < size; i++) {
            this.queue.push(this.queue.shift());
        }
    }

    /**
     * 移除并返回栈顶元素
     * @returns {number} 栈顶元素
     */
    pop() {
        if (this.empty()) {
            throw new Error('栈为空，无法执行pop操作');
        }
        return this.queue.shift();
    }

    /**
     * 返回栈顶元素但不移除
     * @returns {number} 栈顶元素
     */
    top() {
        if (this.empty()) {
            throw new Error('栈为空，无法获取栈顶元素');
        }
        return this.queue[0];
    }

    /**
     * 检查栈是否为空
     * @returns {boolean} 栈是否为空
     */
    empty() {
        return this.queue.length === 0;
    }

    /**
     * 获取栈的大小
     * @returns {number} 栈中元素的数量
     */
    size() {
        return this.queue.length;
    }
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 225: 用队列实现栈 测试 ===\n');

    // 测试基础功能
    function testBasicOperations() {
        console.log('--- 基础操作测试 ---');

        const stack = new MyStack();

        console.log('1. 测试空栈');
        console.log(`空栈检查: ${stack.empty()}`); // true

        console.log('\n2. 测试push操作');
        stack.push(1);
        stack.push(2);
        stack.push(3);
        console.log(`push 1, 2, 3 后，栈是否为空: ${stack.empty()}`); // false
        console.log(`栈大小: ${stack.size()}`); // 3

        console.log('\n3. 测试top操作');
        console.log(`栈顶元素: ${stack.top()}`); // 3
        console.log(`top后栈大小: ${stack.size()}`); // 3 (top不移除元素)

        console.log('\n4. 测试pop操作');
        console.log(`pop: ${stack.pop()}`); // 3
        console.log(`pop: ${stack.pop()}`); // 2
        console.log(`栈大小: ${stack.size()}`); // 1
        console.log(`栈顶元素: ${stack.top()}`); // 1

        console.log(`最后pop: ${stack.pop()}`); // 1
        console.log(`栈是否为空: ${stack.empty()}`); // true
    }

    // 测试优化版本
    function testOptimizedVersion() {
        console.log('\n--- 优化版本测试 ---');

        const stack = new MyStackOptimized();

        // 相同的测试流程
        stack.push(10);
        stack.push(20);
        stack.push(30);

        console.log(`优化版栈顶: ${stack.top()}`); // 30
        console.log(`优化版pop: ${stack.pop()}`); // 30
        console.log(`优化版pop: ${stack.pop()}`); // 20
        console.log(`优化版栈顶: ${stack.top()}`); // 10
    }

    // 测试边界情况
    function testEdgeCases() {
        console.log('\n--- 边界情况测试 ---');

        const stack = new MyStack();

        // 测试单元素
        stack.push(42);
        console.log(`单元素栈顶: ${stack.top()}`); // 42
        console.log(`单元素pop: ${stack.pop()}`); // 42
        console.log(`pop后是否为空: ${stack.empty()}`); // true

        // 测试异常情况
        try {
            stack.pop(); // 应该抛出异常
        } catch (e) {
            console.log(`空栈pop异常: ${e.message}`);
        }

        try {
            stack.top(); // 应该抛出异常
        } catch (e) {
            console.log(`空栈top异常: ${e.message}`);
        }
    }

    testBasicOperations();
    testOptimizedVersion();
    testEdgeCases();
}

// 性能比较测试
function performanceComparison() {
    console.log('\n=== 性能比较测试 ===');

    const n = 1000;

    // 测试解法一（两个队列）
    console.time('两个队列版本');
    const stack1 = new MyStack();
    for (let i = 0; i < n; i++) {
        stack1.push(i);
    }
    for (let i = 0; i < n; i++) {
        stack1.pop();
    }
    console.timeEnd('两个队列版本');

    // 测试解法二（一个队列）
    console.time('一个队列版本');
    const stack2 = new MyStackOptimized();
    for (let i = 0; i < n; i++) {
        stack2.push(i);
    }
    for (let i = 0; i < n; i++) {
        stack2.pop();
    }
    console.timeEnd('一个队列版本');
}

// 复杂度分析
function complexityAnalysis() {
    console.log('\n=== 复杂度分析 ===');
    console.log(`
解法对比:

方法一 (两个队列):
- push: O(1) - 直接加入队列末尾
- pop:  O(n) - 需要转移n-1个元素
- top:  O(n) - 通过pop+push实现
- space: O(n) - 需要两个队列

方法二 (一个队列):
- push: O(n) - 需要重新排列n-1个元素
- pop:  O(1) - 直接从队列头部取出
- top:  O(1) - 直接访问队列头部
- space: O(n) - 只需要一个队列

选择建议:
- 如果push操作频繁，选择方法一
- 如果pop/top操作频繁，选择方法二
- 空间要求严格时，选择方法二
    `);
}

// 运行所有测试
if (typeof require !== 'undefined' && require.main === module) {
    runTests();
    performanceComparison();
    complexityAnalysis();
}

// Node.js导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MyStack,
        MyStackOptimized,
        runTests,
        performanceComparison,
        complexityAnalysis
    };
}
