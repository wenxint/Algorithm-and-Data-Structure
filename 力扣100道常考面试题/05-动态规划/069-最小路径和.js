/**
 * LeetCode 64. 最小路径和
 *
 * 问题描述：
 * 给定一个包含非负整数的 m x n 网格 grid ，请找出一条从左上角到右下角的路径，
 * 使得路径上的数字总和为最小。
 * 说明：每次只能向下或者向右移动一步。
 *
 * 核心思想：
 * 动态规划是解决路径问题的经典方法。
 *
 * 关键洞察：
 * 1. 到达任意位置(i,j)的最小路径和只依赖于其上方和左方的位置
 * 2. 状态转移方程：dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
 * 3. 边界条件：第一行只能从左边来，第一列只能从上面来
 * 4. 最优子结构：问题的最优解包含子问题的最优解
 * 5. 可以使用原地修改或滚动数组优化空间复杂度
 *
 * 算法策略：
 * - 二维DP：构建dp表记录到达每个位置的最小路径和
 * - 状态转移：当前位置的最小路径和 = 当前值 + min(上方, 左方)的最小路径和
 * - 边界处理：第一行和第一列的特殊处理
 * - 空间优化：原地修改或使用一维数组
 *
 * 示例：
 * 输入：grid = [[1,3,1],[1,5,1],[4,2,1]]
 * 输出：7
 */

/**
 * 方法一：二维动态规划（标准解法）
 *
 * 核心思想：
 * 使用二维dp数组记录到达每个位置的最小路径和。
 * dp[i][j] 表示从左上角(0,0)到位置(i,j)的最小路径和。
 *
 * 状态转移方程：
 * - dp[i][j] = grid[i][j] + min(dp[i-1][j], dp[i][j-1])
 *
 * 边界条件：
 * - dp[0][0] = grid[0][0] （起点）
 * - dp[0][j] = dp[0][j-1] + grid[0][j] （第一行只能从左边来）
 * - dp[i][0] = dp[i-1][0] + grid[i][0] （第一列只能从上面来）
 *
 * @param {number[][]} grid - 二维网格
 * @return {number} 最小路径和
 * @time O(m*n) - 需要遍历所有位置
 * @space O(m*n) - dp数组的空间
 */
function minPathSum(grid) {
    if (!grid || !grid.length || !grid[0].length) {
        return 0;
    }

    const m = grid.length;
    const n = grid[0].length;

    // 创建dp数组
    const dp = Array(m).fill(null).map(() => Array(n).fill(0));

    // 初始化起点
    dp[0][0] = grid[0][0];

    // 初始化第一行（只能从左边来）
    for (let j = 1; j < n; j++) {
        dp[0][j] = dp[0][j - 1] + grid[0][j];
    }

    // 初始化第一列（只能从上面来）
    for (let i = 1; i < m; i++) {
        dp[i][0] = dp[i - 1][0] + grid[i][0];
    }

    // 填充dp表
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            // 从上方或左方选择路径和较小的
            dp[i][j] = grid[i][j] + Math.min(dp[i - 1][j], dp[i][j - 1]);
        }
    }

    return dp[m - 1][n - 1];
}

/**
 * 方法二：原地修改优化（推荐）
 *
 * 核心思想：
 * 直接在原始grid上进行修改，避免使用额外的dp数组。
 * 将grid[i][j]更新为到达该位置的最小路径和。
 * 这种方法节省了O(m*n)的空间复杂度。
 *
 * 注意：这会修改原始输入，如果需要保持原始数据不变，
 * 应该先复制一份grid或使用方法一。
 *
 * @param {number[][]} grid - 二维网格（会被修改）
 * @return {number} 最小路径和
 * @time O(m*n) - 遍历时间
 * @space O(1) - 原地修改，不需要额外空间
 */
function minPathSumOptimized(grid) {
    if (!grid || !grid.length || !grid[0].length) {
        return 0;
    }

    const m = grid.length;
    const n = grid[0].length;

    // 处理第一行
    for (let j = 1; j < n; j++) {
        grid[0][j] += grid[0][j - 1];
    }

    // 处理第一列
    for (let i = 1; i < m; i++) {
        grid[i][0] += grid[i - 1][0];
    }

    // 处理其余位置
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            grid[i][j] += Math.min(grid[i - 1][j], grid[i][j - 1]);
        }
    }

    return grid[m - 1][n - 1];
}

/**
 * 方法三：一维数组优化（空间最优）
 *
 * 核心思想：
 * 观察到dp[i][j]只依赖于dp[i-1][j]和dp[i][j-1]，
 * 可以使用一维数组进行滚动更新。
 * dp[j]表示当前行中到达位置j的最小路径和。
 *
 * 滚动更新：
 * - dp[j] = grid[i][j] + min(dp[j], dp[j-1])
 * - dp[j]代表上一行的值（更新前），dp[j-1]代表当前行左边的值
 *
 * @param {number[][]} grid - 二维网格
 * @return {number} 最小路径和
 * @time O(m*n) - 遍历时间
 * @space O(n) - 只需要一维数组
 */
