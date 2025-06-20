/**
 * LeetCode 020: x的平方根 (Sqrt(x))
 *
 * 题目描述：
 * 给你一个非负整数 x，计算并返回 x 的算术平方根。
 * 由于返回类型是整数，结果只保留整数部分，小数部分将被舍去。
 * 注意：不允许使用任何内置指数函数和算符，例如 pow(x, 0.5) 或者 x ** 0.5。
 *
 * 核心思想：
 * 查找平方根 - 找到最大的整数，使其平方小于等于目标值
 *
 * 算法原理：
 * 1. 二分查找：在[0, x]范围内查找满足条件的最大值
 * 2. 牛顿迭代法：通过迭代逼近精确值
 * 3. 数学方法：利用指数和对数函数
 */

/**
 * 解法一：二分查找法（推荐）
 *
 * 核心思想：
 * 在[0, x]范围内使用二分查找
 * 寻找最大的整数，使得其平方小于等于x
 *
 * @param {number} x - 非负整数
 * @returns {number} x的算术平方根（整数部分）
 * @time O(log x) 二分查找的时间复杂度
 * @space O(1) 只使用常数额外空间
 */
function mySqrt(x) {
    // 特殊情况处理
    if (x === 0 || x === 1) return x;

    let left = 1;
    let right = x;
    let result = 0;

    while (left <= right) {
        // 防止整数溢出，使用 left + (right - left) / 2
        const mid = Math.floor(left + (right - left) / 2);
        const square = mid * mid;

        if (square === x) {
            // 精确匹配，直接返回
            return mid;
        } else if (square < x) {
            // mid的平方小于x，记录当前结果，继续在右半部分查找
            result = mid;
            left = mid + 1;
        } else {
            // mid的平方大于x，在左半部分查找
            right = mid - 1;
        }
    }

    return result;
}

/**
 * 解法二：优化的二分查找法
 *
 * 核心思想：
 * 优化搜索范围，平方根不会超过x/2（当x > 4时）
 *
 * @param {number} x - 非负整数
 * @returns {number} x的算术平方根（整数部分）
 * @time O(log x)
 * @space O(1)
 */
