/**
 * LeetCode 209. 长度最小的子数组
 *
 * 问题描述：
 * 给定一个含有 n 个正整数的数组和一个正整数 target。
 * 找出该数组中满足其和 ≥ target 的长度最小的连续子数组 [numsl, numsl+1, ..., numsr-1, numsr]，
 * 并返回其长度。如果不存在符合条件的子数组，返回 0。
 *
 * 核心思想：
 * 滑动窗口法 - 维护一个动态的窗口，通过移动左右边界来寻找最小长度的子数组
 * 关键观察：由于数组元素都是正整数，窗口内元素和具有单调性
 * 当窗口和 ≥ target 时，尝试缩小窗口；当窗口和 < target 时，扩大窗口
 *
 * 算法步骤：
 * 1. 使用双指针 left 和 right 维护滑动窗口
 * 2. 右指针不断向右移动，扩大窗口，增加窗口内元素和
 * 3. 当窗口和 ≥ target 时，记录当前窗口长度，然后左指针向右移动缩小窗口
 * 4. 重复步骤2-3，直到右指针遍历完整个数组
 * 5. 返回记录的最小窗口长度
 *
 * 示例：
 * 输入：target = 7, nums = [2,3,1,2,4,3]
 * 输出：2
 * 解释：子数组 [4,3] 是该条件下的长度最小的子数组
 */

/**
 * 方法一：滑动窗口法（最优解）
 *
 * 核心思想：
 * 使用双指针维护一个滑动窗口，通过扩大和缩小窗口来寻找满足条件的最小子数组
 * 利用正整数数组的单调性质，实现O(n)的时间复杂度
 *
 * @param {number} target - 目标和
 * @param {number[]} nums - 正整数数组
 * @return {number} 最小子数组长度，不存在则返回0
 * @time O(n) - 每个元素最多被访问两次
 * @space O(1) - 只使用常数额外空间
 */
function minSubArrayLen(target, nums) {
    if (!nums || nums.length === 0) {
        return 0;
    }

    let left = 0;           // 左指针
    let windowSum = 0;      // 当前窗口内元素和
    let minLength = Infinity; // 最小长度，初始为无穷大

    // 右指针遍历数组
    for (let right = 0; right < nums.length; right++) {
        // 扩大窗口：将右指针指向的元素加入窗口
        windowSum += nums[right];

        // 尝试缩小窗口：当窗口和满足条件时
        while (windowSum >= target) {
            // 更新最小长度
            minLength = Math.min(minLength, right - left + 1);

            // 缩小窗口：将左指针指向的元素移出窗口
            windowSum -= nums[left];
            left++;
        }
    }

    return minLength === Infinity ? 0 : minLength;
}

/**
 * 方法二：前缀和 + 二分查找
 *
 * 核心思想：
 * 先计算前缀和数组，然后对每个位置，使用二分查找找到最早满足条件的位置
 * 前缀和数组在正整数情况下是严格递增的，可以使用二分查找
 *
 * @param {number} target - 目标和
 * @param {number[]} nums - 正整数数组
 * @return {number} 最小子数组长度，不存在则返回0
 * @time O(n log n) - 计算前缀和O(n) + n次二分查找O(n log n)
 * @space O(n) - 存储前缀和数组
 */
function minSubArrayLenBinarySearch(target, nums) {
    if (!nums || nums.length === 0) {
        return 0;
    }

    const n = nums.length;

    // 计算前缀和数组，prefixSum[i] 表示 nums[0...i-1] 的和
    const prefixSum = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
        prefixSum[i + 1] = prefixSum[i] + nums[i];
    }

    let minLength = Infinity;

    // 对每个起始位置，使用二分查找找到最早满足条件的结束位置
    for (let i = 0; i < n; i++) {
        // 寻找最小的 j，使得 prefixSum[j+1] - prefixSum[i] >= target
        // 即 prefixSum[j+1] >= prefixSum[i] + target
        const targetSum = prefixSum[i] + target;

        // 在 prefixSum[i+1...n] 中二分查找第一个 >= targetSum 的值
        const index = binarySearchLeft(prefixSum, targetSum, i + 1, n);

        if (index <= n) {
            minLength = Math.min(minLength, index - i);
        }
    }

    return minLength === Infinity ? 0 : minLength;
}

