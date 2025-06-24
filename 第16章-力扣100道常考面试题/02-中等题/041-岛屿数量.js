/**
 * LeetCode 200. 岛屿数量 (Number of Islands)
 *
 * 问题描述：
 * 给你一个由 '1'（陆地）和 '0'（水）组成的的二维网格，请你计算网格中岛屿的数量。
 * 岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。
 * 此外，你可以假设该网格的四条边均被水包围。
 *
 * 核心思想：
 * 这是一个典型的连通分量问题，可以用DFS、BFS或并查集来解决
 * 每次找到一个'1'，就从该点开始遍历整个连通的岛屿，将其标记为已访问
 * 最终统计进行了多少次这样的遍历，就是岛屿的数量
 *
 * 示例：
 * 输入：grid = [
 *   ["1","1","1","1","0"],
 *   ["1","1","0","1","0"],
 *   ["1","1","0","0","0"],
 *   ["0","0","0","0","0"]
 * ]
 * 输出：1
 */

/**
 * 方法一：深度优先搜索 (DFS)
 *
 * 核心思想：
 * 遍历整个网格，当遇到'1'时，启动DFS将整个岛屿标记为'0'（沉没岛屿）
 * 每次启动DFS代表找到了一个新的岛屿，计数器加1
 *
 * @param {character[][]} grid - 二维网格
 * @returns {number} 岛屿数量
 * @time O(m*n) 每个格子最多被访问一次
 * @space O(m*n) 最坏情况下递归栈深度为m*n
 */
function numIslandsDFS(grid) {
    console.log("=== 岛屿数量（深度优先搜索） ===");

    if (!grid || grid.length === 0 || grid[0].length === 0) {
        console.log("输入为空，返回 0");
        return 0;
    }

    const rows = grid.length;
    const cols = grid[0].length;
    let islandCount = 0;

    console.log("初始网格:");
    printGrid(grid);

    /**
     * 深度优先搜索函数
     * @param {number} row - 当前行
     * @param {number} col - 当前列
     */
    function dfs(row, col) {
        // 边界检查
        if (row < 0 || row >= rows || col < 0 || col >= cols) {
            return;
        }

        // 如果是水域或已访问过的陆地，返回
        if (grid[row][col] === '0') {
            return;
        }

        console.log(`  访问位置 (${row}, ${col}): ${grid[row][col]} -> 0`);

        // 标记当前位置为已访问（沉没）
        grid[row][col] = '0';

        // 向四个方向继续搜索
        console.log(`    从 (${row}, ${col}) 向四个方向搜索`);
        dfs(row - 1, col); // 上
        dfs(row + 1, col); // 下
        dfs(row, col - 1); // 左
        dfs(row, col + 1); // 右
    }

    console.log("\n开始DFS遍历:");

    // 遍历整个网格
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '1') {
                islandCount++;
                console.log(`\n发现新岛屿 #${islandCount} 起点: (${i}, ${j})`);
                console.log("开始沉没岛屿:");
                dfs(i, j);

                console.log("当前网格状态:");
                printGrid(grid);
            }
        }
    }

    console.log(`\n总共发现 ${islandCount} 个岛屿`);
    return islandCount;
}

/**
 * 方法二：广度优先搜索 (BFS)
 *
 * 核心思想：
 * 使用队列进行广度优先搜索，逐层遍历岛屿的所有陆地
 * 避免了递归栈可能的溢出问题
 *
 * @param {character[][]} grid - 二维网格
 * @returns {number} 岛屿数量
 * @time O(m*n) 每个格子最多被访问一次
 * @space O(min(m,n)) 队列中最多存储min(m,n)个元素
 */
