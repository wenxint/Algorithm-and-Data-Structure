/**
 * 第9章：并查集 - 算法实现
 *
 * 本文件包含：
 * 1. 高级并查集算法和优化技术
 * 2. 图论中的并查集应用（最小生成树、环检测）
 * 3. 动态连通性和在线算法
 * 4. 复杂的并查集变种和应用场景
 * 5. 实际问题的解决方案
 *
 * 作者：数据结构与算法教程
 * 日期：2024年
 */

// ============================= 1. Kruskal最小生成树算法 =============================

/**
 * 使用Kruskal算法求最小生成树
 *
 * 核心思想：
 * 贪心算法思想，按边权重从小到大排序，使用并查集检测环
 * 每次选择权重最小的不构成环的边，直到选择n-1条边
 *
 * @param {Array<Array<number>>} edges - 边列表 [[u, v, weight], ...]
 * @param {number} n - 顶点数量
 * @returns {Object} 最小生成树结果
 * @time O(E log E) E为边数
 * @space O(V) V为顶点数
 */
function kruskalMST(edges, n) {
    // 导入基础并查集类
    class UnionFind {
        constructor(n) {
            this.parent = Array.from({ length: n }, (_, i) => i);
            this.rank = new Array(n).fill(0);
            this.count = n;
        }

        find(x) {
            if (this.parent[x] !== x) {
                this.parent[x] = this.find(this.parent[x]);
            }
            return this.parent[x];
        }

        union(x, y) {
            const rootX = this.find(x);
            const rootY = this.find(y);

            if (rootX === rootY) return false;

            if (this.rank[rootX] < this.rank[rootY]) {
                this.parent[rootX] = rootY;
            } else if (this.rank[rootX] > this.rank[rootY]) {
                this.parent[rootY] = rootX;
            } else {
                this.parent[rootY] = rootX;
                this.rank[rootX]++;
            }

            this.count--;
            return true;
        }

        isConnected(x, y) {
            return this.find(x) === this.find(y);
        }
    }

    // 按边权重排序
    const sortedEdges = edges.slice().sort((a, b) => a[2] - b[2]);

    const uf = new UnionFind(n);
    const mstEdges = [];
    let totalWeight = 0;

    // 贪心选择边
    for (const [u, v, weight] of sortedEdges) {
        // 如果添加这条边不会形成环
        if (uf.union(u, v)) {
            mstEdges.push([u, v, weight]);
            totalWeight += weight;

            // 如果已经选择了n-1条边，MST完成
            if (mstEdges.length === n - 1) {
                break;
            }
        }
    }

    return {
        edges: mstEdges,
        totalWeight: totalWeight,
        isConnected: mstEdges.length === n - 1,
        edgeCount: mstEdges.length
    };
}

/**
 * 构建完整的最小生成树分析
 *
 * @param {Array<Array<number>>} edges - 边列表
 * @param {number} n - 顶点数量
 * @returns {Object} 详细的MST分析结果
 */
function analyzeMST(edges, n) {
    const result = kruskalMST(edges, n);

    // 构建邻接表表示的MST
    const mstGraph = Array.from({ length: n }, () => []);
    for (const [u, v, weight] of result.edges) {
        mstGraph[u].push({ vertex: v, weight });
        mstGraph[v].push({ vertex: u, weight });
    }

    // 计算树的统计信息
    const degrees = mstGraph.map(adj => adj.length);
    const maxDegree = Math.max(...degrees);
    const avgDegree = degrees.reduce((sum, d) => sum + d, 0) / n;

    return {
        ...result,
        mstGraph,
        maxDegree,
        avgDegree,
        leafNodes: degrees.filter(d => d === 1).length,
        statistics: {
            vertices: n,
            edges: result.edgeCount,
            totalWeight: result.totalWeight,
            averageWeight: result.totalWeight / result.edgeCount,
            maxDegree,
            avgDegree
        }
    };
}

// ============================= 2. 图的连通性检测 =============================

