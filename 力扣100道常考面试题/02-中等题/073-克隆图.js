/**
 * LeetCode 133. 克隆图
 *
 * 问题描述：
 * 给你无向连通图中一个节点的引用，请你返回该图的深拷贝（克隆）。
 * 图中的每个节点都包含它的值 val（int） 和其邻居的列表（list[Node]）。
 *
 * 核心思想：
 * 深度优先搜索 + 哈希表缓存
 * 使用哈希表避免重复创建节点，处理图中的环
 *
 * 关键洞察：
 * 1. 图的克隆需要处理环形结构，避免无限递归
 * 2. 使用哈希表缓存已创建的节点，一个节点只创建一次
 * 3. 先创建节点，再建立邻居关系，避免循环依赖
 * 4. DFS和BFS都可以解决，关键是维护访问记录
 *
 * 示例：
 * 输入：adjList = [[2,4],[1,3],[2,4],[1,3]]
 * 输出：[[2,4],[1,3],[2,4],[1,3]]
 */

// 图节点定义
class Node {
    constructor(val, neighbors = []) {
        this.val = val;
        this.neighbors = neighbors;
    }
}

/**
 * 方法一：深度优先搜索（DFS）+ 哈希表 - 推荐解法
 *
 * 核心思想：
 * 1. 使用哈希表记录已经创建的节点副本，避免重复创建
 * 2. 对于每个节点，先创建副本，再递归克隆其邻居
 * 3. 如果邻居已经被克隆过，直接从哈希表获取
 * 4. 使用DFS遍历所有可达的节点
 *
 * 算法步骤：
 * 1. 创建哈希表存储原节点到克隆节点的映射
 * 2. 对当前节点创建克隆副本并存入哈希表
 * 3. 递归克隆所有邻居节点
 * 4. 建立克隆节点之间的邻居关系
 *
 * @param {Node} node - 原图中的一个节点
 * @return {Node} - 克隆图中对应的节点
 * @time O(V+E) - V是节点数，E是边数，每个节点和边都访问一次
 * @space O(V) - 哈希表空间和递归栈空间
 */
function cloneGraph(node) {
    if (!node) {
        return null;
    }

    // 哈希表：原节点 -> 克隆节点
    const cloneMap = new Map();

    /**
     * DFS递归克隆节点
     * @param {Node} originalNode - 原始节点
     * @return {Node} - 克隆节点
     */
    function dfs(originalNode) {
        // 如果节点已经被克隆过，直接返回克隆节点
        if (cloneMap.has(originalNode)) {
            return cloneMap.get(originalNode);
        }

        // 创建当前节点的克隆
        const clonedNode = new Node(originalNode.val);
        cloneMap.set(originalNode, clonedNode);

        // 递归克隆所有邻居节点
        for (const neighbor of originalNode.neighbors) {
            clonedNode.neighbors.push(dfs(neighbor));
        }

        return clonedNode;
    }

    return dfs(node);
}

/**
 * 方法二：广度优先搜索（BFS）+ 哈希表
 *
 * 核心思想：
 * 使用队列进行层级遍历，逐层克隆节点
 * 先创建所有节点的副本，再建立邻居关系
 *
 * @param {Node} node - 原图中的一个节点
 * @return {Node} - 克隆图中对应的节点
 * @time O(V+E) - 每个节点和边都访问一次
 * @space O(V) - 队列空间和哈希表空间
 */
function cloneGraphBFS(node) {
    if (!node) {
        return null;
    }

    const cloneMap = new Map();
    const queue = [node];

    // 先创建起始节点的克隆
    cloneMap.set(node, new Node(node.val));

    while (queue.length > 0) {
        const currentNode = queue.shift();
        const clonedCurrentNode = cloneMap.get(currentNode);

        // 处理当前节点的所有邻居
        for (const neighbor of currentNode.neighbors) {
            if (!cloneMap.has(neighbor)) {
                // 如果邻居还没有被克隆，创建克隆并加入队列
                cloneMap.set(neighbor, new Node(neighbor.val));
                queue.push(neighbor);
            }

            // 建立克隆节点之间的邻居关系
            clonedCurrentNode.neighbors.push(cloneMap.get(neighbor));
        }
    }

    return cloneMap.get(node);
}

