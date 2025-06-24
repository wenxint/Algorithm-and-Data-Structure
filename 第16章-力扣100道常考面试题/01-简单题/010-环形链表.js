/**
 * LeetCode 141. 环形链表
 *
 * 问题描述：
 * 给你一个链表的头节点 head，判断链表中是否有环。
 * 如果链表中有某个节点，可以通过连续跟踪 next 指针再次到达，则链表中存在环。
 *
 * 核心思想：
 * 使用快慢指针技巧（Floyd判圈算法）：
 * 1. 慢指针每次走一步，快指针每次走两步
 * 2. 如果链表有环，快指针一定会追上慢指针
 * 3. 如果没有环，快指针会先到达链表末尾
 *
 * 示例：
 * 输入：head = [3,2,0,-4], pos = 1 (表示尾节点连接到索引1的节点)
 * 输出：true
 *
 * 输入：head = [1,2], pos = 0
 * 输出：true
 *
 * 输入：head = [1], pos = -1
 * 输出：false
 */

/**
 * 链表节点定义
 */
class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

/**
 * 方法一：快慢指针（Floyd判圈算法）- 推荐
 *
 * 核心思想：
 * 使用两个指针以不同速度遍历链表：
 * - 慢指针每次移动1步
 * - 快指针每次移动2步
 * 如果有环，快指针最终会追上慢指针；如果无环，快指针会先到达末尾
 *
 * @param {ListNode} head - 链表头节点
 * @returns {boolean} 是否存在环
 * @time O(n) 最多遍历链表两遍
 * @space O(1) 只使用两个指针
 */
function hasCycle(head) {
    console.log("=== 环形链表检测（快慢指针） ===");

    if (!head || !head.next) {
        console.log("链表为空或只有一个节点，无环");
        return false;
    }

    let slow = head; // 慢指针
    let fast = head; // 快指针
    let step = 0;

    console.log("开始快慢指针遍历:");
    console.log(`初始状态 - 慢指针: ${slow.val}, 快指针: ${fast.val}`);

    while (fast && fast.next) {
        // 移动指针
        slow = slow.next;      // 慢指针移动1步
        fast = fast.next.next; // 快指针移动2步
        step++;

        console.log(`第${step}步 - 慢指针: ${slow.val}, 快指针: ${fast ? fast.val : 'null'}`);

        // 检查是否相遇
        if (slow === fast) {
            console.log("✅ 快慢指针相遇，存在环！");
            return true;
        }
    }

    console.log("快指针到达末尾，无环");
    return false;
}

/**
 * 方法二：哈希表记录访问节点
 *
 * 核心思想：
 * 遍历链表，用哈希表记录已访问的节点
 * 如果再次访问到相同节点，说明存在环
 *
 * @param {ListNode} head - 链表头节点
 * @returns {boolean} 是否存在环
 * @time O(n) 遍历链表一次
 * @space O(n) 哈希表存储节点
 */
function hasCycleHashSet(head) {
    console.log("\n=== 环形链表检测（哈希表） ===");

    if (!head) {
        console.log("链表为空，无环");
        return false;
    }

    const visited = new Set();
    let current = head;
    let step = 0;

    console.log("开始遍历链表并记录访问节点:");

    while (current) {
        step++;
        console.log(`第${step}步: 访问节点 ${current.val}`);

        // 检查当前节点是否已被访问
        if (visited.has(current)) {
            console.log(`✅ 节点 ${current.val} 已访问过，存在环！`);
            return true;
        }

        // 记录当前节点
        visited.add(current);
        console.log(`  记录节点 ${current.val}, 已访问节点数: ${visited.size}`);

        current = current.next;
    }

    console.log("遍历完成，无环");
    return false;
}

/**
 * 方法三：标记法（修改节点值）
 *
 * 核心思想：
 * 遍历链表时给每个节点打特殊标记
 * 如果遇到已标记的节点，说明存在环
 * 注意：这种方法会修改原链表
 *
 * @param {ListNode} head - 链表头节点
 * @returns {boolean} 是否存在环
 * @time O(n) 遍历链表一次
 * @space O(1) 不使用额外空间
 */
