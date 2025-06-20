/**
 * 第5章：二叉树基础 - 练习题解答
 *
 * 包含5道精选练习题的完整解答：
 * 1. 二叉树的前序遍历（简单）
 * 2. 路径总和（简单）
 * 3. 从前序与中序遍历序列构造二叉树（中等）
 * 4. 平衡二叉树（简单）
 * 5. 二叉树的最大路径和（困难）
 *
 * 作者：数据结构与算法教程
 * 日期：2024年
 */

// 二叉树节点定义
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// ============================= 题目一：二叉树的前序遍历 =============================

/**
 * 题目一：二叉树的前序遍历（简单）
 *
 * 核心思想：
 * 前序遍历遵循"根-左-右"的访问顺序，可以用递归或迭代实现
 *
 * 解法一：递归实现
 * 算法步骤：
 * 1. 如果当前节点为空，直接返回
 * 2. 访问当前节点（将值加入结果）
 * 3. 递归遍历左子树
 * 4. 递归遍历右子树
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number[]} 前序遍历结果
 * @time O(n) - 访问每个节点一次
 * @space O(h) - 递归栈空间，h为树高
 */
function preorderTraversalRecursive(root) {
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
 * 解法二：迭代实现
 * 算法步骤：
 * 1. 使用栈存储待访问的节点
 * 2. 从栈中弹出节点并访问
 * 3. 先将右子树入栈，再将左子树入栈（保证左子树先出栈）
 * 4. 重复直到栈为空
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number[]} 前序遍历结果
 * @time O(n) - 访问每个节点一次
 * @space O(h) - 栈空间
 */
function preorderTraversalIterative(root) {
    if (!root) return [];

    const result = [];
    const stack = [root];

    while (stack.length > 0) {
        const node = stack.pop();
        result.push(node.val);      // 访问当前节点

        // 注意：先右后左，保证左子树先被访问
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
    }

    return result;
}

// ============================= 题目二：路径总和 =============================

/**
 * 题目二：路径总和（简单）
 *
 * 核心思想：
 * 使用递归，每次将目标和减去当前节点值，到达叶子节点时检查是否相等
 *
 * 算法步骤：
 * 1. 如果当前节点为空，返回false
 * 2. 如果是叶子节点，检查当前节点值是否等于目标和
 * 3. 否则，递归检查左右子树，目标和减去当前节点值
 * 4. 只要有一条路径满足条件就返回true
 *
 * @param {TreeNode} root - 二叉树根节点
 * @param {number} targetSum - 目标和
 * @returns {boolean} 是否存在满足条件的路径
 * @time O(n) - 最坏情况下访问所有节点
 * @space O(h) - 递归栈空间
 */
function hasPathSum(root, targetSum) {
    // 空节点返回false
    if (!root) return false;

    // 到达叶子节点，检查当前节点值是否等于剩余目标和
    if (!root.left && !root.right) {
        return root.val === targetSum;
    }

    // 递归检查左右子树，目标和减去当前节点值
    const remainingSum = targetSum - root.val;
    return hasPathSum(root.left, remainingSum) ||
           hasPathSum(root.right, remainingSum);
}

// ============================= 题目三：从前序与中序遍历序列构造二叉树 =============================

/**
 * 题目三：从前序与中序遍历序列构造二叉树（中等）
 *
 * 核心思想：
 * - 前序遍历：根-左-右，第一个元素是根节点
 * - 中序遍历：左-根-右，根节点分割左右子树
 * 利用这个特性递归构造树
 *
 * 算法步骤：
 * 1. 从前序遍历取第一个元素作为根节点
 * 2. 在中序遍历中找到根节点位置，分割左右子树
 * 3. 递归构造左子树和右子树
 * 4. 使用哈希表优化根节点查找
 *
 * @param {number[]} preorder - 前序遍历序列
 * @param {number[]} inorder - 中序遍历序列
 * @returns {TreeNode} 构造的二叉树根节点
 * @time O(n) - 每个节点处理一次
 * @space O(n) - 递归栈和哈希表空间
 */
function buildTree(preorder, inorder) {
    if (preorder.length === 0) return null;

    // 构建中序遍历的值到索引的映射，优化查找
    const inorderMap = new Map();
    for (let i = 0; i < inorder.length; i++) {
        inorderMap.set(inorder[i], i);
    }

    let preorderIndex = 0;

    function build(inorderStart, inorderEnd) {
        if (inorderStart > inorderEnd) return null;

        // 前序遍历的当前元素是根节点
        const rootVal = preorder[preorderIndex++];
        const root = new TreeNode(rootVal);

        // 在中序遍历中找到根节点位置
        const rootIndex = inorderMap.get(rootVal);

        // 递归构造左子树（根节点左边的部分）
        root.left = build(inorderStart, rootIndex - 1);
        // 递归构造右子树（根节点右边的部分）
        root.right = build(rootIndex + 1, inorderEnd);

        return root;
    }

    return build(0, inorder.length - 1);
}

