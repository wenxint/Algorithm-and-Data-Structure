/**
 * 第5章：二叉树基础 - 算法实现
 *
 * 本文件包含：
 * 1. 二叉树遍历算法（递归和迭代版本）
 * 2. 路径问题算法
 * 3. 树的构造和修改算法
 * 4. 树的属性计算算法
 * 5. 完整的测试用例
 *
 * 作者：数据结构与算法教程
 * 日期：2024年
 */

// ============================= 1. 二叉树节点定义 =============================

class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// ============================= 2. 遍历算法 =============================

/**
 * 二叉树前序遍历（递归）
 *
 * 核心思想：
 * 根 -> 左 -> 右的访问顺序
 * 利用递归的自然特性，先处理当前节点，再递归处理子树
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number[]} 前序遍历结果
 * @time O(n) - 访问每个节点一次
 * @space O(h) - 递归栈空间，h为树高
 */
function preorderTraversal(root) {
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
 * 二叉树前序遍历（迭代）
 *
 * 核心思想：
 * 使用栈模拟递归过程
 * 由于栈是LIFO，先入右子树，再入左子树，保证左子树先被访问
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

        // 先右子树入栈，再左子树入栈（保证左子树先被处理）
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
    }

    return result;
}

/**
 * 二叉树中序遍历（递归）
 *
 * 核心思想：
 * 左 -> 根 -> 右的访问顺序
 * 对于二叉搜索树，中序遍历得到递增序列
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number[]} 中序遍历结果
 * @time O(n) - 访问每个节点一次
 * @space O(h) - 递归栈空间
 */
function inorderTraversal(root) {
    const result = [];

    function traverse(node) {
        if (!node) return;

        traverse(node.left);        // 递归遍历左子树
        result.push(node.val);      // 访问根节点
        traverse(node.right);       // 递归遍历右子树
    }

    traverse(root);
    return result;
}

/**
 * 二叉树中序遍历（迭代）
 *
 * 核心思想：
 * 使用栈，先将左边界上的所有节点入栈
 * 然后依次出栈访问，并处理右子树
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number[]} 中序遍历结果
 * @time O(n) - 访问每个节点一次
 * @space O(h) - 栈空间
 */
function inorderTraversalIterative(root) {
    const result = [];
    const stack = [];
    let current = root;

    while (current || stack.length > 0) {
        // 将左边界上的所有节点入栈
        while (current) {
            stack.push(current);
            current = current.left;
        }

        // 出栈并访问节点
        current = stack.pop();
        result.push(current.val);

        // 转向右子树
        current = current.right;
    }

    return result;
}

/**
 * 二叉树后序遍历（递归）
 *
 * 核心思想：
 * 左 -> 右 -> 根的访问顺序
 * 先处理子树，再处理当前节点，自底向上
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number[]} 后序遍历结果
 * @time O(n) - 访问每个节点一次
 * @space O(h) - 递归栈空间
 */
function postorderTraversal(root) {
    const result = [];

    function traverse(node) {
        if (!node) return;

        traverse(node.left);        // 递归遍历左子树
        traverse(node.right);       // 递归遍历右子树
        result.push(node.val);      // 访问根节点
    }

    traverse(root);
    return result;
}

/**
 * 二叉树层序遍历
 *
 * 核心思想：
 * 使用队列进行广度优先搜索
 * 逐层访问节点，队列的FIFO特性保证同一层节点按顺序处理
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number[][]} 层序遍历结果，每层一个数组
 * @time O(n) - 访问每个节点一次
 * @space O(w) - w为树的最大宽度
 */
function levelOrder(root) {
    if (!root) return [];

    const result = [];
    const queue = [root];

    while (queue.length > 0) {
        const levelSize = queue.length;    // 当前层节点数
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
 * 二叉树锯齿形层序遍历
 *
 * 核心思想：
 * 在层序遍历基础上，交替改变每层的遍历方向
 * 奇数层从左到右，偶数层从右到左
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
    let leftToRight = true;    // 遍历方向标志

    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];

        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();

            // 根据方向决定插入位置
            if (leftToRight) {
                currentLevel.push(node.val);
            } else {
                currentLevel.unshift(node.val);    // 头插法实现反向
            }

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        result.push(currentLevel);
        leftToRight = !leftToRight;    // 切换方向
    }

    return result;
}

