# 第5章：二叉树基础

## 概述 📚

二叉树是一种重要的非线性数据结构，在计算机科学中应用广泛。本章将深入探讨二叉树的基础概念、常用操作，以及基于二叉树的核心算法思想。

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