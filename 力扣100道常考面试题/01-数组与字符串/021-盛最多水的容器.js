/**
 * LeetCode 022: 盛最多水的容器 (Container With Most Water)
 *
 * 题目描述：
 * 给定一个长度为 n 的整数数组 height。有 n 条垂线，第 i 条线的两个端点是 (i, 0) 和 (i, height[i])。
 * 找出其中的两条线，使得它们与 x 轴共同构成的容器可以容纳最多的水。
 *
 * 核心思想：
 * 1. 双指针贪心算法：从两端开始向中间移动，每次移动较短的边
 * 2. 容器面积 = min(高度1, 高度2) × 宽度
 * 3. 贪心策略：移动较短边才可能获得更大面积
 *
 * 解题思路：
 * - 水的面积由较短的边决定（短板效应）
 * - 移动较长的边不会增加面积（高度不变，宽度减小）
 * - 移动较短的边可能遇到更高的边，从而增加面积
 * - 双指针从两端向中间收缩，确保不遗漏最优解
 */

/**
 * 方法一：双指针法（推荐解法）
 *
 * 核心思想：
 * 利用贪心策略，从两端开始，每次移动较短的边来寻找更大的容器面积
 *
 * 算法步骤：
 * 1. 设置左右指针分别指向数组首尾
 * 2. 计算当前容器面积
 * 3. 移动高度较小的指针（贪心选择）
 * 4. 更新最大面积，重复直到指针相遇
 *
 * 贪心证明：
 * 假设 height[left] < height[right]，移动 right 指针：
 * - 新面积 = min(height[left], height[right-1]) * (right-1-left)
 * - 因为 min(height[left], height[right-1]) <= height[left]
 * - 且 (right-1-left) < (right-left)
 * - 所以新面积一定不会更大，因此应该移动left指针
 *
 * @param {number[]} height - 垂线高度数组
 * @returns {number} 最大容器面积
 * @time O(n) - 双指针一次遍历
 * @space O(1) - 只使用常数额外空间
 */
function maxArea(height) {
    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;

    // 双指针向中间移动
    while (left < right) {
        // 计算当前容器面积：高度取较小值，宽度为指针间距
        const width = right - left;
        const currentHeight = Math.min(height[left], height[right]);
        const currentArea = width * currentHeight;

        // 更新最大面积
        maxWater = Math.max(maxWater, currentArea);

        // 贪心策略：移动较短的边
        if (height[left] < height[right]) {
            left++; // 左边较短，移动左指针
        } else {
            right--; // 右边较短或相等，移动右指针
        }
    }

    return maxWater;
}

/**
 * 方法二：优化的双指针法（提前终止）
 *
 * 核心思想：
 * 在基本双指针法基础上添加剪枝优化，提前终止不可能的情况
 *
 * @param {number[]} height - 垂线高度数组
 * @returns {number} 最大容器面积
 * @time O(n) - 但常数因子更小
 * @space O(1) - 只使用常数额外空间
 */
function maxAreaOptimized(height) {
    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;

    while (left < right) {
        const width = right - left;
        const leftHeight = height[left];
        const rightHeight = height[right];
        const currentHeight = Math.min(leftHeight, rightHeight);
        const currentArea = width * currentHeight;

        maxWater = Math.max(maxWater, currentArea);

        // 优化：跳过相同高度的线条
        if (leftHeight < rightHeight) {
            // 跳过左侧所有不高于当前高度的线条
            while (left < right && height[left] <= leftHeight) {
                left++;
            }
        } else {
            // 跳过右侧所有不高于当前高度的线条
            while (left < right && height[right] <= rightHeight) {
                right--;
            }
        }
    }

    return maxWater;
}

/**
 * 方法三：暴力遍历法（用于理解和对比）
 *
 * 核心思想：
 * 枚举所有可能的两条线的组合，计算每种组合的容器面积
 *
 * 算法步骤：
 * 1. 双重循环遍历所有线条对
 * 2. 计算每对线条构成的容器面积
 * 3. 记录最大面积
 *
 * @param {number[]} height - 垂线高度数组
 * @returns {number} 最大容器面积
 * @time O(n²) - 双重循环
 * @space O(1) - 只使用常数额外空间
 */
