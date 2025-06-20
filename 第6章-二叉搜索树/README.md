# 第6章：二叉搜索树

## 概述 📚

二叉搜索树（Binary Search Tree，BST）是一种特殊的二叉树，具有重要的有序性质：对于树中任意节点，其左子树中所有节点的值都小于该节点的值，右子树中所有节点的值都大于该节点的值。这种性质使得BST在搜索、插入、删除等操作上具有很高的效率。

## 二叉搜索树基础操作 🔧

### 节点访问和搜索

```javascript
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// BST搜索操作
function searchBST(root, val) {
    if (!root || root.val === val) return root;
    
    return val < root.val ? 
        searchBST(root.left, val) : 
        searchBST(root.right, val);
}

// 示例用法
const bst = new TreeNode(4, 
    new TreeNode(2, new TreeNode(1), new TreeNode(3)),
    new TreeNode(7, new TreeNode(6), new TreeNode(9))
);
const found = searchBST(bst, 2);
console.log(found.val);  // 2
```

### 插入和删除操作

```javascript
// BST插入操作
function insertIntoBST(root, val) {
    if (!root) return new TreeNode(val);
    
    if (val < root.val) {
        root.left = insertIntoBST(root.left, val);
    } else {
        root.right = insertIntoBST(root.right, val);
    }
    
    return root;
}

// BST删除操作
function deleteNode(root, key) {
    if (!root) return null;
    
    if (key < root.val) {
        root.left = deleteNode(root.left, key);
    } else if (key > root.val) {
        root.right = deleteNode(root.right, key);
    } else {
        // 找到要删除的节点
        if (!root.left) return root.right;
        if (!root.right) return root.left;
        
        // 找到右子树的最小值替换当前节点
        const minNode = findMin(root.right);
        root.val = minNode.val;
        root.right = deleteNode(root.right, minNode.val);
    }
    
    return root;
}

function findMin(node) {
    while (node.left) node = node.left;
    return node;
}

// 示例用法
let bst = insertIntoBST(null, 5);
bst = insertIntoBST(bst, 3);
bst = insertIntoBST(bst, 7);
bst = deleteNode(bst, 3);
```

### 范围查询和统计

```javascript
// 范围查询：查找[low, high]范围内的所有值
function rangeSumBST(root, low, high) {
    if (!root) return 0;
    
    let sum = 0;
    if (root.val >= low && root.val <= high) {
        sum += root.val;
    }
    
    if (root.val > low) {
        sum += rangeSumBST(root.left, low, high);
    }
    
    if (root.val < high) {
        sum += rangeSumBST(root.right, low, high);
    }
    
    return sum;
}

// 查找第k小的元素
function kthSmallest(root, k) {
    const result = [];
    
    function inorder(node) {
        if (!node || result.length >= k) return;
        
        inorder(node.left);
        if (result.length < k) {
            result.push(node.val);
        }
        inorder(node.right);
    }
    
    inorder(root);
    return result[k - 1];
}

// 示例用法
const bst = buildBSTFromArray([5, 3, 7, 2, 4, 6, 8]);
console.log(rangeSumBST(bst, 3, 7));  // 25 (3+4+5+6+7)
console.log(kthSmallest(bst, 3));     // 4
```

## 二叉搜索树与其他数据结构的关系 💡

### 与数组的关系

```javascript
// BST的中序遍历得到有序数组
function bstToSortedArray(root) {
    const result = [];
    
    function inorder(node) {
        if (!node) return;
        
        inorder(node.left);
        result.push(node.val);
        inorder(node.right);
    }
    
    inorder(root);
    return result;
}

// 从有序数组构建平衡BST
function sortedArrayToBST(nums) {
    if (nums.length === 0) return null;
    
    const mid = Math.floor(nums.length / 2);
    const root = new TreeNode(nums[mid]);
    
    root.left = sortedArrayToBST(nums.slice(0, mid));
    root.right = sortedArrayToBST(nums.slice(mid + 1));
    
    return root;
}

// 示例
const bst = sortedArrayToBST([1, 2, 3, 4, 5, 6, 7]);
const sortedArray = bstToSortedArray(bst);
console.log(sortedArray);  // [1, 2, 3, 4, 5, 6, 7]
```

