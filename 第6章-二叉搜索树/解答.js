/**
 * 第6章：二叉搜索树 - 练习题解答
 *
 * 包含内容：
 * 1. 验证二叉搜索树
 * 2. 二叉搜索树中第K小的元素
 * 3. 将有序数组转换为二叉搜索树
 * 4. 二叉搜索树的范围和
 * 5. 恢复二叉搜索树
 *
 * 每道题包含详细的思路分析、多种解法和完整测试用例
 */

// 树节点定义
class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// ======================= 题目1：验证二叉搜索树 =======================

/**
 * 验证二叉搜索树
 *
 * 核心思想：
 * 对于BST，每个节点都有一个有效的取值范围：
 * - 根节点：(-∞, +∞)
 * - 左子节点：(min, parent.val)
 * - 右子节点：(parent.val, max)
 *
 * 递归过程中更新每个节点的上下界，确保节点值在有效范围内
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {boolean} 是否为有效的BST
 * @time O(n) 每个节点访问一次
 * @space O(h) 递归栈深度为树的高度
 */
function isValidBST(root) {
    /**
     * 递归验证函数
     * @param {TreeNode} node - 当前节点
     * @param {number} min - 当前节点值的下界（不包含）
     * @param {number} max - 当前节点值的上界（不包含）
     */
    function validate(node, min, max) {
        // 空节点被认为是有效的BST
        if (!node) return true;

        // 当前节点值必须在(min, max)范围内
        if (node.val <= min || node.val >= max) {
            return false;
        }

        // 递归验证左右子树，更新边界
        return validate(node.left, min, node.val) &&
               validate(node.right, node.val, max);
    }

    return validate(root, -Infinity, Infinity);
}

/**
 * 中序遍历法验证BST
 *
 * 核心思想：
 * BST的中序遍历结果必须是严格递增的序列
 * 在遍历过程中检查当前值是否大于前一个值
 */
function isValidBST_Inorder(root) {
    let prev = -Infinity;

    function inorder(node) {
        if (!node) return true;

        // 先遍历左子树
        if (!inorder(node.left)) return false;

        // 检查当前节点值是否大于前一个值
        if (node.val <= prev) return false;
        prev = node.val;

        // 再遍历右子树
        return inorder(node.right);
    }

    return inorder(root);
}

// ======================= 题目2：二叉搜索树中第K小的元素 =======================

/**
 * 查找BST中第K小的元素（递归版本）
 *
 * 核心思想：
 * 利用BST中序遍历得到有序序列的性质
 * 在遍历过程中计数，找到第k个元素时立即返回
 *
 * @param {TreeNode} root - BST根节点
 * @param {number} k - 查找第k小的元素（从1开始）
 * @returns {number} 第k小的元素值
 * @time O(h + k) h为树高度，最多访问h+k个节点
 * @space O(h) 递归栈空间
 */
function kthSmallest(root, k) {
    let count = 0;
    let result = null;

    function inorder(node) {
        if (!node || result !== null) return;

        // 遍历左子树
        inorder(node.left);

        // 访问当前节点
        count++;
        if (count === k) {
            result = node.val;
            return;
        }

        // 遍历右子树
        inorder(node.right);
    }

    inorder(root);
    return result;
}

/**
 * 查找BST中第K小的元素（迭代版本）
 *
 * 核心思想：
 * 使用栈模拟中序遍历的递归过程
 * 可以更好地控制遍历过程，找到目标后立即停止
 */
function kthSmallest_Iterative(root, k) {
    const stack = [];
    let current = root;
    let count = 0;

    while (current || stack.length > 0) {
        // 一直向左走到底，将路径上的节点入栈
        while (current) {
            stack.push(current);
            current = current.left;
        }

        // 弹出栈顶节点（当前最小的未访问节点）
        current = stack.pop();
        count++;

        // 如果是第k个节点，返回其值
        if (count === k) {
            return current.val;
        }

        // 转向右子树
        current = current.right;
    }

    return -1; // 不应该到达这里
}

// ======================= 题目3：将有序数组转换为二叉搜索树 =======================

/**
 * 将有序数组转换为高度平衡的BST
 *
 * 核心思想：
 * 使用分治算法，每次选择数组的中位数作为根节点
 * 这样可以保证左右子树的节点数量尽可能平衡
 * 递归构造左右子树
 *
 * @param {number[]} nums - 有序数组
 * @returns {TreeNode} 平衡BST的根节点
 * @time O(n) 每个数组元素访问一次
 * @space O(log n) 递归栈深度
 */