function hasCycleMarking(head) {
    console.log("\n=== 环形链表检测（标记法） ===");

    if (!head) {
        console.log("链表为空，无环");
        return false;
    }

    const MARK = Symbol('visited'); // 特殊标记
    let current = head;
    let step = 0;

    console.log("开始遍历链表并标记访问节点:");

    while (current) {
        step++;
        console.log(`第${step}步: 访问节点 ${current.val}`);

        // 检查是否已标记
        if (current.marked === MARK) {
            console.log(`✅ 节点 ${current.val} 已标记，存在环！`);
            return true;
        }

        // 标记当前节点
        current.marked = MARK;
        console.log(`  标记节点 ${current.val}`);

        current = current.next;
    }

    console.log("遍历完成，无环");
    return false;
}

/**
 * 方法四：JSON序列化检测
 *
 * 核心思想：
 * 尝试将链表转换为JSON字符串
 * 如果有环，JSON.stringify会抛出错误
 *
 * @param {ListNode} head - 链表头节点
 * @returns {boolean} 是否存在环
 * @time O(n) JSON序列化时间
 * @space O(n) 序列化存储空间
 */
function hasCycleJSON(head) {
    console.log("\n=== 环形链表检测（JSON序列化） ===");

    if (!head) {
        console.log("链表为空，无环");
        return false;
    }

    try {
        // 尝试序列化链表
        console.log("尝试序列化链表...");
        JSON.stringify(head);
        console.log("序列化成功，无环");
        return false;
    } catch (error) {
        console.log("✅ 序列化失败（循环引用），存在环！");
        console.log(`错误信息: ${error.message}`);
        return true;
    }
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 创建链表（不带环）
 * @param {number[]} values - 节点值数组
 * @returns {ListNode} 链表头节点
 */
function createLinkedList(values) {
    if (values.length === 0) return null;

    const head = new ListNode(values[0]);
    let current = head;

    for (let i = 1; i < values.length; i++) {
        current.next = new ListNode(values[i]);
        current = current.next;
    }

    return head;
}

/**
 * 创建带环链表
 * @param {number[]} values - 节点值数组
 * @param {number} pos - 环的起始位置（-1表示无环）
 * @returns {ListNode} 链表头节点
 */
function createCyclicList(values, pos) {
    if (values.length === 0) return null;

    const nodes = [];

    // 创建所有节点
    for (const val of values) {
        nodes.push(new ListNode(val));
    }

    // 连接节点
    for (let i = 0; i < nodes.length - 1; i++) {
        nodes[i].next = nodes[i + 1];
    }

    // 如果pos >= 0，创建环
    if (pos >= 0 && pos < nodes.length) {
        nodes[nodes.length - 1].next = nodes[pos];
        console.log(`创建环：尾节点(${values[values.length - 1]}) -> 节点${pos}(${values[pos]})`);
    }

    return nodes[0];
}

/**
 * 打印链表结构（避免无限循环）
 * @param {ListNode} head - 链表头节点
 * @param {number} maxSteps - 最大打印步数
 */
function printList(head, maxSteps = 10) {
    console.log("\n=== 链表结构 ===");

    if (!head) {
        console.log("空链表");
        return;
    }

    const values = [];
    let current = head;
    let step = 0;

    while (current && step < maxSteps) {
        values.push(current.val);
        current = current.next;
        step++;
    }

    if (current) {
        values.push("...(可能有环)");
    }

    console.log(`链表: ${values.join(" -> ")}`);
}

/**
 * 找到环的起始节点（如果存在）
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode|null} 环的起始节点
 */
function detectCycleStart(head) {
    console.log("\n=== 找环的起始节点 ===");

    if (!head || !head.next) {
        console.log("链表太短，无环");
        return null;
    }

    // 第一步：检测是否有环
    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow === fast) {
            console.log("检测到环存在");
            break;
        }
    }

    // 如果没有环
    if (!fast || !fast.next) {
        console.log("无环");
        return null;
    }

    // 第二步：找到环的起始节点
    console.log("寻找环的起始节点...");
    slow = head; // 重置慢指针到头部
    let step = 0;

    while (slow !== fast) {
        console.log(`第${++step}步: 慢指针在 ${slow.val}, 快指针在 ${fast.val}`);
        slow = slow.next;
        fast = fast.next;
    }

    console.log(`✅ 环的起始节点: ${slow.val}`);
    return slow;
}