/**
 * 检测无向图是否连通
 *
 * 核心思想：
 * 使用并查集合并所有边，最后检查是否只有一个连通分量
 *
 * @param {Array<Array<number>>} edges - 边列表 [[u, v], ...]
 * @param {number} n - 顶点数量
 * @returns {Object} 连通性分析结果
 * @time O(E·α(V))
 * @space O(V)
 */
function isGraphConnected(edges, n) {
    class UnionFind {
        constructor(n) {
            this.parent = Array.from({ length: n }, (_, i) => i);
            this.rank = new Array(n).fill(0);
            this.size = new Array(n).fill(1);
            this.count = n;
        }

        find(x) {
            if (this.parent[x] !== x) {
                this.parent[x] = this.find(this.parent[x]);
            }
            return this.parent[x];
        }

        union(x, y) {
            const rootX = this.find(x);
            const rootY = this.find(y);

            if (rootX === rootY) return false;

            if (this.rank[rootX] < this.rank[rootY]) {
                this.parent[rootX] = rootY;
                this.size[rootY] += this.size[rootX];
            } else if (this.rank[rootX] > this.rank[rootY]) {
                this.parent[rootY] = rootX;
                this.size[rootX] += this.size[rootY];
            } else {
                this.parent[rootY] = rootX;
                this.rank[rootX]++;
                this.size[rootX] += this.size[rootY];
            }

            this.count--;
            return true;
        }

        getComponents() {
            const components = new Map();
            for (let i = 0; i < this.parent.length; i++) {
                const root = this.find(i);
                if (!components.has(root)) {
                    components.set(root, []);
                }
                components.get(root).push(i);
            }
            return Array.from(components.values());
        }

        getComponentSizes() {
            const components = this.getComponents();
            return components.map(comp => comp.length);
        }
    }

    const uf = new UnionFind(n);
    const processedEdges = [];

    // 处理所有边
    for (const [u, v] of edges) {
        if (u >= 0 && u < n && v >= 0 && v < n) {
            const wasNewConnection = uf.union(u, v);
            processedEdges.push([u, v, wasNewConnection]);
        }
    }

    const components = uf.getComponents();
    const componentSizes = uf.getComponentSizes();

    return {
        isConnected: uf.count === 1,
        componentCount: uf.count,
        components: components,
        componentSizes: componentSizes,
        largestComponentSize: Math.max(...componentSizes),
        smallestComponentSize: Math.min(...componentSizes),
        processedEdges: processedEdges,
        edgeCount: edges.length,
        vertexCount: n,
        connectivityRatio: 1 - (uf.count - 1) / (n - 1)  // 连通性比率
    };
}

/**
 * 检测图中的环
 *
 * 核心思想：
 * 在添加边的过程中，如果两个顶点已经连通，则形成了环
 *
 * @param {Array<Array<number>>} edges - 边列表
 * @param {number} n - 顶点数量
 * @returns {Object} 环检测结果
 */
function detectCycles(edges, n) {
    class UnionFind {
        constructor(n) {
            this.parent = Array.from({ length: n }, (_, i) => i);
            this.rank = new Array(n).fill(0);
        }

        find(x) {
            if (this.parent[x] !== x) {
                this.parent[x] = this.find(this.parent[x]);
            }
            return this.parent[x];
        }

        union(x, y) {
            const rootX = this.find(x);
            const rootY = this.find(y);

            if (rootX === rootY) return false;

            if (this.rank[rootX] < this.rank[rootY]) {
                this.parent[rootX] = rootY;
            } else if (this.rank[rootX] > this.rank[rootY]) {
                this.parent[rootY] = rootX;
            } else {
                this.parent[rootY] = rootX;
                this.rank[rootX]++;
            }

            return true;
        }

        isConnected(x, y) {
            return this.find(x) === this.find(y);
        }
    }

    const uf = new UnionFind(n);
    const cycles = [];
    const treeEdges = [];

    for (let i = 0; i < edges.length; i++) {
        const [u, v] = edges[i];

        if (uf.isConnected(u, v)) {
            // 发现环
            cycles.push({
                edge: [u, v],
                edgeIndex: i,
                type: 'back-edge'
            });
        } else {
            // 树边
            uf.union(u, v);
            treeEdges.push({
                edge: [u, v],
                edgeIndex: i,
                type: 'tree-edge'
            });
        }
    }

    return {
        hasCycle: cycles.length > 0,
        cycleCount: cycles.length,
        cycles: cycles,
        treeEdges: treeEdges,
        treeEdgeCount: treeEdges.length,
        cycleEdges: cycles.map(c => c.edge),
        edgeClassification: [...treeEdges, ...cycles].sort((a, b) => a.edgeIndex - b.edgeIndex)
    };
}

