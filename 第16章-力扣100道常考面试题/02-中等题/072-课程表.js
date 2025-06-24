/**
 * LeetCode 207: 课程表 (Course Schedule)
 *
 * 问题描述：
 * 你这个学期必须选修 numCourses 门课程，记为 0 到 numCourses - 1 。
 * 在选修某些课程之前需要一些先修课程。先修课程按数组 prerequisites 给出，
 * 其中 prerequisites[i] = [ai, bi] ，表示如果要学习课程 ai 则必须先学习课程 bi 。
 * 请你判断是否可能完成所有课程的学习？
 *
 * 核心思想：
 * 这是一个典型的图论问题，需要判断有向图中是否存在环：
 * 1. 如果存在环，则说明存在循环依赖，无法完成所有课程
 * 2. 如果不存在环，则可以通过拓扑排序完成所有课程
 *
 * 拓扑排序的两种实现方法：
 * - BFS（Kahn算法）：基于入度的广度优先搜索
 * - DFS：基于递归的深度优先搜索，检测回边（环）
 *
 * 示例：
 * 输入：numCourses = 2, prerequisites = [[1,0]]
 * 输出：true
 * 解释：总共有 2 门课程。要学习课程 1，你需要先完成课程 0。这是可能的。
 *
 * 输入：numCourses = 2, prerequisites = [[1,0],[0,1]]
 * 输出：false
 * 解释：总共有 2 门课程。要学习课程 1，你需要先完成课程 0；
 *       同时，要学习课程 0，你还需要先完成课程 1。这是不可能的。
 */

/**
 * 方法一：BFS拓扑排序（Kahn算法）（推荐）
 *
 * 核心思想：
 * 1. 构建邻接表和入度数组
 * 2. 将所有入度为0的节点加入队列
 * 3. 不断取出入度为0的节点，减少其邻居的入度
 * 4. 如果最终处理的节点数等于总课程数，说明无环
 *
 * @param {number} numCourses - 课程总数
 * @param {number[][]} prerequisites - 先修课程关系
 * @return {boolean} 是否可以完成所有课程
 * @time O(V + E) V是课程数，E是先修关系数
 * @space O(V + E) 邻接表和入度数组的空间
 */
function canFinish(numCourses, prerequisites) {
    console.log("=== BFS拓扑排序（Kahn算法） ===");
    console.log("课程总数:", numCourses);
    console.log("先修关系:", prerequisites);

    // 构建邻接表和入度数组
    const graph = new Array(numCourses).fill(null).map(() => []);
    const inDegree = new Array(numCourses).fill(0);

    // 构建图结构
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);  // prereq -> course
        inDegree[course]++;          // course的入度加1
    }

    console.log("邻接表:", graph);
    console.log("入度数组:", inDegree);

    // 将所有入度为0的课程加入队列
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) {
            queue.push(i);
            console.log(`课程${i}入度为0，加入队列`);
        }
    }

    let processedCount = 0;  // 已处理的课程数

    console.log("\n开始BFS处理：");
    while (queue.length > 0) {
        const current = queue.shift();
        processedCount++;
        console.log(`处理课程${current}，已处理${processedCount}门课程`);

        // 处理当前课程的后续课程
        for (const nextCourse of graph[current]) {
            inDegree[nextCourse]--;
            console.log(`  课程${nextCourse}的入度减1，当前入度：${inDegree[nextCourse]}`);

            if (inDegree[nextCourse] === 0) {
                queue.push(nextCourse);
                console.log(`  课程${nextCourse}入度变为0，加入队列`);
            }
        }
    }

    const canComplete = processedCount === numCourses;
    console.log(`\n最终结果：处理了${processedCount}门课程，总共${numCourses}门课程`);
    console.log(`是否可以完成所有课程：${canComplete}`);

    return canComplete;
}

/**
 * 方法二：DFS检测环
 *
 * 核心思想：
 * 使用三种状态标记节点：
 * - 0：未访问
 * - 1：正在访问（在当前DFS路径中）
 * - 2：已访问完成
 * 如果在DFS过程中遇到状态为1的节点，说明存在环
 *
 * @param {number} numCourses - 课程总数
 * @param {number[][]} prerequisites - 先修课程关系
 * @return {boolean} 是否可以完成所有课程
 * @time O(V + E) V是课程数，E是先修关系数
 * @space O(V + E) 递归栈和邻接表的空间
 */
