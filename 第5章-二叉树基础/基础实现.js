/**
 * 第5章：二叉树基础 - 基础实现
 *
 * 本文件包含：
 * 1. 二叉树节点类的完整实现
 * 2. 所有遍历方法的实现（递归和迭代版本）
 * 3. 二叉树的常用操作和属性计算
 * 4. 性能测试和使用示例
 *
 * 作者：数据结构与算法教程
 * 日期：2024年
 */

// ============================= 1. 二叉树节点类 =============================

/**
 * 二叉树节点类
 *
 * 核心思想：
 * 二叉树的基本构建单元，每个节点包含数据域和两个指针域
 * 支持动态构建和修改树结构
 *
 * @class TreeNode
 */
class TreeNode {
    /**
     * 创建二叉树节点
     * @param {*} val - 节点值
     * @param {TreeNode} left - 左子节点
     * @param {TreeNode} right - 右子节点
     */
    constructor(val = 0, left = null, right = null) {
        this.val = val;        // 节点存储的值
        this.left = left;      // 左子树指针
        this.right = right;    // 右子树指针
    }

    /**
     * 判断是否为叶子节点
     * @returns {boolean} 是否为叶子节点
     */
    isLeaf() {
        return this.left === null && this.right === null;
    }

    /**
     * 获取子节点数量
     * @returns {number} 子节点数量
     */
    getChildrenCount() {
        let count = 0;
        if (this.left) count++;
        if (this.right) count++;
        return count;
    }

    /**
     * 设置左子节点
     * @param {TreeNode} node - 左子节点
     */
    setLeft(node) {
        this.left = node;
    }

    /**
     * 设置右子节点
     * @param {TreeNode} node - 右子节点
     */
    setRight(node) {
        this.right = node;
    }

    /**
     * 节点的字符串表示
     * @returns {string} 节点的字符串形式
     */
    toString() {
        return `TreeNode(${this.val})`;
    }
}

// ============================= 2. 二叉树类 =============================

/**
 * 二叉树类
 *
 * 核心思想：
 * 封装二叉树的所有操作，提供统一的接口
 * 包含遍历、查找、修改、统计等功能
 *
 * @class BinaryTree
 */
class BinaryTree {
    /**
     * 创建二叉树
     * @param {TreeNode} root - 根节点
     */
    constructor(root = null) {
        this.root = root;
    }

    /**
     * 判断树是否为空
     * @returns {boolean} 是否为空树
     */
    isEmpty() {
        return this.root === null;
    }

    /**
     * 设置根节点
     * @param {TreeNode} root - 新的根节点
     */
    setRoot(root) {
        this.root = root;
    }

    /**
     * 获取根节点
     * @returns {TreeNode} 根节点
     */
    getRoot() {
        return this.root;
    }

    // ==================== 遍历方法 ====================

    /**
     * 前序遍历（递归版本）
     *
     * 核心思想：
     * 根 -> 左 -> 右的访问顺序
     * 先访问根节点，再递归访问左右子树
     *
     * @param {function} callback - 访问节点时的回调函数
     * @returns {array} 遍历结果数组
     * @time O(n) - 访问每个节点一次
     * @space O(h) - 递归栈空间，h为树高
     */
    preorderTraversalRecursive(callback = null) {
        const result = [];

        function traverse(node) {
            if (!node) return;

            // 访问根节点
            if (callback) callback(node.val);
            result.push(node.val);

            // 递归遍历左子树
            traverse(node.left);
            // 递归遍历右子树
            traverse(node.right);
        }

        traverse(this.root);
        return result;
    }

    /**
     * 前序遍历（迭代版本）
     *
     * 核心思想：
     * 使用栈模拟递归过程
     * 先将右子树入栈，再将左子树入栈，保证左子树先被访问
     *
     * @param {function} callback - 访问节点时的回调函数
     * @returns {array} 遍历结果数组
     * @time O(n) - 访问每个节点一次
     * @space O(h) - 栈空间
     */
    preorderTraversalIterative(callback = null) {
        if (!this.root) return [];

        const result = [];
        const stack = [this.root];

        while (stack.length > 0) {
            const node = stack.pop();

            // 访问当前节点
            if (callback) callback(node.val);
            result.push(node.val);

            // 先右子树入栈，再左子树入栈（保证左子树先被处理）
            if (node.right) stack.push(node.right);
            if (node.left) stack.push(node.left);
        }

        return result;
    }

