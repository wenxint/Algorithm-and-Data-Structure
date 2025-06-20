/**
 * LeetCode 015: 二叉树的最大深度 (Maximum Depth of Binary Tree)
 *
 * 题目描述：
 * 给定一个二叉树，找出其最大深度。
 * 二叉树的深度为根节点到最远叶子节点的最长路径上的节点数。
 * 说明: 叶子节点是指没有子节点的节点。
 *
 * 核心思想：
 * 递归分治 - 一棵树的最大深度等于其左右子树的最大深度加1
 *
 * 算法原理：
 * 1. 递归求解：maxDepth(root) = 1 + max(maxDepth(left), maxDepth(right))
 * 2. 边界条件：空节点的深度为0
 * 3. 迭代解法：使用层序遍历或深度优先遍历
 */

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
 * 分治思想，将问题分解为子问题
 * 当前节点的最大深度 = 1 + max(左子树深度, 右子树深度)
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number} 二叉树的最大深度
 * @time O(n) n是节点数，每个节点访问一次
 * @space O(h) h是树的高度，递归栈空间
 */
function maxDepth(root) {
    // 边界条件：空节点深度为0
    if (!root) {
        return 0;
    }

    // 递归计算左右子树的最大深度
    const leftDepth = maxDepth(root.left);
    const rightDepth = maxDepth(root.right);

    // 当前节点深度 = 1 + 较大的子树深度
    return 1 + Math.max(leftDepth, rightDepth);
}

/**
 * 解法二：简化递归法
 *
 * 核心思想：
 * 更简洁的递归写法，直接在递归调用中计算最大值
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number} 二叉树的最大深度
 * @time O(n)
 * @space O(h)
 */
function maxDepthSimple(root) {
    return !root ? 0 : 1 + Math.max(maxDepthSimple(root.left), maxDepthSimple(root.right));
}

/**
 * 解法三：层序遍历法（BFS）
 *
 * 核心思想：
 * 使用队列进行层序遍历，每遍历完一层深度加1
 * 最终遍历完所有层后得到最大深度
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number} 二叉树的最大深度
 * @time O(n) 每个节点访问一次
 * @space O(w) w是树的最大宽度
 */
function maxDepthBFS(root) {
    if (!root) return 0;

    const queue = [root];
    let depth = 0;

    while (queue.length > 0) {
        // 当前层的节点数量
        const levelSize = queue.length;

        // 处理当前层的所有节点
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();

            // 将下一层的节点加入队列
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }

        // 处理完一层，深度加1
        depth++;
    }

    return depth;
}

/**
 * 解法四：深度优先遍历法（DFS）
 *
 * 核心思想：
 * 使用栈进行深度优先遍历，同时记录每个节点的深度
 * 在遍历过程中更新最大深度
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number} 二叉树的最大深度
 * @time O(n) 每个节点访问一次
 * @space O(h) 栈的最大深度
 */
function maxDepthDFS(root) {
    if (!root) return 0;

    const stack = [[root, 1]]; // [节点, 深度]
    let maxDepthValue = 0;

    while (stack.length > 0) {
        const [node, currentDepth] = stack.pop();

        // 更新最大深度
        maxDepthValue = Math.max(maxDepthValue, currentDepth);

        // 将子节点压入栈，深度加1
        if (node.left) {
            stack.push([node.left, currentDepth + 1]);
        }
        if (node.right) {
            stack.push([node.right, currentDepth + 1]);
        }
    }

    return maxDepthValue;
}

/**
 * 解法五：前序遍历法
 *
 * 核心思想：
 * 在前序遍历过程中记录当前深度，更新最大深度
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number} 二叉树的最大深度
 * @time O(n)
 * @space O(h)
 */
function maxDepthPreorder(root) {
    let maxDepthValue = 0;

    function preorder(node, depth) {
        if (!node) return;

        // 更新最大深度
        maxDepthValue = Math.max(maxDepthValue, depth);

        // 递归遍历左右子树
        preorder(node.left, depth + 1);
        preorder(node.right, depth + 1);
    }

    preorder(root, 1);
    return maxDepthValue;
}

/**
 * 解法六：后序遍历法
 *
 * 核心思想：
 * 后序遍历的方式，从叶子节点开始计算深度
 * 每个节点的深度等于其子节点的最大深度加1
 *
 * @param {TreeNode} root - 二叉树根节点
 * @returns {number} 二叉树的最大深度
 * @time O(n)
 * @space O(h)
 */
