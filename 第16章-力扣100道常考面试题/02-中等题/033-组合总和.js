/**
 * LeetCode 39. 组合总和
 *
 * 问题描述：
 * 给你一个 无重复元素 的整数数组 candidates 和一个目标整数 target ，
 * 找出 candidates 中可以使数字和为目标数 target 的 所有 不同组合 ，
 * 并以列表形式返回。你可以按 任意顺序 返回这些组合。
 * candidates 中的 同一个 数字可以 无限制重复被选取 。
 *
 * 核心思想：
 * 使用回溯算法（DFS + 剪枝），通过递归尝试所有可能的组合，
 * 当找到目标和时记录结果，当超过目标和时进行剪枝
 *
 * 示例：
 * 输入：candidates = [2,3,6,7], target = 7
 * 输出：[[2,2,3],[7]]
 */

/**
 * 方法一：回溯算法（经典版本）
 *
 * 核心思想：
 * 使用深度优先搜索（DFS）遍历所有可能的组合
 * - 每个位置可以选择当前数字或不选择
 * - 选择后可以继续选择相同数字（无限制重复）
 * - 当和等于目标时记录结果，当和超过目标时剪枝
 *
 * 算法步骤：
 * 1. 对数组进行排序（便于剪枝）
 * 2. 从第一个元素开始尝试
 * 3. 对每个元素，可以选择或不选择
 * 4. 选择后递归处理剩余目标值
 * 5. 回溯时移除当前选择
 *
 * @param {number[]} candidates - 候选数字数组
 * @param {number} target - 目标和
 * @returns {number[][]} 所有可能的组合
 * @time O(S) S为所有可行解的长度之和
 * @space O(target) 递归栈空间
 */
function combinationSum(candidates, target) {
    console.log(`寻找组合总和，目标值: ${target}`);
    console.log(`候选数组: [${candidates.join(', ')}]`);

    const result = [];
    const path = [];

    // 排序以便剪枝优化
    candidates.sort((a, b) => a - b);

    /**
     * 回溯递归函数
     * @param {number} startIndex - 开始搜索的索引
     * @param {number} currentSum - 当前路径的和
     */
    function backtrack(startIndex, currentSum) {
        console.log(`  回溯: 起始索引=${startIndex}, 当前和=${currentSum}, 路径=[${path.join(',')}]`);

        // 基本情况：找到目标和
        if (currentSum === target) {
            result.push([...path]); // 深拷贝当前路径
            console.log(`    ✅ 找到解: [${path.join(',')}]`);
            return;
        }

        // 剪枝：当前和已经超过目标
        if (currentSum > target) {
            console.log(`    ❌ 剪枝: 当前和${currentSum} > 目标${target}`);
            return;
        }

        // 尝试从startIndex开始的每个候选数字
        for (let i = startIndex; i < candidates.length; i++) {
            const num = candidates[i];

            // 剪枝：如果当前数字加上当前和超过目标，后续更大的数字也会超过
            if (currentSum + num > target) {
                console.log(`    ❌ 剪枝: ${currentSum} + ${num} > ${target}`);
                break;
            }

            // 选择当前数字
            path.push(num);
            console.log(`    选择数字: ${num}`);

            // 递归：注意这里传入i而不是i+1，因为可以重复使用
            backtrack(i, currentSum + num);

            // 回溯：撤销选择
            path.pop();
            console.log(`    回溯移除: ${num}`);
        }
    }

    backtrack(0, 0);

    console.log(`找到 ${result.length} 个解`);
    return result;
}

/**
 * 方法二：动态规划（自底向上）
 *
 * 核心思想：
 * 使用动态规划思想，dp[i]表示和为i的所有组合
 * 对于每个候选数字，更新所有可能的目标值
 *
 * @param {number[]} candidates - 候选数字数组
 * @param {number} target - 目标和
 * @returns {number[][]} 所有可能的组合
 * @time O(target * S) S为解的平均长度
 * @space O(target * S) 存储所有解的空间
 */
