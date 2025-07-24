/**
 * LeetCode 739: 每日温度 (Daily Temperatures)
 *
 * 题目描述：
 * 给定一个整数数组 temperatures，表示每天的温度，
 * 返回一个数组 answer，其中 answer[i] 是指在第 i 天之后，才会有更高的温度。
 * 如果气温在这之后都不会升高，请在该位置用 0 来代替。
 *
 * 核心思想：
 * 单调栈 - 维护一个单调递减的栈，存储索引而非值
 * 关键洞察：我们要找的是距离下一个更大元素的天数，而不是元素值本身
 *
 * 算法原理：
 * 1. 栈中存储索引，维护温度单调递减
 * 2. 当遇到更高温度时，栈中所有小于它的温度都找到了答案
 * 3. 答案是索引之差，即需要等待的天数
 *
 * 示例：
 * 输入：temperatures = [73,74,75,71,69,72,76,73]
 * 输出：[1,1,4,2,1,1,0,0]
 * 解释：第0天73°，第1天就有更高温度74°，所以等待1天
 */

/**
 * 解法一：单调栈（推荐）
 *
 * 核心思想：
 * - 栈中存储还没找到更高温度的天数的索引
 * - 栈内索引对应的温度保持单调递减
 * - 当遇到更高温度时，弹出栈中小于它的所有索引并计算等待天数
 *
 * @param {number[]} temperatures - 每日温度数组
 * @returns {number[]} 每天需要等待的天数
 * @time O(n) 每个元素最多入栈出栈一次
 * @space O(n) 栈的空间，最坏情况下所有元素都在栈中
 */
function dailyTemperatures(temperatures) {
    const n = temperatures.length;
    const result = new Array(n).fill(0); // 初始化结果数组，默认值为0
    const stack = []; // 单调栈，存储索引

    // 遍历温度数组
    for (let i = 0; i < n; i++) {
        // 当栈不为空且当前温度大于栈顶索引对应的温度时
        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            const prevIndex = stack.pop(); // 弹出栈顶索引
            result[prevIndex] = i - prevIndex; // 计算等待天数
        }

        // 将当前索引压入栈中
        stack.push(i);
    }

    // 栈中剩余的索引表示没有找到更高温度的天数，结果已经初始化为0
    return result;
}

/**
 * 解法二：暴力法（对比用）
 *
 * 核心思想：
 * 对于每一天，向后遍历寻找第一个更高的温度
 *
 * @param {number[]} temperatures
 * @returns {number[]}
 * @time O(n²) 对每个元素都可能遍历到末尾
 * @space O(1) 不考虑输出数组
 */
function dailyTemperaturesBruteForce(temperatures) {
    const n = temperatures.length;
    const result = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
        // 从下一天开始查找更高温度
        for (let j = i + 1; j < n; j++) {
            if (temperatures[j] > temperatures[i]) {
                result[i] = j - i;
                break; // 找到第一个更高温度就停止
            }
        }
        // 如果没找到，result[i] 保持为0
    }

    return result;
}

/**
 * 解法三：逆向遍历优化
 *
 * 核心思想：
 * 从右向左遍历，利用已经计算出的结果进行跳跃
 * 如果当前温度不比右边高，可以跳过一些天数
 *
 * @param {number[]} temperatures
 * @returns {number[]}
 * @time O(n) 平均情况，最坏O(n²)
 * @space O(1) 不考虑输出数组
 */