/**
 * 方法三：迭代深度优先搜索（显式栈）
 *
 * 核心思想：
 * 使用显式栈替代递归，避免递归栈溢出
 * 分两个阶段：创建节点阶段和建立关系阶段
 *
 * @param {Node} node - 原图中的一个节点
 * @return {Node} - 克隆图中对应的节点
 * @time O(V+E) - 每个节点和边都访问一次
 * @space O(V) - 栈空间和哈希表空间
 */
function cloneGraphIterativeDFS(node) {
    if (!node) {
        return null;
    }

    const cloneMap = new Map();
    const stack = [node];
    const visited = new Set();

    // 第一阶段：创建所有节点的克隆
    while (stack.length > 0) {
        const currentNode = stack.pop();

        if (visited.has(currentNode)) {
            continue;
        }
        visited.add(currentNode);

        // 创建当前节点的克隆
        if (!cloneMap.has(currentNode)) {
            cloneMap.set(currentNode, new Node(currentNode.val));
        }

        // 将邻居加入栈中
        for (const neighbor of currentNode.neighbors) {
            if (!visited.has(neighbor)) {
                stack.push(neighbor);
            }
            // 创建邻居的克隆（如果还没有的话）
            if (!cloneMap.has(neighbor)) {
                cloneMap.set(neighbor, new Node(neighbor.val));
            }
        }
    }

    // 第二阶段：建立邻居关系
    visited.clear();
    stack.push(node);

    while (stack.length > 0) {
        const currentNode = stack.pop();

        if (visited.has(currentNode)) {
            continue;
        }
        visited.add(currentNode);

        const clonedCurrentNode = cloneMap.get(currentNode);

        // 建立邻居关系
        for (const neighbor of currentNode.neighbors) {
            clonedCurrentNode.neighbors.push(cloneMap.get(neighbor));

            if (!visited.has(neighbor)) {
                stack.push(neighbor);
            }
        }
    }

    return cloneMap.get(node);
}

// ==================== 辅助函数 ====================

/**
 * 根据邻接表创建图
 * @param {number[][]} adjList - 邻接表
 * @return {Node|null} - 图的第一个节点
 */
function createGraph(adjList) {
    if (!adjList || adjList.length === 0) {
        return null;
    }

    // 创建所有节点
    const nodes = [];
    for (let i = 0; i < adjList.length; i++) {
        nodes[i] = new Node(i + 1); // 节点值从1开始
    }

    // 建立邻居关系
    for (let i = 0; i < adjList.length; i++) {
        for (const neighborVal of adjList[i]) {
            nodes[i].neighbors.push(nodes[neighborVal - 1]); // 邻接表中的值也是从1开始
        }
    }

    return nodes[0]; // 返回第一个节点
}

/**
 * 将图转换为邻接表表示
 * @param {Node} node - 图的起始节点
 * @return {number[][]} - 邻接表
 */
function graphToAdjList(node) {
    if (!node) {
        return [];
    }

    const visited = new Set();
    const nodeList = [];
    const nodeMap = new Map(); // 节点值到索引的映射

    // BFS遍历获取所有节点
    const queue = [node];
    visited.add(node);

    while (queue.length > 0) {
        const currentNode = queue.shift();
        nodeList.push(currentNode);
        nodeMap.set(currentNode.val, nodeList.length - 1);

        for (const neighbor of currentNode.neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                queue.push(neighbor);
            }
        }
    }

    // 构建邻接表
    const adjList = [];
    for (const node of nodeList) {
        const neighbors = node.neighbors.map(neighbor => neighbor.val).sort((a, b) => a - b);
        adjList.push(neighbors);
    }

    return adjList;
}

