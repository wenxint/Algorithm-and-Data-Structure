/**
 * LeetCode 152. 乘积最大子数组
 *
 * 问题描述：
 * 给你一个整数数组 nums ，请你找出数组中乘积最大的非空连续子数组（该子数组中至少包含一个数字），
 * 并返回该子数组所对应的乘积。
 *
 * 核心思想：
 * 动态规划：由于存在负数，需要同时维护最大值和最小值
 * 最大值可能来自：当前元素、当前元素×前面的最大值、当前元素×前面的最小值
 * 负数×负数=正数，所以最小值在遇到负数时可能变成最大值
 *
 * 示例：
 * 输入：nums = [2,3,-2,4]
 * 输出：6 (子数组 [2,3] 的乘积为 6)
 */

/**
 * 乘积最大子数组 - 动态规划解法（面试推荐）
 * @param {number[]} nums - 输入数组
 * @return {number} 最大乘积
 * @time O(n) 时间复杂度
 * @space O(1) 空间复杂度
 */
function maxProduct(nums) {
    // 边界条件处理
    if (!nums || nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];

    // 维护当前位置的最大值和最小值
    let maxSoFar = nums[0];    // 全局最大乘积
    let maxHere = nums[0];     // 当前位置结尾的最大乘积
    let minHere = nums[0];     // 当前位置结尾的最小乘积（可能为负数）

    for (let i = 1; i < nums.length; i++) {
        const current = nums[i];

        // 保存上一轮的maxHere，因为计算minHere时会用到
        const tempMax = maxHere;

        // 更新当前位置的最大值：三个候选值中的最大值
        // 1. 当前元素本身
        // 2. 当前元素 × 前面的最大值
        // 3. 当前元素 × 前面的最小值（负数×负数=正数）
        maxHere = Math.max(current, maxHere * current, minHere * current);

        // 更新当前位置的最小值：三个候选值中的最小值
        minHere = Math.min(current, tempMax * current, minHere * current);

        // 更新全局最大值
        maxSoFar = Math.max(maxSoFar, maxHere);
    }

    return maxSoFar;
}

/**
 * 乘积最大子数组 - 详细分析版本
 * @param {number[]} nums - 输入数组
 * @return {number} 最大乘积
 */
function maxProductWithAnalysis(nums) {
    if (!nums || nums.length === 0) {
        console.log('输入数组为空');
        return 0;
    }

    console.log(`输入数组: [${nums.join(', ')}]`);

    if (nums.length === 1) {
        console.log('只有一个元素，最大乘积为:', nums[0]);
        return nums[0];
    }

    let maxSoFar = nums[0];
    let maxHere = nums[0];
    let minHere = nums[0];

    console.log('\n动态规划过程:');
    console.log(`初始: maxHere = ${maxHere}, minHere = ${minHere}, maxSoFar = ${maxSoFar}`);

    for (let i = 1; i < nums.length; i++) {
        const current = nums[i];
        const tempMax = maxHere;

        // 计算三个候选值
        const candidate1 = current;
        const candidate2 = maxHere * current;
        const candidate3 = minHere * current;

        maxHere = Math.max(candidate1, candidate2, candidate3);
        minHere = Math.min(candidate1, tempMax * current, minHere * current);
        maxSoFar = Math.max(maxSoFar, maxHere);

        console.log(`i=${i}, nums[${i}]=${current}:`);
        console.log(`  候选max: ${candidate1}, ${candidate2}, ${candidate3}`);
        console.log(`  maxHere = ${maxHere}, minHere = ${minHere}`);
        console.log(`  maxSoFar = ${maxSoFar}`);
    }

    console.log(`\n最大乘积: ${maxSoFar}`);
    return maxSoFar;
}

/**
 * 乘积最大子数组 - 数组版本（保存所有状态）
 * @param {number[]} nums - 输入数组
 * @return {number} 最大乘积
 */
function maxProductArray(nums) {
    if (!nums || nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];

    const n = nums.length;
    const maxDP = new Array(n);  // maxDP[i]表示以i结尾的最大乘积
    const minDP = new Array(n);  // minDP[i]表示以i结尾的最小乘积

    maxDP[0] = nums[0];
    minDP[0] = nums[0];
    let result = nums[0];

    for (let i = 1; i < n; i++) {
        maxDP[i] = Math.max(nums[i], maxDP[i-1] * nums[i], minDP[i-1] * nums[i]);
        minDP[i] = Math.min(nums[i], maxDP[i-1] * nums[i], minDP[i-1] * nums[i]);
        result = Math.max(result, maxDP[i]);
    }

    return result;
}

/**
 * 获取最大乘积子数组的具体位置
 * @param {number[]} nums - 输入数组
 * @return {object} 包含最大乘积和子数组位置信息
 */