    /**
     * 中序遍历（递归版本）
     *
     * 核心思想：
     * 左 -> 根 -> 右的访问顺序
     * 对于二叉搜索树，中序遍历得到有序序列
     *
     * @param {function} callback - 访问节点时的回调函数
     * @returns {array} 遍历结果数组
     * @time O(n) - 访问每个节点一次
     * @space O(h) - 递归栈空间
     */
    inorderTraversalRecursive(callback = null) {
        const result = [];

        function traverse(node) {
            if (!node) return;

            // 递归遍历左子树
            traverse(node.left);

            // 访问根节点
            if (callback) callback(node.val);
            result.push(node.val);

            // 递归遍历右子树
            traverse(node.right);
        }

        traverse(this.root);
        return result;
    }

    /**
     * 中序遍历（迭代版本）
     *
     * 核心思想：
     * 使用栈，先将所有左子树节点入栈
     * 然后依次出栈访问，并处理右子树
     *
     * @param {function} callback - 访问节点时的回调函数
     * @returns {array} 遍历结果数组
     * @time O(n) - 访问每个节点一次
     * @space O(h) - 栈空间
     */
    inorderTraversalIterative(callback = null) {
        const result = [];
        const stack = [];
        let current = this.root;

        while (current || stack.length > 0) {
            // 将所有左子树节点入栈
            while (current) {
                stack.push(current);
                current = current.left;
            }

            // 出栈并访问节点
            current = stack.pop();
            if (callback) callback(current.val);
            result.push(current.val);

            // 转向右子树
            current = current.right;
        }

        return result;
    }

    /**
     * 后序遍历（递归版本）
     *
     * 核心思想：
     * 左 -> 右 -> 根的访问顺序
     * 先处理子树，再处理当前节点，自底向上
     *
     * @param {function} callback - 访问节点时的回调函数
     * @returns {array} 遍历结果数组
     * @time O(n) - 访问每个节点一次
     * @space O(h) - 递归栈空间
     */
    postorderTraversalRecursive(callback = null) {
        const result = [];

        function traverse(node) {
            if (!node) return;

            // 递归遍历左子树
            traverse(node.left);
            // 递归遍历右子树
            traverse(node.right);

            // 访问根节点
            if (callback) callback(node.val);
            result.push(node.val);
        }

        traverse(this.root);
        return result;
    }

    /**
     * 后序遍历（迭代版本）
     *
     * 核心思想：
     * 使用两个栈，或者使用一个栈配合访问标记
     * 这里使用修改的前序遍历思想（根->右->左）然后反转结果
     *
     * @param {function} callback - 访问节点时的回调函数
     * @returns {array} 遍历结果数组
     * @time O(n) - 访问每个节点一次
     * @space O(h) - 栈空间
     */
    postorderTraversalIterative(callback = null) {
        if (!this.root) return [];

        const result = [];
        const stack = [this.root];

        while (stack.length > 0) {
            const node = stack.pop();
            result.unshift(node.val);  // 头插法

            // 先左子树入栈，再右子树入栈
            if (node.left) stack.push(node.left);
            if (node.right) stack.push(node.right);
        }

        // 执行回调
        if (callback) {
            result.forEach(val => callback(val));
        }

        return result;
    }