// ============================= 3. 动态连通性问题 =============================

/**
 * 动态连通性查询器
 *
 * 核心思想：
 * 支持动态添加边和查询连通性的在线算法
 * 可以回答"在第i步操作后，u和v是否连通"的查询
 */
class DynamicConnectivity {
    constructor(n) {
        this.n = n;
        this.uf = this.createUnionFind(n);
        this.operations = [];
        this.snapshots = [];
    }

    createUnionFind(n) {
        return {
            parent: Array.from({ length: n }, (_, i) => i),
            rank: new Array(n).fill(0),
            count: n,

            find(x) {
                if (this.parent[x] !== x) {
                    this.parent[x] = this.find(this.parent[x]);
                }
                return this.parent[x];
            },

            union(x, y) {
                const rootX = this.find(x);
                const rootY = this.find(y);

                if (rootX === rootY) return false;

                if (this.rank[rootX] < this.rank[rootY]) {
                    this.parent[rootX] = rootY;
                } else if (this.rank[rootX] > this.rank[rootY]) {
                    this.parent[rootY] = rootX;
                } else {
                    this.parent[rootY] = rootX;
                    this.rank[rootX]++;
                }

                this.count--;
                return true;
            },

            isConnected(x, y) {
                return this.find(x) === this.find(y);
            },

            getCount() {
                return this.count;
            }
        };
    }

    /**
     * 添加边操作
     *
     * @param {number} u - 顶点u
     * @param {number} v - 顶点v
     * @returns {boolean} 是否是新的连接
     */
    addEdge(u, v) {
        const wasConnected = this.uf.isConnected(u, v);
        const added = this.uf.union(u, v);

        this.operations.push({
            type: 'add',
            edge: [u, v],
            wasConnected,
            added,
            componentCount: this.uf.getCount(),
            timestamp: this.operations.length
        });

        return added;
    }

    /**
     * 查询两点是否连通
     *
     * @param {number} u - 顶点u
     * @param {number} v - 顶点v
     * @returns {boolean} 是否连通
     */
    query(u, v) {
        const result = this.uf.isConnected(u, v);

        this.operations.push({
            type: 'query',
            edge: [u, v],
            result,
            componentCount: this.uf.getCount(),
            timestamp: this.operations.length
        });

        return result;
    }

    /**
     * 创建当前状态的快照
     *
     * @returns {number} 快照ID
     */
    createSnapshot() {
        const snapshot = {
            id: this.snapshots.length,
            parent: [...this.uf.parent],
            rank: [...this.uf.rank],
            count: this.uf.count,
            operationCount: this.operations.length
        };

        this.snapshots.push(snapshot);
        return snapshot.id;
    }

    /**
     * 恢复到指定快照
     *
     * @param {number} snapshotId - 快照ID
     */
    restoreSnapshot(snapshotId) {
        if (snapshotId < 0 || snapshotId >= this.snapshots.length) {
            throw new Error('Invalid snapshot ID');
        }

        const snapshot = this.snapshots[snapshotId];
        this.uf.parent = [...snapshot.parent];
        this.uf.rank = [...snapshot.rank];
        this.uf.count = snapshot.count;

        // 截断操作历史
        this.operations = this.operations.slice(0, snapshot.operationCount);
    }

    /**
     * 获取连通性历史
     *
     * @returns {Array} 连通性变化历史
     */
    getConnectivityHistory() {
        return this.operations.map(op => ({
            ...op,
            connectivity: (this.n - op.componentCount) / (this.n - 1)
        }));
    }

