/**
 * LeetCode 113. 路径总和 II
 *
 * 问题描述：
 * 给你二叉树的根节点 root 和一个整数目标和 targetSum ，找出所有从根节点到叶子节点路径总和等于给定目标和的路径。
 * 叶子节点是指没有子节点的节点。
 *
 * 核心思想：
 * 回溯算法 + 深度优先搜索(DFS)
 * 1. 从根节点开始遍历，记录当前路径和路径和
 * 2. 到达叶子节点时检查路径和是否等于目标值
 * 3. 使用回溯撤销选择，探索其他路径
 *
 * 回溯算法三要素：
 * - 路径：当前已经走过的节点
 * - 选择列表：当前节点的子节点
 * - 结束条件：到达叶子节点
 *
 * 示例：
 * 输入：root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22
 * 输出：[[5,4,11,2],[5,8,4,5]]
 * 解释：
 *         5
 *        / \
 *       4   8
 *      /   / \
 *     11  13  4
 *    / \    / \
 *   7   2  5   1
 * 路径 5->4->11->2 和 5->8->4->5 的和都是22
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
 * 路径总和 II - 回溯算法（面试推荐）
 * @param {TreeNode} root - 二叉树根节点
 * @param {number} targetSum - 目标和
 * @return {number[][]} 所有满足条件的路径
 * @time O(n²) 时间复杂度，最坏情况下每个节点都是叶子节点，需要复制路径
 * @space O(h) 空间复杂度，h为树的高度（递归栈）
 */
function pathSum(root, targetSum) {
    const result = [];
    const currentPath = [];

    function backtrack(node, remainingSum) {
        if (!node) return;

        // 添加当前节点到路径
        currentPath.push(node.val);

        // 如果是叶子节点，检查是否满足条件
        if (!node.left && !node.right) {
            if (remainingSum === node.val) {
                // 找到满足条件的路径，需要复制一份
                result.push([...currentPath]);
            }
        } else {
            // 继续搜索左右子树
            backtrack(node.left, remainingSum - node.val);
            backtrack(node.right, remainingSum - node.val);
        }

        // 回溯：撤销选择
        currentPath.pop();
    }

    backtrack(root, targetSum);
    return result;
}

/**
 * 路径总和 II - DFS迭代方法
 * @param {TreeNode} root - 二叉树根节点
 * @param {number} targetSum - 目标和
 * @return {number[][]} 所有满足条件的路径
 * @time O(n²) 时间复杂度
 * @space O(h) 空间复杂度
 */
function pathSumIterative(root, targetSum) {
    if (!root) return [];

    const result = [];
    const stack = [{
        node: root,
        path: [root.val],
        sum: root.val
    }];

    while (stack.length > 0) {
        const { node, path, sum } = stack.pop();

        // 如果是叶子节点，检查路径和
        if (!node.left && !node.right) {
            if (sum === targetSum) {
                result.push([...path]);
            }
            continue;
        }

        // 处理右子树
        if (node.right) {
            stack.push({
                node: node.right,
                path: [...path, node.right.val],
                sum: sum + node.right.val
            });
        }

        // 处理左子树
        if (node.left) {
            stack.push({
                node: node.left,
                path: [...path, node.left.val],
                sum: sum + node.left.val
            });
        }
    }

    return result;
}

/**
 * 路径总和 II - BFS方法
 * @param {TreeNode} root - 二叉树根节点
 * @param {number} targetSum - 目标和
 * @return {number[][]} 所有满足条件的路径
 * @time O(n²) 时间复杂度
 * @space O(n) 空间复杂度
 */
function pathSumBFS(root, targetSum) {
    if (!root) return [];

    const result = [];
    const queue = [{
        node: root,
        path: [root.val],
        sum: root.val
    }];

    while (queue.length > 0) {
        const { node, path, sum } = queue.shift();

        // 如果是叶子节点，检查路径和
        if (!node.left && !node.right) {
            if (sum === targetSum) {
                result.push([...path]);
            }
            continue;
        }

        // 处理左子树
        if (node.left) {
            queue.push({
                node: node.left,
                path: [...path, node.left.val],
                sum: sum + node.left.val
            });
        }

        // 处理右子树
        if (node.right) {
            queue.push({
                node: node.right,
                path: [...path, node.right.val],
                sum: sum + node.right.val
            });
        }
    }

    return result;
}

/**
 * 路径总和 II - 详细分析版本
 * @param {TreeNode} root - 二叉树根节点
 * @param {number} targetSum - 目标和
 * @return {number[][]} 所有满足条件的路径
 */
