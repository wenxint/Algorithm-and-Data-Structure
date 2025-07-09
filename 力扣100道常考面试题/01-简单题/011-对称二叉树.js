/**
 * LeetCode 011: 对称二叉树 (Symmetric Tree)
 *
 * 题目描述：
 * 给你一个二叉树的根节点 root，检查它是否轴对称。
 *
 * 核心思想：
 * 递归思想 - 二叉树的镜像对称检查
 *
 * 算法原理：
 * 1. 对称二叉树的特点：左子树和右子树是镜像关系
 * 2. 递归检查：左子树的左节点等于右子树的右节点，左子树的右节点等于右子树的左节点
 * 3. 边界条件：空节点或单节点的处理
 */

// TODO: 待实现
// 预计包含以下解法：
// 1. 递归法（推荐）
// 2. 迭代法（使用队列）
// 3. 层序遍历法
// 解决二叉树结构对称性判断问题

// 二叉树节点定义
class TreeNode {
    constructor(val, left, right) {
        this.val = val === undefined ? 0 : val;
        this.left = left === undefined ? null : left;
        this.right = right === undefined ? null : right;
    }
}

/**
 * 解法一：递归法（推荐）
 *
 * 核心思想：
 * 将对称性问题转化为两个子树的镜像性问题
 * 比较左子树的左节点与右子树的右节点，左子树的右节点与右子树的左节点
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {boolean} 是否为对称二叉树
 * @time O(n) 需要访问每个节点一次
 * @space O(h) 递归栈深度，h为树的高度
 */
function isSymmetric(root) {
    if (!root) return true;

    return isMirror(root.left, root.right);
}

/**
 * 辅助函数：检查两个子树是否镜像对称
 *
 * @param {TreeNode} left - 左子树根节点
 * @param {TreeNode} right - 右子树根节点
 * @returns {boolean} 两个子树是否镜像对称
 */
function isMirror(left, right) {
    // 两个节点都为空，对称
    if (!left && !right) return true;

    // 一个为空一个不为空，不对称
    if (!left || !right) return false;

    // 值不相等，不对称
    if (left.val !== right.val) return false;

    // 递归检查：左子树的左子树与右子树的右子树，左子树的右子树与右子树的左子树
    return isMirror(left.left, right.right) && isMirror(left.right, right.left);
}

/**
 * 解法二：迭代法（使用队列）
 *
 * 核心思想：
 * 使用队列存储需要比较的节点对，每次取出两个节点进行比较
 * 将递归过程转化为迭代过程
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {boolean} 是否为对称二叉树
 * @time O(n) 需要访问每个节点一次
 * @space O(w) w为树的最大宽度
 */
function isSymmetricIterative(root) {
    if (!root) return true;

    const queue = [];
    queue.push(root.left, root.right);

    while (queue.length > 0) {
        // 每次取出两个节点进行比较
        const left = queue.shift();
        const right = queue.shift();

        // 两个节点都为空，继续
        if (!left && !right) continue;

        // 一个为空或值不相等，不对称
        if (!left || !right || left.val !== right.val) {
            return false;
        }

        // 将需要比较的节点对加入队列
        queue.push(left.left, right.right);
        queue.push(left.right, right.left);
    }

    return true;
}

/**
 * 解法三：层序遍历法
 *
 * 核心思想：
 * 对每一层进行层序遍历，检查每层的值是否回文
 * 需要在遍历时保留空节点信息
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {boolean} 是否为对称二叉树
 * @time O(n) 需要访问每个节点一次
 * @space O(w) w为树的最大宽度
 */
function isSymmetricLevelOrder(root) {
    if (!root) return true;

    let currentLevel = [root];

    while (currentLevel.length > 0) {
        const nextLevel = [];
        const levelValues = [];

        // 遍历当前层，收集节点值（包括null）
        for (const node of currentLevel) {
            if (node) {
                levelValues.push(node.val);
                nextLevel.push(node.left);
                nextLevel.push(node.right);
            } else {
                levelValues.push(null);
            }
        }

        // 检查当前层是否回文
        if (!isPalindrome(levelValues)) {
            return false;
        }

        // 检查下一层是否全为null（到达叶子层）
        const hasNonNull = nextLevel.some(node => node !== null);
        if (!hasNonNull) break;

        currentLevel = nextLevel;
    }

    return true;
}

