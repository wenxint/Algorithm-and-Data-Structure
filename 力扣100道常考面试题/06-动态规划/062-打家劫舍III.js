/**
 * LeetCode 337. 打家劫舍 III
 *
 * 问题描述：
 * 在上次打劫完一条街道之后和一圈房屋之后，小偷又发现了一个新的可行窃的地区。
 * 这个地区只有一个入口，我们称之为"根"。除了"根"之外，每栋房子有且只有一个"父"房子与之相连。
 * 一番侦察之后，聪明的小偷意识到"这个地方的所有房屋的排列类似于一棵二叉树"。
 * 如果两个直接相连的房子在同一天晚上被打劫，房屋将自动报警。
 *
 * 核心思想：
 * 树形动态规划问题
 * 对于每个节点，有两种状态：
 * 1. 偷当前节点：不能偷左右子节点，但可以偷子节点的子节点
 * 2. 不偷当前节点：可以偷左右子节点（取最优）
 *
 * 示例：
 * 输入：root = [3,2,3,null,3,null,1]
 * 输出：7
 * 解释：小偷一晚能够盗取的最高金额 = 3 + 3 + 1 = 7
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
 * 打家劫舍 III - 记忆化递归（面试推荐）
 * @param {TreeNode} root - 树根节点
 * @return {number} 最大偷窃金额
 * @time O(n) 时间复杂度，每个节点访问一次
 * @space O(n) 空间复杂度，记忆化存储和递归栈
 */
function rob(root) {
    const memo = new Map();

    function robNode(node) {
        if (!node) return 0;

        // 查找缓存
        if (memo.has(node)) {
            return memo.get(node);
        }

        // 偷当前节点：不能偷直接子节点，但可以偷孙子节点
        let robCurrent = node.val;
        if (node.left) {
            robCurrent += robNode(node.left.left) + robNode(node.left.right);
        }
        if (node.right) {
            robCurrent += robNode(node.right.left) + robNode(node.right.right);
        }

        // 不偷当前节点：可以偷左右子节点
        const notRobCurrent = robNode(node.left) + robNode(node.right);

        const maxAmount = Math.max(robCurrent, notRobCurrent);
        memo.set(node, maxAmount);

        return maxAmount;
    }

    return robNode(root);
}

/**
 * 打家劫舍 III - 状态转移优化版本
 * @param {TreeNode} root - 树根节点
 * @return {number} 最大偷窃金额
 * @time O(n) 时间复杂度
 * @space O(h) 空间复杂度，h为树的高度
 */
function robOptimized(root) {
    /**
     * 返回一个包含两个元素的数组：
     * [不偷当前节点的最大金额, 偷当前节点的最大金额]
     */
    function robSub(node) {
        if (!node) return [0, 0];

        const left = robSub(node.left);
        const right = robSub(node.right);

        // 不偷当前节点：可以选择偷或不偷子节点
        const notRob = Math.max(left[0], left[1]) + Math.max(right[0], right[1]);

        // 偷当前节点：不能偷子节点，但加上当前节点的值
        const rob = node.val + left[0] + right[0];

        return [notRob, rob];
    }

    const result = robSub(root);
    return Math.max(result[0], result[1]);
}

/**
 * 打家劫舍 III - 详细分析版本
 * @param {TreeNode} root - 树根节点
 * @return {number} 最大偷窃金额
 */