    /**
     * 分析连通性演化
     *
     * @returns {Object} 演化分析结果
     */
    analyzeEvolution() {
        const history = this.getConnectivityHistory();
        const addOperations = history.filter(op => op.type === 'add');

        const componentCounts = addOperations.map(op => op.componentCount);
        const connectivities = addOperations.map(op => op.connectivity);

        return {
            totalOperations: this.operations.length,
            addOperations: addOperations.length,
            queryOperations: history.filter(op => op.type === 'query').length,
            finalComponentCount: this.uf.getCount(),
            finalConnectivity: connectivities[connectivities.length - 1] || 0,
            maxConnectivity: Math.max(...connectivities),
            connectivityProgress: connectivities,
            componentProgress: componentCounts,
            efficiency: {
                effectiveEdges: addOperations.filter(op => op.added).length,
                redundantEdges: addOperations.filter(op => !op.added).length,
                efficiency: addOperations.filter(op => op.added).length / addOperations.length
            }
        };
    }
}

// ============================= 4. 带权重的动态连通性 =============================

/**
 * 带权重的动态连通性
 *
 * 核心思想：
 * 支持维护节点间的相对权重关系
 * 可以查询任意两点间的权重差值
 */
class WeightedDynamicConnectivity {
    constructor(n) {
        this.n = n;
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.weight = new Array(n).fill(0);
        this.count = n;
        this.operations = [];
    }

    /**
     * 查找根节点（带路径压缩）
     *
     * @param {number} x - 节点
     * @returns {number} 根节点
     */
    find(x) {
        if (this.parent[x] !== x) {
            const root = this.find(this.parent[x]);
            // 路径压缩时累计权重
            this.weight[x] += this.weight[this.parent[x]];
            this.parent[x] = root;
        }
        return this.parent[x];
    }

    /**
     * 添加权重关系：weight[x] - weight[y] = w
     *
     * @param {number} x - 节点x
     * @param {number} y - 节点y
     * @param {number} w - 权重差
     * @returns {boolean} 是否添加成功（或关系一致）
     */
    addConstraint(x, y, w) {
        const rootX = this.find(x);
        const rootY = this.find(y);

        const operation = {
            type: 'constraint',
            x, y, w,
            success: false,
            consistent: false,
            timestamp: this.operations.length
        };

        if (rootX === rootY) {
            // 检查关系是否一致
            const currentDiff = this.weight[x] - this.weight[y];
            operation.consistent = Math.abs(currentDiff - w) < 1e-9;
            operation.currentDiff = currentDiff;
            operation.expectedDiff = w;
        } else {
            // 合并两个集合
            this.parent[rootY] = rootX;
            this.weight[rootY] = this.weight[x] - this.weight[y] - w;
            this.count--;
            operation.success = true;
            operation.consistent = true;
        }

        this.operations.push(operation);
        return operation.consistent;
    }

    /**
     * 查询两点间的权重差
     *
     * @param {number} x - 节点x
     * @param {number} y - 节点y
     * @returns {number|null} 权重差，如果不连通返回null
     */
    queryDifference(x, y) {
        const operation = {
            type: 'query',
            x, y,
            timestamp: this.operations.length
        };

        if (this.find(x) !== this.find(y)) {
            operation.result = null;
            operation.connected = false;
        } else {
            operation.result = this.weight[x] - this.weight[y];
            operation.connected = true;
        }

        this.operations.push(operation);
        return operation.result;
    }

    /**
     * 检查约束系统的一致性
     *
     * @returns {Object} 一致性分析结果
     */
    checkConsistency() {
        const constraints = this.operations.filter(op => op.type === 'constraint');
        const inconsistentConstraints = constraints.filter(op => !op.consistent);

        return {
            totalConstraints: constraints.length,
            consistentConstraints: constraints.filter(op => op.consistent).length,
            inconsistentConstraints: inconsistentConstraints.length,
            inconsistentDetails: inconsistentConstraints,
            isConsistent: inconsistentConstraints.length === 0,
            componentCount: this.count
        };
    }

