/**
 * LeetCode 105. 从前序与中序遍历序列构造二叉树
 *
 * 问题描述：
 * 给定两个整数数组 preorder 和 inorder ，其中 preorder 是二叉树的前序遍历，
 * inorder 是同一棵树的中序遍历，请构造并返回这颗二叉树。
 *
 * 核心思想：
 * 1. 前序遍历的第一个元素是根节点
 * 2. 在中序遍历中找到根节点的位置，可以确定左右子树的节点数量
 * 3. 递归构造左右子树
 *
 * 分治算法原理：
 * - 前序遍历：根 -> 左子树 -> 右子树
 * - 中序遍历：左子树 -> 根 -> 右子树
 * - 利用前序确定根节点，利用中序确定左右子树边界
 *
 * 示例：
 * 输入: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
 * 输出: [3,9,20,null,null,15,7]
 * 解释：
 *     3
 *    / \
 *   9  20
 *     /  \
 *    15   7
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
 * 从前序与中序遍历序列构造二叉树 - 递归方法（面试推荐）
 * @param {number[]} preorder - 前序遍历数组
 * @param {number[]} inorder - 中序遍历数组
 * @return {TreeNode} 构造的二叉树根节点
 * @time O(n) 时间复杂度，每个节点处理一次
 * @space O(n) 空间复杂度，递归栈和哈希表
 */
function buildTree(preorder, inorder) {
    if (!preorder || !inorder || preorder.length !== inorder.length) {
        return null;
    }

    // 创建哈希表快速查找节点在中序遍历中的位置
    const inorderMap = new Map();
    for (let i = 0; i < inorder.length; i++) {
        inorderMap.set(inorder[i], i);
    }

    let preorderIndex = 0;

    function buildSubTree(inorderStart, inorderEnd) {
        if (inorderStart > inorderEnd) return null;

        // 前序遍历的第一个元素是根节点
        const rootVal = preorder[preorderIndex++];
        const root = new TreeNode(rootVal);

        // 在中序遍历中找到根节点的位置
        const rootIndex = inorderMap.get(rootVal);

        // 递归构造左子树（注意：左子树要先构造，因为前序遍历是根->左->右）
        root.left = buildSubTree(inorderStart, rootIndex - 1);

        // 递归构造右子树
        root.right = buildSubTree(rootIndex + 1, inorderEnd);

        return root;
    }

    return buildSubTree(0, inorder.length - 1);
}

/**
 * 从前序与中序遍历序列构造二叉树 - 不使用哈希表的递归方法
 * @param {number[]} preorder - 前序遍历数组
 * @param {number[]} inorder - 中序遍历数组
 * @return {TreeNode} 构造的二叉树根节点
 * @time O(n²) 时间复杂度，最坏情况下每次都要遍历查找
 * @space O(n) 空间复杂度，递归栈
 */
function buildTreeBasic(preorder, inorder) {
    if (!preorder || !inorder || preorder.length === 0 || inorder.length === 0) {
        return null;
    }

    // 前序遍历的第一个元素是根节点
    const rootVal = preorder[0];
    const root = new TreeNode(rootVal);

    // 在中序遍历中找到根节点的位置
    const rootIndex = inorder.indexOf(rootVal);

    // 分割前序和中序数组
    const leftPreorder = preorder.slice(1, rootIndex + 1);
    const rightPreorder = preorder.slice(rootIndex + 1);
    const leftInorder = inorder.slice(0, rootIndex);
    const rightInorder = inorder.slice(rootIndex + 1);

    // 递归构造左右子树
    root.left = buildTreeBasic(leftPreorder, leftInorder);
    root.right = buildTreeBasic(rightPreorder, rightInorder);

    return root;
}

/**
 * 从前序与中序遍历序列构造二叉树 - 详细分析版本
 * @param {number[]} preorder - 前序遍历数组
 * @param {number[]} inorder - 中序遍历数组
 * @return {TreeNode} 构造的二叉树根节点
 */