function mySqrtOptimized(x) {
    if (x === 0 || x === 1) return x;

    // 优化搜索范围：当x > 4时，平方根不会超过x/2
    let left = 1;
    let right = x <= 4 ? x : Math.floor(x / 2);
    let result = 0;

    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        const square = mid * mid;

        if (square === x) {
            return mid;
        } else if (square < x) {
            result = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return result;
}

/**
 * 解法三：牛顿迭代法
 *
 * 核心思想：
 * 使用牛顿迭代法逼近平方根
 * 公式：x_{n+1} = (x_n + a/x_n) / 2
 * 其中a是目标数，x_n是当前估计值
 *
 * @param {number} x - 非负整数
 * @returns {number} x的算术平方根（整数部分）
 * @time O(log x) 迭代次数较少
 * @space O(1)
 */
function mySqrtNewton(x) {
    if (x === 0) return 0;

    // 初始估计值
    let estimate = x;

    while (true) {
        // 牛顿迭代公式
        const newEstimate = Math.floor((estimate + Math.floor(x / estimate)) / 2);

        // 如果估计值不再变化，说明已经收敛
        if (newEstimate >= estimate) {
            return estimate;
        }

        estimate = newEstimate;
    }
}

/**
 * 解法四：数学方法（使用指数和对数）
 *
 * 核心思想：
 * 利用数学关系：sqrt(x) = e^(ln(x)/2)
 * 虽然题目不允许使用内置函数，但这里展示数学原理
 *
 * @param {number} x - 非负整数
 * @returns {number} x的算术平方根（整数部分）
 * @time O(1) 数学函数调用
 * @space O(1)
 */
function mySqrtMath(x) {
    if (x === 0) return 0;

    // 使用数学公式：sqrt(x) = e^(ln(x)/2)
    // 注意：这种方法可能因为浮点数精度问题产生误差
    return Math.floor(Math.exp(Math.log(x) / 2));
}

/**
 * 解法五：位运算法
 *
 * 核心思想：
 * 逐位构造平方根，从最高位开始
 * 每次尝试在当前位设置1，检查是否仍然满足条件
 *
 * @param {number} x - 非负整数
 * @returns {number} x的算术平方根（整数部分）
 * @time O(log x)
 * @space O(1)
 */
function mySqrtBitwise(x) {
    if (x === 0) return 0;

    let result = 0;
    // 从最高位开始，JavaScript中安全整数最大约为2^53
    let bit = 1 << 15; // 从较高位开始，可以处理大部分情况

    // 找到合适的起始位
    while (bit > x) {
        bit >>= 1;
    }

    while (bit !== 0) {
        const temp = result | bit;
        if (temp * temp <= x) {
            result = temp;
        }
        bit >>= 1;
    }

    return result;
}

/**
 * 解法六：线性查找法（暴力法）
 *
 * 核心思想：
 * 从1开始逐个检查，直到找到最大的满足条件的整数
 * 仅用于演示，实际效率很低
 *
 * @param {number} x - 非负整数
 * @returns {number} x的算术平方根（整数部分）
 * @time O(sqrt(x)) 线性查找
 * @space O(1)
 */
function mySqrtLinear(x) {
    if (x === 0 || x === 1) return x;

    let i = 1;
    while (i * i <= x) {
        i++;
    }

    return i - 1;
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 020: x的平方根 测试 ===\n');

    const testCases = [
        {
            input: 4,
            expected: 2,
            description: '完全平方数：4的平方根'
        },
        {
            input: 8,
            expected: 2,
            description: '非完全平方数：8的平方根（舍去小数部分）'
        },
        {
            input: 0,
            expected: 0,
            description: '边界情况：0的平方根'
        },
        {
            input: 1,
            expected: 1,
            description: '边界情况：1的平方根'
        },
        {
            input: 16,
            expected: 4,
            description: '完全平方数：16的平方根'
        },
        {
            input: 17,
            expected: 4,
            description: '非完全平方数：17的平方根'
        },
        {
            input: 100,
            expected: 10,
            description: '完全平方数：100的平方根'
        },
        {
            input: 101,
            expected: 10,
            description: '非完全平方数：101的平方根'
        },
        {
            input: 2147395600,
            expected: 46340,
            description: '大数测试：接近整数最大值'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`输入: ${test.input}`);

        // 测试所有解法
        const result1 = mySqrt(test.input);
        const result2 = mySqrtOptimized(test.input);
        const result3 = mySqrtNewton(test.input);
        const result4 = mySqrtMath(test.input);
        const result5 = mySqrtBitwise(test.input);
        const result6 = test.input <= 10000 ? mySqrtLinear(test.input) : null; // 避免大数时间过长

        console.log(`二分查找法结果: ${result1}`);
        console.log(`优化二分查找法结果: ${result2}`);
        console.log(`牛顿迭代法结果: ${result3}`);
        console.log(`数学方法结果: ${result4}`);
        console.log(`位运算法结果: ${result5}`);
        if (result6 !== null) console.log(`线性查找法结果: ${result6}`);

        // 验证结果
        const results = [result1, result2, result3, result4, result5];
        if (result6 !== null) results.push(result6);

        const allCorrect = results.every(result => result === test.expected);
        console.log(`期望结果: ${test.expected}`);
        console.log(`结果验证: ${allCorrect ? '✅ 通过' : '❌ 失败'}`);

        // 显示精确的平方根值（用于理解）
        const exactSqrt = Math.sqrt(test.input);
        console.log(`精确平方根: ${exactSqrt.toFixed(6)} (整数部分: ${Math.floor(exactSqrt)})`);
        console.log('---');
    });
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能测试 ===');

    const testValues = [10000, 100000, 1000000, 10000000, 100000000];

    testValues.forEach(value => {
        console.log(`\n测试数值: ${value} (精确平方根: ${Math.sqrt(value).toFixed(2)})`);

        console.time('二分查找法');
        mySqrt(value);
        console.timeEnd('二分查找法');

        console.time('优化二分查找法');
        mySqrtOptimized(value);
        console.timeEnd('优化二分查找法');

        console.time('牛顿迭代法');
        mySqrtNewton(value);
        console.timeEnd('牛顿迭代法');

        console.time('数学方法');
        mySqrtMath(value);
        console.timeEnd('数学方法');

        console.time('位运算法');
        mySqrtBitwise(value);
        console.timeEnd('位运算法');

        // 线性查找法对大数太慢，跳过
        if (value <= 100000) {
            console.time('线性查找法');
            mySqrtLinear(value);
            console.timeEnd('线性查找法');
        }
    });
}

