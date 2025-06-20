# 第9章：并查集

## 概述 📚

并查集（Union-Find Set）是一种树型的数据结构，用于处理一些不相交集合的合并及查询问题。它支持两种操作：查找（Find）和合并（Union），因此也被称为Union-Find数据结构。并查集在处理动态连通性问题、图的连通性、最小生成树算法等方面有着广泛的应用。

## 并查集基础操作 🔧

### 基本结构和初始化

```javascript
class UnionFind {
    constructor(n) {
        // 父节点数组，初始时每个节点的父节点是自己
        this.parent = Array.from({ length: n }, (_, i) => i);
        // 记录每个根节点所在树的深度（秩）
        this.rank = new Array(n).fill(0);
        // 记录连通分量的数量
        this.count = n;
    }
}

// 示例用法
const uf = new UnionFind(5);
console.log(uf.parent);  // [0, 1, 2, 3, 4]
console.log(uf.count);   // 5
```

### 查找操作（路径压缩）

```javascript
class UnionFind {
    // ... 构造函数 ...

    /**
     * 查找元素x的根节点（带路径压缩）
     * 路径压缩：将查找路径上的所有节点直接连接到根节点
     */
    find(x) {
        if (this.parent[x] !== x) {
            // 路径压缩：递归查找根节点并压缩路径
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }

    /**
     * 查找操作的迭代版本
     */
    findIterative(x) {
        let root = x;
        // 找到根节点
        while (this.parent[root] !== root) {
            root = this.parent[root];
        }

        // 路径压缩：将路径上所有节点直接连接到根节点
        while (this.parent[x] !== x) {
            const next = this.parent[x];
            this.parent[x] = root;
            x = next;
        }

        return root;
    }
}

// 示例用法
const uf = new UnionFind(5);
console.log(uf.find(3));  // 3（初始时每个节点的根是自己）
```

### 合并操作（按秩合并）

```javascript
class UnionFind {
    // ... 其他方法 ...

    /**
     * 合并两个集合（按秩合并优化）
     * 按秩合并：总是将较小的树合并到较大的树下
     */
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);

        // 如果已经在同一个集合中，不需要合并
        if (rootX === rootY) {
            return false;
        }

        // 按秩合并：将较小的树合并到较大的树下
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            // 秩相等时，可以任选一个作为根，但要增加秩
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }

        // 连通分量数量减1
        this.count--;
        return true;
    }

    /**
     * 检查两个元素是否在同一个集合中
     */
    isConnected(x, y) {
        return this.find(x) === this.find(y);
    }

    /**
     * 获取连通分量的数量
     */
    getCount() {
        return this.count;
    }
}

// 示例用法
const uf = new UnionFind(5);
uf.union(0, 1);  // 合并0和1
uf.union(2, 3);  // 合并2和3
console.log(uf.isConnected(0, 1));  // true
console.log(uf.isConnected(0, 2));  // false
console.log(uf.getCount());         // 3个连通分量: {0,1}, {2,3}, {4}
```

### 集合大小统计

```javascript
class UnionFind {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
        this.size = new Array(n).fill(1);  // 记录每个根节点所在集合的大小
        this.count = n;
    }

    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX === rootY) {
            return false;
        }

        // 按秩合并，同时更新集合大小
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

    /**
     * 获取元素x所在集合的大小
     */
    getSize(x) {
        return this.size[this.find(x)];
    }
}

// 示例用法
const uf = new UnionFind(6);
uf.union(0, 1);
uf.union(1, 2);
console.log(uf.getSize(0));  // 3（集合{0,1,2}的大小）
console.log(uf.getSize(3));  // 1（集合{3}的大小）
```

## 并查集与其他数据结构的关系 💡

### 与图的关系

```javascript
/**
 * 判断无向图是否连通
 * 核心思想：将图的边加入并查集，最后检查是否只有一个连通分量
 */
function isGraphConnected(n, edges) {
    const uf = new UnionFind(n);

    // 将所有边加入并查集
    for (const [u, v] of edges) {
        uf.union(u, v);
    }

    // 连通图只有一个连通分量
    return uf.getCount() === 1;
}

/**
 * 检测无向图中是否有环
 * 核心思想：如果添加边时发现两个顶点已经连通，则存在环
 */
function hasGraphCycle(n, edges) {
    const uf = new UnionFind(n);

    for (const [u, v] of edges) {
        if (uf.isConnected(u, v)) {
            return true;  // 发现环
        }
        uf.union(u, v);
    }

    return false;
}

// 示例用法
const edges = [[0, 1], [1, 2], [2, 3], [3, 0]];
console.log(hasGraphCycle(4, edges));  // true（形成环）
```

### 与最小生成树的关系