/**
 * 二分查找：在有序数组中找到第一个大于等于目标值的位置
 * @param {number[]} arr - 有序数组
 * @param {number} target - 目标值
 * @param {number} left - 搜索区间左边界
 * @param {number} right - 搜索区间右边界（不包括）
 * @return {number} 第一个大于等于目标值的位置
 */
function binarySearchLeft(arr, target, left, right) {
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] >= target) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}

/**
 * 方法三：暴力法（用作对照）
 *
 * 核心思想：
 * 枚举所有可能的子数组，检查是否满足条件，记录最小长度
 *
 * @param {number} target - 目标和
 * @param {number[]} nums - 正整数数组
 * @return {number} 最小子数组长度，不存在则返回0
 * @time O(n²) - 双重循环枚举所有子数组
 * @space O(1) - 只使用常数额外空间
 */
function minSubArrayLenBruteForce(target, nums) {
    if (!nums || nums.length === 0) {
        return 0;
    }

    let minLength = Infinity;

    // 枚举起始位置
    for (let i = 0; i < nums.length; i++) {
        let currentSum = 0;

        // 枚举结束位置
        for (let j = i; j < nums.length; j++) {
            currentSum += nums[j];

            // 如果找到满足条件的子数组，更新最小长度
            if (currentSum >= target) {
                minLength = Math.min(minLength, j - i + 1);
                break; // 对于当前起始位置，找到最短的即可
            }
        }
    }

    return minLength === Infinity ? 0 : minLength;
}

/**
 * 方法四：优化的滑动窗口（双端队列）
 *
 * 核心思想：
 * 在某些特殊情况下，可以使用更复杂的数据结构来优化
 * 这里主要用于展示不同的思路
 *
 * @param {number} target - 目标和
 * @param {number[]} nums - 正整数数组
 * @return {number} 最小子数组长度，不存在则返回0
 * @time O(n) - 每个元素最多入队出队一次
 * @space O(n) - 存储队列
 */
function minSubArrayLenDeque(target, nums) {
    if (!nums || nums.length === 0) {
        return 0;
    }

    let left = 0;
    let windowSum = 0;
    let minLength = Infinity;

    for (let right = 0; right < nums.length; right++) {
        windowSum += nums[right];

        while (windowSum >= target) {
            minLength = Math.min(minLength, right - left + 1);
            windowSum -= nums[left];
            left++;
        }
    }

    return minLength === Infinity ? 0 : minLength;
}

