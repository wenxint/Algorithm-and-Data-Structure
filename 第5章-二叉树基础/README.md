# 第5章：二叉树基础

## 概述 📚

二叉树是一种重要的非线性数据结构，在计算机科学中应用广泛。本章将深入探讨二叉树的基础概念、常用操作，以及基于二叉树的核心算法思想。

## 二叉树基础概念 🌳

### 定义与特性

**二叉树定义**：
二叉树是每个节点最多有两个子节点的树结构，这两个子节点分别称为左子节点和右子节点。

**基本特性**：
- 每个节点最多有两个子节点
- 子节点有左右之分，不能颠倒
- 二叉树可以为空（空树也是二叉树）
- 左子树和右子树也都是二叉树（递归定义）

```javascript
/**
 * 二叉树节点定义
 */
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;      // 节点值
        this.left = left;    // 左子节点
        this.right = right;  // 右子节点
    }
}
```

### 二叉树的重要术语

```javascript
/**
 * 二叉树术语示例
 *        A (根节点)
 *       / \
 *      B   C (A的子节点，B和C是兄弟节点)
 *     / \   \
 *    D   E   F (叶子节点：D、E、F)
 *
 * 术语说明：
 * - 根节点：A（没有父节点的节点）
 * - 叶子节点：D、E、F（没有子节点的节点）
 * - 内部节点：A、B、C（有子节点的节点）
 * - 深度：节点到根节点的距离（A:0, B:1, D:2）
 * - 高度：节点到最远叶子节点的距离（A:2, B:1, D:0）
 * - 层数：深度+1（A:1, B:2, D:3）
 */

// 计算节点深度
function getDepth(root, target, depth = 0) {
    if (!root) return -1;
    if (root.val === target) return depth;

    const leftDepth = getDepth(root.left, target, depth + 1);
    if (leftDepth !== -1) return leftDepth;

    return getDepth(root.right, target, depth + 1);
}

// 计算节点高度
function getHeight(root) {
    if (!root) return -1;
    return Math.max(getHeight(root.left), getHeight(root.right)) + 1;
}
```

### 二叉树的分类

#### 1. 满二叉树（Full Binary Tree）

**定义**：除了叶子节点，每个节点都有两个子节点的二叉树。

```javascript
/**
 * 判断是否为满二叉树
 */
function isFullBinaryTree(root) {
    if (!root) return true;

    // 叶子节点
    if (!root.left && !root.right) return true;

    // 有两个子节点，递归检查
    if (root.left && root.right) {
        return isFullBinaryTree(root.left) && isFullBinaryTree(root.right);
    }

    // 只有一个子节点，不是满二叉树
    return false;
}

/**
 * 满二叉树示例：
 *       1
 *      / \
 *     2   3
 *    / \ / \
 *   4  5 6  7
 */
```

#### 2. 完全二叉树（Complete Binary Tree）

**定义**：除了最后一层，所有层都被完全填满，且最后一层的节点都靠左排列。

```javascript
/**
 * 判断是否为完全二叉树
 */
function isCompleteBinaryTree(root) {
    if (!root) return true;

    const queue = [root];
    let foundNull = false;

    while (queue.length > 0) {
        const node = queue.shift();

        if (node === null) {
            foundNull = true;
        } else {
            // 如果之前遇到过null，现在又遇到非null节点，不是完全二叉树
            if (foundNull) return false;

            queue.push(node.left);
            queue.push(node.right);
        }
    }

    return true;
}

/**
 * 完全二叉树示例：
 *       1
 *      / \
 *     2   3
 *    / \ /
 *   4  5 6
 */
```

#### 3. 平衡二叉树（Balanced Binary Tree）

**定义**：任意节点的左右子树高度差不超过1的二叉树。

```javascript
/**
 * 判断是否为平衡二叉树
 */
function isBalanced(root) {
    function getHeightAndCheck(node) {
        if (!node) return 0;

        const leftHeight = getHeightAndCheck(node.left);
        if (leftHeight === -1) return -1; // 左子树不平衡

        const rightHeight = getHeightAndCheck(node.right);
        if (rightHeight === -1) return -1; // 右子树不平衡

        // 检查当前节点是否平衡
        if (Math.abs(leftHeight - rightHeight) > 1) return -1;

        return Math.max(leftHeight, rightHeight) + 1;
    }

    return getHeightAndCheck(root) !== -1;
}
```