function numIslandsBFS(grid) {
    console.log("\n=== 岛屿数量（广度优先搜索） ===");

    if (!grid || grid.length === 0 || grid[0].length === 0) {
        console.log("输入为空，返回 0");
        return 0;
    }

    const rows = grid.length;
    const cols = grid[0].length;
    let islandCount = 0;

    // 四个方向：上、下、左、右
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    console.log("初始网格:");
    printGrid(grid);

    console.log("\n开始BFS遍历:");

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '1') {
                islandCount++;
                console.log(`\n发现新岛屿 #${islandCount} 起点: (${i}, ${j})`);

                // BFS队列
                const queue = [[i, j]];
                grid[i][j] = '0'; // 立即标记为已访问

                console.log("BFS遍历过程:");
                console.log(`  队列初始化: [(${i}, ${j})]`);

                while (queue.length > 0) {
                    const [row, col] = queue.shift();
                    console.log(`  处理位置: (${row}, ${col})`);

                    // 检查四个方向的邻居
                    for (const [dr, dc] of directions) {
                        const newRow = row + dr;
                        const newCol = col + dc;

                        // 边界检查和陆地检查
                        if (newRow >= 0 && newRow < rows &&
                            newCol >= 0 && newCol < cols &&
                            grid[newRow][newCol] === '1') {

                            console.log(`    发现陆地邻居: (${newRow}, ${newCol})`);
                            queue.push([newRow, newCol]);
                            grid[newRow][newCol] = '0'; // 标记为已访问
                            console.log(`    队列状态: [${queue.map(([r, c]) => `(${r},${c})`).join(', ')}]`);
                        }
                    }
                }

                console.log("  BFS完成，岛屿已完全沉没");
                console.log("当前网格状态:");
                printGrid(grid);
            }
        }
    }

    console.log(`\n总共发现 ${islandCount} 个岛屿`);
    return islandCount;
}

/**
 * 方法三：并查集 (Union-Find)
 *
 * 核心思想：
 * 将每个陆地格子看作一个节点，相邻的陆地格子进行合并
 * 最终统计有多少个连通分量
 *
 * @param {character[][]} grid - 二维网格
 * @returns {number} 岛屿数量
 * @time O(m*n*α(m*n)) α是阿克曼函数的反函数，几乎为常数
 * @space O(m*n) 存储parent和rank数组
 */
function numIslandsUnionFind(grid) {
    console.log("\n=== 岛屿数量（并查集） ===");

    if (!grid || grid.length === 0 || grid[0].length === 0) {
        console.log("输入为空，返回 0");
        return 0;
    }

    const rows = grid.length;
    const cols = grid[0].length;

    console.log("初始网格:");
    printGrid(grid);

    /**
     * 并查集类
     */
    class UnionFind {
        constructor(n) {
            this.parent = new Array(n);
            this.rank = new Array(n).fill(0);
            this.count = 0;

            // 初始化：每个元素的父节点是自己
            for (let i = 0; i < n; i++) {
                this.parent[i] = i;
            }
        }

        /**
         * 查找根节点（路径压缩）
         */
        find(x) {
            if (this.parent[x] !== x) {
                this.parent[x] = this.find(this.parent[x]); // 路径压缩
            }
            return this.parent[x];
        }

        /**
         * 合并两个集合（按秩合并）
         */
        union(x, y) {
            const rootX = this.find(x);
            const rootY = this.find(y);

            if (rootX !== rootY) {
                console.log(`    合并: ${x} 和 ${y} (根节点: ${rootX} 和 ${rootY})`);

                // 按秩合并
                if (this.rank[rootX] < this.rank[rootY]) {
                    this.parent[rootX] = rootY;
                } else if (this.rank[rootX] > this.rank[rootY]) {
                    this.parent[rootY] = rootX;
                } else {
                    this.parent[rootY] = rootX;
                    this.rank[rootX]++;
                }
                this.count--;
            }
        }

        /**
         * 添加一个新元素
         */
        addElement() {
            this.count++;
        }

        /**
         * 获取连通分量数量
         */
        getCount() {
            return this.count;
        }
    }

    const uf = new UnionFind(rows * cols);

    console.log("\n初始化并查集，处理陆地格子:");

    // 将二维坐标转换为一维索引
    const getIndex = (row, col) => row * cols + col;

    // 四个方向：上、下、左、右
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // 第一次遍历：处理所有陆地，添加到并查集中
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '1') {
                console.log(`  添加陆地: (${i}, ${j}) -> 索引 ${getIndex(i, j)}`);
                uf.addElement();
            }
        }
    }

    console.log(`初始陆地数量: ${uf.getCount()}`);

    console.log("\n合并相邻陆地:");

    // 第二次遍历：合并相邻的陆地
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '1') {
                const currentIndex = getIndex(i, j);
                console.log(`\n  处理陆地 (${i}, ${j})，索引 ${currentIndex}:`);

                // 检查四个方向的邻居
                for (const [dr, dc] of directions) {
                    const newRow = i + dr;
                    const newCol = j + dc;

                    if (newRow >= 0 && newRow < rows &&
                        newCol >= 0 && newCol < cols &&
                        grid[newRow][newCol] === '1') {

                        const neighborIndex = getIndex(newRow, newCol);
                        console.log(`    相邻陆地: (${newRow}, ${newCol})，索引 ${neighborIndex}`);
                        uf.union(currentIndex, neighborIndex);
                    }
                }
            }
        }
    }

    const islandCount = uf.getCount();
    console.log(`\n最终岛屿数量: ${islandCount}`);

    return islandCount;
}