function maxAreaBruteForce(height) {
    let maxWater = 0;

    // 双重循环枚举所有可能的线条对
    for (let i = 0; i < height.length - 1; i++) {
        for (let j = i + 1; j < height.length; j++) {
            // 计算容器面积
            const width = j - i;
            const currentHeight = Math.min(height[i], height[j]);
            const currentArea = width * currentHeight;

            // 更新最大面积
            maxWater = Math.max(maxWater, currentArea);
        }
    }

    return maxWater;
}

/**
 * 方法四：分治法（展示递归思想）
 *
 * 核心思想：
 * 将问题分解为更小的子问题，递归求解
 *
 * @param {number[]} height - 垂线高度数组
 * @param {number} left - 左边界
 * @param {number} right - 右边界
 * @returns {number} 最大容器面积
 * @time O(n log n) - 分治递归
 * @space O(log n) - 递归栈空间
 */
function maxAreaDivideConquer(height, left = 0, right = height.length - 1) {
    // 基础情况
    if (left >= right) return 0;

    // 当前边界的容器面积
    const currentArea = Math.min(height[left], height[right]) * (right - left);

    // 递归计算子问题
    let maxSubArea = 0;

    // 根据高度决定递归方向
    if (height[left] < height[right]) {
        maxSubArea = maxAreaDivideConquer(height, left + 1, right);
    } else {
        maxSubArea = maxAreaDivideConquer(height, left, right - 1);
    }

    // 返回当前面积和子问题的最大值
    return Math.max(currentArea, maxSubArea);
}

/**
 * 方法五：动态规划思路（理论探讨）
 *
 * 核心思想：
 * 记录每个位置作为左边界时的最大面积
 *
 * @param {number[]} height - 垂线高度数组
 * @returns {number} 最大容器面积
 * @time O(n²) - 仍需要内层遍历
 * @space O(n) - 存储状态数组
 */
function maxAreaDP(height) {
    const n = height.length;
    let maxWater = 0;

    // dp[i] 表示以位置i为左边界的最大容器面积
    for (let i = 0; i < n - 1; i++) {
        let maxForI = 0;

        for (let j = i + 1; j < n; j++) {
            const area = Math.min(height[i], height[j]) * (j - i);
            maxForI = Math.max(maxForI, area);
        }

        maxWater = Math.max(maxWater, maxForI);
    }

    return maxWater;
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 022: 盛最多水的容器 测试 ===\n');

    const testCases = [
        {
            name: '基础测试',
            input: [1, 8, 6, 2, 5, 4, 8, 3, 7],
            expected: 49,
            explanation: '索引1和8的线段，高度8和7，面积 = min(8,7) * (8-1) = 7 * 7 = 49'
        },
        {
            name: '两个元素',
            input: [1, 1],
            expected: 1,
            explanation: '只有两条线，面积 = min(1,1) * (1-0) = 1'
        },
        {
            name: '递增序列',
            input: [1, 2, 3, 4, 5],
            expected: 6,
            explanation: '选择索引0和4，面积 = min(1,5) * (4-0) = 1 * 4 = 4，但最优是索引1和4，面积=2*3=6'
        },
        {
            name: '递减序列',
            input: [5, 4, 3, 2, 1],
            expected: 6,
            explanation: '选择索引0和3，面积 = min(5,2) * (3-0) = 2 * 3 = 6'
        },
        {
            name: '相同高度',
            input: [3, 3, 3, 3],
            expected: 9,
            explanation: '选择索引0和3，面积 = min(3,3) * (3-0) = 3 * 3 = 9'
        },
        {
            name: '单个元素',
            input: [1],
            expected: 0,
            explanation: '只有一条线，无法构成容器'
        },
        {
            name: '大数组',
            input: [1, 3, 2, 5, 25, 24, 5],
            expected: 24,
            explanation: '选择索引3和5，面积 = min(5,24) * (5-3) = 5 * 2 = 10，但最优解需要仔细计算'
        }
    ];

    const methods = [
        { name: '双指针法', func: maxArea },
        { name: '优化双指针法', func: maxAreaOptimized },
        { name: '暴力遍历法', func: maxAreaBruteForce },
        { name: '分治法', func: maxAreaDivideConquer },
        { name: '动态规划法', func: maxAreaDP }
    ];

    testCases.forEach(testCase => {
        console.log(`测试: ${testCase.name}`);
        console.log(`输入: [${testCase.input.join(', ')}]`);
        console.log(`期望: ${testCase.expected}`);
        console.log(`说明: ${testCase.explanation}`);

        methods.forEach(method => {
            const result = method.func([...testCase.input]);
            const isCorrect = result === testCase.expected;
            console.log(`${method.name}: ${result} ${isCorrect ? '✓' : '✗'}`);
        });
        console.log('');
    });
}

