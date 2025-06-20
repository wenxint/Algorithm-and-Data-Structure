/**
 * 第3章：栈与队列 - 练习题解答
 *
 * 本文件包含5道精选练习题的完整解答：
 * 1. 有效的括号（简单）
 * 2. 用栈实现队列（简单）
 * 3. 每日温度（中等）
 * 4. 二叉树的层序遍历（中等）
 * 5. 滑动窗口最大值（困难）
 *
 * @author Algorithm Tutorial
 * @date 2024
 */

// ==================== 辅助数据结构 ====================

/**
 * 二叉树节点定义
 */
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * 从数组创建二叉树（层序构建）
 */
function createTreeFromArray(arr) {
    if (!arr || arr.length === 0) return null;

    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;

    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();

        if (i < arr.length && arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;

        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }

    return root;
}

// ==================== 题目1：有效的括号（简单） ====================

/**
 * 有效的括号
 *
 * 核心思想：
 * 使用栈进行括号匹配，利用栈的LIFO特性
 * 1. 遇到左括号时压入栈中
 * 2. 遇到右括号时检查栈顶是否为对应的左括号
 * 3. 最终栈为空则所有括号都正确匹配
 *
 * @param {string} s - 包含括号的字符串
 * @returns {boolean} 是否有效
 * @time O(n) - 遍历字符串一次
 * @space O(n) - 栈最多存储n/2个左括号
 */
function isValid(s) {
    const stack = [];
    const pairs = {
        ')': '(',
        '}': '{',
        ']': '['
    };

    for (const char of s) {
        if (char === '(' || char === '{' || char === '[') {
            // 左括号直接入栈
            stack.push(char);
        } else if (char === ')' || char === '}' || char === ']') {
            // 右括号检查匹配
            if (stack.length === 0 || stack.pop() !== pairs[char]) {
                return false; // 栈空或不匹配
            }
        }
    }

    return stack.length === 0; // 栈为空说明所有括号都匹配
}

// ==================== 题目2：用栈实现队列（简单） ====================

/**
 * 用栈实现队列
 *
 * 核心思想：
 * 使用两个栈模拟队列的FIFO特性
 * - inputStack：负责接收新元素（push操作）
 * - outputStack：负责弹出元素（pop和peek操作）
 * - 当outputStack为空时，将inputStack的所有元素转移过来
 */
class MyQueue {
    constructor() {
        this.inputStack = [];   // 输入栈
        this.outputStack = [];  // 输出栈
    }

    /**
     * 入队操作
     * @param {number} x - 要入队的元素
     * @time O(1) - 直接压入输入栈
     */
    push(x) {
        this.inputStack.push(x);
    }

    /**
     * 出队操作
     * @returns {number} 队首元素
     * @time O(1) 摊还复杂度 - 每个元素最多在两个栈之间转移一次
     */
    pop() {
        if (this.outputStack.length === 0) {
            this._transfer(); // 转移输入栈的元素到输出栈
        }
        return this.outputStack.pop();
    }

    /**
     * 查看队首元素
     * @returns {number} 队首元素
     * @time O(1) 摊还复杂度
     */
    peek() {
        if (this.outputStack.length === 0) {
            this._transfer();
        }
        return this.outputStack[this.outputStack.length - 1];
    }

    /**
     * 判断队列是否为空
     * @returns {boolean} 是否为空
     * @time O(1)
     */
    empty() {
        return this.inputStack.length === 0 && this.outputStack.length === 0;
    }

    /**
     * 私有方法：将输入栈的元素转移到输出栈
     * 实现顺序反转，使得后进先出变成先进先出
     */
    _transfer() {
        while (this.inputStack.length > 0) {
            this.outputStack.push(this.inputStack.pop());
        }
    }
}

// ==================== 题目3：每日温度（中等） ====================

/**
 * 每日温度
 *
 * 核心思想：
 * 单调栈解决"下一个更大元素"问题
 * 1. 维护一个单调递减栈，存储温度的索引
 * 2. 当遇到更高温度时，栈中所有较低温度都找到了答案
 * 3. 计算索引差值得到等待天数
 *
 * @param {number[]} temperatures - 每日温度数组
 * @returns {number[]} 等待天数数组
 * @time O(n) - 每个元素最多入栈出栈一次
 * @space O(n) - 栈的空间复杂度
 */
function dailyTemperatures(temperatures) {
    const result = new Array(temperatures.length).fill(0);
    const stack = []; // 单调递减栈，存储索引

    for (let i = 0; i < temperatures.length; i++) {
        // 当前温度比栈顶温度高时，栈顶位置找到了答案
        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const index = stack.pop();
            result[index] = i - index; // 计算等待天数
        }
        // 当前索引入栈
        stack.push(i);
    }

    return result;
}

