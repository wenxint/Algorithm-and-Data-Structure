/**
 * 第9章：并查集 - 练习题解答
 *
 * 本文件包含并查集章节的练习题完整解答，每道题目都包含：
 * 1. 核心思想分析
 * 2. 多种解法实现
 * 3. 详细的复杂度分析
 * 4. 完整的测试用例
 *
 * @author 算法学习教程
 * @date 2024
 */

// ===========================================
// 题目1：朋友圈数量
// ===========================================

/**
 * 朋友圈数量 - 并查集解法
 *
 * 核心思想：
 * 使用并查集维护学生之间的朋友关系，每个连通分量代表一个朋友圈。
 * 遍历邻接矩阵，将直接相识的学生进行合并操作，最后统计连通分量数量。
 *
 * 算法步骤：
 * 1. 初始化并查集，每个学生独立成一个集合
 * 2. 遍历邻接矩阵的上三角部分（利用对称性优化）
 * 3. 对于相识的学生对，执行合并操作
 * 4. 统计最终的连通分量数量
 *
 * @param {number[][]} isConnected 邻接矩阵
 * @returns {number} 朋友圈数量
 * @time O(n² * α(n)) n为学生数量，α为阿克曼函数的反函数
 * @space O(n) 并查集存储空间
 */
function findCircleNum(isConnected) {
    const n = isConnected.length;
    const uf = new UnionFind(n);

    // 遍历邻接矩阵上三角部分，利用对称性
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (isConnected[i][j] === 1) {
                uf.union(i, j);
            }
        }
    }

    return uf.getCount();
}

/**
 * 基础并查集实现
 */
class UnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.rank = new Array(n).fill(0);
        this.count = n; // 连通分量数量
    }

    /**
     * 查找根节点（带路径压缩）
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
            // 按秩合并：将较小的树挂到较大的树下
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
     * 获取连通分量数量
     */
    getCount() {
        return this.count;
    }
}

// ===========================================
// 题目2：岛屿数量II
// ===========================================

/**
 * 岛屿数量II - 动态连通性解法
 *
 * 核心思想：
 * 使用并查集维护陆地的动态连通性。每次添加陆地时：
 * 1. 岛屿数量先增加1
 * 2. 检查四个方向的邻居，如果是陆地则尝试合并
 * 3. 每次成功合并都会减少一个岛屿
 *
 * 关键优化：
 * - 使用Set记录已经是陆地的格子，避免重复处理
 * - 二维坐标转一维索引的映射技巧
 * - 只在陆地格子上执行并查集操作
 *
 * @param {number} m 网格行数
 * @param {number} n 网格列数
 * @param {number[][]} positions 操作序列
 * @returns {number[]} 每次操作后的岛屿数量
 * @time O(k * α(mn)) k为操作数量
 * @space O(mn) 并查集和陆地记录空间
 */
function numIslands2(m, n, positions) {
    const result = [];
    const islands = new Set(); // 记录陆地格子
    const uf = new UnionFind(m * n);
    let islandCount = 0;

    // 四个方向的偏移量
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (const [row, col] of positions) {
        const pos = row * n + col; // 二维转一维

        // 如果已经是陆地，跳过
        if (islands.has(pos)) {
            result.push(islandCount);
            continue;
        }

        // 添加新陆地，岛屿数量增加
        islands.add(pos);
        islandCount++;

        // 检查四个方向的邻居
        for (const [dr, dc] of directions) {
            const newRow = row + dr;
            const newCol = col + dc;
            const neighborPos = newRow * n + newCol;

            // 检查边界和是否为陆地
            if (newRow >= 0 && newRow < m &&
                newCol >= 0 && newCol < n &&
                islands.has(neighborPos)) {

                // 如果邻居是陆地且不在同一连通分量中，合并
                if (uf.find(pos) !== uf.find(neighborPos)) {
                    uf.union(pos, neighborPos);
                    islandCount--; // 合并减少一个岛屿
                }
            }
        }

        result.push(islandCount);
    }

    return result;
}

// ===========================================
// 题目3：省份数量（带权重关系）
// ===========================================

/**
 * 省份数量 - 基于阈值的连通性
 *
 * 核心思想：
 * 遍历所有距离信息，如果两个城市的距离小于等于阈值，
 * 则在并查集中合并它们。最终统计连通分量数量。
 *
 * 算法步骤：
 * 1. 初始化并查集，每个城市独立成一个省份
 * 2. 遍历距离信息，对满足条件的城市对进行合并
 * 3. 统计最终的连通分量数量
 *
 * @param {number} n 城市数量
 * @param {number} threshold 距离阈值
 * @param {number[][]} distances 距离信息
 * @returns {number} 省份数量
 * @time O(E * α(n)) E为边数
 * @space O(n) 并查集空间
 */
function findProvinces(n, threshold, distances) {
    const uf = new UnionFind(n);

    // 遍历所有距离信息
    for (const [cityA, cityB, distance] of distances) {
        if (distance <= threshold) {
            uf.union(cityA, cityB);
        }
    }

    return uf.getCount();
}

