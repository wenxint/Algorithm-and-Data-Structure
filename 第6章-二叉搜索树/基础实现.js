/**
 * 第6章：二叉搜索树 - 基础实现
 *
 * 本文件包含：
 * 1. BST节点类和BST类的完整实现
 * 2. 插入、删除、搜索等基础操作
 * 3. 遍历和统计功能
 * 4. 平衡性检查和转换
 * 5. 完整的测试用例和性能分析
 *
 * 作者：数据结构与算法教程
 * 日期：2024年
 */

// ============================= 1. BST节点类 =============================

/**
 * 二叉搜索树节点类
 *
 * 核心思想：
 * BST节点除了基本的二叉树节点结构外，还需要维护BST的有序性质
 * 左子树的所有值 < 当前节点值 < 右子树的所有值
 *
 * @class TreeNode
 */
class TreeNode {
    /**
     * 创建BST节点
     * @param {*} val - 节点值
     * @param {TreeNode} left - 左子节点
     * @param {TreeNode} right - 右子节点
     */
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
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
     * 节点的字符串表示
     * @returns {string} 节点的字符串形式
     */
    toString() {
        return `TreeNode(${this.val})`;
    }
}

// ============================= 2. 二叉搜索树类 =============================

/**
 * 二叉搜索树类
 *
 * 核心思想：
 * 维护BST的有序性质，提供高效的搜索、插入、删除操作
 * 支持范围查询、统计操作和树的转换
 *
 * @class BinarySearchTree
 */
class BinarySearchTree {
    /**
     * 创建BST
     * @param {TreeNode} root - 根节点
     */
    constructor(root = null) {
        this.root = root;
        this.size = 0;
        if (root) {
            this.size = this.countNodes(root);
        }
    }

    /**
     * 计算节点数量
     * @param {TreeNode} node - 起始节点
     * @returns {number} 节点数量
     */
    countNodes(node) {
        if (!node) return 0;
        return 1 + this.countNodes(node.left) + this.countNodes(node.right);
    }

    /**
     * 判断树是否为空
     * @returns {boolean} 是否为空树
     */
    isEmpty() {
        return this.root === null;
    }

    /**
     * 获取树的大小
     * @returns {number} 节点数量
     */
    getSize() {
        return this.size;
    }

    // ==================== 搜索操作 ====================

    /**
     * 搜索指定值的节点
     *
     * 核心思想：
     * 利用BST的有序性质，每次比较只需搜索一边子树
     * 时间复杂度：平均O(log n)，最坏O(n)
     *
     * @param {*} val - 要搜索的值
     * @param {TreeNode} node - 搜索起始节点，默认为根节点
     * @returns {TreeNode|null} 找到的节点或null
     */
    search(val, node = this.root) {
        // 空节点或找到目标值
        if (!node || node.val === val) {
            return node;
        }

        // 根据BST性质选择搜索方向
        if (val < node.val) {
            return this.search(val, node.left);
        } else {
            return this.search(val, node.right);
        }
    }