// 算法演示
function algorithmDemo() {
    console.log('\n=== 算法演示 ===');

    const x = 17;
    console.log(`寻找 ${x} 的平方根（整数部分）`);
    console.log(`精确值: ${Math.sqrt(x).toFixed(6)}`);
    console.log(`期望结果: ${Math.floor(Math.sqrt(x))}`);
    console.log('');

    console.log('二分查找过程演示:');
    let left = 1;
    let right = x;
    let result = 0;
    let step = 1;

    while (left <= right) {
        const mid = Math.floor(left + (right - left) / 2);
        const square = mid * mid;

        console.log(`步骤${step}: 区间[${left}, ${right}], 中点=${mid}, ${mid}²=${square}`);

        if (square === x) {
            console.log(`步骤${step}: 找到精确值 ${mid}`);
            result = mid;
            break;
        } else if (square < x) {
            console.log(`步骤${step}: ${square} < ${x}, 记录结果${mid}, 搜索右半部分`);
            result = mid;
            left = mid + 1;
        } else {
            console.log(`步骤${step}: ${square} > ${x}, 搜索左半部分`);
            right = mid - 1;
        }
        step++;
    }

    console.log(`最终结果: ${result}`);
    console.log('');

    console.log('牛顿迭代法演示:');
    let estimate = x;
    step = 1;

    console.log(`初始估计值: ${estimate}`);

    while (step <= 5) { // 限制演示步数
        const newEstimate = Math.floor((estimate + Math.floor(x / estimate)) / 2);
        console.log(`迭代${step}: (${estimate} + ${Math.floor(x / estimate)}) / 2 = ${newEstimate}`);

        if (newEstimate >= estimate) {
            console.log(`迭代${step}: 收敛，最终结果 ${estimate}`);
            break;
        }

        estimate = newEstimate;
        step++;
    }
}

// 边界情况分析
function edgeCaseAnalysis() {
    console.log('\n=== 边界情况分析 ===');

    const edgeCases = [
        {
            case: 'x = 0',
            analysis: '0的平方根是0',
            handling: '直接返回0'
        },
        {
            case: 'x = 1',
            analysis: '1的平方根是1',
            handling: '直接返回1'
        },
        {
            case: '完全平方数（如4, 9, 16）',
            analysis: '存在整数平方根',
            handling: '返回精确的整数值'
        },
        {
            case: '非完全平方数（如8, 17）',
            analysis: '平方根不是整数',
            handling: '返回小于平方根的最大整数'
        },
        {
            case: '大数（接近INT_MAX）',
            analysis: '可能存在整数溢出',
            handling: '使用防溢出的中点计算方法'
        },
        {
            case: '边界值 2^31 - 1',
            analysis: 'JavaScript中的最大安全整数',
            handling: '确保算法在此范围内正常工作'
        }
    ];

    console.log('边界情况处理策略:');
    edgeCases.forEach((testCase, index) => {
        console.log(`${index + 1}. ${testCase.case}`);
        console.log(`   分析: ${testCase.analysis}`);
        console.log(`   处理: ${testCase.handling}`);
        console.log('');
    });
}