// 性能测试
function performanceTest() {
    console.log('=== 性能测试 ===\n');

    // 生成测试数据
    const generateTestArray = (size) => {
        const arr = [];
        for (let i = 0; i < size; i++) {
            arr.push(Math.floor(Math.random() * 1000) + 1); // 1 到 1000 的随机高度
        }
        return arr;
    };

    const testSizes = [100, 1000, 5000];
    const methods = [
        { name: '双指针法', func: maxArea },
        { name: '优化双指针法', func: maxAreaOptimized },
        { name: '暴力遍历法', func: maxAreaBruteForce }
    ];

    testSizes.forEach(size => {
        console.log(`数组大小: ${size}`);
        const testArray = generateTestArray(size);

        methods.forEach(method => {
            const startTime = performance.now();
            const result = method.func([...testArray]);
            const endTime = performance.now();

            console.log(`${method.name}: ${(endTime - startTime).toFixed(2)}ms, 结果: ${result}`);
        });
        console.log('');
    });
}

// 算法演示
function demonstrateAlgorithm() {
    console.log('=== 算法演示 ===\n');

    const height = [1, 8, 6, 2, 5, 4, 8, 3, 7];
    console.log(`高度数组: [${height.join(', ')}]`);
    console.log('索引:    [0, 1, 2, 3, 4, 5, 6, 7, 8]');

    console.log('\n双指针查找过程：');

    let left = 0;
    let right = height.length - 1;
    let maxWater = 0;
    let step = 0;

    while (left < right) {
        step++;
        const width = right - left;
        const leftHeight = height[left];
        const rightHeight = height[right];
        const currentHeight = Math.min(leftHeight, rightHeight);
        const currentArea = width * currentHeight;

        console.log(`步骤${step}:`);
        console.log(`  左指针: ${left} (高度=${leftHeight}), 右指针: ${right} (高度=${rightHeight})`);
        console.log(`  宽度: ${width}, 高度: ${currentHeight}, 面积: ${currentArea}`);

        if (currentArea > maxWater) {
            maxWater = currentArea;
            console.log(`  ✓ 更新最大面积: ${maxWater}`);
        }

        // 移动较短的边
        if (leftHeight < rightHeight) {
            console.log(`  左边较短，移动左指针`);
            left++;
        } else {
            console.log(`  右边较短或相等，移动右指针`);
            right--;
        }
        console.log('');
    }

    console.log(`最终结果: ${maxWater}`);
}

// 几何直观展示
function visualizeContainer() {
    console.log('=== 几何可视化 ===\n');

    const height = [1, 8, 6, 2, 5, 4, 8, 3, 7];
    console.log('容器示意图（用 | 表示垂线）：\n');

    const maxHeight = Math.max(...height);

    // 从上往下绘制
    for (let h = maxHeight; h >= 1; h--) {
        let line = '';
        for (let i = 0; i < height.length; i++) {
            if (height[i] >= h) {
                line += '|  ';
            } else {
                line += '   ';
            }
        }
        console.log(`${h.toString().padStart(2)}: ${line}`);
    }

    // 绘制底部索引
    let indexLine = '    ';
    for (let i = 0; i < height.length; i++) {
        indexLine += `${i}  `;
    }
    console.log(indexLine);

    console.log('\n最优解分析：');
    console.log('索引1(高度8)和索引8(高度7)构成最大容器');
    console.log('面积 = min(8, 7) × (8 - 1) = 7 × 7 = 49');
}

