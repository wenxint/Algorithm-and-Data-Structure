/**
 * 第6章：二叉搜索树 - 算法实现
 *
 * 本文件包含：
 * 1. BST的高级算法和操作
 * 2. BST的变种和优化
 * 3. 实际应用场景的算法实现
 * 4. 复杂的BST问题解决方案
 * 5. 完整的测试用例和性能分析
 *
 * 作者：数据结构与算法教程
 * 日期：2024年
 */

// ============================= 1. 高级BST算法 =============================

/**
 * BST中两个节点的最近公共祖先
 *
 * 核心思想：
 * 利用BST的有序性质，比较节点值与p、q的关系：
 * - 如果都小于当前节点，LCA在左子树
 * - 如果都大于当前节点，LCA在右子树
 * - 否则当前节点就是LCA
 *
 * @param {TreeNode} root - BST根节点
 * @param {TreeNode} p - 第一个节点
 * @param {TreeNode} q - 第二个节点
 * @returns {TreeNode} 最近公共祖先节点
 * @time O(h) h为树高
 * @space O(1) 迭代版本
 */
function lowestCommonAncestor(root, p, q) {
    // 确保p.val <= q.val，简化逻辑
    if (p.val > q.val) {
        [p, q] = [q, p];
    }

    let current = root;

    while (current) {
        if (current.val < p.val) {
            // 两个节点都在右子树
            current = current.right;
        } else if (current.val > q.val) {
            // 两个节点都在左子树
            current = current.left;
        } else {
            // 当前节点在p和q之间，就是LCA
            return current;
        }
    }

    return null;
}

/**
 * BST中两个节点的最近公共祖先（递归版本）
 *
 * @param {TreeNode} root - BST根节点
 * @param {TreeNode} p - 第一个节点
 * @param {TreeNode} q - 第二个节点
 * @returns {TreeNode} 最近公共祖先节点
 * @time O(h) h为树高
 * @space O(h) 递归栈空间
 */
function lowestCommonAncestorRecursive(root, p, q) {
    if (!root) return null;

    // 确保p.val <= q.val
    if (p.val > q.val) {
        [p, q] = [q, p];
    }

    if (root.val < p.val) {
        // 两个节点都在右子树
        return lowestCommonAncestorRecursive(root.right, p, q);
    } else if (root.val > q.val) {
        // 两个节点都在左子树
        return lowestCommonAncestorRecursive(root.left, p, q);
    } else {
        // 当前节点在p和q之间
        return root;
    }
}

/**
 * 在BST中插入节点
 *
 * 核心思想：
 * 递归地找到正确的插入位置，保持BST性质
 * 返回更新后的树根节点
 *
 * @param {TreeNode} root - BST根节点
 * @param {number} val - 要插入的值
 * @returns {TreeNode} 更新后的根节点
 * @time O(h) h为树高
 * @space O(h) 递归栈空间
 */
function insertIntoBST(root, val) {
    // 找到插入位置，创建新节点
    if (!root) {
        return new TreeNode(val);
    }

    if (val < root.val) {
        root.left = insertIntoBST(root.left, val);
    } else {
        root.right = insertIntoBST(root.right, val);
    }

    return root;
}

/**
 * 从BST中删除节点
 *
 * 核心思想：
 * 删除操作的三种情况：
 * 1. 叶子节点：直接删除
 * 2. 只有一个子节点：用子节点替换
 * 3. 有两个子节点：用后继节点（右子树最小值）替换
 *
 * @param {TreeNode} root - BST根节点
 * @param {number} key - 要删除的值
 * @returns {TreeNode} 更新后的根节点
 * @time O(h) h为树高
 * @space O(h) 递归栈空间
 */
function deleteNode(root, key) {
    if (!root) return null;

    if (key < root.val) {
        root.left = deleteNode(root.left, key);
    } else if (key > root.val) {
        root.right = deleteNode(root.right, key);
    } else {
        // 找到要删除的节点

        // 情况1：叶子节点或只有右子节点
        if (!root.left) return root.right;

        // 情况2：只有左子节点
        if (!root.right) return root.left;

        // 情况3：有两个子节点
        // 找到右子树的最小值（后继节点）
        let successor = root.right;
        while (successor.left) {
            successor = successor.left;
        }

        // 用后继节点的值替换当前节点的值
        root.val = successor.val;

        // 删除后继节点
        root.right = deleteNode(root.right, successor.val);
    }

    return root;
}

