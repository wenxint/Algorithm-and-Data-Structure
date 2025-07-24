/**
 * LeetCode 155: 最小栈 (Min Stack)
 *
 * 题目描述：
 * 设计一个支持 push ，pop ，top 操作，并能在常数时间内检索到最小元素的栈。
 *
 * 实现 MinStack 类:
 * - MinStack() 初始化堆栈对象。
 * - void push(int val) 将元素val推入堆栈。
 * - void pop() 删除堆栈顶部的元素。
 * - int top() 获取堆栈顶部的元素。
 * - int getMin() 检索堆栈中的最小元素。
 *
 * 核心思想：
 * 辅助栈思想 - 用额外的栈来记录每个位置的最小值
 * 关键在于如何在O(1)时间内获取最小值，同时保持栈的正常操作
 *
 * 设计策略：
 * 方法一：双栈法 - 一个数据栈 + 一个最小值栈
 * 方法二：单栈优化 - 在一个栈中同时存储数据和最小值信息
 * 方法三：差值法 - 存储与最小值的差值，节省空间
 */

/**
 * 解法一：双栈实现（推荐）
 *
 * 核心思想：
 * - 数据栈：正常的栈操作
 * - 最小值栈：存储对应位置的最小值
 * - push时：同时向两个栈推入数据
 * - pop时：同时从两个栈弹出数据
 *
 * @time 所有操作都是 O(1)
 * @space O(n) 需要额外的最小值栈
 */
class MinStack {
    constructor() {
        // 数据栈，存储实际的元素
        this.dataStack = [];
        // 最小值栈，存储对应位置的最小值
        this.minStack = [];
    }

    /**
     * 将元素推入栈顶
     * @param {number} val - 要推入的值
     * @returns {void}
     */
    push(val) {
        // 将值推入数据栈
        this.dataStack.push(val);

        // 计算新的最小值并推入最小值栈
        if (this.minStack.length === 0) {
            this.minStack.push(val);
        } else {
            const currentMin = Math.min(val, this.minStack[this.minStack.length - 1]);
            this.minStack.push(currentMin);
        }
    }

    /**
     * 移除栈顶元素
     * @returns {void}
     */
    pop() {
        if (this.dataStack.length === 0) {
            throw new Error('栈为空，无法执行pop操作');
        }

        // 同时从两个栈中弹出元素
        this.dataStack.pop();
        this.minStack.pop();
    }

    /**
     * 获取栈顶元素
     * @returns {number} 栈顶元素
     */
    top() {
        if (this.dataStack.length === 0) {
            throw new Error('栈为空，无法获取栈顶元素');
        }

        return this.dataStack[this.dataStack.length - 1];
    }

    /**
     * 获取栈中的最小元素
     * @returns {number} 最小元素
     */
    getMin() {
        if (this.minStack.length === 0) {
            throw new Error('栈为空，无法获取最小元素');
        }

        return this.minStack[this.minStack.length - 1];
    }

    /**
     * 检查栈是否为空
     * @returns {boolean} 是否为空
     */
    isEmpty() {
        return this.dataStack.length === 0;
    }

    /**
     * 获取栈的大小
     * @returns {number} 栈中元素数量
     */
    size() {
        return this.dataStack.length;
    }
}

/**
 * 解法二：优化的双栈实现（节省空间）
 *
 * 核心思想：
 * 最小值栈只在必要时才推入新值
 * 当新值小于等于当前最小值时才推入
 *
 * @time 所有操作都是 O(1)
 * @space O(n) 但最小值栈通常更小
 */
class MinStackOptimized {
    constructor() {
        this.dataStack = [];
        this.minStack = []; // 只存储真正的最小值变化点
    }

    /**
     * 推入元素
     * @param {number} val
     */
    push(val) {
        this.dataStack.push(val);

        // 只有当新值小于等于当前最小值时，才推入最小值栈
        if (this.minStack.length === 0 || val <= this.getMin()) {
            this.minStack.push(val);
        }
    }