// ============================= 题目四：平衡二叉树 =============================

/**
 * 题目四：平衡二叉树（简单）
 *
 * 核心思想：
 * 平衡二叉树的每个节点的左右子树高度差不超过1
 * 使用后序遍历，自底向上同时计算高度和检查平衡性
 *
 * 算法步骤：
 * 1. 递归计算左右子树的高度和平衡性
 * 2. 检查当前节点的左右子树高度差是否超过1
 * 3. 当前节点平衡当且仅当：左右子树都平衡且高度差≤1
 * 4. 返回当前节点的高度和平衡性
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {boolean} 是否为平衡二叉树
 * @time O(n) - 访问每个节点一次
 * @space O(h) - 递归栈空间
 */
function isBalanced(root) {
    /**
     * 辅助函数：检查平衡性并返回高度
     * @param {TreeNode} node 当前节点
     * @returns {Object} {balanced: boolean, height: number}
     */
    function checkBalance(node) {
        if (!node) {
            return { balanced: true, height: 0 };
        }

        // 递归检查左右子树
        const left = checkBalance(node.left);
        const right = checkBalance(node.right);

        // 当前节点是否平衡：左右子树都平衡且高度差≤1
        const balanced = left.balanced &&
                        right.balanced &&
                        Math.abs(left.height - right.height) <= 1;

        // 当前节点的高度
        const height = 1 + Math.max(left.height, right.height);

        return { balanced, height };
    }

    return checkBalance(root).balanced;
}

/**
 * 优化版本：一旦发现不平衡立即返回
 * 使用-1表示不平衡，正数表示高度
 */
function isBalancedOptimized(root) {
    function getHeight(node) {
        if (!node) return 0;

        const leftHeight = getHeight(node.left);
        if (leftHeight === -1) return -1;    // 左子树不平衡

        const rightHeight = getHeight(node.right);
        if (rightHeight === -1) return -1;   // 右子树不平衡

        // 检查当前节点是否平衡
        if (Math.abs(leftHeight - rightHeight) > 1) {
            return -1;   // 当前节点不平衡
        }

        return 1 + Math.max(leftHeight, rightHeight);
    }

    return getHeight(root) !== -1;
}

// ============================= 题目五：二叉树的最大路径和 =============================

/**
 * 题目五：二叉树的最大路径和（困难）
 *
 * 核心思想：
 * 对每个节点，经过该节点的最大路径和 = 左子树最大贡献 + 节点值 + 右子树最大贡献
 * 递归函数返回以当前节点为端点的最大路径和，同时维护全局最大值
 *
 * 算法步骤：
 * 1. 递归计算左右子树的最大贡献值（负数则不贡献）
 * 2. 计算经过当前节点的最大路径和
 * 3. 更新全局最大值
 * 4. 返回以当前节点为端点的最大路径和
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number} 最大路径和
 * @time O(n) - 访问每个节点一次
 * @space O(h) - 递归栈空间
 */
function maxPathSum(root) {
    let maxSum = -Infinity;   // 全局最大值

    /**
     * 计算以当前节点为端点的最大路径和
     * @param {TreeNode} node 当前节点
     * @returns {number} 最大路径和（作为端点）
     */
    function maxGain(node) {
        if (!node) return 0;

        // 递归计算左右子树的最大贡献值
        // 如果贡献值为负，则不选择该路径（用0代替）
        const leftGain = Math.max(maxGain(node.left), 0);
        const rightGain = Math.max(maxGain(node.right), 0);

        // 经过当前节点的最大路径和
        const currentMaxPath = node.val + leftGain + rightGain;

        // 更新全局最大值
        maxSum = Math.max(maxSum, currentMaxPath);

        // 返回以当前节点为端点的最大路径和
        // 只能选择左或右一条路径，加上当前节点值
        return node.val + Math.max(leftGain, rightGain);
    }

    maxGain(root);
    return maxSum;
}

// ============================= 测试用例 =============================

/**
 * 创建测试树1
 * 结构:
 *     1
 *      \
 *       2
 *      /
 *     3
 */
function createTestTree1() {
    const root = new TreeNode(1);
    root.right = new TreeNode(2);
    root.right.left = new TreeNode(3);
    return root;
}

