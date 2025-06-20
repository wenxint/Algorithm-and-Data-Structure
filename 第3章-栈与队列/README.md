# 第3章：栈与队列

## 📚 章节概述

栈和队列是两种重要的线性数据结构，它们在数据的存取方式上有着明显的区别。栈遵循"后进先出"(LIFO)原则，队列遵循"先进先出"(FIFO)原则。在前端开发中，栈广泛应用于函数调用、表达式求值、浏览器历史记录等场景，队列则常用于任务调度、广度优先搜索、异步处理等。本章将深入讲解栈和队列的核心算法思想：**单调栈技术**、**递归与栈的关系**和**队列在BFS中的应用**。

## 🔧 栈的基础概念和操作

### 栈的基本特性
栈是一种只能在一端进行插入和删除操作的线性数据结构，这一端称为栈顶，另一端称为栈底。

```javascript
/**
 * 栈的基本操作演示
 */
const stack = [];

// 入栈操作 - push
stack.push(1);    // [1]
stack.push(2);    // [1, 2]
stack.push(3);    // [1, 2, 3]

console.log("当前栈:", stack);  // [1, 2, 3]

// 出栈操作 - pop
const top = stack.pop();    // 3，栈变为 [1, 2]
console.log("出栈元素:", top);  // 3
console.log("出栈后:", stack);  // [1, 2]

// 查看栈顶元素 - peek/top
const topElement = stack[stack.length - 1];  // 2
console.log("栈顶元素:", topElement);  // 2

// 检查栈是否为空
const isEmpty = stack.length === 0;
console.log("栈是否为空:", isEmpty);  // false
```

### 栈的常用方法

#### 基础访问方法
```javascript
/**
 * 栈的基础访问操作
 */
function stackBasicOperations() {
    const stack = [];

    // push(element) - 入栈
    stack.push(10);
    stack.push(20);
    stack.push(30);
    console.log("入栈后:", stack);  // [10, 20, 30]

    // pop() - 出栈并返回栈顶元素
    const popped = stack.pop();
    console.log("出栈元素:", popped);  // 30
    console.log("出栈后:", stack);    // [10, 20]

    // peek/top - 查看栈顶元素（不删除）
    const top = stack[stack.length - 1];
    console.log("栈顶元素:", top);  // 20

    // size/length - 获取栈的大小
    console.log("栈大小:", stack.length);  // 2

    // isEmpty - 检查栈是否为空
    console.log("栈是否为空:", stack.length === 0);  // false

    return stack;
}

stackBasicOperations();
```

#### 栈的实用方法
```javascript
/**
 * 栈的实用操作方法
 */
function stackUtilityMethods() {
    const stack = [1, 2, 3, 4, 5];

    // clear() - 清空栈
    function clearStack(stack) {
        stack.length = 0;
        return stack;
    }

    // search(element) - 搜索元素位置（从栈顶开始计算）
    function search(stack, element) {
        for (let i = stack.length - 1; i >= 0; i--) {
            if (stack[i] === element) {
                return stack.length - 1 - i;  // 返回从栈顶开始的距离
            }
        }
        return -1;  // 未找到
    }

    // toArray() - 转换为数组（栈顶在前）
    function toArray(stack) {
        return [...stack].reverse();
    }

    console.log("原栈:", stack);                    // [1, 2, 3, 4, 5]
    console.log("元素3的位置:", search(stack, 3));   // 2
    console.log("栈顶在前数组:", toArray(stack));    // [5, 4, 3, 2, 1]

    return stack;
}

stackUtilityMethods();
```

## 🔧 队列的基础概念和操作

### 队列的基本特性
队列是一种在一端插入元素（队尾），在另一端删除元素（队头）的线性数据结构。

```javascript
/**
 * 队列的基本操作演示
 */
const queue = [];

// 入队操作 - enqueue
queue.push(1);     // [1]
queue.push(2);     // [1, 2]
queue.push(3);     // [1, 2, 3]

console.log("当前队列:", queue);  // [1, 2, 3]

// 出队操作 - dequeue
const front = queue.shift();    // 1，队列变为 [2, 3]
console.log("出队元素:", front);  // 1
console.log("出队后:", queue);   // [2, 3]

// 查看队头元素 - front
const frontElement = queue[0];  // 2
console.log("队头元素:", frontElement);  // 2

// 检查队列是否为空
const isEmpty = queue.length === 0;
console.log("队列是否为空:", isEmpty);  // false
```

