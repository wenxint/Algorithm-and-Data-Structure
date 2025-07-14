/**
 * LeetCode 213. 打家劫舍 II
 *
 * 问题描述：
 * 你是一个专业的小偷，计划偷窃沿街的房屋，每间房内都藏有一定的现金。
 * 这个地方所有的房屋都围成一圈，这意味着第一个房屋和最后一个房屋是紧挨着的。
 * 同时，相邻的房屋装有相互连通的防盗系统，如果两间相邻的房屋在同一晚上被小偷闯入，系统会自动报警。
 *
 * 核心思想：
 * 环形数组的动态规划问题
 * 分两种情况：
 * 1. 包含第一个房屋，不包含最后一个房屋：[0, n-2]
 * 2. 不包含第一个房屋，包含最后一个房屋：[1, n-1]
 * 取两种情况的最大值
 *
 * 示例：
 * 输入：nums = [2,3,2]
 * 输出：3 (不能同时偷第一个和最后一个房屋)
 */

/**
 * 打家劫舍 II - 环形数组（面试推荐）
 * @param {number[]} nums - 房屋金额数组
 * @return {number} 最大偷窃金额
 * @time O(n) 时间复杂度
 * @space O(1) 空间复杂度
 */
function rob(nums) {
    // 边界条件处理
    if (!nums || nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    if (nums.length === 2) return Math.max(nums[0], nums[1]);

    // 情况1：偷第一间房，不能偷最后一间房 [0, n-2]
    const case1 = robLinear(nums, 0, nums.length - 2);

    // 情况2：不偷第一间房，可以偷最后一间房 [1, n-1]
    const case2 = robLinear(nums, 1, nums.length - 1);

    return Math.max(case1, case2);
}

/**
 * 辅助函数：线性数组的打家劫舍问题
 * @param {number[]} nums - 房屋金额数组
 * @param {number} start - 起始索引
 * @param {number} end - 结束索引
 * @return {number} 最大偷窃金额
 */
function robLinear(nums, start, end) {
    if (start > end) return 0;
    if (start === end) return nums[start];

    // 空间优化：只需要保存前两个状态
    let prev2 = nums[start];                                    // dp[i-2]
    let prev1 = Math.max(nums[start], nums[start + 1]);         // dp[i-1]

    for (let i = start + 2; i <= end; i++) {
        const current = Math.max(prev2 + nums[i], prev1);
        prev2 = prev1;
        prev1 = current;
    }

    return prev1;
}

/**
 * 打家劫舍 II - 详细分析版本
 * @param {number[]} nums - 房屋金额数组
 * @return {number} 最大偷窃金额
 */
function robWithAnalysis(nums) {
    if (!nums || nums.length === 0) {
        console.log('没有房屋可偷');
        return 0;
    }

    console.log(`环形房屋金额: [${nums.join(', ')}]`);

    if (nums.length === 1) {
        console.log('只有一间房屋，偷窃金额:', nums[0]);
        return nums[0];
    }

    if (nums.length === 2) {
        const max = Math.max(nums[0], nums[1]);
        console.log(`两间房屋，选择金额更高的: ${max}`);
        return max;
    }

    console.log('\n环形数组分解为两种情况:');

    // 情况1：包含第一间房，不包含最后一间房
    console.log(`情况1: 包含第一间房，范围 [0, ${nums.length - 2}]`);
    console.log(`子数组: [${nums.slice(0, nums.length - 1).join(', ')}]`);
    const case1 = robLinearWithAnalysis(nums, 0, nums.length - 2, '情况1');

    // 情况2：不包含第一间房，包含最后一间房
    console.log(`\n情况2: 不包含第一间房，范围 [1, ${nums.length - 1}]`);
    console.log(`子数组: [${nums.slice(1).join(', ')}]`);
    const case2 = robLinearWithAnalysis(nums, 1, nums.length - 1, '情况2');

    const result = Math.max(case1, case2);
    console.log(`\n最终结果: max(${case1}, ${case2}) = ${result}`);

    return result;
}

/**
 * 辅助函数：线性数组的打家劫舍问题（带分析）
 * @param {number[]} nums - 房屋金额数组
 * @param {number} start - 起始索引
 * @param {number} end - 结束索引
 * @param {string} label - 标签
 * @return {number} 最大偷窃金额
 */
function robLinearWithAnalysis(nums, start, end, label) {
    if (start > end) {
        console.log(`${label}: 无效范围，返回0`);
        return 0;
    }

    if (start === end) {
        console.log(`${label}: 只有一间房屋 nums[${start}] = ${nums[start]}`);
        return nums[start];
    }

    console.log(`${label} DP过程:`);

    let prev2 = nums[start];
    let prev1 = Math.max(nums[start], nums[start + 1]);

    console.log(`  初始: prev2 = ${prev2}, prev1 = ${prev1}`);

    for (let i = start + 2; i <= end; i++) {
        const robCurrent = prev2 + nums[i];    // 偷当前房屋
        const skipCurrent = prev1;             // 不偷当前房屋
        const current = Math.max(robCurrent, skipCurrent);

        console.log(`  i=${i}: max(${prev2} + ${nums[i]}, ${prev1}) = max(${robCurrent}, ${skipCurrent}) = ${current}`);

        prev2 = prev1;
        prev1 = current;
    }

    console.log(`${label} 结果: ${prev1}`);
    return prev1;
}

/**
 * 打家劫舍 II - 递归解法（展示思路）
 * @param {number[]} nums - 房屋金额数组
 * @return {number} 最大偷窃金额
 */
function robRecursive(nums) {
    if (!nums || nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];
    if (nums.length === 2) return Math.max(nums[0], nums[1]);

    // 情况1：偷第一间房，不能偷最后一间房
    const case1 = robHelper(nums, 0, nums.length - 2, new Map());

    // 情况2：不偷第一间房，可以偷最后一间房
    const case2 = robHelper(nums, 1, nums.length - 1, new Map());

    return Math.max(case1, case2);
}

/**
 * 递归辅助函数
 * @param {number[]} nums - 房屋金额数组
 * @param {number} start - 起始索引
 * @param {number} end - 结束索引
 * @param {Map} memo - 记忆化缓存
 * @return {number} 最大偷窃金额
 */
function robHelper(nums, start, end, memo) {
    if (start > end) return 0;
    if (start === end) return nums[start];

    const key = `${start}-${end}`;
    if (memo.has(key)) return memo.get(key);

    // 偷当前房屋 vs 不偷当前房屋
    const robCurrent = nums[start] + robHelper(nums, start + 2, end, memo);
    const skipCurrent = robHelper(nums, start + 1, end, memo);

    const result = Math.max(robCurrent, skipCurrent);
    memo.set(key, result);

    return result;
}

/**
 * 获取环形偷窃方案
 * @param {number[]} nums - 房屋金额数组
 * @return {object} 包含最大金额和偷窃方案
 */
function robWithPlan(nums) {
    if (!nums || nums.length === 0) return { maxAmount: 0, plan: [], case: 'empty' };
    if (nums.length === 1) return { maxAmount: nums[0], plan: [0], case: 'single' };
    if (nums.length === 2) {
        if (nums[0] >= nums[1]) {
            return { maxAmount: nums[0], plan: [0], case: 'two-first' };
        } else {
            return { maxAmount: nums[1], plan: [1], case: 'two-second' };
        }
    }

    // 获取两种情况的方案
    const plan1 = robLinearWithPlan(nums, 0, nums.length - 2);
    const plan2 = robLinearWithPlan(nums, 1, nums.length - 1);

    if (plan1.maxAmount >= plan2.maxAmount) {
        return {
            maxAmount: plan1.maxAmount,
            plan: plan1.plan,
            case: 'include-first',
            description: '包含第一间房，不包含最后一间房'
        };
    } else {
        return {
            maxAmount: plan2.maxAmount,
            plan: plan2.plan,
            case: 'include-last',
            description: '不包含第一间房，包含最后一间房'
        };
    }
}

/**
 * 线性数组获取偷窃方案
 * @param {number[]} nums - 房屋金额数组
 * @param {number} start - 起始索引
 * @param {number} end - 结束索引
 * @return {object} 包含最大金额和偷窃方案
 */
function robLinearWithPlan(nums, start, end) {
    if (start > end) return { maxAmount: 0, plan: [] };
    if (start === end) return { maxAmount: nums[start], plan: [start] };

    const len = end - start + 1;
    const dp = new Array(len);

    dp[0] = nums[start];
    dp[1] = Math.max(nums[start], nums[start + 1]);

    for (let i = 2; i < len; i++) {
        dp[i] = Math.max(dp[i - 2] + nums[start + i], dp[i - 1]);
    }

    // 回溯找出偷窃方案
    const plan = [];
    let i = len - 1;

    while (i >= 0) {
        if (i === 0) {
            plan.push(start);
            break;
        } else if (i === 1) {
            if (nums[start] > nums[start + 1]) {
                plan.push(start);
            } else {
                plan.push(start + 1);
            }
            break;
        } else {
            if (dp[i] === dp[i - 2] + nums[start + i]) {
                plan.push(start + i);
                i -= 2;
            } else {
                i -= 1;
            }
        }
    }

    plan.reverse();
    return { maxAmount: dp[len - 1], plan };
}

/**
 * 测试函数
 */
function testRobII() {
    const testCases = [
        {
            nums: [2, 3, 2],
            expected: 3,
            description: "环形数组：不能同时偷第一个和最后一个"
        },
        {
            nums: [1, 2, 3, 1],
            expected: 4,
            description: "环形数组：偷第1和第3间房"
        },
        {
            nums: [1, 2, 3],
            expected: 3,
            description: "三间房：偷中间那间"
        },
        {
            nums: [5],
            expected: 5,
            description: "只有一间房"
        },
        {
            nums: [1, 2],
            expected: 2,
            description: "两间房：选择更大的"
        },
        {
            nums: [2, 7, 9, 3, 1],
            expected: 11,
            description: "环形数组：7 + 3 + 1 = 11"
        }
    ];

    console.log("🏠 打家劫舍 II (环形) 算法测试");
    console.log("============================");

    testCases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`输入: [${testCase.nums.join(', ')}]`);

        const result1 = rob(testCase.nums);
        const result2 = robRecursive(testCase.nums);
        const planResult = robWithPlan(testCase.nums);

        console.log(`迭代结果: ${result1}`);
        console.log(`递归结果: ${result2}`);
        console.log(`偷窃方案: 房屋[${planResult.plan.join(', ')}], 金额: ${planResult.maxAmount}`);
        console.log(`方案说明: ${planResult.description || planResult.case}`);
        console.log(`期望结果: ${testCase.expected}`);

        const passed = result1 === testCase.expected && result2 === testCase.expected;
        console.log(`测试${passed ? '✅ 通过' : '❌ 失败'}`);

        // 详细分析第一个用例
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
        robLinear,
        robWithAnalysis,
        robRecursive,
        robWithPlan,
        testRobII
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.rob = rob;
    window.testRobII = testRobII;
}

// 运行测试
// testRobII();