    /**
     * 搜索指定值的节点（迭代版本）
     *
     * 核心思想：
     * 使用循环代替递归，减少栈空间使用
     *
     * @param {*} val - 要搜索的值
     * @returns {TreeNode|null} 找到的节点或null
     */
    searchIterative(val) {
        let current = this.root;

        while (current && current.val !== val) {
            if (val < current.val) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        return current;
    }

    /**
     * 查找最小值节点
     *
     * 核心思想：
     * BST的最小值总是在最左边的节点
     *
     * @param {TreeNode} node - 搜索起始节点，默认为根节点
     * @returns {TreeNode|null} 最小值节点
     */
    findMin(node = this.root) {
        if (!node) return null;

        while (node.left) {
            node = node.left;
        }
        return node;
    }

    /**
     * 查找最大值节点
     *
     * 核心思想：
     * BST的最大值总是在最右边的节点
     *
     * @param {TreeNode} node - 搜索起始节点，默认为根节点
     * @returns {TreeNode|null} 最大值节点
     */
    findMax(node = this.root) {
        if (!node) return null;

        while (node.right) {
            node = node.right;
        }
        return node;
    }

    // ==================== 插入操作 ====================

    /**
     * 插入新值
     *
     * 核心思想：
     * 递归地找到正确的插入位置，保持BST性质
     * 如果值已存在，可以选择覆盖或忽略
     *
     * @param {*} val - 要插入的值
     * @param {boolean} allowDuplicate - 是否允许重复值
     * @returns {boolean} 是否成功插入
     */
    insert(val, allowDuplicate = false) {
        const newNode = this.insertHelper(this.root, val, allowDuplicate);
        if (newNode) {
            this.root = newNode;
            return true;
        }
        return false;
    }

    /**
     * 插入操作的递归辅助函数
     *
     * @param {TreeNode} node - 当前节点
     * @param {*} val - 要插入的值
     * @param {boolean} allowDuplicate - 是否允许重复值
     * @returns {TreeNode} 更新后的子树根节点
     */
    insertHelper(node, val, allowDuplicate) {
        // 找到插入位置，创建新节点
        if (!node) {
            this.size++;
            return new TreeNode(val);
        }

        if (val < node.val) {
            node.left = this.insertHelper(node.left, val, allowDuplicate);
        } else if (val > node.val) {
            node.right = this.insertHelper(node.right, val, allowDuplicate);
        } else {
            // 值相等的情况
            if (allowDuplicate) {
                // 允许重复，插入到右子树
                node.right = this.insertHelper(node.right, val, allowDuplicate);
            }
            // 不允许重复，直接返回当前节点
        }

        return node;
    }

    /**
     * 批量插入
     *
     * @param {Array} values - 要插入的值数组
     * @param {boolean} allowDuplicate - 是否允许重复值
     * @returns {number} 成功插入的数量
     */
    insertMany(values, allowDuplicate = false) {
        let count = 0;
        for (const val of values) {
            if (this.insert(val, allowDuplicate)) {
                count++;
            }
        }
        return count;
    }

    // ==================== 删除操作 ====================

    /**
     * 删除指定值的节点
     *
     * 核心思想：
     * 删除操作有三种情况：
     * 1. 叶子节点：直接删除
     * 2. 只有一个子节点：用子节点替换
     * 3. 有两个子节点：用右子树的最小值（或左子树的最大值）替换
     *
     * @param {*} val - 要删除的值
     * @returns {boolean} 是否成功删除
     */
    delete(val) {
        const originalSize = this.size;
        this.root = this.deleteHelper(this.root, val);
        return this.size < originalSize;
    }

    /**
     * 删除操作的递归辅助函数
     *
     * @param {TreeNode} node - 当前节点
     * @param {*} val - 要删除的值
     * @returns {TreeNode} 更新后的子树根节点
     */
    deleteHelper(node, val) {
        if (!node) return null;

        if (val < node.val) {
            node.left = this.deleteHelper(node.left, val);
        } else if (val > node.val) {
            node.right = this.deleteHelper(node.right, val);
        } else {
            // 找到要删除的节点
            this.size--;

            // 情况1：叶子节点
            if (!node.left && !node.right) {
                return null;
            }

            // 情况2：只有一个子节点
            if (!node.left) return node.right;
            if (!node.right) return node.left;

            // 情况3：有两个子节点
            // 找到右子树的最小值节点作为替换节点
            const successor = this.findMin(node.right);
            node.val = successor.val;

            // 删除右子树中的后继节点
            node.right = this.deleteHelper(node.right, successor.val);
            this.size++; // 补偿上面的减1，因为我们只是替换了值
        }

        return node;
    }

    /**
     * 删除最小值节点
     *
     * @returns {*} 被删除的值，如果树为空返回null
     */
    deleteMin() {
        if (!this.root) return null;

        const min = this.findMin().val;
        this.root = this.deleteMinHelper(this.root);
        return min;
    }

    /**
     * 删除最小值节点的辅助函数
     *
     * @param {TreeNode} node - 当前节点
     * @returns {TreeNode} 更新后的子树根节点
     */
    deleteMinHelper(node) {
        if (!node.left) {
            this.size--;
            return node.right;
        }

        node.left = this.deleteMinHelper(node.left);
        return node;
    }

    /**
     * 删除最大值节点
     *
     * @returns {*} 被删除的值，如果树为空返回null
     */
    deleteMax() {
        if (!this.root) return null;

        const max = this.findMax().val;
        this.root = this.deleteMaxHelper(this.root);
        return max;
    }

    /**
     * 删除最大值节点的辅助函数
     *
     * @param {TreeNode} node - 当前节点
     * @returns {TreeNode} 更新后的子树根节点
     */
    deleteMaxHelper(node) {
        if (!node.right) {
            this.size--;
            return node.left;
        }

        node.right = this.deleteMaxHelper(node.right);
        return node;
    }

    // ==================== 遍历操作 ====================

    /**
     * 中序遍历（递归版本）
     *
     * 核心思想：
     * BST的中序遍历结果是有序的
     * 左 -> 根 -> 右的访问顺序
     *
     * @param {function} callback - 访问节点时的回调函数
     * @returns {Array} 遍历结果数组
     */
    inorderTraversal(callback = null) {
        const result = [];

        function traverse(node) {
            if (!node) return;

            traverse(node.left);    // 遍历左子树

            if (callback) callback(node.val);
            result.push(node.val);  // 访问根节点

            traverse(node.right);   // 遍历右子树
        }

        traverse(this.root);
        return result;
    }

    /**
     * 前序遍历
     *
     * @param {function} callback - 访问节点时的回调函数
     * @returns {Array} 遍历结果数组
     */
    preorderTraversal(callback = null) {
        const result = [];

        function traverse(node) {
            if (!node) return;

            if (callback) callback(node.val);
            result.push(node.val);  // 访问根节点
            traverse(node.left);    // 遍历左子树
            traverse(node.right);   // 遍历右子树
        }

        traverse(this.root);
        return result;
    }

    /**
     * 后序遍历
     *
     * @param {function} callback - 访问节点时的回调函数
     * @returns {Array} 遍历结果数组
     */
    postorderTraversal(callback = null) {
        const result = [];

        function traverse(node) {
            if (!node) return;

            traverse(node.left);    // 遍历左子树
            traverse(node.right);   // 遍历右子树

            if (callback) callback(node.val);
            result.push(node.val);  // 访问根节点
        }

        traverse(this.root);
        return result;
    }

    /**
     * 层序遍历
     *
     * @param {function} callback - 访问节点时的回调函数
     * @returns {Array} 层序遍历结果，每层一个数组
     */
    levelOrderTraversal(callback = null) {
        if (!this.root) return [];

        const result = [];
        const queue = [this.root];

        while (queue.length > 0) {
            const levelSize = queue.length;
            const currentLevel = [];

            for (let i = 0; i < levelSize; i++) {
                const node = queue.shift();

                if (callback) callback(node.val);
                currentLevel.push(node.val);

                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);
            }

            result.push(currentLevel);
        }

        return result;
    }

