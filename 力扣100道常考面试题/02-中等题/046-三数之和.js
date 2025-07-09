/**
 * LeetCode 15. 三数之和
 *
 * 问题描述：
 * 给你一个整数数组 nums ，判断是否存在三元组 [nums[i], nums[j], nums[k]]
 * 满足 i != j、i != k 且 j != k ，同时还满足 nums[i] + nums[j] + nums[k] == 0 。
 * 请你返回所有和为 0 且不重复的三元组。
 *
 * 核心思想：
 * 三数之和问题是经典的多指针问题，主要解法有：
 * 1. 排序 + 双指针 - O(n²)
 * 2. 哈希表 - O(n²)
 * 3. 暴力解法 - O(n³)
 * 关键在于去重和避免重复三元组
 *
 * 示例：
 * 输入：nums = [-1,0,1,2,-1,-4]
 * 输出：[[-1,-1,2],[-1,0,1]]
 * 解释：
 * nums[0] + nums[1] + nums[1] = (-1) + 0 + 1 = 0 。
 * nums[1] + nums[2] + nums[4] = 0 + 1 + (-1) = 0 。
 * 不同的三元组是 [-1,0,1] 和 [-1,-1,2] 。
 */

/**
 * 方法一：排序 + 双指针（推荐）
 *
 * 核心思想：
 * 先对数组排序，然后固定第一个数，用双指针寻找另外两个数
 * 排序后可以方便地跳过重复元素，避免重复的三元组
 * 利用排序的性质，可以通过移动指针来调整和的大小
 *
 * 算法步骤：
 * 1. 对数组进行排序
 * 2. 遍历数组，固定第一个数nums[i]
 * 3. 使用双指针在剩余部分寻找两个数，使三数之和为0
 * 4. 跳过重复元素，避免重复的三元组
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[][]} 所有和为0的三元组
 * @time O(n²) 外层循环O(n)，内层双指针O(n)
 * @space O(log n) 排序的空间复杂度，结果不算在内
 */
function threeSum(nums) {
    console.log("=== 三数之和（排序 + 双指针） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    if (nums.length < 3) {
        console.log("数组长度小于3，返回空结果");
        return [];
    }

    // 对数组进行排序
    nums.sort((a, b) => a - b);
    console.log(`排序后数组: [${nums.join(', ')}]`);

    const result = [];
    const n = nums.length;

    console.log("\n开始双指针搜索:");

    for (let i = 0; i < n - 2; i++) {
        // 如果第一个数大于0，后面不可能有三数之和为0
        if (nums[i] > 0) {
            console.log(`nums[${i}] = ${nums[i]} > 0，终止搜索`);
            break;
        }

        // 跳过重复的第一个数
        if (i > 0 && nums[i] === nums[i - 1]) {
            console.log(`跳过重复元素 nums[${i}] = ${nums[i]}`);
            continue;
        }

        console.log(`\n固定第一个数: nums[${i}] = ${nums[i]}`);

        let left = i + 1;
        let right = n - 1;

        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            console.log(`  三元组: [${nums[i]}, ${nums[left]}, ${nums[right]}], 和: ${sum}`);

            if (sum === 0) {
                // 找到一个解
                const triplet = [nums[i], nums[left], nums[right]];
                result.push(triplet);
                console.log(`    ✅ 找到解: [${triplet.join(', ')}]`);

                // 跳过重复的left
                while (left < right && nums[left] === nums[left + 1]) {
                    left++;
                    console.log(`    跳过重复的left: ${nums[left]}`);
                }

                // 跳过重复的right
                while (left < right && nums[right] === nums[right - 1]) {
                    right--;
                    console.log(`    跳过重复的right: ${nums[right]}`);
                }

                left++;
                right--;
            } else if (sum < 0) {
                // 和太小，移动左指针增大和
                console.log(`    和太小，left右移: ${left} -> ${left + 1}`);
                left++;
            } else {
                // 和太大，移动右指针减小和
                console.log(`    和太大，right左移: ${right} -> ${right - 1}`);
                right--;
            }
        }
    }

    console.log(`\n最终结果: ${result.length} 个三元组`);
    result.forEach((triplet, index) => {
        console.log(`  ${index + 1}: [${triplet.join(', ')}]`);
    });

    return result;
}

