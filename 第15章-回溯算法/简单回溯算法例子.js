/**
 * 最简单的回溯算法例子：从数组 [1, 2, 3] 中选择2个数字的所有组合
 *
 * 这是理解回溯算法最好的入门例子，通过可视化展示每一步的选择和回退过程
 *
 * 作者：算法学习助手
 * 日期：2024
 */

/**
 * 🎯 问题描述：
 * 从数组 [1, 2, 3] 中选择 2 个数字，找出所有可能的组合
 * 期望结果：[[1,2], [1,3], [2,3]]
 *
 * 注意：组合与排列的区别
 * - 组合：[1,2] 和 [2,1] 是同一个组合，顺序不重要
 * - 排列：[1,2] 和 [2,1] 是不同的排列，顺序重要
 */

/**
 * 🌟 回溯算法核心思想：
 *
 * 1. 选择（Choose）：从候选集合中选择一个元素加入当前解
 * 2. 探索（Explore）：递归地在新状态下继续搜索
 * 3. 撤销（Unchoose）：如果当前路径无法得到解，撤销刚才的选择，回到上一状态
 *
 * 这个过程类似于走迷宫：
 * - 每到一个岔路口，选择一条路走下去
 * - 如果走到死胡同，就回退到上一个岔路口
 * - 尝试其他的路径，直到找到出口或尝试完所有路径
 */

/**
 * 最简单的组合问题实现
 *
 * 核心思想：
 * 对于每个数字，我们有两种选择：选它或者不选它
 * 当我们选够了k个数字时，就找到了一个有效组合
 *
 * @param {number[]} nums - 候选数字数组 [1, 2, 3]
 * @param {number} k - 要选择的数字个数 2
 * @returns {number[][]} 所有可能的组合
 */
function simpleCombinations(nums, k) {
    const result = [];           // 存储所有找到的组合
    const currentCombination = []; // 当前正在构建的组合
    let stepCount = 0;          // 步骤计数器，用于演示

    console.log('🚀 开始回溯搜索过程：');
    console.log(`目标：从 [${nums.join(', ')}] 中选择 ${k} 个数字`);
    console.log('=====================================\n');

    /**
     * 回溯核心函数
     *
     * @param {number} startIndex - 当前考虑的数字索引，防止重复组合
     */
    function backtrack(startIndex) {
        stepCount++;
        const indent = '  '.repeat(currentCombination.length); // 根据深度缩进

        console.log(`${indent}📍 步骤 ${stepCount}: 当前组合 [${currentCombination.join(', ')}], 考虑索引 ${startIndex}`);

        // 🎯 终止条件：已经选够了 k 个数字
        if (currentCombination.length === k) {
            const foundCombination = [...currentCombination]; // 深拷贝当前组合
            result.push(foundCombination);
            console.log(`${indent}✅ 找到完整组合: [${foundCombination.join(', ')}]`);
            return; // 回退到上一层
        }

        // 🔄 尝试从 startIndex 开始的每个数字
        for (let i = startIndex; i < nums.length; i++) {
            const currentNumber = nums[i];

            // 📝 做选择：将当前数字加入组合
            currentCombination.push(currentNumber);
            console.log(`${indent}➕ 选择数字 ${currentNumber}, 当前组合: [${currentCombination.join(', ')}]`);

            // 🔍 探索：递归搜索下一个位置
            // 注意：i + 1 确保不会重复选择相同的数字，保证组合的唯一性
            backtrack(i + 1);

            // ⬅️ 撤销选择：回溯，移除刚才添加的数字
            const removed = currentCombination.pop();
            console.log(`${indent}🔙 回溯，移除数字 ${removed}, 当前组合: [${currentCombination.join(', ')}]`);
        }
    }

    // 从索引 0 开始搜索
    backtrack(0);

    console.log('\n🎉 搜索完成！');
    console.log(`📊 总共执行了 ${stepCount} 个步骤`);
    console.log(`🎯 找到的所有组合:`, result);

    return result;
}

/**
 * 🎮 测试函数：演示回溯过程
 */
function demonstrateBacktracking() {
    console.log('==================================================');
    console.log('🎓 回溯算法核心思想演示');
    console.log('==================================================');

    const nums = [1, 2, 3];
    const k = 2;

    console.log('\n🤔 思考过程：');
    console.log('对于每个数字，我们都面临一个选择：选它还是不选它？');
    console.log('我们需要系统地尝试所有可能的选择组合\n');

    const combinations = simpleCombinations(nums, k);

    console.log('\n🧠 算法思想总结：');
    console.log('1. 🎯 递归地做选择：每次选择一个未选过的数字');
    console.log('2. 🔍 深度优先搜索：优先完成当前路径的探索');
    console.log('3. 🔙 回溯撤销：当无法继续时，撤销上一步选择');
    console.log('4. 🔄 尝试其他选择：回到上一状态，尝试其他可能');
    console.log('5. ✅ 记录有效解：当找到完整解时，保存结果\n');

    return combinations;
}