/**
 * 计算环的长度
 * @param {ListNode} head - 链表头节点
 * @returns {number} 环的长度（0表示无环）
 */
function getCycleLength(head) {
    console.log("\n=== 计算环的长度 ===");

    if (!hasCycle(head)) {
        console.log("无环，长度为0");
        return 0;
    }

    // 找到环中的一个节点
    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow === fast) {
            break;
        }
    }

    // 计算环的长度
    let length = 1;
    let current = slow.next;

    console.log("开始计算环长度...");
    while (current !== slow) {
        length++;
        current = current.next;
        console.log(`第${length}步: 当前节点 ${current.val}`);
    }

    console.log(`✅ 环的长度: ${length}`);
    return length;
}

// ===========================================
// 测试用例
// ===========================================

/**
 * 测试函数
 */
function runTests() {
    console.log("=".repeat(50));
    console.log("环形链表检测算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { values: [3, 2, 0, -4], pos: 1, description: "标准环形链表" },
        { values: [1, 2], pos: 0, description: "两节点环" },
        { values: [1], pos: -1, description: "单节点无环" },
        { values: [1, 2, 3, 4, 5], pos: -1, description: "多节点无环" },
        { values: [1, 2, 3], pos: 2, description: "环在尾部" },
        { values: [], pos: -1, description: "空链表" },
        { values: [1, 2, 3, 4, 5, 6], pos: 3, description: "大环" }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n${"=".repeat(30)}`);
        console.log(`测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`${"=".repeat(30)}`);

        const { values, pos } = testCase;
        console.log(`数组: [${values.join(', ')}], 环位置: ${pos}`);

        // 创建测试链表
        const head = createCyclicList(values, pos);
        const expectedResult = pos >= 0;

        console.log(`期望结果: ${expectedResult ? '有环' : '无环'}`);

        // 打印链表结构
        printList(head);

        // 测试所有方法
        const methods = [
            { name: "快慢指针", func: hasCycle },
            { name: "哈希表", func: hasCycleHashSet }
        ];

        // 注意：标记法和JSON法会修改或影响链表，需要重新创建
        const results = [];

        for (const method of methods) {
            console.log(`\n--- ${method.name}检测 ---`);
            try {
                const result = method.func(head);
                results.push(result);

                const isCorrect = result === expectedResult;
                console.log(`结果: ${result ? '有环' : '无环'}, 期望: ${expectedResult ? '有环' : '无环'}, 正确: ${isCorrect ? '✅' : '❌'}`);
            } catch (error) {
                console.log(`❌ 方法执行失败: ${error.message}`);
                results.push(null);
            }
        }

        // 测试标记法（重新创建链表）
        console.log(`\n--- 标记法检测 ---`);
        const headForMarking = createCyclicList(values, pos);
        try {
            const markingResult = hasCycleMarking(headForMarking);
            results.push(markingResult);
            const isCorrect = markingResult === expectedResult;
            console.log(`结果: ${markingResult ? '有环' : '无环'}, 期望: ${expectedResult ? '有环' : '无环'}, 正确: ${isCorrect ? '✅' : '❌'}`);
        } catch (error) {
            console.log(`❌ 标记法执行失败: ${error.message}`);
            results.push(null);
        }

        // 测试JSON法（重新创建链表）
        console.log(`\n--- JSON序列化检测 ---`);
        const headForJSON = createCyclicList(values, pos);
        try {
            const jsonResult = hasCycleJSON(headForJSON);
            results.push(jsonResult);
            const isCorrect = jsonResult === expectedResult;
            console.log(`结果: ${jsonResult ? '有环' : '无环'}, 期望: ${expectedResult ? '有环' : '无环'}, 正确: ${isCorrect ? '✅' : '❌'}`);
        } catch (error) {
            console.log(`❌ JSON法执行失败: ${error.message}`);
            results.push(null);
        }

        // 检查所有方法结果是否一致
        console.log("\n--- 方法一致性检查 ---");
        const validResults = results.filter(r => r !== null);
        const allSame = validResults.every(result => result === validResults[0]);
        console.log(`所有方法结果一致: ${allSame ? '✅' : '❌'}`);

        // 如果有环，进行更多测试
        if (expectedResult && head) {
            const cycleStart = detectCycleStart(head);
            const cycleLength = getCycleLength(head);
        }
    });
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    // 生成大链表测试用例
    const generateLargeList = (size, hasCycle = false) => {
        const values = Array.from({ length: size }, (_, i) => i + 1);
        const pos = hasCycle ? Math.floor(size / 2) : -1;
        return { values, pos };
    };

    const testCases = [
        generateLargeList(100, false),
        generateLargeList(100, true),
        generateLargeList(1000, false),
        generateLargeList(1000, true),
        generateLargeList(10000, false),
        generateLargeList(10000, true)
    ];

    const methods = [
        { name: '快慢指针', func: hasCycle },
        { name: '哈希表', func: hasCycleHashSet }
    ];

    for (let i = 0; i < testCases.length; i++) {
        const { values, pos } = testCases[i];
        const hasLoop = pos >= 0;

        console.log(`\n测试用例 ${i + 1}: 链表长度 ${values.length}, ${hasLoop ? '有环' : '无环'}`);

        const results = [];

        for (const method of methods) {
            const head = createCyclicList(values, pos);

            const startTime = performance.now();
            const result = method.func(head);
            const endTime = performance.now();

            results.push(result);
            console.log(`${method.name}: ${result ? '有环' : '无环'}, 耗时: ${(endTime - startTime).toFixed(3)}ms`);
        }

        // 检查结果一致性
        const allSame = results.every(result => result === results[0]);
        console.log(`所有方法结果一致: ${allSame ? '✅' : '❌'}`);
    }
}

