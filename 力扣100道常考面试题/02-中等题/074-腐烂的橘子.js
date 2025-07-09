/**
 * LeetCode 994. 腐烂的橘子
 *
 * 问题描述：
 * 在给定的 m x n 网格 grid 中，每个单元格可以有以下三个值之一：
 * 值 0 代表空单元格；
 * 值 1 代表新鲜橘子；
 * 值 2 代表腐烂的橘子。
 * 每分钟，腐烂的橘子周围 4 个方向上相邻的新鲜橘子都会腐烂。
 * 返回直到单元格中没有新鲜橘子为止所必须经过的最小分钟数。如果不可能，返回 -1 。
 *
 * 核心思想：
 * 多源BFS：将所有腐烂的橘子作为起点，同时进行广度优先搜索
 * 记录每轮腐烂的时间，直到没有新鲜橘子可以腐烂
 *
 * 关键洞察：
 * 1. 这是典型的多源BFS问题，所有腐烂橘子同时开始传播
 * 2. 使用队列按层级处理，每一层代表一分钟的传播
 * 3. 需要判断是否有孤立的新鲜橘子无法被腐烂
 * 4. 时间就是BFS的层数
 *
 * 示例：
 * 输入：grid = [[2,1,1],[1,1,0],[0,1,1]]
 * 输出：4
 */

/**
 * 方法一：多源广度优先搜索（BFS）- 推荐解法
 *
 * 核心思想：
 * 1. 将所有初始腐烂的橘子加入队列作为多个起点
 * 2. 使用BFS逐层传播腐烂，每层代表一分钟
 * 3. 记录新鲜橘子总数，每腐烂一个就减一
 * 4. 如果最后还有新鲜橘子，返回-1；否则返回传播时间
 *
 * 算法步骤：
 * 1. 遍历网格，统计新鲜橘子数量，将腐烂橘子加入队列
 * 2. 进行多源BFS，每轮处理队列中所有橘子（代表一分钟）
 * 3. 对每个腐烂橘子，检查四个方向的新鲜橘子并加入队列
 * 4. 重复直到队列为空，检查是否还有新鲜橘子
 *
 * @param {number[][]} grid - 输入网格
 * @return {number} - 最小分钟数，如果不可能返回-1
 * @time O(m×n) - 每个单元格最多访问一次
 * @space O(m×n) - 队列空间，最坏情况下所有橘子都腐烂
 */
function orangesRotting(grid) {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
        return 0;
    }

    const m = grid.length;
    const n = grid[0].length;
    const queue = [];
    let freshCount = 0;
    let minutes = 0;

    // 方向数组：上、下、左、右
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // 第一步：初始化队列和统计新鲜橘子
    for (let row = 0; row < m; row++) {
        for (let col = 0; col < n; col++) {
            if (grid[row][col] === 2) {
                // 腐烂橘子加入队列
                queue.push([row, col]);
            } else if (grid[row][col] === 1) {
                // 统计新鲜橘子数量
                freshCount++;
            }
        }
    }

    // 如果没有新鲜橘子，直接返回0
    if (freshCount === 0) {
        return 0;
    }

    // 第二步：多源BFS传播腐烂
    while (queue.length > 0 && freshCount > 0) {
        // 处理当前层（当前分钟）的所有腐烂橘子
        const currentLevelSize = queue.length;

        for (let i = 0; i < currentLevelSize; i++) {
            const [row, col] = queue.shift();

            // 检查四个方向
            for (const [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;

                // 边界检查和新鲜橘子检查
                if (newRow >= 0 && newRow < m &&
                    newCol >= 0 && newCol < n &&
                    grid[newRow][newCol] === 1) {

                    // 新鲜橘子变腐烂
                    grid[newRow][newCol] = 2;
                    freshCount--;
                    queue.push([newRow, newCol]);
                }
            }
        }

        // 一分钟过去了
        minutes++;
    }

    // 检查是否还有新鲜橘子
    return freshCount === 0 ? minutes : -1;
}

/**
 * 方法二：模拟法 + 标记
 *
 * 核心思想：
 * 不使用队列，而是在每轮中遍历整个网格
 * 使用额外的标记来区分新腐烂的和原本腐烂的橘子
 *
 * @param {number[][]} grid - 输入网格
 * @return {number} - 最小分钟数，如果不可能返回-1
 * @time O(m×n×k) - k是传播轮数，最坏情况k=m+n
 * @space O(1) - 原地修改，不使用额外空间
 */