/**
 * 修剪BST - 删除不在[low, high]范围内的节点
 *
 * 核心思想：
 * 利用BST的有序性质，递归地修剪不符合条件的子树
 * - 如果当前节点小于low，修剪左子树，返回修剪后的右子树
 * - 如果当前节点大于high，修剪右子树，返回修剪后的左子树
 * - 否则递归修剪左右子树
 *
 * @param {TreeNode} root - BST根节点
 * @param {number} low - 范围下界
 * @param {number} high - 范围上界
 * @returns {TreeNode} 修剪后的BST根节点
 * @time O(n) n为节点数量
 * @space O(h) h为树高
 */
function trimBST(root, low, high) {
    if (!root) return null;

    if (root.val < low) {
        // 当前节点及其左子树都需要被修剪
        return trimBST(root.right, low, high);
    }

    if (root.val > high) {
        // 当前节点及其右子树都需要被修剪
        return trimBST(root.left, low, high);
    }

    // 当前节点在范围内，递归修剪左右子树
    root.left = trimBST(root.left, low, high);
    root.right = trimBST(root.right, low, high);

    return root;
}

// ============================= 2. BST转换算法 =============================

/**
 * 将有序数组转换为平衡BST
 *
 * 核心思想：
 * 选择数组中位数作为根节点，递归构造左右子树
 * 保证构造出的BST是平衡的（高度平衡）
 *
 * @param {number[]} nums - 有序数组
 * @returns {TreeNode} 平衡BST的根节点
 * @time O(n) n为数组长度
 * @space O(log n) 递归栈空间
 */
function sortedArrayToBST(nums) {
    if (!nums || nums.length === 0) return null;

    function buildBST(left, right) {
        if (left > right) return null;

        // 选择中位数作为根节点
        const mid = Math.floor((left + right) / 2);
        const root = new TreeNode(nums[mid]);

        // 递归构造左右子树
        root.left = buildBST(left, mid - 1);
        root.right = buildBST(mid + 1, right);

        return root;
    }

    return buildBST(0, nums.length - 1);
}

/**
 * 将有序链表转换为平衡BST
 *
 * 核心思想：
 * 先计算链表长度，然后使用中序遍历的方式构造BST
 * 在递归过程中移动链表指针，保证有序性
 *
 * @param {ListNode} head - 有序链表头节点
 * @returns {TreeNode} 平衡BST的根节点
 * @time O(n) n为链表长度
 * @space O(log n) 递归栈空间
 */
function sortedListToBST(head) {
    if (!head) return null;

    // 计算链表长度
    function getLength(node) {
        let length = 0;
        while (node) {
            length++;
            node = node.next;
        }
        return length;
    }

    const length = getLength(head);
    let current = head;

    function buildBST(size) {
        if (size <= 0) return null;

        // 递归构造左子树
        const left = buildBST(Math.floor(size / 2));

        // 创建根节点
        const root = new TreeNode(current.val);
        current = current.next;

        // 递归构造右子树
        const right = buildBST(size - Math.floor(size / 2) - 1);

        root.left = left;
        root.right = right;

        return root;
    }

    return buildBST(length);
}

/**
 * BST转换为累加树（Greater Sum Tree）
 *
 * 核心思想：
 * 反向中序遍历（右->根->左），累加所有大于等于当前节点的值
 * 使用全局变量记录累加和
 *
 * @param {TreeNode} root - BST根节点
 * @returns {TreeNode} 转换后的累加树根节点
 * @time O(n) n为节点数量
 * @space O(h) h为树高
 */
function convertBST(root) {
    let sum = 0;

    function reverseInorder(node) {
        if (!node) return;

        // 先遍历右子树
        reverseInorder(node.right);

        // 更新当前节点值
        sum += node.val;
        node.val = sum;

        // 再遍历左子树
        reverseInorder(node.left);
    }

    reverseInorder(root);
    return root;
}

/**
 * BST转换为双向链表
 *
 * 核心思想：
 * 中序遍历BST，将节点按顺序连接成双向链表
 * 使用left指向前驱，right指向后继
 *
 * @param {TreeNode} root - BST根节点
 * @returns {TreeNode} 双向链表的头节点
 * @time O(n) n为节点数量
 * @space O(h) h为树高
 */