// ============================= 3. 路径问题算法 =============================

/**
 * 路径总和 - 判断是否存在路径
 *
 * 核心思想：
 * 自顶向下递归，每层减去当前节点值
 * 到达叶子节点时检查剩余值是否为0
 *
 * @param {TreeNode} root - 二叉树根节点
 * @param {number} targetSum - 目标和
 * @returns {boolean} 是否存在路径和等于目标值
 * @time O(n) - 最坏情况下访问所有节点
 * @space O(h) - 递归栈空间
 */
function hasPathSum(root, targetSum) {
    if (!root) return false;

    // 到达叶子节点，检查路径和
    if (!root.left && !root.right) {
        return root.val === targetSum;
    }

    // 递归检查左右子树，目标值减去当前节点值
    const remainingSum = targetSum - root.val;
    return hasPathSum(root.left, remainingSum) ||
           hasPathSum(root.right, remainingSum);
}

/**
 * 路径总和 II - 找出所有路径
 *
 * 核心思想：
 * 使用回溯法记录路径，到达叶子节点时检查路径和
 * 递归过程中维护当前路径，回溯时恢复状态
 *
 * @param {TreeNode} root - 二叉树根节点
 * @param {number} targetSum - 目标和
 * @returns {number[][]} 所有满足条件的路径
 * @time O(n²) - 最坏情况下需要复制O(n)个长度为O(n)的路径
 * @space O(n) - 递归栈和路径存储空间
 */
function pathSum(root, targetSum) {
    const result = [];
    const path = [];

    function dfs(node, remainingSum) {
        if (!node) return;

        // 将当前节点加入路径
        path.push(node.val);

        // 到达叶子节点，检查路径和
        if (!node.left && !node.right && remainingSum === node.val) {
            result.push([...path]);    // 复制当前路径
        } else {
            // 继续递归左右子树
            dfs(node.left, remainingSum - node.val);
            dfs(node.right, remainingSum - node.val);
        }

        // 回溯：移除当前节点
        path.pop();
    }

    dfs(root, targetSum);
    return result;
}

/**
 * 路径总和 III - 路径不一定从根到叶子
 *
 * 核心思想：
 * 对每个节点，计算以该节点开始的路径数
 * 递归遍历所有节点作为路径起点
 *
 * @param {TreeNode} root - 二叉树根节点
 * @param {number} targetSum - 目标和
 * @returns {number} 满足条件的路径数量
 * @time O(n²) - 最坏情况下对每个节点都计算一次路径
 * @space O(h) - 递归栈空间
 */
function pathSumIII(root, targetSum) {
    if (!root) return 0;

    // 以当前节点为起点的路径数 + 左子树的路径数 + 右子树的路径数
    return countPaths(root, targetSum) +
           pathSumIII(root.left, targetSum) +
           pathSumIII(root.right, targetSum);
}

function countPaths(node, targetSum) {
    if (!node) return 0;

    let count = 0;
    // 如果当前节点值等于目标和，找到一条路径
    if (node.val === targetSum) count++;

    // 继续向下查找路径
    count += countPaths(node.left, targetSum - node.val);
    count += countPaths(node.right, targetSum - node.val);

    return count;
}

/**
 * 二叉树的最大路径和
 *
 * 核心思想：
 * 对每个节点，最大路径和可能是：
 * 1. 经过该节点的路径（左子树最大路径 + 节点值 + 右子树最大路径）
 * 2. 在其左子树或右子树中的最大路径
 * 使用后序遍历，自底向上计算
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number} 最大路径和
 * @time O(n) - 访问每个节点一次
 * @space O(h) - 递归栈空间
 */