function orangesRottingSimulation(grid) {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
        return 0;
    }

    const m = grid.length;
    const n = grid[0].length;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let minutes = 0;

    // 统计初始新鲜橘子数量
    let freshCount = 0;
    for (let row = 0; row < m; row++) {
        for (let col = 0; col < n; col++) {
            if (grid[row][col] === 1) {
                freshCount++;
            }
        }
    }

    if (freshCount === 0) {
        return 0;
    }

    // 模拟传播过程
    while (true) {
        let newlyRotted = false;
        const toRot = []; // 记录这一轮要腐烂的橘子位置

        // 找到这一轮要腐烂的橘子
        for (let row = 0; row < m; row++) {
            for (let col = 0; col < n; col++) {
                if (grid[row][col] === 2) {
                    // 检查四个方向的新鲜橘子
                    for (const [dr, dc] of directions) {
                        const newRow = row + dr;
                        const newCol = col + dc;

                        if (newRow >= 0 && newRow < m &&
                            newCol >= 0 && newCol < n &&
                            grid[newRow][newCol] === 1) {

                            toRot.push([newRow, newCol]);
                        }
                    }
                }
            }
        }

        // 如果没有新的橘子要腐烂，跳出循环
        if (toRot.length === 0) {
            break;
        }

        // 将新鲜橘子变腐烂
        for (const [row, col] of toRot) {
            grid[row][col] = 2;
            freshCount--;
            newlyRotted = true;
        }

        if (newlyRotted) {
            minutes++;
        }
    }

    return freshCount === 0 ? minutes : -1;
}

/**
 * 方法三：DFS递归模拟
 *
 * 核心思想：
 * 使用递归DFS模拟每一分钟的传播过程
 * 每次递归代表一分钟，直到没有新的橘子腐烂
 *
 * @param {number[][]} grid - 输入网格
 * @return {number} - 最小分钟数，如果不可能返回-1
 * @time O(m×n×k) - k是传播轮数
 * @space O(k) - 递归栈深度
 */
function orangesRottingDFS(grid) {
    if (!grid || grid.length === 0 || grid[0].length === 0) {
        return 0;
    }

    const m = grid.length;
    const n = grid[0].length;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // 深拷贝网格用于模拟
    const copyGrid = grid.map(row => [...row]);

    /**
     * DFS模拟一分钟的传播
     * @param {number} minute - 当前分钟数
     * @return {number} - 总传播时间
     */
    function dfs(minute) {
        const toRot = [];

        // 找到这一分钟要腐烂的橘子
        for (let row = 0; row < m; row++) {
            for (let col = 0; col < n; col++) {
                if (copyGrid[row][col] === 2) {
                    for (const [dr, dc] of directions) {
                        const newRow = row + dr;
                        const newCol = col + dc;

                        if (newRow >= 0 && newRow < m &&
                            newCol >= 0 && newCol < n &&
                            copyGrid[newRow][newCol] === 1) {

                            toRot.push([newRow, newCol]);
                        }
                    }
                }
            }
        }

        // 如果没有新的橘子要腐烂，检查是否还有新鲜橘子
        if (toRot.length === 0) {
            for (let row = 0; row < m; row++) {
                for (let col = 0; col < n; col++) {
                    if (copyGrid[row][col] === 1) {
                        return -1; // 还有新鲜橘子，但无法腐烂
                    }
                }
            }
            return minute; // 所有橘子都腐烂了
        }

        // 腐烂新鲜橘子
        for (const [row, col] of toRot) {
            copyGrid[row][col] = 2;
        }

        // 递归到下一分钟
        return dfs(minute + 1);
    }

    return dfs(0);
}

// ==================== 测试用例 ====================

/**
 * 测试函数
 */