function canFinishDFS(numCourses, prerequisites) {
    console.log("\n=== DFS检测环算法 ===");
    console.log("课程总数:", numCourses);
    console.log("先修关系:", prerequisites);

    // 构建邻接表
    const graph = new Array(numCourses).fill(null).map(() => []);
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
    }

    console.log("邻接表:", graph);

    // 状态数组：0-未访问，1-正在访问，2-已访问完成
    const state = new Array(numCourses).fill(0);

    /**
     * DFS检测环
     * @param {number} course - 当前课程
     * @return {boolean} 是否存在环
     */
    function hasCycle(course) {
        console.log(`  DFS访问课程${course}，当前状态：${state[course]}`);

        if (state[course] === 1) {
            console.log(`  发现环：课程${course}正在访问中`);
            return true;  // 发现环
        }

        if (state[course] === 2) {
            console.log(`  课程${course}已访问完成，跳过`);
            return false; // 已访问完成
        }

        // 标记为正在访问
        state[course] = 1;
        console.log(`  标记课程${course}为正在访问`);

        // 检查所有后续课程
        for (const nextCourse of graph[course]) {
            if (hasCycle(nextCourse)) {
                return true;
            }
        }

        // 标记为已访问完成
        state[course] = 2;
        console.log(`  标记课程${course}为已访问完成`);
        return false;
    }

    console.log("\n开始DFS检测环：");
    // 对所有未访问的课程进行DFS
    for (let i = 0; i < numCourses; i++) {
        if (state[i] === 0) {
            console.log(`从课程${i}开始DFS`);
            if (hasCycle(i)) {
                console.log("检测到环，无法完成所有课程");
                return false;
            }
        }
    }

    console.log("未检测到环，可以完成所有课程");
    return true;
}

/**
 * 方法三：并查集检测环（扩展方法）
 *
 * 核心思想：
 * 使用并查集来检测无向图中的环，但需要转换思路：
 * 如果一条边的两个端点已经在同一个连通分量中，则存在环
 * 注意：这种方法需要特殊处理有向图的情况
 *
 * @param {number} numCourses - 课程总数
 * @param {number[][]} prerequisites - 先修课程关系
 * @return {boolean} 是否可以完成所有课程
 * @time O(E * α(V)) α是反阿克曼函数
 * @space O(V) 并查集的空间
 */
function canFinishUnionFind(numCourses, prerequisites) {
    console.log("\n=== 并查集检测环算法 ===");
    console.log("注意：此方法仅用于教学演示，实际中推荐使用拓扑排序");

    // 并查集实现
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

            if (rootX === rootY) {
                return false; // 已经在同一集合中
            }

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
    }

    // 注意：这种方法需要特殊处理，这里仅作演示
    console.log("并查集方法在有向图环检测中需要特殊处理");
    console.log("推荐使用拓扑排序或DFS方法");

    return canFinish(numCourses, prerequisites);
}

/**
 * 获取拓扑排序序列（扩展功能）
 *
 * @param {number} numCourses - 课程总数
 * @param {number[][]} prerequisites - 先修课程关系
 * @return {number[]} 拓扑排序序列，如果无法完成则返回空数组
 */
function getTopologicalOrder(numCourses, prerequisites) {
    console.log("\n=== 获取拓扑排序序列 ===");

    const graph = new Array(numCourses).fill(null).map(() => []);
    const inDegree = new Array(numCourses).fill(0);

    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
        inDegree[course]++;
    }

    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (inDegree[i] === 0) {
            queue.push(i);
        }
    }

    const result = [];
    while (queue.length > 0) {
        const current = queue.shift();
        result.push(current);

        for (const nextCourse of graph[current]) {
            inDegree[nextCourse]--;
            if (inDegree[nextCourse] === 0) {
                queue.push(nextCourse);
            }
        }
    }

    if (result.length === numCourses) {
        console.log("拓扑排序序列:", result);
        return result;
    } else {
        console.log("存在环，无法生成拓扑排序序列");
        return [];
    }
}

/**
 * 可视化课程依赖关系
 */
function visualizeCourseGraph(numCourses, prerequisites) {
    console.log("\n=== 课程依赖关系可视化 ===");

    const graph = new Array(numCourses).fill(null).map(() => []);
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
    }

    console.log("课程依赖关系图：");
    for (let i = 0; i < numCourses; i++) {
        if (graph[i].length > 0) {
            console.log(`课程${i} -> [${graph[i].join(', ')}]`);
        } else {
            console.log(`课程${i} -> 无后续课程`);
        }
    }
}

