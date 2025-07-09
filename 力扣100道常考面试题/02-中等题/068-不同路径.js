/**
 * LeetCode 62. 不同路径
 *
 * 问题描述：
 * 一个机器人位于一个 m x n 网格的左上角 （起始点在下图中标记为 "Start" ）。
 * 机器人每次只能向下或者向右移动一步。机器人试图达到网格的右下角（在下图中标记为 "Finish" ）。
 * 问总共有多少条不同的路径？
 *
 * 核心思想：
 * 动态规划是解决计数问题的经典方法。
 *
 * 关键洞察：
 * 1. 到达任意位置(i,j)的路径数等于从上方来的路径数加上从左方来的路径数
 * 2. 状态转移方程：dp[i][j] = dp[i-1][j] + dp[i][j-1]
 * 3. 边界条件：第一行和第一列的路径数都是1（只有一条路径）
 * 4. 这是一个组合数学问题：从m+n-2步中选择m-1步向下（或n-1步向右）
 * 5. 可以使用数学公式直接计算：C(m+n-2, m-1)
 *
 * 算法策略：
 * - 二维DP：构建dp表记录到达每个位置的路径数
 * - 一维DP：空间优化，使用滚动数组
 * - 数学公式：组合数学直接计算
 * - 递归+备忘录：自顶向下的思路
 *
 * 示例：
 * 输入：m = 3, n = 7
 * 输出：28
 */

/**
 * 方法一：二维动态规划（标准解法）
 *
 * 核心思想：
 * 使用二维dp数组记录到达每个位置的路径数。
 * dp[i][j] 表示从起点(0,0)到位置(i,j)的不同路径数。
 *
 * 状态转移方程：
 * - dp[i][j] = dp[i-1][j] + dp[i][j-1]
 *
 * 边界条件：
 * - dp[0][j] = 1 （第一行只有一条路径：一直向右）
 * - dp[i][0] = 1 （第一列只有一条路径：一直向下）
 *
 * @param {number} m - 网格行数
 * @param {number} n - 网格列数
 * @return {number} 不同路径的数量
 * @time O(m*n) - 需要填充所有dp位置
 * @space O(m*n) - dp数组的空间
 */
function uniquePaths(m, n) {
    if (m <= 0 || n <= 0) {
        return 0;
    }

    // 创建dp数组
    const dp = Array(m).fill(null).map(() => Array(n).fill(0));

    // 初始化第一行（只能向右走）
    for (let j = 0; j < n; j++) {
        dp[0][j] = 1;
    }

    // 初始化第一列（只能向下走）
    for (let i = 0; i < m; i++) {
        dp[i][0] = 1;
    }

    // 填充dp表
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            // 当前位置的路径数 = 上方路径数 + 左方路径数
            dp[i][j] = dp[i - 1][j] + dp[i][j - 1];
        }
    }

    return dp[m - 1][n - 1];
}

/**
 * 方法二：一维数组优化（推荐）
 *
 * 核心思想：
 * 观察到dp[i][j]只依赖于dp[i-1][j]和dp[i][j-1]，
 * 可以使用一维数组进行滚动更新，节省空间复杂度。
 * dp[j]表示当前行中到达位置j的路径数。
 *
 * 滚动更新：
 * - dp[j] = dp[j] + dp[j-1]
 * - dp[j]（更新前）代表上一行的值，dp[j-1]代表当前行左边的值
 *
 * @param {number} m - 网格行数
 * @param {number} n - 网格列数
 * @return {number} 不同路径的数量
 * @time O(m*n) - 遍历时间
 * @space O(n) - 只需要一维数组
 */
function uniquePathsOptimized(m, n) {
    if (m <= 0 || n <= 0) {
        return 0;
    }

    // 使用一维数组，初始化为1（第一行都是1）
    const dp = Array(n).fill(1);

    // 从第二行开始逐行更新
    for (let i = 1; i < m; i++) {
        // 第一列保持为1，所以从第二列开始
        for (let j = 1; j < n; j++) {
            // dp[j] 是上一行的值，dp[j-1] 是当前行左边的值
            dp[j] = dp[j] + dp[j - 1];
        }
    }

    return dp[n - 1];
}

