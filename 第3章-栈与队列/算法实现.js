/**
 * 第3章：栈与队列 - 算法实现
 *
 * 本文件包含：
 * 1. 单调栈算法：下一个更大元素、柱状图最大矩形
 * 2. 递归模拟：二叉树遍历、表达式求值
 * 3. BFS算法：层序遍历、最短路径
 * 4. 栈的高级应用：括号匹配、表达式转换
 * 5. 队列的高级应用：滑动窗口、任务调度
 *
 * @author Algorithm Tutorial
 * @date 2024
 */

// ==================== 辅助函数 ====================

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
 * 从数组创建二叉树（层序）
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

// ==================== 单调栈算法 ====================

/**
 * 下一个更大元素 I
 *
 * 核心思想：
 * 维护一个单调递减栈，存储还没找到下一个更大元素的元素索引
 * 当遇到更大元素时，栈中小于当前元素的所有元素都找到了答案
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[]} 每个元素的下一个更大元素，-1表示不存在
 * @time O(n) - 每个元素最多入栈出栈一次
 * @space O(n) - 栈的空间复杂度
 */
function nextGreaterElement(nums) {
    const result = new Array(nums.length).fill(-1);
    const stack = []; // 单调递减栈，存储索引

    for (let i = 0; i < nums.length; i++) {
        // 当前元素大于栈顶元素时，栈顶元素找到了下一个更大元素
        while (stack.length > 0 && nums[i] > nums[stack[stack.length - 1]]) {
            const index = stack.pop();
            result[index] = nums[i];
        }
        // 当前元素入栈
        stack.push(i);
    }

    return result;
}

/**
 * 下一个更大元素 II（循环数组）
 *
 * 核心思想：
 * 将数组看作循环数组，可以通过遍历两遍数组来模拟
 * 第一遍正常处理，第二遍只用于触发栈中剩余元素的弹出
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[]} 每个元素的下一个更大元素
 * @time O(n) - 每个元素最多入栈出栈一次
 * @space O(n) - 栈的空间复杂度
 */
function nextGreaterElementII(nums) {
    const n = nums.length;
    const result = new Array(n).fill(-1);
    const stack = [];

    // 遍历两遍数组，模拟循环
    for (let i = 0; i < 2 * n; i++) {
        const num = nums[i % n]; // 循环取值

        while (stack.length > 0 && num > nums[stack[stack.length - 1]]) {
            const index = stack.pop();
            result[index] = num;
        }

        // 只在第一遍时入栈，避免重复
        if (i < n) {
            stack.push(i);
        }
    }

    return result;
}

/**
 * 柱状图中最大的矩形
 *
 * 核心思想：
 * 对于每个柱子，找到它左右两边第一个比它矮的柱子
 * 以当前柱子高度为矩形高度，计算能形成的最大矩形面积
 * 使用单调递增栈来高效找到边界
 *
 * @param {number[]} heights - 柱子高度数组
 * @returns {number} 最大矩形面积
 * @time O(n) - 每个元素最多入栈出栈一次
 * @space O(n) - 栈的空间复杂度
 */