function treeToDoublyList(root) {
    if (!root) return null;

    let head = null;
    let prev = null;

    function inorder(node) {
        if (!node) return;

        inorder(node.left);

        // 连接当前节点
        if (prev) {
            prev.right = node;
            node.left = prev;
        } else {
            head = node; // 第一个节点作为头节点
        }
        prev = node;

        inorder(node.right);
    }

    inorder(root);

    // 连接头尾形成循环链表
    if (head && prev) {
        head.left = prev;
        prev.right = head;
    }

    return head;
}

// ============================= 3. BST验证和分析 =============================

/**
 * 验证二叉搜索树
 *
 * 核心思想：
 * 使用上下界限制每个节点的取值范围
 * 递归验证左右子树时更新边界
 *
 * @param {TreeNode} root - 待验证的树根节点
 * @param {number} min - 最小值边界
 * @param {number} max - 最大值边界
 * @returns {boolean} 是否为有效BST
 * @time O(n) n为节点数量
 * @space O(h) h为树高
 */
function isValidBST(root, min = -Infinity, max = Infinity) {
    if (!root) return true;

    // 检查当前节点是否在有效范围内
    if (root.val <= min || root.val >= max) {
        return false;
    }

    // 递归验证左右子树，更新边界
    return isValidBST(root.left, min, root.val) &&
           isValidBST(root.right, root.val, max);
}

/**
 * 验证二叉搜索树（中序遍历方法）
 *
 * 核心思想：
 * BST的中序遍历结果应该是严格递增的
 * 使用一个变量记录前一个访问的值
 *
 * @param {TreeNode} root - 待验证的树根节点
 * @returns {boolean} 是否为有效BST
 * @time O(n) n为节点数量
 * @space O(h) h为树高
 */
function isValidBSTInorder(root) {
    let prev = -Infinity;

    function inorder(node) {
        if (!node) return true;

        if (!inorder(node.left)) return false;

        if (node.val <= prev) return false;
        prev = node.val;

        return inorder(node.right);
    }

    return inorder(root);
}

/**
 * 计算BST中两个节点之间的距离
 *
 * 核心思想：
 * 先找到两个节点的最近公共祖先，然后计算从LCA到两个节点的距离之和
 *
 * @param {TreeNode} root - BST根节点
 * @param {number} p - 第一个节点值
 * @param {number} q - 第二个节点值
 * @returns {number} 两个节点之间的距离
 * @time O(h) h为树高
 * @space O(h) 递归栈空间
 */
function distanceInBST(root, p, q) {
    // 找到最近公共祖先
    function findLCA(node, val1, val2) {
        if (!node) return null;

        if (node.val > Math.max(val1, val2)) {
            return findLCA(node.left, val1, val2);
        } else if (node.val < Math.min(val1, val2)) {
            return findLCA(node.right, val1, val2);
        } else {
            return node;
        }
    }

    // 计算从某个节点到目标值的距离
    function distanceFromNode(node, target) {
        if (!node) return -1;
        if (node.val === target) return 0;

        if (target < node.val) {
            const leftDist = distanceFromNode(node.left, target);
            return leftDist === -1 ? -1 : leftDist + 1;
        } else {
            const rightDist = distanceFromNode(node.right, target);
            return rightDist === -1 ? -1 : rightDist + 1;
        }
    }

    const lca = findLCA(root, p, q);
    if (!lca) return -1;

    const distP = distanceFromNode(lca, p);
    const distQ = distanceFromNode(lca, q);

    return distP + distQ;
}

// ============================= 4. BST特殊操作 =============================

/**
 * BST中的前驱节点
 *
 * 核心思想：
 * 如果有左子树，前驱是左子树的最大值
 * 否则前驱是最近的一个祖先，该祖先的右子树包含当前节点
 *
 * @param {TreeNode} root - BST根节点
 * @param {TreeNode} p - 目标节点
 * @returns {TreeNode} 前驱节点
 * @time O(h) h为树高
 * @space O(1) 迭代版本
 */
function inorderPredecessor(root, p) {
    let predecessor = null;

    while (root) {
        if (p.val <= root.val) {
            root = root.left;
        } else {
            predecessor = root;
            root = root.right;
        }
    }

    return predecessor;
}

/**
 * BST中的后继节点
 *
 * 核心思想：
 * 如果有右子树，后继是右子树的最小值
 * 否则后继是最近的一个祖先，该祖先的左子树包含当前节点
 *
 * @param {TreeNode} root - BST根节点
 * @param {TreeNode} p - 目标节点
 * @returns {TreeNode} 后继节点
 * @time O(h) h为树高
 * @space O(1) 迭代版本
 */
