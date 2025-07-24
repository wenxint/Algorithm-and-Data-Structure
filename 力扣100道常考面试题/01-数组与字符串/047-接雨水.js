/**
 * LeetCode 42. 接雨水
 *
 * 问题描述：
 * 给定 n 个非负整数表示每个宽度为 1 的柱子的高度图，计算按此排列的柱子，下雨之后能够接多少雨水。
 *
 * 核心思想：
 * 对于每个位置，能接到的雨水高度取决于该位置左右两边最高柱子的较小值减去当前位置的高度
 * 主要解法有：
 * 1. 双指针 - O(n)
 * 2. 动态规划 - O(n)
 * 3. 单调栈 - O(n)
 * 4. 暴力解法 - O(n²)
 *
 * 示例：
 * 输入：height = [0,1,0,2,1,0,1,3,2,1,2,1]
 * 输出：6
 * 解释：上面的高度图，由数组 [0,1,0,2,1,0,1,3,2,1,2,1] 表示，
 * 在这种情况下，可以接 6 个单位的雨水（蓝色部分表示雨水）。
 */

/**
 * 方法一：双指针（推荐）
 *
 * 核心思想：
 * 使用两个指针从两端向中间移动，维护左右两边的最大高度
 * 当左边最大高度小于右边时，可以确定左边能接到的雨水量
 * 这样避免了预先计算所有位置的左右最大值
 *
 * 算法步骤：
 * 1. 使用left和right两个指针分别从两端开始
 * 2. 维护leftMax和rightMax记录当前左右最大高度
 * 3. 根据leftMax和rightMax的大小关系决定移动哪个指针
 * 4. 计算当前位置能接到的雨水量并累加
 *
 * @param {number[]} height - 高度数组
 * @returns {number} 能接到的雨水总量
 * @time O(n) 只需要一次遍历
 * @space O(1) 只使用常数额外空间
 */
function trap(height) {
    console.log("=== 接雨水（双指针法） ===");
    console.log(`输入高度数组: [${height.join(', ')}]`);

    if (!height || height.length < 3) {
        console.log("数组长度小于3，无法接雨水，返回0");
        return 0;
    }

    let left = 0; // 左指针
    let right = height.length - 1; // 右指针
    let leftMax = 0; // 左边最大高度
    let rightMax = 0; // 右边最大高度
    let totalWater = 0; // 总雨水量

    console.log("\n开始双指针遍历:");
    console.log("位置图示: " + height.map((h, i) => `${i}:${h}`).join(' '));

    while (left < right) {
        console.log(`\n第 ${totalWater + 1} 步:`);
        console.log(`左指针: ${left}(高度${height[left]}), 右指针: ${right}(高度${height[right]})`);
        console.log(`leftMax: ${leftMax}, rightMax: ${rightMax}`);

        if (height[left] < height[right]) {
            // 左边高度较小，处理左边
            if (height[left] >= leftMax) {
                // 更新左边最大高度
                leftMax = height[left];
                console.log(`  更新leftMax为: ${leftMax}`);
                console.log(`  位置${left}作为新的左边界，不能接雨水`);
            } else {
                // 能接雨水
                const water = leftMax - height[left];
                totalWater += water;
                console.log(`  位置${left}能接雨水: ${leftMax} - ${height[left]} = ${water}`);
                console.log(`  累计雨水量: ${totalWater}`);
            }
            left++;
            console.log(`  左指针右移到: ${left}`);
        } else {
            // 右边高度较小或相等，处理右边
            if (height[right] >= rightMax) {
                // 更新右边最大高度
                rightMax = height[right];
                console.log(`  更新rightMax为: ${rightMax}`);
                console.log(`  位置${right}作为新的右边界，不能接雨水`);
            } else {
                // 能接雨水
                const water = rightMax - height[right];
                totalWater += water;
                console.log(`  位置${right}能接雨水: ${rightMax} - ${height[right]} = ${water}`);
                console.log(`  累计雨水量: ${totalWater}`);
            }
            right--;
            console.log(`  右指针左移到: ${right}`);
        }
    }

    console.log(`\n最终结果: 总共能接 ${totalWater} 单位的雨水`);
    return totalWater;
}

