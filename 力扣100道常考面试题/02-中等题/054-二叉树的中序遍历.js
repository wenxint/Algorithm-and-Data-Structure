/**
 * LeetCode 94. 二叉树的中序遍历
 *
 * 问题描述：
 * 给定一个二叉树的根节点 root ，返回它的中序遍历。
 *
 * 核心思想：
 * 中序遍历的顺序是：左子树 -> 根节点 -> 右子树
 * 可以用递归、迭代（栈）、Morris遍历三种方式实现
 *
 * 遍历顺序特点：
 * - 对于二叉搜索树，中序遍历得到的是递增序列
 * - 中序遍历可以用来验证二叉搜索树的合法性
 *
 * 示例：
 * 输入：root = [1,null,2,3]
 * 输出：[1,3,2]
 * 解释：
 *   1
 *    \
 *     2
 *    /
 *   3
 * 中序遍历：左(无) -> 根(1) -> 右子树中序遍历[3,2]
 */

/**
 * 二叉树节点定义
 */
function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
}

/**
 * 二叉树的中序遍历 - 递归方法（面试推荐）
 * @param {TreeNode} root - 树根节点
 * @return {number[]} 中序遍历结果数组
 * @time O(n) 时间复杂度，访问每个节点一次
 * @space O(h) 空间复杂度，h为树的高度（递归栈）
 */
function inorderTraversal(root) {
    const result = [];

    function inorder(node) {
        if (!node) return;

        // 递归遍历左子树
        inorder(node.left);

        // 访问根节点
        result.push(node.val);

        // 递归遍历右子树
        inorder(node.right);
    }

    inorder(root);
    return result;
}

/**
 * 二叉树的中序遍历 - 迭代方法（栈）
 * @param {TreeNode} root - 树根节点
 * @return {number[]} 中序遍历结果数组
 * @time O(n) 时间复杂度
 * @space O(h) 空间复杂度，h为树的高度（栈空间）
 */
function inorderTraversalIterative(root) {
    const result = [];
    const stack = [];
    let current = root;

    while (current || stack.length > 0) {
        // 一直往左走到底，将路径上的节点都入栈
        while (current) {
            stack.push(current);
            current = current.left;
        }

        // 弹出栈顶节点并访问
        current = stack.pop();
        result.push(current.val);

        // 转向右子树
        current = current.right;
    }

    return result;
}

/**
 * 二叉树的中序遍历 - Morris遍历（O(1)空间）
 * @param {TreeNode} root - 树根节点
 * @return {number[]} 中序遍历结果数组
 * @time O(n) 时间复杂度
 * @space O(1) 空间复杂度，不使用额外的栈或递归
 */
function inorderTraversalMorris(root) {
    const result = [];
    let current = root;

    while (current) {
        if (!current.left) {
            // 没有左子树，直接访问当前节点，然后移到右子树
            result.push(current.val);
            current = current.right;
        } else {
            // 有左子树，找到前驱节点
            let predecessor = current.left;

            // 找到左子树的最右节点（中序遍历的前驱）
            while (predecessor.right && predecessor.right !== current) {
                predecessor = predecessor.right;
            }

            if (!predecessor.right) {
                // 第一次到达，建立线索
                predecessor.right = current;
                current = current.left;
            } else {
                // 第二次到达，恢复树结构并访问节点
                predecessor.right = null;
                result.push(current.val);
                current = current.right;
            }
        }
    }

    return result;
}

/**
 * 二叉树的中序遍历 - 详细分析版本
 * @param {TreeNode} root - 树根节点
 * @return {number[]} 中序遍历结果数组
 */