    // ==================== 范围查询和统计 ====================

    /**
     * 范围查询：查找指定范围内的所有值
     *
     * 核心思想：
     * 利用BST的有序性质，只搜索可能包含目标值的子树
     *
     * @param {*} low - 范围下界
     * @param {*} high - 范围上界
     * @param {TreeNode} node - 搜索起始节点
     * @returns {Array} 范围内的所有值
     */
    rangeQuery(low, high, node = this.root) {
        const result = [];

        function search(node) {
            if (!node) return;

            // 如果当前节点值在范围内，加入结果
            if (node.val >= low && node.val <= high) {
                result.push(node.val);
            }

            // 根据BST性质决定是否需要搜索子树
            if (node.val > low) {
                search(node.left);   // 左子树可能有符合条件的值
            }
            if (node.val < high) {
                search(node.right);  // 右子树可能有符合条件的值
            }
        }

        search(node);
        return result.sort((a, b) => a - b); // 返回有序结果
    }

    /**
     * 范围求和：计算指定范围内所有值的和
     *
     * @param {*} low - 范围下界
     * @param {*} high - 范围上界
     * @param {TreeNode} node - 搜索起始节点
     * @returns {number} 范围内所有值的和
     */
    rangeSumBST(low, high, node = this.root) {
        if (!node) return 0;

        let sum = 0;

        // 如果当前节点值在范围内，加入和
        if (node.val >= low && node.val <= high) {
            sum += node.val;
        }

        // 根据BST性质决定是否需要搜索子树
        if (node.val > low) {
            sum += this.rangeSumBST(low, high, node.left);
        }
        if (node.val < high) {
            sum += this.rangeSumBST(low, high, node.right);
        }

        return sum;
    }

