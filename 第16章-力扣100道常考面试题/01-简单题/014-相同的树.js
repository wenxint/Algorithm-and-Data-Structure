/**
 * LeetCode 014: 相同的树 (Same Tree)
 *
 * 题目描述：
 * 给你两棵二叉树的根节点 p 和 q，编写一个函数来检验这两棵树是否相同。
 * 如果两个树在结构上相同，并且节点具有相同的值，则认为它们是相同的。
 *
 * 核心思想：
 * 递归遍历 - 同时遍历两棵树，比较对应位置的节点
 *
 * 算法原理：
 * 1. 递归比较两个节点的值和结构
 * 2. 边界条件：两个节点都为空则相同，一个为空一个不为空则不同
 * 3. 递归检查左子树和右子树
 */

// TODO: 待实现
// 预计包含以下解法：
// 1. 递归遍历法（推荐）
// 2. 迭代法（使用栈）
// 3. 序列化比较法
// 解决二叉树结构和值的完全比较问题

module.exports = {
    // 主要解法将在这里实现
};

// 二叉树节点定义
class TreeNode {
    constructor(val, left, right) {
        this.val = val === undefined ? 0 : val;
        this.left = left === undefined ? null : left;
        this.right = right === undefined ? null : right;
    }
}

/**
 * 解法一：递归遍历法（推荐）
 *
 * 核心思想：
 * 递归地比较两棵树的每个对应节点
 * 两棵树相同当且仅当：
 * 1. 根节点值相同
 * 2. 左子树相同
 * 3. 右子树相同
 *
 * @param {TreeNode} p - 第一棵树的根节点
 * @param {TreeNode} q - 第二棵树的根节点
 * @returns {boolean} 两棵树是否相同
 * @time O(min(m,n)) m和n分别是两棵树的节点数
 * @space O(min(m,n)) 递归栈深度
 */
function isSameTree(p, q) {
    // 边界条件：两个节点都为空，相同
    if (!p && !q) {
        return true;
    }

    // 边界条件：只有一个节点为空，不同
    if (!p || !q) {
        return false;
    }

    // 当前节点值不同，不同
    if (p.val !== q.val) {
        return false;
    }

    // 递归检查左子树和右子树
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}

/**
 * 解法二：迭代法（使用栈）
 *
 * 核心思想：
 * 使用栈来模拟递归过程，同时遍历两棵树
 * 将对应的节点对压入栈中进行比较
 *
 * @param {TreeNode} p - 第一棵树的根节点
 * @param {TreeNode} q - 第二棵树的根节点
 * @returns {boolean} 两棵树是否相同
 * @time O(min(m,n)) m和n分别是两棵树的节点数
 * @space O(min(m,n)) 栈存储空间
 */
function isSameTreeIterative(p, q) {
    const stack = [[p, q]];

    while (stack.length > 0) {
        const [node1, node2] = stack.pop();

        // 两个节点都为空，继续
        if (!node1 && !node2) {
            continue;
        }

        // 只有一个节点为空或值不相等，不同
        if (!node1 || !node2 || node1.val !== node2.val) {
            return false;
        }

        // 将子节点对压入栈
        stack.push([node1.left, node2.left]);
        stack.push([node1.right, node2.right]);
    }

    return true;
}

/**
 * 解法三：迭代法（使用队列 - 层序遍历）
 *
 * 核心思想：
 * 使用队列进行层序遍历，逐层比较两棵树的节点
 *
 * @param {TreeNode} p - 第一棵树的根节点
 * @param {TreeNode} q - 第二棵树的根节点
 * @returns {boolean} 两棵树是否相同
 * @time O(min(m,n)) m和n分别是两棵树的节点数
 * @space O(min(m,n)) 队列存储空间
 */
function isSameTreeBFS(p, q) {
    const queue = [[p, q]];

    while (queue.length > 0) {
        const [node1, node2] = queue.shift();

        // 两个节点都为空，继续
        if (!node1 && !node2) {
            continue;
        }

        // 只有一个节点为空或值不相等，不同
        if (!node1 || !node2 || node1.val !== node2.val) {
            return false;
        }

        // 将子节点对加入队列
        queue.push([node1.left, node2.left]);
        queue.push([node1.right, node2.right]);
    }

    return true;
}