// 边界情况分析
function edgeCaseAnalysis() {
    console.log('=== 边界情况分析 ===\n');

    const edgeCases = [
        {
            name: '空数组',
            input: [],
            analysis: '无垂线，无法构成容器'
        },
        {
            name: '单个元素',
            input: [5],
            analysis: '只有一条垂线，无法构成容器'
        },
        {
            name: '两个相同高度',
            input: [3, 3],
            analysis: '最简单的容器，面积=3*1=3'
        },
        {
            name: '两个不同高度',
            input: [1, 5],
            analysis: '高度取较小值，面积=1*1=1'
        },
        {
            name: '全部相同高度',
            input: [4, 4, 4, 4],
            analysis: '选择两端，面积=4*3=12'
        },
        {
            name: '严格递增',
            input: [1, 2, 3, 4, 5],
            analysis: '最优解可能不是两端'
        },
        {
            name: '严格递减',
            input: [5, 4, 3, 2, 1],
            analysis: '最优解通常是两端'
        }
    ];

    edgeCases.forEach(testCase => {
        console.log(`情况: ${testCase.name}`);
        console.log(`输入: [${testCase.input.join(', ')}]`);
        console.log(`分析: ${testCase.analysis}`);

        if (testCase.input.length >= 2) {
            const result = maxArea([...testCase.input]);
            console.log(`结果: ${result}`);
        } else {
            console.log(`结果: 0 (不足两条线)`);
        }
        console.log('');
    });
}

// 算法设计思想分析
function algorithmDesignAnalysis() {
    console.log('=== 算法设计思想分析 ===\n');

    console.log('1. 贪心策略的正确性：');
    console.log('   - 容器面积由较短边决定（短板效应）');
    console.log('   - 移动较长边不可能增加面积（高度不变，宽度减小）');
    console.log('   - 移动较短边有可能遇到更高的边，从而增加面积');

    console.log('\n2. 双指针技巧：');
    console.log('   - 从问题的两个极端开始');
    console.log('   - 通过贪心策略确定指针移动方向');
    console.log('   - 保证不遗漏最优解');

    console.log('\n3. 时间复杂度优化：');
    console.log('   - 从O(n²)的暴力解法优化到O(n)');
    console.log('   - 每个元素最多被访问一次');
    console.log('   - 避免了不必要的重复计算');

    console.log('\n4. 空间复杂度优化：');
    console.log('   - 只使用常数个变量存储状态');
    console.log('   - 原地算法，不需要额外存储空间');

    console.log('\n5. 问题转化思想：');
    console.log('   - 将几何问题转化为数组问题');
    console.log('   - 利用数学性质（短板效应）指导算法设计');
}

// 复杂度分析
function complexityAnalysis() {
    console.log('=== 复杂度分析 ===\n');

    const methods = [
        {
            name: '双指针法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            description: '每个元素最多访问一次'
        },
        {
            name: '优化双指针法',
            timeComplexity: 'O(n)',
            spaceComplexity: 'O(1)',
            description: '跳过相同高度，常数因子更小'
        },
        {
            name: '暴力遍历法',
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(1)',
            description: '枚举所有可能的线条对'
        },
        {
            name: '分治法',
            timeComplexity: 'O(n log n)',
            spaceComplexity: 'O(log n)',
            description: '递归分解，但效率不如双指针'
        },
        {
            name: '动态规划法',
            timeComplexity: 'O(n²)',
            spaceComplexity: 'O(n)',
            description: '记录状态，但仍需内层循环'
        }
    ];

    console.log('各方法复杂度对比：');
    console.log('方法\t\t\t时间复杂度\t空间复杂度\t说明');
    console.log('-'.repeat(80));

    methods.forEach(method => {
        console.log(`${method.name.padEnd(15)}\t${method.timeComplexity}\t\t${method.spaceComplexity}\t\t${method.description}`);
    });

    console.log('\n推荐使用双指针法的原因：');
    console.log('1. 时间复杂度最优O(n)');
    console.log('2. 空间复杂度最优O(1)');
    console.log('3. 算法思路清晰易懂');
    console.log('4. 实现简洁高效');
}