function inorderSuccessor(root, p) {
    let successor = null;

    while (root) {
        if (p.val >= root.val) {
            root = root.right;
        } else {
            successor = root;
            root = root.left;
        }
    }

    return successor;
}

/**
 * BST中第K小的元素
 *
 * 核心思想：
 * 中序遍历BST可以得到有序序列，第K小就是第K个元素
 * 使用计数器在遍历过程中找到第K个元素
 *
 * @param {TreeNode} root - BST根节点
 * @param {number} k - 第k小（从1开始）
 * @returns {number} 第k小的元素值
 * @time O(h + k) h为树高，k为目标位置
 * @space O(h) 递归栈空间
 */
function kthSmallest(root, k) {
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

    inorder(root);
    return result;
}

/**
 * BST中第K小的元素（迭代版本）
 *
 * @param {TreeNode} root - BST根节点
 * @param {number} k - 第k小（从1开始）
 * @returns {number} 第k小的元素值
 * @time O(h + k) h为树高，k为目标位置
 * @space O(h) 栈空间
 */
function kthSmallestIterative(root, k) {
    const stack = [];
    let current = root;
    let count = 0;

    while (current || stack.length > 0) {
        // 将所有左节点入栈
        while (current) {
            stack.push(current);
            current = current.left;
        }

        current = stack.pop();
        count++;

        if (count === k) {
            return current.val;
        }

        current = current.right;
    }

    return null;
}

/**
 * BST中最接近目标值的元素
 *
 * 核心思想：
 * 利用BST的有序性质，比较当前节点与目标值的关系
 * 根据比较结果决定搜索方向，同时维护最接近的值
 *
 * @param {TreeNode} root - BST根节点
 * @param {number} target - 目标值
 * @returns {number} 最接近目标值的元素
 * @time O(h) h为树高
 * @space O(1) 迭代版本
 */
function closestValue(root, target) {
    let closest = root.val;

    while (root) {
        // 更新最接近的值
        if (Math.abs(root.val - target) < Math.abs(closest - target)) {
            closest = root.val;
        }

        // 根据目标值选择搜索方向
        if (target < root.val) {
            root = root.left;
        } else {
            root = root.right;
        }
    }

    return closest;
}

/**
 * BST中最接近目标值的K个元素
 *
 * 核心思想：
 * 中序遍历BST得到有序数组，然后使用双指针找到最接近的K个元素
 * 或者使用堆来维护距离最小的K个元素
 *
 * @param {TreeNode} root - BST根节点
 * @param {number} target - 目标值
 * @param {number} k - 元素个数
 * @returns {number[]} 最接近目标值的k个元素
 * @time O(n) n为节点数量
 * @space O(n) 存储中序遍历结果
 */
function closestKValues(root, target, k) {
    const inorderList = [];

    // 中序遍历得到有序数组
    function inorder(node) {
        if (!node) return;

        inorder(node.left);
        inorderList.push(node.val);
        inorder(node.right);
    }

    inorder(root);

    // 使用双指针找到最接近的K个元素
    let left = 0;
    let right = inorderList.length - 1;

    // 移除距离较远的元素，直到剩下K个
    while (right - left + 1 > k) {
        if (Math.abs(inorderList[left] - target) >
            Math.abs(inorderList[right] - target)) {
            left++;
        } else {
            right--;
        }
    }

    return inorderList.slice(left, right + 1);
}

// ============================= 5. BST复杂应用 =============================

/**
 * BST序列化
 *
 * 核心思想：
 * 使用前序遍历序列化BST，因为BST的前序遍历可以唯一确定树的结构
 * 空节点用特殊符号表示
 *
 * @param {TreeNode} root - BST根节点
 * @returns {string} 序列化字符串
 * @time O(n) n为节点数量
 * @space O(n) 存储序列化结果
 */
function serializeBST(root) {
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

    preorder(root);
    return result.join(',');
}

/**
 * BST反序列化
 *
 * 核心思想：
 * 根据前序遍历序列重建BST
 * 使用递归和边界检查确保BST性质
 *
 * @param {string} data - 序列化字符串
 * @returns {TreeNode} 重建的BST根节点
 * @time O(n) n为节点数量
 * @space O(n) 递归栈空间
 */
function deserializeBST(data) {
    if (!data) return null;

    const values = data.split(',');
    let index = 0;

    function buildTree(min, max) {
        if (index >= values.length) return null;

        const val = values[index];
        if (val === 'null') {
            index++;
            return null;
        }

        const numVal = parseInt(val);
        if (numVal < min || numVal > max) {
            return null;
        }

        index++;
        const root = new TreeNode(numVal);
        root.left = buildTree(min, numVal);
        root.right = buildTree(numVal, max);

        return root;
    }

    return buildTree(-Infinity, Infinity);
}