### 与堆的关系

```javascript
// BST可以模拟最小堆和最大堆的某些功能
class BSTBasedPriorityQueue {
    constructor() {
        this.root = null;
        this.size = 0;
    }
    
    // 插入元素（相当于堆的push）
    insert(val) {
        this.root = insertIntoBST(this.root, val);
        this.size++;
    }
    
    // 获取最小值（相当于堆的peek）
    getMin() {
        if (!this.root) return null;
        
        let current = this.root;
        while (current.left) {
            current = current.left;
        }
        return current.val;
    }
    
    // 删除最小值（相当于堆的pop）
    extractMin() {
        if (!this.root) return null;
        
        const min = this.getMin();
        this.root = deleteNode(this.root, min);
        this.size--;
        return min;
    }
}
```

## 核心算法思想 🎯

### 1. 二分搜索思想

BST的有序性质使得每次搜索都能排除一半的可能性，实现高效的二分搜索。

**核心概念**：
- 利用BST的有序性质进行快速搜索
- 每次比较根据大小关系选择搜索左子树或右子树
- 时间复杂度：平均O(log n)，最坏O(n)

**解题思想**：
1. 比较目标值与当前节点值
2. 根据比较结果选择搜索左子树或右子树
3. 递归或迭代直到找到目标或遍历完毕

**经典应用：验证二叉搜索树**

```javascript
/**
 * 验证二叉搜索树
 * 核心思想：使用上下界限制节点值的有效范围
 */
function isValidBST(root) {
    function validate(node, min, max) {
        if (!node) return true;
        
        // 检查当前节点值是否在有效范围内
        if (node.val <= min || node.val >= max) {
            return false;
        }
        
        // 递归检查左右子树，更新边界
        return validate(node.left, min, node.val) &&
               validate(node.right, node.val, max);
    }
    
    return validate(root, -Infinity, Infinity);
}

// 示例
const validBST = new TreeNode(5, 
    new TreeNode(3), new TreeNode(7));
const invalidBST = new TreeNode(5, 
    new TreeNode(3), new TreeNode(4));
console.log(isValidBST(validBST));    // true
console.log(isValidBST(invalidBST));  // false
```

### 2. 中序遍历思想

BST的中序遍历结果是有序的，这一性质在很多问题中都有应用。

**核心概念**：
- BST的中序遍历得到递增序列
- 可以用于排序、查找、验证等操作
- 时间复杂度：O(n)，空间复杂度：O(h)

**解题思想**：
1. 使用中序遍历访问所有节点
2. 利用遍历的有序性解决问题
3. 可以结合提前终止优化性能

**经典应用：BST中的众数**

```javascript
/**
 * 二叉搜索树中的众数
 * 核心思想：中序遍历 + 计数，利用BST的有序性
 */
function findMode(root) {
    const modes = [];
    let currentVal = null;
    let currentCount = 0;
    let maxCount = 0;
    
    function inorder(node) {
        if (!node) return;
        
        inorder(node.left);
        
        // 处理当前节点
        if (node.val === currentVal) {
            currentCount++;
        } else {
            currentVal = node.val;
            currentCount = 1;
        }
        
        if (currentCount > maxCount) {
            maxCount = currentCount;
            modes.length = 0;
            modes.push(currentVal);
        } else if (currentCount === maxCount) {
            modes.push(currentVal);
        }
        
        inorder(node.right);
    }
    
    inorder(root);
    return modes;
}

// 示例
const bst = new TreeNode(1, null, new TreeNode(2, new TreeNode(2)));
console.log(findMode(bst));  // [2]
```