/**
 * 方法四：DFS with 访问标记数组
 *
 * 核心思想：
 * 使用额外的visited数组来标记已访问的位置，不修改原始网格
 * 这样可以保持原始数据不变
 *
 * @param {character[][]} grid - 二维网格
 * @returns {number} 岛屿数量
 * @time O(m*n) 每个格子最多被访问一次
 * @space O(m*n) visited数组 + 递归栈空间
 */
function numIslandsVisited(grid) {
    console.log("\n=== 岛屿数量（DFS + 访问数组） ===");

    if (!grid || grid.length === 0 || grid[0].length === 0) {
        console.log("输入为空，返回 0");
        return 0;
    }

    const rows = grid.length;
    const cols = grid[0].length;
    let islandCount = 0;

    // 创建访问标记数组
    const visited = Array(rows).fill().map(() => Array(cols).fill(false));

    console.log("初始网格:");
    printGrid(grid);

    /**
     * 深度优先搜索函数
     * @param {number} row - 当前行
     * @param {number} col - 当前列
     */
    function dfs(row, col) {
        // 边界检查
        if (row < 0 || row >= rows || col < 0 || col >= cols) {
            return;
        }

        // 如果是水域或已访问过，返回
        if (grid[row][col] === '0' || visited[row][col]) {
            return;
        }

        console.log(`  访问位置 (${row}, ${col}): ${grid[row][col]}`);

        // 标记为已访问
        visited[row][col] = true;

        // 向四个方向继续搜索
        dfs(row - 1, col); // 上
        dfs(row + 1, col); // 下
        dfs(row, col - 1); // 左
        dfs(row, col + 1); // 右
    }

    console.log("\n开始DFS遍历:");

    // 遍历整个网格
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '1' && !visited[i][j]) {
                islandCount++;
                console.log(`\n发现新岛屿 #${islandCount} 起点: (${i}, ${j})`);
                console.log("开始DFS遍历岛屿:");
                dfs(i, j);

                console.log("访问状态数组:");
                printVisited(visited);
            }
        }
    }

    console.log(`\n总共发现 ${islandCount} 个岛屿`);
    console.log("原始网格保持不变:");
    printGrid(grid);

    return islandCount;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 打印网格
 */
function printGrid(grid) {
    if (!grid || grid.length === 0) return;

    const rows = grid.length;
    const cols = grid[0].length;

    console.log("   " + Array.from({length: cols}, (_, i) => i.toString().padStart(2)).join(' '));
    for (let i = 0; i < rows; i++) {
        console.log(`${i.toString().padStart(2)}: ${grid[i].map(cell => cell.padStart(2)).join(' ')}`);
    }
}

/**
 * 打印访问状态数组
 */
function printVisited(visited) {
    if (!visited || visited.length === 0) return;

    const rows = visited.length;
    const cols = visited[0].length;

    console.log("   " + Array.from({length: cols}, (_, i) => i.toString().padStart(2)).join(' '));
    for (let i = 0; i < rows; i++) {
        console.log(`${i.toString().padStart(2)}: ${visited[i].map(cell => (cell ? 'T' : 'F').padStart(2)).join(' ')}`);
    }
}

/**
 * 深拷贝网格
 */
function cloneGrid(grid) {
    return grid.map(row => [...row]);
}

/**
 * 验证岛屿数量计算
 */