function combinationSumDP(candidates, target) {
    console.log(`\n动态规划方法，目标值: ${target}`);

    // dp[i] 存储和为i的所有组合
    const dp = Array(target + 1).fill(null).map(() => []);

    // 初始化：和为0的组合只有空组合
    dp[0] = [[]];

    // 遍历每个候选数字
    for (const num of candidates) {
        console.log(`处理候选数字: ${num}`);

        // 从num开始向上更新，避免重复计算
        for (let i = num; i <= target; i++) {
            // 如果dp[i-num]有解，那么在每个解后面加上num就得到dp[i]的新解
            for (const combination of dp[i - num]) {
                dp[i].push([...combination, num]);
                console.log(`  dp[${i}] 新增组合: [${[...combination, num].join(',')}]`);
            }
        }
    }

    return dp[target];
}

/**
 * 方法三：优化的回溯（减少重复计算）
 *
 * 核心思想：
 * 在回溯过程中加入记忆化，避免重复计算相同的子问题
 *
 * @param {number[]} candidates - 候选数字数组
 * @param {number} target - 目标和
 * @returns {number[][]} 所有可能的组合
 * @time O(S) S为所有可行解的长度之和
 * @space O(target) 递归栈空间 + 记忆化空间
 */
function combinationSumMemo(candidates, target) {
    console.log(`\n记忆化回溯方法，目标值: ${target}`);

    const memo = new Map();
    candidates.sort((a, b) => a - b);

    function backtrackMemo(startIndex, currentTarget) {
        // 基本情况
        if (currentTarget === 0) {
            return [[]];
        }
        if (currentTarget < 0 || startIndex >= candidates.length) {
            return [];
        }

        // 检查记忆化
        const key = `${startIndex},${currentTarget}`;
        if (memo.has(key)) {
            console.log(`  使用缓存: 索引=${startIndex}, 目标=${currentTarget}`);
            return memo.get(key);
        }

        const result = [];

        // 遍历从startIndex开始的候选数字
        for (let i = startIndex; i < candidates.length; i++) {
            if (candidates[i] > currentTarget) break;

            // 选择当前数字，递归求解
            const subResults = backtrackMemo(i, currentTarget - candidates[i]);

            // 将当前数字加入到每个子结果的前面
            for (const subResult of subResults) {
                result.push([candidates[i], ...subResult]);
            }
        }

        memo.set(key, result);
        return result;
    }

    return backtrackMemo(0, target);
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 验证结果是否正确
 */
function validateResult(candidates, target, result) {
    console.log("\n验证结果:");

    for (let i = 0; i < result.length; i++) {
        const combination = result[i];
        const sum = combination.reduce((acc, num) => acc + num, 0);
        const isValid = sum === target && combination.every(num => candidates.includes(num));

        console.log(`组合 ${i + 1}: [${combination.join(',')}], 和=${sum}, 有效=${isValid ? '✅' : '❌'}`);
    }
}

/**
 * 比较两个结果是否相同（忽略顺序）
 */
function compareResults(result1, result2) {
    if (result1.length !== result2.length) {
        return false;
    }

    // 将每个组合排序后比较
    const normalize = (results) =>
        results.map(combo => [...combo].sort((a, b) => a - b))
               .sort((a, b) => a.join(',').localeCompare(b.join(',')));

    const norm1 = normalize(result1);
    const norm2 = normalize(result2);

    return JSON.stringify(norm1) === JSON.stringify(norm2);
}

// ===========================================
// 测试用例
// ===========================================

/**
 * 测试函数
 */
function runTests() {
    console.log("=".repeat(50));
    console.log("组合总和算法测试");
    console.log("=".repeat(50));

    const testCases = [
        {
            candidates: [2, 3, 6, 7],
            target: 7,
            expected: [[2, 2, 3], [7]]
        },
        {
            candidates: [2, 3, 5],
            target: 8,
            expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
        },
        {
            candidates: [2],
            target: 1,
            expected: []
        },
        {
            candidates: [1],
            target: 1,
            expected: [[1]]
        },
        {
            candidates: [1],
            target: 2,
            expected: [[1, 1]]
        }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n--- 测试用例 ${index + 1} ---`);
        console.log(`候选数组: [${testCase.candidates.join(', ')}]`);
        console.log(`目标值: ${testCase.target}`);

        // 测试方法一：回溯
        console.log("\n方法一：回溯算法");
        const result1 = combinationSum([...testCase.candidates], testCase.target);
        console.log(`结果: ${JSON.stringify(result1)}`);
        validateResult(testCase.candidates, testCase.target, result1);

        // 测试方法二：动态规划
        console.log("\n方法二：动态规划");
        const result2 = combinationSumDP([...testCase.candidates], testCase.target);
        console.log(`结果: ${JSON.stringify(result2)}`);

        // 测试方法三：记忆化回溯
        console.log("\n方法三：记忆化回溯");
        const result3 = combinationSumMemo([...testCase.candidates], testCase.target);
        console.log(`结果: ${JSON.stringify(result3)}`);

        // 比较结果
        const method1Correct = compareResults(result1, testCase.expected);
        const method2Correct = compareResults(result2, testCase.expected);
        const method3Correct = compareResults(result3, testCase.expected);

        console.log(`\n结果验证:`);
        console.log(`方法一: ${method1Correct ? '✅' : '❌'}`);
        console.log(`方法二: ${method2Correct ? '✅' : '❌'}`);
        console.log(`方法三: ${method3Correct ? '✅' : '❌'}`);
    });
}

// ===========================================
// 算法演示
// ===========================================

/**
 * 算法演示函数
 */
function demonstrateAlgorithm() {
    console.log("\n" + "=".repeat(50));
    console.log("组合总和算法演示");
    console.log("=".repeat(50));

    const candidates = [2, 3, 6, 7];
    const target = 7;

    console.log(`演示数组: [${candidates.join(', ')}]`);
    console.log(`目标值: ${target}`);

    console.log("\n算法核心思想:");
    console.log("1. 使用回溯算法遍历所有可能的组合");
    console.log("2. 每个数字可以重复使用");
    console.log("3. 当和等于目标时记录结果");
    console.log("4. 当和超过目标时进行剪枝");

    console.log("\n搜索树结构:");
    console.log("                    []");
    console.log("                 /  |  \\");
    console.log("               2/   3|   \\7");
    console.log("              /     |     \\");
    console.log("           [2]     [3]    [7] ✓");
    console.log("          / |\\     / |\\");
    console.log("        2/ 3| \\6  2/ 3| \\6");
    console.log("        /   |  \\  /   |  \\");
    console.log("    [2,2] [2,3] ... [3,2] [3,3] ...");
    console.log("      |     ✓");
    console.log("     3|");
    console.log("      |");
    console.log("  [2,2,3] ✓");

    console.log("\n回溯过程:");
    const result = combinationSum(candidates, target);

    console.log(`\n时间复杂度：O(S) - S为所有可行解的长度之和`);
    console.log("空间复杂度：O(target) - 递归栈的深度");
}

// ===========================================
// 面试要点
// ===========================================

/**
 * 面试关键点总结
 */
function interviewKeyPoints() {
    console.log("\n" + "=".repeat(50));
    console.log("面试关键点");
    console.log("=".repeat(50));

    console.log("\n🎯 核心概念:");
    console.log("1. 回溯算法是解决组合问题的经典方法");
    console.log("2. 数字可以重复使用，需要在递归时传入相同的起始索引");
    console.log("3. 排序后可以进行有效剪枝");
    console.log("4. 深拷贝路径避免引用问题");

    console.log("\n🔧 实现技巧:");
    console.log("1. 排序数组便于剪枝优化");
    console.log("2. 使用startIndex避免重复组合");
    console.log("3. 及时剪枝减少无效搜索");
    console.log("4. 记忆化可以优化重复子问题");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 忘记深拷贝路径，导致结果被后续修改");
    console.log("2. 递归时传入i+1而不是i，导致数字不能重复使用");
    console.log("3. 没有排序导致剪枝效果不佳");
    console.log("4. 边界条件处理不当");

    console.log("\n🎨 变体问题:");
    console.log("1. 组合总和II（数字不能重复使用）");
    console.log("2. 组合总和III（限制组合中数字的个数）");
    console.log("3. 组合总和IV（求组合的个数）");
    console.log("4. 分割等和子集");

    console.log("\n📊 复杂度分析:");
    console.log("1. 时间复杂度：O(S)，S为所有可行解的长度之和");
    console.log("2. 空间复杂度：O(target)，递归栈的最大深度");
    console.log("3. 剪枝可以显著减少实际的搜索空间");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        combinationSum,
        combinationSumDP,
        combinationSumMemo,
        validateResult,
        compareResults,
        runTests,
        demonstrateAlgorithm,
        interviewKeyPoints
    };
}

// 如果在浏览器环境中，运行演示
if (typeof window !== 'undefined') {
    runTests();
    demonstrateAlgorithm();
    interviewKeyPoints();
}