/**
 * 辅助函数：检查数组是否为回文
 *
 * @param {Array} arr - 待检查的数组
 * @returns {boolean} 是否为回文数组
 */
function isPalindrome(arr) {
    let left = 0, right = arr.length - 1;

    while (left < right) {
        if (arr[left] !== arr[right]) {
            return false;
        }
        left++;
        right--;
    }

    return true;
}

// 辅助函数：根据数组创建二叉树（层序遍历方式）
function createBinaryTree(arr) {
    if (!arr || arr.length === 0) return null;

    const root = new TreeNode(arr[0]);
    const queue = [root];
    let i = 1;

    while (queue.length > 0 && i < arr.length) {
        const node = queue.shift();

        // 创建左子节点
        if (i < arr.length && arr[i] !== null) {
            node.left = new TreeNode(arr[i]);
            queue.push(node.left);
        }
        i++;

        // 创建右子节点
        if (i < arr.length && arr[i] !== null) {
            node.right = new TreeNode(arr[i]);
            queue.push(node.right);
        }
        i++;
    }

    return root;
}

// 辅助函数：二叉树转数组（层序遍历）
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

    // 移除末尾的null值
    while (result.length > 0 && result[result.length - 1] === null) {
        result.pop();
    }

    return result;
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 011: 对称二叉树 测试 ===\n');

    const testCases = [
        {
            input: [1, 2, 2, 3, 4, 4, 3],
            expected: true,
            description: '标准对称二叉树'
        },
        {
            input: [1, 2, 2, null, 3, null, 3],
            expected: false,
            description: '不对称的二叉树'
        },
        {
            input: [1],
            expected: true,
            description: '单节点树（对称）'
        },
        {
            input: [],
            expected: true,
            description: '空树（对称）'
        },
        {
            input: [1, 2, 2, 3, 3, 3, 3],
            expected: true,
            description: '完全对称的满二叉树'
        },
        {
            input: [1, 2, 3],
            expected: false,
            description: '简单不对称情况'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`输入: [${test.input.join(', ')}]`);

        const root = createBinaryTree(test.input);

        // 测试递归解法
        const result1 = isSymmetric(root);
        console.log(`递归解法结果: ${result1}`);

        // 测试迭代解法
        const result2 = isSymmetricIterative(root);
        console.log(`迭代解法结果: ${result2}`);

        // 测试层序遍历解法
        const result3 = isSymmetricLevelOrder(root);
        console.log(`层序遍历解法结果: ${result3}`);

        // 验证结果
        const isCorrect = result1 === test.expected && result2 === test.expected && result3 === test.expected;
        console.log(`结果验证: ${isCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能测试 ===');

    // 创建大型对称二叉树
    const size = 1000;
    const largeTree = [];

    // 构建对称的树结构
    for (let i = 0; i < size; i++) {
        largeTree.push(i % 10); // 使用模运算创建一定的模式
    }

    const root = createBinaryTree(largeTree);

    console.log(`测试数据规模: ${size} 个节点`);

    console.time('递归方法');
    const result1 = isSymmetric(root);
    console.timeEnd('递归方法');

    console.time('迭代方法');
    const result2 = isSymmetricIterative(root);
    console.timeEnd('迭代方法');

    console.log(`结果一致性: ${result1 === result2 ? '✅' : '❌'}`);
}

// 复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');
    console.log('1. 递归法:');
    console.log('   时间复杂度: O(n) - 需要访问每个节点一次');
    console.log('   空间复杂度: O(h) - 递归栈深度，h为树的高度');
    console.log('   最坏情况: O(n) 空间（倾斜树）');
    console.log('');
    console.log('2. 迭代法:');
    console.log('   时间复杂度: O(n) - 需要访问每个节点一次');
    console.log('   空间复杂度: O(w) - 队列存储，w为树的最大宽度');
    console.log('   最坏情况: O(n) 空间（完全二叉树的最后一层）');
    console.log('');
    console.log('3. 层序遍历法:');
    console.log('   时间复杂度: O(n) - 需要访问每个节点一次');
    console.log('   空间复杂度: O(w) - 存储每层节点');
    console.log('   额外开销: 需要检查每层的回文性质');
}

// 运行测试
if (require.main === module) {
    runTests();
    performanceTest();
    complexityAnalysis();
}