function buildTreeWithAnalysis(preorder, inorder) {
    if (!preorder || !inorder || preorder.length !== inorder.length) {
        console.log('输入数组无效或长度不匹配');
        return null;
    }

    console.log(`开始构造二叉树`);
    console.log(`前序遍历: [${preorder.join(', ')}]`);
    console.log(`中序遍历: [${inorder.join(', ')}]`);

    const inorderMap = new Map();
    for (let i = 0; i < inorder.length; i++) {
        inorderMap.set(inorder[i], i);
    }

    let preorderIndex = 0;
    let step = 0;

    function buildSubTree(inorderStart, inorderEnd, depth = 0) {
        if (inorderStart > inorderEnd) return null;

        step++;
        const indent = '  '.repeat(depth);

        const rootVal = preorder[preorderIndex++];
        const root = new TreeNode(rootVal);
        const rootIndex = inorderMap.get(rootVal);

        console.log(`${indent}步骤${step}: 构造节点${rootVal} (深度${depth})`);
        console.log(`${indent}  前序索引: ${preorderIndex - 1}, 中序范围: [${inorderStart}, ${inorderEnd}]`);
        console.log(`${indent}  根节点在中序中的位置: ${rootIndex}`);
        console.log(`${indent}  左子树中序范围: [${inorderStart}, ${rootIndex - 1}]`);
        console.log(`${indent}  右子树中序范围: [${rootIndex + 1}, ${inorderEnd}]`);

        // 构造左子树
        if (inorderStart <= rootIndex - 1) {
            console.log(`${indent}  → 构造左子树`);
            root.left = buildSubTree(inorderStart, rootIndex - 1, depth + 1);
        } else {
            console.log(`${indent}  → 无左子树`);
        }

        // 构造右子树
        if (rootIndex + 1 <= inorderEnd) {
            console.log(`${indent}  → 构造右子树`);
            root.right = buildSubTree(rootIndex + 1, inorderEnd, depth + 1);
        } else {
            console.log(`${indent}  → 无右子树`);
        }

        console.log(`${indent}  ← 节点${rootVal}构造完成`);
        return root;
    }

    const result = buildSubTree(0, inorder.length - 1);
    console.log(`二叉树构造完成，共${step}步`);

    return result;
}

/**
 * 从前序与中序遍历序列构造二叉树 - 迭代方法
 * @param {number[]} preorder - 前序遍历数组
 * @param {number[]} inorder - 中序遍历数组
 * @return {TreeNode} 构造的二叉树根节点
 * @time O(n) 时间复杂度
 * @space O(n) 空间复杂度
 */
function buildTreeIterative(preorder, inorder) {
    if (!preorder || preorder.length === 0) return null;

    const root = new TreeNode(preorder[0]);
    const stack = [root];
    let preIndex = 1;
    let inIndex = 0;

    while (preIndex < preorder.length) {
        let current = stack[stack.length - 1];

        // 如果栈顶元素不等于中序遍历当前元素，说明还有左子树
        if (current.val !== inorder[inIndex]) {
            current.left = new TreeNode(preorder[preIndex++]);
            stack.push(current.left);
        } else {
            // 找到所有需要弹出的节点（这些节点的左子树已经构建完毕）
            while (stack.length > 0 && stack[stack.length - 1].val === inorder[inIndex]) {
                current = stack.pop();
                inIndex++;
            }

            // 构建右子树
            if (preIndex < preorder.length) {
                current.right = new TreeNode(preorder[preIndex++]);
                stack.push(current.right);
            }
        }
    }

    return root;
}

/**
 * 验证构造的二叉树是否正确
 * @param {TreeNode} root - 构造的二叉树根节点
 * @param {number[]} expectedPreorder - 期望的前序遍历
 * @param {number[]} expectedInorder - 期望的中序遍历
 * @return {object} 验证结果
 */
function validateConstructedTree(root, expectedPreorder, expectedInorder) {
    // 前序遍历
    function preorderTraversal(node) {
        if (!node) return [];
        return [node.val, ...preorderTraversal(node.left), ...preorderTraversal(node.right)];
    }

    // 中序遍历
    function inorderTraversal(node) {
        if (!node) return [];
        return [...inorderTraversal(node.left), node.val, ...inorderTraversal(node.right)];
    }

    const actualPreorder = preorderTraversal(root);
    const actualInorder = inorderTraversal(root);

    const preorderMatch = JSON.stringify(actualPreorder) === JSON.stringify(expectedPreorder);
    const inorderMatch = JSON.stringify(actualInorder) === JSON.stringify(expectedInorder);

    return {
        actualPreorder,
        actualInorder,
        preorderMatch,
        inorderMatch,
        isValid: preorderMatch && inorderMatch
    };
}

/**
 * 打印二叉树结构（层序遍历）
 * @param {TreeNode} root - 树根节点
 * @return {string} 树的字符串表示
 */