### 队列的常用方法

#### 基础访问方法
```javascript
/**
 * 队列的基础访问操作
 */
function queueBasicOperations() {
    const queue = [];

    // enqueue(element) - 入队
    queue.push(10);
    queue.push(20);
    queue.push(30);
    console.log("入队后:", queue);  // [10, 20, 30]

    // dequeue() - 出队并返回队头元素
    const dequeued = queue.shift();
    console.log("出队元素:", dequeued);  // 10
    console.log("出队后:", queue);      // [20, 30]

    // front - 查看队头元素（不删除）
    const front = queue[0];
    console.log("队头元素:", front);  // 20

    // rear - 查看队尾元素
    const rear = queue[queue.length - 1];
    console.log("队尾元素:", rear);  // 30

    // size/length - 获取队列大小
    console.log("队列大小:", queue.length);  // 2

    // isEmpty - 检查队列是否为空
    console.log("队列是否为空:", queue.length === 0);  // false

    return queue;
}

queueBasicOperations();
```

#### 双端队列操作
```javascript
/**
 * 双端队列（Deque）操作
 */
function dequeOperations() {
    const deque = [];

    // 队头操作
    deque.unshift(1);    // 队头插入: [1]
    deque.unshift(2);    // 队头插入: [2, 1]
    
    // 队尾操作
    deque.push(3);       // 队尾插入: [2, 1, 3]
    deque.push(4);       // 队尾插入: [2, 1, 3, 4]

    console.log("双端队列:", deque);  // [2, 1, 3, 4]

    // 队头删除
    const frontRemoved = deque.shift();  // 2，deque变为[1, 3, 4]
    console.log("队头删除:", frontRemoved);

    // 队尾删除
    const rearRemoved = deque.pop();     // 4，deque变为[1, 3]
    console.log("队尾删除:", rearRemoved);
    console.log("最终双端队列:", deque);  // [1, 3]

    return deque;
}

dequeOperations();
```

## 💡 栈与队列的对比

### 操作特性对比
```javascript
/**
 * 栈与队列操作特性对比
 */
function stackVsQueueComparison() {
    console.log("=== 栈与队列对比 ===");
    
    // 栈的操作顺序
    const stack = [];
    stack.push(1, 2, 3, 4);
    console.log("栈操作:");
    console.log("入栈顺序: 1, 2, 3, 4");
    
    const stackOutput = [];
    while (stack.length > 0) {
        stackOutput.push(stack.pop());
    }
    console.log("出栈顺序:", stackOutput.join(', '));  // 4, 3, 2, 1

    // 队列的操作顺序
    const queue = [];
    queue.push(1, 2, 3, 4);
    console.log("\n队列操作:");
    console.log("入队顺序: 1, 2, 3, 4");
    
    const queueOutput = [];
    while (queue.length > 0) {
        queueOutput.push(queue.shift());
    }
    console.log("出队顺序:", queueOutput.join(', '));  // 1, 2, 3, 4
}

stackVsQueueComparison();
```

### 应用场景对比
```javascript
/**
 * 栈与队列的应用场景示例
 */
function applicationScenarios() {
    // 栈的应用：函数调用栈模拟
    function functionCallStack() {
        const callStack = [];
        
        function funcA() {
            callStack.push('funcA');
            console.log("进入 funcA，调用栈:", [...callStack]);
            funcB();
            callStack.pop();
            console.log("退出 funcA，调用栈:", [...callStack]);
        }
        
        function funcB() {
            callStack.push('funcB');
            console.log("进入 funcB，调用栈:", [...callStack]);
            callStack.pop();
            console.log("退出 funcB，调用栈:", [...callStack]);
        }
        
        console.log("=== 函数调用栈演示 ===");
        funcA();
    }

    // 队列的应用：任务调度模拟
    function taskScheduling() {
        const taskQueue = [];
        
        function addTask(task) {
            taskQueue.push(task);
            console.log(`任务 ${task} 加入队列`);
        }
        
        function processTask() {
            if (taskQueue.length > 0) {
                const task = taskQueue.shift();
                console.log(`处理任务 ${task}`);
                return task;
            }
            console.log("没有待处理任务");
            return null;
        }
        
        console.log("\n=== 任务调度演示 ===");
        addTask("任务1");
        addTask("任务2");
        addTask("任务3");
        
        console.log("开始处理任务:");
        while (taskQueue.length > 0) {
            processTask();
        }
    }

    functionCallStack();
    taskScheduling();
}

applicationScenarios();
```