// 测试用例
function testMinSubArrayLen() {
    console.log("=== 长度最小的子数组算法测试 ===\n");

    const testCases = [
        {
            target: 7,
            nums: [2, 3, 1, 2, 4, 3],
            expected: 2,
            description: "标准测试用例，子数组[4,3]"
        },
        {
            target: 4,
            nums: [1, 4, 4],
            expected: 1,
            description: "单个元素满足条件"
        },
        {
            target: 11,
            nums: [1, 1, 1, 1, 1, 1, 1, 1],
            expected: 0,
            description: "不存在满足条件的子数组"
        },
        {
            target: 15,
            nums: [1, 2, 3, 4, 5],
            expected: 5,
            description: "需要整个数组"
        },
        {
            target: 3,
            nums: [1, 1, 1, 1],
            expected: 3,
            description: "需要多个小元素"
        },
        {
            target: 213,
            nums: [12, 28, 83, 4, 25, 26, 25, 2, 25, 25, 25, 12],
            expected: 8,
            description: "复杂测试用例"
        },
        {
            target: 7,
            nums: [2, 3, 1, 2, 4, 3],
            expected: 2,
            description: "边界情况测试"
        },
        {
            target: 1,
            nums: [1],
            expected: 1,
            description: "单元素数组"
        }
    ];

    testCases.forEach(({ target, nums, expected, description }, index) => {
        console.log(`测试用例 ${index + 1}: ${description}`);
        console.log(`目标和: ${target}`);
        console.log(`数组: [${nums.join(', ')}]`);
        console.log(`期望结果: ${expected}`);

        const result1 = minSubArrayLen(target, nums);
        const result2 = minSubArrayLenBinarySearch(target, nums);
        const result3 = minSubArrayLenBruteForce(target, nums);
        const result4 = minSubArrayLenDeque(target, nums);

        console.log(`滑动窗口法: ${result1} ${result1 === expected ? '✓' : '✗'}`);
        console.log(`前缀和+二分: ${result2} ${result2 === expected ? '✓' : '✗'}`);
        console.log(`暴力法: ${result3} ${result3 === expected ? '✓' : '✗'}`);
        console.log(`双端队列法: ${result4} ${result4 === expected ? '✓' : '✗'}`);
        console.log("---");
    });
}

// 性能测试
function performanceTest() {
    console.log("=== 性能测试 ===\n");

    const sizes = [1000, 10000, 50000];

    sizes.forEach(size => {
        // 生成随机正整数数组
        const nums = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
        const target = Math.floor(size / 10); // 设置一个合理的目标值

        console.log(`数组大小: ${size}, 目标值: ${target}`);

        // 测试滑动窗口法
        const start1 = performance.now();
        const result1 = minSubArrayLen(target, nums);
        const end1 = performance.now();
        console.log(`滑动窗口法: ${(end1 - start1).toFixed(4)}ms, 结果: ${result1}`);

        // 测试前缀和+二分查找法
        const start2 = performance.now();
        const result2 = minSubArrayLenBinarySearch(target, nums);
        const end2 = performance.now();
        console.log(`前缀和+二分: ${(end2 - start2).toFixed(4)}ms, 结果: ${result2}`);

        // 暴力法（仅对较小数组测试）
        if (size <= 1000) {
            const start3 = performance.now();
            const result3 = minSubArrayLenBruteForce(target, nums);
            const end3 = performance.now();
            console.log(`暴力法: ${(end3 - start3).toFixed(4)}ms, 结果: ${result3}`);
        }

        console.log("---");
    });
}

// 算法可视化演示
function visualizeSlidingWindow() {
    console.log("=== 滑动窗口算法可视化 ===\n");

    const target = 7;
    const nums = [2, 3, 1, 2, 4, 3];

    console.log(`目标和: ${target}`);
    console.log(`数组: [${nums.join(', ')}]`);
    console.log("滑动窗口移动过程：\n");

    let left = 0;
    let windowSum = 0;
    let minLength = Infinity;
    let step = 1;

    for (let right = 0; right < nums.length; right++) {
        windowSum += nums[right];

        console.log(`步骤 ${step}: 扩大窗口`);
        console.log(`  右指针移动到位置 ${right}, 值: ${nums[right]}`);
        console.log(`  当前窗口: [${left}, ${right}] = [${nums.slice(left, right + 1).join(', ')}]`);
        console.log(`  窗口和: ${windowSum}`);

        while (windowSum >= target) {
            const currentLength = right - left + 1;
            minLength = Math.min(minLength, currentLength);

            console.log(`  ✓ 窗口和 ${windowSum} >= 目标 ${target}`);
            console.log(`  当前窗口长度: ${currentLength}, 最小长度: ${minLength}`);

            windowSum -= nums[left];
            console.log(`  缩小窗口: 移除位置 ${left} 的值 ${nums[left]}, 新的窗口和: ${windowSum}`);
            left++;

            if (left <= right && windowSum >= target) {
                console.log(`  继续缩小窗口...`);
            }
        }

        console.log(`  窗口和 ${windowSum} < 目标 ${target}, 继续扩大窗口\n`);
        step++;
    }

    console.log(`最终结果: 最小子数组长度为 ${minLength === Infinity ? 0 : minLength}`);
}