function runTests() {
    console.log("=== LeetCode 994. 腐烂的橘子 测试 ===\n");

    // 辅助函数：深拷贝二维数组
    function deepCopy(grid) {
        return grid.map(row => [...row]);
    }

    // 辅助函数：打印网格
    function printGrid(grid, title) {
        console.log(`${title}:`);
        grid.forEach(row => console.log(row.join(' ')));
        console.log();
    }

    // 测试用例1：标准情况
    console.log("测试用例1：标准情况");
    const grid1 = [[2,1,1],[1,1,0],[0,1,1]];
    const grid1Copy1 = deepCopy(grid1);
    const grid1Copy2 = deepCopy(grid1);
    const grid1Copy3 = deepCopy(grid1);

    printGrid(grid1, "原始网格");

    const result1_1 = orangesRotting(grid1Copy1);
    const result1_2 = orangesRottingSimulation(grid1Copy2);
    const result1_3 = orangesRottingDFS(grid1Copy3);

    console.log(`BFS结果: ${result1_1}分钟`);
    console.log(`模拟法结果: ${result1_2}分钟`);
    console.log(`DFS结果: ${result1_3}分钟\n`);

    // 测试用例2：无法全部腐烂
    console.log("测试用例2：无法全部腐烂");
    const grid2 = [[2,1,1],[0,1,1],[1,0,1]];
    printGrid(grid2, "原始网格");

    const result2 = orangesRotting(deepCopy(grid2));
    console.log(`结果: ${result2}（-1表示无法全部腐烂）\n`);

    // 测试用例3：没有新鲜橘子
    console.log("测试用例3：没有新鲜橘子");
    const grid3 = [[0,2]];
    printGrid(grid3, "原始网格");

    const result3 = orangesRotting(deepCopy(grid3));
    console.log(`结果: ${result3}分钟\n`);

    // 测试用例4：单个新鲜橘子
    console.log("测试用例4：单个新鲜橘子无法腐烂");
    const grid4 = [[1]];
    printGrid(grid4, "原始网格");

    const result4 = orangesRotting(deepCopy(grid4));
    console.log(`结果: ${result4}（-1表示无法腐烂）\n`);

    // 测试用例5：复杂情况
    console.log("测试用例5：复杂情况");
    const grid5 = [
        [2,1,1,1,1],
        [1,1,1,1,1],
        [0,1,1,1,1],
        [0,1,1,2,1]
    ];
    printGrid(grid5, "原始网格");

    const result5 = orangesRotting(deepCopy(grid5));
    console.log(`结果: ${result5}分钟\n`);

    // 测试用例6：全部是新鲜橘子
    console.log("测试用例6：全部是新鲜橘子");
    const grid6 = [[1,1,1],[1,1,1],[1,1,1]];
    printGrid(grid6, "原始网格");

    const result6 = orangesRotting(deepCopy(grid6));
    console.log(`结果: ${result6}（-1表示无法腐烂）\n`);

    // 测试用例7：空网格
    console.log("测试用例7：空网格和特殊情况");
    const grid7 = [[0,0,0],[0,0,0],[0,0,0]];
    printGrid(grid7, "全空网格");

    const result7 = orangesRotting(deepCopy(grid7));
    console.log(`结果: ${result7}分钟\n`);
}

// ==================== 性能测试 ====================

/**
 * 性能测试
 */
function performanceTest() {
    console.log("=== 性能测试 ===\n");

    // 生成测试网格
    function generateGrid(m, n, rottenRatio = 0.1, freshRatio = 0.3) {
        const grid = [];
        for (let i = 0; i < m; i++) {
            const row = [];
            for (let j = 0; j < n; j++) {
                const rand = Math.random();
                if (rand < rottenRatio) {
                    row.push(2); // 腐烂橘子
                } else if (rand < rottenRatio + freshRatio) {
                    row.push(1); // 新鲜橘子
                } else {
                    row.push(0); // 空位
                }
            }
            grid.push(row);
        }
        return grid;
    }

    // 深拷贝函数
    function deepCopy(grid) {
        return grid.map(row => [...row]);
    }

    // 性能测试函数
    function testPerformance(method, grid, methodName) {
        const start = performance.now();
        const result = method(grid);
        const end = performance.now();
        return {time: end - start, result};
    }

    const sizes = [
        {m: 50, n: 50},
        {m: 100, n: 100},
        {m: 200, n: 200}
    ];

    sizes.forEach(({m, n}) => {
        console.log(`\n测试规模: ${m}×${n}`);
        const originalGrid = generateGrid(m, n);

        // BFS测试
        const grid1 = deepCopy(originalGrid);
        const perf1 = testPerformance(orangesRotting, grid1, "BFS");

        // 模拟法测试
        const grid2 = deepCopy(originalGrid);
        const perf2 = testPerformance(orangesRottingSimulation, grid2, "模拟法");

        // DFS测试（仅小规模）
        if (m <= 100) {
            const grid3 = deepCopy(originalGrid);
            const perf3 = testPerformance(orangesRottingDFS, grid3, "DFS");

            console.log(`BFS耗时: ${perf1.time.toFixed(2)}ms, 结果: ${perf1.result}`);
            console.log(`模拟法耗时: ${perf2.time.toFixed(2)}ms, 结果: ${perf2.result}`);
            console.log(`DFS耗时: ${perf3.time.toFixed(2)}ms, 结果: ${perf3.result}`);
        } else {
            console.log(`BFS耗时: ${perf1.time.toFixed(2)}ms, 结果: ${perf1.result}`);
            console.log(`模拟法耗时: ${perf2.time.toFixed(2)}ms, 结果: ${perf2.result}`);
            console.log("DFS跳过（规模过大）");
        }
    });
}