function minPathSumRolling(grid) {
    if (!grid || !grid.length || !grid[0].length) {
        return 0;
    }

    const m = grid.length;
    const n = grid[0].length;

    // 使用一维数组，初始化为第一行
    const dp = Array(n).fill(0);
    dp[0] = grid[0][0];

    // 初始化第一行
    for (let j = 1; j < n; j++) {
        dp[j] = dp[j - 1] + grid[0][j];
    }

    // 逐行更新
    for (let i = 1; i < m; i++) {
        // 更新当前行的第一列
        dp[0] += grid[i][0];

        // 更新当前行的其他列
        for (let j = 1; j < n; j++) {
            // dp[j] 代表上一行的值，dp[j-1] 代表当前行左边的值
            dp[j] = grid[i][j] + Math.min(dp[j], dp[j - 1]);
        }
    }

    return dp[n - 1];
}

/**
 * 方法四：记忆化搜索（递归+备忘录）
 *
 * 核心思想：
 * 使用递归的思路：到达(i,j)的最小路径和等于
 * grid[i][j] + min(到达(i-1,j)的最小路径和, 到达(i,j-1)的最小路径和)
 * 为了避免重复计算，使用备忘录记录已计算的结果。
 *
 * @param {number[][]} grid - 二维网格
 * @return {number} 最小路径和
 * @time O(m*n) - 每个位置计算一次
 * @space O(m*n) - 备忘录空间 + 递归栈空间
 */
function minPathSumMemo(grid) {
    if (!grid || !grid.length || !grid[0].length) {
        return 0;
    }

    const m = grid.length;
    const n = grid[0].length;
    const memo = Array(m).fill(null).map(() => Array(n).fill(-1));

    /**
     * 递归函数：计算到达(i,j)的最小路径和
     * @param {number} i - 行坐标
     * @param {number} j - 列坐标
     * @return {number} 最小路径和
     */
    function dfs(i, j) {
        // 越界检查
        if (i < 0 || j < 0) {
            return Infinity;
        }

        // 起点
        if (i === 0 && j === 0) {
            return grid[0][0];
        }

        // 检查备忘录
        if (memo[i][j] !== -1) {
            return memo[i][j];
        }

        // 递归计算：从上方或左方来的最小路径和
        memo[i][j] = grid[i][j] + Math.min(dfs(i - 1, j), dfs(i, j - 1));

        return memo[i][j];
    }

    return dfs(m - 1, n - 1);
}

/**
 * 可视化函数：展示动态规划过程
 * @param {number[][]} grid - 二维网格
 */