function inorderTraversalWithAnalysis(root) {
    if (!root) {
        console.log('空树，无需遍历');
        return [];
    }

    console.log('开始中序遍历分析');
    const result = [];
    let step = 0;

    function inorder(node, depth = 0) {
        if (!node) return;

        const indent = '  '.repeat(depth);
        step++;

        console.log(`${indent}步骤${step}: 访问节点${node.val} (深度${depth})`);

        // 遍历左子树
        console.log(`${indent}  → 进入左子树`);
        inorder(node.left, depth + 1);

        // 访问根节点
        result.push(node.val);
        console.log(`${indent}  ✓ 访问节点${node.val}，加入结果`);

        // 遍历右子树
        console.log(`${indent}  → 进入右子树`);
        inorder(node.right, depth + 1);

        console.log(`${indent}  ← 返回节点${node.val}`);
    }

    inorder(root);

    console.log(`遍历完成，共${step}步`);
    console.log(`中序遍历结果: [${result.join(', ')}]`);

    return result;
}

/**
 * 二叉树的中序遍历 - 迭代详细版本
 * @param {TreeNode} root - 树根节点
 * @return {number[]} 中序遍历结果数组
 */
function inorderTraversalIterativeDetailed(root) {
    if (!root) {
        console.log('空树，无需遍历');
        return [];
    }

    console.log('开始迭代中序遍历');
    const result = [];
    const stack = [];
    let current = root;
    let step = 0;

    while (current || stack.length > 0) {
        step++;

        if (current) {
            console.log(`步骤${step}: 访问节点${current.val}，入栈并向左`);
            stack.push(current);
            console.log(`  栈状态: [${stack.map(n => n.val).join(', ')}]`);
            current = current.left;
        } else {
            console.log(`步骤${step}: 左子树已空，弹出栈顶节点`);
            current = stack.pop();
            result.push(current.val);
            console.log(`  访问节点${current.val}，加入结果: [${result.join(', ')}]`);
            console.log(`  栈状态: [${stack.map(n => n.val).join(', ')}]`);
            current = current.right;
        }
    }

    console.log(`迭代遍历完成，共${step}步`);
    return result;
}

/**
 * 二叉树的中序遍历 - 通用遍历框架
 * @param {TreeNode} root - 树根节点
 * @param {string} order - 遍历顺序：'pre', 'in', 'post'
 * @return {number[]} 遍历结果数组
 */
function universalTraversal(root, order = 'in') {
    const result = [];

    function traverse(node) {
        if (!node) return;

        if (order === 'pre') result.push(node.val);  // 前序

        traverse(node.left);

        if (order === 'in') result.push(node.val);   // 中序

        traverse(node.right);

        if (order === 'post') result.push(node.val); // 后序
    }

    traverse(root);
    return result;
}

/**
 * 构建测试用的二叉树
 * @param {number[]} values - 层序遍历的节点值数组，null表示空节点
 * @return {TreeNode} 构建的二叉树根节点
 */
function buildTree(values) {
    if (!values || values.length === 0) return null;

    const root = new TreeNode(values[0]);
    const queue = [root];
    let i = 1;

    while (queue.length > 0 && i < values.length) {
        const node = queue.shift();

        // 添加左子节点
        if (i < values.length && values[i] !== null) {
            node.left = new TreeNode(values[i]);
            queue.push(node.left);
        }
        i++;

        // 添加右子节点
        if (i < values.length && values[i] !== null) {
            node.right = new TreeNode(values[i]);
            queue.push(node.right);
        }
        i++;
    }

    return root;
}

/**
 * 打印二叉树结构
 * @param {TreeNode} root - 树根节点
 */
function printTree(root) {
    if (!root) {
        console.log('空树');
        return;
    }

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

    // 移除末尾的null
    while (result.length > 0 && result[result.length - 1] === null) {
        result.pop();
    }

    console.log(`树结构: [${result.join(', ')}]`);
}

/**
 * 可视化二叉树
 * @param {TreeNode} root - 树根节点
 */
function visualizeTree(root) {
    if (!root) {
        console.log('空树');
        return;
    }

    const lines = [];

    function buildVisualization(node, prefix = '', isLast = true) {
        if (!node) return;

        // 添加当前节点
        lines.push(prefix + (isLast ? '└── ' : '├── ') + node.val);

        // 准备子节点的前缀
        const newPrefix = prefix + (isLast ? '    ' : '│   ');

        // 递归处理子节点
        if (node.left || node.right) {
            if (node.right) {
                buildVisualization(node.right, newPrefix, !node.left);
            }
            if (node.left) {
                buildVisualization(node.left, newPrefix, true);
            }
        }
    }

    buildVisualization(root);
    console.log('二叉树可视化:');
    lines.forEach(line => console.log(line));
}