## 🎯 单调栈技术

### 核心思想

**单调栈是一种特殊的栈，栈内元素保持单调性（单调递增或单调递减）**。当新元素入栈时，会弹出所有破坏单调性的元素，这个过程可以高效地解决"下一个更大元素"、"最大矩形面积"等问题。

### 解题思想

单调栈的核心应用场景：
1. **找下一个更大/更小元素**：对每个元素找到右边第一个比它大/小的元素
2. **直方图最大矩形**：计算直方图中最大矩形面积
3. **滑动窗口最值**：维护窗口内的最大/最小值

**什么时候使用单调栈？**
- 需要找到每个元素的"下一个更大/更小元素"
- 需要维护一个序列的最值信息
- 需要计算以某个元素为边界的最大/最小区间

### 经典应用：下一个更大元素

**核心思想**：维护一个单调递减栈，当遇到更大元素时，栈中所有小于当前元素的元素都找到了它们的"下一个更大元素"。

```javascript
/**
 * 找到数组中每个元素的下一个更大元素
 * 
 * 核心思想：
 * 使用单调递减栈，栈中存储元素的索引
 * 当遇到更大元素时，弹出栈中所有较小元素，它们都找到了下一个更大元素
 *
 * 算法步骤：
 * 1. 遍历数组，维护单调递减栈
 * 2. 当前元素大于栈顶元素时，栈顶元素找到了下一个更大元素
 * 3. 弹出所有小于当前元素的栈顶元素
 * 4. 当前元素入栈
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[]} 结果数组，-1表示没有更大元素
 * @time O(n) - 每个元素最多入栈出栈一次
 * @space O(n) - 栈的空间复杂度
 */
function nextGreaterElement(nums) {
    const result = new Array(nums.length).fill(-1);
    const stack = [];  // 单调递减栈，存储索引

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

// 使用示例
const nums1 = [2, 1, 2, 4, 3, 1];
console.log("输入:", nums1);
console.log("下一个更大元素:", nextGreaterElement(nums1));  // [4, 2, 4, -1, -1, -1]

const nums2 = [1, 3, 4, 2];
console.log("输入:", nums2);
console.log("下一个更大元素:", nextGreaterElement(nums2));  // [3, 4, -1, -1]
```

### 经典应用：柱状图中最大矩形

**核心思想**：对于每个柱子，找到它左边和右边第一个比它矮的柱子，以当前柱子的高度为矩形高度，计算最大面积。

```javascript
/**
 * 柱状图中最大的矩形面积
 *
 * 核心思想：
 * 对于每个柱子，以它的高度为矩形高度，找到能延伸的最大宽度
 * 使用单调递增栈，当遇到较矮柱子时，栈中较高的柱子都可以计算面积了
 *
 * 算法步骤：
 * 1. 维护单调递增栈（存储索引）
 * 2. 遇到较矮柱子时，弹出栈顶计算以栈顶高度为基准的矩形面积
 * 3. 宽度 = 当前索引 - 栈顶前一个元素索引 - 1
 * 4. 面积 = 高度 × 宽度
 *
 * @param {number[]} heights - 柱子高度数组
 * @returns {number} 最大矩形面积
 * @time O(n) - 每个元素最多入栈出栈一次
 * @space O(n) - 栈的空间复杂度
 */
function largestRectangleArea(heights) {
    const stack = [];  // 单调递增栈
    let maxArea = 0;
    
    // 在末尾添加一个高度为0的柱子，确保所有柱子都能被处理
    heights.push(0);

    for (let i = 0; i < heights.length; i++) {
        // 当前柱子比栈顶柱子矮，开始计算面积
        while (stack.length > 0 && heights[i] < heights[stack[stack.length - 1]]) {
            const height = heights[stack.pop()];  // 矩形高度
            const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;  // 矩形宽度
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }

    heights.pop();  // 移除添加的哨兵
    return maxArea;
}

// 使用示例
const heights1 = [2, 1, 5, 6, 2, 3];
console.log("柱子高度:", heights1);
console.log("最大矩形面积:", largestRectangleArea([...heights1]));  // 10

const heights2 = [2, 4];
console.log("柱子高度:", heights2);
console.log("最大矩形面积:", largestRectangleArea([...heights2]));  // 4
```

