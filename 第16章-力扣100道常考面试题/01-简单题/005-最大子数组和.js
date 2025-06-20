/**
 * LeetCode 005: 最大子数组和 (Maximum Subarray)
 *
 * 题目描述：
 * 给你一个整数数组 nums，请你找出一个具有最大和的连续子数组（子数组最少包含一个元素），
 * 返回其最大和。
 *
 * 核心思想：
 * 动态规划的经典问题 - Kadane算法
 * 核心理念：如果当前子数组和为负数，则丢弃它，重新开始
 *
 * 算法原理：
 * 1. 维护两个变量：当前子数组和(currentSum)和最大子数组和(maxSum)
 * 2. 遍历数组，对于每个元素有两个选择：
 *    - 加入当前子数组（继续之前的子数组）
 *    - 重新开始一个新的子数组（之前的和为负数时）
 * 3. 每次更新最大子数组和
 */

/**
 * 解法一：动态规划 - Kadane算法（推荐）
 *
 * 核心思想：
 * 局部最优：当前位置的最大子数组和 = max(当前元素, 当前元素 + 前面的最大子数组和)
 * 全局最优：所有位置中的最大值
 *
 * @param {number[]} nums - 整数数组
 * @returns {number} 最大子数组和
 * @time O(n) 一次遍历
 * @space O(1) 只使用常数额外空间
 */
function maxSubArray(nums) {
    if (!nums || nums.length === 0) return 0;

    // 初始化：第一个元素既是当前和也是最大和
    let currentSum = nums[0];  // 以当前位置结尾的最大子数组和
    let maxSum = nums[0];      // 全局最大子数组和

    // 从第二个元素开始遍历
    for (let i = 1; i < nums.length; i++) {
        // 关键决策：是继续之前的子数组，还是重新开始
        // 如果之前的currentSum > 0，就继续；否则重新开始
        currentSum = Math.max(nums[i], currentSum + nums[i]);

        // 更新全局最大值
        maxSum = Math.max(maxSum, currentSum);
    }

    return maxSum;
}

/**
 * 解法二：动态规划数组版本
 *
 * 核心思想：
 * 显式使用dp数组记录状态，便于理解动态规划的状态转移
 *
 * @param {number[]} nums - 整数数组
 * @returns {number} 最大子数组和
 * @time O(n) 一次遍历
 * @space O(n) 使用dp数组
 */
function maxSubArrayDP(nums) {
    if (!nums || nums.length === 0) return 0;

    const n = nums.length;
    const dp = new Array(n);  // dp[i]表示以nums[i]结尾的最大子数组和

    // 初始状态
    dp[0] = nums[0];
    let maxSum = dp[0];

    // 状态转移
    for (let i = 1; i < n; i++) {
        // 状态转移方程：dp[i] = max(nums[i], dp[i-1] + nums[i])
        dp[i] = Math.max(nums[i], dp[i - 1] + nums[i]);
        maxSum = Math.max(maxSum, dp[i]);
    }

    return maxSum;
}

/**
 * 解法三：分治法
 *
 * 核心思想：
 * 分治思想，最大子数组可能在左半部分、右半部分，或跨越中点
 *
 * @param {number[]} nums - 整数数组
 * @param {number} left - 左边界
 * @param {number} right - 右边界
 * @returns {number} 最大子数组和
 * @time O(n log n) 每层O(n)，共log n层
 * @space O(log n) 递归调用栈
 */
function maxSubArrayDivideConquer(nums, left = 0, right = nums.length - 1) {
    // 递归终止条件
    if (left === right) return nums[left];

    // 分割点
    const mid = Math.floor((left + right) / 2);

    // 递归求解左右两部分
    const leftMax = maxSubArrayDivideConquer(nums, left, mid);
    const rightMax = maxSubArrayDivideConquer(nums, mid + 1, right);

    // 跨越中点的最大子数组和
    let leftSum = Number.NEGATIVE_INFINITY;
    let tempSum = 0;

    // 从中点向左找最大和
    for (let i = mid; i >= left; i--) {
        tempSum += nums[i];
        leftSum = Math.max(leftSum, tempSum);
    }

    // 从中点+1向右找最大和
    let rightSum = Number.NEGATIVE_INFINITY;
    tempSum = 0;
    for (let i = mid + 1; i <= right; i++) {
        tempSum += nums[i];
        rightSum = Math.max(rightSum, tempSum);
    }

    const crossSum = leftSum + rightSum;

    // 返回三者中的最大值
    return Math.max(leftMax, rightMax, crossSum);
}