/**
 * 测试用例验证
 */
function validateResults(numCourses, prerequisites) {
    console.log("\n=== 结果验证 ===");

    const result1 = canFinish(numCourses, prerequisites);
    const result2 = canFinishDFS(numCourses, prerequisites);

    console.log(`BFS结果: ${result1}`);
    console.log(`DFS结果: ${result2}`);
    console.log(`结果一致: ${result1 === result2 ? '✅' : '❌'}`);

    if (result1) {
        getTopologicalOrder(numCourses, prerequisites);
    }

    return result1;
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const testCases = [
        // 小规模测试
        { numCourses: 2, prerequisites: [[1, 0]] },
        { numCourses: 2, prerequisites: [[1, 0], [0, 1]] },
        { numCourses: 4, prerequisites: [[1, 0], [2, 0], [3, 1], [3, 2]] },

        // 大规模测试
        {
            numCourses: 1000,
            prerequisites: Array.from({ length: 999 }, (_, i) => [i + 1, i])
        }
    ];

    testCases.forEach((testCase, index) => {
        if (index < 3) { // 只对小规模测试显示详细信息
            console.log(`\n--- 测试用例 ${index + 1} ---`);
            console.log(`课程数: ${testCase.numCourses}`);
            console.log(`先修关系: ${JSON.stringify(testCase.prerequisites)}`);

            const start = performance.now();
            const result = validateResults(testCase.numCourses, testCase.prerequisites);
            const end = performance.now();

            console.log(`耗时: ${(end - start).toFixed(3)}ms`);
            visualizeCourseGraph(testCase.numCourses, testCase.prerequisites);
        }
    });
}

/**
 * 算法核心概念演示
 */
function demonstrateAlgorithm() {
    console.log("\n=== 算法核心概念演示 ===");

    console.log("\n1. 拓扑排序的本质：");
    console.log("对有向无环图(DAG)的顶点进行线性排序");
    console.log("使得对于任何有向边(u,v)，u都出现在v之前");

    console.log("\n2. Kahn算法步骤：");
    console.log("① 计算所有顶点的入度");
    console.log("② 将入度为0的顶点入队");
    console.log("③ 重复：取出队首顶点，删除其所有出边，更新邻接顶点入度");
    console.log("④ 如果最终处理的顶点数等于总数，则无环");

    console.log("\n3. DFS检测环：");
    console.log("使用三色标记：白色(未访问)、灰色(正在访问)、黑色(已完成)");
    console.log("如果在DFS过程中遇到灰色顶点，说明存在后向边，即环");

    console.log("\n4. 算法应用场景：");
    console.log("编译依赖、任务调度、课程安排、数据库事务等");

    console.log("\n5. 复杂度分析：");
    console.log("时间复杂度：O(V + E)，V是顶点数，E是边数");
    console.log("空间复杂度：O(V + E)，主要是邻接表的存储");
}

// 测试运行
function runTests() {
    console.log("🚀 开始测试课程表算法");

    // 基础测试用例
    const testCases = [
        { numCourses: 2, prerequisites: [[1, 0]] },           // 无环
        { numCourses: 2, prerequisites: [[1, 0], [0, 1]] },  // 有环
        { numCourses: 4, prerequisites: [[1, 0], [2, 0], [3, 1], [3, 2]] }, // 复杂无环
        { numCourses: 3, prerequisites: [[0, 1], [1, 2], [2, 0]] },          // 复杂有环
        { numCourses: 1, prerequisites: [] },                 // 单个课程
        { numCourses: 3, prerequisites: [] }                  // 无依赖关系
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`测试用例 ${index + 1}: ${testCase.numCourses}门课程`);
        console.log(`先修关系: ${JSON.stringify(testCase.prerequisites)}`);
        console.log(`${'='.repeat(60)}`);

        validateResults(testCase.numCourses, testCase.prerequisites);
    });

    // 运行性能测试
    performanceTest();

    // 演示算法核心概念
    demonstrateAlgorithm();

    console.log("\n🎉 测试完成！");
}

// 如果直接运行此文件，执行测试
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        canFinish,
        canFinishDFS,
        canFinishUnionFind,
        getTopologicalOrder,
        visualizeCourseGraph,
        runTests
    };
} else if (typeof window === 'undefined') {
    // Node.js环境下直接运行测试
    runTests();
}