function visualizeDP(grid) {
    console.log('\n=== 最小路径和 DP过程可视化 ===');
    console.log('原始网格:');
    printGrid(grid);

    const m = grid.length;
    const n = grid[0].length;
    const dp = Array(m).fill(null).map(() => Array(n).fill(0));

    // 初始化起点
    dp[0][0] = grid[0][0];
    console.log(`\n步骤1: 初始化起点 dp[0][0] = ${dp[0][0]}`);
    printDPGrid(dp, 0, 0);

    // 初始化第一行
    console.log('\n步骤2: 初始化第一行（只能从左边来）');
    for (let j = 1; j < n; j++) {
        dp[0][j] = dp[0][j - 1] + grid[0][j];
        console.log(`dp[0][${j}] = dp[0][${j-1}] + grid[0][${j}] = ${dp[0][j - 1]} + ${grid[0][j]} = ${dp[0][j]}`);
    }
    printDPGrid(dp, 0, n - 1);

    // 初始化第一列
    console.log('\n步骤3: 初始化第一列（只能从上面来）');
    for (let i = 1; i < m; i++) {
        dp[i][0] = dp[i - 1][0] + grid[i][0];
        console.log(`dp[${i}][0] = dp[${i-1}][0] + grid[${i}][0] = ${dp[i - 1][0]} + ${grid[i][0]} = ${dp[i][0]}`);
    }
    printDPGrid(dp, m - 1, 0);

    // 填充其余位置
    console.log('\n步骤4: 填充其余位置');
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            const fromUp = dp[i - 1][j];
            const fromLeft = dp[i][j - 1];
            dp[i][j] = grid[i][j] + Math.min(fromUp, fromLeft);

            console.log(`dp[${i}][${j}] = grid[${i}][${j}] + min(dp[${i-1}][${j}], dp[${i}][${j-1}])`);
            console.log(`        = ${grid[i][j]} + min(${fromUp}, ${fromLeft}) = ${grid[i][j]} + ${Math.min(fromUp, fromLeft)} = ${dp[i][j]}`);
            printDPGrid(dp, i, j);
        }
    }

    console.log(`\n最小路径和: ${dp[m - 1][n - 1]}`);

    // 回溯找路径
    console.log('\n=== 回溯最优路径 ===');
    const path = [];
    let i = m - 1, j = n - 1;

    while (i > 0 || j > 0) {
        path.unshift([i, j]);

        if (i === 0) {
            j--; // 只能向左
        } else if (j === 0) {
            i--; // 只能向上
        } else {
            // 选择路径和更小的方向
            if (dp[i - 1][j] < dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
    }
    path.unshift([0, 0]); // 添加起点

    console.log('最优路径:', path.map(([r, c]) => `(${r},${c}):${grid[r][c]}`).join(' -> '));
    console.log('路径和:', path.reduce((sum, [r, c]) => sum + grid[r][c], 0));
}

/**
 * 辅助函数：打印网格
 */
function printGrid(grid) {
    for (const row of grid) {
        console.log(row.map(val => val.toString().padStart(3)).join(' '));
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

// 测试用例
console.log('=== LeetCode 64. 最小路径和 测试 ===\n');

// 测试用例1：标准情况
console.log('测试用例1: 标准情况');
const grid1 = [[1,3,1],[1,5,1],[4,2,1]];
console.log('网格:');
printGrid(grid1);
console.log('预期输出: 7');
console.log('方法一(标准DP):', minPathSum(grid1));
console.log('方法二(原地修改):', minPathSumOptimized(JSON.parse(JSON.stringify(grid1))));
console.log('方法三(滚动数组):', minPathSumRolling(grid1));
console.log('方法四(记忆化):', minPathSumMemo(grid1));
console.log();

// 测试用例2：单行
console.log('测试用例2: 单行');
const grid2 = [[1,2,3]];
console.log('网格:');
printGrid(grid2);
console.log('预期输出: 6');
console.log('实际输出:', minPathSum(grid2));
console.log();

// 测试用例3：单列
console.log('测试用例3: 单列');
const grid3 = [[1],[2],[3]];
console.log('网格:');
printGrid(grid3);
console.log('预期输出: 6');
console.log('实际输出:', minPathSum(grid3));
console.log();

// 测试用例4：单个元素
console.log('测试用例4: 单个元素');
const grid4 = [[5]];
console.log('网格:');
printGrid(grid4);
console.log('预期输出: 5');
console.log('实际输出:', minPathSum(grid4));
console.log();

// 测试用例5：复杂情况
console.log('测试用例5: 复杂情况');
const grid5 = [[1,2,5],[3,2,1],[4,1,1]];
console.log('网格:');
printGrid(grid5);
console.log('预期输出: 6');
console.log('实际输出:', minPathSum(grid5));
console.log();

// 方法比较测试
console.log('=== 方法比较测试 ===');
const testGrid = [[1,3,1],[1,5,1],[4,2,1]];
console.log('测试网格:');
printGrid(testGrid);
console.log('标准DP方法:', minPathSum(testGrid));
console.log('原地修改方法:', minPathSumOptimized(JSON.parse(JSON.stringify(testGrid))));
console.log('滚动数组方法:', minPathSumRolling(testGrid));
console.log('记忆化搜索方法:', minPathSumMemo(testGrid));

// 验证结果一致性
const results = [
    minPathSum(testGrid),
    minPathSumOptimized(JSON.parse(JSON.stringify(testGrid))),
    minPathSumRolling(testGrid),
    minPathSumMemo(testGrid)
];
console.log('结果一致性:', results.every(r => r === results[0]));

// 性能测试
console.log('\n=== 性能测试 ===');
function performanceTest() {
    // 生成测试网格
    function generateGrid(rows, cols) {
        const grid = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                row.push(Math.floor(Math.random() * 10) + 1);
            }
            grid.push(row);
        }
        return grid;
    }

    const testCases = [
        { size: '10x10', rows: 10, cols: 10 },
        { size: '50x50', rows: 50, cols: 50 },
        { size: '100x100', rows: 100, cols: 100 },
    ];

    console.log('网格大小\t标准DP(ms)\t原地修改(ms)\t滚动数组(ms)\t记忆化(ms)');
    console.log(''.padEnd(70, '-'));

    for (const { size, rows, cols } of testCases) {
        const grid = generateGrid(rows, cols);

        // 标准DP
        const start1 = performance.now();
        const result1 = minPathSum(JSON.parse(JSON.stringify(grid)));
        const time1 = (performance.now() - start1).toFixed(3);

        // 原地修改
        const start2 = performance.now();
        const result2 = minPathSumOptimized(JSON.parse(JSON.stringify(grid)));
        const time2 = (performance.now() - start2).toFixed(3);

        // 滚动数组
        const start3 = performance.now();
        const result3 = minPathSumRolling(JSON.parse(JSON.stringify(grid)));
        const time3 = (performance.now() - start3).toFixed(3);

        // 记忆化搜索
        const start4 = performance.now();
        const result4 = minPathSumMemo(JSON.parse(JSON.stringify(grid)));
        const time4 = (performance.now() - start4).toFixed(3);

        console.log(`${size}\t\t${time1}\t\t${time2}\t\t${time3}\t\t${time4}`);

        // 验证结果一致性
        console.log(`结果一致性: ${result1 === result2 && result2 === result3 && result3 === result4}`);
    }
}

performanceTest();

// 可视化演示
console.log('\n=== 动态规划过程可视化 ===');
const smallGrid = [[1,3,1],[1,5,1],[4,2,1]];
visualizeDP(smallGrid);

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        minPathSum,
        minPathSumOptimized,
        minPathSumRolling,
        minPathSumMemo,
        visualizeDP,
        printGrid,
        printDPGrid
    };
}