function maxDepthPostorder(root) {
    function postorder(node) {
        if (!node) return 0;

        // 先计算左右子树的深度
        const leftDepth = postorder(node.left);
        const rightDepth = postorder(node.right);

        // 当前节点的深度
        return 1 + Math.max(leftDepth, rightDepth);
    }

    return postorder(root);
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

// 辅助函数：打印二叉树（可视化）
function printTree(root) {
    if (!root) {
        console.log('空树');
        return;
    }

    const levels = [];
    const queue = [root];

    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];

        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node ? node.val : 'null');

            if (node) {
                queue.push(node.left);
                queue.push(node.right);
            }
        }

        // 检查是否还有非空节点
        const hasNext = queue.some(node => node !== null);
        levels.push(currentLevel);

        if (!hasNext) break;
    }

    levels.forEach((level, index) => {
        console.log(`第${index + 1}层: [${level.join(', ')}]`);
    });
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 015: 二叉树的最大深度 测试 ===\n');

    const testCases = [
        {
            tree: [3, 9, 20, null, null, 15, 7],
            expected: 3,
            description: '标准示例树'
        },
        {
            tree: [1, null, 2],
            expected: 2,
            description: '右偏斜树'
        },
        {
            tree: [1, 2, null, 3, null, 4],
            expected: 4,
            description: '左偏斜树'
        },
        {
            tree: [],
            expected: 0,
            description: '空树'
        },
        {
            tree: [0],
            expected: 1,
            description: '单节点树'
        },
        {
            tree: [1, 2, 3, 4, 5, 6, 7],
            expected: 3,
            description: '完全二叉树'
        },
        {
            tree: [1, 2, 3, 4, null, null, 7, 8],
            expected: 4,
            description: '不平衡树'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`输入: [${test.tree.join(', ')}]`);

        const root = createBinaryTree(test.tree);

        // 打印树结构
        if (test.tree.length > 0 && test.tree.length <= 10) {
            printTree(root);
        }

        // 测试所有解法
        const result1 = maxDepth(root);
        const result2 = maxDepthSimple(root);
        const result3 = maxDepthBFS(root);
        const result4 = maxDepthDFS(root);
        const result5 = maxDepthPreorder(root);
        const result6 = maxDepthPostorder(root);

        console.log(`递归法结果: ${result1}`);
        console.log(`简化递归法结果: ${result2}`);
        console.log(`层序遍历法结果: ${result3}`);
        console.log(`深度优先遍历法结果: ${result4}`);
        console.log(`前序遍历法结果: ${result5}`);
        console.log(`后序遍历法结果: ${result6}`);

        // 验证结果
        const results = [result1, result2, result3, result4, result5, result6];
        const allCorrect = results.every(result => result === test.expected);
        console.log(`期望结果: ${test.expected}`);
        console.log(`结果验证: ${allCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能测试 ===');

    // 创建大型平衡二叉树
    const size = 1000;
    const values = Array.from({ length: size }, (_, i) => i);
    const balancedTree = createBinaryTree(values);

    console.log(`测试数据规模: ${size} 个节点的平衡树`);

    console.time('递归法');
    const result1 = maxDepth(balancedTree);
    console.timeEnd('递归法');

    console.time('简化递归法');
    const result2 = maxDepthSimple(balancedTree);
    console.timeEnd('简化递归法');

    console.time('层序遍历法');
    const result3 = maxDepthBFS(balancedTree);
    console.timeEnd('层序遍历法');

    console.time('深度优先遍历法');
    const result4 = maxDepthDFS(balancedTree);
    console.timeEnd('深度优先遍历法');

    console.log(`所有方法结果一致: ${result1 === result2 && result2 === result3 && result3 === result4 ? '✅' : '❌'}`);
    console.log(`平衡树深度: ${result1}`);

    // 创建偏斜树测试
    console.log('\n偏斜树测试:');
    const skewedValues = Array.from({ length: 100 }, (_, i) => i);
    // 构造左偏斜树：每个节点只有左子节点
    const skewedArray = [];
    for (let i = 0; i < 100; i++) {
        skewedArray.push(i);
        if (i < 99) skewedArray.push(null); // 右子节点为null
    }

    const skewedTree = createBinaryTree(skewedValues.map((val, i) => i % 2 === 0 ? val : null));

    console.time('递归法(偏斜树)');
    const skewedResult = maxDepth(skewedTree);
    console.timeEnd('递归法(偏斜树)');

    console.log(`偏斜树深度: ${skewedResult}`);
}

// 递归算法详解
function recursionDemo() {
    console.log('\n=== 递归算法详解 ===');

    console.log('递归函数的定义：');
    console.log('maxDepth(root) = ');
    console.log('  - 0, 如果 root == null');
    console.log('  - 1 + max(maxDepth(root.left), maxDepth(root.right)), 其他情况');
    console.log('');

    console.log('递归过程示例：');
    const tree = createBinaryTree([3, 9, 20, null, null, 15, 7]);

    console.log('树结构: [3, 9, 20, null, null, 15, 7]');
    printTree(tree);
    console.log('');
    console.log('递归调用过程：');
    console.log('1. maxDepth(3): 需要计算左右子树深度');
    console.log('2. maxDepth(9): 叶子节点，返回1');
    console.log('3. maxDepth(20): 需要计算左右子树深度');
    console.log('4. maxDepth(15): 叶子节点，返回1');
    console.log('5. maxDepth(7): 叶子节点，返回1');
    console.log('6. 节点20深度: 1 + max(1, 1) = 2');
    console.log('7. 根节点3深度: 1 + max(1, 2) = 3');
    console.log('最终结果: 3');
}

// 复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. 递归法（推荐）:');
    console.log('   时间复杂度: O(n) - 每个节点访问一次');
    console.log('   空间复杂度: O(h) - 递归栈深度等于树高度');
    console.log('   优点: 代码简洁，符合分治思想');
    console.log('   缺点: 递归调用有额外开销');
    console.log('');

    console.log('2. 层序遍历法:');
    console.log('   时间复杂度: O(n) - 每个节点访问一次');
    console.log('   空间复杂度: O(w) - w为树的最大宽度');
    console.log('   优点: 直观理解，按层计算');
    console.log('   缺点: 需要额外的队列空间');
    console.log('');

    console.log('3. 深度优先遍历法:');
    console.log('   时间复杂度: O(n) - 每个节点访问一次');
    console.log('   空间复杂度: O(h) - 栈的最大深度');
    console.log('   优点: 迭代实现，避免递归开销');
    console.log('   缺点: 需要额外的栈空间和深度记录');
    console.log('');

    console.log('4. 前序/后序遍历法:');
    console.log('   时间复杂度: O(n) - 每个节点访问一次');
    console.log('   空间复杂度: O(h) - 递归栈深度');
    console.log('   优点: 遍历过程中直接计算');
    console.log('   缺点: 需要额外的全局变量');
}

// 边界情况分析
function edgeCaseAnalysis() {
    console.log('\n=== 边界情况分析 ===');

    console.log('1. 空树:');
    console.log('   输入: null');
    console.log('   输出: 0');
    console.log('   处理: 直接返回0');
    console.log('');

    console.log('2. 单节点树:');
    console.log('   输入: [1]');
    console.log('   输出: 1');
    console.log('   处理: 1 + max(0, 0) = 1');
    console.log('');

    console.log('3. 完全偏斜树:');
    console.log('   输入: [1, 2, null, 3, null, 4]');
    console.log('   输出: 4');
    console.log('   处理: 递归深度等于节点数');
    console.log('');

    console.log('4. 满二叉树:');
    console.log('   输入: [1, 2, 3, 4, 5, 6, 7]');
    console.log('   输出: 3');
    console.log('   处理: 深度为log(n+1)');
}

// 扩展应用
function extendedApplications() {
    console.log('\n=== 扩展应用 ===');

    console.log('1. 二叉树的最小深度:');
    console.log('   找到根节点到叶子节点的最短路径');
    console.log('   需要特别处理只有一个子节点的情况');
    console.log('');

    console.log('2. 平衡二叉树判断:');
    console.log('   检查左右子树高度差是否超过1');
    console.log('   需要在计算深度的同时检查平衡性');
    console.log('');

    console.log('3. 前端应用场景:');
    console.log('   - DOM树深度计算');
    console.log('   - 组件嵌套层级分析');
    console.log('   - 文件目录层级统计');
    console.log('   - 数据结构复杂度评估');
    console.log('');

    console.log('4. 算法变种:');
    console.log('   - 多叉树的最大深度');
    console.log('   - 带权重的路径深度');
    console.log('   - 路径和等于目标值的深度');
}

// 数学证明
function mathematicalProof() {
    console.log('\n=== 数学证明 ===');

    console.log('递归算法的正确性证明：');
    console.log('');
    console.log('设 T 是一棵二叉树，depth(T) 表示树 T 的最大深度');
    console.log('');
    console.log('基础情况：');
    console.log('- 如果 T 为空，则 depth(T) = 0 ✓');
    console.log('');
    console.log('递归情况：');
    console.log('- 如果 T 非空，设 T 的左右子树分别为 L 和 R');
    console.log('- 则 depth(T) = 1 + max(depth(L), depth(R))');
    console.log('');
    console.log('证明：');
    console.log('- 根节点到最远叶子节点的路径必然经过根节点');
    console.log('- 该路径在左右子树中的部分是子树中的最长路径');
    console.log('- 因此总长度 = 根节点(1) + 子树最长路径');
    console.log('- 即 depth(T) = 1 + max(depth(L), depth(R)) ✓');
}

// 运行测试
if (require.main === module) {
    runTests();
    performanceTest();
    recursionDemo();
    complexityAnalysis();
    edgeCaseAnalysis();
    extendedApplications();
    mathematicalProof();
}