function pathSumWithAnalysis(root, targetSum) {
    if (!root) {
        console.log('空树，无路径');
        return [];
    }

    console.log(`开始寻找路径总和为 ${targetSum} 的所有路径`);

    const result = [];
    const currentPath = [];
    let step = 0;

    function backtrack(node, remainingSum, depth = 0) {
        if (!node) return;

        step++;
        const indent = '  '.repeat(depth);

        // 添加当前节点到路径
        currentPath.push(node.val);
        console.log(`${indent}步骤${step}: 访问节点${node.val} (深度${depth})`);
        console.log(`${indent}  当前路径: [${currentPath.join(' -> ')}]`);
        console.log(`${indent}  剩余目标: ${remainingSum - node.val}`);

        // 检查是否是叶子节点
        if (!node.left && !node.right) {
            console.log(`${indent}  到达叶子节点`);
            if (remainingSum === node.val) {
                console.log(`${indent}  ✅ 找到满足条件的路径: [${currentPath.join(' -> ')}]`);
                result.push([...currentPath]);
            } else {
                console.log(`${indent}  ❌ 路径和不匹配: 期望${remainingSum}，实际${node.val}`);
            }
        } else {
            console.log(`${indent}  内部节点，继续搜索子树`);

            // 搜索左子树
            if (node.left) {
                console.log(`${indent}  → 进入左子树`);
                backtrack(node.left, remainingSum - node.val, depth + 1);
            }

            // 搜索右子树
            if (node.right) {
                console.log(`${indent}  → 进入右子树`);
                backtrack(node.right, remainingSum - node.val, depth + 1);
            }
        }

        // 回溯
        const poppedNode = currentPath.pop();
        console.log(`${indent}  ← 回溯，移除节点${poppedNode}`);
    }

    backtrack(root, targetSum);

    console.log(`\n搜索完成，共执行${step}步`);
    console.log(`找到${result.length}条满足条件的路径:`);
    result.forEach((path, index) => {
        console.log(`  路径${index + 1}: [${path.join(' -> ')}] = ${path.reduce((sum, val) => sum + val, 0)}`);
    });

    return result;
}

/**
 * 路径总和 II - 优化版本（剪枝）
 * @param {TreeNode} root - 二叉树根节点
 * @param {number} targetSum - 目标和
 * @return {number[][]} 所有满足条件的路径
 */
function pathSumOptimized(root, targetSum) {
    const result = [];
    const currentPath = [];

    function backtrack(node, remainingSum) {
        if (!node) return;

        // 剪枝：如果当前节点值已经超过剩余目标，且所有值都为正数
        // 这个剪枝在有负数的情况下不适用
        // if (node.val > remainingSum && remainingSum > 0) return;

        currentPath.push(node.val);

        if (!node.left && !node.right) {
            if (remainingSum === node.val) {
                result.push([...currentPath]);
            }
        } else {
            const newRemaining = remainingSum - node.val;

            // 先搜索更有可能的分支（这里可以根据具体情况调整顺序）
            if (node.left) {
                backtrack(node.left, newRemaining);
            }
            if (node.right) {
                backtrack(node.right, newRemaining);
            }
        }

        currentPath.pop();
    }

    backtrack(root, targetSum);
    return result;
}

/**
 * 路径总和 II - 返回路径和统计信息
 * @param {TreeNode} root - 二叉树根节点
 * @param {number} targetSum - 目标和
 * @return {object} 包含路径和统计信息
 */