### 3. 递归构造思想

利用BST的性质和分治法思想，可以高效地构造和重建BST。

**核心概念**：
- 选择合适的根节点（通常是中位数）
- 递归构造左右子树
- 保持BST的有序性质

**解题思想**：
1. 确定根节点（平衡BST选择中位数）
2. 根据根节点分割子树范围
3. 递归构造左右子树

**经典应用：平衡二叉搜索树**

```javascript
/**
 * 将BST转换为平衡BST
 * 核心思想：中序遍历得到有序数组，再从数组构造平衡BST
 */
function balanceBST(root) {
    const nums = [];
    
    // 中序遍历得到有序数组
    function inorder(node) {
        if (!node) return;
        
        inorder(node.left);
        nums.push(node.val);
        inorder(node.right);
    }
    
    // 从有序数组构造平衡BST
    function buildBalanced(left, right) {
        if (left > right) return null;
        
        const mid = Math.floor((left + right) / 2);
        const root = new TreeNode(nums[mid]);
        
        root.left = buildBalanced(left, mid - 1);
        root.right = buildBalanced(mid + 1, right);
        
        return root;
    }
    
    inorder(root);
    return buildBalanced(0, nums.length - 1);
}

// 示例：将倾斜的BST转换为平衡BST
const skewedBST = new TreeNode(1, null, 
    new TreeNode(2, null, 
        new TreeNode(3, null, new TreeNode(4))));
const balancedBST = balanceBST(skewedBST);
```

### 4. 前驱后继思想

在BST中查找前驱（前一个）和后继（后一个）节点是常见操作，对于删除等操作很重要。

**核心概念**：
- 前驱：小于当前节点的最大值（左子树的最右节点）
- 后继：大于当前节点的最小值（右子树的最左节点）
- 在删除操作中用于替换被删除的节点

**解题思想**：
1. 有右子树：后继是右子树的最左节点
2. 有左子树：前驱是左子树的最右节点
3. 没有对应子树：需要向上查找父节点

**经典应用：BST迭代器**

```javascript
/**
 * BST迭代器
 * 核心思想：使用栈模拟中序遍历，实现O(1)的next操作
 */
class BSTIterator {
    constructor(root) {
        this.stack = [];
        this.pushAllLeft(root);
    }
    
    // 将节点及其所有左子节点入栈
    pushAllLeft(node) {
        while (node) {
            this.stack.push(node);
            node = node.left;
        }
    }
    
    // 获取下一个最小元素
    next() {
        const node = this.stack.pop();
        
        // 如果有右子树，将右子树的左边界入栈
        if (node.right) {
            this.pushAllLeft(node.right);
        }
        
        return node.val;
    }
    
    // 检查是否还有下一个元素
    hasNext() {
        return this.stack.length > 0;
    }
}

// 示例使用
const bst = new TreeNode(7, 
    new TreeNode(3), new TreeNode(15, new TreeNode(9), new TreeNode(20)));
const iterator = new BSTIterator(bst);
console.log(iterator.next());    // 3
console.log(iterator.next());    // 7
console.log(iterator.hasNext()); // true
```

## 算法思想总结 🎯

| 思想类型 | 时间复杂度 | 空间复杂度 | 核心设计理念 |
|---------|-----------|-----------|-------------|
| 二分搜索思想 | O(log n) | O(1)/O(h) | 利用有序性质快速定位 |
| 中序遍历思想 | O(n) | O(h) | 利用中序遍历的有序性 |
| 递归构造思想 | O(n) | O(n) | 分治法构造平衡结构 |
| 前驱后继思想 | O(h) | O(1) | 高效的节点关系查找 |

**适用总结**：
- 二分搜索思想：适用于查找、验证等需要快速定位的场景
- 中序遍历思想：适用于需要有序访问或统计的场景
- 递归构造思想：适用于构造平衡BST或树的转换
- 前驱后继思想：适用于删除操作和迭代器实现 