// ===========================================
// 算法演示
// ===========================================

/**
 * 算法演示函数
 */
function demonstrateAlgorithm() {
    console.log("\n" + "=".repeat(50));
    console.log("环形链表检测算法演示");
    console.log("=".repeat(50));

    console.log("Floyd判圈算法（快慢指针）核心思想：");
    console.log("1. 慢指针每次走1步，快指针每次走2步");
    console.log("2. 如果有环，快指针会在环内追上慢指针");
    console.log("3. 如果无环，快指针会先到达链表末尾");

    // 演示有环的情况
    console.log("\n=== 演示：有环链表 ===");
    const cyclicHead = createCyclicList([3, 2, 0, -4], 1);
    printList(cyclicHead);
    hasCycle(cyclicHead);

    // 演示无环的情况
    console.log("\n=== 演示：无环链表 ===");
    const acyclicHead = createLinkedList([1, 2, 3, 4, 5]);
    printList(acyclicHead);
    hasCycle(acyclicHead);

    console.log("\n算法复杂度对比:");
    console.log("1. 快慢指针: 时间O(n)，空间O(1)，最优解");
    console.log("2. 哈希表: 时间O(n)，空间O(n)，直观易懂");
    console.log("3. 标记法: 时间O(n)，空间O(1)，但会修改原链表");
    console.log("4. JSON序列化: 时间O(n)，空间O(n)，创新思路");

    console.log("\n为什么快指针一定能追上慢指针？");
    console.log("当两个指针都进入环后，每轮迭代快指针都会缩短与慢指针的距离1步");
    console.log("由于环的长度有限，快指针最终必定追上慢指针");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ListNode,
        hasCycle,
        hasCycleHashSet,
        hasCycleMarking,
        hasCycleJSON,
        createLinkedList,
        createCyclicList,
        detectCycleStart,
        getCycleLength,
        runTests,
        performanceTest,
        demonstrateAlgorithm
    };
}

// 如果在浏览器环境中，运行演示
if (typeof window !== 'undefined') {
    runTests();
    demonstrateAlgorithm();
}