function maxPathSum(root) {
    let maxSum = -Infinity;

    function maxGain(node) {
        if (!node) return 0;

        // 递归计算左右子树的最大贡献值（负数则不贡献）
        const leftGain = Math.max(maxGain(node.left), 0);
        const rightGain = Math.max(maxGain(node.right), 0);

        // 经过当前节点的最大路径和
        const currentMaxPath = node.val + leftGain + rightGain;

        // 更新全局最大值
        maxSum = Math.max(maxSum, currentMaxPath);

        // 返回当前节点为端点的最大路径和
        return node.val + Math.max(leftGain, rightGain);
    }

    maxGain(root);
    return maxSum;
}

/**
 * 二叉树的直径
 *
 * 核心思想：
 * 二叉树的直径是任意两个节点间路径长度的最大值
 * 对每个节点，经过该节点的最长路径长度 = 左子树深度 + 右子树深度
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number} 树的直径
 * @time O(n) - 访问每个节点一次
 * @space O(h) - 递归栈空间
 */
function diameterOfBinaryTree(root) {
    let maxDiameter = 0;

    function getDepth(node) {
        if (!node) return 0;

        // 递归计算左右子树深度
        const leftDepth = getDepth(node.left);
        const rightDepth = getDepth(node.right);

        // 更新最大直径（经过当前节点的路径长度）
        maxDiameter = Math.max(maxDiameter, leftDepth + rightDepth);

        // 返回当前节点的深度
        return 1 + Math.max(leftDepth, rightDepth);
    }

    getDepth(root);
    return maxDiameter;
}

// ============================= 4. 树的构造算法 =============================

/**
 * 从前序和中序遍历序列构造二叉树
 *
 * 核心思想：
 * - 前序遍历：根 -> 左 -> 右，第一个元素是根节点
 * - 中序遍历：左 -> 根 -> 右，根节点分割左右子树
 * 递归构造：确定根节点后，递归构造左右子树
 *
 * @param {number[]} preorder - 前序遍历序列
 * @param {number[]} inorder - 中序遍历序列
 * @returns {TreeNode} 构造的二叉树根节点
 * @time O(n) - 每个节点处理一次
 * @space O(n) - 递归栈和哈希表空间
 */
function buildTree(preorder, inorder) {
    if (preorder.length === 0) return null;

    // 构建中序遍历的值到索引的映射，加速查找
    const inorderMap = new Map();
    for (let i = 0; i < inorder.length; i++) {
        inorderMap.set(inorder[i], i);
    }

    let preorderIndex = 0;

    function build(inorderStart, inorderEnd) {
        if (inorderStart > inorderEnd) return null;

        // 前序遍历的下一个元素是当前子树的根节点
        const rootVal = preorder[preorderIndex++];
        const root = new TreeNode(rootVal);

        // 在中序遍历中找到根节点位置
        const rootIndex = inorderMap.get(rootVal);

        // 递归构造左子树（在根节点左边的部分）
        root.left = build(inorderStart, rootIndex - 1);
        // 递归构造右子树（在根节点右边的部分）
        root.right = build(rootIndex + 1, inorderEnd);

        return root;
    }

    return build(0, inorder.length - 1);
}

/**
 * 从中序和后序遍历序列构造二叉树
 *
 * 核心思想：
 * - 后序遍历：左 -> 右 -> 根，最后一个元素是根节点
 * - 中序遍历：左 -> 根 -> 右，根节点分割左右子树
 *
 * @param {number[]} inorder - 中序遍历序列
 * @param {number[]} postorder - 后序遍历序列
 * @returns {TreeNode} 构造的二叉树根节点
 * @time O(n) - 每个节点处理一次
 * @space O(n) - 递归栈和哈希表空间
 */
function buildTreeFromInorderPostorder(inorder, postorder) {
    if (inorder.length === 0) return null;

    const inorderMap = new Map();
    for (let i = 0; i < inorder.length; i++) {
        inorderMap.set(inorder[i], i);
    }

    let postorderIndex = postorder.length - 1;

    function build(inorderStart, inorderEnd) {
        if (inorderStart > inorderEnd) return null;

        // 后序遍历的当前元素是当前子树的根节点
        const rootVal = postorder[postorderIndex--];
        const root = new TreeNode(rootVal);

        const rootIndex = inorderMap.get(rootVal);

        // 注意：先构造右子树，再构造左子树（因为后序遍历从后往前）
        root.right = build(rootIndex + 1, inorderEnd);
        root.left = build(inorderStart, rootIndex - 1);

        return root;
    }

    return build(0, inorder.length - 1);
}