    /**
     * 获取所有连通分量的权重基准
     *
     * @returns {Map} 每个分量的权重基准
     */
    getComponentBaselines() {
        const baselines = new Map();

        for (let i = 0; i < this.n; i++) {
            const root = this.find(i);
            if (!baselines.has(root)) {
                baselines.set(root, []);
            }
            baselines.get(root).push({
                node: i,
                weight: this.weight[i]
            });
        }

        return baselines;
    }
}

// ============================= 5. 在线算法应用 =============================

/**
 * 岛屿数量变化（动态）
 *
 * 核心思想：
 * 动态添加陆地单元格，实时计算岛屿数量的变化
 * 使用并查集维护岛屿的连通性
 */
class DynamicIslands {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = Array.from({ length: rows }, () => new Array(cols).fill(0));
        this.uf = this.createUnionFind(rows * cols);
        this.islandCount = 0;
        this.operations = [];
        this.directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    }

    createUnionFind(n) {
        return {
            parent: Array.from({ length: n }, (_, i) => i),
            rank: new Array(n).fill(0),

            find(x) {
                if (this.parent[x] !== x) {
                    this.parent[x] = this.find(this.parent[x]);
                }
                return this.parent[x];
            },

            union(x, y) {
                const rootX = this.find(x);
                const rootY = this.find(y);

                if (rootX === rootY) return false;

                if (this.rank[rootX] < this.rank[rootY]) {
                    this.parent[rootX] = rootY;
                } else if (this.rank[rootX] > this.rank[rootY]) {
                    this.parent[rootY] = rootX;
                } else {
                    this.parent[rootY] = rootX;
                    this.rank[rootX]++;
                }

                return true;
            },

            isConnected(x, y) {
                return this.find(x) === this.find(y);
            }
        };
    }

    /**
     * 将二维坐标转换为一维索引
     *
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {number} 一维索引
     */
    getIndex(row, col) {
        return row * this.cols + col;
    }

    /**
     * 检查坐标是否有效
     *
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {boolean} 是否有效
     */
    isValid(row, col) {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    /**
     * 添加陆地单元格
     *
     * @param {number} row - 行
     * @param {number} col - 列
     * @returns {number} 当前岛屿数量
     */
    addLand(row, col) {
        if (!this.isValid(row, col) || this.grid[row][col] === 1) {
            return this.islandCount;
        }

        this.grid[row][col] = 1;
        this.islandCount++;

        const currentIndex = this.getIndex(row, col);
        const connectedComponents = new Set();

        // 检查四个方向的邻居
        for (const [dr, dc] of this.directions) {
            const newRow = row + dr;
            const newCol = col + dc;

            if (this.isValid(newRow, newCol) && this.grid[newRow][newCol] === 1) {
                const neighborIndex = this.getIndex(newRow, newCol);
                const neighborRoot = this.uf.find(neighborIndex);
                connectedComponents.add(neighborRoot);
            }
        }

        // 合并连通分量
        const mergedComponents = [];
        for (const componentRoot of connectedComponents) {
            if (this.uf.union(currentIndex, componentRoot)) {
                mergedComponents.push(componentRoot);
            }
        }

        // 更新岛屿数量：减去合并的分量数
        this.islandCount -= mergedComponents.length;

        this.operations.push({
            type: 'addLand',
            position: [row, col],
            islandCount: this.islandCount,
            mergedComponents: mergedComponents.length,
            timestamp: this.operations.length
        });

        return this.islandCount;
    }

    /**
     * 批量添加陆地
     *
     * @param {Array<Array<number>>} positions - 位置列表 [[row, col], ...]
     * @returns {Array<number>} 每步操作后的岛屿数量
     */
    addLands(positions) {
        const results = [];
        for (const [row, col] of positions) {
            results.push(this.addLand(row, col));
        }
        return results;
    }

    /**
     * 获取当前网格状态
     *
     * @returns {Array<Array<number>>} 网格
     */
    getGrid() {
        return this.grid.map(row => [...row]);
    }

    /**
     * 获取岛屿变化历史
     *
     * @returns {Array} 历史记录
     */
    getHistory() {
        return this.operations.map(op => ({
            ...op,
            gridSnapshot: this.getGridSnapshotAt(op.timestamp)
        }));
    }

    /**
     * 获取指定时间点的网格快照（模拟）
     *
     * @param {number} timestamp - 时间戳
     * @returns {Array<Array<number>>} 网格快照
     */
    getGridSnapshotAt(timestamp) {
        // 简化实现：重新构建到指定时间点的状态
        const grid = Array.from({ length: this.rows }, () => new Array(this.cols).fill(0));

        for (let i = 0; i <= timestamp && i < this.operations.length; i++) {
            const op = this.operations[i];
            if (op.type === 'addLand') {
                const [row, col] = op.position;
                grid[row][col] = 1;
            }
        }

        return grid;
    }

    /**
     * 分析岛屿演化模式
     *
     * @returns {Object} 演化分析
     */
    analyzeEvolution() {
        const history = this.operations.filter(op => op.type === 'addLand');
        const islandCounts = history.map(op => op.islandCount);
        const mergeCounts = history.map(op => op.mergedComponents);

        return {
            totalOperations: history.length,
            finalIslandCount: this.islandCount,
            maxIslandCount: Math.max(...islandCounts),
            totalMerges: mergeCounts.reduce((sum, count) => sum + count, 0),
            islandCountHistory: islandCounts,
            mergeHistory: mergeCounts,
            peakIslandIndex: islandCounts.indexOf(Math.max(...islandCounts)),
            averageIslandCount: islandCounts.reduce((sum, count) => sum + count, 0) / islandCounts.length
        };
    }
}