    /**
     * 查找第k小的元素
     *
     * 核心思想：
     * 利用BST中序遍历的有序性，找到第k个元素
     *
     * @param {number} k - 第k小（从1开始）
     * @returns {*} 第k小的元素，如果k超出范围返回null
     */
    kthSmallest(k) {
        if (k <= 0 || k > this.size) return null;

        let count = 0;
        let result = null;

        function inorder(node) {
            if (!node || result !== null) return;

            inorder(node.left);

            count++;
            if (count === k) {
                result = node.val;
                return;
            }

            inorder(node.right);
        }

        inorder(this.root);
        return result;
    }

    /**
     * 查找第k大的元素
     *
     * @param {number} k - 第k大（从1开始）
     * @returns {*} 第k大的元素，如果k超出范围返回null
     */
    kthLargest(k) {
        return this.kthSmallest(this.size - k + 1);
    }

    // ==================== 验证和属性检查 ====================

    /**
     * 验证是否为有效的BST
     *
     * 核心思想：
     * 使用上下界约束节点值的范围
     * 递归检查每个节点是否满足BST性质
     *
     * @param {TreeNode} node - 检查起始节点
     * @param {*} min - 最小值边界
     * @param {*} max - 最大值边界
     * @returns {boolean} 是否为有效BST
     */
    isValidBST(node = this.root, min = -Infinity, max = Infinity) {
        if (!node) return true;

        // 检查当前节点值是否在有效范围内
        if (node.val <= min || node.val >= max) {
            return false;
        }

        // 递归检查左右子树，更新边界
        return this.isValidBST(node.left, min, node.val) &&
               this.isValidBST(node.right, node.val, max);
    }

    /**
     * 计算树的高度
     *
     * @param {TreeNode} node - 起始节点
     * @returns {number} 树的高度
     */
    getHeight(node = this.root) {
        if (!node) return 0;

        return 1 + Math.max(
            this.getHeight(node.left),
            this.getHeight(node.right)
        );
    }

    /**
     * 判断是否为平衡BST
     *
     * 核心思想：
     * 平衡BST的任意节点的左右子树高度差不超过1
     *
     * @returns {boolean} 是否为平衡BST
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

    // ==================== 转换和构造 ====================

    /**
     * 转换为有序数组
     *
     * @returns {Array} BST的有序数组表示
     */
    toSortedArray() {
        return this.inorderTraversal();
    }

    /**
     * 从有序数组构造平衡BST
     *
     * 核心思想：
     * 选择中位数作为根节点，递归构造左右子树
     * 保证构造出的BST是平衡的
     *
     * @param {Array} nums - 有序数组
     * @returns {BinarySearchTree} 平衡BST
     */
    static fromSortedArray(nums) {
        if (!nums || nums.length === 0) {
            return new BinarySearchTree();
        }

        function buildBalanced(left, right) {
            if (left > right) return null;

            const mid = Math.floor((left + right) / 2);
            const root = new TreeNode(nums[mid]);

            root.left = buildBalanced(left, mid - 1);
            root.right = buildBalanced(mid + 1, right);

            return root;
        }

        const root = buildBalanced(0, nums.length - 1);
        return new BinarySearchTree(root);
    }

    /**
     * 转换为平衡BST
     *
     * @returns {BinarySearchTree} 平衡后的BST
     */
    toBalanced() {
        const sortedArray = this.toSortedArray();
        return BinarySearchTree.fromSortedArray(sortedArray);
    }