/**
 * 最大二叉树
 *
 * 核心思想：
 * 给定数组，构造最大二叉树：
 * - 根节点是数组中的最大值
 * - 左子树是最大值左边部分构造的最大二叉树
 * - 右子树是最大值右边部分构造的最大二叉树
 *
 * @param {number[]} nums - 输入数组
 * @returns {TreeNode} 最大二叉树的根节点
 * @time O(n²) - 最坏情况下每次都要查找最大值
 * @space O(n) - 递归栈空间
 */
function constructMaximumBinaryTree(nums) {
    if (nums.length === 0) return null;

    // 找到最大值的索引
    let maxIndex = 0;
    for (let i = 1; i < nums.length; i++) {
        if (nums[i] > nums[maxIndex]) {
            maxIndex = i;
        }
    }

    // 创建根节点
    const root = new TreeNode(nums[maxIndex]);

    // 递归构造左右子树
    root.left = constructMaximumBinaryTree(nums.slice(0, maxIndex));
    root.right = constructMaximumBinaryTree(nums.slice(maxIndex + 1));

    return root;
}

// ============================= 5. 树的修改算法 =============================

/**
 * 翻转二叉树
 *
 * 核心思想：
 * 递归地交换每个节点的左右子树
 * 可以自顶向下或自底向上进行
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {TreeNode} 翻转后的二叉树根节点
 * @time O(n) - 访问每个节点一次
 * @space O(h) - 递归栈空间
 */
function invertTree(root) {
    if (!root) return null;

    // 交换左右子树
    [root.left, root.right] = [root.right, root.left];

    // 递归翻转左右子树
    invertTree(root.left);
    invertTree(root.right);

    return root;
}

/**
 * 合并二叉树
 *
 * 核心思想：
 * 同时遍历两棵树，对应位置的节点值相加
 * 如果一个节点为空，使用另一个节点
 *
 * @param {TreeNode} root1 - 第一棵树的根节点
 * @param {TreeNode} root2 - 第二棵树的根节点
 * @returns {TreeNode} 合并后的树的根节点
 * @time O(min(m,n)) - m和n分别是两棵树的节点数
 * @space O(min(m,n)) - 递归栈空间
 */
function mergeTrees(root1, root2) {
    // 如果其中一个为空，返回另一个
    if (!root1) return root2;
    if (!root2) return root1;

    // 创建新节点，值为两个节点值之和
    const merged = new TreeNode(root1.val + root2.val);

    // 递归合并左右子树
    merged.left = mergeTrees(root1.left, root2.left);
    merged.right = mergeTrees(root1.right, root2.right);

    return merged;
}

/**
 * 二叉树剪枝
 *
 * 核心思想：
 * 移除所有不包含1的子树（假设树中只有0和1）
 * 使用后序遍历，先处理子树，再判断当前节点
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {TreeNode} 剪枝后的树根节点
 * @time O(n) - 访问每个节点一次
 * @space O(h) - 递归栈空间
 */
function pruneTree(root) {
    if (!root) return null;

    // 递归剪枝左右子树
    root.left = pruneTree(root.left);
    root.right = pruneTree(root.right);

    // 如果当前节点值为0且没有子树，则剪掉
    if (root.val === 0 && !root.left && !root.right) {
        return null;
    }

    return root;
}

// ============================= 6. 树的属性计算算法 =============================

/**
 * 计算二叉树的最大深度
 *
 * 核心思想：
 * 递归计算左右子树的最大深度，取最大值加1
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number} 树的最大深度
 * @time O(n) - 访问每个节点一次
 * @space O(h) - 递归栈空间
 */