/**
 * 方法二：动态规划
 *
 * 核心思想：
 * 预先计算每个位置左边和右边的最大高度
 * 然后对每个位置，能接到的雨水 = min(leftMax, rightMax) - height[i]
 * 这种方法思路清晰，容易理解
 *
 * @param {number[]} height - 高度数组
 * @returns {number} 能接到的雨水总量
 * @time O(n) 需要三次遍历
 * @space O(n) 需要额外数组存储左右最大值
 */
function trapDP(height) {
    console.log("\n=== 接雨水（动态规划法） ===");
    console.log(`输入高度数组: [${height.join(', ')}]`);

    if (!height || height.length < 3) {
        console.log("数组长度小于3，无法接雨水，返回0");
        return 0;
    }

    const n = height.length;
    const leftMax = new Array(n); // 每个位置左边的最大高度
    const rightMax = new Array(n); // 每个位置右边的最大高度

    // 计算每个位置左边的最大高度
    console.log("\n步骤1: 计算左边最大高度");
    leftMax[0] = height[0];
    console.log(`leftMax[0] = ${leftMax[0]}`);

    for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(leftMax[i - 1], height[i]);
        console.log(`leftMax[${i}] = max(${leftMax[i - 1]}, ${height[i]}) = ${leftMax[i]}`);
    }
    console.log(`左边最大高度数组: [${leftMax.join(', ')}]`);

    // 计算每个位置右边的最大高度
    console.log("\n步骤2: 计算右边最大高度");
    rightMax[n - 1] = height[n - 1];
    console.log(`rightMax[${n - 1}] = ${rightMax[n - 1]}`);

    for (let i = n - 2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i + 1], height[i]);
        console.log(`rightMax[${i}] = max(${rightMax[i + 1]}, ${height[i]}) = ${rightMax[i]}`);
    }
    console.log(`右边最大高度数组: [${rightMax.join(', ')}]`);

    // 计算每个位置的雨水量
    console.log("\n步骤3: 计算每个位置的雨水量");
    let totalWater = 0;

    for (let i = 0; i < n; i++) {
        const waterLevel = Math.min(leftMax[i], rightMax[i]);
        const water = Math.max(0, waterLevel - height[i]);
        totalWater += water;

        console.log(`位置${i}: 水位=${waterLevel}, 高度=${height[i]}, 雨水=${water}`);
    }

    console.log(`\n最终结果: 总共能接 ${totalWater} 单位的雨水`);
    return totalWater;
}

/**
 * 方法三：单调栈
 *
 * 核心思想：
 * 使用栈来保存高度递减的索引，当遇到比栈顶更高的柱子时，
 * 说明可以形成凹槽，弹出栈顶并计算该凹槽能接到的雨水
 * 这种方法按层计算雨水，适合理解雨水的形成过程
 *
 * @param {number[]} height - 高度数组
 * @returns {number} 能接到的雨水总量
 * @time O(n) 每个元素最多入栈出栈一次
 * @space O(n) 栈的空间复杂度
 */
function trapMonotonicStack(height) {
    console.log("\n=== 接雨水（单调栈法） ===");
    console.log(`输入高度数组: [${height.join(', ')}]`);

    if (!height || height.length < 3) {
        console.log("数组长度小于3，无法接雨水，返回0");
        return 0;
    }

    const stack = []; // 单调递减栈，存储索引
    let totalWater = 0;

    console.log("\n开始单调栈处理:");

    for (let i = 0; i < height.length; i++) {
        console.log(`\n处理位置 ${i}, 高度: ${height[i]}`);
        console.log(`当前栈: [${stack.map(idx => `${idx}:${height[idx]}`).join(', ')}]`);

        // 当前高度大于栈顶高度时，可以形成凹槽
        while (stack.length > 0 && height[i] > height[stack[stack.length - 1]]) {
            const bottomIndex = stack.pop(); // 凹槽底部
            console.log(`  弹出栈顶: ${bottomIndex}(高度${height[bottomIndex]})`);

            if (stack.length === 0) {
                console.log(`  栈为空，无法形成凹槽`);
                break;
            }

            const leftIndex = stack[stack.length - 1]; // 左边界
            const rightIndex = i; // 右边界

            // 计算凹槽的宽度和高度
            const width = rightIndex - leftIndex - 1;
            const waterHeight = Math.min(height[leftIndex], height[rightIndex]) - height[bottomIndex];
            const water = width * waterHeight;

            console.log(`  形成凹槽: 左边界${leftIndex}(${height[leftIndex]}), 右边界${rightIndex}(${height[rightIndex]}), 底部${bottomIndex}(${height[bottomIndex]})`);
            console.log(`  宽度: ${width}, 水位高度: ${waterHeight}, 雨水量: ${water}`);

            totalWater += water;
            console.log(`  累计雨水量: ${totalWater}`);
        }

        // 将当前索引入栈
        stack.push(i);
        console.log(`  将索引${i}入栈，栈变为: [${stack.map(idx => `${idx}:${height[idx]}`).join(', ')}]`);
    }

    console.log(`\n最终结果: 总共能接 ${totalWater} 单位的雨水`);
    return totalWater;
}