function printTree(root) {
    if (!root) return '[]';

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

    return `[${result.join(', ')}]`;
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
    console.log('二叉树结构:');
    lines.forEach(line => console.log(line));
}

/**
 * 获取二叉树的统计信息
 * @param {TreeNode} root - 树根节点
 * @return {object} 统计信息
 */
function getTreeStats(root) {
    if (!root) return { nodeCount: 0, height: 0, isComplete: true };

    let nodeCount = 0;
    let maxDepth = 0;

    function traverse(node, depth = 0) {
        if (!node) return;

        nodeCount++;
        maxDepth = Math.max(maxDepth, depth);

        traverse(node.left, depth + 1);
        traverse(node.right, depth + 1);
    }

    traverse(root);

    // 检查是否为完全二叉树
    function isComplete(node, index = 0) {
        if (!node) return true;
        if (index >= nodeCount) return false;

        return isComplete(node.left, 2 * index + 1) &&
               isComplete(node.right, 2 * index + 2);
    }

    return {
        nodeCount,
        height: maxDepth + 1,
        isComplete: isComplete(root)
    };
}

/**
 * 测试函数
 */
function testBuildTree() {
    const testCases = [
        {
            preorder: [3, 9, 20, 15, 7],
            inorder: [9, 3, 15, 20, 7],
            expected: [3, 9, 20, null, null, 15, 7],
            description: "经典测试用例：混合结构"
        },
        {
            preorder: [1, 2, 4, 5, 3, 6, 7],
            inorder: [4, 2, 5, 1, 6, 3, 7],
            expected: [1, 2, 3, 4, 5, 6, 7],
            description: "完全二叉树"
        },
        {
            preorder: [-1],
            inorder: [-1],
            expected: [-1],
            description: "单节点树"
        },
        {
            preorder: [1, 2, 3],
            inorder: [3, 2, 1],
            expected: [1, 2, null, 3],
            description: "左偏斜树"
        },
        {
            preorder: [1, 2, 3],
            inorder: [1, 2, 3],
            expected: [1, null, 2, null, 3],
            description: "右偏斜树"
        },
        {
            preorder: [1, 2, 4, 3, 5, 6],
            inorder: [4, 2, 1, 5, 3, 6],
            expected: [1, 2, 3, null, 4, 5, 6],
            description: "复杂不平衡树"
        }
    ];

    console.log("🌳 从前序与中序遍历序列构造二叉树测试");
    console.log("=====================================");

    testCases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`前序遍历: [${testCase.preorder.join(', ')}]`);
        console.log(`中序遍历: [${testCase.inorder.join(', ')}]`);

        // 测试不同方法
        const result1 = buildTree(testCase.preorder, testCase.inorder);
        const result2 = buildTreeBasic([...testCase.preorder], [...testCase.inorder]);
        const result3 = buildTreeIterative([...testCase.preorder], [...testCase.inorder]);

        console.log(`优化递归结果: ${printTree(result1)}`);
        console.log(`基础递归结果: ${printTree(result2)}`);
        console.log(`迭代方法结果: ${printTree(result3)}`);
        console.log(`期望结果: [${testCase.expected.join(', ')}]`);

        // 验证结果
        const validation1 = validateConstructedTree(result1, testCase.preorder, testCase.inorder);
        const validation2 = validateConstructedTree(result2, testCase.preorder, testCase.inorder);
        const validation3 = validateConstructedTree(result3, testCase.preorder, testCase.inorder);

        console.log(`优化递归验证: ${validation1.isValid ? '✅' : '❌'}`);
        console.log(`基础递归验证: ${validation2.isValid ? '✅' : '❌'}`);
        console.log(`迭代方法验证: ${validation3.isValid ? '✅' : '❌'}`);

        const passed = validation1.isValid && validation2.isValid && validation3.isValid;
        console.log(`测试${passed ? '✅ 通过' : '❌ 失败'}`);

        // 详细分析第一个用例
        if (index === 0) {
            console.log('\n--- 二叉树可视化 ---');
            visualizeTree(result1);

            console.log('\n--- 详细构造过程 ---');
            buildTreeWithAnalysis([...testCase.preorder], [...testCase.inorder]);

            const stats = getTreeStats(result1);
            console.log('\n--- 树的统计信息 ---');
            console.log(`节点数: ${stats.nodeCount}`);
            console.log(`高度: ${stats.height}`);
            console.log(`是否完全二叉树: ${stats.isComplete ? '是' : '否'}`);
        }
    });
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n📊 性能测试");
    console.log("===========");

    // 生成测试数据
    function generateTestData(size) {
        const preorder = [];
        const inorder = [];

        // 生成一个平衡二叉树的遍历序列
        function generateBalanced(start, end, root) {
            if (start > end) return;

            const mid = Math.floor((start + end) / 2);
            const val = root + mid - start;

            preorder.push(val);

            generateBalanced(start, mid - 1, root);
            inorder.push(val);
            generateBalanced(mid + 1, end, root);
        }

        generateBalanced(0, size - 1, 1);

        // 调整中序遍历顺序
        const tempInorder = [];
        function inorderGen(start, end) {
            if (start > end) return;
            const mid = Math.floor((start + end) / 2);
            inorderGen(start, mid - 1);
            tempInorder.push(start + 1);
            inorderGen(mid + 1, end);
        }

        inorderGen(0, size - 1);

        return { preorder, inorder: tempInorder };
    }

    const sizes = [100, 500, 1000];

    sizes.forEach(size => {
        console.log(`\n测试规模: ${size}节点`);

        const { preorder, inorder } = generateTestData(size);

        // 测试优化递归方法
        let start = performance.now();
        const result1 = buildTree([...preorder], [...inorder]);
        let end = performance.now();
        console.log(`优化递归: ${(end - start).toFixed(4)}ms`);

        // 测试基础递归方法（小规模时测试）
        if (size <= 500) {
            start = performance.now();
            const result2 = buildTreeBasic([...preorder], [...inorder]);
            end = performance.now();
            console.log(`基础递归: ${(end - start).toFixed(4)}ms`);
        } else {
            console.log(`基础递归: 跳过（性能较差）`);
        }

        // 测试迭代方法
        start = performance.now();
        const result3 = buildTreeIterative([...preorder], [...inorder]);
        end = performance.now();
        console.log(`迭代方法: ${(end - start).toFixed(4)}ms`);

        // 验证结果
        const stats = getTreeStats(result1);
        console.log(`构造的树: ${stats.nodeCount}节点, 高度${stats.height}`);
    });
}