/**
 * 扩展：加权并查集版本（维护距离信息）
 *
 * 核心思想：
 * 使用加权并查集维护城市间的相对距离，可以支持更复杂的查询。
 */
class WeightedUnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.weight = new Array(n).fill(0); // 到根节点的距离
        this.count = n;
    }

    /**
     * 查找根节点并更新权重
     */
    find(x) {
        if (this.parent[x] !== x) {
            const root = this.find(this.parent[x]);
            this.weight[x] += this.weight[this.parent[x]]; // 路径压缩时更新权重
            this.parent[x] = root;
        }
        return this.parent[x];
    }

    /**
     * 按权重合并
     */
    union(x, y, w) {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX !== rootY) {
            this.parent[rootX] = rootY;
            this.weight[rootX] = this.weight[y] - this.weight[x] + w;
            this.count--;
        }
    }

    /**
     * 查询两点间的距离差
     */
    diff(x, y) {
        if (this.find(x) !== this.find(y)) {
            return null; // 不连通
        }
        return this.weight[x] - this.weight[y];
    }
}

// ===========================================
// 题目4：账户合并
// ===========================================

/**
 * 账户合并 - 基于邮箱的并查集
 *
 * 核心思想：
 * 将邮箱作为并查集的节点，而不是账户。如果两个邮箱属于同一账户，
 * 则在并查集中合并它们。最后按连通分量重新组织账户信息。
 *
 * 算法步骤：
 * 1. 建立邮箱到账户名的映射
 * 2. 对于每个账户，将其中的邮箱两两合并
 * 3. 按连通分量收集邮箱，重新组织账户
 * 4. 对每个账户的邮箱列表排序
 *
 * @param {string[][]} accounts 账户信息
 * @returns {string[][]} 合并后的账户
 * @time O(A * log A) A为所有邮箱总数
 * @space O(A) 并查集和映射表空间
 */
function accountsMerge(accounts) {
    const emailToName = new Map(); // 邮箱到账户名的映射
    const emailToIndex = new Map(); // 邮箱到索引的映射
    const emails = []; // 所有邮箱列表

    // 建立映射关系
    for (const account of accounts) {
        const name = account[0];
        for (let i = 1; i < account.length; i++) {
            const email = account[i];
            if (!emailToIndex.has(email)) {
                emailToIndex.set(email, emails.length);
                emails.push(email);
                emailToName.set(email, name);
            }
        }
    }

    const uf = new UnionFind(emails.length);

    // 合并同一账户中的邮箱
    for (const account of accounts) {
        const firstEmailIndex = emailToIndex.get(account[1]);
        for (let i = 2; i < account.length; i++) {
            const emailIndex = emailToIndex.get(account[i]);
            uf.union(firstEmailIndex, emailIndex);
        }
    }

    // 按连通分量收集邮箱
    const groups = new Map();
    for (let i = 0; i < emails.length; i++) {
        const root = uf.find(i);
        if (!groups.has(root)) {
            groups.set(root, []);
        }
        groups.get(root).push(emails[i]);
    }

    // 构建结果
    const result = [];
    for (const emailList of groups.values()) {
        emailList.sort(); // 按字典序排序
        const name = emailToName.get(emailList[0]);
        result.push([name, ...emailList]);
    }

    return result;
}

// ===========================================
// 题目5：冗余连接
// ===========================================

/**
 * 冗余连接 - 环检测
 *
 * 核心思想：
 * 按顺序遍历所有边，对于每条边检查其两个端点是否已经连通。
 * 如果已经连通，说明添加这条边会形成环，这就是要删除的边。
 *
 * 算法正确性：
 * - 树有n个节点n-1条边的性质
 * - 多出的一条边必然会形成环
 * - 按顺序检查，第一条造成环的边就是答案
 *
 * @param {number[][]} edges 边的列表
 * @returns {number[]} 要删除的边
 * @time O(E * α(n)) E为边数
 * @space O(n) 并查集空间
 */
function findRedundantConnection(edges) {
    // 找出最大节点编号，确定并查集大小
    let maxNode = 0;
    for (const [u, v] of edges) {
        maxNode = Math.max(maxNode, u, v);
    }

    const uf = new UnionFind(maxNode + 1); // 节点编号从1开始

    // 按顺序处理每条边
    for (const [u, v] of edges) {
        if (uf.find(u) === uf.find(v)) {
            // 两个节点已经连通，添加这条边会形成环
            return [u, v];
        }
        uf.union(u, v);
    }

    return []; // 理论上不会到达这里
}

/**
 * 扩展：有向图中的冗余连接
 *
 * 核心思想：
 * 有向图中需要考虑两种情况：
 * 1. 某个节点有两个父节点
 * 2. 图中存在环
 */