/**
 * 解法四：前缀和优化
 *
 * 核心思想：
 * 使用前缀和，子数组[i,j]的和 = prefixSum[j] - prefixSum[i-1]
 * 为了最大化这个值，需要最小化prefixSum[i-1]
 *
 * @param {number[]} nums - 整数数组
 * @returns {number} 最大子数组和
 * @time O(n) 一次遍历
 * @space O(1) 只使用常数额外空间
 */
function maxSubArrayPrefixSum(nums) {
    if (!nums || nums.length === 0) return 0;

    let maxSum = nums[0];
    let prefixSum = 0;
    let minPrefix = 0;  // 记录到当前位置的最小前缀和

    for (let i = 0; i < nums.length; i++) {
        prefixSum += nums[i];

        // 当前子数组和 = 当前前缀和 - 最小前缀和
        maxSum = Math.max(maxSum, prefixSum - minPrefix);

        // 更新最小前缀和
        minPrefix = Math.min(minPrefix, prefixSum);
    }

    return maxSum;
}

/**
 * 返回最大子数组的具体内容（不仅仅是和）
 *
 * @param {number[]} nums - 整数数组
 * @returns {Object} 包含最大和、起始位置、结束位置的对象
 */
function maxSubArrayWithIndices(nums) {
    if (!nums || nums.length === 0) return { sum: 0, start: -1, end: -1, subarray: [] };

    let maxSum = nums[0];
    let currentSum = nums[0];
    let start = 0, end = 0;
    let tempStart = 0;

    for (let i = 1; i < nums.length; i++) {
        // 如果当前和变为负数，重新开始
        if (currentSum < 0) {
            currentSum = nums[i];
            tempStart = i;
        } else {
            currentSum += nums[i];
        }

        // 更新最大值和对应的位置
        if (currentSum > maxSum) {
            maxSum = currentSum;
            start = tempStart;
            end = i;
        }
    }

    return {
        sum: maxSum,
        start: start,
        end: end,
        subarray: nums.slice(start, end + 1)
    };
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 005: 最大子数组和 测试 ===\n');

    const testCases = [
        {
            nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4],
            expected: 6,
            description: '经典用例：包含正负数的混合数组',
            expectedSubarray: [4, -1, 2, 1]
        },
        {
            nums: [1],
            expected: 1,
            description: '边界用例：单个正数',
            expectedSubarray: [1]
        },
        {
            nums: [5, 4, -1, 7, 8],
            expected: 23,
            description: '大部分为正数的数组',
            expectedSubarray: [5, 4, -1, 7, 8]
        },
        {
            nums: [-5, -4, -1, -7, -8],
            expected: -1,
            description: '全为负数的数组：应返回最大的负数',
            expectedSubarray: [-1]
        },
        {
            nums: [1, 2, 3, 4, 5],
            expected: 15,
            description: '全为正数：整个数组',
            expectedSubarray: [1, 2, 3, 4, 5]
        },
        {
            nums: [-1, -2, -3, -4],
            expected: -1,
            description: '全负数：最大的单个元素',
            expectedSubarray: [-1]
        },
        {
            nums: [0, -3, 1, 1],
            expected: 2,
            description: '包含零的情况',
            expectedSubarray: [1, 1]
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`输入: [${test.nums.join(', ')}]`);

        // 测试所有解法
        const result1 = maxSubArray([...test.nums]);
        const result2 = maxSubArrayDP([...test.nums]);
        const result3 = maxSubArrayDivideConquer([...test.nums]);
        const result4 = maxSubArrayPrefixSum([...test.nums]);
        const detailed = maxSubArrayWithIndices([...test.nums]);

        console.log(`Kadane算法结果: ${result1}`);
        console.log(`DP数组版本结果: ${result2}`);
        console.log(`分治法结果: ${result3}`);
        console.log(`前缀和法结果: ${result4}`);
        console.log(`详细结果: 和=${detailed.sum}, 位置=[${detailed.start}, ${detailed.end}], 子数组=[${detailed.subarray.join(', ')}]`);

        // 验证结果
        const isCorrect = result1 === test.expected;
        console.log(`结果验证: ${isCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 可视化演示
function visualDemo() {
    console.log('\n=== 最大子数组和可视化演示 ===');

    const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
    console.log(`数组: [${nums.join(', ')}]`);

    console.log('\nKadane算法执行过程:');
    let currentSum = nums[0];
    let maxSum = nums[0];

    console.log(`初始: currentSum=${currentSum}, maxSum=${maxSum}`);

    for (let i = 1; i < nums.length; i++) {
        const prevCurrentSum = currentSum;
        currentSum = Math.max(nums[i], currentSum + nums[i]);
        maxSum = Math.max(maxSum, currentSum);

        console.log(`第${i}步: nums[${i}]=${nums[i]}`);
        console.log(`  currentSum = max(${nums[i]}, ${prevCurrentSum} + ${nums[i]}) = max(${nums[i]}, ${prevCurrentSum + nums[i]}) = ${currentSum}`);
        console.log(`  maxSum = max(${Math.max(maxSum - (maxSum > currentSum ? currentSum : 0), maxSum - (maxSum <= currentSum ? currentSum : 0))}, ${currentSum}) = ${maxSum}`);

        if (currentSum === nums[i]) {
            console.log(`  → 重新开始新的子数组（之前的和为负数）`);
        } else {
            console.log(`  → 继续当前子数组（之前的和为正数）`);
        }
        console.log();
    }

    console.log(`最终结果: ${maxSum}`);

    // 显示实际的最大子数组
    const detailed = maxSubArrayWithIndices(nums);
    console.log(`最大子数组: [${detailed.subarray.join(', ')}] (位置 ${detailed.start} 到 ${detailed.end})`);
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能对比测试 ===');

    // 生成大规模测试数据
    const sizes = [1000, 10000, 100000];

    sizes.forEach(size => {
        console.log(`\n测试数据规模: ${size} 个元素`);

        // 生成随机数组（包含正负数）
        const nums = Array.from({ length: size }, () => Math.floor(Math.random() * 201) - 100);

        // 测试Kadane算法
        console.time('Kadane算法');
        const result1 = maxSubArray([...nums]);
        console.timeEnd('Kadane算法');

        // 测试DP数组版本
        console.time('DP数组版本');
        const result2 = maxSubArrayDP([...nums]);
        console.timeEnd('DP数组版本');

        // 测试前缀和法
        console.time('前缀和法');
        const result3 = maxSubArrayPrefixSum([...nums]);
        console.timeEnd('前缀和法');

        // 分治法只在小数据规模下测试
        if (size <= 10000) {
            console.time('分治法');
            const result4 = maxSubArrayDivideConquer([...nums]);
            console.timeEnd('分治法');
        } else {
            console.log('分治法: 数据量过大，跳过测试');
        }

        console.log(`最大子数组和: ${result1}`);
    });
}

// 算法复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. Kadane算法（推荐）:');
    console.log('   时间复杂度: O(n) - 只需一次遍历');
    console.log('   空间复杂度: O(1) - 只使用常数额外空间');
    console.log('   优点: 效率最高，代码简洁，易于理解');
    console.log('   缺点: 无');

    console.log('\n2. DP数组版本:');
    console.log('   时间复杂度: O(n) - 一次遍历');
    console.log('   空间复杂度: O(n) - 需要dp数组');
    console.log('   优点: 状态转移清晰，易于理解DP思想');
    console.log('   缺点: 空间开销大');

    console.log('\n3. 分治法:');
    console.log('   时间复杂度: O(n log n) - 递归分治');
    console.log('   空间复杂度: O(log n) - 递归调用栈');
    console.log('   优点: 分治思想清晰，适合理解算法');
    console.log('   缺点: 时间复杂度不是最优');

    console.log('\n4. 前缀和法:');
    console.log('   时间复杂度: O(n) - 一次遍历');
    console.log('   空间复杂度: O(1) - 只使用常数额外空间');
    console.log('   优点: 思路独特，适用于其他问题');
    console.log('   缺点: 理解稍难');

    console.log('\n推荐解法: Kadane算法');
    console.log('理由: 时间空间效率最优，代码简洁，是该问题的标准解法');
}

// 动态规划思想详解
function dpExplanation() {
    console.log('\n=== 动态规划思想详解 ===');

    console.log('1. 状态定义:');
    console.log('   dp[i] = 以nums[i]结尾的最大子数组和');

    console.log('\n2. 状态转移方程:');
    console.log('   dp[i] = max(nums[i], dp[i-1] + nums[i])');
    console.log('   含义: 以当前元素结尾的最大子数组，要么只包含当前元素，');
    console.log('         要么是前一个状态的最大子数组加上当前元素');

    console.log('\n3. 初始条件:');
    console.log('   dp[0] = nums[0]');

    console.log('\n4. 目标:');
    console.log('   max(dp[i]) for i in [0, n-1]');

    console.log('\n5. 空间优化:');
    console.log('   由于dp[i]只依赖于dp[i-1]，可以用一个变量代替数组');
    console.log('   这就是Kadane算法的由来');

    // 示例演示
    const nums = [4, -1, 2, 1];
    console.log(`\n示例演示: [${nums.join(', ')}]`);

    const dp = new Array(nums.length);
    dp[0] = nums[0];
    console.log(`dp[0] = ${dp[0]}`);

    for (let i = 1; i < nums.length; i++) {
        dp[i] = Math.max(nums[i], dp[i - 1] + nums[i]);
        console.log(`dp[${i}] = max(${nums[i]}, ${dp[i - 1]} + ${nums[i]}) = max(${nums[i]}, ${dp[i - 1] + nums[i]}) = ${dp[i]}`);
    }

    console.log(`最大值: ${Math.max(...dp)}`);
}

// 实际应用场景
function practicalApplications() {
    console.log('\n=== 实际应用场景 ===');

    console.log('1. 股票交易:');
    console.log('   - 寻找最佳买入卖出时机');
    console.log('   - 最大利润就是最大子数组和');

    console.log('\n2. 传感器数据分析:');
    console.log('   - 在噪音数据中找到最强信号段');
    console.log('   - 连续时间段内的最大累积值');

    console.log('\n3. 游戏得分系统:');
    console.log('   - 找到连续得分最高的阶段');
    console.log('   - 忽略负分阶段的影响');

    console.log('\n4. 财务分析:');
    console.log('   - 寻找连续盈利最多的时期');
    console.log('   - 现金流分析中的最大累积收益');

    // 实际例子：股票价格差值
    console.log('\n股票交易示例:');
    const prices = [7, 1, 5, 3, 6, 4];
    const priceChanges = [];

    for (let i = 1; i < prices.length; i++) {
        priceChanges.push(prices[i] - prices[i - 1]);
    }

    console.log(`股票价格: [${prices.join(', ')}]`);
    console.log(`价格变化: [${priceChanges.join(', ')}]`);

    const maxProfit = Math.max(0, maxSubArray(priceChanges));
    console.log(`最大利润: ${maxProfit}`);
}

// 相关问题扩展
function relatedProblems() {
    console.log('\n=== 相关问题扩展 ===');

    console.log('1. 最大子数组积 (Maximum Product Subarray)');
    console.log('2. 环形数组的最大子数组和 (Maximum Subarray Sum in Circular Array)');
    console.log('3. 至少有K个重复字符的最长子串');
    console.log('4. 买卖股票的最佳时机');
    console.log('5. 打家劫舍系列问题');

    // 简单实现环形数组版本
    console.log('\n环形数组最大子数组和示例:');

    function maxSubArrayCircular(nums) {
        // 情况1: 最大子数组不跨越边界（普通情况）
        const maxNormal = maxSubArray(nums);

        // 情况2: 最大子数组跨越边界
        // 等价于: 总和 - 最小子数组和
        const totalSum = nums.reduce((sum, num) => sum + num, 0);
        const minSubArray = -maxSubArray(nums.map(x => -x));
        const maxCircular = totalSum - minSubArray;

        // 特殊情况：如果所有元素都是负数
        if (maxCircular === 0) return maxNormal;

        return Math.max(maxNormal, maxCircular);
    }

    const circularNums = [1, -2, 3, -2];
    console.log(`数组: [${circularNums.join(', ')}]`);
    console.log(`普通最大子数组和: ${maxSubArray(circularNums)}`);
    console.log(`环形最大子数组和: ${maxSubArrayCircular(circularNums)}`);
}

// 运行所有测试
if (require.main === module) {
    runTests();
    visualDemo();
    performanceTest();
    complexityAnalysis();
    dpExplanation();
    practicalApplications();
    relatedProblems();
}

// 导出函数供其他模块使用
module.exports = {
    maxSubArray,
    maxSubArrayDP,
    maxSubArrayDivideConquer,
    maxSubArrayPrefixSum,
    maxSubArrayWithIndices
};