// 扩展应用
function extendedApplications() {
    console.log('=== 扩展应用 ===\n');

    console.log('1. 相关几何问题：');
    console.log('   - 最大矩形面积问题');
    console.log('   - 接雨水问题');
    console.log('   - 柱状图中最大矩形');

    console.log('\n2. 双指针技巧的其他应用：');
    console.log('   - 两数之和（有序数组）');
    console.log('   - 三数之和');
    console.log('   - 移除重复元素');

    console.log('\n3. 贪心算法的应用：');
    console.log('   - 活动选择问题');
    console.log('   - 背包问题变种');
    console.log('   - 区间调度问题');

    // 示例：接雨水问题的对比
    function trapRainWater(height) {
        let left = 0, right = height.length - 1;
        let leftMax = 0, rightMax = 0;
        let water = 0;

        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    water += leftMax - height[left];
                }
                left++;
            } else {
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    water += rightMax - height[right];
                }
                right--;
            }
        }

        return water;
    }

    console.log('\n接雨水问题示例：');
    const heights = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
    const trapped = trapRainWater(heights);
    console.log(`高度: [${heights.join(', ')}]`);
    console.log(`能接的雨水: ${trapped}`);
}

// 实际应用示例
function practicalExample() {
    console.log('=== 实际应用示例 ===\n');

    console.log('场景：水库设计优化');
    console.log('问题：在给定地形中选择最佳位置建造水坝，使蓄水量最大');

    // 模拟地形高度数据
    const terrain = [5, 12, 8, 3, 9, 6, 15, 4, 11];
    console.log(`地形高度: [${terrain.join(', ')}]`);
    console.log('(数值表示海拔高度，单位：米)');

    const maxWater = maxArea(terrain);

    // 找到最优解的具体位置
    let left = 0, right = terrain.length - 1;
    let bestLeft = 0, bestRight = 0, bestArea = 0;

    while (left < right) {
        const area = Math.min(terrain[left], terrain[right]) * (right - left);
        if (area > bestArea) {
            bestArea = area;
            bestLeft = left;
            bestRight = right;
        }

        if (terrain[left] < terrain[right]) {
            left++;
        } else {
            right--;
        }
    }

    console.log('\n最佳水库设计方案：');
    console.log(`左坝位置: 索引${bestLeft} (高度${terrain[bestLeft]}米)`);
    console.log(`右坝位置: 索引${bestRight} (高度${terrain[bestRight]}米)`);
    console.log(`坝间距离: ${bestRight - bestLeft}个单位`);
    console.log(`水位高度: ${Math.min(terrain[bestLeft], terrain[bestRight])}米`);
    console.log(`蓄水容量: ${bestArea}立方单位`);
}

// 面试要点总结
function interviewKeyPoints() {
    console.log('=== 面试要点总结 ===\n');

    console.log('🎯 核心考点：');
    console.log('1. 双指针技巧的应用');
    console.log('2. 贪心算法的设计与证明');
    console.log('3. 几何问题的数学建模');
    console.log('4. 时间复杂度的优化思路');

    console.log('\n💡 解题思路：');
    console.log('1. 理解题目：容器面积计算公式');
    console.log('2. 暴力思路：枚举所有线条对O(n²)');
    console.log('3. 优化思路：双指针+贪心策略O(n)');
    console.log('4. 证明正确性：移动较短边的合理性');

    console.log('\n🔍 关键insight：');
    console.log('1. 容器面积由较短边决定（短板效应）');
    console.log('2. 移动较长边不可能增加面积');
    console.log('3. 双指针确保不遗漏最优解');

    console.log('\n⚡ 常见变形：');
    console.log('1. 接雨水问题');
    console.log('2. 最大矩形面积');
    console.log('3. 柱状图中最大矩形');

    console.log('\n🎲 面试技巧：');
    console.log('1. 先说暴力解法，再优化');
    console.log('2. 画图帮助理解和解释');
    console.log('3. 强调贪心策略的正确性');
    console.log('4. 分析时间空间复杂度');
}

// 导出所有方法
module.exports = {
    maxArea,
    maxAreaOptimized,
    maxAreaBruteForce,
    maxAreaDivideConquer,
    maxAreaDP,
    runTests,
    performanceTest,
    demonstrateAlgorithm,
    visualizeContainer,
    edgeCaseAnalysis,
    algorithmDesignAnalysis,
    complexityAnalysis,
    extendedApplications,
    practicalExample,
    interviewKeyPoints
};

// 如果直接运行此文件，则执行测试
if (require.main === module) {
    runTests();
    performanceTest();
    demonstrateAlgorithm();
    visualizeContainer();
    edgeCaseAnalysis();
    algorithmDesignAnalysis();
    complexityAnalysis();
    extendedApplications();
    practicalExample();
    interviewKeyPoints();
}