/**
 * BST中的众数
 *
 * 核心思想：
 * 中序遍历BST可以得到有序序列，相同的值会相邻出现
 * 在遍历过程中统计频率，找出出现次数最多的值
 *
 * @param {TreeNode} root - BST根节点
 * @returns {number[]} 出现频率最高的所有值
 * @time O(n) n为节点数量
 * @space O(1) 不计算结果数组
 */
function findMode(root) {
    let maxCount = 0;
    let currentCount = 0;
    let prevVal = null;
    const modes = [];

    function inorder(node) {
        if (!node) return;

        inorder(node.left);

        // 处理当前节点
        if (node.val === prevVal) {
            currentCount++;
        } else {
            currentCount = 1;
            prevVal = node.val;
        }

        // 更新众数列表
        if (currentCount > maxCount) {
            maxCount = currentCount;
            modes.length = 0; // 清空数组
            modes.push(node.val);
        } else if (currentCount === maxCount) {
            modes.push(node.val);
        }

        inorder(node.right);
    }

    inorder(root);
    return modes;
}

/**
 * 恢复BST中的两个错误节点
 *
 * 核心思想：
 * 如果BST中有两个节点位置错误，中序遍历时会出现降序对
 * 记录第一个和第二个降序对，然后交换它们的值
 *
 * @param {TreeNode} root - 有错误的BST根节点
 * @returns {void} 原地修复BST
 * @time O(n) n为节点数量
 * @space O(h) h为树高
 */
function recoverTree(root) {
    let first = null;
    let second = null;
    let prev = null;

    function inorder(node) {
        if (!node) return;

        inorder(node.left);

        // 发现降序对
        if (prev && prev.val > node.val) {
            if (!first) {
                // 第一个降序对
                first = prev;
                second = node;
            } else {
                // 第二个降序对
                second = node;
            }
        }
        prev = node;

        inorder(node.right);
    }

    inorder(root);

    // 交换两个错误节点的值
    if (first && second) {
        [first.val, second.val] = [second.val, first.val];
    }
}

// ============================= 6. 工具类和数据结构 =============================

/**
 * TreeNode类定义
 */
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * ListNode类定义（用于链表转BST）
 */
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

// ============================= 7. 测试用例和使用示例 =============================

/**
 * 创建测试用的BST
 */
function createTestBST() {
    const root = new TreeNode(50);
    root.left = new TreeNode(30);
    root.right = new TreeNode(70);
    root.left.left = new TreeNode(20);
    root.left.right = new TreeNode(40);
    root.right.left = new TreeNode(60);
    root.right.right = new TreeNode(80);

    return root;
}

/**
 * 创建测试用的有序链表
 */
function createTestList() {
    const head = new ListNode(-10);
    head.next = new ListNode(-3);
    head.next.next = new ListNode(0);
    head.next.next.next = new ListNode(5);
    head.next.next.next.next = new ListNode(9);

    return head;
}

/**
 * 打印BST结构（中序遍历）
 */
function printBST(root) {
    const result = [];

    function inorder(node) {
        if (!node) return;

        inorder(node.left);
        result.push(node.val);
        inorder(node.right);
    }

    inorder(root);
    console.log(result);
}

/**
 * 测试BST高级算法
 */
function testAdvancedBSTAlgorithms() {
    console.log("=== BST高级算法测试 ===");

    const bst = createTestBST();
    console.log("原始BST中序遍历:");
    printBST(bst);

    // 测试LCA
    const p = bst.left;  // 30
    const q = bst.right; // 70
    const lca = lowestCommonAncestor(bst, p, q);
    console.log(`节点${p.val}和${q.val}的LCA:`, lca.val);

    // 测试插入
    const newRoot = insertIntoBST(bst, 45);
    console.log("插入45后的BST:");
    printBST(newRoot);

    // 测试删除
    const afterDelete = deleteNode(newRoot, 30);
    console.log("删除30后的BST:");
    printBST(afterDelete);

    // 测试修剪
    const trimmed = trimBST(createTestBST(), 25, 65);
    console.log("修剪到[25,65]范围后:");
    printBST(trimmed);
}

/**
 * 测试BST转换算法
 */
