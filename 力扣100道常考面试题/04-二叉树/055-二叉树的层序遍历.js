/**
 * LeetCode 102. 二叉树的层序遍历
 *
 * 问题描述：
 * 给你二叉树的根节点 root ，返回其节点值的层序遍历。
 * （即逐层地，从左到右访问所有节点）。
 *
 * 核心思想：
 * 广度优先搜索(BFS)是层序遍历的经典算法
 * 使用队列存储当前层的所有节点，然后逐层处理
 *
 * 示例：
 * 输入：root = [3,9,20,null,null,15,7]
 * 输出：[[3],[9,20],[15,7]]
 *
 * 输入：root = [1]
 * 输出：[[1]]
 *
 * 输入：root = []
 * 输出：[]
 */

/**
 * 二叉树节点定义
 */
function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
}

/**
 * 二叉树的层序遍历 - 队列BFS（面试推荐）
 * @param {TreeNode} root - 树根节点
 * @return {number[][]} 按层分组的节点值数组
 * @time O(n) 时间复杂度，每个节点访问一次
 * @space O(w) 空间复杂度，w为树的最大宽度
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

            // 将下一层节点加入队列
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        result.push(currentLevel);
    }

    return result;
}

/**
 * 二叉树的层序遍历 - 递归DFS实现
 * @param {TreeNode} root - 树根节点
 * @return {number[][]} 按层分组的节点值数组
 * @time O(n) 时间复杂度
 * @space O(h) 空间复杂度，h为树的高度
 */
function levelOrderDFS(root) {
    if (!root) return [];

    const result = [];

    function dfs(node, level) {
        if (!node) return;

        // 如果当前层还没有数组，创建一个新数组
        if (result.length === level) {
            result.push([]);
        }

        // 将当前节点值加入对应层
        result[level].push(node.val);

        // 递归处理左右子树
        dfs(node.left, level + 1);
        dfs(node.right, level + 1);
    }

    dfs(root, 0);
    return result;
}

/**
 * 二叉树的层序遍历 - 详细分析版本
 * @param {TreeNode} root - 树根节点
 * @return {number[][]} 按层分组的节点值数组
 */
function levelOrderWithAnalysis(root) {
    if (!root) {
        console.log('空树，返回空数组');
        return [];
    }

    console.log('开始层序遍历');

    const result = [];
    const queue = [root];
    let level = 0;

    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];

        console.log(`\n第${level}层 (${levelSize}个节点):`);

        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);

            console.log(`  处理节点: ${node.val}`);

            if (node.left) {
                queue.push(node.left);
                console.log(`    加入左子节点: ${node.left.val}`);
            }

            if (node.right) {
                queue.push(node.right);
                console.log(`    加入右子节点: ${node.right.val}`);
            }
        }

        result.push(currentLevel);
        console.log(`  第${level}层结果: [${currentLevel.join(', ')}]`);
        console.log(`  队列状态: [${queue.map(n => n.val).join(', ')}]`);

        level++;
    }

    console.log(`\n最终结果: [${result.map(level => `[${level.join(',')}]`).join(', ')}]`);
    return result;
}

/**
 * 二叉树的层序遍历 - 使用两个队列
 * @param {TreeNode} root - 树根节点
 * @return {number[][]} 按层分组的节点值数组
 */
function levelOrderTwoQueues(root) {
    if (!root) return [];

    const result = [];
    let currentQueue = [root];

    while (currentQueue.length > 0) {
        const currentLevel = [];
        const nextQueue = [];

        // 处理当前层的所有节点
        while (currentQueue.length > 0) {
            const node = currentQueue.shift();
            currentLevel.push(node.val);

            if (node.left) nextQueue.push(node.left);
            if (node.right) nextQueue.push(node.right);
        }

        result.push(currentLevel);
        currentQueue = nextQueue;
    }

    return result;
}

/**
 * 二叉树的层序遍历 - 从右到左
 * @param {TreeNode} root - 树根节点
 * @return {number[][]} 按层分组的节点值数组（每层从右到左）
 */
function levelOrderRightToLeft(root) {
    if (!root) return [];

    const result = [];
    const queue = [root];

    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];

        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.unshift(node.val);  // 从前面插入，实现右到左

            // 先加右子树，再加左子树
            if (node.right) queue.push(node.right);
            if (node.left) queue.push(node.left);
        }

        result.push(currentLevel);
    }

    return result;
}