    // ==================== 工具方法 ====================

    /**
     * 清空BST
     */
    clear() {
        this.root = null;
        this.size = 0;
    }

    /**
     * 获取BST的统计信息
     *
     * @returns {Object} 包含各种统计信息的对象
     */
    getStatistics() {
        return {
            size: this.size,
            height: this.getHeight(),
            isEmpty: this.isEmpty(),
            isValid: this.isValidBST(),
            isBalanced: this.isBalanced(),
            min: this.isEmpty() ? null : this.findMin().val,
            max: this.isEmpty() ? null : this.findMax().val
        };
    }

    /**
     * 树的可视化表示
     *
     * @returns {string} 树的ASCII艺术表示
     */
    toString() {
        if (!this.root) return "Empty BST";

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
}

// ============================= 3. BST迭代器 =============================

/**
 * BST迭代器类
 *
 * 核心思想：
 * 使用栈模拟中序遍历，提供O(1)的next操作
 * 只在需要时计算下一个元素，节省空间
 *
 * @class BSTIterator
 */
class BSTIterator {
    /**
     * 创建BST迭代器
     * @param {TreeNode} root - BST根节点
     */
    constructor(root) {
        this.stack = [];
        this.pushAllLeft(root);
    }

    /**
     * 将节点及其所有左子节点入栈
     * @param {TreeNode} node - 起始节点
     */
    pushAllLeft(node) {
        while (node) {
            this.stack.push(node);
            node = node.left;
        }
    }

    /**
     * 获取下一个最小元素
     * @returns {*} 下一个元素的值
     */
    next() {
        if (!this.hasNext()) {
            throw new Error("No more elements");
        }

        const node = this.stack.pop();

        // 如果有右子树，将右子树的左边界入栈
        if (node.right) {
            this.pushAllLeft(node.right);
        }

        return node.val;
    }

    /**
     * 检查是否还有下一个元素
     * @returns {boolean} 是否还有元素
     */
    hasNext() {
        return this.stack.length > 0;
    }