```javascript
/**
 * Kruskal算法求最小生成树
 * 核心思想：按权重排序边，使用并查集避免形成环
 */
function kruskalMST(n, edges) {
    // 按权重排序
    edges.sort((a, b) => a[2] - b[2]);

    const uf = new UnionFind(n);
    const mst = [];
    let totalWeight = 0;

    for (const [u, v, weight] of edges) {
        // 如果两个顶点不连通，则加入MST
        if (!uf.isConnected(u, v)) {
            uf.union(u, v);
            mst.push([u, v, weight]);
            totalWeight += weight;

            // 如果已经有n-1条边，MST完成
            if (mst.length === n - 1) {
                break;
            }
        }
    }

    return { edges: mst, weight: totalWeight };
}

// 示例用法
const graphEdges = [
    [0, 1, 4], [0, 2, 3], [1, 2, 1],
    [1, 3, 2], [2, 3, 5]
];
const mst = kruskalMST(4, graphEdges);
console.log(mst);  // 最小生成树的边和总权重
```

### 与集合操作的关系

```javascript
/**
 * 并查集实现的动态集合操作
 */
class DynamicSets {
    constructor(elements) {
        this.elementToIndex = new Map();
        this.indexToElement = new Map();

        // 为每个元素分配索引
        elements.forEach((element, index) => {
            this.elementToIndex.set(element, index);
            this.indexToElement.set(index, element);
        });

        this.uf = new UnionFind(elements.length);
    }

    /**
     * 合并两个元素所在的集合
     */
    union(a, b) {
        const indexA = this.elementToIndex.get(a);
        const indexB = this.elementToIndex.get(b);
        return this.uf.union(indexA, indexB);
    }

    /**
     * 检查两个元素是否在同一集合
     */
    isConnected(a, b) {
        const indexA = this.elementToIndex.get(a);
        const indexB = this.elementToIndex.get(b);
        return this.uf.isConnected(indexA, indexB);
    }

    /**
     * 获取元素所在集合的所有元素
     */
    getSet(element) {
        const index = this.elementToIndex.get(element);
        const root = this.uf.find(index);
        const result = [];

        for (let i = 0; i < this.uf.parent.length; i++) {
            if (this.uf.find(i) === root) {
                result.push(this.indexToElement.get(i));
            }
        }

        return result;
    }
}

// 示例用法
const sets = new DynamicSets(['A', 'B', 'C', 'D', 'E']);
sets.union('A', 'B');
sets.union('C', 'D');
console.log(sets.getSet('A'));  // ['A', 'B']
console.log(sets.isConnected('A', 'C'));  // false
```

## 核心算法思想 🎯

### 1. 路径压缩思想

路径压缩是并查集最重要的优化技术，将查找路径上的所有节点直接连接到根节点。

**核心概念**：
- 在查找过程中扁平化树结构
- 使后续查找操作更加高效
- 时间复杂度接近O(1)

**解题思想**：
1. 递归查找根节点
2. 在回溯过程中将路径上的节点直接连接到根节点
3. 大幅减少树的高度

**经典应用：朋友圈问题**

```javascript
/**
 * 朋友圈数量
 * 核心思想：每个朋友圈是一个连通分量，使用并查集统计连通分量数量
 */
function findCircleNum(isConnected) {
    const n = isConnected.length;
    const uf = new UnionFind(n);

    // 遍历邻接矩阵，合并朋友关系
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (isConnected[i][j] === 1) {
                uf.union(i, j);
            }
        }
    }

    return uf.getCount();
}

// 示例
const friends = [
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 1]
];
console.log(findCircleNum(friends));  // 2个朋友圈
```

### 2. 按秩合并思想

按秩合并通过维护树的深度信息，总是将较浅的树合并到较深的树下。

**核心概念**：
- 维护每个根节点的秩（深度或节点数）
- 合并时选择最优的合并方向
- 控制树的高度增长

**解题思想**：
1. 比较两个根节点的秩
2. 将秩小的树合并到秩大的树下
3. 只有当两个秩相等时，合并后的秩才会增加

**经典应用：动态连通性**

```javascript
/**
 * 动态连通性查询
 * 核心思想：支持动态添加连接和查询连通性
 */
class DynamicConnectivity {
    constructor(n) {
        this.uf = new UnionFind(n);
        this.history = [];  // 记录操作历史
    }

    /**
     * 添加连接
     */
    connect(x, y) {
        const connected = this.uf.union(x, y);
        this.history.push({ op: 'union', x, y, connected });
        return connected;
    }

    /**
     * 查询连通性
     */
    isConnected(x, y) {
        return this.uf.isConnected(x, y);
    }

    /**
     * 获取连通分量数量
     */
    getComponents() {
        return this.uf.getCount();
    }

    /**
     * 获取所有连通分量
     */
    getAllComponents() {
        const components = new Map();

        for (let i = 0; i < this.uf.parent.length; i++) {
            const root = this.uf.find(i);
            if (!components.has(root)) {
                components.set(root, []);
            }
            components.get(root).push(i);
        }

        return Array.from(components.values());
    }
}

// 示例用法
const dc = new DynamicConnectivity(6);
dc.connect(0, 1);
dc.connect(2, 3);
dc.connect(1, 2);
console.log(dc.getAllComponents());  // [[0,1,2,3], [4], [5]]
```

