/**
 * LeetCode 300. 最长递增子序列 (Longest Increasing Subsequence)
 *
 * 问题描述：
 * 给你一个整数数组 nums，找到其中最长严格递增子序列的长度。
 * 子序列是由数组派生而来的序列，删除（或不删除）数组中的元素而不改变其余元素的顺序。
 * 例如，[3,6,2,7] 是数组 [0,3,1,6,2,2,7] 的子序列。
 *
 * 核心思想：
 * 1. 动态规划：dp[i] 表示以 nums[i] 结尾的最长递增子序列长度
 * 2. 二分查找优化：维护一个递增序列，用二分查找优化到 O(n log n)
 * 3. 耐心排序：将问题转化为纸牌游戏的耐心排序
 *
 * 示例：
 * 输入：nums = [10,9,2,5,3,7,101,18]
 * 输出：4
 * 解释：最长递增子序列是 [2,3,7,18]，因此长度为 4。
 */

/**
 * 方法一：动态规划（标准解法）
 *
 * 核心思想：
 * dp[i] 表示以 nums[i] 结尾的最长严格递增子序列的长度
 * 对于每个位置 i，考虑所有 j < i 且 nums[j] < nums[i] 的情况
 * dp[i] = max(dp[j] + 1) for all valid j
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 最长递增子序列长度
 * @time O(n²) 双重循环
 * @space O(n) DP数组
 */
function lengthOfLIS(nums) {
    console.log("=== 最长递增子序列（动态规划） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    if (!nums || nums.length === 0) {
        console.log("空数组，返回 0");
        return 0;
    }

    const n = nums.length;
    // dp[i] 表示以 nums[i] 结尾的最长递增子序列长度
    const dp = new Array(n).fill(1);

    console.log("\n初始化 DP 数组:");
    console.log(`dp = [${dp.join(', ')}]`);

    let maxLength = 1; // 最长长度

    // 外层循环：当前考虑的元素
    for (let i = 1; i < n; i++) {
        console.log(`\n处理 nums[${i}] = ${nums[i]}`);

        // 内层循环：查找所有可能的前驱元素
        for (let j = 0; j < i; j++) {
            console.log(`  比较 nums[${j}] = ${nums[j]} 与 nums[${i}] = ${nums[i]}`);

            if (nums[j] < nums[i]) {
                // 可以将 nums[i] 接在 nums[j] 后面
                const newLength = dp[j] + 1;
                console.log(`    nums[${j}] < nums[${i}]，可以接在后面`);
                console.log(`    新长度: dp[${j}] + 1 = ${dp[j]} + 1 = ${newLength}`);

                if (newLength > dp[i]) {
                    dp[i] = newLength;
                    console.log(`    更新 dp[${i}] = ${dp[i]}`);
                }
            } else {
                console.log(`    nums[${j}] >= nums[${i}]，不能接在后面`);
            }
        }

        console.log(`  最终 dp[${i}] = ${dp[i]}`);
        maxLength = Math.max(maxLength, dp[i]);
        console.log(`  当前最大长度: ${maxLength}`);
        console.log(`  当前 DP 数组: [${dp.join(', ')}]`);
    }

    console.log(`\n最终 DP 数组: [${dp.join(', ')}]`);
    console.log(`最长递增子序列长度: ${maxLength}`);

    return maxLength;
}

/**
 * 方法二：二分查找优化（耐心排序）
 *
 * 核心思想：
 * 维护一个数组 tails，其中 tails[i] 表示长度为 i+1 的递增子序列的最小末尾元素
 * 对于每个新元素，用二分查找找到它应该插入的位置
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 最长递增子序列长度
 * @time O(n log n) 每个元素进行一次二分查找
 * @space O(n) tails数组
 */