#### 4. 二叉搜索树（Binary Search Tree）

**定义**：对于任意节点，左子树的所有值小于节点值，右子树的所有值大于节点值。

```javascript
/**
 * 验证二叉搜索树
 */
function isValidBST(root, min = -Infinity, max = Infinity) {
    if (!root) return true;

    // 检查当前节点值是否在有效范围内
    if (root.val <= min || root.val >= max) return false;

    // 递归检查左右子树
    return isValidBST(root.left, min, root.val) &&
           isValidBST(root.right, root.val, max);
}

/**
 * 二叉搜索树示例：
 *       5
 *      / \
 *     3   8
 *    / \ / \
 *   2  4 7  9
 */
```

### 二叉树的性质

```javascript
/**
 * 二叉树的重要性质
 */
class BinaryTreeProperties {
    /**
     * 性质1：二叉树第i层最多有 2^(i-1) 个节点（i>=1）
     */
    static maxNodesAtLevel(level) {
        return Math.pow(2, level - 1);
    }

    /**
     * 性质2：深度为k的二叉树最多有 2^k - 1 个节点
     */
    static maxNodesAtDepth(depth) {
        return Math.pow(2, depth) - 1;
    }

    /**
     * 性质3：对于任意二叉树，叶子节点数 = 度为2的节点数 + 1
     */
    static verifyLeafProperty(root) {
        const counts = { leaf: 0, degree2: 0 };

        function traverse(node) {
            if (!node) return;

            const children = (node.left ? 1 : 0) + (node.right ? 1 : 0);
            if (children === 0) counts.leaf++;
            if (children === 2) counts.degree2++;

            traverse(node.left);
            traverse(node.right);
        }

        traverse(root);
        return counts.leaf === counts.degree2 + 1;
    }

    /**
     * 性质4：完全二叉树的数组表示
     * 节点i的左子节点：2i+1，右子节点：2i+2，父节点：floor((i-1)/2)
     */
    static arrayRepresentation() {
        return {
            getLeftChild: (i) => 2 * i + 1,
            getRightChild: (i) => 2 * i + 2,
            getParent: (i) => Math.floor((i - 1) / 2)
        };
    }
}
```

### 二叉树的存储方式

#### 1. 链式存储（推荐）

```javascript
/**
 * 链式存储结构
 * 优点：灵活，节省空间，便于插入删除
 * 缺点：需要额外指针空间
 */
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// 带父指针的节点
class TreeNodeWithParent {
    constructor(val = 0, left = null, right = null, parent = null) {
        this.val = val;
        this.left = left;
        this.right = right;
        this.parent = parent;
    }
}
```

#### 2. 顺序存储（数组表示）

```javascript
/**
 * 数组存储结构
 * 优点：节省指针空间，便于计算父子关系
 * 缺点：对非完全二叉树空间浪费大
 */
class ArrayBinaryTree {
    constructor(capacity = 100) {
        this.tree = new Array(capacity).fill(null);
        this.size = 0;
    }

    // 获取父节点索引
    getParentIndex(i) {
        return i === 0 ? -1 : Math.floor((i - 1) / 2);
    }

    // 获取左子节点索引
    getLeftChildIndex(i) {
        return 2 * i + 1;
    }

    // 获取右子节点索引
    getRightChildIndex(i) {
        return 2 * i + 2;
    }

    // 插入节点（层序插入）
    insert(val) {
        if (this.size >= this.tree.length) return false;
        this.tree[this.size] = val;
        this.size++;
        return true;
    }

    // 获取树的高度
    getHeight() {
        if (this.size === 0) return 0;
        return Math.floor(Math.log2(this.size)) + 1;
    }
}
```

### 二叉树的基本操作复杂度

| 操作 | 链式存储 | 数组存储 | 说明 |
|------|---------|---------|------|
| 访问根节点 | O(1) | O(1) | 直接访问 |
| 插入节点 | O(1) | O(1) | 在已知位置插入 |
| 删除节点 | O(1) | O(n) | 删除后可能需要移动元素 |
| 查找节点 | O(n) | O(n) | 最坏情况需要遍历整棵树 |
| 空间复杂度 | O(n) | O(2^h) | h为树的高度 |

## 二叉树基础操作 🔧

### 节点访问方法

```javascript
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// 获取父节点
const parent = node.parent;  // 如果有parent指针
// 获取子节点
const leftChild = node.left;
const rightChild = node.right;
// 修改节点值
node.val = newValue;
```