// 数学原理解释
function mathematicalPrinciples() {
    console.log('\n=== 数学原理解释 ===');

    console.log('1. 二分查找原理:');
    console.log('   - 目标：找到最大的整数k，使得k² ≤ x');
    console.log('   - 搜索空间：[0, x]，实际上可以优化为[0, x/2]（当x > 4时）');
    console.log('   - 单调性：平方函数在非负区间内单调递增');
    console.log('   - 时间复杂度：O(log x)');
    console.log('');

    console.log('2. 牛顿迭代法原理:');
    console.log('   - 目标方程：f(x) = x² - a = 0');
    console.log('   - 导数：f\'(x) = 2x');
    console.log('   - 迭代公式：x_{n+1} = x_n - f(x_n)/f\'(x_n) = (x_n + a/x_n)/2');
    console.log('   - 收敛性：二次收敛，非常快速');
    console.log('   - 几何意义：切线逼近');
    console.log('');

    console.log('3. 位运算法原理:');
    console.log('   - 逐位构造平方根的二进制表示');
    console.log('   - 从最高位开始，尝试在每个位置设置1');
    console.log('   - 检查当前构造的数的平方是否不超过目标值');
    console.log('   - 利用位运算的高效性');
    console.log('');

    console.log('4. 数学公式法:');
    console.log('   - 基于恒等式：√x = e^(ln(x)/2)');
    console.log('   - 利用指数和对数函数的内置实现');
    console.log('   - 注意浮点数精度问题');
    console.log('   - 虽然简洁，但不符合题目要求');
}

// 复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. 二分查找法（推荐）:');
    console.log('   时间复杂度: O(log x)');
    console.log('   空间复杂度: O(1)');
    console.log('   优点: 稳定，易理解，适合面试');
    console.log('   缺点: 相对牛顿法略慢');
    console.log('');

    console.log('2. 优化二分查找法:');
    console.log('   时间复杂度: O(log x)');
    console.log('   空间复杂度: O(1)');
    console.log('   优点: 搜索范围更小，实际性能更好');
    console.log('   缺点: 代码略复杂');
    console.log('');

    console.log('3. 牛顿迭代法:');
    console.log('   时间复杂度: O(log log x) - 二次收敛');
    console.log('   空间复杂度: O(1)');
    console.log('   优点: 收敛速度极快');
    console.log('   缺点: 理解相对困难');
    console.log('');

    console.log('4. 位运算法:');
    console.log('   时间复杂度: O(log x)');
    console.log('   空间复杂度: O(1)');
    console.log('   优点: 位运算效率高');
    console.log('   缺点: 实现复杂，容易出错');
    console.log('');

    console.log('5. 线性查找法:');
    console.log('   时间复杂度: O(√x)');
    console.log('   空间复杂度: O(1)');
    console.log('   优点: 实现简单');
    console.log('   缺点: 效率低，不实用');
    console.log('');

    console.log('6. 数学方法:');
    console.log('   时间复杂度: O(1)');
    console.log('   空间复杂度: O(1)');
    console.log('   优点: 最快速');
    console.log('   缺点: 不符合题目要求，精度问题');
}

// 扩展应用
function extendedApplications() {
    console.log('\n=== 扩展应用 ===');

    console.log('1. 算法扩展:');
    console.log('   - 计算n次方根');
    console.log('   - 求解任意方程的数值解');
    console.log('   - 优化问题中的搜索');
    console.log('   - 计算几何中的距离计算');
    console.log('');

    console.log('2. 工程应用:');
    console.log('   - 信号处理（RMS值计算）');
    console.log('   - 图形学（向量长度计算）');
    console.log('   - 物理模拟（速度、力的计算）');
    console.log('   - 金融计算（波动率等）');
    console.log('');

    console.log('3. 前端应用场景:');
    console.log('   - 动画缓动函数');
    console.log('   - 图像处理算法');
    console.log('   - 游戏物理引擎');
    console.log('   - 数据可视化中的比例计算');
    console.log('');

    console.log('4. 算法思想应用:');
    console.log('   - 二分查找在其他问题中的应用');
    console.log('   - 牛顿法在机器学习优化中的应用');
    console.log('   - 数值计算方法的通用原理');
    console.log('   - 精度控制和误差分析');
}