function lengthOfLISOptimized(nums) {
    console.log("\n=== 最长递增子序列（二分查找优化） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    if (!nums || nums.length === 0) {
        console.log("空数组，返回 0");
        return 0;
    }

    // tails[i] 表示长度为 i+1 的递增子序列的最小末尾元素
    const tails = [];

    console.log("\n处理过程:");

    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        console.log(`\n处理 nums[${i}] = ${num}`);
        console.log(`当前 tails: [${tails.join(', ')}]`);

        // 二分查找第一个大于等于 num 的位置
        let left = 0, right = tails.length;

        console.log(`  开始二分查找，查找 ${num} 的插入位置`);
        console.log(`  初始范围: left=${left}, right=${right}`);

        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            console.log(`    mid=${mid}, tails[${mid}]=${tails[mid]}`);

            if (tails[mid] < num) {
                left = mid + 1;
                console.log(`    tails[${mid}] < ${num}，向右查找: left=${left}`);
            } else {
                right = mid;
                console.log(`    tails[${mid}] >= ${num}，向左查找: right=${right}`);
            }
        }

        console.log(`  找到插入位置: ${left}`);

        if (left === tails.length) {
            // 新元素比所有末尾元素都大，可以扩展序列
            tails.push(num);
            console.log(`  ${num} 比所有末尾元素都大，添加到末尾`);
        } else {
            // 替换对应位置的元素
            console.log(`  替换 tails[${left}] = ${tails[left]} 为 ${num}`);
            tails[left] = num;
        }

        console.log(`  更新后 tails: [${tails.join(', ')}]`);
        console.log(`  当前最长长度: ${tails.length}`);
    }

    console.log(`\n最终 tails: [${tails.join(', ')}]`);
    console.log(`最长递增子序列长度: ${tails.length}`);

    return tails.length;
}

/**
 * 方法三：获取实际的最长递增子序列
 *
 * 核心思想：
 * 在动态规划的基础上，记录每个位置的前驱，然后回溯构建实际序列
 *
 * @param {number[]} nums - 输入数组
 * @returns {Object} 包含长度和实际序列的对象
 */
function getLIS(nums) {
    console.log("\n=== 获取实际的最长递增子序列 ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    if (!nums || nums.length === 0) {
        return { length: 0, sequence: [] };
    }

    const n = nums.length;
    const dp = new Array(n).fill(1);
    const prev = new Array(n).fill(-1); // 记录前驱位置

    let maxLength = 1;
    let maxIndex = 0; // 最长序列的结束位置

    console.log("\n构建DP和前驱数组:");

    for (let i = 1; i < n; i++) {
        console.log(`\n处理 nums[${i}] = ${nums[i]}`);

        for (let j = 0; j < i; j++) {
            if (nums[j] < nums[i] && dp[j] + 1 > dp[i]) {
                dp[i] = dp[j] + 1;
                prev[i] = j; // 记录前驱
                console.log(`  更新: dp[${i}] = ${dp[i]}, prev[${i}] = ${j}`);
            }
        }

        if (dp[i] > maxLength) {
            maxLength = dp[i];
            maxIndex = i;
            console.log(`  新的最长长度: ${maxLength}，结束位置: ${maxIndex}`);
        }
    }

    console.log(`\nDP数组: [${dp.join(', ')}]`);
    console.log(`前驱数组: [${prev.join(', ')}]`);
    console.log(`最长长度: ${maxLength}，结束位置: ${maxIndex}`);

    // 回溯构建实际序列
    const sequence = [];
    let current = maxIndex;

    console.log("\n回溯构建序列:");
    while (current !== -1) {
        sequence.unshift(nums[current]);
        console.log(`  添加 nums[${current}] = ${nums[current]}`);
        console.log(`  当前序列: [${sequence.join(', ')}]`);
        current = prev[current];
    }

    console.log(`\n最长递增子序列: [${sequence.join(', ')}]`);
    console.log(`长度: ${sequence.length}`);

    return {
        length: maxLength,
        sequence: sequence
    };
}

/**
 * 方法四：基于二分查找获取实际序列
 *
 * 核心思想：
 * 结合二分查找优化和前驱记录，在 O(n log n) 时间内获取实际序列
 *
 * @param {number[]} nums - 输入数组
 * @returns {Object} 包含长度和实际序列的对象
 */
