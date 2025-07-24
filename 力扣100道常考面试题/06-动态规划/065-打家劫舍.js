/**
 * LeetCode 198. 打家劫舍
 *
 * 问题描述：
 * 你是一个专业的小偷，计划偷窃沿街的房屋。每间房内都藏有一定的现金，
 * 影响你偷窃的唯一制约因素就是相邻的房屋装有相互连通的防盗系统，
 * 如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
 *
 * 核心思想：
 * 动态规划：对于每间房屋，有偷和不偷两种选择
 * dp[i] = max(dp[i-2] + nums[i], dp[i-1])
 * 偷第i间房 = 前i-2间房的最大收益 + 第i间房的金额
 * 不偷第i间房 = 前i-1间房的最大收益
 *
 * 示例：
 * 输入：[1,2,3,1]
 * 输出：4 (偷窃1号房屋和3号房屋，金额 = 1 + 3 = 4)
 */

/**
 * 打家劫舍 - 动态规划解法（面试推荐）
 * @param {number[]} nums - 房屋金额数组
 * @return {number} 最大偷窃金额
 * @time O(n) 时间复杂度
 * @space O(n) 空间复杂度
 */
function rob(nums) {
    // 边界条件处理
    if (!nums || nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    if (nums.length === 2) return Math.max(nums[0], nums[1]);

    const n = nums.length;
    const dp = new Array(n);

    // 初始化前两个状态
    dp[0] = nums[0];                        // 只有第1间房时，只能偷第1间
    dp[1] = Math.max(nums[0], nums[1]);     // 有两间房时，偷价值更高的

    // 状态转移
    for (let i = 2; i < n; i++) {
        // 偷第i间房：前i-2间房的最大收益 + 第i间房金额
        // 不偷第i间房：前i-1间房的最大收益
        dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1]);
    }

    return dp[n - 1];
}

/**
 * 打家劫舍 - 空间优化版本
 * @param {number[]} nums - 房屋金额数组
 * @return {number} 最大偷窃金额
 * @time O(n) 时间复杂度
 * @space O(1) 空间复杂度
 */
function robOptimized(nums) {
    if (!nums || nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];

    // 只需要保存前两个状态
    let prev2 = nums[0];                    // dp[i-2]
    let prev1 = Math.max(nums[0], nums[1]); // dp[i-1]

    for (let i = 2; i < nums.length; i++) {
        const current = Math.max(prev2 + nums[i], prev1);
        prev2 = prev1;
        prev1 = current;
    }

    return prev1;
}

/**
 * 打家劫舍 - 记忆化递归
 * @param {number[]} nums - 房屋金额数组
 * @return {number} 最大偷窃金额
 */
function robMemo(nums) {
    if (!nums || nums.length === 0) return 0;

    const memo = new Map();

    function robHelper(index) {
        // 递归终止条件
        if (index < 0) return 0;
        if (index === 0) return nums[0];

        // 查找缓存
        if (memo.has(index)) {
            return memo.get(index);
        }

        // 递归计算：偷当前房屋 vs 不偷当前房屋
        const robCurrent = nums[index] + robHelper(index - 2);  // 偷当前房屋
        const skipCurrent = robHelper(index - 1);               // 不偷当前房屋

        const maxAmount = Math.max(robCurrent, skipCurrent);
        memo.set(index, maxAmount);

        return maxAmount;
    }

    return robHelper(nums.length - 1);
}

/**
 * 打家劫舍 - 详细分析版本（便于理解）
 * @param {number[]} nums - 房屋金额数组
 * @return {number} 最大偷窃金额
 */