// ============================= 6. 应用示例和测试 =============================

/**
 * 社交网络影响力传播
 *
 * 核心思想：
 * 使用并查集模拟社交网络中影响力的传播过程
 * 跟踪影响力扩散的范围和速度
 */
class InfluenceSpread {
    constructor(n) {
        this.n = n;
        this.uf = this.createUnionFind(n);
        this.influences = new Array(n).fill(0);
        this.spreaders = new Set();
        this.spreadHistory = [];
    }

    createUnionFind(n) {
        return {
            parent: Array.from({ length: n }, (_, i) => i),
            rank: new Array(n).fill(0),
            size: new Array(n).fill(1),

            find(x) {
                if (this.parent[x] !== x) {
                    this.parent[x] = this.find(this.parent[x]);
                }
                return this.parent[x];
            },

            union(x, y) {
                const rootX = this.find(x);
                const rootY = this.find(y);

                if (rootX === rootY) return false;

                if (this.rank[rootX] < this.rank[rootY]) {
                    this.parent[rootX] = rootY;
                    this.size[rootY] += this.size[rootX];
                } else if (this.rank[rootX] > this.rank[rootY]) {
                    this.parent[rootY] = rootX;
                    this.size[rootX] += this.size[rootY];
                } else {
                    this.parent[rootY] = rootX;
                    this.rank[rootX]++;
                    this.size[rootX] += this.size[rootY];
                }

                return true;
            },

            getSize(x) {
                return this.size[this.find(x)];
            }
        };
    }

    /**
     * 添加社交关系
     *
     * @param {number} u - 用户u
     * @param {number} v - 用户v
     */
    addConnection(u, v) {
        this.uf.union(u, v);
    }

    /**
     * 设置影响力传播者
     *
     * @param {number} user - 用户ID
     * @param {number} influence - 影响力值
     */
    setSpreader(user, influence) {
        this.spreaders.add(user);
        this.influences[user] = influence;

        this.spreadHistory.push({
            type: 'setSpreader',
            user,
            influence,
            reachableUsers: this.uf.getSize(user),
            timestamp: this.spreadHistory.length
        });
    }