function pathSumWithStats(root, targetSum) {
    if (!root) {
        return {
            paths: [],
            totalPaths: 0,
            allPaths: [],
            minSum: 0,
            maxSum: 0
        };
    }

    const validPaths = [];
    const allPaths = [];
    const currentPath = [];
    let totalPathsVisited = 0;

    function dfs(node, currentSum) {
        if (!node) return;

        currentPath.push(node.val);
        currentSum += node.val;

        if (!node.left && !node.right) {
            // 到达叶子节点
            totalPathsVisited++;
            const pathCopy = [...currentPath];
            allPaths.push({
                path: pathCopy,
                sum: currentSum,
                isValid: currentSum === targetSum
            });

            if (currentSum === targetSum) {
                validPaths.push(pathCopy);
            }
        } else {
            dfs(node.left, currentSum);
            dfs(node.right, currentSum);
        }

        currentPath.pop();
    }

    dfs(root, 0);

    const pathSums = allPaths.map(p => p.sum);
    const minSum = pathSums.length > 0 ? Math.min(...pathSums) : 0;
    const maxSum = pathSums.length > 0 ? Math.max(...pathSums) : 0;

    return {
        paths: validPaths,
        totalPaths: totalPathsVisited,
        allPaths,
        validPathCount: validPaths.length,
        minSum,
        maxSum,
        targetSum
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

        if (i < values.length && values[i] !== null) {
            node.left = new TreeNode(values[i]);
            queue.push(node.left);
        }
        i++;

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

    while (result.length > 0 && result[result.length - 1] === null) {
        result.pop();
    }

    console.log(`树结构: [${result.join(', ')}]`);
}

/**
 * 可视化二叉树
 * @param {TreeNode} root - 树根节点
 */
function visualizeTree(root) {
    if (!root) {
        console.log('空树');
        return;
    }

    const lines = [];

    function buildVisualization(node, prefix = '', isLast = true) {
        if (!node) return;

        lines.push(prefix + (isLast ? '└── ' : '├── ') + node.val);

        const newPrefix = prefix + (isLast ? '    ' : '│   ');

        if (node.left || node.right) {
            if (node.right) {
                buildVisualization(node.right, newPrefix, !node.left);
            }
            if (node.left) {
                buildVisualization(node.left, newPrefix, true);
            }
        }
    }

    buildVisualization(root);
    console.log('二叉树可视化:');
    lines.forEach(line => console.log(line));
}

/**
 * 验证路径总和结果
 * @param {number[][]} paths - 路径数组
 * @param {number} targetSum - 目标和
 * @return {boolean} 是否所有路径都满足条件
 */
function validatePaths(paths, targetSum) {
    return paths.every(path => {
        const sum = path.reduce((acc, val) => acc + val, 0);
        return sum === targetSum;
    });
}

/**
 * 测试函数
 */
function testPathSum() {
    const testCases = [
        {
            values: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1],
            targetSum: 22,
            expected: [[5, 4, 11, 2], [5, 8, 4, 5]],
            description: "经典测试用例：多条路径"
        },
        {
            values: [1, 2, 3],
            targetSum: 5,
            expected: [],
            description: "无满足条件的路径"
        },
        {
            values: [1, 2],
            targetSum: 0,
            expected: [],
            description: "目标和为0，但无满足路径"
        },
        {
            values: [1, 2, null, 3, null, 4, null, 5],
            targetSum: 15,
            expected: [[1, 2, 3, 4, 5]],
            description: "左偏斜树：单条路径"
        },
        {
            values: [-3, 9, -7, null, null, 1, 8, null, null, null, null, 1, 6, 2, 3],
            targetSum: -9,
            expected: [[-3, -7, 1]],
            description: "包含负数的树"
        },
        {
            values: [5],
            targetSum: 5,
            expected: [[5]],
            description: "单节点树：满足条件"
        }
    ];

    console.log("🌳 路径总和 II 算法测试");
    console.log("=====================");

    testCases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`输入: values=[${testCase.values.join(', ')}], targetSum=${testCase.targetSum}`);

        const root = buildTree(testCase.values);
        printTree(root);

        // 测试不同方法
        const result1 = pathSum(root, testCase.targetSum);
        const result2 = pathSumIterative(buildTree(testCase.values), testCase.targetSum);
        const result3 = pathSumBFS(buildTree(testCase.values), testCase.targetSum);
        const result4 = pathSumOptimized(buildTree(testCase.values), testCase.targetSum);
        const statsResult = pathSumWithStats(buildTree(testCase.values), testCase.targetSum);

        console.log(`回溯算法结果: ${JSON.stringify(result1)}`);
        console.log(`DFS迭代结果: ${JSON.stringify(result2)}`);
        console.log(`BFS方法结果: ${JSON.stringify(result3)}`);
        console.log(`优化版本结果: ${JSON.stringify(result4)}`);
        console.log(`统计信息: 找到${statsResult.validPathCount}条路径，总共访问${statsResult.totalPaths}条路径`);
        console.log(`期望结果: ${JSON.stringify(testCase.expected)}`);

        // 验证结果
        const validate = (paths) => {
            return JSON.stringify(paths.sort()) === JSON.stringify(testCase.expected.sort()) &&
                   validatePaths(paths, testCase.targetSum);
        };

        const passed = validate(result1) && validate(result2) &&
                      validate(result3) && validate(result4);

        console.log(`测试${passed ? '✅ 通过' : '❌ 失败'}`);

        // 详细分析第一个用例
        if (index === 0) {
            console.log('\n--- 二叉树可视化 ---');
            visualizeTree(root);

            console.log('\n--- 详细搜索过程 ---');
            pathSumWithAnalysis(buildTree(testCase.values), testCase.targetSum);

            console.log('\n--- 路径统计信息 ---');
            const stats = pathSumWithStats(buildTree(testCase.values), testCase.targetSum);
            console.log(`总路径数: ${stats.totalPaths}`);
            console.log(`有效路径数: ${stats.validPathCount}`);
            console.log(`路径和范围: [${stats.minSum}, ${stats.maxSum}]`);
            console.log(`目标和: ${stats.targetSum}`);

            console.log('\n所有根到叶的路径:');
            stats.allPaths.forEach((pathInfo, idx) => {
                const status = pathInfo.isValid ? '✅' : '❌';
                console.log(`  路径${idx + 1} ${status}: [${pathInfo.path.join(' -> ')}] = ${pathInfo.sum}`);
            });
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
    function buildCompleteTree(depth) {
        const values = [];
        const totalNodes = Math.pow(2, depth) - 1;

        for (let i = 1; i <= totalNodes; i++) {
            values.push(i);
        }

        return buildTree(values);
    }

    function buildSkewedTree(size) {
        if (size <= 0) return null;

        let root = new TreeNode(1);
        let current = root;

        for (let i = 2; i <= size; i++) {
            current.left = new TreeNode(i);
            current = current.left;
        }

        return root;
    }

    const testTrees = [
        { name: "完全二叉树(深度8)", tree: buildCompleteTree(8), targetSum: 50 },
        { name: "完全二叉树(深度10)", tree: buildCompleteTree(10), targetSum: 100 },
        { name: "左偏斜树(100节点)", tree: buildSkewedTree(100), targetSum: 5050 },
        { name: "左偏斜树(500节点)", tree: buildSkewedTree(500), targetSum: 125250 }
    ];

    testTrees.forEach(testTree => {
        console.log(`\n测试: ${testTree.name}，目标和: ${testTree.targetSum}`);

        // 测试回溯算法
        let start = performance.now();
        const result1 = pathSum(testTree.tree, testTree.targetSum);
        let end = performance.now();
        console.log(`回溯算法: ${(end - start).toFixed(4)}ms, 找到${result1.length}条路径`);

        // 测试DFS迭代
        start = performance.now();
        const result2 = pathSumIterative(testTree.tree, testTree.targetSum);
        end = performance.now();
        console.log(`DFS迭代: ${(end - start).toFixed(4)}ms, 找到${result2.length}条路径`);

        // 测试BFS方法
        start = performance.now();
        const result3 = pathSumBFS(testTree.tree, testTree.targetSum);
        end = performance.now();
        console.log(`BFS方法: ${(end - start).toFixed(4)}ms, 找到${result3.length}条路径`);

        console.log(`结果一致性: ${result1.length === result2.length && result2.length === result3.length ? '✅' : '❌'}`);
    });
}