    /**
     * 弹出元素
     */
    pop() {
        if (this.dataStack.length === 0) {
            throw new Error('栈为空');
        }

        const popped = this.dataStack.pop();

        // 如果弹出的元素是最小值，也要从最小值栈中弹出
        if (popped === this.getMin()) {
            this.minStack.pop();
        }

        return popped;
    }

    /**
     * 获取栈顶元素
     */
    top() {
        if (this.dataStack.length === 0) {
            throw new Error('栈为空');
        }
        return this.dataStack[this.dataStack.length - 1];
    }

    /**
     * 获取最小元素
     */
    getMin() {
        if (this.minStack.length === 0) {
            throw new Error('栈为空');
        }
        return this.minStack[this.minStack.length - 1];
    }

    isEmpty() {
        return this.dataStack.length === 0;
    }

    size() {
        return this.dataStack.length;
    }
}

/**
 * 解法三：差值法实现（最节省空间）
 *
 * 核心思想：
 * 不直接存储值，而是存储与最小值的差值
 * 当差值为负时，说明当前值就是新的最小值
 *
 * @time 所有操作都是 O(1)
 * @space O(1) 额外空间（不考虑栈本身）
 */
class MinStackDifference {
    constructor() {
        this.stack = []; // 存储差值
        this.min = null; // 当前最小值
    }

    /**
     * 推入元素
     * @param {number} val
     */
    push(val) {
        if (this.stack.length === 0) {
            this.stack.push(0);
            this.min = val;
        } else {
            // 存储与当前最小值的差值
            const diff = val - this.min;
            this.stack.push(diff);

            // 如果差值为负，更新最小值
            if (diff < 0) {
                this.min = val;
            }
        }
    }

    /**
     * 弹出元素
     */
    pop() {
        if (this.stack.length === 0) {
            throw new Error('栈为空');
        }

        const diff = this.stack.pop();

        if (diff < 0) {
            // 当前弹出的是最小值，需要恢复之前的最小值
            const poppedValue = this.min;
            this.min = this.min - diff; // 恢复之前的最小值
            return poppedValue;
        } else {
            return this.min + diff;
        }
    }

    /**
     * 获取栈顶元素
     */
    top() {
        if (this.stack.length === 0) {
            throw new Error('栈为空');
        }

        const diff = this.stack[this.stack.length - 1];
        if (diff < 0) {
            return this.min; // 栈顶就是最小值
        } else {
            return this.min + diff;
        }
    }

    /**
     * 获取最小元素
     */
    getMin() {
        if (this.stack.length === 0) {
            throw new Error('栈为空');
        }
        return this.min;
    }

    isEmpty() {
        return this.stack.length === 0;
    }

    size() {
        return this.stack.length;
    }
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 155: 最小栈 测试 ===\n');

    // 基础功能测试
    function testBasicOperations() {
        console.log('--- 基础操作测试 ---');

        const minStack = new MinStack();

        console.log('1. 测试push和getMin');
        minStack.push(-2);
        minStack.push(0);
        minStack.push(-3);
        console.log(`当前最小值: ${minStack.getMin()}`); // -3

        console.log('\n2. 测试pop后的最小值');
        minStack.pop();
        console.log(`pop后栈顶: ${minStack.top()}`); // 0
        console.log(`pop后最小值: ${minStack.getMin()}`); // -2

        console.log('\n3. 测试连续操作');
        minStack.push(-1);
        console.log(`push(-1)后最小值: ${minStack.getMin()}`); // -2
        minStack.push(-5);
        console.log(`push(-5)后最小值: ${minStack.getMin()}`); // -5
    }