/**
 * 二叉树的层序遍历 - 自底向上
 * @param {TreeNode} root - 树根节点
 * @return {number[][]} 按层分组的节点值数组（从底层到顶层）
 */
function levelOrderBottomUp(root) {
    if (!root) return [];

    const result = [];
    const queue = [root];

    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];

        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        result.unshift(currentLevel);  // 从前面插入，实现自底向上
    }

    return result;
}

/**
 * 获取层序遍历的统计信息
 * @param {TreeNode} root - 树根节点
 * @return {object} 包含遍历结果和统计信息
 */
function levelOrderWithStats(root) {
    if (!root) return {
        levels: [],
        totalNodes: 0,
        maxWidth: 0,
        height: 0
    };

    const result = [];
    const queue = [root];
    let maxWidth = 0;
    let totalNodes = 0;

    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];

        maxWidth = Math.max(maxWidth, levelSize);
        totalNodes += levelSize;

        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        result.push(currentLevel);
    }

    return {
        levels: result,
        totalNodes,
        maxWidth,
        height: result.length
    };
}

/**
 * 构建测试用的二叉树
 * @param {number[]} values - 层序遍历的节点值数组，null表示空节点
 * @return {TreeNode} 构建的二叉树根节点
 */
function buildTree(values) {
    if (!values || values.length === 0) return null;

    const root = new TreeNode(values[0]);
    const queue = [root];
    let i = 1;

    while (queue.length > 0 && i < values.length) {
        const node = queue.shift();

        // 添加左子节点
        if (i < values.length && values[i] !== null) {
            node.left = new TreeNode(values[i]);
            queue.push(node.left);
        }
        i++;

        // 添加右子节点
        if (i < values.length && values[i] !== null) {
            node.right = new TreeNode(values[i]);
            queue.push(node.right);
        }
        i++;
    }

    return root;
}

/**
 * 打印二叉树结构
 * @param {TreeNode} root - 树根节点
 */
function printTree(root) {
    if (!root) {
        console.log('空树');
        return;
    }

    const result = [];
    const queue = [root];

    while (queue.length > 0) {
        const node = queue.shift();
        if (node) {
            result.push(node.val);
            queue.push(node.left);
            queue.push(node.right);
        } else {
            result.push(null);
        }
    }

    // 移除末尾的null
    while (result.length > 0 && result[result.length - 1] === null) {
        result.pop();
    }

    console.log(`树结构: [${result.join(', ')}]`);
}

/**
 * 可视化层序遍历结果
 * @param {number[][]} levels - 层序遍历结果
 */
function visualizeLevels(levels) {
    console.log('层序遍历可视化:');
    levels.forEach((level, index) => {
        console.log(`第${index}层: [${level.join(', ')}]`);
    });
}

/**
 * 测试函数
 */