function getLISOptimized(nums) {
    console.log("\n=== 获取最长递增子序列（二分查找版本） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    if (!nums || nums.length === 0) {
        return { length: 0, sequence: [] };
    }

    const n = nums.length;
    const tails = [];
    const positions = []; // 记录 tails 中每个位置对应的原数组索引
    const prev = new Array(n).fill(-1); // 前驱数组

    console.log("\n处理过程:");

    for (let i = 0; i < n; i++) {
        const num = nums[i];
        console.log(`\n处理 nums[${i}] = ${num}`);

        // 二分查找
        let left = 0, right = tails.length;
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            if (tails[mid] < num) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }

        // 更新前驱
        if (left > 0) {
            prev[i] = positions[left - 1];
            console.log(`  设置前驱: prev[${i}] = ${prev[i]}`);
        }

        if (left === tails.length) {
            tails.push(num);
            positions.push(i);
            console.log(`  扩展序列: tails[${left}] = ${num}, positions[${left}] = ${i}`);
        } else {
            tails[left] = num;
            positions[left] = i;
            console.log(`  替换: tails[${left}] = ${num}, positions[${left}] = ${i}`);
        }

        console.log(`  当前 tails: [${tails.join(', ')}]`);
        console.log(`  当前 positions: [${positions.join(', ')}]`);
    }

    // 回溯构建序列
    const sequence = [];
    let current = positions[positions.length - 1];

    console.log("\n回溯构建序列:");
    while (current !== -1) {
        sequence.unshift(nums[current]);
        console.log(`  添加 nums[${current}] = ${nums[current]}`);
        current = prev[current];
    }

    console.log(`\n最长递增子序列: [${sequence.join(', ')}]`);
    console.log(`长度: ${sequence.length}`);

    return {
        length: tails.length,
        sequence: sequence
    };
}

/**
 * 方法五：递归 + 记忆化搜索
 *
 * 核心思想：
 * 对于每个位置，递归计算以该位置开始的最长递增子序列
 * 使用记忆化避免重复计算
 *
 * @param {number[]} nums - 输入数组
 * @returns {number} 最长递增子序列长度
 * @time O(n²) 记忆化后每个状态计算一次
 * @space O(n²) 递归栈 + 记忆化表
 */