/**
 * 回溯算法原理演示
 */
function demonstrateBacktrackingConcept() {
    console.log("\n🎯 回溯算法原理演示");
    console.log("===================");

    console.log('回溯算法模板:');
    console.log('```');
    console.log('function backtrack(路径, 选择列表) {');
    console.log('    if (满足结束条件) {');
    console.log('        result.add(路径);');
    console.log('        return;');
    console.log('    }');
    console.log('    ');
    console.log('    for (选择 in 选择列表) {');
    console.log('        做选择;');
    console.log('        backtrack(路径, 选择列表);');
    console.log('        撤销选择;');
    console.log('    }');
    console.log('}');
    console.log('```');

    console.log('\n在路径总和问题中:');
    console.log('- 路径: 当前走过的节点序列');
    console.log('- 选择列表: 当前节点的左右子节点');
    console.log('- 结束条件: 到达叶子节点且路径和等于目标值');
    console.log('- 做选择: 将当前节点加入路径');
    console.log('- 撤销选择: 从路径中移除当前节点');

    console.log('\n时间复杂度分析:');
    console.log('- 最坏情况: O(n²)，当所有节点都是叶子节点时');
    console.log('- 平均情况: O(n log n)，平衡二叉树');
    console.log('- 空间复杂度: O(h)，h为树的高度');

    console.log('\n优化策略:');
    console.log('1. 剪枝: 提前终止不可能的搜索分支');
    console.log('2. 记忆化: 缓存重复计算的结果（本题不适用）');
    console.log('3. 迭代替代递归: 避免栈溢出');
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TreeNode,
        pathSum,
        pathSumIterative,
        pathSumBFS,
        pathSumWithAnalysis,
        pathSumOptimized,
        pathSumWithStats,
        buildTree,
        printTree,
        visualizeTree,
        validatePaths,
        testPathSum,
        performanceTest,
        demonstrateBacktrackingConcept
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.pathSum = pathSum;
    window.testPathSum = testPathSum;
}

// 运行测试
// testPathSum();
// performanceTest();
// demonstrateBacktrackingConcept();