    /**
     * 层序遍历
     *
     * 核心思想：
     * 使用队列进行广度优先搜索
     * 逐层访问节点，适合解决层次相关问题
     *
     * @param {function} callback - 访问节点时的回调函数
     * @returns {array} 层序遍历结果，每层一个数组
     * @time O(n) - 访问每个节点一次
     * @space O(w) - w为树的最大宽度
     */
    levelOrderTraversal(callback = null) {
        if (!this.root) return [];

        const result = [];
        const queue = [this.root];

        while (queue.length > 0) {
            const levelSize = queue.length;
            const currentLevel = [];

            // 处理当前层的所有节点
            for (let i = 0; i < levelSize; i++) {
                const node = queue.shift();

                if (callback) callback(node.val);
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
     * 锯齿形层序遍历
     *
     * 核心思想：
     * 奇数层从左到右，偶数层从右到左
     * 使用布尔标志控制插入方向
     *
     * @returns {array} 锯齿形层序遍历结果
     * @time O(n) - 访问每个节点一次
     * @space O(w) - w为树的最大宽度
     */
    zigzagLevelOrder() {
        if (!this.root) return [];

        const result = [];
        const queue = [this.root];
        let leftToRight = true;

        while (queue.length > 0) {
            const levelSize = queue.length;
            const currentLevel = [];

            for (let i = 0; i < levelSize; i++) {
                const node = queue.shift();

                // 根据方向决定插入位置
                if (leftToRight) {
                    currentLevel.push(node.val);
                } else {
                    currentLevel.unshift(node.val);
                }

                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);
            }

            result.push(currentLevel);
            leftToRight = !leftToRight;
        }

        return result;
    }

    // ==================== 树的属性和统计 ====================

    /**
     * 计算树的高度（深度）
     *
     * 核心思想：
     * 递归计算左右子树的高度，取最大值加1
     * 空树的高度为0
     *
     * @param {TreeNode} node - 起始节点，默认为根节点
     * @returns {number} 树的高度
     * @time O(n) - 访问每个节点一次
     * @space O(h) - 递归栈空间
     */
    getHeight(node = this.root) {
        if (!node) return 0;

        const leftHeight = this.getHeight(node.left);
        const rightHeight = this.getHeight(node.right);

        return 1 + Math.max(leftHeight, rightHeight);
    }

    /**
     * 计算节点总数
     *
     * 核心思想：
     * 递归计算左右子树的节点数，相加后加1（当前节点）
     *
     * @param {TreeNode} node - 起始节点，默认为根节点
     * @returns {number} 节点总数
     * @time O(n) - 访问每个节点一次
     * @space O(h) - 递归栈空间
     */
    getNodeCount(node = this.root) {
        if (!node) return 0;

        return 1 + this.getNodeCount(node.left) + this.getNodeCount(node.right);
    }

    /**
     * 计算叶子节点数
     *
     * 核心思想：
     * 递归统计没有子节点的节点数量
     *
     * @param {TreeNode} node - 起始节点，默认为根节点
     * @returns {number} 叶子节点数
     * @time O(n) - 访问每个节点一次
     * @space O(h) - 递归栈空间
     */
    getLeafCount(node = this.root) {
        if (!node) return 0;

        // 叶子节点
        if (!node.left && !node.right) return 1;

        return this.getLeafCount(node.left) + this.getLeafCount(node.right);
    }

    /**
     * 计算树的最大宽度
     *
     * 核心思想：
     * 使用层序遍历，记录每层的节点数，取最大值
     *
     * @returns {number} 树的最大宽度
     * @time O(n) - 访问每个节点一次
     * @space O(w) - w为树的最大宽度
     */
    getMaxWidth() {
        if (!this.root) return 0;

        let maxWidth = 0;
        const queue = [this.root];

        while (queue.length > 0) {
            const levelSize = queue.length;
            maxWidth = Math.max(maxWidth, levelSize);

            // 处理当前层的所有节点
            for (let i = 0; i < levelSize; i++) {
                const node = queue.shift();

                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);
            }
        }

        return maxWidth;
    }

    /**
     * 判断是否为满二叉树
     *
     * 核心思想：
     * 满二叉树的每个非叶子节点都有两个子节点
     * 递归检查每个节点的子节点情况
     *
     * @param {TreeNode} node - 起始节点，默认为根节点
     * @returns {boolean} 是否为满二叉树
     * @time O(n) - 最坏情况下访问所有节点
     * @space O(h) - 递归栈空间
     */
    isFullTree(node = this.root) {
        if (!node) return true;

        // 叶子节点
        if (!node.left && !node.right) return true;

        // 必须有两个子节点
        if (node.left && node.right) {
            return this.isFullTree(node.left) && this.isFullTree(node.right);
        }

        return false;
    }

    /**
     * 判断是否为完全二叉树
     *
     * 核心思想：
     * 完全二叉树除了最后一层，其他层都是满的
     * 最后一层的节点都集中在左边
     * 使用层序遍历，一旦遇到空节点，后面不能再有非空节点
     *
     * @returns {boolean} 是否为完全二叉树
     * @time O(n) - 访问每个节点一次
     * @space O(w) - w为树的最大宽度
     */
    isCompleteTree() {
        if (!this.root) return true;

        const queue = [this.root];
        let foundNull = false;

        while (queue.length > 0) {
            const node = queue.shift();

            if (!node) {
                foundNull = true;
            } else {
                // 如果之前遇到过空节点，现在又有非空节点，则不是完全二叉树
                if (foundNull) return false;

                queue.push(node.left);
                queue.push(node.right);
            }
        }

        return true;
    }

    /**
     * 判断是否为平衡二叉树
     *
     * 核心思想：
     * 平衡二叉树的每个节点的左右子树高度差不超过1
     * 递归检查每个节点的平衡性
     *
     * @returns {boolean} 是否为平衡二叉树
     * @time O(n) - 访问每个节点一次
     * @space O(h) - 递归栈空间
     */
    isBalanced() {
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

        return checkBalance(this.root).balanced;
    }

    // ==================== 查找和修改操作 ====================

    /**
     * 查找节点
     *
     * 核心思想：
     * 使用递归遍历查找指定值的节点
     * 找到第一个匹配的节点就返回
     *
     * @param {*} value - 要查找的值
     * @param {TreeNode} node - 起始节点，默认为根节点
     * @returns {TreeNode|null} 找到的节点或null
     * @time O(n) - 最坏情况下访问所有节点
     * @space O(h) - 递归栈空间
     */
    findNode(value, node = this.root) {
        if (!node) return null;

        if (node.val === value) return node;

        // 在左子树中查找
        const leftResult = this.findNode(value, node.left);
        if (leftResult) return leftResult;

        // 在右子树中查找
        return this.findNode(value, node.right);
    }

    /**
     * 查找所有匹配的节点
     *
     * 核心思想：
     * 遍历整个树，收集所有值匹配的节点
     *
     * @param {*} value - 要查找的值
     * @returns {TreeNode[]} 所有匹配的节点数组
     * @time O(n) - 访问每个节点一次
     * @space O(n) - 存储结果和递归栈空间
     */
    findAllNodes(value) {
        const result = [];

        function search(node) {
            if (!node) return;

            if (node.val === value) {
                result.push(node);
            }

            search(node.left);
            search(node.right);
        }

        search(this.root);
        return result;
    }

    /**
     * 查找节点的父节点
     *
     * 核心思想：
     * 递归遍历，检查每个节点的子节点是否为目标节点
     *
     * @param {*} value - 要查找的节点值
     * @param {TreeNode} node - 起始节点，默认为根节点
     * @returns {TreeNode|null} 父节点或null
     * @time O(n) - 最坏情况下访问所有节点
     * @space O(h) - 递归栈空间
     */
    findParent(value, node = this.root) {
        if (!node || (!node.left && !node.right)) return null;

        // 检查直接子节点
        if ((node.left && node.left.val === value) ||
            (node.right && node.right.val === value)) {
            return node;
        }

        // 在左右子树中递归查找
        const leftResult = this.findParent(value, node.left);
        if (leftResult) return leftResult;

        return this.findParent(value, node.right);
    }

    // ==================== 工具方法 ====================

    /**
     * 树的可视化打印
     *
     * 核心思想：
     * 使用递归生成树的ASCII艺术表示
     * 简化版本，适合小型树的调试
     *
     * @returns {string} 树的可视化字符串
     */
    printTree() {
        if (!this.root) return "Empty tree";

        const lines = [];

        function buildLines(node, prefix = "", isLast = true) {
            if (!node) return;

            lines.push(prefix + (isLast ? "└── " : "├── ") + node.val);

            const children = [node.left, node.right].filter(child => child !== null);

            children.forEach((child, index) => {
                const isLastChild = index === children.length - 1;
                const extension = isLast ? "    " : "│   ";

                if (child === node.left && node.right) {
                    buildLines(child, prefix + extension, false);
                } else {
                    buildLines(child, prefix + extension, isLastChild);
                }
            });
        }

        buildLines(this.root);
        return lines.join("\n");
    }

    /**
     * 获取树的基本信息
     *
     * @returns {object} 包含树的各种统计信息
     */
    getTreeInfo() {
        return {
            height: this.getHeight(),
            nodeCount: this.getNodeCount(),
            leafCount: this.getLeafCount(),
            maxWidth: this.getMaxWidth(),
            isEmpty: this.isEmpty(),
            isFullTree: this.isFullTree(),
            isCompleteTree: this.isCompleteTree(),
            isBalanced: this.isBalanced()
        };
    }

    /**
     * 树的序列化（前序遍历方式）
     *
     * 核心思想：
     * 使用前序遍历将树转换为字符串
     * 空节点用特殊标记表示
     *
     * @returns {string} 序列化后的字符串
     * @time O(n) - 访问每个节点一次
     * @space O(n) - 存储序列化结果
     */
    serialize() {
        const result = [];

        function preorder(node) {
            if (!node) {
                result.push('null');
                return;
            }

            result.push(node.val.toString());
            preorder(node.left);
            preorder(node.right);
        }

        preorder(this.root);
        return result.join(',');
    }

    /**
     * 从序列化字符串反序列化
     *
     * 核心思想：
     * 使用前序遍历的顺序重建树
     * 遇到null标记时返回空节点
     *
     * @param {string} data - 序列化的字符串
     * @returns {BinaryTree} 反序列化后的树
     * @time O(n) - 访问每个节点一次
     * @space O(n) - 存储反序列化结果和递归栈
     */
    static deserialize(data) {
        const values = data.split(',');
        let index = 0;

        function buildTree() {
            if (index >= values.length || values[index] === 'null') {
                index++;
                return null;
            }

            const node = new TreeNode(parseInt(values[index]));
            index++;

            node.left = buildTree();
            node.right = buildTree();

            return node;
        }

        const root = buildTree();
        return new BinaryTree(root);
    }
}

// ============================= 3. 测试和使用示例 =============================

/**
 * 创建测试用的二叉树
 */
function createTestTree() {
    // 创建树结构:
    //       1
    //      / \
    //     2   3
    //    / \   \
    //   4   5   6
    //  /
    // 7

    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(4);
    root.left.right = new TreeNode(5);
    root.right.right = new TreeNode(6);
    root.left.left.left = new TreeNode(7);

    return new BinaryTree(root);
}

/**
 * 创建完全二叉树
 */
function createCompleteTree() {
    // 创建完全二叉树:
    //       1
    //      / \
    //     2   3
    //    / \ /
    //   4  5 6

    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(4);
    root.left.right = new TreeNode(5);
    root.right.left = new TreeNode(6);

    return new BinaryTree(root);
}

/**
 * 测试遍历方法
 */
function testTraversals() {
    console.log("=== 遍历方法测试 ===");
    const tree = createTestTree();

    console.log("树结构:");
    console.log(tree.printTree());

    console.log("\n前序遍历（递归）:", tree.preorderTraversalRecursive());
    console.log("前序遍历（迭代）:", tree.preorderTraversalIterative());

    console.log("中序遍历（递归）:", tree.inorderTraversalRecursive());
    console.log("中序遍历（迭代）:", tree.inorderTraversalIterative());

    console.log("后序遍历（递归）:", tree.postorderTraversalRecursive());
    console.log("后序遍历（迭代）:", tree.postorderTraversalIterative());

    console.log("层序遍历:", tree.levelOrderTraversal());
    console.log("锯齿形层序遍历:", tree.zigzagLevelOrder());
}

/**
 * 测试树的属性
 */
function testTreeProperties() {
    console.log("\n=== 树的属性测试 ===");
    const tree = createTestTree();
    const completeTree = createCompleteTree();

    console.log("测试树的信息:", tree.getTreeInfo());
    console.log("完全二叉树的信息:", completeTree.getTreeInfo());
}

/**
 * 测试查找操作
 */
function testSearch() {
    console.log("\n=== 查找操作测试 ===");
    const tree = createTestTree();

    const node5 = tree.findNode(5);
    console.log("查找节点5:", node5 ? node5.val : "未找到");

    const parent5 = tree.findParent(5);
    console.log("节点5的父节点:", parent5 ? parent5.val : "未找到");

    const allNodes2 = tree.findAllNodes(2);
    console.log("所有值为2的节点:", allNodes2.map(n => n.val));
}

/**
 * 测试序列化和反序列化
 */
function testSerialization() {
    console.log("\n=== 序列化测试 ===");
    const tree = createTestTree();

    const serialized = tree.serialize();
    console.log("序列化结果:", serialized);

    const deserialized = BinaryTree.deserialize(serialized);
    console.log("反序列化后的前序遍历:", deserialized.preorderTraversalRecursive());
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    // 创建大型随机二叉树
    function createRandomTree(nodeCount) {
        if (nodeCount === 0) return new BinaryTree();

        const nodes = Array.from({length: nodeCount}, (_, i) => new TreeNode(i + 1));
        const root = nodes[0];

        for (let i = 1; i < nodeCount; i++) {
            let parentIndex = Math.floor(Math.random() * i);
            const parent = nodes[parentIndex];

            if (!parent.left) {
                parent.left = nodes[i];
            } else if (!parent.right) {
                parent.right = nodes[i];
            } else {
                // 随机选择一个没有子节点的节点
                let attempts = 0;
                while (attempts < 100) {
                    parentIndex = Math.floor(Math.random() * i);
                    const newParent = nodes[parentIndex];
                    if (!newParent.left) {
                        newParent.left = nodes[i];
                        break;
                    } else if (!newParent.right) {
                        newParent.right = nodes[i];
                        break;
                    }
                    attempts++;
                }
            }
        }

        return new BinaryTree(root);
    }

    const sizes = [100, 1000, 5000];

    sizes.forEach(size => {
        console.log(`\n测试规模: ${size} 个节点`);
        const tree = createRandomTree(size);

        // 测试遍历性能
        const startTime = performance.now();
        tree.preorderTraversalRecursive();
        const recursiveTime = performance.now() - startTime;

        const startTime2 = performance.now();
        tree.preorderTraversalIterative();
        const iterativeTime = performance.now() - startTime2;

        console.log(`前序遍历 - 递归: ${recursiveTime.toFixed(2)}ms, 迭代: ${iterativeTime.toFixed(2)}ms`);

        // 测试属性计算性能
        const startTime3 = performance.now();
        const info = tree.getTreeInfo();
        const infoTime = performance.now() - startTime3;

        console.log(`属性计算: ${infoTime.toFixed(2)}ms`);
        console.log(`树高: ${info.height}, 节点数: ${info.nodeCount}, 叶子数: ${info.leafCount}`);
    });
}

/**
 * 运行所有测试
 */
function runAllTests() {
    console.log("二叉树基础实现测试开始...\n");

    testTraversals();
    testTreeProperties();
    testSearch();
    testSerialization();
    performanceTest();

    console.log("\n所有测试完成！");
}

// 如果在Node.js环境中直接运行此文件
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TreeNode,
        BinaryTree,
        createTestTree,
        createCompleteTree,
        runAllTests
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.TreeNode = TreeNode;
    window.BinaryTree = BinaryTree;
    window.runBinaryTreeTests = runAllTests;
}

// 自动运行测试（如果直接执行此文件）
if (typeof require !== 'undefined' && require.main === module) {
    runAllTests();
}