/**
 * 🔍 可视化回溯树状结构
 *
 * 回溯算法的执行过程可以用树来表示：
 *
 *                   []
 *                  /  \
 *              [1]/    \[2]
 *               /       \
 *           [1,2]      [2,3]
 *             |          |
 *           ✅找到解    ✅找到解
 *
 * 每个节点代表一个状态（当前组合）
 * 每条边代表一个选择（选择某个数字）
 * 叶子节点要么是有效解，要么是死路
 */
function visualizeBacktrackingTree() {
    console.log('\n🌳 回溯算法执行树：');
    console.log('');
    console.log('                  开始 []');
    console.log('                 /   |   \\');
    console.log('            选1 /    |    \\ 选3');
    console.log('              /   选2|     \\');
    console.log('           [1]       |      [3]');
    console.log('          / \\       |       |');
    console.log('    选2  /   \\ 选3   |       | (无法选够2个)');
    console.log('       /     \\      |       |');
    console.log('   [1,2]✅   [1,3]✅ [2]     ❌');
    console.log('              |       |\\');
    console.log('              |       | \\ 选3');
    console.log('              |       |  \\');
    console.log('              |       |  [2,3]✅');
    console.log('              |       |');
    console.log('          回溯时的    回溯时的');
    console.log('          撤销路径    撤销路径');
    console.log('');
    console.log('🔴 红色路径：回溯（撤销选择）');
    console.log('✅ 绿色节点：找到有效解');
    console.log('❌ 红色节点：无效路径');
}

/**
 * 📚 回溯算法详细分析
 */
function detailedAnalysis() {
    console.log('\n📚 回溯算法详细分析：');
    console.log('');

    console.log('🎯 1. 问题特征：');
    console.log('   • 需要找到所有可能的解（不是最优解）');
    console.log('   • 解可以用一系列选择来构建');
    console.log('   • 每个选择都有多个候选项');
    console.log('   • 可以通过约束条件提前剪枝');
    console.log('');

    console.log('🔧 2. 算法结构：');
    console.log('   • 递归函数：backtrack(当前状态)');
    console.log('   • 终止条件：找到完整解或无法继续');
    console.log('   • 选择列表：当前状态下可以做的选择');
    console.log('   • 路径记录：已经做过的选择');
    console.log('');

    console.log('⚡ 3. 核心操作：');
    console.log('   • 做选择：currentPath.push(choice)');
    console.log('   • 递归探索：backtrack(newState)');
    console.log('   • 撤销选择：currentPath.pop()');
    console.log('');

    console.log('🎨 4. 关键技巧：');
    console.log('   • 剪枝：提前终止无效分支');
    console.log('   • 去重：避免生成重复解');
    console.log('   • 状态管理：正确维护递归状态');
    console.log('   • 深拷贝：保存解时避免引用问题');
    console.log('');

    console.log('📊 5. 时间复杂度：');
    console.log('   • 最坏情况：O(2^n) - 每个元素选或不选');
    console.log('   • 空间复杂度：O(n) - 递归栈深度');
    console.log('   • 实际复杂度取决于剪枝效果');
}

/**
 * 🎪 互动式回溯演示
 */
function interactiveDemo() {
    console.log('\n🎪 互动式回溯演示');
    console.log('让我们逐步观察每个关键决策点：\n');

    const nums = [1, 2, 3];
    let step = 1;

    console.log(`步骤 ${step++}: 开始状态`);
    console.log('  当前组合: []');
    console.log('  候选数字: [1, 2, 3]');
    console.log('  决策: 我们可以选择 1, 2, 或 3\n');

    console.log(`步骤 ${step++}: 选择数字 1`);
    console.log('  当前组合: [1]');
    console.log('  候选数字: [2, 3] (避免重复，只考虑1后面的)');
    console.log('  决策: 我们可以选择 2 或 3\n');

    console.log(`步骤 ${step++}: 选择数字 2`);
    console.log('  当前组合: [1, 2]');
    console.log('  长度达到目标: 2');
    console.log('  结果: ✅ 找到组合 [1, 2]\n');

    console.log(`步骤 ${step++}: 回溯，撤销数字 2`);
    console.log('  当前组合: [1]');
    console.log('  继续尝试: 选择数字 3\n');

    console.log(`步骤 ${step++}: 选择数字 3`);
    console.log('  当前组合: [1, 3]');
    console.log('  长度达到目标: 2');
    console.log('  结果: ✅ 找到组合 [1, 3]\n');

    console.log(`步骤 ${step++}: 回溯，撤销数字 3，再撤销数字 1`);
    console.log('  当前组合: []');
    console.log('  继续尝试: 选择数字 2\n');

    console.log('... 继续这个过程直到尝试完所有可能性');
}

// 🚀 执行演示
if (require.main === module) {
    demonstrateBacktracking();
    visualizeBacktrackingTree();
    detailedAnalysis();
    interactiveDemo();
}

module.exports = {
    simpleCombinations,
    demonstrateBacktracking,
    visualizeBacktrackingTree,
    detailedAnalysis
};