/**
 * 验证两个图是否结构相同
 * @param {Node} node1 - 第一个图的节点
 * @param {Node} node2 - 第二个图的节点
 * @return {boolean} - 是否相同
 */
function areGraphsEqual(node1, node2) {
    if (!node1 && !node2) return true;
    if (!node1 || !node2) return false;

    const adjList1 = graphToAdjList(node1);
    const adjList2 = graphToAdjList(node2);

    if (adjList1.length !== adjList2.length) return false;

    for (let i = 0; i < adjList1.length; i++) {
        if (adjList1[i].length !== adjList2[i].length) return false;
        for (let j = 0; j < adjList1[i].length; j++) {
            if (adjList1[i][j] !== adjList2[i][j]) return false;
        }
    }

    return true;
}

/**
 * 验证是否为深拷贝（节点对象不同）
 * @param {Node} original - 原始图节点
 * @param {Node} cloned - 克隆图节点
 * @return {boolean} - 是否为深拷贝
 */
function isDeepCopy(original, cloned) {
    if (!original && !cloned) return true;
    if (!original || !cloned) return false;

    const visited = new Set();
    const queue = [[original, cloned]];

    while (queue.length > 0) {
        const [origNode, cloneNode] = queue.shift();

        // 检查是否为不同的对象
        if (origNode === cloneNode) {
            return false; // 是同一个对象，不是深拷贝
        }

        // 检查值是否相同
        if (origNode.val !== cloneNode.val) {
            return false;
        }

        // 检查邻居数量是否相同
        if (origNode.neighbors.length !== cloneNode.neighbors.length) {
            return false;
        }

        // 避免重复检查
        const key = `${origNode.val}-${cloneNode.val}`;
        if (visited.has(key)) {
            continue;
        }
        visited.add(key);

        // 递归检查邻居
        for (let i = 0; i < origNode.neighbors.length; i++) {
            queue.push([origNode.neighbors[i], cloneNode.neighbors[i]]);
        }
    }

    return true;
}

// ==================== 测试用例 ====================

/**
 * 测试函数
 */
function runTests() {
    console.log("=== LeetCode 133. 克隆图 测试 ===\n");

    // 测试用例1：标准4节点图
    console.log("测试用例1：标准4节点图");
    const adjList1 = [[2,4],[1,3],[2,4],[1,3]];
    const graph1 = createGraph(adjList1);

    console.log("原始图邻接表:", JSON.stringify(adjList1));

    const cloned1_1 = cloneGraph(graph1);
    const cloned1_2 = cloneGraphBFS(graph1);
    const cloned1_3 = cloneGraphIterativeDFS(graph1);

    console.log("DFS克隆结果:", JSON.stringify(graphToAdjList(cloned1_1)));
    console.log("BFS克隆结果:", JSON.stringify(graphToAdjList(cloned1_2)));
    console.log("迭代DFS克隆结果:", JSON.stringify(graphToAdjList(cloned1_3)));

    console.log("DFS结构相同:", areGraphsEqual(graph1, cloned1_1));
    console.log("DFS深拷贝验证:", isDeepCopy(graph1, cloned1_1));
    console.log();

    // 测试用例2：单节点图
    console.log("测试用例2：单节点图");
    const adjList2 = [[]];
    const graph2 = createGraph(adjList2);

    console.log("原始图邻接表:", JSON.stringify(adjList2));

    const cloned2 = cloneGraph(graph2);

    console.log("克隆结果:", JSON.stringify(graphToAdjList(cloned2)));
    console.log("结构相同:", areGraphsEqual(graph2, cloned2));
    console.log("深拷贝验证:", isDeepCopy(graph2, cloned2));
    console.log();

    // 测试用例3：空图
    console.log("测试用例3：空图");
    const graph3 = null;
    const cloned3 = cloneGraph(graph3);

    console.log("原始图:", graph3);
    console.log("克隆结果:", cloned3);
    console.log("结果正确:", cloned3 === null);
    console.log();

    // 测试用例4：两节点相互连接
    console.log("测试用例4：两节点相互连接");
    const adjList4 = [[2],[1]];
    const graph4 = createGraph(adjList4);

    console.log("原始图邻接表:", JSON.stringify(adjList4));

    const cloned4 = cloneGraph(graph4);

    console.log("克隆结果:", JSON.stringify(graphToAdjList(cloned4)));
    console.log("结构相同:", areGraphsEqual(graph4, cloned4));
    console.log("深拷贝验证:", isDeepCopy(graph4, cloned4));
    console.log();

    // 测试用例5：复杂图
    console.log("测试用例5：复杂图");
    const adjList5 = [[2,3],[1,3,4],[1,2,4,5],[2,3,5],[3,4]];
    const graph5 = createGraph(adjList5);

    console.log("原始图邻接表:", JSON.stringify(adjList5));

    const cloned5 = cloneGraph(graph5);

    console.log("克隆结果:", JSON.stringify(graphToAdjList(cloned5)));
    console.log("结构相同:", areGraphsEqual(graph5, cloned5));
    console.log("深拷贝验证:", isDeepCopy(graph5, cloned5));
    console.log();
}