function findRedundantDirectedConnection(edges) {
    const n = edges.length;
    const parent = new Array(n + 1).fill(0);
    let candidate1 = null, candidate2 = null;

    // 第一步：寻找入度为2的节点
    for (const [u, v] of edges) {
        if (parent[v] === 0) {
            parent[v] = u;
        } else {
            // 发现入度为2的节点
            candidate1 = [parent[v], v];
            candidate2 = [u, v];
            break;
        }
    }

    const uf = new UnionFind(n + 1);

    // 第二步：检查是否存在环
    for (const [u, v] of edges) {
        if (candidate2 && u === candidate2[0] && v === candidate2[1]) {
            continue; // 跳过candidate2
        }

        if (uf.find(u) === uf.find(v)) {
            // 发现环
            return candidate1 ? candidate1 : [u, v];
        }
        uf.union(u, v);
    }

    return candidate2;
}

// ===========================================
// 测试用例和性能分析
// ===========================================

/**
 * 综合测试函数
 */
function runAllTests() {
    console.log("=== 第9章并查集练习题测试 ===\n");

    // 测试题目1：朋友圈数量
    console.log("1. 朋友圈数量测试：");
    const matrix1 = [[1,1,0],[1,1,0],[0,0,1]];
    console.log(`输入: ${JSON.stringify(matrix1)}`);
    console.log(`输出: ${findCircleNum(matrix1)}`); // 期望: 2

    const matrix2 = [[1,0,0],[0,1,0],[0,0,1]];
    console.log(`输入: ${JSON.stringify(matrix2)}`);
    console.log(`输出: ${findCircleNum(matrix2)}\n`); // 期望: 3

    // 测试题目2：岛屿数量II
    console.log("2. 岛屿数量II测试：");
    const positions = [[0,0],[0,1],[1,2],[2,1]];
    console.log(`输入: m=3, n=3, positions=${JSON.stringify(positions)}`);
    console.log(`输出: ${JSON.stringify(numIslands2(3, 3, positions))}\n`); // 期望: [1,1,2,3]

    // 测试题目3：省份数量
    console.log("3. 省份数量测试：");
    const distances = [[0,1,3],[1,2,5],[2,3,3],[0,3,7]];
    console.log(`输入: n=4, threshold=4, distances=${JSON.stringify(distances)}`);
    console.log(`输出: ${findProvinces(4, 4, distances)}\n`); // 期望: 2

    // 测试题目4：账户合并
    console.log("4. 账户合并测试：");
    const accounts = [
        ["John","johnsmith@mail.com","john_newyork@mail.com"],
        ["John","johnsmith@mail.com","john00@mail.com"],
        ["Mary","mary@mail.com"],
        ["John","johnnybravo@mail.com"]
    ];
    console.log(`输入: ${JSON.stringify(accounts)}`);
    console.log(`输出: ${JSON.stringify(accountsMerge(accounts))}\n`);

    // 测试题目5：冗余连接
    console.log("5. 冗余连接测试：");
    const edges = [[1,2],[1,3],[2,3]];
    console.log(`输入: ${JSON.stringify(edges)}`);
    console.log(`输出: ${JSON.stringify(findRedundantConnection(edges))}\n`); // 期望: [2,3]
}

/**
 * 性能测试函数
 */
function performanceTest() {
    console.log("=== 并查集性能测试 ===");

    // 测试大规模朋友圈问题
    const n = 1000;
    const matrix = Array(n).fill().map(() => Array(n).fill(0));
    // 创建对角线矩阵
    for (let i = 0; i < n; i++) {
        matrix[i][i] = 1;
    }

    console.time("朋友圈数量(1000个学生)");
    const result = findCircleNum(matrix);
    console.timeEnd("朋友圈数量(1000个学生)");
    console.log(`结果: ${result}个朋友圈\n`);

    // 测试大规模岛屿问题
    const positions = [];
    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 100; j++) {
            positions.push([i, j]);
        }
    }

    console.time("岛屿数量II(10000次操作)");
    const islandResults = numIslands2(100, 100, positions);
    console.timeEnd("岛屿数量II(10000次操作)");
    console.log(`最终岛屿数量: ${islandResults[islandResults.length - 1]}\n`);
}

/**
 * 算法复杂度对比分析
 */
function complexityAnalysis() {
    console.log("=== 并查集算法复杂度分析 ===");
    console.log("操作类型           时间复杂度    空间复杂度    说明");
    console.log("--------------------------------------------------------------");
    console.log("基础查找           O(α(n))       O(1)         带路径压缩");
    console.log("基础合并           O(α(n))       O(1)         按秩合并");
    console.log("朋友圈统计         O(n²α(n))     O(n)         遍历邻接矩阵");
    console.log("动态岛屿计数       O(kα(mn))     O(mn)        k次操作");
    console.log("账户合并           O(A log A)    O(A)         A为邮箱总数");
    console.log("环检测             O(Eα(V))      O(V)         E边数V点数");
    console.log("--------------------------------------------------------------");
    console.log("注：α(n)是阿克曼函数的反函数，实际应用中可视为常数");
}

// 运行测试
if (require.main === module) {
    runAllTests();
    performanceTest();
    complexityAnalysis();
}