    /**
     * 计算总影响力覆盖
     *
     * @returns {Object} 影响力分析结果
     */
    calculateInfluenceReach() {
        const influenceGroups = new Map();

        // 将传播者按连通分量分组
        for (const spreader of this.spreaders) {
            const root = this.uf.find(spreader);
            if (!influenceGroups.has(root)) {
                influenceGroups.set(root, {
                    spreaders: [],
                    totalInfluence: 0,
                    reachableUsers: this.uf.getSize(spreader)
                });
            }

            const group = influenceGroups.get(root);
            group.spreaders.push(spreader);
            group.totalInfluence += this.influences[spreader];
        }

        const totalReach = Array.from(influenceGroups.values())
            .reduce((sum, group) => sum + group.reachableUsers, 0);

        const totalInfluence = Array.from(influenceGroups.values())
            .reduce((sum, group) => sum + group.totalInfluence, 0);

        return {
            influenceGroups: Array.from(influenceGroups.entries()).map(([root, group]) => ({
                root,
                ...group
            })),
            totalReach,
            totalInfluence,
            reachRate: totalReach / this.n,
            averageInfluencePerUser: totalInfluence / totalReach,
            largestGroup: Math.max(...Array.from(influenceGroups.values()).map(g => g.reachableUsers))
        };
    }

    /**
     * 模拟影响力传播过程
     *
     * @param {Array<Array<number>>} connections - 连接序列
     * @param {Array<Object>} spreaderEvents - 传播者事件
     * @returns {Array} 传播过程记录
     */
    simulateSpread(connections, spreaderEvents) {
        const simulation = [];
        let connectionIndex = 0;
        let spreaderIndex = 0;

        // 按时间顺序处理事件
        const allEvents = [
            ...connections.map((conn, i) => ({ type: 'connection', data: conn, time: i * 2 })),
            ...spreaderEvents.map((event, i) => ({ type: 'spreader', data: event, time: i * 2 + 1 }))
        ].sort((a, b) => a.time - b.time);

        for (const event of allEvents) {
            if (event.type === 'connection') {
                const [u, v] = event.data;
                this.addConnection(u, v);

                simulation.push({
                    type: 'connection',
                    connection: [u, v],
                    influence: this.calculateInfluenceReach(),
                    timestamp: simulation.length
                });
            } else if (event.type === 'spreader') {
                const { user, influence } = event.data;
                this.setSpreader(user, influence);

                simulation.push({
                    type: 'spreader',
                    spreader: { user, influence },
                    influence: this.calculateInfluenceReach(),
                    timestamp: simulation.length
                });
            }
        }

        return simulation;
    }
}

/**
 * 测试Kruskal算法
 */
function testKruskalMST() {
    console.log("=== Kruskal最小生成树测试 ===");

    // 创建测试图
    const edges = [
        [0, 1, 4], [0, 7, 8], [1, 2, 8], [1, 7, 11],
        [2, 3, 7], [2, 8, 2], [2, 5, 4], [3, 4, 9],
        [3, 5, 14], [4, 5, 10], [5, 6, 2], [6, 7, 1],
        [6, 8, 6], [7, 8, 7]
    ];
    const n = 9;

    const result = analyzeMST(edges, n);
    console.log("MST结果:", result.edges);
    console.log("总权重:", result.totalWeight);
    console.log("统计信息:", result.statistics);
}

/**
 * 测试图的连通性
 */
function testGraphConnectivity() {
    console.log("\n=== 图连通性检测测试 ===");

    const edges = [[0, 1], [1, 2], [3, 4], [5, 6], [6, 7]];
    const n = 8;

    const result = isGraphConnected(edges, n);
    console.log("是否连通:", result.isConnected);
    console.log("连通分量数:", result.componentCount);
    console.log("连通分量:", result.components);
    console.log("连通性比率:", result.connectivityRatio);

    // 测试环检测
    const cycleEdges = [[0, 1], [1, 2], [2, 3], [3, 0], [2, 4]];
    const cycleResult = detectCycles(cycleEdges, 5);
    console.log("\n环检测结果:", cycleResult.hasCycle);
    console.log("环的数量:", cycleResult.cycleCount);
    console.log("环边:", cycleResult.cycleEdges);
}

/**
 * 测试动态连通性
 */