function robWithAnalysis(nums) {
    if (!nums || nums.length === 0) {
        console.log('没有房屋可偷');
        return 0;
    }

    console.log(`房屋金额: [${nums.join(', ')}]`);

    if (nums.length === 1) {
        console.log('只有一间房屋，偷窃金额:', nums[0]);
        return nums[0];
    }

    if (nums.length === 2) {
        const max = Math.max(nums[0], nums[1]);
        console.log(`两间房屋，选择金额更高的: ${max}`);
        return max;
    }

    const n = nums.length;
    const dp = new Array(n);

    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);

    console.log('动态规划过程:');
    console.log(`dp[0] = ${dp[0]} (只偷第1间房)`);
    console.log(`dp[1] = ${dp[1]} (偷前2间房的最优方案)`);

    for (let i = 2; i < n; i++) {
        const robCurrent = dp[i - 2] + nums[i];  // 偷当前房屋
        const skipCurrent = dp[i - 1];           // 不偷当前房屋

        dp[i] = Math.max(robCurrent, skipCurrent);

        console.log(`dp[${i}] = max(${dp[i - 2]} + ${nums[i]}, ${dp[i - 1]}) = max(${robCurrent}, ${skipCurrent}) = ${dp[i]}`);
    }

    console.log(`最大偷窃金额: ${dp[n - 1]}`);
    return dp[n - 1];
}

/**
 * 获取偷窃方案（哪些房屋被偷）
 * @param {number[]} nums - 房屋金额数组
 * @return {object} 包含最大金额和偷窃方案
 */
function robWithPlan(nums) {
    if (!nums || nums.length === 0) return { maxAmount: 0, plan: [] };
    if (nums.length === 1) return { maxAmount: nums[0], plan: [0] };

    const n = nums.length;
    const dp = new Array(n);

    dp[0] = nums[0];
    dp[1] = Math.max(nums[0], nums[1]);

    for (let i = 2; i < n; i++) {
        dp[i] = Math.max(dp[i - 2] + nums[i], dp[i - 1]);
    }

    // 回溯找出偷窃方案
    const plan = [];
    let i = n - 1;

    while (i >= 0) {
        if (i === 0) {
            plan.push(0);
            break;
        } else if (i === 1) {
            if (nums[0] > nums[1]) {
                plan.push(0);
            } else {
                plan.push(1);
            }
            break;
        } else {
            // 检查是否偷了第i间房
            if (dp[i] === dp[i - 2] + nums[i]) {
                // 偷了第i间房
                plan.push(i);
                i -= 2;
            } else {
                // 没偷第i间房
                i -= 1;
            }
        }
    }

    plan.reverse();
    return { maxAmount: dp[n - 1], plan };
}

/**
 * 测试函数
 */
function testRob() {
    const testCases = [
        {
            nums: [1, 2, 3, 1],
            expected: 4,
            description: "经典案例：偷1号和3号房屋"
        },
        {
            nums: [2, 7, 9, 3, 1],
            expected: 12,
            description: "偷1号、3号、5号房屋：2 + 9 + 1 = 12"
        },
        {
            nums: [2, 1, 1, 2],
            expected: 4,
            description: "偷1号和4号房屋：2 + 2 = 4"
        },
        {
            nums: [5],
            expected: 5,
            description: "只有一间房屋"
        },
        {
            nums: [1, 2],
            expected: 2,
            description: "两间房屋，选择金额更高的"
        }
    ];

    console.log("🏠 打家劫舍算法测试");
    console.log("==================");

    testCases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`输入: [${testCase.nums.join(', ')}]`);

        const result1 = rob(testCase.nums);
        const result2 = robOptimized(testCase.nums);
        const result3 = robMemo(testCase.nums);
        const planResult = robWithPlan(testCase.nums);

        console.log(`基础DP结果: ${result1}`);
        console.log(`空间优化结果: ${result2}`);
        console.log(`记忆化递归结果: ${result3}`);
        console.log(`偷窃方案: 房屋[${planResult.plan.join(', ')}], 金额: ${planResult.maxAmount}`);
        console.log(`期望结果: ${testCase.expected}`);

        const passed = result1 === testCase.expected &&
                      result2 === testCase.expected &&
                      result3 === testCase.expected;

        console.log(`测试${passed ? '✅ 通过' : '❌ 失败'}`);

        // 详细分析一个用例
        if (index === 0) {
            console.log('\n--- 详细分析过程 ---');
            robWithAnalysis(testCase.nums);
        }
    });
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        rob,
        robOptimized,
        robMemo,
        robWithAnalysis,
        robWithPlan,
        testRob
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.rob = rob;
    window.testRob = testRob;
}

// 运行测试
// testRob();