function largestRectangleArea(heights) {
    const stack = []; // 单调递增栈，存储索引
    let maxArea = 0;

    // 在末尾添加高度为0的哨兵，确保所有柱子都能被处理
    heights.push(0);

    for (let i = 0; i < heights.length; i++) {
        // 当前柱子比栈顶柱子矮时，计算以栈顶柱子为高的矩形面积
        while (stack.length > 0 && heights[i] < heights[stack[stack.length - 1]]) {
            const height = heights[stack.pop()]; // 矩形高度
            // 矩形宽度：当前位置到栈顶前一个位置之间的距离
            const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }

    heights.pop(); // 移除哨兵
    return maxArea;
}

/**
 * 每日温度
 *
 * 核心思想：
 * 找到每一天后面第一个比当前温度高的天数
 * 维护单调递减栈，存储还没找到更高温度的天数索引
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
        stack.push(i);
    }

    return result;
}

// ==================== 递归模拟算法 ====================

/**
 * 有效的括号
 *
 * 核心思想：
 * 使用栈来匹配括号对，遇到左括号入栈，遇到右括号检查匹配
 * 最终栈为空说明所有括号都正确匹配
 *
 * @param {string} s - 包含括号的字符串
 * @returns {boolean} 是否有效
 * @time O(n) - 遍历字符串一次
 * @space O(n) - 栈的空间复杂度
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
            // 左括号入栈
            stack.push(char);
        } else if (char === ')' || char === '}' || char === ']') {
            // 右括号检查匹配
            if (stack.length === 0 || stack.pop() !== pairs[char]) {
                return false;
            }
        }
    }

    return stack.length === 0; // 栈为空说明所有括号都匹配
}

/**
 * 二叉树的前序遍历（迭代版本）
 *
 * 核心思想：
 * 使用栈模拟递归过程，先访问根节点
 * 由于栈是LIFO，需要先压入右子树再压入左子树
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number[]} 前序遍历结果
 * @time O(n) - 访问每个节点一次
 * @space O(h) - h为树的高度
 */
function preorderTraversal(root) {
    if (!root) return [];

    const result = [];
    const stack = [root];

    while (stack.length > 0) {
        const node = stack.pop();
        result.push(node.val); // 访问当前节点

        // 先压入右子树，再压入左子树（因为栈是LIFO）
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
    }

    return result;
}

/**
 * 二叉树的中序遍历（迭代版本）
 *
 * 核心思想：
 * 中序遍历需要先访问左子树，再访问根节点，最后访问右子树
 * 使用栈保存路径，先一路向左压栈，然后处理栈顶节点
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number[]} 中序遍历结果
 * @time O(n) - 访问每个节点一次
 * @space O(h) - h为树的高度
 */
function inorderTraversal(root) {
    const result = [];
    const stack = [];
    let current = root;

    while (current || stack.length > 0) {
        // 一路向左，将所有左子树压栈
        while (current) {
            stack.push(current);
            current = current.left;
        }

        // 处理栈顶节点（当前子树的根）
        current = stack.pop();
        result.push(current.val);

        // 转向右子树
        current = current.right;
    }

    return result;
}

/**
 * 二叉树的后序遍历（迭代版本）
 *
 * 核心思想：
 * 后序遍历是左-右-根，可以转换为根-右-左的逆序
 * 使用栈进行根-右-左遍历，然后反转结果
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number[]} 后序遍历结果
 * @time O(n) - 访问每个节点一次
 * @space O(h) - h为树的高度
 */
function postorderTraversal(root) {
    if (!root) return [];

    const result = [];
    const stack = [root];

    while (stack.length > 0) {
        const node = stack.pop();
        result.push(node.val); // 访问当前节点

        // 先压入左子树，再压入右子树（与前序相反）
        if (node.left) stack.push(node.left);
        if (node.right) stack.push(node.right);
    }

    return result.reverse(); // 反转得到后序遍历结果
}

/**
 * 逆波兰表达式求值
 *
 * 核心思想：
 * 后缀表达式（逆波兰表达式）使用栈求值
 * 遇到数字就入栈，遇到操作符就弹出两个操作数计算
 *
 * @param {string[]} tokens - 逆波兰表达式数组
 * @returns {number} 计算结果
 * @time O(n) - 遍历所有token一次
 * @space O(n) - 栈的空间复杂度
 */
function evalRPN(tokens) {
    const stack = [];
    const operators = new Set(['+', '-', '*', '/']);

    for (const token of tokens) {
        if (operators.has(token)) {
            // 弹出两个操作数（注意顺序）
            const b = stack.pop();
            const a = stack.pop();

            let result;
            switch (token) {
                case '+': result = a + b; break;
                case '-': result = a - b; break;
                case '*': result = a * b; break;
                case '/': result = Math.trunc(a / b); break; // 向零截断
            }

            stack.push(result);
        } else {
            // 数字入栈
            stack.push(parseInt(token));
        }
    }

    return stack[0]; // 栈中剩余的唯一元素就是结果
}

// ==================== BFS算法 ====================

/**
 * 二叉树的层序遍历
 *
 * 核心思想：
 * 使用队列进行广度优先搜索，逐层访问节点
 * 队列的FIFO特性保证同一层的节点按顺序处理
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
            const node = queue.shift();
            currentLevel.push(node.val);

            // 将子节点加入下一层
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        result.push(currentLevel);
    }

    return result;
}

/**
 * 二叉树的锯齿形层序遍历
 *
 * 核心思想：
 * 在普通层序遍历基础上，奇数层正序，偶数层反序
 * 使用双端队列或在结果处理时反转
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number[][]} 锯齿形层序遍历结果
 * @time O(n) - 访问每个节点一次
 * @space O(w) - w为树的最大宽度
 */
function zigzagLevelOrder(root) {
    if (!root) return [];

    const result = [];
    const queue = [root];
    let leftToRight = true; // 遍历方向标志

    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];

        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();

            // 根据方向决定插入位置
            if (leftToRight) {
                currentLevel.push(node.val);
            } else {
                currentLevel.unshift(node.val); // 头插法实现反序
            }

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        result.push(currentLevel);
        leftToRight = !leftToRight; // 切换方向
    }

    return result;
}

/**
 * 在二叉树中找到距离目标节点最近的叶子节点
 *
 * 核心思想：
 * 将二叉树转换为无向图，然后使用BFS找最短路径
 * 从目标节点开始BFS，第一个遇到的叶子节点就是答案
 *
 * @param {TreeNode} root - 二叉树根节点
 * @param {number} target - 目标节点值
 * @returns {number} 最近叶子节点值
 * @time O(n) - 建图O(n) + BFS O(n)
 * @space O(n) - 图的邻接表空间
 */