/**
 * 方法三：数学公式（组合数学）
 *
 * 核心思想：
 * 从起点到终点总共需要走 (m-1) + (n-1) = m+n-2 步，
 * 其中必须向下走 m-1 步，向右走 n-1 步。
 * 这是一个组合问题：从 m+n-2 个位置中选择 m-1 个位置向下走。
 *
 * 数学公式：C(m+n-2, m-1) = (m+n-2)! / ((m-1)! * (n-1)!)
 *
 * 为了避免阶乘计算溢出，使用累乘的方式：
 * C(m+n-2, m-1) = (m+n-2) * (m+n-3) * ... * n / (1 * 2 * ... * (m-1))
 *
 * @param {number} m - 网格行数
 * @param {number} n - 网格列数
 * @return {number} 不同路径的数量
 * @time O(min(m,n)) - 计算组合数的时间
 * @space O(1) - 常数空间
 */
function uniquePathsMath(m, n) {
    if (m <= 0 || n <= 0) {
        return 0;
    }

    // 选择较小的数作为分子，避免不必要的计算
    const smaller = Math.min(m - 1, n - 1);
    const larger = Math.max(m - 1, n - 1);

    let result = 1;

    // 计算 C(m+n-2, smaller)
    for (let i = 0; i < smaller; i++) {
        // 先乘后除，避免精度损失
        result = result * (larger + 1 + i) / (i + 1);
    }

    return Math.round(result);
}

/**
 * 方法四：记忆化搜索（递归+备忘录）
 *
 * 核心思想：
 * 使用递归的思路：到达(i,j)的路径数等于
 * 到达(i-1,j)的路径数 + 到达(i,j-1)的路径数
 * 为了避免重复计算，使用备忘录记录已计算的结果。
 *
 * @param {number} m - 网格行数
 * @param {number} n - 网格列数
 * @return {number} 不同路径的数量
 * @time O(m*n) - 每个位置计算一次
 * @space O(m*n) - 备忘录空间 + 递归栈空间
 */
function uniquePathsMemo(m, n) {
    if (m <= 0 || n <= 0) {
        return 0;
    }

    const memo = Array(m).fill(null).map(() => Array(n).fill(-1));

    /**
     * 递归函数：计算到达(i,j)的路径数
     * @param {number} i - 行坐标
     * @param {number} j - 列坐标
     * @return {number} 路径数
     */
    function dfs(i, j) {
        // 边界条件
        if (i === 0 || j === 0) {
            return 1;
        }

        // 检查备忘录
        if (memo[i][j] !== -1) {
            return memo[i][j];
        }

        // 递归计算：从上方和左方来的路径数之和
        memo[i][j] = dfs(i - 1, j) + dfs(i, j - 1);

        return memo[i][j];
    }

    return dfs(m - 1, n - 1);
}

/**
 * 可视化函数：展示动态规划过程
 * @param {number} m - 网格行数
 * @param {number} n - 网格列数
 */
function visualizeDP(m, n) {
    console.log(`\n=== 不同路径 DP过程可视化 (${m}x${n}) ===`);

    const dp = Array(m).fill(null).map(() => Array(n).fill(0));

    // 初始化第一行
    console.log('步骤1: 初始化第一行（只能向右走）');
    for (let j = 0; j < n; j++) {
        dp[0][j] = 1;
    }
    printDPGrid(dp, 0, n - 1);

    // 初始化第一列
    console.log('步骤2: 初始化第一列（只能向下走）');
    for (let i = 0; i < m; i++) {
        dp[i][0] = 1;
    }
    printDPGrid(dp, m - 1, 0);

    // 填充其余位置
    console.log('步骤3: 填充其余位置');
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            const fromUp = dp[i - 1][j];
            const fromLeft = dp[i][j - 1];
            dp[i][j] = fromUp + fromLeft;

            console.log(`dp[${i}][${j}] = dp[${i-1}][${j}] + dp[${i}][${j-1}] = ${fromUp} + ${fromLeft} = ${dp[i][j]}`);
            printDPGrid(dp, i, j);
        }
    }

    console.log(`\n总路径数: ${dp[m - 1][n - 1]}`);

    // 展示几条具体路径
    console.log('\n=== 路径示例 ===');
    showSamplePaths(m, n, Math.min(5, dp[m - 1][n - 1])); // 最多显示5条路径
}

