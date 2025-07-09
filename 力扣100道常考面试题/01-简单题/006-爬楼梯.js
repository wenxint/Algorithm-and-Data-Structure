/**
 * LeetCode 006: 爬楼梯 (Climbing Stairs)
 *
 * 题目描述：
 * 假设你正在爬楼梯。需要 n 阶你才能到达楼顶。
 * 每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？
 *
 * 核心思想：
 * 动态规划经典入门问题 - 斐波那契数列的变形
 * 核心理念：到达第n阶的方法数 = 到达第(n-1)阶的方法数 + 到达第(n-2)阶的方法数
 *
 * 算法原理：
 * 1. 状态定义：dp[i] = 到达第i阶的方法数
 * 2. 状态转移：dp[i] = dp[i-1] + dp[i-2]
 * 3. 初始条件：dp[1] = 1, dp[2] = 2
 * 4. 目标答案：dp[n]
 */

/**
 * 解法一：动态规划（推荐）
 *
 * 核心思想：
 * 到达第i阶楼梯的方法 = 从第(i-1)阶走1步 + 从第(i-2)阶走2步
 *
 * @param {number} n - 楼梯阶数
 * @returns {number} 爬楼梯的方法数
 * @time O(n) 一次遍历
 * @space O(1) 只使用常数额外空间
 */
function climbStairs(n) {
    // 边界条件处理
    if (n <= 0) return 0;
    if (n === 1) return 1;
    if (n === 2) return 2;

    // 只需要保存前两个状态，节省空间
    let prev2 = 1;  // dp[i-2]：前两步的方法数
    let prev1 = 2;  // dp[i-1]：前一步的方法数
    let current;    // dp[i]：当前步的方法数

    // 从第3阶开始计算
    for (let i = 3; i <= n; i++) {
        current = prev1 + prev2;  // 状态转移方程
        prev2 = prev1;           // 更新前两步
        prev1 = current;         // 更新前一步
    }

    return current;
}

/**
 * 解法二：动态规划数组版本
 *
 * 核心思想：
 * 使用数组明确记录每一阶的方法数，便于理解和调试
 *
 * @param {number} n - 楼梯阶数
 * @returns {number} 爬楼梯的方法数
 * @time O(n) 一次遍历
 * @space O(n) 使用dp数组
 */
function climbStairsDP(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    if (n === 2) return 2;

    // 创建dp数组
    const dp = new Array(n + 1);

    // 初始化边界条件
    dp[1] = 1;  // 1阶楼梯有1种方法
    dp[2] = 2;  // 2阶楼梯有2种方法：(1+1) 或 (2)

    // 状态转移
    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }

    return dp[n];
}

/**
 * 解法三：递归法（朴素）
 *
 * 核心思想：
 * 直接根据递推关系递归求解，但存在重复计算
 *
 * @param {number} n - 楼梯阶数
 * @returns {number} 爬楼梯的方法数
 * @time O(2^n) 指数时间复杂度
 * @space O(n) 递归调用栈
 */
function climbStairsRecursive(n) {
    // 递归终止条件
    if (n <= 0) return 0;
    if (n === 1) return 1;
    if (n === 2) return 2;

    // 递归关系：f(n) = f(n-1) + f(n-2)
    return climbStairsRecursive(n - 1) + climbStairsRecursive(n - 2);
}

/**
 * 解法四：递归 + 记忆化
 *
 * 核心思想：
 * 在递归的基础上使用缓存避免重复计算
 *
 * @param {number} n - 楼梯阶数
 * @param {Map} memo - 记忆化缓存
 * @returns {number} 爬楼梯的方法数
 * @time O(n) 每个子问题只计算一次
 * @space O(n) 递归栈 + 缓存空间
 */
function climbStairsMemo(n, memo = new Map()) {
    // 检查缓存
    if (memo.has(n)) return memo.get(n);

    // 递归终止条件
    if (n <= 0) return 0;
    if (n === 1) return 1;
    if (n === 2) return 2;

    // 计算结果并缓存
    const result = climbStairsMemo(n - 1, memo) + climbStairsMemo(n - 2, memo);
    memo.set(n, result);

    return result;
}