/**
 * 验证中序遍历结果
 * @param {TreeNode} root - 树根节点
 * @return {object} 验证结果和统计信息
 */
function validateInorderTraversal(root) {
    const recursive = inorderTraversal(root);
    const iterative = inorderTraversalIterative(root);
    const morris = inorderTraversalMorris(root);

    const isConsistent = JSON.stringify(recursive) === JSON.stringify(iterative) &&
                        JSON.stringify(iterative) === JSON.stringify(morris);

    return {
        recursive,
        iterative,
        morris,
        isConsistent,
        nodeCount: recursive.length
    };
}

/**
 * 测试函数
 */
function testInorderTraversal() {
    const testCases = [
        {
            values: [1, null, 2, 3],
            expected: [1, 3, 2],
            description: "经典测试用例：右偏树"
        },
        {
            values: [1, 2, 3, 4, 5, 6, 7],
            expected: [4, 2, 5, 1, 6, 3, 7],
            description: "完全二叉树：标准中序遍历"
        },
        {
            values: [],
            expected: [],
            description: "空树：无节点"
        },
        {
            values: [1],
            expected: [1],
            description: "单节点树"
        },
        {
            values: [1, 2, null, 3, null, null, null, 4],
            expected: [4, 3, 2, 1],
            description: "左偏斜树"
        },
        {
            values: [5, 3, 7, 2, 4, 6, 8],
            expected: [2, 3, 4, 5, 6, 7, 8],
            description: "二叉搜索树：中序遍历为递增序列"
        }
    ];

    console.log("🌳 二叉树的中序遍历算法测试");
    console.log("=========================");

    testCases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`输入: [${testCase.values.join(', ')}]`);

        const root = buildTree(testCase.values);
        printTree(root);

        const validation = validateInorderTraversal(root);

        console.log(`递归方法结果: [${validation.recursive.join(', ')}]`);
        console.log(`迭代方法结果: [${validation.iterative.join(', ')}]`);
        console.log(`Morris方法结果: [${validation.morris.join(', ')}]`);
        console.log(`期望结果: [${testCase.expected.join(', ')}]`);
        console.log(`方法一致性: ${validation.isConsistent ? '✅' : '❌'}`);

        const arraysEqual = (a, b) => {
            if (a.length !== b.length) return false;
            for (let i = 0; i < a.length; i++) {
                if (a[i] !== b[i]) return false;
            }
            return true;
        };

        const passed = arraysEqual(validation.recursive, testCase.expected) &&
                      validation.isConsistent;

        console.log(`测试${passed ? '✅ 通过' : '❌ 失败'}`);

        // 详细分析第二个用例（完全二叉树）
        if (index === 1) {
            console.log('\n--- 二叉树可视化 ---');
            visualizeTree(root);

            console.log('\n--- 详细遍历过程 ---');
            inorderTraversalWithAnalysis(buildTree(testCase.values));

            console.log('\n--- 三种遍历对比 ---');
            const preorder = universalTraversal(buildTree(testCase.values), 'pre');
            const inorder = universalTraversal(buildTree(testCase.values), 'in');
            const postorder = universalTraversal(buildTree(testCase.values), 'post');

            console.log(`前序遍历: [${preorder.join(', ')}]`);
            console.log(`中序遍历: [${inorder.join(', ')}]`);
            console.log(`后序遍历: [${postorder.join(', ')}]`);
        }
    });
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n📊 性能测试");
    console.log("===========");

    // 构建不同类型的测试树
    function buildBalancedTree(depth) {
        if (depth <= 0) return null;

        const root = new TreeNode(1);
        const queue = [root];
        let nodeCount = 1;
        let currentDepth = 1;

        while (currentDepth < depth && queue.length > 0) {
            const levelSize = queue.length;

            for (let i = 0; i < levelSize; i++) {
                const node = queue.shift();

                if (currentDepth < depth) {
                    node.left = new TreeNode(++nodeCount);
                    node.right = new TreeNode(++nodeCount);
                    queue.push(node.left, node.right);
                }
            }

            currentDepth++;
        }

        return root;
    }

    function buildSkewedTree(size) {
        if (size <= 0) return null;

        let root = new TreeNode(1);
        let current = root;

        for (let i = 2; i <= size; i++) {
            current.left = new TreeNode(i);
            current = current.left;
        }

        return root;
    }

    const testTrees = [
        { name: "平衡树(深度12)", tree: buildBalancedTree(12) },
        { name: "平衡树(深度15)", tree: buildBalancedTree(15) },
        { name: "左偏斜树(1000节点)", tree: buildSkewedTree(1000) },
        { name: "左偏斜树(5000节点)", tree: buildSkewedTree(5000) }
    ];

    testTrees.forEach(testTree => {
        console.log(`\n测试: ${testTree.name}`);

        // 测试递归方法
        let start = performance.now();
        const result1 = inorderTraversal(testTree.tree);
        let end = performance.now();
        console.log(`递归方法: ${(end - start).toFixed(4)}ms, 节点数: ${result1.length}`);

        // 测试迭代方法
        start = performance.now();
        const result2 = inorderTraversalIterative(testTree.tree);
        end = performance.now();
        console.log(`迭代方法: ${(end - start).toFixed(4)}ms, 节点数: ${result2.length}`);

        // 测试Morris方法
        start = performance.now();
        const result3 = inorderTraversalMorris(testTree.tree);
        end = performance.now();
        console.log(`Morris方法: ${(end - start).toFixed(4)}ms, 节点数: ${result3.length}`);

        console.log(`结果一致性: ${result1.length === result2.length && result2.length === result3.length ? '✅' : '❌'}`);
    });
}