/**
 * 方法四：暴力解法
 *
 * 核心思想：
 * 对于每个位置，分别向左和向右扫描找到最大高度
 * 计算该位置能接到的雨水量，然后累加所有位置的雨水量
 * 时间复杂度较高，但逻辑最直观
 *
 * @param {number[]} height - 高度数组
 * @returns {number} 能接到的雨水总量
 * @time O(n²) 对每个位置都要扫描整个数组
 * @space O(1) 只使用常数额外空间
 */
function trapBruteForce(height) {
    console.log("\n=== 接雨水（暴力解法） ===");
    console.log(`输入高度数组: [${height.join(', ')}]`);

    if (!height || height.length < 3) {
        console.log("数组长度小于3，无法接雨水，返回0");
        return 0;
    }

    let totalWater = 0;

    console.log("\n开始暴力搜索:");

    for (let i = 1; i < height.length - 1; i++) {
        console.log(`\n处理位置 ${i}, 高度: ${height[i]}`);

        // 向左扫描找最大高度
        let leftMax = 0;
        for (let j = 0; j < i; j++) {
            leftMax = Math.max(leftMax, height[j]);
        }
        console.log(`  左边最大高度: ${leftMax}`);

        // 向右扫描找最大高度
        let rightMax = 0;
        for (let j = i + 1; j < height.length; j++) {
            rightMax = Math.max(rightMax, height[j]);
        }
        console.log(`  右边最大高度: ${rightMax}`);

        // 计算该位置能接到的雨水
        const waterLevel = Math.min(leftMax, rightMax);
        const water = Math.max(0, waterLevel - height[i]);
        totalWater += water;

        console.log(`  水位: ${waterLevel}, 雨水量: ${water}, 累计: ${totalWater}`);
    }

    console.log(`\n最终结果: 总共能接 ${totalWater} 单位的雨水`);
    return totalWater;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 可视化雨水图
 * @param {number[]} height - 高度数组
 * @param {number} totalWater - 总雨水量
 */
function visualizeWater(height, totalWater) {
    console.log("\n=== 雨水可视化 ===");
    console.log(`总雨水量: ${totalWater}`);

    if (!height || height.length === 0) return;

    const maxHeight = Math.max(...height);

    // 计算每个位置的水位
    const n = height.length;
    const leftMax = new Array(n);
    const rightMax = new Array(n);

    leftMax[0] = height[0];
    for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(leftMax[i - 1], height[i]);
    }

    rightMax[n - 1] = height[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i + 1], height[i]);
    }

    // 绘制图形
    console.log("\n图形表示 (█=柱子, ░=雨水, ·=空气):");
    for (let level = maxHeight; level > 0; level--) {
        let line = "";
        for (let i = 0; i < n; i++) {
            const waterLevel = Math.min(leftMax[i], rightMax[i]);
            if (level <= height[i]) {
                line += "█"; // 柱子
            } else if (level <= waterLevel) {
                line += "░"; // 雨水
            } else {
                line += "·"; // 空气
            }
        }
        console.log(line);
    }

    // 打印位置索引
    let indexLine = "";
    for (let i = 0; i < n; i++) {
        indexLine += (i % 10).toString();
    }
    console.log(indexLine);
}

/**
 * 验证结果的正确性
 * @param {number[]} height - 原始数组
 * @param {number} result - 算法结果
 * @returns {boolean} 是否正确
 */