/**
 * 构造二叉树算法原理演示
 */
function demonstrateBuildTreeConcept() {
    console.log("\n🎯 构造二叉树算法原理演示");
    console.log("=========================");

    const preorder = [3, 9, 20, 15, 7];
    const inorder = [9, 3, 15, 20, 7];

    console.log(`前序遍历: [${preorder.join(', ')}]`);
    console.log(`中序遍历: [${inorder.join(', ')}]`);

    console.log('\n算法原理:');
    console.log('1. 前序遍历的第一个元素总是根节点');
    console.log('2. 在中序遍历中找到根节点，它的左边是左子树，右边是右子树');
    console.log('3. 根据左子树节点数量，在前序遍历中分割出左子树和右子树部分');
    console.log('4. 递归构造左右子树');

    console.log('\n具体步骤演示:');
    console.log('步骤1: 前序遍历第一个元素3是根节点');
    console.log('步骤2: 在中序遍历中找到3的位置，索引为1');
    console.log('       左子树: [9] (1个节点)');
    console.log('       右子树: [15, 20, 7] (3个节点)');
    console.log('步骤3: 分割前序遍历');
    console.log('       左子树前序: [9]');
    console.log('       右子树前序: [20, 15, 7]');
    console.log('步骤4: 递归构造左子树(9)和右子树(20, 15, 7)');

    console.log('\n时间复杂度分析:');
    console.log('- 使用哈希表优化: O(n)');
    console.log('- 不使用哈希表: O(n²) (每次都要查找根节点位置)');
    console.log('- 迭代方法: O(n)');

    console.log('\n空间复杂度分析:');
    console.log('- 递归栈: O(h), h为树的高度');
    console.log('- 哈希表: O(n)');
    console.log('- 总体: O(n)');
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TreeNode,
        buildTree,
        buildTreeBasic,
        buildTreeWithAnalysis,
        buildTreeIterative,
        validateConstructedTree,
        printTree,
        visualizeTree,
        getTreeStats,
        testBuildTree,
        performanceTest,
        demonstrateBuildTreeConcept
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.buildTree = buildTree;
    window.testBuildTree = testBuildTree;
}

// 运行测试
// testBuildTree();
// performanceTest();
// demonstrateBuildTreeConcept();