### 3. 加权并查集思想

加权并查集在标准并查集基础上增加权重信息，用于处理带权关系的问题。

**核心概念**：
- 维护节点间的相对权重关系
- 在路径压缩和合并时更新权重
- 支持查询任意两点间的权重关系

**解题思想**：
1. 为每个节点维护到根节点的权重
2. 在查找时累计路径权重
3. 在合并时保持权重关系的一致性

**经典应用：带权重的关系推理**

```javascript
/**
 * 加权并查集
 * 支持维护节点间的权重关系
 */
class WeightedUnionFind {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.weight = new Array(n).fill(0);  // 到根节点的权重
        this.count = n;
    }

    /**
     * 带权重的查找操作
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
     * 带权重的合并操作
     * w表示weight[x] - weight[y] = w
     */
    union(x, y, w) {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX === rootY) {
            // 检查权重关系是否一致
            return this.weight[x] - this.weight[y] === w;
        }

        // 合并两个集合
        this.parent[rootY] = rootX;
        this.weight[rootY] = this.weight[x] - this.weight[y] - w;
        this.count--;
        return true;
    }

    /**
     * 查询两点间的权重差
     */
    diff(x, y) {
        if (this.find(x) !== this.find(y)) {
            return null;  // 不在同一集合中
        }
        return this.weight[x] - this.weight[y];
    }
}

// 示例：等式推理
const wuf = new WeightedUnionFind(4);
// a - b = 3
wuf.union(0, 1, 3);
// b - c = 2
wuf.union(1, 2, 2);
// 查询 a - c = ?
console.log(wuf.diff(0, 2));  // 5 (= 3 + 2)
```

### 4. 在线算法思想

并查集支持在线处理查询，即可以在添加连接的同时回答连通性查询。

**核心概念**：
- 支持动态更新和查询
- 每次操作的均摊时间复杂度接近O(1)
- 适合处理流式数据

**解题思想**：
1. 维护动态变化的数据结构
2. 支持实时查询和更新
3. 优化单次操作的时间复杂度

**经典应用：岛屿数量II**

```javascript
/**
 * 岛屿数量II - 动态添加岛屿
 * 核心思想：每次添加岛屿时，检查与相邻岛屿的连通性
 */
function numIslandsII(m, n, positions) {
    const uf = new UnionFind(m * n);
    const isLand = new Array(m * n).fill(false);
    const result = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    // 将二维坐标转换为一维索引
    const getIndex = (row, col) => row * n + col;

    for (const [row, col] of positions) {
        const index = getIndex(row, col);

        if (isLand[index]) {
            // 重复位置，岛屿数量不变
            result.push(result[result.length - 1] || 0);
            continue;
        }

        isLand[index] = true;
        let islands = uf.getCount() - (m * n - result.length - 1);

        // 检查四个方向的相邻位置
        for (const [dx, dy] of directions) {
            const newRow = row + dx;
            const newCol = col + dy;

            if (newRow >= 0 && newRow < m &&
                newCol >= 0 && newCol < n) {
                const adjIndex = getIndex(newRow, newCol);

                if (isLand[adjIndex] &&
                    uf.union(index, adjIndex)) {
                    islands--;  // 合并了两个岛屿
                }
            }
        }

        result.push(islands);
    }

    return result;
}

// 示例
const positions = [[0,0], [0,1], [1,2], [2,1]];
console.log(numIslandsII(3, 3, positions));  // [1, 1, 2, 3]
```

## 算法思想总结 🎯

| 思想类型 | 时间复杂度 | 空间复杂度 | 核心设计理念 |
|---------|-----------|-----------|-------------|
| 路径压缩思想 | O(α(n)) | O(n) | 扁平化树结构提高查找效率 |
| 按秩合并思想 | O(α(n)) | O(n) | 控制树高度平衡合并操作 |
| 加权并查集思想 | O(α(n)) | O(n) | 维护节点间权重关系 |
| 在线算法思想 | O(α(n)) | O(n) | 支持动态查询和更新 |

**适用总结**：
- 路径压缩思想：适用于频繁查找操作的场景
- 按秩合并思想：适用于大量合并操作的场景
- 加权并查集思想：适用于需要维护关系权重的场景
- 在线算法思想：适用于动态连通性问题和流式数据处理