/**
 * 展示几条具体路径
 * @param {number} m - 网格行数
 * @param {number} n - 网格列数
 * @param {number} count - 要显示的路径数量
 */
function showSamplePaths(m, n, count) {
    const paths = [];

    /**
     * 生成所有路径
     */
    function generatePaths(i, j, path) {
        if (i === m - 1 && j === n - 1) {
            paths.push([...path, `(${i},${j})`]);
            return;
        }

        // 向下
        if (i < m - 1) {
            generatePaths(i + 1, j, [...path, `(${i},${j})`]);
        }

        // 向右
        if (j < n - 1) {
            generatePaths(i, j + 1, [...path, `(${i},${j})`]);
        }
    }

    generatePaths(0, 0, []);

    // 显示前几条路径
    for (let i = 0; i < Math.min(count, paths.length); i++) {
        console.log(`路径${i + 1}: ${paths[i].join(' -> ')}`);
    }

    if (paths.length > count) {
        console.log(`... 还有 ${paths.length - count} 条路径`);
    }
}

/**
 * 辅助函数：打印DP网格（高亮当前位置）
 */
function printDPGrid(dp, currentI, currentJ) {
    for (let i = 0; i < dp.length; i++) {
        const row = [];
        for (let j = 0; j < dp[0].length; j++) {
            const val = dp[i][j] || 0;
            if (i === currentI && j === currentJ) {
                row.push(`[${val.toString().padStart(2)}]`);
            } else {
                row.push(` ${val.toString().padStart(2)} `);
            }
        }
        console.log(row.join(''));
    }
    console.log();
}

/**
 * 辅助函数：计算阶乘（用于验证组合数公式）
 */
