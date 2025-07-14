/**
 * LeetCode 98. 验证二叉搜索树
 *
 * 问题描述：
 * 给你一个二叉树的根节点 root ，判断其是否是一个有效的二叉搜索树。
 * 有效二叉搜索树定义如下：
 * - 节点的左子树只包含小于当前节点的数
 * - 节点的右子树只包含大于当前节点的数
 * - 所有左子树和右子树自身必须也是二叉搜索树
 *
 * 核心思想：
 * 二叉搜索树的关键性质是中序遍历序列为递增序列
 * 也可以通过递归验证每个节点是否在有效范围内
 *
 * 示例：
 * 输入：root = [2,1,3]
 * 输出：true
 *
 * 输入：root = [5,1,4,null,null,3,6]
 * 输出：false
 * 解释：根节点的值是 5 ，但是右子节点的值是 4 。
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
 * 验证二叉搜索树 - 递归边界检查（面试推荐）
 * @param {TreeNode} root - 树根节点
 * @return {boolean} 是否为有效的二叉搜索树
 * @time O(n) 时间复杂度，访问每个节点一次
 * @space O(h) 空间复杂度，h为树的高度
 */
function isValidBST(root) {
    /**
     * 验证节点是否在有效范围内
     * @param {TreeNode} node - 当前节点
     * @param {number} minVal - 最小值边界
     * @param {number} maxVal - 最大值边界
     * @return {boolean} 是否有效
     */
    function validate(node, minVal, maxVal) {
        // 空节点是有效的BST
        if (!node) return true;

        // 当前节点值必须在有效范围内
        if (node.val <= minVal || node.val >= maxVal) {
            return false;
        }

        // 递归验证左右子树
        // 左子树：所有节点值 < 当前节点值
        // 右子树：所有节点值 > 当前节点值
        return validate(node.left, minVal, node.val) &&
               validate(node.right, node.val, maxVal);
    }

    return validate(root, -Infinity, Infinity);
}

/**
 * 验证二叉搜索树 - 中序遍历法
 * @param {TreeNode} root - 树根节点
 * @return {boolean} 是否为有效的二叉搜索树
 * @time O(n) 时间复杂度
 * @space O(h) 空间复杂度
 */
function isValidBSTInorder(root) {
    let prev = -Infinity;

    function inorder(node) {
        if (!node) return true;

        // 遍历左子树
        if (!inorder(node.left)) return false;

        // 检查当前节点
        if (node.val <= prev) return false;
        prev = node.val;

        // 遍历右子树
        return inorder(node.right);
    }

    return inorder(root);
}

/**
 * 验证二叉搜索树 - 迭代中序遍历
 * @param {TreeNode} root - 树根节点
 * @return {boolean} 是否为有效的二叉搜索树
 * @time O(n) 时间复杂度
 * @space O(h) 空间复杂度
 */
function isValidBSTIterative(root) {
    const stack = [];
    let current = root;
    let prev = -Infinity;

    while (stack.length > 0 || current) {
        // 一直往左走到底
        while (current) {
            stack.push(current);
            current = current.left;
        }

        // 处理栈顶节点
        current = stack.pop();

        // 检查是否递增
        if (current.val <= prev) {
            return false;
        }
        prev = current.val;

        // 转向右子树
        current = current.right;
    }

    return true;
}

/**
 * 验证二叉搜索树 - 详细分析版本
 * @param {TreeNode} root - 树根节点
 * @return {boolean} 是否为有效的二叉搜索树
 */
function isValidBSTWithAnalysis(root) {
    if (!root) {
        console.log('空树是有效的BST');
        return true;
    }

    console.log('开始验证二叉搜索树');
    const nodeInfo = [];

    function validate(node, minVal, maxVal, depth = 0) {
        if (!node) return true;

        const indent = '  '.repeat(depth);
        const info = {
            val: node.val,
            minVal: minVal === -Infinity ? '-∞' : minVal,
            maxVal: maxVal === Infinity ? '+∞' : maxVal,
            depth: depth,
            valid: node.val > minVal && node.val < maxVal
        };

        nodeInfo.push(info);

        console.log(`${indent}节点${node.val}: 范围(${info.minVal}, ${info.maxVal}) - ${info.valid ? '✅' : '❌'}`);

        if (!info.valid) {
            console.log(`${indent}❌ 节点${node.val}不在有效范围内`);
            return false;
        }

        // 验证左子树和右子树
        const leftValid = validate(node.left, minVal, node.val, depth + 1);
        const rightValid = validate(node.right, node.val, maxVal, depth + 1);

        return leftValid && rightValid;
    }

    const result = validate(root, -Infinity, Infinity);

    console.log('\n验证结果汇总:');
    nodeInfo.forEach(info => {
        console.log(`节点${info.val}: 深度${info.depth}, 范围(${info.minVal}, ${info.maxVal}) - ${info.valid ? '有效' : '无效'}`);
    });

    console.log(`\n最终结果: ${result ? '是' : '不是'}有效的二叉搜索树`);
    return result;
}

/**
 * 验证二叉搜索树 - 收集中序遍历序列
 * @param {TreeNode} root - 树根节点
 * @return {object} 包含验证结果和中序遍历序列
 */
function isValidBSTWithSequence(root) {
    const inorderSequence = [];

    function inorder(node) {
        if (!node) return;
        inorder(node.left);
        inorderSequence.push(node.val);
        inorder(node.right);
    }

    inorder(root);

    // 检查序列是否严格递增
    let isValid = true;
    for (let i = 1; i < inorderSequence.length; i++) {
        if (inorderSequence[i] <= inorderSequence[i - 1]) {
            isValid = false;
            break;
        }
    }

    return {
        isValid,
        inorderSequence,
        isStrictlyIncreasing: isValid
    };
}