/**
 * 中序遍历算法原理演示
 */
function demonstrateInorderConcept() {
    console.log("\n🎯 中序遍历算法原理演示");
    console.log("=======================");

    // 构建一个简单的二叉搜索树
    const root = buildTree([4, 2, 6, 1, 3, 5, 7]);

    console.log('示例二叉搜索树:');
    console.log('      4');
    console.log('     / \\');
    console.log('    2   6');
    console.log('   / \\ / \\');
    console.log('  1  3 5  7');

    console.log('\n中序遍历特点:');
    console.log('1. 遍历顺序：左子树 → 根节点 → 右子树');
    console.log('2. 对于二叉搜索树，得到递增序列');
    console.log('3. 可以用于验证BST的合法性');

    console.log('\n遍历过程分解:');
    console.log('访问节点4 → 先访问左子树(2)');
    console.log('  访问节点2 → 先访问左子树(1)');
    console.log('    访问节点1 → 无左子树 → 输出1 → 无右子树');
    console.log('  输出2 → 访问右子树(3)');
    console.log('    访问节点3 → 无左子树 → 输出3 → 无右子树');
    console.log('输出4 → 访问右子树(6)');
    console.log('  访问节点6 → 先访问左子树(5)');
    console.log('    访问节点5 → 无左子树 → 输出5 → 无右子树');
    console.log('  输出6 → 访问右子树(7)');
    console.log('    访问节点7 → 无左子树 → 输出7 → 无右子树');

    const result = inorderTraversal(root);
    console.log(`\n最终结果: [${result.join(', ')}]`);
    console.log('验证: 这是一个递增序列，证明是有效的BST');
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TreeNode,
        inorderTraversal,
        inorderTraversalIterative,
        inorderTraversalMorris,
        inorderTraversalWithAnalysis,
        inorderTraversalIterativeDetailed,
        universalTraversal,
        buildTree,
        printTree,
        visualizeTree,
        validateInorderTraversal,
        testInorderTraversal,
        performanceTest,
        demonstrateInorderConcept
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.inorderTraversal = inorderTraversal;
    window.testInorderTraversal = testInorderTraversal;
}

// 运行测试
// testInorderTraversal();
// performanceTest();
// demonstrateInorderConcept();