function validateResult(height, result) {
    console.log("\n=== 结果验证 ===");
    console.log(`输入数组: [${height.join(', ')}]`);
    console.log(`算法结果: ${result}`);

    if (!height || height.length < 3) {
        const isCorrect = result === 0;
        console.log(`短数组验证: ${isCorrect ? '✅' : '❌'}`);
        return isCorrect;
    }

    // 使用动态规划方法验证
    const n = height.length;
    const leftMax = new Array(n);
    const rightMax = new Array(n);

    leftMax[0] = height[0];
    for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(leftMax[i - 1], height[i]);
    }

    rightMax[n - 1] = height[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i + 1], height[i]);
    }

    let expectedWater = 0;
    for (let i = 0; i < n; i++) {
        const water = Math.max(0, Math.min(leftMax[i], rightMax[i]) - height[i]);
        expectedWater += water;
    }

    const isCorrect = result === expectedWater;
    console.log(`期望结果: ${expectedWater}`);
    console.log(`结果正确: ${isCorrect ? '✅' : '❌'}`);

    return isCorrect;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    // 生成测试用例
    const generateTestCase = (size, maxHeight = 10) => {
        return Array.from({length: size}, () => Math.floor(Math.random() * maxHeight));
    };

    const testCases = [
        [0,1,0,2,1,0,1,3,2,1,2,1],
        [4,2,0,3,2,5],
        generateTestCase(100, 20),
        generateTestCase(1000, 50),
        generateTestCase(10000, 100)
    ];

    const methods = [
        { name: '双指针法', func: trap },
        { name: '动态规划', func: trapDP },
        { name: '单调栈', func: trapMonotonicStack },
        { name: '暴力解法', func: trapBruteForce }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const testArray = testCases[i];
        console.log(`\n测试用例 ${i + 1}: 数组长度 ${testArray.length}`);
        console.log(`数组: [${testArray.slice(0, 10).join(', ')}${testArray.length > 10 ? '...' : ''}]`);

        const results = [];

        for (const method of methods) {
            // 跳过大数组的暴力解法
            if (method.name === '暴力解法' && testArray.length > 1000) {
                console.log(`${method.name}: 跳过（数组过大）`);
                continue;
            }

            const startTime = performance.now();
            const result = method.func([...testArray]);
            const endTime = performance.now();

            results.push(result);
            console.log(`${method.name}: ${result} 单位雨水, 耗时: ${(endTime - startTime).toFixed(3)}ms`);
        }

        // 检查结果一致性
        const validResults = results.filter(r => r !== undefined);
        const allSame = validResults.every(r => r === validResults[0]);
        console.log(`所有方法结果一致: ${allSame ? '✅' : '❌'}`);
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
    console.log("接雨水算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { input: [0,1,0,2,1,0,1,3,2,1,2,1], expected: 6 },
        { input: [4,2,0,3,2,5], expected: 9 },
        { input: [3,0,2,0,4], expected: 7 },
        { input: [0,1,0], expected: 0 },
        { input: [2,0,2], expected: 2 },
        { input: [1,2,3,4,5], expected: 0 },
        { input: [5,4,3,2,1], expected: 0 },
        { input: [], expected: 0 },
        { input: [1], expected: 0 },
        { input: [1,2], expected: 0 }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}`);
        console.log(`${"=".repeat(30)}`);

        const { input, expected } = testCase;
        console.log(`输入: [${input.join(', ')}]`);
        console.log(`期望结果: ${expected}`);

        // 测试所有方法
        const methods = [
            { name: "双指针法", func: trap },
            { name: "动态规划", func: trapDP },
            { name: "单调栈", func: trapMonotonicStack },
            { name: "暴力解法", func: trapBruteForce }
        ];

        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name} ---`);
            try {
                const result = method.func([...input]);
                results.push(result);

                const isCorrect = result === expected;
                console.log(`结果: ${result}, 期望: ${expected}, 正确: ${isCorrect ? '✅' : '❌'}`);

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
        const allSame = validResults.every(result => result === validResults[0]);
        console.log(`所有方法结果一致: ${allSame ? '✅' : '❌'}`);

        // 可视化第一个有意义的测试用例
        if (index === 0 && input.length > 0) {
            visualizeWater(input, expected);
        }
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
    console.log("接雨水算法演示");
    console.log("=".repeat(50));

    console.log("接雨水问题的核心思想:");
    console.log("1. 每个位置能接的雨水高度 = min(左边最大高度, 右边最大高度) - 当前高度");
    console.log("2. 双指针法通过同时维护左右最大值避免预计算");
    console.log("3. 单调栈法按层计算，直观展示雨水形成过程");
    console.log("4. 动态规划法思路清晰，易于理解和验证");

    const demoArray = [0,1,0,2,1,0,1,3,2,1,2,1];
    console.log(`\n演示数组: [${demoArray.join(', ')}]`);

    console.log("\n算法特点对比:");
    console.log("1. 双指针法: 时间O(n)，空间O(1)，最优解");
    console.log("2. 动态规划: 时间O(n)，空间O(n)，思路清晰");
    console.log("3. 单调栈法: 时间O(n)，空间O(n)，过程直观");
    console.log("4. 暴力解法: 时间O(n²)，空间O(1)，易于理解");

    console.log("\n详细演示 - 双指针法:");
    const result = trap(demoArray);

    // 可视化结果
    visualizeWater(demoArray, result);

    console.log("\n算法应用场景:");
    console.log("- 城市排水系统设计");
    console.log("- 地形雨水收集分析");
    console.log("- 建筑物屋顶排水计算");
    console.log("- 游戏地形水位模拟");
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
    console.log("1. 雨水高度由左右两边最大高度的较小值决定");
    console.log("2. 双指针技术优化空间复杂度");
    console.log("3. 单调栈处理凹槽问题的经典应用");
    console.log("4. 动态规划的预计算思想");

    console.log("\n🔧 实现技巧:");
    console.log("1. 双指针：根据左右最大值大小决定移动方向");
    console.log("2. 动态规划：预计算左右最大值数组");
    console.log("3. 单调栈：维护递减栈，遇到更高柱子时计算雨水");
    console.log("4. 边界处理：首尾位置不能接雨水");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 忘记处理数组长度小于3的情况");
    console.log("2. 双指针中leftMax和rightMax的更新时机");
    console.log("3. 单调栈中凹槽宽度的计算错误");
    console.log("4. 雨水量不能为负数的边界检查");
    console.log("5. 数组为空或只有1-2个元素的特殊情况");

    console.log("\n🎨 变体问题:");
    console.log("1. 接雨水II（二维版本）");
    console.log("2. 柱状图中最大的矩形");
    console.log("3. 最大矩形");
    console.log("4. 去除重复字母");
    console.log("5. 滑动窗口最大值");

    console.log("\n📊 复杂度分析:");
    console.log("时间复杂度:");
    console.log("- 双指针法: O(n)");
    console.log("- 动态规划: O(n)");
    console.log("- 单调栈: O(n)");
    console.log("- 暴力解法: O(n²)");

    console.log("\n空间复杂度:");
    console.log("- 双指针法: O(1)");
    console.log("- 动态规划: O(n)");
    console.log("- 单调栈: O(n)");
    console.log("- 暴力解法: O(1)");

    console.log("\n💡 面试技巧:");
    console.log("1. 先画图理解问题，可视化雨水形成过程");
    console.log("2. 从暴力解法开始，逐步优化到双指针");
    console.log("3. 解释清楚为什么双指针可以确定雨水量");
    console.log("4. 强调单调栈在处理凹槽问题中的价值");
    console.log("5. 考虑所有边界情况和异常输入");

    console.log("\n🔍 相关概念:");
    console.log("1. 双指针技术的优化思想");
    console.log("2. 单调栈在几何问题中的应用");
    console.log("3. 动态规划的状态预计算");
    console.log("4. 贪心思想在双指针移动中的体现");

    console.log("\n🌟 实际应用:");
    console.log("1. 城市规划中的排水系统设计");
    console.log("2. 建筑工程的雨水收集计算");
    console.log("3. 地理信息系统的地形分析");
    console.log("4. 游戏开发中的水体模拟");
    console.log("5. 计算机图形学的填充算法");

    console.log("\n📋 双指针解题模板:");
    console.log("```javascript");
    console.log("function twoPointers(array) {");
    console.log("    let left = 0, right = array.length - 1;");
    console.log("    let leftMax = 0, rightMax = 0;");
    console.log("    let result = 0;");
    console.log("    ");
    console.log("    while (left < right) {");
    console.log("        if (array[left] < array[right]) {");
    console.log("            // 处理左边");
    console.log("            leftMax = Math.max(leftMax, array[left]);");
    console.log("            result += leftMax - array[left];");
    console.log("            left++;");
    console.log("        } else {");
    console.log("            // 处理右边");
    console.log("            rightMax = Math.max(rightMax, array[right]);");
    console.log("            result += rightMax - array[right];");
    console.log("            right--;");
    console.log("        }");
    console.log("    }");
    console.log("    return result;");
    console.log("}");
    console.log("```");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        trap,
        trapDP,
        trapMonotonicStack,
        trapBruteForce,
        visualizeWater,
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