    /**
     * 获取当前迭代器位置的元素（不移动迭代器）
     * @returns {*} 当前元素的值
     */
    peek() {
        if (!this.hasNext()) {
            throw new Error("No more elements");
        }

        return this.stack[this.stack.length - 1].val;
    }
}

// ============================= 4. 测试和使用示例 =============================

/**
 * 创建测试用的BST
 */
function createTestBST() {
    const bst = new BinarySearchTree();
    const values = [50, 30, 70, 20, 40, 60, 80, 10, 25, 35, 45];

    bst.insertMany(values);
    return bst;
}

/**
 * 创建不平衡的BST
 */
function createUnbalancedBST() {
    const bst = new BinarySearchTree();
    const values = [1, 2, 3, 4, 5, 6, 7]; // 插入递增序列会创建右倾斜树

    bst.insertMany(values);
    return bst;
}

/**
 * 测试基础操作
 */
function testBasicOperations() {
    console.log("=== BST基础操作测试 ===");
    const bst = createTestBST();

    console.log("BST结构:");
    console.log(bst.toString());

    console.log("\n基础信息:");
    console.log("大小:", bst.getSize());
    console.log("高度:", bst.getHeight());
    console.log("最小值:", bst.findMin().val);
    console.log("最大值:", bst.findMax().val);

    console.log("\n搜索测试:");
    console.log("搜索35:", bst.search(35) ? "找到" : "未找到");
    console.log("搜索55:", bst.search(55) ? "找到" : "未找到");

    console.log("\n遍历结果:");
    console.log("中序遍历:", bst.inorderTraversal());
    console.log("前序遍历:", bst.preorderTraversal());
    console.log("层序遍历:", bst.levelOrderTraversal());
}

/**
 * 测试删除操作
 */
function testDeleteOperations() {
    console.log("\n=== 删除操作测试 ===");
    const bst = createTestBST();

    console.log("删除前的中序遍历:", bst.inorderTraversal());

    // 删除叶子节点
    console.log("删除叶子节点10:", bst.delete(10));
    console.log("删除后:", bst.inorderTraversal());

    // 删除只有一个子节点的节点
    console.log("删除节点25:", bst.delete(25));
    console.log("删除后:", bst.inorderTraversal());

    // 删除有两个子节点的节点
    console.log("删除节点50:", bst.delete(50));
    console.log("删除后:", bst.inorderTraversal());

    console.log("最终BST结构:");
    console.log(bst.toString());
}

/**
 * 测试范围查询
 */
function testRangeOperations() {
    console.log("\n=== 范围查询测试 ===");
    const bst = createTestBST();

    console.log("BST中序遍历:", bst.inorderTraversal());
    console.log("范围查询[25, 45]:", bst.rangeQuery(25, 45));
    console.log("范围求和[25, 45]:", bst.rangeSumBST(25, 45));

    console.log("第3小的元素:", bst.kthSmallest(3));
    console.log("第3大的元素:", bst.kthLargest(3));
}

/**
 * 测试验证和平衡
 */
function testValidationAndBalance() {
    console.log("\n=== 验证和平衡测试 ===");

    const balancedBST = createTestBST();
    const unbalancedBST = createUnbalancedBST();

    console.log("平衡BST统计:", balancedBST.getStatistics());
    console.log("不平衡BST统计:", unbalancedBST.getStatistics());

    console.log("\n不平衡BST结构:");
    console.log(unbalancedBST.toString());

    const rebalanced = unbalancedBST.toBalanced();
    console.log("\n重新平衡后的BST:");
    console.log(rebalanced.toString());
    console.log("重新平衡后统计:", rebalanced.getStatistics());
}

/**
 * 测试BST迭代器
 */
function testBSTIterator() {
    console.log("\n=== BST迭代器测试 ===");
    const bst = createTestBST();
    const iterator = new BSTIterator(bst.root);

    console.log("迭代器遍历结果:");
    const result = [];
    while (iterator.hasNext()) {
        result.push(iterator.next());
    }
    console.log(result);
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const sizes = [1000, 5000, 10000];

    sizes.forEach(size => {
        console.log(`\n测试规模: ${size} 个节点`);

        // 创建随机BST
        const bst = new BinarySearchTree();
        const values = [];
        for (let i = 0; i < size; i++) {
            values.push(Math.floor(Math.random() * size * 2));
        }

        // 测试插入性能
        const startInsert = performance.now();
        bst.insertMany(values);
        const insertTime = performance.now() - startInsert;

        // 测试搜索性能
        const startSearch = performance.now();
        for (let i = 0; i < 100; i++) {
            const target = Math.floor(Math.random() * size * 2);
            bst.search(target);
        }
        const searchTime = performance.now() - startSearch;

        // 测试遍历性能
        const startTraversal = performance.now();
        bst.inorderTraversal();
        const traversalTime = performance.now() - startTraversal;

        console.log(`插入 ${size} 个元素: ${insertTime.toFixed(2)}ms`);
        console.log(`搜索 100 次: ${searchTime.toFixed(2)}ms`);
        console.log(`中序遍历: ${traversalTime.toFixed(2)}ms`);
        console.log(`树高: ${bst.getHeight()}, 平衡性: ${bst.isBalanced()}`);
    });
}

/**
 * 运行所有测试
 */
function runAllTests() {
    console.log("BST基础实现测试开始...\n");

    testBasicOperations();
    testDeleteOperations();
    testRangeOperations();
    testValidationAndBalance();
    testBSTIterator();
    performanceTest();

    console.log("\n所有测试完成！");
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TreeNode,
        BinarySearchTree,
        BSTIterator,
        createTestBST,
        createUnbalancedBST,
        runAllTests
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.TreeNode = TreeNode;
    window.BinarySearchTree = BinarySearchTree;
    window.BSTIterator = BSTIterator;
    window.runBSTTests = runAllTests;
}

// 自动运行测试（如果直接执行此文件）
if (typeof require !== 'undefined' && require.main === module) {
    runAllTests();
}