function sortedArrayToBST(nums) {
    if (!nums || nums.length === 0) return null;

    /**
     * 递归构造BST
     * @param {number} left - 数组左边界
     * @param {number} right - 数组右边界
     */
    function buildTree(left, right) {
        if (left > right) return null;

        // 选择中位数作为根节点，保证平衡性
        const mid = Math.floor((left + right) / 2);
        const root = new TreeNode(nums[mid]);

        // 递归构造左右子树
        root.left = buildTree(left, mid - 1);
        root.right = buildTree(mid + 1, right);

        return root;
    }

    return buildTree(0, nums.length - 1);
}

/**
 * 验证构造的树是否平衡
 */
function isBalanced(root) {
    function getHeight(node) {
        if (!node) return 0;

        const leftHeight = getHeight(node.left);
        const rightHeight = getHeight(node.right);

        // 如果子树不平衡，返回-1
        if (leftHeight === -1 || rightHeight === -1 ||
            Math.abs(leftHeight - rightHeight) > 1) {
            return -1;
        }

        return Math.max(leftHeight, rightHeight) + 1;
    }

    return getHeight(root) !== -1;
}

// ======================= 题目4：二叉搜索树的范围和 =======================

/**
 * 计算BST中值在指定范围内的节点值之和
 *
 * 核心思想：
 * 利用BST的有序性质进行剪枝：
 * - 如果当前节点值小于范围下界，只需搜索右子树
 * - 如果当前节点值大于范围上界，只需搜索左子树
 * - 如果在范围内，累加该值并搜索两个子树
 *
 * @param {TreeNode} root - BST根节点
 * @param {number} low - 范围下界
 * @param {number} high - 范围上界
 * @returns {number} 范围内所有节点值的和
 * @time O(n) 最坏情况，但平均情况下会有很多剪枝
 * @space O(h) 递归栈深度
 */
function rangeSumBST(root, low, high) {
    if (!root) return 0;

    // 当前节点值小于范围下界，只搜索右子树
    if (root.val < low) {
        return rangeSumBST(root.right, low, high);
    }

    // 当前节点值大于范围上界，只搜索左子树
    if (root.val > high) {
        return rangeSumBST(root.left, low, high);
    }

    // 当前节点值在范围内，累加并搜索两个子树
    return root.val +
           rangeSumBST(root.left, low, high) +
           rangeSumBST(root.right, low, high);
}

/**
 * 迭代版本的范围和计算
 */
function rangeSumBST_Iterative(root, low, high) {
    if (!root) return 0;

    const stack = [root];
    let sum = 0;

    while (stack.length > 0) {
        const node = stack.pop();

        if (node.val >= low && node.val <= high) {
            sum += node.val;
        }

        // 根据BST性质决定是否需要搜索子树
        if (node.left && node.val > low) {
            stack.push(node.left);
        }
        if (node.right && node.val < high) {
            stack.push(node.right);
        }
    }

    return sum;
}

// ======================= 题目5：恢复二叉搜索树 =======================

/**
 * 恢复被错误交换的BST
 *
 * 核心思想：
 * 在正确的BST中，中序遍历应该得到严格递增序列
 * 如果有两个节点被错误交换，中序遍历时会出现：
 * 1. 相邻交换：一个降序对 [a, b] 其中 a > b
 * 2. 不相邻交换：两个降序对 [a, b] 和 [c, d]，需要交换a和d
 *
 * @param {TreeNode} root - 错误的BST根节点
 * @time O(n) 一次中序遍历
 * @space O(h) 递归栈空间
 */