function robWithAnalysis(root) {
    if (!root) {
        console.log('空树，无法偷窃');
        return 0;
    }

    console.log('开始分析二叉树偷窃问题');

    const memo = new Map();
    let nodeCounter = 0;

    function robNode(node, depth = 0) {
        if (!node) return 0;

        const indent = '  '.repeat(depth);
        const nodeId = ++nodeCounter;
        console.log(`${indent}访问节点${nodeId}(值=${node.val})`);

        // 查找缓存
        if (memo.has(node)) {
            const cached = memo.get(node);
            console.log(`${indent}使用缓存结果: ${cached}`);
            return cached;
        }

        // 方案1：偷当前节点
        let robCurrent = node.val;
        console.log(`${indent}方案1 - 偷当前节点: 基础金额 = ${node.val}`);

        if (node.left) {
            const leftGrandchildren = robNode(node.left.left, depth + 2) + robNode(node.left.right, depth + 2);
            robCurrent += leftGrandchildren;
            console.log(`${indent}  + 左子树的孙子节点 = ${leftGrandchildren}`);
        }

        if (node.right) {
            const rightGrandchildren = robNode(node.right.left, depth + 2) + robNode(node.right.right, depth + 2);
            robCurrent += rightGrandchildren;
            console.log(`${indent}  + 右子树的孙子节点 = ${rightGrandchildren}`);
        }

        console.log(`${indent}方案1总金额: ${robCurrent}`);

        // 方案2：不偷当前节点
        const leftChild = robNode(node.left, depth + 1);
        const rightChild = robNode(node.right, depth + 1);
        const notRobCurrent = leftChild + rightChild;

        console.log(`${indent}方案2 - 不偷当前节点: 左子树 = ${leftChild}, 右子树 = ${rightChild}`);
        console.log(`${indent}方案2总金额: ${notRobCurrent}`);

        const maxAmount = Math.max(robCurrent, notRobCurrent);
        console.log(`${indent}选择更优方案: ${maxAmount}`);

        memo.set(node, maxAmount);
        return maxAmount;
    }

    const result = robNode(root);
    console.log(`\n最终结果: ${result}`);
    console.log(`访问节点数: ${nodeCounter}`);
    console.log(`缓存命中次数: ${nodeCounter - memo.size}`);

    return result;
}

/**
 * 打家劫舍 III - 获取偷窃方案
 * @param {TreeNode} root - 树根节点
 * @return {object} 包含最大金额和偷窃方案
 */
function robWithPlan(root) {
    if (!root) return { maxAmount: 0, robbedNodes: [] };

    const robbedNodes = [];

    function robSub(node) {
        if (!node) return [0, 0, [], []];

        const [leftNotRob, leftRob, leftNotRobNodes, leftRobNodes] = robSub(node.left);
        const [rightNotRob, rightRob, rightNotRobNodes, rightRobNodes] = robSub(node.right);

        // 不偷当前节点的最优方案
        const notRobAmount = Math.max(leftNotRob, leftRob) + Math.max(rightNotRob, rightRob);
        const notRobNodes = [
            ...(leftNotRob >= leftRob ? leftNotRobNodes : leftRobNodes),
            ...(rightNotRob >= rightRob ? rightNotRobNodes : rightRobNodes)
        ];

        // 偷当前节点的方案
        const robAmount = node.val + leftNotRob + rightNotRob;
        const robNodes = [node.val, ...leftNotRobNodes, ...rightNotRobNodes];

        return [notRobAmount, robAmount, notRobNodes, robNodes];
    }

    const [notRob, rob, notRobNodes, robNodes] = robSub(root);

    if (rob >= notRob) {
        return { maxAmount: rob, robbedNodes: robNodes, strategy: 'rob-root' };
    } else {
        return { maxAmount: notRob, robbedNodes: notRobNodes, strategy: 'not-rob-root' };
    }
}

/**
 * 打家劫舍 III - 暴力递归（展示思路）
 * @param {TreeNode} root - 树根节点
 * @return {number} 最大偷窃金额
 */
