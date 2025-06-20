/**
 * 第9章：并查集 - 基础实现
 *
 * 本文件包含：
 * 1. 基础并查集类的完整实现
 * 2. 路径压缩和按秩合并优化
 * 3. 加权并查集和动态集合
 * 4. 丰富的应用场景和测试用例
 * 5. 性能分析和优化对比
 *
 * 作者：数据结构与算法教程
 * 日期：2024年
 */

// ============================= 1. 基础并查集类 =============================

/**
 * 基础并查集实现
 *
 * 核心思想：
 * 使用数组表示森林，每个元素指向其父节点
 * 提供查找根节点和合并集合的基本操作
 * 支持路径压缩和按秩合并优化
 *
 * @class UnionFind
 */
class UnionFind {
    /**
     * 创建并查集
     * @param {number} n - 元素数量
     */
    constructor(n) {
        // 父节点数组，初始时每个节点的父节点是自己
        this.parent = Array.from({ length: n }, (_, i) => i);
        // 记录每个根节点所在树的深度（秩）
        this.rank = new Array(n).fill(0);
        // 记录每个根节点所在集合的大小
        this.size = new Array(n).fill(1);
        // 记录连通分量的数量
        this.count = n;
        // 总元素数量
        this.n = n;
    }

    /**
     * 查找元素x的根节点（带路径压缩）
     *
     * 核心思想：
     * 递归查找根节点，在回溯过程中将路径上的所有节点直接连接到根节点
     * 这样可以大幅减少树的高度，提高后续查找效率
     *
     * @param {number} x - 要查找的元素
     * @returns {number} 根节点
     * @time O(α(n)) α为阿克曼函数的反函数
     * @space O(α(n)) 递归栈空间
     */
    find(x) {
        // 输入验证
        if (x < 0 || x >= this.n) {
            throw new Error(`Element ${x} is out of range [0, ${this.n - 1}]`);
        }

        if (this.parent[x] !== x) {
            // 路径压缩：递归查找根节点并将当前节点直接连接到根节点
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }

    /**
     * 查找操作的迭代版本（带路径压缩）
     *
     * @param {number} x - 要查找的元素
     * @returns {number} 根节点
     * @time O(α(n))
     * @space O(1) 常数空间
     */
    findIterative(x) {
        if (x < 0 || x >= this.n) {
            throw new Error(`Element ${x} is out of range [0, ${this.n - 1}]`);
        }

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

    /**
     * 合并两个集合（按秩合并优化）
     *
     * 核心思想：
     * 总是将秩小的树合并到秩大的树下，控制树的高度增长
     * 只有当两个树的秩相等时，合并后的秩才会增加1
     *
     * @param {number} x - 第一个元素
     * @param {number} y - 第二个元素
     * @returns {boolean} 是否成功合并（false表示已经在同一集合中）
     * @time O(α(n))
     * @space O(1)
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
            this.size[rootY] += this.size[rootX];
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
            this.size[rootX] += this.size[rootY];
        } else {
            // 秩相等时，可以任选一个作为根，但要增加秩
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
            this.size[rootX] += this.size[rootY];
        }

        // 连通分量数量减1
        this.count--;
        return true;
    }

    /**
     * 检查两个元素是否在同一个集合中
     *
     * @param {number} x - 第一个元素
     * @param {number} y - 第二个元素
     * @returns {boolean} 是否连通
     * @time O(α(n))
     * @space O(1)
     */
    isConnected(x, y) {
        return this.find(x) === this.find(y);
    }

    /**
     * 获取连通分量的数量
     *
     * @returns {number} 连通分量数量
     * @time O(1)
     * @space O(1)
     */
    getCount() {
        return this.count;
    }

    /**
     * 获取元素x所在集合的大小
     *
     * @param {number} x - 元素
     * @returns {number} 集合大小
     * @time O(α(n))
     * @space O(1)
     */
    getSize(x) {
        return this.size[this.find(x)];
    }

    /**
     * 获取所有连通分量
     *
     * @returns {Array<Array<number>>} 所有连通分量的数组
     * @time O(n·α(n))
     * @space O(n)
     */
    getAllComponents() {
        const components = new Map();

        for (let i = 0; i < this.n; i++) {
            const root = this.find(i);
            if (!components.has(root)) {
                components.set(root, []);
            }
            components.get(root).push(i);
        }

        return Array.from(components.values());
    }

    /**
     * 获取并查集的统计信息
     *
     * @returns {Object} 统计信息对象
     */
    getStatistics() {
        const components = this.getAllComponents();
        const sizes = components.map(comp => comp.length);

        return {
            totalElements: this.n,
            componentCount: this.count,
            averageComponentSize: this.n / this.count,
            largestComponentSize: Math.max(...sizes),
            smallestComponentSize: Math.min(...sizes),
            components: components
        };
    }

    /**
     * 重置并查集到初始状态
     */
    reset() {
        for (let i = 0; i < this.n; i++) {
            this.parent[i] = i;
            this.rank[i] = 0;
            this.size[i] = 1;
        }
        this.count = this.n;
    }

    /**
     * 并查集的字符串表示
     *
     * @returns {string} 字符串表示
     */
    toString() {
        const components = this.getAllComponents();
        return `UnionFind(${this.n} elements, ${this.count} components): ` +
               components.map(comp => `{${comp.join(',')}}`).join(' ');
    }
}

// ============================= 2. 加权并查集类 =============================

/**
 * 加权并查集
 *
 * 核心思想：
 * 在标准并查集基础上增加权重信息，用于处理带权关系的问题
 * 维护每个节点到根节点的权重，支持查询任意两点间的权重关系
 *
 * @class WeightedUnionFind
 */
class WeightedUnionFind {
    /**
     * 创建加权并查集
     * @param {number} n - 元素数量
     */
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.weight = new Array(n).fill(0);  // 到根节点的权重
        this.count = n;
        this.n = n;
    }

    /**
     * 带权重的查找操作
     *
     * 核心思想：
     * 在路径压缩过程中累计权重，保持权重关系的正确性
     *
     * @param {number} x - 要查找的元素
     * @returns {number} 根节点
     * @time O(α(n))
     * @space O(α(n))
     */
    find(x) {
        if (x < 0 || x >= this.n) {
            throw new Error(`Element ${x} is out of range [0, ${this.n - 1}]`);
        }

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
     *
     * 核心思想：
     * 合并时保持权重关系的一致性
     * w表示weight[x] - weight[y] = w的关系
     *
     * @param {number} x - 第一个元素
     * @param {number} y - 第二个元素
     * @param {number} w - x到y的权重差
     * @returns {boolean} 是否成功合并或权重关系一致
     * @time O(α(n))
     * @space O(1)
     */
    union(x, y, w) {
        const rootX = this.find(x);
        const rootY = this.find(y);

        if (rootX === rootY) {
            // 检查权重关系是否一致
            return Math.abs((this.weight[x] - this.weight[y]) - w) < 1e-9;
        }

        // 合并两个集合，保持权重关系
        this.parent[rootY] = rootX;
        this.weight[rootY] = this.weight[x] - this.weight[y] - w;
        this.count--;
        return true;
    }

    /**
     * 查询两点间的权重差
     *
     * @param {number} x - 第一个元素
     * @param {number} y - 第二个元素
     * @returns {number|null} 权重差，如果不连通返回null
     * @time O(α(n))
     * @space O(1)
     */
    diff(x, y) {
        if (this.find(x) !== this.find(y)) {
            return null;  // 不在同一集合中
        }
        return this.weight[x] - this.weight[y];
    }

    /**
     * 检查两个元素是否在同一个集合中
     *
     * @param {number} x - 第一个元素
     * @param {number} y - 第二个元素
     * @returns {boolean} 是否连通
     */
    isConnected(x, y) {
        return this.find(x) === this.find(y);
    }

    /**
     * 获取连通分量的数量
     *
     * @returns {number} 连通分量数量
     */
    getCount() {
        return this.count;
    }
}

// ============================= 3. 动态集合类 =============================

/**
 * 动态集合
 *
 * 核心思想：
 * 支持任意类型元素的并查集操作
 * 内部使用索引映射，对外提供元素级别的接口
 *
 * @class DynamicSets
 */
class DynamicSets {
    /**
     * 创建动态集合
     * @param {Array} elements - 初始元素数组
     */
    constructor(elements = []) {
        this.elementToIndex = new Map();
        this.indexToElement = new Map();
        this.nextIndex = 0;

        // 为初始元素分配索引
        for (const element of elements) {
            this.addElement(element);
        }

        this.uf = new UnionFind(this.nextIndex);
    }

    /**
     * 添加新元素
     *
     * @param {*} element - 要添加的元素
     * @returns {number} 分配的索引
     */
    addElement(element) {
        if (this.elementToIndex.has(element)) {
            return this.elementToIndex.get(element);
        }

        const index = this.nextIndex++;
        this.elementToIndex.set(element, index);
        this.indexToElement.set(index, element);

        // 扩展并查集
        if (index >= this.uf.n) {
            const newUF = new UnionFind(index + 1);
            // 复制现有状态
            for (let i = 0; i < this.uf.n; i++) {
                newUF.parent[i] = this.uf.parent[i];
                newUF.rank[i] = this.uf.rank[i];
                newUF.size[i] = this.uf.size[i];
            }
            newUF.count = this.uf.count + (index + 1 - this.uf.n);
            this.uf = newUF;
        }

        return index;
    }

    /**
     * 合并两个元素所在的集合
     *
     * @param {*} a - 第一个元素
     * @param {*} b - 第二个元素
     * @returns {boolean} 是否成功合并
     */
    union(a, b) {
        const indexA = this.elementToIndex.get(a);
        const indexB = this.elementToIndex.get(b);

        if (indexA === undefined || indexB === undefined) {
            throw new Error('Element not found in the set');
        }

        return this.uf.union(indexA, indexB);
    }

    /**
     * 检查两个元素是否在同一集合
     *
     * @param {*} a - 第一个元素
     * @param {*} b - 第二个元素
     * @returns {boolean} 是否连通
     */
    isConnected(a, b) {
        const indexA = this.elementToIndex.get(a);
        const indexB = this.elementToIndex.get(b);

        if (indexA === undefined || indexB === undefined) {
            return false;
        }

        return this.uf.isConnected(indexA, indexB);
    }

    /**
     * 获取元素所在集合的所有元素
     *
     * @param {*} element - 目标元素
     * @returns {Array} 集合中的所有元素
     */
    getSet(element) {
        const index = this.elementToIndex.get(element);
        if (index === undefined) {
            throw new Error('Element not found in the set');
        }

        const root = this.uf.find(index);
        const result = [];

        for (let i = 0; i < this.uf.n; i++) {
            if (this.indexToElement.has(i) && this.uf.find(i) === root) {
                result.push(this.indexToElement.get(i));
            }
        }

        return result;
    }

    /**
     * 获取元素所在集合的大小
     *
     * @param {*} element - 目标元素
     * @returns {number} 集合大小
     */
    getSetSize(element) {
        const index = this.elementToIndex.get(element);
        if (index === undefined) {
            throw new Error('Element not found in the set');
        }

        return this.uf.getSize(index);
    }

    /**
     * 获取所有集合
     *
     * @returns {Array<Array>} 所有集合的数组
     */
    getAllSets() {
        const indexComponents = this.uf.getAllComponents();
        return indexComponents.map(component =>
            component.map(index => this.indexToElement.get(index))
        );
    }

    /**
     * 获取集合数量
     *
     * @returns {number} 集合数量
     */
    getSetCount() {
        return this.uf.getCount();
    }

    /**
     * 检查元素是否存在
     *
     * @param {*} element - 要检查的元素
     * @returns {boolean} 是否存在
     */
    hasElement(element) {
        return this.elementToIndex.has(element);
    }

    /**
     * 获取所有元素
     *
     * @returns {Array} 所有元素的数组
     */
    getAllElements() {
        return Array.from(this.elementToIndex.keys());
    }
}

// ============================= 4. 应用实例类 =============================

/**
 * 社交网络连接分析
 *
 * 核心思想：
 * 使用并查集分析社交网络中的朋友圈和社群结构
 * 支持动态添加好友关系和查询社群信息
 */
class SocialNetwork {
    constructor() {
        this.users = new DynamicSets();
        this.friendships = [];
    }

    /**
     * 添加用户
     * @param {string} userId - 用户ID
     */
    addUser(userId) {
        this.users.addElement(userId);
    }

    /**
     * 添加好友关系
     * @param {string} user1 - 用户1
     * @param {string} user2 - 用户2
     */
    addFriendship(user1, user2) {
        if (!this.users.hasElement(user1)) {
            this.addUser(user1);
        }
        if (!this.users.hasElement(user2)) {
            this.addUser(user2);
        }

        if (this.users.union(user1, user2)) {
            this.friendships.push([user1, user2]);
        }
    }

    /**
     * 检查两个用户是否在同一朋友圈
     * @param {string} user1 - 用户1
     * @param {string} user2 - 用户2
     * @returns {boolean} 是否在同一朋友圈
     */
    areInSameFriendCircle(user1, user2) {
        return this.users.isConnected(user1, user2);
    }

    /**
     * 获取用户的朋友圈
     * @param {string} userId - 用户ID
     * @returns {Array<string>} 朋友圈中的所有用户
     */
    getFriendCircle(userId) {
        return this.users.getSet(userId);
    }

    /**
     * 获取朋友圈数量
     * @returns {number} 朋友圈数量
     */
    getFriendCircleCount() {
        return this.users.getSetCount();
    }

    /**
     * 获取最大朋友圈大小
     * @returns {number} 最大朋友圈大小
     */
    getLargestFriendCircleSize() {
        const circles = this.users.getAllSets();
        return Math.max(...circles.map(circle => circle.length));
    }

    /**
     * 获取网络统计信息
     * @returns {Object} 统计信息
     */
    getNetworkStats() {
        const circles = this.users.getAllSets();
        const sizes = circles.map(circle => circle.length);

        return {
            totalUsers: this.users.getAllElements().length,
            totalFriendships: this.friendships.length,
            friendCircles: circles.length,
            averageCircleSize: sizes.reduce((sum, size) => sum + size, 0) / sizes.length,
            largestCircleSize: Math.max(...sizes),
            smallestCircleSize: Math.min(...sizes)
        };
    }
}

/**
 * 网络连通性分析
 *
 * 核心思想：
 * 使用并查集分析网络的连通性和故障恢复
 * 支持动态添加/删除连接和查询连通性
 */
class NetworkConnectivity {
    constructor(nodeCount) {
        this.nodeCount = nodeCount;
        this.uf = new UnionFind(nodeCount);
        this.connections = [];
        this.history = [];
    }

    /**
     * 添加连接
     * @param {number} node1 - 节点1
     * @param {number} node2 - 节点2
     * @returns {boolean} 是否是新的连接
     */
    addConnection(node1, node2) {
        const wasConnected = this.uf.isConnected(node1, node2);
        const added = this.uf.union(node1, node2);

        if (added) {
            this.connections.push([node1, node2]);
        }

        this.history.push({
            operation: 'add',
            nodes: [node1, node2],
            success: added,
            componentsBefore: wasConnected ? this.uf.getCount() + 1 : this.uf.getCount() + 1,
            componentsAfter: this.uf.getCount()
        });

        return added;
    }

    /**
     * 检查网络是否完全连通
     * @returns {boolean} 是否完全连通
     */
    isFullyConnected() {
        return this.uf.getCount() === 1;
    }

    /**
     * 获取连通分量数量
     * @returns {number} 连通分量数量
     */
    getComponentCount() {
        return this.uf.getCount();
    }

    /**
     * 获取最大连通分量大小
     * @returns {number} 最大连通分量大小
     */
    getLargestComponentSize() {
        const components = this.uf.getAllComponents();
        return Math.max(...components.map(comp => comp.length));
    }

    /**
     * 计算网络的连通性指标
     * @returns {Object} 连通性指标
     */
    getConnectivityMetrics() {
        const components = this.uf.getAllComponents();
        const sizes = components.map(comp => comp.length);

        return {
            nodeCount: this.nodeCount,
            connectionCount: this.connections.length,
            componentCount: components.length,
            largestComponentSize: Math.max(...sizes),
            largestComponentRatio: Math.max(...sizes) / this.nodeCount,
            averageComponentSize: this.nodeCount / components.length,
            isFullyConnected: this.isFullyConnected(),
            connectivityDensity: this.connections.length / (this.nodeCount * (this.nodeCount - 1) / 2)
        };
    }

    /**
     * 模拟故障恢复过程
     * @param {Array<Array<number>>} failedConnections - 失败的连接
     * @returns {Array<Object>} 恢复过程的统计
     */
    simulateFailureRecovery(failedConnections) {
        const results = [];

        for (const [node1, node2] of failedConnections) {
            const beforeComponents = this.uf.getCount();
            const added = this.addConnection(node1, node2);
            const afterComponents = this.uf.getCount();

            results.push({
                connection: [node1, node2],
                wasNewConnection: added,
                componentReduction: beforeComponents - afterComponents,
                totalComponents: afterComponents
            });
        }

        return results;
    }
}

// ============================= 5. 测试和使用示例 =============================

/**
 * 创建测试用的并查集
 */
function createTestUnionFind() {
    const uf = new UnionFind(10);
    // 创建一些连接：{0,1,2}, {3,4}, {5,6,7,8}, {9}
    uf.union(0, 1);
    uf.union(1, 2);
    uf.union(3, 4);
    uf.union(5, 6);
    uf.union(6, 7);
    uf.union(7, 8);
    return uf;
}

/**
 * 测试基础并查集功能
 */
function testBasicUnionFind() {
    console.log("=== 基础并查集测试 ===");

    const uf = new UnionFind(8);
    console.log("初始状态:", uf.toString());

    // 测试合并操作
    console.log("合并 (0,1):", uf.union(0, 1));
    console.log("合并 (2,3):", uf.union(2, 3));
    console.log("合并 (0,2):", uf.union(0, 2));  // 现在 {0,1,2,3} 连通
    console.log("当前状态:", uf.toString());

    // 测试查询操作
    console.log("0和3是否连通:", uf.isConnected(0, 3));  // true
    console.log("0和4是否连通:", uf.isConnected(0, 4));  // false

    // 测试集合大小
    console.log("元素0所在集合大小:", uf.getSize(0));     // 4
    console.log("元素4所在集合大小:", uf.getSize(4));     // 1

    // 测试统计信息
    console.log("统计信息:", uf.getStatistics());
}

/**
 * 测试加权并查集
 */
function testWeightedUnionFind() {
    console.log("\n=== 加权并查集测试 ===");

    const wuf = new WeightedUnionFind(5);

    // 建立权重关系：a - b = 3, b - c = 2, c - d = 1
    console.log("建立 a - b = 3:", wuf.union(0, 1, 3));
    console.log("建立 b - c = 2:", wuf.union(1, 2, 2));
    console.log("建立 c - d = 1:", wuf.union(2, 3, 1));

    // 查询权重关系
    console.log("a - c =", wuf.diff(0, 2));  // 应该是 5 (3 + 2)
    console.log("a - d =", wuf.diff(0, 3));  // 应该是 6 (3 + 2 + 1)
    console.log("b - d =", wuf.diff(1, 3));  // 应该是 3 (2 + 1)

    // 测试不一致的关系
    console.log("尝试建立 a - c = 4 (不一致):", wuf.union(0, 2, 4));  // 应该返回false
    console.log("验证 a - c = 5 (一致):", wuf.union(0, 2, 5));        // 应该返回true
}

/**
 * 测试动态集合
 */
function testDynamicSets() {
    console.log("\n=== 动态集合测试 ===");

    const sets = new DynamicSets(['A', 'B', 'C', 'D', 'E']);
    console.log("初始元素:", sets.getAllElements());

    // 测试合并操作
    console.log("合并 A 和 B:", sets.union('A', 'B'));
    console.log("合并 C 和 D:", sets.union('C', 'D'));
    console.log("合并 B 和 C:", sets.union('B', 'C'));

    // 测试查询操作
    console.log("A 和 D 是否连通:", sets.isConnected('A', 'D'));  // true
    console.log("A 和 E 是否连通:", sets.isConnected('A', 'E'));  // false

    // 测试集合操作
    console.log("A 所在的集合:", sets.getSet('A'));
    console.log("所有集合:", sets.getAllSets());

    // 动态添加元素
    sets.addElement('F');
    sets.union('E', 'F');
    console.log("添加 F 并与 E 合并后的所有集合:", sets.getAllSets());
}

/**
 * 测试社交网络应用
 */
function testSocialNetwork() {
    console.log("\n=== 社交网络测试 ===");

    const network = new SocialNetwork();

    // 添加用户和好友关系
    const users = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank'];
    users.forEach(user => network.addUser(user));

    // 建立好友关系
    network.addFriendship('Alice', 'Bob');
    network.addFriendship('Bob', 'Charlie');
    network.addFriendship('David', 'Eve');

    console.log("Alice 的朋友圈:", network.getFriendCircle('Alice'));
    console.log("Alice 和 Charlie 在同一朋友圈:", network.areInSameFriendCircle('Alice', 'Charlie'));
    console.log("Alice 和 David 在同一朋友圈:", network.areInSameFriendCircle('Alice', 'David'));

    console.log("朋友圈数量:", network.getFriendCircleCount());
    console.log("最大朋友圈大小:", network.getLargestFriendCircleSize());
    console.log("网络统计:", network.getNetworkStats());
}

/**
 * 测试网络连通性
 */
function testNetworkConnectivity() {
    console.log("\n=== 网络连通性测试 ===");

    const network = new NetworkConnectivity(6);

    // 添加连接
    network.addConnection(0, 1);
    network.addConnection(1, 2);
    network.addConnection(3, 4);

    console.log("当前连通分量数:", network.getComponentCount());
    console.log("网络是否完全连通:", network.isFullyConnected());

    // 添加更多连接
    network.addConnection(2, 3);  // 连接两个分量
    console.log("连接后的分量数:", network.getComponentCount());

    console.log("连通性指标:", network.getConnectivityMetrics());

    // 模拟故障恢复
    const failedConnections = [[4, 5], [0, 5]];
    const recoveryResults = network.simulateFailureRecovery(failedConnections);
    console.log("故障恢复结果:", recoveryResults);
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const sizes = [1000, 10000, 50000];

    for (const size of sizes) {
        console.log(`\n测试规模: ${size} 个元素`);

        // 测试基础并查集性能
        const uf = new UnionFind(size);

        const startTime = performance.now();

        // 执行大量合并操作
        for (let i = 0; i < size - 1; i++) {
            uf.union(i, i + 1);
        }

        // 执行大量查询操作
        for (let i = 0; i < 1000; i++) {
            const a = Math.floor(Math.random() * size);
            const b = Math.floor(Math.random() * size);
            uf.isConnected(a, b);
        }

        const endTime = performance.now();

        console.log(`执行时间: ${(endTime - startTime).toFixed(2)}ms`);
        console.log(`最终连通分量数: ${uf.getCount()}`);
        console.log(`最大集合大小: ${uf.getSize(0)}`);
    }
}

/**
 * 优化对比测试
 */
function optimizationComparisonTest() {
    console.log("\n=== 优化对比测试 ===");

    const size = 10000;
    const operations = 1000;

    // 测试不同查找方法的性能
    const uf1 = new UnionFind(size);
    const uf2 = new UnionFind(size);

    // 先建立一些连接
    for (let i = 0; i < size - 1; i++) {
        uf1.union(i, i + 1);
        uf2.union(i, i + 1);
    }

    // 测试递归查找性能
    const start1 = performance.now();
    for (let i = 0; i < operations; i++) {
        const x = Math.floor(Math.random() * size);
        uf1.find(x);
    }
    const time1 = performance.now() - start1;

    // 测试迭代查找性能
    const start2 = performance.now();
    for (let i = 0; i < operations; i++) {
        const x = Math.floor(Math.random() * size);
        uf2.findIterative(x);
    }
    const time2 = performance.now() - start2;

    console.log(`递归查找 ${operations} 次: ${time1.toFixed(2)}ms`);
    console.log(`迭代查找 ${operations} 次: ${time2.toFixed(2)}ms`);
    console.log(`性能比较: 迭代比递归${time1 > time2 ? '快' : '慢'} ${Math.abs((time1 - time2) / Math.max(time1, time2) * 100).toFixed(1)}%`);
}

/**
 * 运行所有测试
 */
function runAllTests() {
    console.log("并查集基础实现测试开始...\n");

    testBasicUnionFind();
    testWeightedUnionFind();
    testDynamicSets();
    testSocialNetwork();
    testNetworkConnectivity();
    performanceTest();
    optimizationComparisonTest();

    console.log("\n所有测试完成！");
}

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UnionFind,
        WeightedUnionFind,
        DynamicSets,
        SocialNetwork,
        NetworkConnectivity,
        createTestUnionFind,
        runAllTests
    };
}

// 如果在浏览器环境中运行
if (typeof window !== 'undefined') {
    window.UnionFind = UnionFind;
    window.WeightedUnionFind = WeightedUnionFind;
    window.DynamicSets = DynamicSets;
    window.SocialNetwork = SocialNetwork;
    window.NetworkConnectivity = NetworkConnectivity;
    window.runUnionFindTests = runAllTests;
}

// 自动运行测试（如果直接执行此文件）
if (typeof require !== 'undefined' && require.main === module) {
    runAllTests();
}