function recoverTree(root) {
    let first = null;   // 第一个错误节点
    let second = null;  // 第二个错误节点
    let prev = null;    // 中序遍历中的前一个节点

    /**
     * 中序遍历查找错误节点
     */
    function inorder(node) {
        if (!node) return;

        inorder(node.left);

        // 检查是否出现降序对
        if (prev && prev.val > node.val) {
            if (!first) {
                // 第一次发现降序对
                first = prev;
                second = node;
            } else {
                // 第二次发现降序对，更新第二个错误节点
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

/**
 * Morris遍历版本（O(1)空间复杂度）
 */
function recoverTree_Morris(root) {
    let first = null, second = null, prev = null;
    let current = root;

    while (current) {
        if (!current.left) {
            // 处理当前节点
            if (prev && prev.val > current.val) {
                if (!first) {
                    first = prev;
                    second = current;
                } else {
                    second = current;
                }
            }
            prev = current;
            current = current.right;
        } else {
            // 找到中序前驱
            let predecessor = current.left;
            while (predecessor.right && predecessor.right !== current) {
                predecessor = predecessor.right;
            }

            if (!predecessor.right) {
                // 建立线索
                predecessor.right = current;
                current = current.left;
            } else {
                // 拆除线索，处理当前节点
                predecessor.right = null;
                if (prev && prev.val > current.val) {
                    if (!first) {
                        first = prev;
                        second = current;
                    } else {
                        second = current;
                    }
                }
                prev = current;
                current = current.right;
            }
        }
    }

    // 交换两个错误节点的值
    if (first && second) {
        [first.val, second.val] = [second.val, first.val];
    }
}

// ======================= 测试用例 =======================

/**
 * 构造测试树的辅助函数
 */
function buildTree(arr) {
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

/**
 * 打印树结构的辅助函数
 */
function printTree(root) {
    if (!root) return "null";

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

    // 移除末尾的null值
    while (result.length > 0 && result[result.length - 1] === null) {
        result.pop();
    }

    return result;
}

/**
 * 中序遍历辅助函数
 */
function inorderTraversal(root) {
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

// 运行测试
function runTests() {
    console.log("========== 第6章：二叉搜索树练习题解答测试 ==========\n");

    // 测试1：验证二叉搜索树
    console.log("=== 测试1：验证二叉搜索树 ===");
    const validBST = buildTree([2, 1, 3]);
    const invalidBST = buildTree([5, 1, 4, null, null, 3, 6]);

    console.log("有效BST [2,1,3]:", isValidBST(validBST));
    console.log("无效BST [5,1,4,null,null,3,6]:", isValidBST(invalidBST));
    console.log("中序遍历法验证:", isValidBST_Inorder(validBST));
    console.log();

    // 测试2：第K小元素
    console.log("=== 测试2：第K小元素 ===");
    const bst2 = buildTree([5, 3, 6, 2, 4, null, null, 1]);
    console.log("BST结构:", printTree(bst2));
    console.log("中序遍历:", inorderTraversal(bst2));
    console.log("第1小元素:", kthSmallest(bst2, 1));
    console.log("第3小元素:", kthSmallest(bst2, 3));
    console.log("第3小元素(迭代):", kthSmallest_Iterative(bst2, 3));
    console.log();

    // 测试3：有序数组转BST
    console.log("=== 测试3：有序数组转BST ===");
    const nums = [-10, -3, 0, 5, 9];
    const balancedBST = sortedArrayToBST(nums);
    console.log("输入数组:", nums);
    console.log("构造的BST:", printTree(balancedBST));
    console.log("是否平衡:", isBalanced(balancedBST));
    console.log("中序遍历验证:", inorderTraversal(balancedBST));
    console.log();

    // 测试4：范围和
    console.log("=== 测试4：范围和 ===");
    const bst4 = buildTree([10, 5, 15, 3, 7, null, 18]);
    console.log("BST结构:", printTree(bst4));
    console.log("范围[7,15]的和:", rangeSumBST(bst4, 7, 15));
    console.log("范围[7,15]的和(迭代):", rangeSumBST_Iterative(bst4, 7, 15));
    console.log();

    // 测试5：恢复BST
    console.log("=== 测试5：恢复BST ===");
    const wrongBST1 = buildTree([1, 3, null, null, 2]);
    const wrongBST2 = buildTree([3, 1, 4, null, null, 2]);

    console.log("错误BST1 [1,3,null,null,2]:");
    console.log("修复前中序遍历:", inorderTraversal(wrongBST1));
    recoverTree(wrongBST1);
    console.log("修复后中序遍历:", inorderTraversal(wrongBST1));
    console.log("修复后结构:", printTree(wrongBST1));

    console.log("\n错误BST2 [3,1,4,null,null,2]:");
    console.log("修复前中序遍历:", inorderTraversal(wrongBST2));
    recoverTree(wrongBST2);
    console.log("修复后中序遍历:", inorderTraversal(wrongBST2));
    console.log("修复后结构:", printTree(wrongBST2));

    console.log("\n========== 所有测试完成 ==========");
}

// 执行测试
runTests();