    // 测试三种实现的一致性
    function testAllImplementations() {
        console.log('\n--- 三种实现一致性测试 ---');

        const operations = [
            ['push', -2],
            ['push', 0],
            ['push', -3],
            ['getMin'],
            ['pop'],
            ['top'],
            ['getMin'],
            ['push', -1],
            ['getMin']
        ];

        const stacks = [
            new MinStack(),
            new MinStackOptimized(),
            new MinStackDifference()
        ];

        const names = ['基础双栈', '优化双栈', '差值法'];
        const results = [[], [], []];

        operations.forEach(([op, val]) => {
            console.log(`操作: ${op}${val !== undefined ? `(${val})` : ''}`);

            stacks.forEach((stack, index) => {
                try {
                    let result;
                    if (op === 'push') {
                        stack.push(val);
                        result = 'push成功';
                    } else if (op === 'pop') {
                        stack.pop();
                        result = 'pop成功';
                    } else if (op === 'top') {
                        result = stack.top();
                    } else if (op === 'getMin') {
                        result = stack.getMin();
                    }

                    results[index].push(result);
                    console.log(`  ${names[index]}: ${result}`);
                } catch (e) {
                    console.log(`  ${names[index]}: 错误 - ${e.message}`);
                }
            });
            console.log('');
        });

        // 检查结果一致性
        const isConsistent = results[0].every((val, i) =>
            val === results[1][i] && val === results[2][i]
        );
        console.log(`结果一致性检查: ${isConsistent ? '✅ 通过' : '❌ 失败'}`);
    }

    // 边界情况测试
    function testEdgeCases() {
        console.log('\n--- 边界情况测试 ---');

        const minStack = new MinStack();

        // 测试空栈异常
        try {
            minStack.getMin();
        } catch (e) {
            console.log(`空栈getMin异常: ${e.message}`);
        }

        try {
            minStack.pop();
        } catch (e) {
            console.log(`空栈pop异常: ${e.message}`);
        }

        // 测试单元素
        minStack.push(1);
        console.log(`单元素栈最小值: ${minStack.getMin()}`);
        console.log(`单元素栈顶: ${minStack.top()}`);

        // 测试重复元素
        minStack.push(1);
        minStack.push(1);
        console.log(`重复元素最小值: ${minStack.getMin()}`);
        minStack.pop();
        console.log(`弹出重复元素后最小值: ${minStack.getMin()}`);
    }

    testBasicOperations();
    testAllImplementations();
    testEdgeCases();
}

// 性能对比测试
function performanceTest() {
    console.log('\n=== 性能对比测试 ===');

    const n = 100000;
    const implementations = [
        { name: '基础双栈', class: MinStack },
        { name: '优化双栈', class: MinStackOptimized },
        { name: '差值法', class: MinStackDifference }
    ];

    implementations.forEach(({ name, class: StackClass }) => {
        console.time(`${name} - ${n}次操作`);

        const stack = new StackClass();

        // 大量push操作
        for (let i = 0; i < n; i++) {
            stack.push(Math.floor(Math.random() * 1000));
        }

        // 大量getMin和pop操作
        for (let i = 0; i < n / 2; i++) {
            stack.getMin();
            if (i % 2 === 0) {
                stack.pop();
            }
        }

        console.timeEnd(`${name} - ${n}次操作`);
    });
}

// 空间复杂度分析
function spaceAnalysis() {
    console.log('\n=== 空间复杂度分析 ===');
    console.log(`
设计方案对比:

1. 基础双栈法:
   - 空间复杂度: O(2n) = O(n)
   - 每个元素都需要在两个栈中存储
   - 实现简单，逻辑清晰

2. 优化双栈法:
   - 空间复杂度: O(n + k)，其中k是最小值变化次数
   - 只在最小值变化时才存储到最小值栈
   - 通常比基础版本节省空间

3. 差值法:
   - 空间复杂度: O(n) + O(1)
   - 只需要一个栈和一个最小值变量
   - 最节省空间，但实现稍复杂

时间复杂度:
- 所有方法的所有操作都是 O(1)

选择建议:
- 面试推荐: 基础双栈法（简单易懂）
- 空间敏感: 差值法
- 平衡考虑: 优化双栈法
    `);
}

// 运行所有测试
if (typeof require !== 'undefined' && require.main === module) {
    runTests();
    performanceTest();
    spaceAnalysis();
}

// Node.js导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MinStack,
        MinStackOptimized,
        MinStackDifference,
        runTests,
        performanceTest,
        spaceAnalysis
    };
}