// 实际应用示例
function practicalExample() {
    console.log('\n=== 实际应用示例 ===');

    // 示例1：向量长度计算
    function vectorLength(x, y) {
        const lengthSquared = x * x + y * y;
        return mySqrt(lengthSquared);
    }

    // 示例2：距离计算
    function euclideanDistance(x1, y1, x2, y2) {
        const dx = x1 - x2;
        const dy = y1 - y2;
        const distanceSquared = dx * dx + dy * dy;
        return mySqrt(distanceSquared);
    }

    // 示例3：数值平方根计算器
    class SquareRootCalculator {
        constructor() {
            this.precision = 6; // 小数精度
        }

        // 整数平方根
        integerSqrt(x) {
            return mySqrt(x);
        }

        // 精确平方根（使用牛顿法）
        preciseSqrt(x, precision = this.precision) {
            if (x === 0) return 0;

            let estimate = x;
            const epsilon = Math.pow(10, -precision);

            while (true) {
                const newEstimate = (estimate + x / estimate) / 2;
                if (Math.abs(newEstimate - estimate) < epsilon) {
                    return parseFloat(newEstimate.toFixed(precision));
                }
                estimate = newEstimate;
            }
        }

        // 快速估算
        quickEstimate(x) {
            if (x < 4) return x < 1 ? 0 : 1;

            // 使用位运算快速估算
            let estimate = 1;
            while (estimate * estimate < x) {
                estimate <<= 1;
            }
            return estimate >> 1;
        }
    }

    // 示例4：平方根性能比较工具
    function performanceComparison(x) {
        const methods = [
            { name: '二分查找', func: mySqrt },
            { name: '牛顿迭代', func: mySqrtNewton },
            { name: '位运算法', func: mySqrtBitwise }
        ];

        console.log(`平方根计算性能比较 (x = ${x}):`);
        methods.forEach(method => {
            const start = performance.now();
            const result = method.func(x);
            const end = performance.now();
            console.log(`${method.name}: 结果=${result}, 耗时=${(end - start).toFixed(3)}ms`);
        });
    }

    console.log('向量长度计算示例:');
    console.log(`向量(3, 4)的长度: ${vectorLength(3, 4)}`);
    console.log(`向量(5, 12)的长度: ${vectorLength(5, 12)}`);
    console.log('');

    console.log('距离计算示例:');
    console.log(`点(0,0)到点(3,4)的距离: ${euclideanDistance(0, 0, 3, 4)}`);
    console.log(`点(1,1)到点(4,5)的距离: ${euclideanDistance(1, 1, 4, 5)}`);
    console.log('');

    console.log('平方根计算器示例:');
    const calc = new SquareRootCalculator();
    const testValue = 50;
    console.log(`${testValue}的整数平方根: ${calc.integerSqrt(testValue)}`);
    console.log(`${testValue}的精确平方根: ${calc.preciseSqrt(testValue)}`);
    console.log(`${testValue}的快速估算: ${calc.quickEstimate(testValue)}`);
    console.log('');

    // 性能比较（如果支持performance.now）
    if (typeof performance !== 'undefined') {
        performanceComparison(1000000);
    }
}

// 数值精度问题探讨
function numericalPrecisionIssues() {
    console.log('\n=== 数值精度问题探讨 ===');

    console.log('JavaScript中的数值精度问题:');
    console.log('1. 整数安全范围: ±2^53 (Number.MAX_SAFE_INTEGER)');
    console.log('2. 浮点数精度: IEEE 754双精度');
    console.log('3. 大整数处理: 可以使用BigInt');
    console.log('');

    console.log('平方根计算中的精度考虑:');
    console.log('- 整数溢出: mid * mid 可能超出安全范围');
    console.log('- 浮点误差: 数学函数可能产生微小误差');
    console.log('- 舍入策略: 题目要求舍去小数部分');
    console.log('');

    // 演示精度问题
    const largeNumber = Number.MAX_SAFE_INTEGER;
    console.log(`大数测试: ${largeNumber}`);
    console.log(`其平方根约为: ${Math.sqrt(largeNumber).toFixed(0)}`);
    console.log(`使用二分查找: ${mySqrt(largeNumber)}`);
    console.log(`使用牛顿法: ${mySqrtNewton(largeNumber)}`);
}

// 运行测试
if (require.main === module) {
    runTests();
    performanceTest();
    algorithmDemo();
    edgeCaseAnalysis();
    mathematicalPrinciples();
    complexityAnalysis();
    extendedApplications();
    practicalExample();
    numericalPrecisionIssues();
}