// ==================== 算法复杂度分析 ====================

/**
 * 算法复杂度总结
 */
function complexityAnalysis() {
    console.log("=== 算法复杂度分析 ===\n");

    console.log("方法对比：");
    console.log("┌─────────────┬─────────────┬─────────────┬────────────────┐");
    console.log("│    方法     │  时间复杂度  │  空间复杂度  │      特点      │");
    console.log("├─────────────┼─────────────┼─────────────┼────────────────┤");
    console.log("│ BFS (推荐)  │   O(m×n)    │   O(m×n)    │ 最优解，层级清晰 │");
    console.log("│ 模拟法      │ O(m×n×k)    │    O(1)     │ 空间优化       │");
    console.log("│ DFS递归     │ O(m×n×k)    │    O(k)     │ 递归理解       │");
    console.log("└─────────────┴─────────────┴─────────────┴────────────────┘");

    console.log("\n注：k是传播轮数，最坏情况k = m + n - 2");

    console.log("\n算法选择建议：");
    console.log("• 推荐BFS：时间复杂度最优，逻辑清晰");
    console.log("• 空间受限：使用模拟法，空间复杂度O(1)");
    console.log("• 学习理解：DFS递归有助于理解传播过程");

    console.log("\n核心设计思想：");
    console.log("• 多源BFS：所有腐烂橘子同时开始传播");
    console.log("• 层级处理：每层代表一分钟的传播");
    console.log("• 状态追踪：记录新鲜橘子数量判断完成");
    console.log("• 边界检查：确保传播不越界");
}

// ==================== 可视化演示 ====================

/**
 * 可视化BFS传播过程
 */
function visualizeBFS() {
    console.log("=== BFS传播过程可视化 ===\n");

    const grid = [
        [2, 1, 1],
        [1, 1, 0],
        [0, 1, 1]
    ];

    console.log("初始状态（2=腐烂，1=新鲜，0=空）：");
    grid.forEach(row => console.log(row.join(' ')));
    console.log();

    const m = grid.length;
    const n = grid[0].length;
    const queue = [];
    let freshCount = 0;
    let minute = 0;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // 初始化
    for (let row = 0; row < m; row++) {
        for (let col = 0; col < n; col++) {
            if (grid[row][col] === 2) {
                queue.push([row, col]);
            } else if (grid[row][col] === 1) {
                freshCount++;
            }
        }
    }

    console.log(`初始新鲜橘子数量: ${freshCount}`);
    console.log(`初始腐烂橘子位置: ${JSON.stringify(queue)}\n`);

    // 模拟传播过程
    while (queue.length > 0 && freshCount > 0) {
        const currentLevelSize = queue.length;
        console.log(`第${minute + 1}分钟开始，队列中有${currentLevelSize}个腐烂橘子`);

        let rottenThisMinute = [];

        for (let i = 0; i < currentLevelSize; i++) {
            const [row, col] = queue.shift();
            console.log(`  处理腐烂橘子位置(${row},${col})`);

            for (const [dr, dc] of directions) {
                const newRow = row + dr;
                const newCol = col + dc;

                if (newRow >= 0 && newRow < m &&
                    newCol >= 0 && newCol < n &&
                    grid[newRow][newCol] === 1) {

                    grid[newRow][newCol] = 2;
                    freshCount--;
                    queue.push([newRow, newCol]);
                    rottenThisMinute.push([newRow, newCol]);
                    console.log(`    新鲜橘子(${newRow},${newCol})变腐烂`);
                }
            }
        }

        minute++;
        console.log(`第${minute}分钟结束，新腐烂的橘子: ${JSON.stringify(rottenThisMinute)}`);
        console.log("当前网格状态：");
        grid.forEach(row => console.log(row.join(' ')));
        console.log(`剩余新鲜橘子: ${freshCount}\n`);
    }

    console.log(`传播完成，总用时: ${minute}分钟`);
    console.log(`最终结果: ${freshCount === 0 ? minute : -1}`);
}

// 运行测试
if (require.main === module) {
    runTests();
    performanceTest();
    complexityAnalysis();
    visualizeBFS();
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        orangesRotting,
        orangesRottingSimulation,
        orangesRottingDFS
    };
}