function factorial(n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

/**
 * 辅助函数：计算组合数（用于验证）
 */
function combination(n, k) {
    if (k > n || k < 0) return 0;
    if (k === 0 || k === n) return 1;

    // 使用递推公式避免大数阶乘
    let result = 1;
    for (let i = 0; i < k; i++) {
        result = result * (n - i) / (i + 1);
    }
    return Math.round(result);
}

// 测试用例
console.log('=== LeetCode 62. 不同路径 测试 ===\n');

// 测试用例1：标准情况
console.log('测试用例1: 3x7 网格');
const m1 = 3, n1 = 7;
console.log(`网格大小: ${m1} x ${n1}`);
console.log('预期输出: 28');
console.log('方法一(标准DP):', uniquePaths(m1, n1));
console.log('方法二(空间优化):', uniquePathsOptimized(m1, n1));
console.log('方法三(数学公式):', uniquePathsMath(m1, n1));
console.log('方法四(记忆化):', uniquePathsMemo(m1, n1));
console.log('数学验证:', combination(m1 + n1 - 2, m1 - 1));
console.log();

// 测试用例2：正方形网格
console.log('测试用例2: 3x3 网格');
const m2 = 3, n2 = 3;
console.log(`网格大小: ${m2} x ${n2}`);
console.log('预期输出: 6');
console.log('方法一(标准DP):', uniquePaths(m2, n2));
console.log('方法二(空间优化):', uniquePathsOptimized(m2, n2));
console.log('方法三(数学公式):', uniquePathsMath(m2, n2));
console.log('方法四(记忆化):', uniquePathsMemo(m2, n2));
console.log();

// 测试用例3：最小网格
console.log('测试用例3: 1x1 网格');
const m3 = 1, n3 = 1;
console.log(`网格大小: ${m3} x ${n3}`);
console.log('预期输出: 1');
console.log('实际输出:', uniquePaths(m3, n3));
console.log();

// 测试用例4：单行网格
console.log('测试用例4: 1x10 网格');
const m4 = 1, n4 = 10;
console.log(`网格大小: ${m4} x ${n4}`);
console.log('预期输出: 1');
console.log('实际输出:', uniquePaths(m4, n4));
console.log();

// 测试用例5：单列网格
console.log('测试用例5: 10x1 网格');
const m5 = 10, n5 = 1;
console.log(`网格大小: ${m5} x ${n5}`);
console.log('预期输出: 1');
console.log('实际输出:', uniquePaths(m5, n5));
console.log();

// 测试用例6：较大网格
console.log('测试用例6: 7x3 网格');
const m6 = 7, n6 = 3;
console.log(`网格大小: ${m6} x ${n6}`);
console.log('预期输出: 28');
console.log('实际输出:', uniquePaths(m6, n6));
console.log();

// 方法比较测试
console.log('=== 方法比较测试 ===');
const testM = 4, testN = 4;
console.log(`测试网格: ${testM} x ${testN}`);
console.log('标准DP方法:', uniquePaths(testM, testN));
console.log('空间优化方法:', uniquePathsOptimized(testM, testN));
console.log('数学公式方法:', uniquePathsMath(testM, testN));
console.log('记忆化搜索方法:', uniquePathsMemo(testM, testN));

// 验证结果一致性
const results = [
    uniquePaths(testM, testN),
    uniquePathsOptimized(testM, testN),
    uniquePathsMath(testM, testN),
    uniquePathsMemo(testM, testN)
];
console.log('结果一致性:', results.every(r => r === results[0]));

// 性能测试
console.log('\n=== 性能测试 ===');
function performanceTest() {
    const testCases = [
        { size: '5x5', m: 5, n: 5 },
        { size: '10x10', m: 10, n: 10 },
        { size: '15x15', m: 15, n: 15 },
        { size: '20x20', m: 20, n: 20 },
    ];

    console.log('网格大小\t标准DP(ms)\t空间优化(ms)\t数学公式(ms)\t记忆化(ms)');
    console.log(''.padEnd(70, '-'));

    for (const { size, m, n } of testCases) {
        // 标准DP
        const start1 = performance.now();
        const result1 = uniquePaths(m, n);
        const time1 = (performance.now() - start1).toFixed(3);

        // 空间优化
        const start2 = performance.now();
        const result2 = uniquePathsOptimized(m, n);
        const time2 = (performance.now() - start2).toFixed(3);

        // 数学公式
        const start3 = performance.now();
        const result3 = uniquePathsMath(m, n);
        const time3 = (performance.now() - start3).toFixed(3);

        // 记忆化搜索
        const start4 = performance.now();
        const result4 = uniquePathsMemo(m, n);
        const time4 = (performance.now() - start4).toFixed(3);

        console.log(`${size}\t\t${time1}\t\t${time2}\t\t${time3}\t\t${time4}`);

        // 验证结果一致性
        const allEqual = result1 === result2 && result2 === result3 && result3 === result4;
        console.log(`结果一致性: ${allEqual} (结果: ${result1})`);
    }
}

performanceTest();

// 数学原理验证
console.log('\n=== 数学原理验证 ===');
console.log('验证组合数公式 C(m+n-2, m-1):');
for (let m = 2; m <= 5; m++) {
    for (let n = 2; n <= 5; n++) {
        const dpResult = uniquePaths(m, n);
        const mathResult = combination(m + n - 2, m - 1);
        console.log(`${m}x${n}: DP=${dpResult}, 数学=${mathResult}, 一致=${dpResult === mathResult}`);
    }
}

// 可视化演示
console.log('\n=== 动态规划过程可视化 ===');
visualizeDP(3, 4);

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        uniquePaths,
        uniquePathsOptimized,
        uniquePathsMath,
        uniquePathsMemo,
        visualizeDP,
        showSamplePaths,
        printDPGrid,
        combination
    };
}