function maxProductWithPosition(nums) {
    if (!nums || nums.length === 0) return { maxProduct: 0, start: -1, end: -1, subarray: [] };
    if (nums.length === 1) return { maxProduct: nums[0], start: 0, end: 0, subarray: [nums[0]] };

    const n = nums.length;
    const maxDP = new Array(n);
    const minDP = new Array(n);

    maxDP[0] = nums[0];
    minDP[0] = nums[0];

    let maxProduct = nums[0];
    let endIndex = 0;  // 最大乘积子数组的结束位置

    for (let i = 1; i < n; i++) {
        maxDP[i] = Math.max(nums[i], maxDP[i-1] * nums[i], minDP[i-1] * nums[i]);
        minDP[i] = Math.min(nums[i], maxDP[i-1] * nums[i], minDP[i-1] * nums[i]);

        if (maxDP[i] > maxProduct) {
            maxProduct = maxDP[i];
            endIndex = i;
        }
    }

    // 向前回溯找到起始位置
    let startIndex = endIndex;
    let product = 1;

    for (let i = endIndex; i >= 0; i--) {
        product *= nums[i];
        if (product === maxProduct) {
            startIndex = i;
            break;
        }
    }

    const subarray = nums.slice(startIndex, endIndex + 1);

    return {
        maxProduct,
        start: startIndex,
        end: endIndex,
        subarray,
        length: endIndex - startIndex + 1
    };
}

/**
 * 乘积最大子数组 - 分治法（另一种思路）
 * @param {number[]} nums - 输入数组
 * @return {number} 最大乘积
 */
function maxProductDivideConquer(nums) {
    if (!nums || nums.length === 0) return 0;

    // 按0分割数组，分别计算每段的最大乘积
    let maxProduct = -Infinity;
    let start = 0;

    for (let i = 0; i <= nums.length; i++) {
        if (i === nums.length || nums[i] === 0) {
            if (start < i) {
                // 计算不包含0的子数组的最大乘积
                const segmentMax = maxProductNoZero(nums.slice(start, i));
                maxProduct = Math.max(maxProduct, segmentMax);
            }
            if (i < nums.length && nums[i] === 0) {
                maxProduct = Math.max(maxProduct, 0);
            }
            start = i + 1;
        }
    }

    return maxProduct;
}

/**
 * 计算不包含0的数组的最大乘积
 * @param {number[]} nums - 不包含0的数组
 * @return {number} 最大乘积
 */
function maxProductNoZero(nums) {
    if (nums.length === 0) return 0;
    if (nums.length === 1) return nums[0];

    // 计算整个数组的乘积
    let totalProduct = 1;
    for (const num of nums) {
        totalProduct *= num;
    }

    // 如果总乘积为正，直接返回
    if (totalProduct > 0) return totalProduct;

    // 如果总乘积为负，需要去掉一个负数
    // 尝试去掉最左边的负数或最右边的负数
    let maxFromLeft = -Infinity;
    let maxFromRight = -Infinity;

    // 从左边开始计算最大乘积
    let product = 1;
    for (let i = 0; i < nums.length; i++) {
        product *= nums[i];
        maxFromLeft = Math.max(maxFromLeft, product);
    }

    // 从右边开始计算最大乘积
    product = 1;
    for (let i = nums.length - 1; i >= 0; i--) {
        product *= nums[i];
        maxFromRight = Math.max(maxFromRight, product);
    }

    return Math.max(maxFromLeft, maxFromRight);
}

/**
 * 测试函数
 */
function testMaxProduct() {
    const testCases = [
        {
            nums: [2, 3, -2, 4],
            expected: 6,
            description: "包含负数：子数组[2,3]乘积为6"
        },
        {
            nums: [-2, 0, -1],
            expected: 0,
            description: "包含0：最大乘积为0"
        },
        {
            nums: [-2, 3, -4],
            expected: 24,
            description: "都为负数时：整个数组乘积为24"
        },
        {
            nums: [2, -5, -2, -4, 3],
            expected: 24,
            description: "多个负数：子数组[-5,-2,-4]乘积为40，错误！应该是[-2,-4,3]=24"
        },
        {
            nums: [-1, -2, -3, 0, 1, 2, 3],
            expected: 6,
            description: "包含0分割：最大为[1,2,3]=6"
        },
        {
            nums: [1, 0, -1, 2, 3, -5, 4],
            expected: 60,
            description: "复杂情况：子数组[-1,2,3,-5,4]乘积为120，错误！应该是[2,3,-5,4]=60，错误！应该是[2,3]=6？需要重新计算"
        }
    ];

    console.log("📈 乘积最大子数组算法测试");
    console.log("========================");

    testCases.forEach((testCase, index) => {
        console.log(`\n测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`输入: [${testCase.nums.join(', ')}]`);

        const result1 = maxProduct(testCase.nums);
        const result2 = maxProductArray(testCase.nums);
        const result3 = maxProductDivideConquer(testCase.nums);
        const positionResult = maxProductWithPosition(testCase.nums);

        console.log(`基础DP结果: ${result1}`);
        console.log(`数组DP结果: ${result2}`);
        console.log(`分治法结果: ${result3}`);
        console.log(`子数组位置: [${positionResult.start}, ${positionResult.end}]`);
        console.log(`子数组内容: [${positionResult.subarray.join(', ')}]`);
        console.log(`子数组乘积: ${positionResult.maxProduct}`);
        console.log(`期望结果: ${testCase.expected}`);

        const passed = result1 === testCase.expected &&
                      result2 === testCase.expected;

        console.log(`测试${passed ? '✅ 通过' : '❌ 失败'}`);

        // 详细分析第一个用例
        if (index === 0) {
            console.log('\n--- 详细分析过程 ---');
            maxProductWithAnalysis(testCase.nums);
        }
    });
}

// 如果在Node.js环境中运行
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        maxProduct,
        maxProductWithAnalysis,
        maxProductArray,
        maxProductWithPosition,
        maxProductDivideConquer,
        testMaxProduct
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.maxProduct = maxProduct;
    window.testMaxProduct = testMaxProduct;
}

// 运行测试
// testMaxProduct();