function maxDepth(root) {
    if (!root) return 0;

    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

/**
 * 计算二叉树的最小深度
 *
 * 核心思想：
 * 最小深度是从根节点到最近叶子节点的最短路径长度
 * 注意：如果一个节点只有一个子节点，不能算作叶子节点
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number} 树的最小深度
 * @time O(n) - 最坏情况下访问所有节点
 * @space O(h) - 递归栈空间
 */
function minDepth(root) {
    if (!root) return 0;

    // 如果是叶子节点
    if (!root.left && !root.right) return 1;

    // 如果只有右子树
    if (!root.left) return 1 + minDepth(root.right);

    // 如果只有左子树
    if (!root.right) return 1 + minDepth(root.left);

    // 如果有左右子树，取最小值
    return 1 + Math.min(minDepth(root.left), minDepth(root.right));
}

/**
 * 判断是否为平衡二叉树
 *
 * 核心思想：
 * 平衡二叉树的每个节点的左右子树高度差不超过1
 * 使用后序遍历，同时计算高度和检查平衡性
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {boolean} 是否为平衡二叉树
 * @time O(n) - 访问每个节点一次
 * @space O(h) - 递归栈空间
 */
function isBalanced(root) {
    function checkBalance(node) {
        if (!node) return { balanced: true, height: 0 };

        const left = checkBalance(node.left);
        const right = checkBalance(node.right);

        const balanced = left.balanced &&
                        right.balanced &&
                        Math.abs(left.height - right.height) <= 1;

        const height = 1 + Math.max(left.height, right.height);

        return { balanced, height };
    }

    return checkBalance(root).balanced;
}

/**
 * 判断是否为对称二叉树
 *
 * 核心思想：
 * 对称二叉树的左右子树互为镜像
 * 递归比较左子树的左节点与右子树的右节点，左子树的右节点与右子树的左节点
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {boolean} 是否为对称二叉树
 * @time O(n) - 访问每个节点一次
 * @space O(h) - 递归栈空间
 */
function isSymmetric(root) {
    if (!root) return true;

    function isMirror(left, right) {
        // 都为空，对称
        if (!left && !right) return true;

        // 一个为空，不对称
        if (!left || !right) return false;

        // 值不同，不对称
        if (left.val !== right.val) return false;

        // 递归检查子树的镜像关系
        return isMirror(left.left, right.right) &&
               isMirror(left.right, right.left);
    }

    return isMirror(root.left, root.right);
}

/**
 * 判断是否为相同的树
 *
 * 核心思想：
 * 两棵树相同当且仅当它们的结构相同且对应节点的值相同
 * 递归比较对应位置的节点
 *
 * @param {TreeNode} p - 第一棵树的根节点
 * @param {TreeNode} q - 第二棵树的根节点
 * @returns {boolean} 两棵树是否相同
 * @time O(min(m,n)) - m和n分别是两棵树的节点数
 * @space O(min(m,n)) - 递归栈空间
 */
function isSameTree(p, q) {
    // 都为空，相同
    if (!p && !q) return true;

    // 一个为空，不同
    if (!p || !q) return false;

    // 值不同，不同
    if (p.val !== q.val) return false;

    // 递归比较左右子树
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

// ============================= 7. 测试用例 =============================

/**
 * 创建测试用的二叉树
 */
function createTestTree() {
    // 创建树结构:
    //       3
    //      / \
    //     9   20
    //        /  \
    //       15   7

    const root = new TreeNode(3);
    root.left = new TreeNode(9);
    root.right = new TreeNode(20);
    root.right.left = new TreeNode(15);
    root.right.right = new TreeNode(7);

    return root;
}

/**
 * 创建路径测试树
 */
function createPathTestTree() {
    // 创建树结构:
    //       5
    //      / \
    //     4   8
    //    /   / \
    //   11  13  4
    //  / \      \
    // 7   2      1

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
 * 测试遍历算法
 */
function testTraversals() {
    console.log("=== 测试遍历算法 ===");
    const root = createTestTree();

    console.log("前序遍历（递归）:", preorderTraversal(root));
    console.log("前序遍历（迭代）:", preorderTraversalIterative(root));
    console.log("中序遍历（递归）:", inorderTraversal(root));
    console.log("中序遍历（迭代）:", inorderTraversalIterative(root));
    console.log("后序遍历（递归）:", postorderTraversal(root));
    console.log("层序遍历:", levelOrder(root));
    console.log("锯齿形层序遍历:", zigzagLevelOrder(root));
}

/**
 * 测试路径算法
 */
function testPathAlgorithms() {
    console.log("\n=== 测试路径算法 ===");
    const root = createPathTestTree();

    console.log("是否存在路径和为22:", hasPathSum(root, 22));
    console.log("所有路径和为22的路径:", pathSum(root, 22));
    console.log("路径总和III (目标值8):", pathSumIII(root, 8));
    console.log("最大路径和:", maxPathSum(root));
    console.log("二叉树直径:", diameterOfBinaryTree(root));
}

/**
 * 测试构造算法
 */
function testConstructionAlgorithms() {
    console.log("\n=== 测试构造算法 ===");

    const preorder = [3, 9, 20, 15, 7];
    const inorder = [9, 3, 15, 20, 7];
    const constructed = buildTree(preorder, inorder);
    console.log("从前序和中序构造的树的层序遍历:", levelOrder(constructed));

    const nums = [3, 2, 1, 6, 0, 5];
    const maxTree = constructMaximumBinaryTree(nums);
    console.log("最大二叉树的层序遍历:", levelOrder(maxTree));
}

/**
 * 测试修改算法
 */
function testModificationAlgorithms() {
    console.log("\n=== 测试修改算法 ===");

    const root1 = createTestTree();
    const inverted = invertTree(root1);
    console.log("翻转后的树的层序遍历:", levelOrder(inverted));

    // 创建两棵树进行合并测试
    const tree1 = new TreeNode(1, new TreeNode(3, new TreeNode(5)), new TreeNode(2));
    const tree2 = new TreeNode(2, new TreeNode(1, null, new TreeNode(4)), new TreeNode(3, null, new TreeNode(7)));
    const merged = mergeTrees(tree1, tree2);
    console.log("合并后的树的层序遍历:", levelOrder(merged));
}

/**
 * 测试属性计算算法
 */
function testPropertyAlgorithms() {
    console.log("\n=== 测试属性算法 ===");
    const root = createTestTree();

    console.log("最大深度:", maxDepth(root));
    console.log("最小深度:", minDepth(root));
    console.log("是否平衡:", isBalanced(root));
    console.log("是否对称:", isSymmetric(root));

    // 创建对称树测试
    const symmetricTree = new TreeNode(1,
        new TreeNode(2, new TreeNode(3), new TreeNode(4)),
        new TreeNode(2, new TreeNode(4), new TreeNode(3))
    );
    console.log("对称树测试:", isSymmetric(symmetricTree));
}

/**
 * 运行所有测试
 */
function runAllAlgorithmTests() {
    console.log("二叉树算法实现测试开始...\n");

    testTraversals();
    testPathAlgorithms();
    testConstructionAlgorithms();
    testModificationAlgorithms();
    testPropertyAlgorithms();

    console.log("\n所有算法测试完成！");
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TreeNode,
        preorderTraversal,
        preorderTraversalIterative,
        inorderTraversal,
        inorderTraversalIterative,
        postorderTraversal,
        levelOrder,
        zigzagLevelOrder,
        hasPathSum,
        pathSum,
        pathSumIII,
        maxPathSum,
        diameterOfBinaryTree,
        buildTree,
        buildTreeFromInorderPostorder,
        constructMaximumBinaryTree,
        invertTree,
        mergeTrees,
        pruneTree,
        maxDepth,
        minDepth,
        isBalanced,
        isSymmetric,
        isSameTree,
        runAllAlgorithmTests
    };
}

// 自动运行测试（如果直接执行此文件）
if (typeof require !== 'undefined' && require.main === module) {
    runAllAlgorithmTests();
}