## 🎯 递归与栈的关系

### 核心思想

**递归调用的本质就是利用系统调用栈**。每次递归调用都会在栈中压入一个新的栈帧，包含局部变量和返回地址。理解这个关系有助于将递归算法转换为迭代算法。

### 解题思想

递归转迭代的核心技术：
1. **显式栈模拟**：用栈保存递归过程中的状态
2. **状态压栈**：将递归参数和中间结果保存在栈中
3. **迭代处理**：用循环替代递归调用

### 经典应用：二叉树遍历

**核心思想**：将递归的二叉树遍历转换为使用显式栈的迭代版本。

```javascript
// 二叉树节点定义
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * 二叉树前序遍历 - 递归版本
 */
function preorderRecursive(root) {
    const result = [];
    
    function traverse(node) {
        if (!node) return;
        
        result.push(node.val);      // 访问根节点
        traverse(node.left);        // 递归遍历左子树
        traverse(node.right);       // 递归遍历右子树
    }
    
    traverse(root);
    return result;
}

/**
 * 二叉树前序遍历 - 迭代版本（使用栈模拟递归）
 *
 * 核心思想：
 * 使用栈保存待访问的节点，模拟递归调用栈
 * 由于栈是LIFO，需要先压入右子树再压入左子树
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number[]} 前序遍历结果
 * @time O(n) - 访问每个节点一次
 * @space O(h) - h为树的高度，栈的最大深度
 */
function preorderIterative(root) {
    if (!root) return [];
    
    const result = [];
    const stack = [root];

    while (stack.length > 0) {
        const node = stack.pop();
        result.push(node.val);      // 访问当前节点

        // 注意：先压入右子树，再压入左子树（因为栈是LIFO）
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
    }

    return result;
}

// 创建测试二叉树: 1
//                / \
//               2   3
//              / \
//             4   5
const root = new TreeNode(1,
    new TreeNode(2,
        new TreeNode(4),
        new TreeNode(5)
    ),
    new TreeNode(3)
);

console.log("递归前序遍历:", preorderRecursive(root));  // [1, 2, 4, 5, 3]
console.log("迭代前序遍历:", preorderIterative(root));  // [1, 2, 4, 5, 3]
```

### 经典应用：括号匹配

**核心思想**：使用栈来匹配成对的括号，栈保存未匹配的左括号。

```javascript
/**
 * 有效的括号匹配
 *
 * 核心思想：
 * 使用栈保存左括号，遇到右括号时检查是否与栈顶的左括号匹配
 * 如果匹配则弹出栈顶，否则括号无效
 *
 * 算法步骤：
 * 1. 遇到左括号时入栈
 * 2. 遇到右括号时检查栈顶是否为对应的左括号
 * 3. 最终栈为空则所有括号都匹配
 *
 * @param {string} s - 包含括号的字符串
 * @returns {boolean} 是否有效
 * @time O(n) - 遍历字符串一次
 * @space O(n) - 栈的空间复杂度
 */
function isValidParentheses(s) {
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

    return stack.length === 0;  // 栈为空说明所有括号都匹配
}

// 使用示例
console.log("():", isValidParentheses("()"));          // true
console.log("()[]{}:", isValidParentheses("()[]{}"));  // true
console.log("(]:", isValidParentheses("(]"));          // false
console.log("([)]:", isValidParentheses("([)]"));      // false
console.log("{[]}:", isValidParentheses("{[]}"));      // true
```