function findClosestLeaf(root, target) {
    // 构建无向图
    const graph = new Map();
    let targetNode = null;

    function buildGraph(node, parent = null) {
        if (!node) return;

        if (node.val === target) {
            targetNode = node;
        }

        if (!graph.has(node)) {
            graph.set(node, []);
        }

        if (parent) {
            graph.get(node).push(parent);
            graph.get(parent).push(node);
        }

        buildGraph(node.left, node);
        buildGraph(node.right, node);
    }

    buildGraph(root);

    // BFS寻找最近的叶子节点
    const queue = [targetNode];
    const visited = new Set([targetNode]);

    while (queue.length > 0) {
        const node = queue.shift();

        // 检查是否为叶子节点
        if (!node.left && !node.right) {
            return node.val;
        }

        // 遍历邻居节点
        for (const neighbor of graph.get(node) || []) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }

    return -1; // 理论上不会到达这里
}

// ==================== 滑动窗口最大值 ====================

/**
 * 滑动窗口最大值
 *
 * 核心思想：
 * 使用双端队列维护一个单调递减队列
 * 队列中存储可能成为窗口最大值的元素索引
 * 队头始终是当前窗口的最大值
 *
 * @param {number[]} nums - 输入数组
 * @param {number} k - 窗口大小
 * @returns {number[]} 每个窗口的最大值
 * @time O(n) - 每个元素最多入队出队一次
 * @space O(k) - 双端队列空间
 */
function maxSlidingWindow(nums, k) {
    const result = [];
    const deque = []; // 存储索引的双端队列，维护单调递减

    for (let i = 0; i < nums.length; i++) {
        // 移除超出窗口范围的元素
        while (deque.length > 0 && deque[0] < i - k + 1) {
            deque.shift();
        }

        // 维护单调递减性：移除所有小于当前元素的尾部元素
        while (deque.length > 0 && nums[deque[deque.length - 1]] < nums[i]) {
            deque.pop();
        }

        // 当前元素入队
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
 * 单调栈算法测试
 */
function testMonotonicStack() {
    console.log("=== 单调栈算法测试 ===");

    // 测试下一个更大元素
    const nums1 = [2, 1, 2, 4, 3, 1];
    console.log(`下一个更大元素: ${JSON.stringify(nums1)} -> ${JSON.stringify(nextGreaterElement(nums1))}`);

    // 测试循环数组的下一个更大元素
    const nums2 = [1, 2, 1];
    console.log(`循环数组下一个更大元素: ${JSON.stringify(nums2)} -> ${JSON.stringify(nextGreaterElementII(nums2))}`);

    // 测试柱状图最大矩形
    const heights = [2, 1, 5, 6, 2, 3];
    console.log(`柱状图最大矩形: ${JSON.stringify(heights)} -> ${largestRectangleArea([...heights])}`);

    // 测试每日温度
    const temperatures = [73, 74, 75, 71, 69, 72, 76, 73];
    console.log(`每日温度: ${JSON.stringify(temperatures)} -> ${JSON.stringify(dailyTemperatures(temperatures))}`);
}

/**
 * 递归模拟算法测试
 */
function testStackRecursion() {
    console.log("\n=== 递归模拟算法测试 ===");

    // 测试括号匹配
    const brackets = ["()", "()[]{}", "(]", "([)]", "{[]}"];
    brackets.forEach(s => {
        console.log(`括号匹配 "${s}": ${isValid(s)}`);
    });

    // 测试二叉树遍历
    const tree = createTreeFromArray([1, 2, 3, 4, 5, null, 6]);
    console.log("前序遍历:", preorderTraversal(tree));
    console.log("中序遍历:", inorderTraversal(tree));
    console.log("后序遍历:", postorderTraversal(tree));

    // 测试逆波兰表达式
    const rpn = ["2", "1", "+", "3", "*"];
    console.log(`逆波兰表达式 ${JSON.stringify(rpn)}: ${evalRPN(rpn)}`);
}

/**
 * BFS算法测试
 */
function testBFS() {
    console.log("\n=== BFS算法测试 ===");

    // 测试层序遍历
    const tree = createTreeFromArray([3, 9, 20, null, null, 15, 7]);
    console.log("层序遍历:", levelOrder(tree));
    console.log("锯齿形层序遍历:", zigzagLevelOrder(tree));

    // 测试滑动窗口最大值
    const nums = [1, 3, -1, -3, 5, 3, 6, 7];
    const k = 3;
    console.log(`滑动窗口最大值 nums=${JSON.stringify(nums)}, k=${k}:`);
    console.log(maxSlidingWindow(nums, k));
}

// 运行所有测试
if (typeof require !== 'undefined' && require.main === module) {
    testMonotonicStack();
    testStackRecursion();
    testBFS();

    console.log("\n=== 所有算法测试完成！ ===");
}

// 导出函数供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TreeNode,
        createTreeFromArray,
        nextGreaterElement,
        nextGreaterElementII,
        largestRectangleArea,
        dailyTemperatures,
        isValid,
        preorderTraversal,
        inorderTraversal,
        postorderTraversal,
        evalRPN,
        levelOrder,
        zigzagLevelOrder,
        findClosestLeaf,
        maxSlidingWindow
    };
}