### 树的构建方法

```javascript
// 从数组构建二叉树（层序构建）
function buildTreeFromArray(arr) {
    if (!arr || arr.length === 0) return null;

    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;

    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();

        if (i < arr.length && arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;

        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }

    return root;
}

// 示例用法
const tree = buildTreeFromArray([3, 9, 20, null, null, 15, 7]);
console.log(tree.val);  // 3
console.log(tree.left.val);  // 9
```

### 树的序列化和反序列化

```javascript
// 序列化：将树转换为字符串
function serialize(root) {
    if (!root) return 'null';
    return root.val + ',' + serialize(root.left) + ',' + serialize(root.right);
}

// 反序列化：从字符串重建树
function deserialize(data) {
    const nodes = data.split(',');
    let index = 0;

    function helper() {
        if (nodes[index] === 'null') {
            index++;
            return null;
        }

        const node = new TreeNode(parseInt(nodes[index]));
        index++;
        node.left = helper();
        node.right = helper();
        return node;
    }

    return helper();
}

// 示例用法
const root = new TreeNode(1, new TreeNode(2), new TreeNode(3));
const serialized = serialize(root);  // "1,2,null,null,3,null,null"
const newTree = deserialize(serialized);
```

## 二叉树与其他数据结构的关系 💡

### 与数组的关系

```javascript
// 完全二叉树的数组表示
// 对于索引为i的节点：
// 左子节点：2*i + 1
// 右子节点：2*i + 2
// 父节点：Math.floor((i-1)/2)

function getLeftChild(arr, i) {
    const leftIndex = 2 * i + 1;
    return leftIndex < arr.length ? arr[leftIndex] : null;
}

function getRightChild(arr, i) {
    const rightIndex = 2 * i + 2;
    return rightIndex < arr.length ? arr[rightIndex] : null;
}
```

### 与链表的关系

```javascript
// 将二叉树转换为链表（前序遍历顺序）
function flattenToLinkedList(root) {
    if (!root) return;

    flattenToLinkedList(root.left);
    flattenToLinkedList(root.right);

    const leftSubtree = root.left;
    const rightSubtree = root.right;

    root.left = null;
    root.right = leftSubtree;

    let current = root;
    while (current.right) {
        current = current.right;
    }
    current.right = rightSubtree;
}
```

## 核心算法思想 🎯

### 1. 递归思想（分治法）

递归是处理二叉树最自然的思想。将大问题分解为相同的子问题。

**核心概念**：
- 递归的定义：函数调用自身来解决规模更小的相同问题
- 基础情况：递归的终止条件
- 递归关系：如何将大问题分解为小问题

**解题思想**：
1. 确定递归函数的功能和返回值
2. 找到递归的终止条件
3. 确定单层递归的逻辑

**经典应用1：计算二叉树的最大深度**

```javascript
/**
 * 计算二叉树最大深度
 * 核心思想：树的深度 = max(左子树深度, 右子树深度) + 1
 */
function maxDepth(root) {
    // 基础情况：空节点深度为0
    if (!root) return 0;

    // 递归计算左右子树深度
    const leftDepth = maxDepth(root.left);
    const rightDepth = maxDepth(root.right);

    // 当前树深度 = 较深子树深度 + 1
    return Math.max(leftDepth, rightDepth) + 1;
}

// 示例
const tree = buildTreeFromArray([3, 9, 20, null, null, 15, 7]);
console.log(maxDepth(tree));  // 3
```

**经典应用2：判断二叉树是否对称**

```javascript
/**
 * 判断二叉树是否对称
 * 核心思想：递归比较左右子树是否镜像对称
 */
function isSymmetric(root) {
    if (!root) return true;
    return isSymmetricHelper(root.left, root.right);
}

function isSymmetricHelper(left, right) {
    // 两个节点都为空，对称
    if (!left && !right) return true;
    // 只有一个为空，不对称
    if (!left || !right) return false;
    // 值不同，不对称
    if (left.val !== right.val) return false;

    // 递归检查：左的左与右的右，左的右与右的左
    return isSymmetricHelper(left.left, right.right) &&
           isSymmetricHelper(left.right, right.left);
}
```

### 2. 遍历思想

遍历是系统化访问二叉树所有节点的方法，是理解和操作二叉树的基础。