function validateIslandCount(originalGrid, expected) {
    console.log("\n=== 验证岛屿数量 ===");
    console.log(`期望结果: ${expected}`);

    const methods = [
        { name: "DFS", func: numIslandsDFS },
        { name: "BFS", func: numIslandsBFS },
        { name: "并查集", func: numIslandsUnionFind },
        { name: "DFS+访问数组", func: numIslandsVisited }
    ];

    const results = [];

    for (const method of methods) {
        // 深拷贝网格（因为某些方法会修改原网格）
        const gridCopy = cloneGrid(originalGrid);

        console.log(`\n--- ${method.name} 方法 ---`);
        const result = method.func(gridCopy);
        results.push(result);

        const isCorrect = result === expected;
        console.log(`${method.name}结果: ${result}, 正确: ${isCorrect ? '✅' : '❌'}`);
    }

    // 检查所有方法结果是否一致
    const allSame = results.every(result => result === results[0]);
    console.log(`\n所有方法结果一致: ${allSame ? '✅' : '❌'}`);

    return allSame;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    // 生成测试网格
    function generateGrid(rows, cols, landRatio = 0.3) {
        const grid = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < cols; j++) {
                row.push(Math.random() < landRatio ? '1' : '0');
            }
            grid.push(row);
        }
        return grid;
    }

    const testCases = [
        { rows: 10, cols: 10, landRatio: 0.3 },
        { rows: 50, cols: 50, landRatio: 0.3 },
        { rows: 100, cols: 100, landRatio: 0.3 }
    ];

    const methods = [
        { name: "DFS", func: numIslandsDFS },
        { name: "BFS", func: numIslandsBFS },
        { name: "并查集", func: numIslandsUnionFind },
        { name: "DFS+访问数组", func: numIslandsVisited }
    ];

    for (const testCase of testCases) {
        console.log(`\n测试网格大小: ${testCase.rows} × ${testCase.cols}`);
        const originalGrid = generateGrid(testCase.rows, testCase.cols, testCase.landRatio);

        for (const method of methods) {
            const gridCopy = cloneGrid(originalGrid);

            const startTime = performance.now();
            const result = method.func(gridCopy);
            const endTime = performance.now();

            console.log(`${method.name}: 岛屿数=${result}, 耗时=${(endTime - startTime).toFixed(2)}ms`);
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
    console.log("岛屿数量算法测试");
    console.log("=".repeat(50));

    const testCases = [
        {
            name: "单个岛屿",
            grid: [
                ["1","1","1","1","0"],
                ["1","1","0","1","0"],
                ["1","1","0","0","0"],
                ["0","0","0","0","0"]
            ],
            expected: 1
        },
        {
            name: "多个岛屿",
            grid: [
                ["1","1","0","0","0"],
                ["1","1","0","0","0"],
                ["0","0","1","0","0"],
                ["0","0","0","1","1"]
            ],
            expected: 3
        },
        {
            name: "全是水",
            grid: [
                ["0","0","0","0"],
                ["0","0","0","0"],
                ["0","0","0","0"]
            ],
            expected: 0
        },
        {
            name: "全是陆地",
            grid: [
                ["1","1","1"],
                ["1","1","1"],
                ["1","1","1"]
            ],
            expected: 1
        },
        {
            name: "复杂情况",
            grid: [
                ["1","0","1","1","1"],
                ["1","0","1","0","1"],
                ["1","1","1","0","1"]
            ],
            expected: 1
        }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(40)}`);
        console.log(`测试用例 ${index + 1}: ${testCase.name}`);
        console.log(`${"=".repeat(40)}`);

        console.log("输入网格:");
        printGrid(testCase.grid);
        console.log(`期望结果: ${testCase.expected}`);

        validateIslandCount(testCase.grid, testCase.expected);
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
    console.log("岛屿数量算法演示");
    console.log("=".repeat(50));

    console.log("岛屿数量问题的核心思想:");
    console.log("1. 连通分量：每个岛屿是一个连通分量");
    console.log("2. 图遍历：DFS或BFS遍历连通的陆地");
    console.log("3. 标记访问：避免重复计算同一个岛屿");
    console.log("4. 计数统计：每次新的遍历代表一个新岛屿");

    const demoGrid = [
        ["1","1","0","0","0"],
        ["1","1","0","0","0"],
        ["0","0","1","0","0"],
        ["0","0","0","1","1"]
    ];

    console.log("\n演示网格:");
    printGrid(demoGrid);
    console.log("期望岛屿数量: 3");

    console.log("\n=== DFS方法演示 ===");
    const gridCopy1 = cloneGrid(demoGrid);
    numIslandsDFS(gridCopy1);

    console.log("\n=== BFS方法演示 ===");
    const gridCopy2 = cloneGrid(demoGrid);
    numIslandsBFS(gridCopy2);

    console.log("\n=== 并查集方法演示 ===");
    const gridCopy3 = cloneGrid(demoGrid);
    numIslandsUnionFind(gridCopy3);

    console.log("\n=== 复杂度对比 ===");
    console.log("方法          时间复杂度           空间复杂度        特点");
    console.log("DFS           O(m×n)              O(m×n)           递归，可能栈溢出");
    console.log("BFS           O(m×n)              O(min(m,n))      迭代，队列空间更小");
    console.log("并查集        O(m×n×α(m×n))       O(m×n)           支持动态连接查询");
    console.log("DFS+访问数组  O(m×n)              O(m×n)           保持原数据不变");

    console.log("\n=== 算法选择建议 ===");
    console.log("1. 静态问题：推荐DFS或BFS，简单直观");
    console.log("2. 动态更新：推荐并查集，支持实时查询");
    console.log("3. 内存受限：推荐BFS，空间复杂度更优");
    console.log("4. 保持原数据：推荐DFS+访问数组");
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
    console.log("1. 连通分量：图论中的基本概念");
    console.log("2. 图遍历：DFS和BFS的实际应用");
    console.log("3. 并查集：处理动态连接性问题的数据结构");
    console.log("4. 二维网格：转换为图的邻接关系");

    console.log("\n🔧 实现技巧:");
    console.log("1. 四方向遍历：上下左右四个方向的邻居");
    console.log("2. 边界检查：防止数组越界");
    console.log("3. 访问标记：避免重复访问同一位置");
    console.log("4. 坐标转换：二维坐标与一维索引的转换");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 边界处理：数组越界导致错误");
    console.log("2. 重复访问：没有正确标记已访问位置");
    console.log("3. 递归栈溢出：大网格使用DFS可能栈溢出");
    console.log("4. 修改原数据：某些方法会改变输入网格");

    console.log("\n🎨 变体问题:");
    console.log("1. 岛屿的最大面积");
    console.log("2. 岛屿的周长");
    console.log("3. 被围绕的区域");
    console.log("4. 太平洋大西洋水流问题");
    console.log("5. 统计封闭岛屿的数目");

    console.log("\n📊 复杂度分析:");
    console.log("时间复杂度: O(m×n) - 每个格子最多访问一次");
    console.log("空间复杂度:");
    console.log("  - DFS: O(m×n) 递归栈深度");
    console.log("  - BFS: O(min(m,n)) 队列大小");
    console.log("  - 并查集: O(m×n) parent和rank数组");

    console.log("\n💡 面试技巧:");
    console.log("1. 先分析问题：识别这是连通分量问题");
    console.log("2. 选择合适算法：根据题目要求选择DFS/BFS/并查集");
    console.log("3. 注意边界条件：空网格、单格子等特殊情况");
    console.log("4. 优化空间：考虑是否需要额外的访问数组");
    console.log("5. 扩展思考：讨论动态更新的情况");

    console.log("\n🔍 实际应用:");
    console.log("1. 图像处理：连通区域检测");
    console.log("2. 地图分析：地理区域识别");
    console.log("3. 网络连通性：节点连通性分析");
    console.log("4. 迷宫求解：路径连通性判断");
    console.log("5. 社交网络：好友关系分析");
    console.log("6. 生物信息学：基因序列分析");

    console.log("\n🎮 记忆技巧:");
    console.log("1. 岛屿类比：想象在地图上寻找岛屿");
    console.log("2. 洪水填充：DFS像洪水一样扩散");
    console.log("3. 层层扩展：BFS像波纹一样逐层扩展");
    console.log("4. 合并同类：并查集像合并相同的组");

    console.log("\n📝 扩展思考:");
    console.log("1. 为什么这是图论问题？");
    console.log("2. DFS和BFS在这里的优劣？");
    console.log("3. 并查集的优势在哪里？");
    console.log("4. 如何处理动态添加/删除陆地？");
    console.log("5. 三维空间中的连通分量如何处理？");

    console.log("\n🌟 优化策略:");
    console.log("1. 早期终止：如果只需要判断是否有岛屿");
    console.log("2. 并行处理：多线程并行处理不同区域");
    console.log("3. 增量更新：动态维护岛屿数量");
    console.log("4. 空间压缩：使用位运算压缩存储");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        numIslandsDFS,
        numIslandsBFS,
        numIslandsUnionFind,
        numIslandsVisited,
        validateIslandCount,
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