/**
 * 方法二：哈希表方法
 *
 * 核心思想：
 * 对于每一对数(nums[i], nums[j])，计算target = -(nums[i] + nums[j])
 * 使用哈希表查找是否存在target，同时处理重复问题
 * 需要仔细处理索引关系和重复三元组的去除
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[][]} 所有和为0的三元组
 * @time O(n²) 双重循环，哈希表查找O(1)
 * @space O(n) 哈希表存储空间
 */
function threeSumHashMap(nums) {
    console.log("\n=== 三数之和（哈希表方法） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    if (nums.length < 3) {
        console.log("数组长度小于3，返回空结果");
        return [];
    }

    const result = [];
    const n = nums.length;

    // 使用Set去重三元组
    const tripletSet = new Set();

    console.log("\n开始哈希表搜索:");

    for (let i = 0; i < n - 2; i++) {
        console.log(`\n第一层循环: i = ${i}, nums[${i}] = ${nums[i]}`);

        // 使用哈希表记录当前轮次见过的数字
        const seen = new Set();

        for (let j = i + 1; j < n; j++) {
            const target = -(nums[i] + nums[j]);
            console.log(`  第二层循环: j = ${j}, nums[${j}] = ${nums[j]}, 目标: ${target}`);

            if (seen.has(target)) {
                // 找到三元组，需要排序以便去重
                const triplet = [nums[i], nums[j], target].sort((a, b) => a - b);
                const key = triplet.join(',');

                if (!tripletSet.has(key)) {
                    tripletSet.add(key);
                    result.push(triplet);
                    console.log(`    ✅ 找到新解: [${triplet.join(', ')}]`);
                } else {
                    console.log(`    跳过重复解: [${triplet.join(', ')}]`);
                }
            } else {
                console.log(`    将 ${nums[j]} 加入哈希表`);
            }

            seen.add(nums[j]);
        }
    }

    console.log(`\n最终结果: ${result.length} 个三元组`);
    result.forEach((triplet, index) => {
        console.log(`  ${index + 1}: [${triplet.join(', ')}]`);
    });

    return result;
}

/**
 * 方法三：暴力解法
 *
 * 核心思想：
 * 三重循环枚举所有可能的三元组，检查和是否为0
 * 使用Set去重，避免重复的三元组
 * 时间复杂度较高，但逻辑简单直观
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[][]} 所有和为0的三元组
 * @time O(n³) 三重循环
 * @space O(k) k为结果集大小，用于去重
 */
function threeSumBruteForce(nums) {
    console.log("\n=== 三数之和（暴力解法） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    if (nums.length < 3) {
        console.log("数组长度小于3，返回空结果");
        return [];
    }

    const result = [];
    const n = nums.length;
    const tripletSet = new Set();

    console.log("\n开始暴力搜索:");

    for (let i = 0; i < n - 2; i++) {
        console.log(`\n第一层循环: i = ${i}, nums[${i}] = ${nums[i]}`);

        for (let j = i + 1; j < n - 1; j++) {
            console.log(`  第二层循环: j = ${j}, nums[${j}] = ${nums[j]}`);

            for (let k = j + 1; k < n; k++) {
                const sum = nums[i] + nums[j] + nums[k];
                console.log(`    第三层循环: k = ${k}, nums[${k}] = ${nums[k]}, 和: ${sum}`);

                if (sum === 0) {
                    // 找到和为0的三元组，排序后去重
                    const triplet = [nums[i], nums[j], nums[k]].sort((a, b) => a - b);
                    const key = triplet.join(',');

                    if (!tripletSet.has(key)) {
                        tripletSet.add(key);
                        result.push(triplet);
                        console.log(`      ✅ 找到新解: [${triplet.join(', ')}]`);
                    } else {
                        console.log(`      跳过重复解: [${triplet.join(', ')}]`);
                    }
                }
            }
        }
    }

    console.log(`\n最终结果: ${result.length} 个三元组`);
    result.forEach((triplet, index) => {
        console.log(`  ${index + 1}: [${triplet.join(', ')}]`);
    });

    return result;
}