function testDynamicConnectivity() {
    console.log("\n=== 动态连通性测试 ===");

    const dc = new DynamicConnectivity(6);

    console.log("添加边 (0,1):", dc.addEdge(0, 1));
    console.log("添加边 (1,2):", dc.addEdge(1, 2));
    console.log("查询 (0,2):", dc.query(0, 2));
    console.log("添加边 (3,4):", dc.addEdge(3, 4));
    console.log("查询 (0,3):", dc.query(0, 3));
    console.log("添加边 (2,3):", dc.addEdge(2, 3));
    console.log("查询 (0,4):", dc.query(0, 4));

    const analysis = dc.analyzeEvolution();
    console.log("连通性演化分析:", analysis.efficiency);
}

/**
 * 测试加权动态连通性
 */
function testWeightedDynamicConnectivity() {
    console.log("\n=== 加权动态连通性测试 ===");

    const wdc = new WeightedDynamicConnectivity(5);

    console.log("添加约束 a - b = 3:", wdc.addConstraint(0, 1, 3));
    console.log("添加约束 b - c = 2:", wdc.addConstraint(1, 2, 2));
    console.log("查询 a - c:", wdc.queryDifference(0, 2));  // 应该是 5
    console.log("添加约束 a - c = 4 (冲突):", wdc.addConstraint(0, 2, 4));

    const consistency = wdc.checkConsistency();
    console.log("一致性检查:", consistency.isConsistent);
}

/**
 * 测试动态岛屿
 */
function testDynamicIslands() {
    console.log("\n=== 动态岛屿测试 ===");

    const islands = new DynamicIslands(3, 3);
    const positions = [[0, 0], [0, 1], [1, 2], [2, 1]];

    console.log("岛屿数量变化:");
    const results = islands.addLands(positions);
    results.forEach((count, i) => {
        console.log(`添加 ${positions[i]} 后: ${count} 个岛屿`);
    });

    const evolution = islands.analyzeEvolution();
    console.log("演化分析:", {
        最大岛屿数: evolution.maxIslandCount,
        最终岛屿数: evolution.finalIslandCount,
        总合并次数: evolution.totalMerges
    });
}

/**
 * 测试影响力传播
 */
function testInfluenceSpread() {
    console.log("\n=== 影响力传播测试 ===");

    const influence = new InfluenceSpread(8);

    // 建立社交网络
    const connections = [[0, 1], [1, 2], [3, 4], [4, 5], [6, 7]];
    const spreaderEvents = [
        { user: 0, influence: 10 },
        { user: 3, influence: 8 },
        { user: 6, influence: 5 }
    ];

    const simulation = influence.simulateSpread(connections, spreaderEvents);

    const finalResult = influence.calculateInfluenceReach();
    console.log("最终影响力覆盖:", finalResult.totalReach, "用户");
    console.log("总影响力:", finalResult.totalInfluence);
    console.log("覆盖率:", (finalResult.reachRate * 100).toFixed(1) + "%");
}

/**
 * 运行所有算法测试
 */
function runAllAlgorithmTests() {
    console.log("并查集算法实现测试开始...\n");

    testKruskalMST();
    testGraphConnectivity();
    testDynamicConnectivity();
    testWeightedDynamicConnectivity();
    testDynamicIslands();
    testInfluenceSpread();

    console.log("\n所有算法测试完成！");
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        kruskalMST,
        analyzeMST,
        isGraphConnected,
        detectCycles,
        DynamicConnectivity,
        WeightedDynamicConnectivity,
        DynamicIslands,
        InfluenceSpread,
        runAllAlgorithmTests
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.UnionFindAlgorithms = {
        kruskalMST,
        analyzeMST,
        isGraphConnected,
        detectCycles,
        DynamicConnectivity,
        WeightedDynamicConnectivity,
        DynamicIslands,
        InfluenceSpread,
        runAllAlgorithmTests
    };
}

// 自动运行测试（如果直接执行此文件）
if (typeof require !== 'undefined' && require.main === module) {
    runAllAlgorithmTests();
}