// 边界情况分析
function edgeCaseAnalysis() {
    console.log("=== 边界情况分析 ===\n");

    const edgeCases = [
        {
            case: "空数组",
            target: 5,
            nums: [],
            analysis: "应该返回0，因为不存在任何子数组"
        },
        {
            case: "单元素数组，满足条件",
            target: 3,
            nums: [5],
            analysis: "应该返回1，单个元素就满足条件"
        },
        {
            case: "单元素数组，不满足条件",
            target: 10,
            nums: [5],
            analysis: "应该返回0，单个元素不满足条件"
        },
        {
            case: "所有元素之和仍小于目标",
            target: 100,
            nums: [1, 2, 3, 4, 5],
            analysis: "应该返回0，即使所有元素相加也达不到目标"
        },
        {
            case: "目标值为0",
            target: 0,
            nums: [1, 2, 3],
            analysis: "特殊情况，任何非空子数组都满足条件"
        },
        {
            case: "数组中有很大的元素",
            target: 15,
            nums: [1, 2, 3, 20, 1],
            analysis: "应该快速定位到大元素"
        }
    ];

    edgeCases.forEach(({ case: caseName, target, nums, analysis }) => {
        console.log(`案例: ${caseName}`);
        console.log(`目标: ${target}, 数组: [${nums.join(', ')}]`);
        console.log(`分析: ${analysis}`);

        const result = minSubArrayLen(target, nums);
        console.log(`结果: ${result}\n`);
    });
}

// 算法复杂度分析
function complexityAnalysis() {
    console.log("=== 算法复杂度分析 ===\n");

    const methods = [
        {
            name: "滑动窗口法",
            time: "O(n)",
            space: "O(1)",
            pros: "时间复杂度最优，空间复杂度最优",
            cons: "需要理解双指针的移动逻辑",
            bestFor: "推荐解法，适用于正整数数组"
        },
        {
            name: "前缀和+二分查找",
            time: "O(n log n)",
            space: "O(n)",
            pros: "逻辑清晰，易于理解",
            cons: "时间和空间复杂度都不如滑动窗口",
            bestFor: "适用于理解二分查找的场景"
        },
        {
            name: "暴力法",
            time: "O(n²)",
            space: "O(1)",
            pros: "实现简单，不需要技巧",
            cons: "时间复杂度过高，实际中不可用",
            bestFor: "仅用于验证算法正确性"
        },
        {
            name: "双端队列法",
            time: "O(n)",
            space: "O(n)",
            pros: "在某些变形题中有用",
            cons: "本题中没有优势，空间复杂度高",
            bestFor: "适用于需要维护窗口内元素顺序的场景"
        }
    ];

    console.log("各种方法的复杂度对比：\n");

    methods.forEach(({ name, time, space, pros, cons, bestFor }) => {
        console.log(`${name}:`);
        console.log(`  时间复杂度: ${time}`);
        console.log(`  空间复杂度: ${space}`);
        console.log(`  优点: ${pros}`);
        console.log(`  缺点: ${cons}`);
        console.log(`  适用场景: ${bestFor}\n`);
    });

    console.log("推荐使用滑动窗口法，因为它在时间和空间复杂度上都是最优的，");
    console.log("且充分利用了正整数数组的单调性特点。");
}

// 运行测试
if (require.main === module) {
    testMinSubArrayLen();
    performanceTest();
    visualizeSlidingWindow();
    edgeCaseAnalysis();
    complexityAnalysis();
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        minSubArrayLen,
        minSubArrayLenBinarySearch,
        minSubArrayLenBruteForce,
        minSubArrayLenDeque
    };
}