function lengthOfLISMemo(nums) {
    console.log("\n=== 最长递增子序列（记忆化搜索） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    if (!nums || nums.length === 0) {
        return 0;
    }

    const memo = new Map();

    /**
     * 递归函数：计算从位置 i 开始，且前一个元素值为 prev 的最长递增子序列长度
     * @param {number} i - 当前位置
     * @param {number} prev - 前一个元素值
     * @returns {number} 最长长度
     */
    function dfs(i, prev) {
        if (i === nums.length) {
            return 0;
        }

        const key = `${i},${prev}`;
        if (memo.has(key)) {
            console.log(`    记忆化命中: dfs(${i}, ${prev}) = ${memo.get(key)}`);
            return memo.get(key);
        }

        console.log(`  递归计算: dfs(${i}, ${prev}), nums[${i}] = ${nums[i]}`);

        // 选择1：不选当前元素
        let result = dfs(i + 1, prev);
        console.log(`    不选 nums[${i}]: 长度 = ${result}`);

        // 选择2：选择当前元素（如果可以）
        if (nums[i] > prev) {
            const choose = 1 + dfs(i + 1, nums[i]);
            result = Math.max(result, choose);
            console.log(`    选择 nums[${i}]: 长度 = ${choose}`);
        } else {
            console.log(`    不能选择 nums[${i}]，因为 ${nums[i]} <= ${prev}`);
        }

        memo.set(key, result);
        console.log(`  记忆化存储: dfs(${i}, ${prev}) = ${result}`);

        return result;
    }

    console.log("\n开始递归搜索:");
    const result = dfs(0, -Infinity);

    console.log(`\n记忆化表大小: ${memo.size}`);
    console.log(`最长递增子序列长度: ${result}`);

    return result;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 验证递增子序列
 */
function validateLIS(nums, sequence) {
    console.log("\n=== 验证递增子序列 ===");
    console.log(`原数组: [${nums.join(', ')}]`);
    console.log(`子序列: [${sequence.join(', ')}]`);

    // 检查是否为严格递增
    for (let i = 1; i < sequence.length; i++) {
        if (sequence[i] <= sequence[i - 1]) {
            console.log(`❌ 不是严格递增: ${sequence[i - 1]} >= ${sequence[i]}`);
            return false;
        }
    }

    // 检查是否为子序列
    let j = 0;
    for (let i = 0; i < nums.length && j < sequence.length; i++) {
        if (nums[i] === sequence[j]) {
            console.log(`匹配: nums[${i}] = sequence[${j}] = ${nums[i]}`);
            j++;
        }
    }

    const isSubsequence = j === sequence.length;
    const isIncreasing = sequence.every((val, i) => i === 0 || val > sequence[i - 1]);

    console.log(`是否为子序列: ${isSubsequence ? '✅' : '❌'}`);
    console.log(`是否严格递增: ${isIncreasing ? '✅' : '❌'}`);

    return isSubsequence && isIncreasing;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const generateRandomArray = (size, max = 1000) => {
        return Array.from({ length: size }, () => Math.floor(Math.random() * max));
    };

    const testCases = [
        [10, 9, 2, 5, 3, 7, 101, 18],
        [0, 1, 0, 3, 2, 3],
        [7, 7, 7, 7, 7, 7, 7],
        generateRandomArray(100),
        generateRandomArray(500)
    ];

    for (let i = 0; i < testCases.length; i++) {
        const nums = testCases[i];
        console.log(`\n测试用例 ${i + 1}: 长度 ${nums.length}`);

        const methods = [
            { name: '动态规划', func: lengthOfLIS },
            { name: '二分查找', func: lengthOfLISOptimized },
            { name: '记忆化搜索', func: lengthOfLISMemo }
        ];

        // 只对小数组进行详细测试
        if (nums.length <= 20) {
            for (const method of methods) {
                console.log(`\n--- ${method.name} ---`);
                const startTime = performance.now();
                const result = method.func(nums);
                const endTime = performance.now();
                console.log(`结果: ${result}, 耗时: ${(endTime - startTime).toFixed(2)}ms`);
            }
        } else {
            // 大数组只测试高效方法
            console.log(`数组较大，只测试二分查找方法`);
            const startTime = performance.now();
            const result = lengthOfLISOptimized(nums);
            const endTime = performance.now();
            console.log(`结果: ${result}, 耗时: ${(endTime - startTime).toFixed(2)}ms`);
        }
    }
}

// ===========================================
// 测试用例
// ===========================================

/**
 * 测试函数
 */
function runTests() {
    console.log("=".repeat(50));
    console.log("最长递增子序列算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { nums: [10, 9, 2, 5, 3, 7, 101, 18], expected: 4 },
        { nums: [0, 1, 0, 3, 2, 3], expected: 4 },
        { nums: [7, 7, 7, 7, 7, 7, 7], expected: 1 },
        { nums: [1, 3, 6, 7, 9, 4, 10, 5, 6], expected: 6 },
        { nums: [10, 22, 9, 33, 21, 50, 41, 60], expected: 5 },
        { nums: [], expected: 0 },
        { nums: [1], expected: 1 }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}`);
        console.log(`${"=".repeat(30)}`);

        const { nums, expected } = testCase;

        // 测试长度计算方法
        const methods = [
            { name: "动态规划", func: lengthOfLIS },
            { name: "二分查找", func: lengthOfLISOptimized },
            { name: "记忆化搜索", func: lengthOfLISMemo }
        ];

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func([...nums]); // 复制数组避免修改
                results.push(result);

                const isCorrect = result === expected;
                console.log(`结果: ${result}, 期望: ${expected}, 正确: ${isCorrect ? '✅' : '❌'}`);
            } catch (error) {
                console.log(`❌ 方法执行失败: ${error.message}`);
                results.push(-1);
            }
        }

        // 测试获取实际序列的方法
        if (nums.length > 0 && nums.length <= 10) {
            console.log("\n--- 获取实际序列 ---");
            try {
                const lisResult = getLIS([...nums]);
                console.log(`DP方法: 长度=${lisResult.length}, 序列=[${lisResult.sequence.join(', ')}]`);
                validateLIS(nums, lisResult.sequence);

                const lisOptResult = getLISOptimized([...nums]);
                console.log(`二分方法: 长度=${lisOptResult.length}, 序列=[${lisOptResult.sequence.join(', ')}]`);
                validateLIS(nums, lisOptResult.sequence);
            } catch (error) {
                console.log(`❌ 获取序列失败: ${error.message}`);
            }
        }

        // 检查所有方法结果是否一致
        console.log("\n--- 方法一致性检查 ---");
        const allSame = results.every(result => result === results[0]);
        console.log(`所有方法结果一致: ${allSame ? '✅' : '❌'}`);
    });

    // 性能测试
    performanceTest();
}

// ===========================================
// 算法演示
// ===========================================

/**
 * 算法演示函数
 */
function demonstrateAlgorithm() {
    console.log("\n" + "=".repeat(50));
    console.log("最长递增子序列算法演示");
    console.log("=".repeat(50));

    console.log("最长递增子序列问题的核心思想:");
    console.log("1. 动态规划：记录以每个位置结尾的最长长度");
    console.log("2. 二分查找：维护递增序列，优化时间复杂度");
    console.log("3. 耐心排序：将问题转化为纸牌游戏");
    console.log("4. 贪心思想：维护最小的末尾元素");

    const demoNums = [10, 9, 2, 5, 3, 7, 101, 18];

    console.log(`\n演示数组: [${demoNums.join(', ')}]`);

    console.log("\n=== 动态规划方法演示 ===");
    console.log("状态定义: dp[i] = 以 nums[i] 结尾的最长递增子序列长度");
    console.log("状态转移: dp[i] = max(dp[j] + 1) for all j < i and nums[j] < nums[i]");

    const dpResult = lengthOfLIS([...demoNums]);

    console.log("\n=== 二分查找方法演示 ===");
    console.log("核心思想: 维护 tails 数组，tails[i] = 长度为 i+1 的递增子序列的最小末尾");
    console.log("贪心策略: 总是选择最小的末尾元素，为后续元素留下更多空间");

    const binaryResult = lengthOfLISOptimized([...demoNums]);

    console.log("\n=== 获取实际序列 ===");
    const actualSequence = getLIS([...demoNums]);

    console.log("\n=== 复杂度对比 ===");
    console.log("方法          时间复杂度    空间复杂度    适用场景");
    console.log("动态规划      O(n²)        O(n)         小规模数据");
    console.log("二分查找      O(n log n)   O(n)         大规模数据");
    console.log("记忆化搜索    O(n²)        O(n²)        理解递归思路");

    console.log("\n=== 耐心排序类比 ===");
    console.log("想象有一副牌，规则如下：");
    console.log("1. 从左到右处理每张牌");
    console.log("2. 如果当前牌比所有堆顶都大，开始新堆");
    console.log("3. 否则放在第一个堆顶大于等于当前牌的堆上");
    console.log("4. 堆的数量就是最长递增子序列的长度");
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
    console.log("1. 子序列：保持相对顺序，但可以删除元素");
    console.log("2. 严格递增：后面的元素必须大于前面的元素");
    console.log("3. 最优子结构：局部最优解构成全局最优解");
    console.log("4. 贪心思想：在二分查找方法中体现");

    console.log("\n🔧 实现技巧:");
    console.log("1. DP方法：dp[i] 表示以 i 结尾的最长长度");
    console.log("2. 二分查找：维护递增数组，快速定位插入位置");
    console.log("3. 前驱记录：回溯构建实际序列");
    console.log("4. 耐心排序：直观理解二分查找方法");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 混淆子序列和子数组概念");
    console.log("2. 忘记处理严格递增的条件");
    console.log("3. 二分查找的边界条件错误");
    console.log("4. 回溯构建序列时的方向错误");

    console.log("\n🎨 变体问题:");
    console.log("1. 最长非递减子序列（允许相等）");
    console.log("2. 最长递减子序列");
    console.log("3. 最长摆动子序列");
    console.log("4. 俄罗斯套娃信封问题");
    console.log("5. 最大数字序列");

    console.log("\n📊 复杂度分析:");
    console.log("1. 动态规划：时间 O(n²)，空间 O(n)");
    console.log("2. 二分查找：时间 O(n log n)，空间 O(n)");
    console.log("3. 记忆化搜索：时间 O(n²)，空间 O(n²)");
    console.log("4. 构建实际序列：额外 O(n) 时间");

    console.log("\n💡 面试技巧:");
    console.log("1. 先从 O(n²) 的 DP 方法开始讲解");
    console.log("2. 然后优化到 O(n log n) 的二分查找");
    console.log("3. 用耐心排序帮助理解二分查找方法");
    console.log("4. 讨论是否需要获取实际序列");
    console.log("5. 分析不同方法的适用场景");

    console.log("\n🔍 实际应用:");
    console.log("1. 股票价格分析（寻找上涨趋势）");
    console.log("2. 基因序列分析");
    console.log("3. 文档版本控制");
    console.log("4. 数据流处理");
    console.log("5. 游戏得分系统");
    console.log("6. 调度算法优化");

    console.log("\n🎮 记忆技巧:");
    console.log("1. 耐心排序：纸牌游戏的规则");
    console.log("2. 贪心策略：总是选择最小的末尾");
    console.log("3. 二分查找：在有序数组中快速定位");
    console.log("4. DP状态：以当前位置结尾的最优解");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        lengthOfLIS,
        lengthOfLISOptimized,
        lengthOfLISMemo,
        getLIS,
        getLISOptimized,
        validateLIS,
        performanceTest,
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