/**
 * 创建测试树2
 * 结构:
 *       5
 *      / \
 *     4   8
 *    /   / \
 *   11  13  4
 *  / \      \
 * 7   2      1
 */
function createTestTree2() {
    const root = new TreeNode(5);
    root.left = new TreeNode(4);
    root.right = new TreeNode(8);
    root.left.left = new TreeNode(11);
    root.left.left.left = new TreeNode(7);
    root.left.left.right = new TreeNode(2);
    root.right.left = new TreeNode(13);
    root.right.right = new TreeNode(4);
    root.right.right.right = new TreeNode(1);
    return root;
}

/**
 * 创建测试树3 - 用于构造测试
 * 结构:
 *     3
 *    / \
 *   9   20
 *      /  \
 *     15   7
 */
function createTestTree3() {
    const root = new TreeNode(3);
    root.left = new TreeNode(9);
    root.right = new TreeNode(20);
    root.right.left = new TreeNode(15);
    root.right.right = new TreeNode(7);
    return root;
}

/**
 * 创建不平衡测试树
 * 结构:
 *       1
 *      / \
 *     2   2
 *    / \
 *   3   3
 *  / \
 * 4   4
 */
function createUnbalancedTree() {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(2);
    root.left.left = new TreeNode(3);
    root.left.right = new TreeNode(3);
    root.left.left.left = new TreeNode(4);
    root.left.left.right = new TreeNode(4);
    return root;
}

/**
 * 创建最大路径和测试树
 * 结构:
 *     -10
 *     /  \
 *    9    20
 *        /  \
 *       15   7
 */
function createMaxPathSumTree() {
    const root = new TreeNode(-10);
    root.left = new TreeNode(9);
    root.right = new TreeNode(20);
    root.right.left = new TreeNode(15);
    root.right.right = new TreeNode(7);
    return root;
}

/**
 * 将树转换为层序遍历数组（用于验证构造结果）
 */
function treeToArray(root) {
    if (!root) return [];

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

    return result;
}

/**
 * 测试所有题目
 */
function runAllTests() {
    console.log("第5章练习题测试开始...\n");

    // 测试题目一：前序遍历
    console.log("=== 题目一：前序遍历 ===");
    const tree1 = createTestTree1();
    console.log("递归版本:", preorderTraversalRecursive(tree1));
    console.log("迭代版本:", preorderTraversalIterative(tree1));
    console.log("预期结果: [1, 2, 3]\n");

    // 测试题目二：路径总和
    console.log("=== 题目二：路径总和 ===");
    const tree2 = createTestTree2();
    console.log("目标和22:", hasPathSum(tree2, 22));
    console.log("目标和5:", hasPathSum(tree2, 5));
    console.log("预期结果: true, false\n");

    // 测试题目三：构造二叉树
    console.log("=== 题目三：构造二叉树 ===");
    const preorder = [3, 9, 20, 15, 7];
    const inorder = [9, 3, 15, 20, 7];
    const constructed = buildTree(preorder, inorder);
    console.log("构造结果:", treeToArray(constructed));
    console.log("预期结果: [3, 9, 20, null, null, 15, 7]\n");

    // 测试题目四：平衡二叉树
    console.log("=== 题目四：平衡二叉树 ===");
    const tree3 = createTestTree3();
    const unbalancedTree = createUnbalancedTree();
    console.log("平衡树:", isBalanced(tree3));
    console.log("不平衡树:", isBalanced(unbalancedTree));
    console.log("优化版-平衡树:", isBalancedOptimized(tree3));
    console.log("优化版-不平衡树:", isBalancedOptimized(unbalancedTree));
    console.log("预期结果: true, false, true, false\n");

    // 测试题目五：最大路径和
    console.log("=== 题目五：最大路径和 ===");
    const maxPathTree = createMaxPathSumTree();
    const simpleTree = new TreeNode(1, new TreeNode(2), new TreeNode(3));
    console.log("复杂树最大路径和:", maxPathSum(maxPathTree));
    console.log("简单树最大路径和:", maxPathSum(simpleTree));
    console.log("预期结果: 42, 6\n");

    console.log("所有测试完成！");
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TreeNode,
        preorderTraversalRecursive,
        preorderTraversalIterative,
        hasPathSum,
        buildTree,
        isBalanced,
        isBalancedOptimized,
        maxPathSum,
        runAllTests
    };
}

// 自动运行测试（如果直接执行此文件）
if (typeof require !== 'undefined' && require.main === module) {
    runAllTests();
}