/**
 * 方法四：优化的双指针（减少重复计算）
 *
 * 核心思想：
 * 在基本双指针的基础上，增加更多的剪枝优化
 * 提前终止不可能产生解的情况，减少不必要的计算
 *
 * @param {number[]} nums - 输入数组
 * @returns {number[][]} 所有和为0的三元组
 * @time O(n²) 优化后的双指针
 * @space O(log n) 排序空间
 */
function threeSumOptimized(nums) {
    console.log("\n=== 三数之和（优化双指针） ===");
    console.log(`输入数组: [${nums.join(', ')}]`);

    if (nums.length < 3) {
        console.log("数组长度小于3，返回空结果");
        return [];
    }

    nums.sort((a, b) => a - b);
    console.log(`排序后数组: [${nums.join(', ')}]`);

    const result = [];
    const n = nums.length;

    console.log("\n开始优化双指针搜索:");

    for (let i = 0; i < n - 2; i++) {
        // 优化1：第一个数大于0，不可能有解
        if (nums[i] > 0) {
            console.log(`nums[${i}] = ${nums[i]} > 0，提前终止`);
            break;
        }

        // 优化2：跳过重复的第一个数
        if (i > 0 && nums[i] === nums[i - 1]) {
            console.log(`跳过重复元素 nums[${i}] = ${nums[i]}`);
            continue;
        }

        // 优化3：检查最小可能的和
        const minSum = nums[i] + nums[i + 1] + nums[i + 2];
        if (minSum > 0) {
            console.log(`最小和 ${minSum} > 0，终止搜索`);
            break;
        }

        // 优化4：检查最大可能的和
        const maxSum = nums[i] + nums[n - 2] + nums[n - 1];
        if (maxSum < 0) {
            console.log(`最大和 ${maxSum} < 0，跳过当前i`);
            continue;
        }

        console.log(`\n固定第一个数: nums[${i}] = ${nums[i]}`);

        let left = i + 1;
        let right = n - 1;

        while (left < right) {
            const sum = nums[i] + nums[left] + nums[right];
            console.log(`  三元组: [${nums[i]}, ${nums[left]}, ${nums[right]}], 和: ${sum}`);

            if (sum === 0) {
                const triplet = [nums[i], nums[left], nums[right]];
                result.push(triplet);
                console.log(`    ✅ 找到解: [${triplet.join(', ')}]`);

                // 同时移动两个指针，跳过重复元素
                while (left < right && nums[left] === nums[left + 1]) left++;
                while (left < right && nums[right] === nums[right - 1]) right--;
                left++;
                right--;
            } else if (sum < 0) {
                left++;
            } else {
                right--;
            }
        }
    }

    console.log(`\n最终结果: ${result.length} 个三元组`);
    result.forEach((triplet, index) => {
        console.log(`  ${index + 1}: [${triplet.join(', ')}]`);
    });

    return result;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 验证结果的正确性
 * @param {number[]} nums - 原始数组
 * @param {number[][]} result - 算法结果
 * @returns {boolean} 是否正确
 */
function validateResult(nums, result) {
    console.log("\n=== 结果验证 ===");
    console.log(`原始数组: [${nums.join(', ')}]`);
    console.log(`结果数量: ${result.length}`);

    // 验证每个三元组
    for (let i = 0; i < result.length; i++) {
        const triplet = result[i];
        console.log(`验证三元组 ${i + 1}: [${triplet.join(', ')}]`);

        // 检查和是否为0
        const sum = triplet[0] + triplet[1] + triplet[2];
        if (sum !== 0) {
            console.log(`  ❌ 和不为0: ${sum}`);
            return false;
        }

        // 检查是否都来自原数组
        const numsCopy = [...nums];
        let allFromOriginal = true;
        for (const num of triplet) {
            const index = numsCopy.indexOf(num);
            if (index === -1) {
                allFromOriginal = false;
                break;
            }
            numsCopy.splice(index, 1);
        }

        if (!allFromOriginal) {
            console.log(`  ❌ 包含不在原数组中的元素`);
            return false;
        }

        console.log(`  ✅ 三元组 ${i + 1} 验证通过`);
    }

    // 检查是否有重复的三元组
    const tripletSet = new Set();
    for (const triplet of result) {
        const key = [...triplet].sort((a, b) => a - b).join(',');
        if (tripletSet.has(key)) {
            console.log(`❌ 发现重复三元组: [${triplet.join(', ')}]`);
            return false;
        }
        tripletSet.add(key);
    }

    console.log(`✅ 所有验证通过`);
    return true;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    // 生成测试用例
    const generateTestCase = (size, min = -100, max = 100) => {
        const result = [];
        for (let i = 0; i < size; i++) {
            result.push(min + Math.floor(Math.random() * (max - min + 1)));
        }
        return result;
    };

    const testCases = [
        [-1, 0, 1, 2, -1, -4],
        [0, 1, 1],
        [0, 0, 0],
        generateTestCase(50, -50, 50),
        generateTestCase(100, -100, 100)
    ];

    const methods = [
        { name: '排序+双指针', func: threeSum },
        { name: '优化双指针', func: threeSumOptimized },
        { name: '哈希表方法', func: threeSumHashMap },
        { name: '暴力解法', func: threeSumBruteForce }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const testArray = testCases[i];
        console.log(`\n测试用例 ${i + 1}: 数组长度 ${testArray.length}`);
        console.log(`数组: [${testArray.slice(0, 10).join(', ')}${testArray.length > 10 ? '...' : ''}]`);

        const results = [];

        for (const method of methods) {
            // 跳过大数组的暴力解法
            if (method.name === '暴力解法' && testArray.length > 20) {
                console.log(`${method.name}: 跳过（数组过大）`);
                continue;
            }

            const startTime = performance.now();
            const result = method.func([...testArray]);
            const endTime = performance.now();

            results.push(result);
            console.log(`${method.name}: ${result.length} 个解, 耗时: ${(endTime - startTime).toFixed(3)}ms`);
        }

        // 检查结果一致性
        const validResults = results.filter(r => r !== undefined);
        if (validResults.length > 1) {
            const allSameLength = validResults.every(r => r.length === validResults[0].length);
            console.log(`结果数量一致: ${allSameLength ? '✅' : '❌'}`);
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
    console.log("三数之和算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { input: [-1, 0, 1, 2, -1, -4], expected: 2 },
        { input: [0, 1, 1], expected: 0 },
        { input: [0, 0, 0], expected: 1 },
        { input: [-2, 0, 1, 1, 2], expected: 2 },
        { input: [-1, 0, 1], expected: 1 },
        { input: [1, 2, 3], expected: 0 },
        { input: [-1, -1, 2], expected: 1 }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}`);
        console.log(`${"=".repeat(30)}`);

        const { input, expected } = testCase;
        console.log(`输入: [${input.join(', ')}]`);
        console.log(`期望解数量: ${expected}`);

        // 测试所有方法
        const methods = [
            { name: "排序+双指针", func: threeSum },
            { name: "优化双指针", func: threeSumOptimized },
            { name: "哈希表方法", func: threeSumHashMap },
            { name: "暴力解法", func: threeSumBruteForce }
        ];

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func([...input]);
                results.push(result);

                const isCorrect = result.length === expected;
                console.log(`结果数量: ${result.length}, 期望: ${expected}, 正确: ${isCorrect ? '✅' : '❌'}`);

                // 验证结果
                validateResult(input, result);
            } catch (error) {
                console.log(`❌ 方法执行失败: ${error.message}`);
                results.push(null);
            }
        }

        // 检查所有方法结果是否一致
        console.log("\n--- 方法一致性检查 ---");
        const validResults = results.filter(r => r !== null);
        const allSameLength = validResults.every(result => result.length === validResults[0].length);
        console.log(`所有方法结果数量一致: ${allSameLength ? '✅' : '❌'}`);
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
    console.log("三数之和算法演示");
    console.log("=".repeat(50));

    console.log("三数之和问题的核心思想:");
    console.log("1. 将三数之和转化为二数之和问题");
    console.log("2. 固定一个数，用双指针寻找另外两个数");
    console.log("3. 利用排序的性质进行剪枝优化");
    console.log("4. 通过跳过重复元素来去重");

    const demoArray = [-1, 0, 1, 2, -1, -4];
    console.log(`\n演示数组: [${demoArray.join(', ')}]`);

    console.log("\n算法特点对比:");
    console.log("1. 排序+双指针: 最优时间复杂度，便于去重");
    console.log("2. 哈希表方法: 避免排序，但去重较复杂");
    console.log("3. 优化双指针: 增加剪枝，减少不必要计算");
    console.log("4. 暴力解法: 逻辑简单，适合理解问题");

    console.log("\n双指针技术的关键点:");
    console.log("- 排序是双指针的前提条件");
    console.log("- 根据和的大小决定指针移动方向");
    console.log("- 跳过重复元素避免重复解");
    console.log("- 合理的剪枝提高效率");

    console.log("\n详细演示 - 排序+双指针:");
    const result = threeSum(demoArray);

    console.log("\n时间复杂度分析:");
    console.log("排序+双指针: O(n²)");
    console.log("哈希表方法: O(n²)");
    console.log("暴力解法: O(n³)");
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
    console.log("1. 三数之和转化为二数之和的思想");
    console.log("2. 双指针技术在有序数组中的应用");
    console.log("3. 去重策略：排序+跳过重复元素");
    console.log("4. 剪枝优化减少不必要的计算");

    console.log("\n🔧 实现技巧:");
    console.log("1. 排序是使用双指针的前提");
    console.log("2. 外层循环固定第一个数");
    console.log("3. 内层双指针寻找另外两个数");
    console.log("4. 通过跳过相同元素实现去重");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 忘记处理重复元素的去重");
    console.log("2. 指针移动的边界条件处理");
    console.log("3. 数组索引越界问题");
    console.log("4. 结果集中重复三元组的处理");
    console.log("5. 空数组或长度不足的边界情况");

    console.log("\n🎨 变体问题:");
    console.log("1. 两数之和/四数之和");
    console.log("2. 最接近的三数之和");
    console.log("3. 三数之和的多种组合");
    console.log("4. N数之和的通用解法");
    console.log("5. 三角形的个数");

    console.log("\n📊 复杂度分析:");
    console.log("时间复杂度:");
    console.log("- 排序+双指针: O(n²)");
    console.log("- 哈希表方法: O(n²)");
    console.log("- 暴力解法: O(n³)");

    console.log("\n空间复杂度:");
    console.log("- 排序+双指针: O(log n) 排序空间");
    console.log("- 哈希表方法: O(n) 哈希表空间");
    console.log("- 暴力解法: O(k) k为结果集大小");

    console.log("\n💡 面试技巧:");
    console.log("1. 先确认是否需要返回索引还是数值");
    console.log("2. 询问是否允许修改原数组（排序）");
    console.log("3. 从暴力解法开始，逐步优化到双指针");
    console.log("4. 解释清楚去重的策略和原理");
    console.log("5. 考虑各种边界情况和特殊输入");

    console.log("\n🔍 相关概念:");
    console.log("1. 双指针技术的通用模板");
    console.log("2. 排序在算法优化中的作用");
    console.log("3. 哈希表在查找问题中的应用");
    console.log("4. 去重策略的设计思想");

    console.log("\n🌟 实际应用:");
    console.log("1. 数据分析中的组合统计");
    console.log("2. 推荐系统的相关性计算");
    console.log("3. 财务系统的账目平衡检查");
    console.log("4. 游戏中的装备组合匹配");
    console.log("5. 化学配方的成分平衡");

    console.log("\n📋 双指针算法模板:");
    console.log("```javascript");
    console.log("function twoPointers(sortedArray, target) {");
    console.log("    let left = 0, right = array.length - 1;");
    console.log("    ");
    console.log("    while (left < right) {");
    console.log("        const sum = array[left] + array[right];");
    console.log("        if (sum === target) {");
    console.log("            // 找到解");
    console.log("            return [left, right];");
    console.log("        } else if (sum < target) {");
    console.log("            left++; // 增大和");
    console.log("        } else {");
    console.log("            right--; // 减小和");
    console.log("        }");
    console.log("    }");
    console.log("    return null;");
    console.log("}");
    console.log("```");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        threeSum,
        threeSumHashMap,
        threeSumBruteForce,
        threeSumOptimized,
        validateResult,
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