// ==================== 题目4：二叉树的层序遍历（中等） ====================

/**
 * 二叉树的层序遍历
 *
 * 核心思想：
 * 使用队列进行广度优先搜索（BFS）
 * 1. 根节点入队
 * 2. 每次处理一层的所有节点
 * 3. 将当前层节点的子节点加入下一层
 * 4. 队列的FIFO特性保证层序访问
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number[][]} 层序遍历结果，每一层一个数组
 * @time O(n) - 访问每个节点一次
 * @space O(w) - w为树的最大宽度
 */
function levelOrder(root) {
    if (!root) return [];

    const result = [];
    const queue = [root];

    while (queue.length > 0) {
        const levelSize = queue.length; // 当前层的节点数
        const currentLevel = [];

        // 处理当前层的所有节点
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift(); // 出队一个节点
            currentLevel.push(node.val);

            // 将子节点加入下一层
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        result.push(currentLevel);
    }

    return result;
}

// ==================== 题目5：滑动窗口最大值（困难） ====================

/**
 * 滑动窗口最大值
 *
 * 核心思想：
 * 使用双端队列维护单调递减序列
 * 1. 队列中存储可能成为窗口最大值的元素索引
 * 2. 队头始终是当前窗口的最大值
 * 3. 移除超出窗口范围的元素
 * 4. 维护队列的单调递减性
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 窗口大小
 * @returns {number[]} 每个窗口的最大值
 * @time O(n) - 每个元素最多入队出队一次
 * @space O(k) - 双端队列最多存储k个元素
 */
function maxSlidingWindow(nums, k) {
    const result = [];
    const deque = []; // 存储索引的双端队列，维护单调递减

    for (let i = 0; i < nums.length; i++) {
        // 移除超出窗口范围的元素（队头）
        while (deque.length > 0 && deque[0] < i - k + 1) {
            deque.shift();
        }

        // 维护单调递减性：移除所有小于当前元素的尾部元素
        while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
            deque.pop();
        }

        // 当前元素索引入队
        deque.push(i);

        // 当窗口大小达到k时，记录最大值
        if (i >= k - 1) {
            result.push(nums[deque[0]]); // 队头就是最大值
        }
    }

    return result;
}

// ==================== 测试函数 ====================

/**
 * 测试所有解答
 */
function runAllTests() {
    console.log("=== 第3章：栈与队列 - 练习题解答测试 ===\n");

    // 测试1：有效的括号
    console.log("题目1：有效的括号");
    const brackets = ["()", "()[]{}", "(]", "([)]", "{[]}"];
    brackets.forEach(s => {
        console.log(`输入: "${s}" -> 输出: ${isValid(s)}`);
    });

    // 测试2：用栈实现队列
    console.log("\n题目2：用栈实现队列");
    const myQueue = new MyQueue();
    console.log("执行操作序列：");
    myQueue.push(1);
    console.log("push(1)");
    myQueue.push(2);
    console.log("push(2)");
    console.log(`peek(): ${myQueue.peek()}`); // 返回 1
    console.log(`pop(): ${myQueue.pop()}`);   // 返回 1
    console.log(`empty(): ${myQueue.empty()}`); // 返回 false

    // 测试3：每日温度
    console.log("\n题目3：每日温度");
    const temperatures = [73, 74, 75, 71, 69, 72, 76, 73];
    console.log(`输入: ${JSON.stringify(temperatures)}`);
    console.log(`输出: ${JSON.stringify(dailyTemperatures(temperatures))}`);

    // 测试4：二叉树的层序遍历
    console.log("\n题目4：二叉树的层序遍历");
    const tree = createTreeFromArray([3, 9, 20, null, null, 15, 7]);
    console.log("输入二叉树: [3, 9, 20, null, null, 15, 7]");
    console.log(`输出: ${JSON.stringify(levelOrder(tree))}`);

    // 测试5：滑动窗口最大值
    console.log("\n题目5：滑动窗口最大值");
    const nums = [1, 3, -1, -3, 5, 3, 6, 7];
    const k = 3;
    console.log(`输入: nums = ${JSON.stringify(nums)}, k = ${k}`);
    console.log(`输出: ${JSON.stringify(maxSlidingWindow(nums, k))}`);

    console.log("\n=== 所有测试完成！ ===");
}

// 运行测试
if (typeof require !== 'undefined' && require.main === module) {
    runAllTests();
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TreeNode,
        createTreeFromArray,
        isValid,
        MyQueue,
        dailyTemperatures,
        levelOrder,
        maxSlidingWindow
    };
}