## 🎯 队列在BFS中的应用

### 核心思想

**队列是广度优先搜索(BFS)的核心数据结构**。BFS按层次顺序访问节点，队列的FIFO特性正好符合这个需求。队列确保先访问的节点的邻居也先被处理。

### 解题思想

BFS使用队列的基本模式：
1. **初始化**：将起始节点加入队列
2. **层次遍历**：队列不空时，取出队头节点处理
3. **扩展邻居**：将当前节点的未访问邻居加入队列
4. **标记访问**：避免重复访问同一节点

### 经典应用：二叉树层序遍历

**核心思想**：使用队列保存每一层的节点，逐层处理。

```javascript
/**
 * 二叉树层序遍历
 *
 * 核心思想：
 * 使用队列保存当前层的所有节点，依次处理每个节点
 * 处理节点时将其子节点加入队列，形成下一层
 *
 * 算法步骤：
 * 1. 根节点入队
 * 2. 当队列不空时，记录当前层大小
 * 3. 处理当前层的所有节点，将子节点加入下一层
 * 4. 重复直到队列为空
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
        const levelSize = queue.length;  // 当前层的节点数
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

// 使用示例
console.log("层序遍历:", levelOrder(root));  // [[1], [2, 3], [4, 5]]
```

### 经典应用：图的最短路径

**核心思想**：在无权图中，BFS能找到从起点到任意点的最短路径。

```javascript
/**
 * 无权图的最短路径（BFS）
 *
 * 核心思想：
 * BFS按距离递增的顺序访问节点，第一次访问到目标节点时就是最短路径
 * 队列保证了距离相同的节点会在同一轮被处理
 *
 * @param {number[][]} graph - 邻接表表示的图
 * @param {number} start - 起始节点
 * @param {number} target - 目标节点
 * @returns {number} 最短距离，-1表示不可达
 * @time O(V + E) - V是顶点数，E是边数
 * @space O(V) - 队列和访问标记的空间
 */
function shortestPath(graph, start, target) {
    if (start === target) return 0;

    const visited = new Set();
    const queue = [[start, 0]];  // [节点, 距离]
    visited.add(start);

    while (queue.length > 0) {
        const [node, distance] = queue.shift();

        // 遍历当前节点的所有邻居
        for (const neighbor of graph[node]) {
            if (neighbor === target) {
                return distance + 1;  // 找到目标，返回距离
            }

            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push([neighbor, distance + 1]);
            }
        }
    }

    return -1;  // 无法到达目标节点
}

// 使用示例 - 创建图: 0-1-2
//                   |   |
//                   3-4-5
const graph = [
    [1, 3],        // 节点0连接到1,3
    [0, 2, 4],     // 节点1连接到0,2,4
    [1, 5],        // 节点2连接到1,5
    [0, 4],        // 节点3连接到0,4
    [1, 3, 5],     // 节点4连接到1,3,5
    [2, 4]         // 节点5连接到2,4
];

console.log("从节点0到节点5的最短距离:", shortestPath(graph, 0, 5));  // 3
console.log("从节点1到节点3的最短距离:", shortestPath(graph, 1, 3));  // 2
```

## 🎯 算法思想总结

### 时间复杂度对比

| 操作类型 | 栈 | 队列 | 应用场景 |
|---------|----|----- |----------|
| 入栈/入队 | O(1) | O(1) | 添加元素 |
| 出栈/出队 | O(1) | O(1) | 删除元素 |
| 查看顶部/前部 | O(1) | O(1) | 访问元素 |
| 搜索 | O(n) | O(n) | 查找特定元素 |

### 核心设计思想

1. **单调栈技术**：利用栈的单调性快速找到下一个更大/更小元素
2. **递归与栈的关系**：理解递归本质，掌握递归转迭代的技巧
3. **队列在BFS中的应用**：利用队列的FIFO特性实现层次遍历和最短路径

栈和队列虽然简单，但它们是许多高级算法的基础。掌握它们的核心思想和应用技巧，对解决复杂问题具有重要意义。特别是单调栈和BFS队列，在算法竞赛和实际开发中都有着广泛的应用。 