function dailyTemperaturesReverse(temperatures) {
    const n = temperatures.length;
    const result = new Array(n).fill(0);

    // 从倒数第二天开始向前遍历
    for (let i = n - 2; i >= 0; i--) {
        let j = i + 1; // 从下一天开始查找

        // 如果下一天温度不够高，就跳跃查找
        while (j < n && temperatures[j] <= temperatures[i]) {
            if (result[j] === 0) {
                // 如果j天之后没有更高温度，那么i天也没有
                j = n;
            } else {
                // 跳跃到j天找到更高温度的那一天
                j = j + result[j];
            }
        }

        // 如果找到了更高温度
        if (j < n) {
            result[i] = j - i;
        }
    }

    return result;
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 739: 每日温度 测试 ===\n');

    const testCases = [
        {
            temperatures: [73, 74, 75, 71, 69, 72, 76, 73],
            expected: [1, 1, 4, 2, 1, 1, 0, 0],
            description: '经典用例：包含各种温度变化情况'
        },
        {
            temperatures: [30, 40, 50, 60],
            expected: [1, 1, 1, 0],
            description: '严格递增序列：每天都在第二天遇到更高温度'
        },
        {
            temperatures: [30, 60, 90],
            expected: [1, 1, 0],
            description: '简单递增：除最后一天外都有答案'
        },
        {
            temperatures: [89, 62, 70, 58, 47, 47, 46, 76, 100, 70],
            expected: [8, 1, 5, 4, 3, 2, 1, 1, 0, 0],
            description: '复杂情况：包含下降和上升的混合模式'
        },
        {
            temperatures: [100, 90, 80, 70],
            expected: [0, 0, 0, 0],
            description: '严格递减序列：所有天数都没有更高温度'
        },
        {
            temperatures: [55],
            expected: [0],
            description: '单天情况：没有后续天数'
        },
        {
            temperatures: [55, 55, 55, 55],
            expected: [0, 0, 0, 0],
            description: '相同温度：没有更高温度'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`温度数组: [${test.temperatures.join(', ')}]`);

        // 测试单调栈解法
        const result1 = dailyTemperatures([...test.temperatures]);
        console.log(`单调栈解法: [${result1.join(', ')}]`);

        // 测试暴力解法
        const result2 = dailyTemperaturesBruteForce([...test.temperatures]);
        console.log(`暴力解法: [${result2.join(', ')}]`);

        // 测试逆向遍历解法
        const result3 = dailyTemperaturesReverse([...test.temperatures]);
        console.log(`逆向遍历解法: [${result3.join(', ')}]`);

        // 验证结果
        const isCorrect = JSON.stringify(result1) === JSON.stringify(test.expected) &&
                         JSON.stringify(result2) === JSON.stringify(test.expected) &&
                         JSON.stringify(result3) === JSON.stringify(test.expected);
        console.log(`结果验证: ${isCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log(`期望: [${test.expected.join(', ')}]\n`);
    });
}

// 单调栈可视化演示
function demonstrateMonotonicStack() {
    console.log('=== 单调栈算法可视化演示 ===');

    const temperatures = [73, 74, 75, 71, 69, 72, 76, 73];
    const stack = [];
    const result = new Array(temperatures.length).fill(0);

    console.log('处理温度数组 [73, 74, 75, 71, 69, 72, 76, 73]：\n');

    for (let i = 0; i < temperatures.length; i++) {
        const temp = temperatures[i];
        console.log(`第 ${i} 天，温度 ${temp}°C`);
        console.log(`当前栈（索引）: [${stack.join(', ')}]`);
        console.log(`对应温度: [${stack.map(idx => temperatures[idx]).join(', ')}]`);

        // 处理栈中温度较低的天数
        while (stack.length > 0 && temp > temperatures[stack[stack.length - 1]]) {
            const prevIndex = stack.pop();
            const waitDays = i - prevIndex;
            result[prevIndex] = waitDays;
            console.log(`  ✓ 第 ${prevIndex} 天（${temperatures[prevIndex]}°C）等待 ${waitDays} 天后遇到更高温度`);
        }

        stack.push(i);
        console.log(`将第 ${i} 天压入栈`);
        console.log(`当前结果: [${result.join(', ')}]`);
        console.log('');
    }

    console.log('最终结果: [' + result.join(', ') + ']');
    console.log('栈中剩余的天数没有找到更高温度');
}

// 算法性能对比
function performanceTest() {
    console.log('\n=== 性能对比测试 ===');

    // 生成测试数据
    const sizes = [1000, 5000, 10000];

    sizes.forEach(size => {
        console.log(`\n测试数据规模: ${size} 天`);

        // 生成随机温度数据（20-40度范围）
        const temperatures = Array.from({ length: size }, () =>
            Math.floor(Math.random() * 21) + 20
        );

        // 测试单调栈方法
        console.time('单调栈方法');
        const stackResult = dailyTemperatures([...temperatures]);
        console.timeEnd('单调栈方法');

        // 测试逆向遍历方法
        console.time('逆向遍历方法');
        const reverseResult = dailyTemperaturesReverse([...temperatures]);
        console.timeEnd('逆向遍历方法');

        // 只在小数据集上测试暴力方法
        if (size <= 1000) {
            console.time('暴力方法');
            const bruteResult = dailyTemperaturesBruteForce([...temperatures]);
            console.timeEnd('暴力方法');

            // 验证结果一致性
            const isConsistent = JSON.stringify(stackResult) === JSON.stringify(bruteResult) &&
                               JSON.stringify(stackResult) === JSON.stringify(reverseResult);
            console.log(`结果一致性: ${isConsistent ? '✅' : '❌'}`);
        } else {
            const isConsistent = JSON.stringify(stackResult) === JSON.stringify(reverseResult);
            console.log(`单调栈与逆向遍历结果一致性: ${isConsistent ? '✅' : '❌'}`);
        }
    });
}

// 温度变化模式分析
function temperaturePatternAnalysis() {
    console.log('\n=== 温度变化模式分析 ===');

    const patterns = [
        {
            name: '严格递增',
            temperatures: [10, 20, 30, 40, 50],
            description: '每天温度都比前一天高'
        },
        {
            name: '严格递减',
            temperatures: [50, 40, 30, 20, 10],
            description: '每天温度都比前一天低'
        },
        {
            name: '山峰型',
            temperatures: [20, 30, 40, 30, 20],
            description: '先上升后下降'
        },
        {
            name: '山谷型',
            temperatures: [40, 30, 20, 30, 40],
            description: '先下降后上升'
        },
        {
            name: '波动型',
            temperatures: [30, 35, 25, 40, 20, 45],
            description: '温度波动变化'
        }
    ];

    patterns.forEach(({ name, temperatures, description }) => {
        console.log(`\n${name}模式: ${description}`);
        console.log(`温度序列: [${temperatures.join(', ')}]`);

        const result = dailyTemperatures(temperatures);
        console.log(`等待天数: [${result.join(', ')}]`);

        // 分析模式特点
        const totalWaitDays = result.reduce((sum, days) => sum + days, 0);
        const avgWaitDays = totalWaitDays / result.length;
        const maxWaitDays = Math.max(...result);

        console.log(`平均等待天数: ${avgWaitDays.toFixed(1)}`);
        console.log(`最长等待天数: ${maxWaitDays}`);
    });
}

// 算法思想详解
function algorithmAnalysis() {
    console.log('\n=== 算法思想详解 ===');
    console.log(`
单调栈在每日温度问题中的应用:

1. 问题核心:
   - 对每一天，找到未来第一个温度更高的天数
   - 返回的是等待天数，而不是温度值
   - 典型的"下一个更大元素"变种问题

2. 单调栈解法优势:
   - 时间复杂度: O(n)，每个元素最多入栈出栈一次
   - 空间复杂度: O(n)，最坏情况栈存储所有索引
   - 一次遍历即可解决，无需嵌套循环

3. 关键思路:
   - 栈中存储索引，不是温度值
   - 维护单调递减的温度顺序
   - 当遇到更高温度时，栈中所有较低温度都找到答案
   - 答案是索引差值，即等待天数

4. 与其他解法对比:

   a) 暴力解法:
      - 时间复杂度: O(n²)
      - 对每个位置都要向后扫描
      - 存在大量重复计算

   b) 逆向遍历:
      - 利用已计算结果进行跳跃
      - 平均情况下效率不错
      - 但最坏情况仍是 O(n²)

   c) 单调栈:
      - 严格 O(n) 时间复杂度
      - 思路清晰，易于实现
      - 适用性强，可推广到类似问题

5. 应用扩展:
   - 下一个更大/更小元素
   - 直方图最大矩形面积
   - 柱状图接雨水
   - 股票价格跨度

选择建议:
- 面试首选: 单调栈解法（时间复杂度最优）
- 理解优先: 暴力解法（思路直观）
- 进阶学习: 逆向遍历（体现动态规划思想）
    `);
}

// 运行所有测试
if (typeof require !== 'undefined' && require.main === module) {
    runTests();
    demonstrateMonotonicStack();
    performanceTest();
    temperaturePatternAnalysis();
    algorithmAnalysis();
}

// Node.js导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        dailyTemperatures,
        dailyTemperaturesBruteForce,
        dailyTemperaturesReverse,
        runTests,
        demonstrateMonotonicStack,
        performanceTest,
        temperaturePatternAnalysis,
        algorithmAnalysis
    };
}