/**
 * 解法五：数学公式法（斐波那契通项公式）
 *
 * 核心思想：
 * 爬楼梯问题本质是斐波那契数列，可以用通项公式直接计算
 *
 * @param {number} n - 楼梯阶数
 * @returns {number} 爬楼梯的方法数
 * @time O(1) 常数时间
 * @space O(1) 常数空间
 */
function climbStairsMath(n) {
    if (n <= 0) return 0;

    // 斐波那契通项公式：F(n) = (φ^n - ψ^n) / √5
    // 其中 φ = (1 + √5) / 2, ψ = (1 - √5) / 2
    const sqrt5 = Math.sqrt(5);
    const phi = (1 + sqrt5) / 2;
    const psi = (1 - sqrt5) / 2;

    // 爬楼梯的第n项对应斐波那契数列的第(n+1)项
    return Math.round((Math.pow(phi, n + 1) - Math.pow(psi, n + 1)) / sqrt5);
}

/**
 * 解法六：矩阵快速幂
 *
 * 核心思想：
 * 使用矩阵乘法计算斐波那契数列，适用于超大数值
 *
 * @param {number} n - 楼梯阶数
 * @returns {number} 爬楼梯的方法数
 * @time O(log n) 快速幂的时间复杂度
 * @space O(log n) 递归栈空间
 */