/**
 * 获取二叉搜索树的范围信息
 * @param {TreeNode} root - 树根节点
 * @return {object} 树的范围信息
 */
function getBSTRangeInfo(root) {
    if (!root) return null;

    function getInfo(node) {
        if (!node) return null;

        const leftInfo = getInfo(node.left);
        const rightInfo = getInfo(node.right);

        let min = node.val;
        let max = node.val;
        let isValid = true;

        // 检查左子树
        if (leftInfo) {
            if (leftInfo.max >= node.val || !leftInfo.isValid) {
                isValid = false;
            }
            min = leftInfo.min;
        }

        // 检查右子树
        if (rightInfo) {
            if (rightInfo.min <= node.val || !rightInfo.isValid) {
                isValid = false;
            }
            max = rightInfo.max;
        }

        return {
            min,
            max,
            isValid,
            nodeVal: node.val
        };
    }

    return getInfo(root);
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
function testIsValidBST() {
    const testCases = [
        {
            values: [2, 1, 3],
            expected: true,
            description: "简单有效BST：左<根<右"
        },
        {
            values: [5, 1, 4, null, null, 3, 6],
            expected: false,
            description: "无效BST：右子树的左节点3<根节点5"
        },
        {
            values: [1],
            expected: true,
            description: "单节点：有效BST"
        },
        {
            values: [10, 5, 15, null, null, 6, 20],
            expected: false,
            description: "无效BST：右子树的左节点6<根节点10"
        },
        {
            values: [5, 4, 6, null, null, 3, 7],
            expected: false,
            description: "无效BST：右子树的左节点3<根节点5"
        },
        {
            values: [2, 1, 3, null, null, null, 4],
            expected: true,
            description: "有效BST：链状结构"
        },
        {
            values: [1, 1],
            expected: false,
            description: "无效BST：重复值"
        }
    ];

    console.log("🌳 验证二叉搜索树算法测试");
    console.log("========================");

    testCases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`输入: [${testCase.values.join(', ')}]`);

        const root = buildTree(testCase.values);
        printTree(root);

        const result1 = isValidBST(root);
        const result2 = isValidBSTInorder(buildTree(testCase.values));
        const result3 = isValidBSTIterative(buildTree(testCase.values));
        const sequenceResult = isValidBSTWithSequence(buildTree(testCase.values));
        const rangeInfo = getBSTRangeInfo(buildTree(testCase.values));

        console.log(`递归边界检查: ${result1}`);
        console.log(`递归中序遍历: ${result2}`);
        console.log(`迭代中序遍历: ${result3}`);
        console.log(`中序序列: [${sequenceResult.inorderSequence.join(', ')}]`);
        console.log(`序列递增: ${sequenceResult.isStrictlyIncreasing}`);
        if (rangeInfo) {
            console.log(`节点范围: [${rangeInfo.min}, ${rangeInfo.max}], 有效: ${rangeInfo.isValid}`);
        }
        console.log(`期望结果: ${testCase.expected}`);

        const passed = result1 === testCase.expected &&
                      result2 === testCase.expected &&
                      result3 === testCase.expected;

        console.log(`测试${passed ? '✅ 通过' : '❌ 失败'}`);

        // 详细分析第二个用例（无效BST）
        if (index === 1) {
            console.log('\n--- 详细分析过程 ---');
            isValidBSTWithAnalysis(buildTree(testCase.values));
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
    function buildBalancedBST(depth, start = 0) {
        if (depth <= 0) return null;

        const mid = start + Math.pow(2, depth - 1);
        const root = new TreeNode(mid);
        root.left = buildBalancedBST(depth - 1, start);
        root.right = buildBalancedBST(depth - 1, mid + 1);
        return root;
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
        { name: "平衡BST(深度12)", tree: buildBalancedBST(12), expectedValid: true },
        { name: "平衡BST(深度15)", tree: buildBalancedBST(15), expectedValid: true },
        { name: "右偏斜树(1000节点)", tree: buildSkewedTree(1000), expectedValid: true },
        { name: "右偏斜树(5000节点)", tree: buildSkewedTree(5000), expectedValid: true }
    ];

    testTrees.forEach(testTree => {
        console.log(`\n测试: ${testTree.name}`);

        // 测试递归边界检查
        let start = performance.now();
        const result1 = isValidBST(testTree.tree);
        let end = performance.now();
        console.log(`递归边界检查: ${(end - start).toFixed(4)}ms, 结果: ${result1}`);

        // 测试递归中序遍历
        start = performance.now();
        const result2 = isValidBSTInorder(testTree.tree);
        end = performance.now();
        console.log(`递归中序遍历: ${(end - start).toFixed(4)}ms, 结果: ${result2}`);

        // 测试迭代中序遍历
        start = performance.now();
        const result3 = isValidBSTIterative(testTree.tree);
        end = performance.now();
        console.log(`迭代中序遍历: ${(end - start).toFixed(4)}ms, 结果: ${result3}`);

        console.log(`结果一致性: ${result1 === result2 && result2 === result3 ? '✅' : '❌'}`);
        console.log(`期望结果: ${testTree.expectedValid}, 实际结果: ${result1}`);
    });
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TreeNode,
        isValidBST,
        isValidBSTInorder,
        isValidBSTIterative,
        isValidBSTWithAnalysis,
        isValidBSTWithSequence,
        getBSTRangeInfo,
        buildTree,
        printTree,
        testIsValidBST,
        performanceTest
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.isValidBST = isValidBST;
    window.testIsValidBST = testIsValidBST;
}

// 运行测试
// testIsValidBST();
// performanceTest();