function testLevelOrder() {
    const testCases = [
        {
            values: [3, 9, 20, null, null, 15, 7],
            expected: [[3], [9, 20], [15, 7]],
            description: "标准测试用例：完全二叉树"
        },
        {
            values: [1],
            expected: [[1]],
            description: "单节点树"
        },
        {
            values: [],
            expected: [],
            description: "空树"
        },
        {
            values: [1, 2, 3, 4, 5, null, 6, null, null, 7, 8],
            expected: [[1], [2, 3], [4, 5, 6], [7, 8]],
            description: "不完全二叉树"
        },
        {
            values: [1, null, 2, null, 3, null, 4],
            expected: [[1], [2], [3], [4]],
            description: "右偏斜树"
        },
        {
            values: [1, 2, null, 3, null, 4],
            expected: [[1], [2], [3], [4]],
            description: "左偏斜树"
        }
    ];

    console.log("🌳 二叉树层序遍历算法测试");
    console.log("=======================");

    testCases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`输入: [${testCase.values.join(', ')}]`);

        const root = buildTree(testCase.values);
        printTree(root);

        const result1 = levelOrder(root);
        const result2 = levelOrderDFS(buildTree(testCase.values));
        const result3 = levelOrderTwoQueues(buildTree(testCase.values));
        const statsResult = levelOrderWithStats(buildTree(testCase.values));

        console.log(`队列BFS结果: [${result1.map(level => `[${level.join(',')}]`).join(', ')}]`);
        console.log(`递归DFS结果: [${result2.map(level => `[${level.join(',')}]`).join(', ')}]`);
        console.log(`双队列结果: [${result3.map(level => `[${level.join(',')}]`).join(', ')}]`);
        console.log(`统计信息: 总节点${statsResult.totalNodes}, 最大宽度${statsResult.maxWidth}, 高度${statsResult.height}`);
        console.log(`期望结果: [${testCase.expected.map(level => `[${level.join(',')}]`).join(', ')}]`);

        // 比较结果
        const arraysEqual = (a, b) => {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (a[i].length !== b[i].length) return false;
                for (let j = 0; j < a[i].length; j++) {
                    if (a[i][j] !== b[i][j]) return false;
                }
            }
            return true;
        };

        const passed = arraysEqual(result1, testCase.expected) &&
                      arraysEqual(result2, testCase.expected) &&
                      arraysEqual(result3, testCase.expected);

        console.log(`测试${passed ? '✅ 通过' : '❌ 失败'}`);

        // 详细分析第一个用例
        if (index === 0) {
            console.log('\n--- 详细分析过程 ---');
            levelOrderWithAnalysis(buildTree(testCase.values));

            console.log('\n--- 变式算法演示 ---');
            const rtlResult = levelOrderRightToLeft(buildTree(testCase.values));
            const bottomUpResult = levelOrderBottomUp(buildTree(testCase.values));

            console.log(`从右到左: [${rtlResult.map(level => `[${level.join(',')}]`).join(', ')}]`);
            console.log(`自底向上: [${bottomUpResult.map(level => `[${level.join(',')}]`).join(', ')}]`);
        }
    });
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n📊 性能测试");
    console.log("===========");

    // 构建不同类型的测试树
    function buildCompleteTree(levels) {
        const values = [];
        let nodeCount = Math.pow(2, levels) - 1;
        for (let i = 1; i <= nodeCount; i++) {
            values.push(i);
        }
        return buildTree(values);
    }

    function buildSkewedTree(size) {
        if (size <= 0) return null;

        let root = new TreeNode(1);
        let current = root;
        for (let i = 2; i <= size; i++) {
            current.right = new TreeNode(i);
            current = current.right;
        }
        return root;
    }

    const testTrees = [
        { name: "完全二叉树(10层)", tree: buildCompleteTree(10) },
        { name: "完全二叉树(12层)", tree: buildCompleteTree(12) },
        { name: "右偏斜树(1000节点)", tree: buildSkewedTree(1000) },
        { name: "右偏斜树(5000节点)", tree: buildSkewedTree(5000) }
    ];

    testTrees.forEach(testTree => {
        console.log(`\n测试: ${testTree.name}`);

        // 测试队列BFS
        let start = performance.now();
        const result1 = levelOrder(testTree.tree);
        let end = performance.now();
        console.log(`队列BFS: ${(end - start).toFixed(4)}ms, 层数: ${result1.length}`);

        // 测试递归DFS
        start = performance.now();
        const result2 = levelOrderDFS(testTree.tree);
        end = performance.now();
        console.log(`递归DFS: ${(end - start).toFixed(4)}ms, 层数: ${result2.length}`);

        // 测试双队列
        start = performance.now();
        const result3 = levelOrderTwoQueues(testTree.tree);
        end = performance.now();
        console.log(`双队列: ${(end - start).toFixed(4)}ms, 层数: ${result3.length}`);

        console.log(`结果一致性: ${result1.length === result2.length && result2.length === result3.length ? '✅' : '❌'}`);
    });
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TreeNode,
        levelOrder,
        levelOrderDFS,
        levelOrderWithAnalysis,
        levelOrderTwoQueues,
        levelOrderRightToLeft,
        levelOrderBottomUp,
        levelOrderWithStats,
        buildTree,
        printTree,
        visualizeLevels,
        testLevelOrder,
        performanceTest
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.levelOrder = levelOrder;
    window.testLevelOrder = testLevelOrder;
}

// 运行测试
// testLevelOrder();
// performanceTest();