**核心概念**：
- 前序遍历：根 → 左 → 右
- 中序遍历：左 → 根 → 右
- 后序遍历：左 → 右 → 根
- 层序遍历：按层从上到下，从左到右

**解题思想**：根据问题需求选择合适的遍历方式

**经典应用1：前序遍历（递归和迭代）**

```javascript
// 递归实现
function preorderTraversal(root) {
    const result = [];

    function helper(node) {
        if (!node) return;

        result.push(node.val);      // 访问根节点
        helper(node.left);          // 遍历左子树
        helper(node.right);         // 遍历右子树
    }

    helper(root);
    return result;
}

// 迭代实现（使用栈）
function preorderTraversalIterative(root) {
    if (!root) return [];

    const result = [];
    const stack = [root];

    while (stack.length > 0) {
        const node = stack.pop();
        result.push(node.val);

        // 先压入右子节点，再压入左子节点
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
    }

    return result;
}
```

**经典应用2：层序遍历**

```javascript
/**
 * 层序遍历
 * 核心思想：使用队列，按层处理节点
 */
function levelOrder(root) {
    if (!root) return [];

    const result = [];
    const queue = [root];

    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];

        // 处理当前层的所有节点
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);

            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        result.push(currentLevel);
    }

    return result;
}
```

### 3. 路径思想

路径思想用于解决树中路径相关的问题，如路径和、路径长度等。

**核心概念**：
- 路径：从树中任意节点到任意节点的节点序列
- 根到叶路径：从根节点到叶子节点的路径
- 路径和：路径上所有节点值的总和

**解题思想**：
1. 使用递归传递当前路径信息
2. 在叶子节点或满足条件时处理路径
3. 回溯时撤销当前选择

**经典应用：路径总和**

```javascript
/**
 * 判断是否存在根到叶路径的和等于目标值
 * 核心思想：递归时减去当前节点值，叶子节点时检查是否为0
 */
function hasPathSum(root, targetSum) {
    if (!root) return false;

    // 到达叶子节点，检查路径和是否等于目标值
    if (!root.left && !root.right) {
        return root.val === targetSum;
    }

    // 递归检查左右子树，目标值减去当前节点值
    const remainingSum = targetSum - root.val;
    return hasPathSum(root.left, remainingSum) ||
           hasPathSum(root.right, remainingSum);
}
```

### 4. 构造思想

构造思想用于根据给定信息重建二叉树。

**核心概念**：
- 根据遍历序列构造树
- 利用不同遍历方式的特点
- 分治法递归构造

**解题思想**：
1. 分析遍历序列的特点
2. 确定根节点位置
3. 递归构造左右子树

**经典应用：从前序和中序遍历构造二叉树**

```javascript
/**
 * 从前序和中序遍历构造二叉树
 * 核心思想：前序确定根节点，中序确定左右子树范围
 */
function buildTree(preorder, inorder) {
    if (preorder.length === 0) return null;

    // 前序遍历的第一个节点是根节点
    const rootVal = preorder[0];
    const root = new TreeNode(rootVal);

    // 在中序遍历中找到根节点位置
    const rootIndex = inorder.indexOf(rootVal);

    // 分割左右子树的遍历序列
    const leftInorder = inorder.slice(0, rootIndex);
    const rightInorder = inorder.slice(rootIndex + 1);
    const leftPreorder = preorder.slice(1, 1 + leftInorder.length);
    const rightPreorder = preorder.slice(1 + leftInorder.length);

    // 递归构造左右子树
    root.left = buildTree(leftPreorder, leftInorder);
    root.right = buildTree(rightPreorder, rightInorder);

    return root;
}
```

## 算法思想总结 🎯

| 思想类型 | 时间复杂度 | 空间复杂度 | 核心设计理念 |
|---------|-----------|-----------|-------------|
| 递归思想 | O(n) | O(h) | 分治法，将大问题分解为相同的子问题 |
| 遍历思想 | O(n) | O(h)/O(n) | 系统化访问所有节点，选择合适的访问顺序 |
| 路径思想 | O(n) | O(h) | 传递路径信息，在满足条件时处理结果 |
| 构造思想 | O(n) | O(n) | 利用遍历特点，分治递归构造 |

**适用总结**：
- 递归思想：适用于可以分解为相同子问题的场景
- 遍历思想：适用于需要访问所有节点或特定顺序访问的场景
- 路径思想：适用于路径相关问题，如路径和、路径计数等
- 构造思想：适用于根据给定信息重建树结构的场景