// ==================== 性能测试 ====================

/**
 * 性能测试
 */
function performanceTest() {
    console.log("=== 性能测试 ===\n");

    // 生成随机图
    function generateRandomGraph(nodeCount, avgDegree = 3) {
        const adjList = Array.from({length: nodeCount}, () => []);

        for (let i = 0; i < nodeCount; i++) {
            const degree = Math.min(avgDegree + Math.floor(Math.random() * 3) - 1, nodeCount - 1);
            const neighbors = new Set();

            while (neighbors.size < degree) {
                const neighbor = Math.floor(Math.random() * nodeCount);
                if (neighbor !== i) {
                    neighbors.add(neighbor + 1); // 值从1开始
                }
            }

            adjList[i] = Array.from(neighbors).sort((a, b) => a - b);
        }

        // 确保图是连通的
        for (let i = 0; i < nodeCount - 1; i++) {
            if (!adjList[i].includes(i + 2)) {
                adjList[i].push(i + 2);
            }
            if (!adjList[i + 1].includes(i + 1)) {
                adjList[i + 1].push(i + 1);
            }
        }

        // 重新排序
        adjList.forEach(neighbors => neighbors.sort((a, b) => a - b));

        return createGraph(adjList);
    }

    // 性能测试函数
    function testPerformance(method, graph, methodName) {
        const start = performance.now();
        const result = method(graph);
        const end = performance.now();
        return {time: end - start, result};
    }

    const sizes = [50, 100, 200, 500];

    sizes.forEach(size => {
        console.log(`\n测试规模: ${size}个节点`);
        const graph = generateRandomGraph(size);

        // DFS测试
        const perf1 = testPerformance(cloneGraph, graph, "DFS");

        // BFS测试
        const perf2 = testPerformance(cloneGraphBFS, graph, "BFS");

        // 迭代DFS测试（仅小规模）
        if (size <= 200) {
            const perf3 = testPerformance(cloneGraphIterativeDFS, graph, "迭代DFS");

            console.log(`DFS耗时: ${perf1.time.toFixed(2)}ms`);
            console.log(`BFS耗时: ${perf2.time.toFixed(2)}ms`);
            console.log(`迭代DFS耗时: ${perf3.time.toFixed(2)}ms`);

            // 验证结果正确性
            const isCorrect1 = areGraphsEqual(graph, perf1.result);
            const isCorrect2 = areGraphsEqual(graph, perf2.result);
            const isCorrect3 = areGraphsEqual(graph, perf3.result);

            console.log(`DFS正确性: ${isCorrect1}`);
            console.log(`BFS正确性: ${isCorrect2}`);
            console.log(`迭代DFS正确性: ${isCorrect3}`);
        } else {
            console.log(`DFS耗时: ${perf1.time.toFixed(2)}ms`);
            console.log(`BFS耗时: ${perf2.time.toFixed(2)}ms`);
            console.log("迭代DFS跳过（规模过大）");

            const isCorrect1 = areGraphsEqual(graph, perf1.result);
            const isCorrect2 = areGraphsEqual(graph, perf2.result);

            console.log(`DFS正确性: ${isCorrect1}`);
            console.log(`BFS正确性: ${isCorrect2}`);
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
    console.log("│ DFS (推荐)  │   O(V+E)    │    O(V)     │ 代码简洁，递归  │");
    console.log("│ BFS         │   O(V+E)    │    O(V)     │ 层级遍历，迭代  │");
    console.log("│ 迭代DFS     │   O(V+E)    │    O(V)     │ 避免递归栈溢出  │");
    console.log("└─────────────┴─────────────┴─────────────┴────────────────┘");

    console.log("\n注：V是节点数，E是边数");

    console.log("\n算法选择建议：");
    console.log("• 一般情况：推荐DFS递归，代码最简洁");
    console.log("• 大图处理：BFS或迭代DFS，避免栈溢出");
    console.log("• 理解学习：DFS最直观，体现递归思想");

    console.log("\n核心设计思想：");
    console.log("• 哈希表缓存：避免重复创建节点");
    console.log("• 先创建后连接：避免循环依赖");
    console.log("• 处理环形结构：图的特殊性");
    console.log("• 深度拷贝：确保完全独立的副本");
}

// ==================== 可视化演示 ====================

/**
 * 可视化克隆过程
 */
function visualizeCloning() {
    console.log("=== 克隆过程可视化 ===\n");

    // 创建一个简单的图: 1-2-3，1-3
    const node1 = new Node(1);
    const node2 = new Node(2);
    const node3 = new Node(3);

    node1.neighbors = [node2, node3];
    node2.neighbors = [node1, node3];
    node3.neighbors = [node1, node2];

    console.log("原始图结构:");
    console.log("节点1 -> [节点2, 节点3]");
    console.log("节点2 -> [节点1, 节点3]");
    console.log("节点3 -> [节点1, 节点2]");
    console.log();

    // 手动执行DFS克隆过程
    const cloneMap = new Map();
    let step = 1;

    function visualDFS(node, level = 0) {
        const indent = "  ".repeat(level);
        console.log(`${indent}步骤${step++}: 访问节点${node.val}`);

        if (cloneMap.has(node)) {
            console.log(`${indent}  节点${node.val}已存在，返回缓存的克隆`);
            return cloneMap.get(node);
        }

        const clonedNode = new Node(node.val);
        cloneMap.set(node, clonedNode);
        console.log(`${indent}  创建节点${node.val}的克隆`);

        console.log(`${indent}  开始克隆节点${node.val}的邻居:`);
        for (const neighbor of node.neighbors) {
            console.log(`${indent}    克隆邻居节点${neighbor.val}`);
            clonedNode.neighbors.push(visualDFS(neighbor, level + 1));
        }

        console.log(`${indent}  节点${node.val}克隆完成`);
        return clonedNode;
    }

    console.log("开始DFS克隆过程:");
    const clonedGraph = visualDFS(node1);

    console.log("\n克隆完成！");
    console.log("克隆图结构:");
    const adjList = graphToAdjList(clonedGraph);
    adjList.forEach((neighbors, index) => {
        console.log(`节点${index + 1} -> [${neighbors.map(n => `节点${n}`).join(', ')}]`);
    });

    console.log("\n验证结果:");
    console.log("结构相同:", areGraphsEqual(node1, clonedGraph));
    console.log("深拷贝验证:", isDeepCopy(node1, clonedGraph));
}

// 运行测试
if (require.main === module) {
    runTests();
    performanceTest();
    complexityAnalysis();
    visualizeCloning();
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Node,
        cloneGraph,
        cloneGraphBFS,
        cloneGraphIterativeDFS,
        createGraph,
        graphToAdjList,
        areGraphsEqual,
        isDeepCopy
    };
}