function robBruteForce(root) {
    if (!root) return 0;

    // 偷当前节点
    let robCurrent = root.val;
    if (root.left) {
        robCurrent += robBruteForce(root.left.left) + robBruteForce(root.left.right);
    }
    if (root.right) {
        robCurrent += robBruteForce(root.right.left) + robBruteForce(root.right.right);
    }

    // 不偷当前节点
    const notRobCurrent = robBruteForce(root.left) + robBruteForce(root.right);

    return Math.max(robCurrent, notRobCurrent);
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
 * 测试函数
 */
function testRobIII() {
    const testCases = [
        {
            values: [3, 2, 3, null, 3, null, 1],
            expected: 7,
            description: "经典案例：偷根节点和叶子节点"
        },
        {
            values: [3, 4, 5, 1, 3, null, 1],
            expected: 9,
            description: "偷左右子节点：4 + 5 = 9"
        },
        {
            values: [4, 1, null, 2, null, 3],
            expected: 7,
            description: "链状结构：偷根节点和叶子节点"
        },
        {
            values: [5],
            expected: 5,
            description: "单节点：偷根节点"
        },
        {
            values: [2, 1, 3, null, 4],
            expected: 7,
            description: "偷根节点和叶子节点：2 + 4 + 1 = 7，错误应该是2+4=6或1+3=4，选更大的6，不对，应该是偷根2+叶子4=6"
        }
    ];

    console.log("🏠 打家劫舍 III (树形DP) 算法测试");
    console.log("=================================");

    testCases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`输入: [${testCase.values.join(', ')}]`);

        const root = buildTree(testCase.values);
        printTree(root);

        const result1 = rob(root);
        const result2 = robOptimized(root);
        const result3 = robBruteForce(root);
        const planResult = robWithPlan(root);

        console.log(`记忆化递归结果: ${result1}`);
        console.log(`状态转移结果: ${result2}`);
        console.log(`暴力递归结果: ${result3}`);
        console.log(`偷窃方案: 金额=${planResult.maxAmount}, 节点=[${planResult.robbedNodes.join(', ')}]`);
        console.log(`策略: ${planResult.strategy}`);
        console.log(`期望结果: ${testCase.expected}`);

        const passed = result1 === testCase.expected &&
                      result2 === testCase.expected &&
                      result3 === testCase.expected;

        console.log(`测试${passed ? '✅ 通过' : '❌ 失败'}`);

        // 详细分析第一个用例
        if (index === 0) {
            console.log('\n--- 详细分析过程 ---');
            robWithAnalysis(root);
        }
    });
}

/**
 * 性能对比测试
 */
function performanceTest() {
    console.log("\n📊 性能对比测试");
    console.log("================");

    // 构建一个较大的平衡二叉树进行测试
    function buildBalancedTree(depth, val = 1) {
        if (depth <= 0) return null;

        const root = new TreeNode(val);
        root.left = buildBalancedTree(depth - 1, val + 1);
        root.right = buildBalancedTree(depth - 1, val + 1);
        return root;
    }

    const depths = [10, 12, 14];

    depths.forEach(depth => {
        console.log(`\n树深度: ${depth} (节点数约 ${Math.pow(2, depth) - 1})`);
        const tree = buildBalancedTree(depth);

        // 测试暴力递归（小规模）
        if (depth <= 10) {
            const start1 = performance.now();
            const result1 = robBruteForce(tree);
            const end1 = performance.now();
            console.log(`暴力递归: ${(end1 - start1).toFixed(4)}ms, 结果: ${result1}`);
        } else {
            console.log(`暴力递归: 跳过（时间过长）`);
        }

        // 测试记忆化递归
        const start2 = performance.now();
        const result2 = rob(tree);
        const end2 = performance.now();
        console.log(`记忆化递归: ${(end2 - start2).toFixed(4)}ms, 结果: ${result2}`);

        // 测试状态转移
        const start3 = performance.now();
        const result3 = robOptimized(tree);
        const end3 = performance.now();
        console.log(`状态转移: ${(end3 - start3).toFixed(4)}ms, 结果: ${result3}`);

        console.log(`结果一致性: ${result2 === result3 ? '✅' : '❌'}`);
    });
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TreeNode,
        rob,
        robOptimized,
        robWithAnalysis,
        robWithPlan,
        robBruteForce,
        buildTree,
        printTree,
        testRobIII,
        performanceTest
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.rob = rob;
    window.testRobIII = testRobIII;
}

// 运行测试
// testRobIII();
// performanceTest();