/**
 * 解法四：序列化比较法
 *
 * 核心思想：
 * 将两棵树分别序列化为字符串，然后比较字符串是否相等
 * 需要注意序列化时要包含空节点信息
 *
 * @param {TreeNode} p - 第一棵树的根节点
 * @param {TreeNode} q - 第二棵树的根节点
 * @returns {boolean} 两棵树是否相同
 * @time O(m+n) 需要序列化整棵树
 * @space O(m+n) 存储序列化字符串
 */
function isSameTreeSerialization(p, q) {
    function serialize(node) {
        if (!node) return 'null';

        return node.val + ',' + serialize(node.left) + ',' + serialize(node.right);
    }

    return serialize(p) === serialize(q);
}

/**
 * 解法五：前序遍历比较法
 *
 * 核心思想：
 * 对两棵树同时进行前序遍历，比较遍历序列是否相同
 * 需要包含空节点信息以区分不同的树结构
 *
 * @param {TreeNode} p - 第一棵树的根节点
 * @param {TreeNode} q - 第二棵树的根节点
 * @returns {boolean} 两棵树是否相同
 * @time O(min(m,n))
 * @space O(min(m,n))
 */
function isSameTreePreorder(p, q) {
    function preorderTraversal(node, result) {
        if (!node) {
            result.push(null);
            return;
        }

        result.push(node.val);
        preorderTraversal(node.left, result);
        preorderTraversal(node.right, result);
    }

    const result1 = [];
    const result2 = [];

    preorderTraversal(p, result1);
    preorderTraversal(q, result2);

    if (result1.length !== result2.length) {
        return false;
    }

    for (let i = 0; i < result1.length; i++) {
        if (result1[i] !== result2[i]) {
            return false;
        }
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
    console.log('=== LeetCode 014: 相同的树 测试 ===\n');

    const testCases = [
        {
            tree1: [1, 2, 3],
            tree2: [1, 2, 3],
            expected: true,
            description: '相同的简单树'
        },
        {
            tree1: [1, 2],
            tree2: [1, null, 2],
            expected: false,
            description: '结构不同的树'
        },
        {
            tree1: [1, 2, 1],
            tree2: [1, 1, 2],
            expected: false,
            description: '值不同的树'
        },
        {
            tree1: [],
            tree2: [],
            expected: true,
            description: '两个空树'
        },
        {
            tree1: [1],
            tree2: [1],
            expected: true,
            description: '两个单节点树'
        },
        {
            tree1: [1],
            tree2: [],
            expected: false,
            description: '一个空树一个非空树'
        },
        {
            tree1: [1, 2, 3, 4, 5, 6, 7],
            tree2: [1, 2, 3, 4, 5, 6, 7],
            expected: true,
            description: '完全相同的满二叉树'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`树1: [${test.tree1.join(', ')}]`);
        console.log(`树2: [${test.tree2.join(', ')}]`);

        const root1 = createBinaryTree(test.tree1);
        const root2 = createBinaryTree(test.tree2);

        // 测试所有解法
        const result1 = isSameTree(root1, root2);
        const result2 = isSameTreeIterative(root1, root2);
        const result3 = isSameTreeBFS(root1, root2);
        const result4 = isSameTreeSerialization(root1, root2);
        const result5 = isSameTreePreorder(root1, root2);

        console.log(`递归法结果: ${result1}`);
        console.log(`迭代栈法结果: ${result2}`);
        console.log(`层序遍历法结果: ${result3}`);
        console.log(`序列化法结果: ${result4}`);
        console.log(`前序遍历法结果: ${result5}`);

        // 验证结果
        const results = [result1, result2, result3, result4, result5];
        const allCorrect = results.every(result => result === test.expected);
        console.log(`结果验证: ${allCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能测试 ===');

    // 创建相同的大型二叉树
    const size = 1000;
    const values = Array.from({ length: size }, (_, i) => i % 100);

    const tree1 = createBinaryTree(values);
    const tree2 = createBinaryTree(values);

    console.log(`测试数据规模: ${size} 个节点`);

    console.time('递归法');
    const result1 = isSameTree(tree1, tree2);
    console.timeEnd('递归法');

    console.time('迭代栈法');
    const result2 = isSameTreeIterative(tree1, tree2);
    console.timeEnd('迭代栈法');

    console.time('层序遍历法');
    const result3 = isSameTreeBFS(tree1, tree2);
    console.timeEnd('层序遍历法');

    console.time('序列化法');
    const result4 = isSameTreeSerialization(tree1, tree2);
    console.timeEnd('序列化法');

    console.log(`所有方法结果一致: ${result1 === result2 && result2 === result3 && result3 === result4 ? '✅' : '❌'}`);

    // 测试不同的树（提前终止）
    console.log('\n提前终止测试（不同的树）:');
    const differentTree = createBinaryTree([...values.slice(0, 100), 999]);

    console.time('递归法(不同树)');
    const result5 = isSameTree(tree1, differentTree);
    console.timeEnd('递归法(不同树)');

    console.log(`不同树检测结果: ${result5}`);
}

// 递归算法详解
function recursionDemo() {
    console.log('\n=== 递归算法详解 ===');

    console.log('递归函数的定义：');
    console.log('isSameTree(p, q) = ');
    console.log('  - true, 如果 p == null && q == null');
    console.log('  - false, 如果 p == null || q == null');
    console.log('  - false, 如果 p.val != q.val');
    console.log('  - isSameTree(p.left, q.left) && isSameTree(p.right, q.right), 其他情况');
    console.log('');

    console.log('递归过程示例：');
    const tree1 = createBinaryTree([1, 2, 3]);
    const tree2 = createBinaryTree([1, 2, 3]);

    console.log('树1: [1, 2, 3]');
    console.log('树2: [1, 2, 3]');
    console.log('');
    console.log('递归调用过程：');
    console.log('1. isSameTree(root1, root2): 比较节点1和1 ✓');
    console.log('2. isSameTree(left1, left2): 比较节点2和2 ✓');
    console.log('3. isSameTree(null, null): 左子树的子节点 ✓');
    console.log('4. isSameTree(null, null): 右子树的子节点 ✓');
    console.log('5. isSameTree(right1, right2): 比较节点3和3 ✓');
    console.log('6. isSameTree(null, null): 左子树的子节点 ✓');
    console.log('7. isSameTree(null, null): 右子树的子节点 ✓');
    console.log('最终结果: true');
}

// 复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. 递归法（推荐）:');
    console.log('   时间复杂度: O(min(m,n)) - 最多访问较小树的所有节点');
    console.log('   空间复杂度: O(min(m,n)) - 递归栈深度等于较小树的高度');
    console.log('   优点: 代码简洁，逻辑清晰');
    console.log('   缺点: 递归调用有额外开销');
    console.log('');

    console.log('2. 迭代栈法:');
    console.log('   时间复杂度: O(min(m,n)) - 访问较小树的所有节点');
    console.log('   空间复杂度: O(min(m,n)) - 栈存储节点对');
    console.log('   优点: 避免递归调用开销');
    console.log('   缺点: 代码稍复杂');
    console.log('');

    console.log('3. 层序遍历法:');
    console.log('   时间复杂度: O(min(m,n)) - 逐层比较节点');
    console.log('   空间复杂度: O(w) - w为树的最大宽度');
    console.log('   优点: 按层比较，直观');
    console.log('   缺点: 需要额外的队列操作');
    console.log('');

    console.log('4. 序列化法:');
    console.log('   时间复杂度: O(m+n) - 需要遍历两棵完整的树');
    console.log('   空间复杂度: O(m+n) - 存储序列化字符串');
    console.log('   优点: 思路简单');
    console.log('   缺点: 时间和空间开销较大，无法提前终止');
}

// 扩展应用
function extendedApplications() {
    console.log('\n=== 扩展应用 ===');

    console.log('1. 子树问题:');
    console.log('   判断一棵树是否是另一棵树的子树');
    console.log('   可以结合当前算法来解决');
    console.log('');

    console.log('2. 对称二叉树:');
    console.log('   判断二叉树是否镜像对称');
    console.log('   类似思路，但比较的是镜像位置');
    console.log('');

    console.log('3. 前端应用场景:');
    console.log('   - Virtual DOM差异比较');
    console.log('   - 配置文件结构验证');
    console.log('   - 数据结构相等性检查');
    console.log('   - 树形组件状态比较');
    console.log('');

    console.log('4. 算法变种:');
    console.log('   - 比较多叉树');
    console.log('   - 忽略某些属性的树比较');
    console.log('   - 带权重的树结构比较');
}

// 运行测试
if (require.main === module) {
    runTests();
    performanceTest();
    recursionDemo();
    complexityAnalysis();
    extendedApplications();
}