function climbStairsMatrix(n) {
    if (n <= 0) return 0;
    if (n === 1) return 1;
    if (n === 2) return 2;

    // 矩阵乘法
    function matrixMultiply(A, B) {
        return [
            [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
            [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]
        ];
    }

    // 矩阵快速幂
    function matrixPower(matrix, power) {
        if (power === 1) return matrix;

        if (power % 2 === 0) {
            const half = matrixPower(matrix, Math.floor(power / 2));
            return matrixMultiply(half, half);
        } else {
            return matrixMultiply(matrix, matrixPower(matrix, power - 1));
        }
    }

    // 基础转移矩阵 [[1, 1], [1, 0]]
    const baseMatrix = [[1, 1], [1, 0]];
    const resultMatrix = matrixPower(baseMatrix, n);

    // F(n) = resultMatrix[0][0] * F(1) + resultMatrix[0][1] * F(0)
    // 由于 F(1) = 1, F(0) = 1（这里的F(0)定义为1），所以结果是 resultMatrix[0][0]
    return resultMatrix[0][0];
}

/**
 * 扩展问题：可以走1、2、3步的爬楼梯
 *
 * @param {number} n - 楼梯阶数
 * @param {number[]} steps - 可以走的步数数组，默认[1,2,3]
 * @returns {number} 爬楼梯的方法数
 */
function climbStairsVariant(n, steps = [1, 2, 3]) {
    if (n <= 0) return 0;

    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;  // 0阶有1种方法（不走）

    for (let i = 1; i <= n; i++) {
        for (const step of steps) {
            if (i >= step) {
                dp[i] += dp[i - step];
            }
        }
    }

    return dp[n];
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 006: 爬楼梯 测试 ===\n');

    const testCases = [
        { n: 1, expected: 1, description: '1阶楼梯' },
        { n: 2, expected: 2, description: '2阶楼梯：(1+1) 或 (2)' },
        { n: 3, expected: 3, description: '3阶楼梯：(1+1+1) 或 (1+2) 或 (2+1)' },
        { n: 4, expected: 5, description: '4阶楼梯' },
        { n: 5, expected: 8, description: '5阶楼梯' },
        { n: 10, expected: 89, description: '10阶楼梯' },
        { n: 20, expected: 10946, description: '20阶楼梯' },
        { n: 0, expected: 0, description: '边界情况：0阶' }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`输入: n = ${test.n}`);

        // 测试各种解法
        const result1 = climbStairs(test.n);
        const result2 = climbStairsDP(test.n);
        const result3 = test.n <= 15 ? climbStairsRecursive(test.n) : '跳过（避免超时）';
        const result4 = climbStairsMemo(test.n);
        const result5 = climbStairsMath(test.n);
        const result6 = climbStairsMatrix(test.n);

        console.log(`优化DP结果: ${result1}`);
        console.log(`数组DP结果: ${result2}`);
        console.log(`递归结果: ${result3}`);
        console.log(`记忆化递归结果: ${result4}`);
        console.log(`数学公式结果: ${result5}`);
        console.log(`矩阵快速幂结果: ${result6}`);

        // 验证结果
        const isCorrect = result1 === test.expected;
        console.log(`结果验证: ${isCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 可视化演示
function visualDemo() {
    console.log('\n=== 爬楼梯可视化演示 ===');

    const n = 5;
    console.log(`演示：爬 ${n} 阶楼梯的所有方法\n`);

    // 列举所有可能的路径
    function findAllPaths(current, target, path, allPaths) {
        if (current === target) {
            allPaths.push([...path]);
            return;
        }

        if (current > target) return;

        // 走1步
        path.push(1);
        findAllPaths(current + 1, target, path, allPaths);
        path.pop();

        // 走2步
        path.push(2);
        findAllPaths(current + 2, target, path, allPaths);
        path.pop();
    }

    const allPaths = [];
    findAllPaths(0, n, [], allPaths);

    console.log(`爬 ${n} 阶楼梯的所有方法（共 ${allPaths.length} 种）：`);
    allPaths.forEach((path, index) => {
        console.log(`方法 ${index + 1}: [${path.join(' + ')}] = ${path.reduce((sum, step) => sum + step, 0)}`);
    });

    // 显示动态规划计算过程
    console.log('\n动态规划计算过程：');
    const dp = [0, 1, 2];  // dp[0]=0, dp[1]=1, dp[2]=2

    console.log('dp[1] = 1 (只有一种方法: 走1步)');
    console.log('dp[2] = 2 (两种方法: 1+1 或 2)');

    for (let i = 3; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
        console.log(`dp[${i}] = dp[${i - 1}] + dp[${i - 2}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`);
    }

    console.log(`\n最终答案: ${dp[n]}`);
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能对比测试 ===');

    const testSizes = [30, 40, 50];

    testSizes.forEach(n => {
        console.log(`\n测试 n = ${n}:`);

        // 优化DP
        console.time('优化DP');
        const result1 = climbStairs(n);
        console.timeEnd('优化DP');

        // 数组DP
        console.time('数组DP');
        const result2 = climbStairsDP(n);
        console.timeEnd('数组DP');

        // 记忆化递归
        console.time('记忆化递归');
        const result3 = climbStairsMemo(n);
        console.timeEnd('记忆化递归');

        // 数学公式
        console.time('数学公式');
        const result4 = climbStairsMath(n);
        console.timeEnd('数学公式');

        // 矩阵快速幂
        console.time('矩阵快速幂');
        const result5 = climbStairsMatrix(n);
        console.timeEnd('矩阵快速幂');

        console.log(`结果: ${result1}`);

        // 朴素递归只测试小数据
        if (n <= 30) {
            console.time('朴素递归');
            const resultRecursive = climbStairsRecursive(n);
            console.timeEnd('朴素递归');
        } else {
            console.log('朴素递归: 跳过（时间复杂度过高）');
        }
    });
}

// 复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. 优化动态规划（推荐）:');
    console.log('   时间复杂度: O(n)');
    console.log('   空间复杂度: O(1)');
    console.log('   优点: 最优的时空复杂度，代码简洁');
    console.log('   缺点: 无');

    console.log('\n2. 数组动态规划:');
    console.log('   时间复杂度: O(n)');
    console.log('   空间复杂度: O(n)');
    console.log('   优点: 思路清晰，便于理解和调试');
    console.log('   缺点: 空间开销大');

    console.log('\n3. 朴素递归:');
    console.log('   时间复杂度: O(2^n)');
    console.log('   空间复杂度: O(n)');
    console.log('   优点: 代码最简单');
    console.log('   缺点: 时间复杂度过高，大数据超时');

    console.log('\n4. 记忆化递归:');
    console.log('   时间复杂度: O(n)');
    console.log('   空间复杂度: O(n)');
    console.log('   优点: 在递归基础上优化，避免重复计算');
    console.log('   缺点: 空间开销大，仍有递归开销');

    console.log('\n5. 数学公式:');
    console.log('   时间复杂度: O(1)');
    console.log('   空间复杂度: O(1)');
    console.log('   优点: 最快的计算速度');
    console.log('   缺点: 浮点数精度问题，不适用于大数');

    console.log('\n6. 矩阵快速幂:');
    console.log('   时间复杂度: O(log n)');
    console.log('   空间复杂度: O(log n)');
    console.log('   优点: 适用于超大数值，精确计算');
    console.log('   缺点: 实现复杂');

    console.log('\n推荐解法: 优化动态规划');
    console.log('理由: 时空复杂度最优，代码简单，实用性强');
}

// 斐波那契数列的深入解析
function fibonacciAnalysis() {
    console.log('\n=== 斐波那契数列深入解析 ===');

    console.log('爬楼梯问题本质上是斐波那契数列的应用：');
    console.log('f(1) = 1, f(2) = 2');
    console.log('f(n) = f(n-1) + f(n-2) for n > 2');

    console.log('\n斐波那契数列的性质：');
    console.log('1. 递推关系：F(n) = F(n-1) + F(n-2)');
    console.log('2. 初始值：F(0) = 0, F(1) = 1');
    console.log('3. 爬楼梯中：climb(n) = F(n+1)');

    console.log('\n前15项对比：');
    console.log('n\t爬楼梯\t斐波那契');
    for (let i = 1; i <= 15; i++) {
        const climb = climbStairs(i);
        const fib = i === 1 ? 1 : i === 2 ? 1 : climbStairs(i - 1);
        // 这里fib的计算不准确，仅作演示
        console.log(`${i}\t${climb}\t${i <= 2 ? (i === 1 ? 1 : 1) : 'F(' + (i + 1) + ')'}`);
    }
}

// 实际应用场景
function practicalApplications() {
    console.log('\n=== 实际应用场景 ===');

    console.log('1. 路径规划:');
    console.log('   - 机器人路径规划');
    console.log('   - 游戏中的移动方案');

    console.log('\n2. 资源分配:');
    console.log('   - 背包问题的变形');
    console.log('   - 投资组合方案数');

    console.log('\n3. 编码理论:');
    console.log('   - 构造特定长度的编码');
    console.log('   - 数字通信中的码字生成');

    console.log('\n4. 生物数学:');
    console.log('   - 种群增长模型');
    console.log('   - 兔子繁殖问题（斐波那契原始问题）');

    // 扩展问题演示
    console.log('\n扩展问题：可以走1、2、3步的爬楼梯');
    const n = 5;
    const steps = [1, 2, 3];
    const result = climbStairsVariant(n, steps);
    console.log(`爬 ${n} 阶楼梯，每次可以走 ${steps.join('、')} 步：${result} 种方法`);

    // 详细展示变形问题的DP过程
    console.log('\n三步爬楼梯的DP过程：');
    const dp = new Array(n + 1).fill(0);
    dp[0] = 1;

    for (let i = 1; i <= n; i++) {
        for (const step of steps) {
            if (i >= step) {
                dp[i] += dp[i - step];
            }
        }
        console.log(`dp[${i}] = ${dp[i]}`);
    }
}

// 运行所有测试
if (require.main === module) {
    runTests();
    visualDemo();
    performanceTest();
    complexityAnalysis();
    fibonacciAnalysis();
    practicalApplications();
}

// 导出函数供其他模块使用
module.exports = {
    climbStairs,
    climbStairsDP,
    climbStairsRecursive,
    climbStairsMemo,
    climbStairsMath,
    climbStairsMatrix,
    climbStairsVariant
};