function testBSTConversions() {
    console.log("\n=== BST转换算法测试 ===");

    // 数组转BST
    const nums = [-10, -3, 0, 5, 9];
    const bstFromArray = sortedArrayToBST(nums);
    console.log("有序数组转BST:");
    printBST(bstFromArray);

    // 链表转BST
    const list = createTestList();
    const bstFromList = sortedListToBST(list);
    console.log("有序链表转BST:");
    printBST(bstFromList);

    // BST转累加树
    const originalBST = createTestBST();
    const greaterSumTree = convertBST(originalBST);
    console.log("BST转累加树:");
    printBST(greaterSumTree);
}

/**
 * 测试BST验证和分析
 */
function testBSTValidation() {
    console.log("\n=== BST验证和分析测试 ===");

    const validBST = createTestBST();
    console.log("有效BST验证:", isValidBST(validBST));
    console.log("有效BST验证(中序):", isValidBSTInorder(createTestBST()));

    // 测试距离计算
    const distance = distanceInBST(validBST, 20, 80);
    console.log("节点20和80之间的距离:", distance);
}

/**
 * 测试BST特殊操作
 */
function testBSTSpecialOperations() {
    console.log("\n=== BST特殊操作测试 ===");

    const bst = createTestBST();

    // 测试第K小元素
    console.log("第3小的元素:", kthSmallest(bst, 3));
    console.log("第3小的元素(迭代):", kthSmallestIterative(bst, 3));

    // 测试最接近的值
    console.log("最接近35的值:", closestValue(bst, 35));

    // 测试最接近的K个值
    console.log("最接近35的3个值:", closestKValues(bst, 35, 3));

    // 测试众数
    const bstWithDuplicates = createTestBST();
    console.log("BST中的众数:", findMode(bstWithDuplicates));
}

/**
 * 测试BST序列化
 */
function testBSTSerialization() {
    console.log("\n=== BST序列化测试 ===");

    const bst = createTestBST();
    console.log("原始BST:");
    printBST(bst);

    const serialized = serializeBST(bst);
    console.log("序列化结果:", serialized);

    const deserialized = deserializeBST(serialized);
    console.log("反序列化后的BST:");
    printBST(deserialized);
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const sizes = [1000, 5000, 10000];

    sizes.forEach(size => {
        console.log(`\n测试规模: ${size} 个节点`);

        // 创建有序数组
        const nums = Array.from({ length: size }, (_, i) => i);

        // 测试数组转BST性能
        const startBuild = performance.now();
        const bst = sortedArrayToBST(nums);
        const buildTime = performance.now() - startBuild;

        // 测试搜索性能
        const startSearch = performance.now();
        for (let i = 0; i < 100; i++) {
            const target = Math.floor(Math.random() * size);
            closestValue(bst, target);
        }
        const searchTime = performance.now() - startSearch;

        // 测试第K小元素性能
        const startKth = performance.now();
        kthSmallest(bst, Math.floor(size / 2));
        const kthTime = performance.now() - startKth;

        console.log(`构建BST: ${buildTime.toFixed(2)}ms`);
        console.log(`搜索100次: ${searchTime.toFixed(2)}ms`);
        console.log(`第K小元素: ${kthTime.toFixed(2)}ms`);
    });
}

/**
 * 运行所有测试
 */
function runAllTests() {
    console.log("BST算法实现测试开始...\n");

    testAdvancedBSTAlgorithms();
    testBSTConversions();
    testBSTValidation();
    testBSTSpecialOperations();
    testBSTSerialization();
    performanceTest();

    console.log("\n所有测试完成！");
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // BST高级算法
        lowestCommonAncestor,
        lowestCommonAncestorRecursive,
        insertIntoBST,
        deleteNode,
        trimBST,

        // BST转换算法
        sortedArrayToBST,
        sortedListToBST,
        convertBST,
        treeToDoublyList,

        // BST验证和分析
        isValidBST,
        isValidBSTInorder,
        distanceInBST,

        // BST特殊操作
        inorderPredecessor,
        inorderSuccessor,
        kthSmallest,
        kthSmallestIterative,
        closestValue,
        closestKValues,

        // BST复杂应用
        serializeBST,
        deserializeBST,
        findMode,
        recoverTree,

        // 工具类
        TreeNode,
        ListNode,
        createTestBST,
        createTestList,
        runAllTests
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.runBSTAlgorithmTests = runAllTests;
}

// 自动运行测试（如果直接执行此文件）
if (typeof require !== 'undefined' && require.main === module) {
    runAllTests();
}