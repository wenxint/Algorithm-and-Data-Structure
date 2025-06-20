/**
 * LeetCode 013: 环形链表 (Linked List Cycle)
 *
 * 题目描述：
 * 给你一个链表的头节点 head，判断链表中是否有环。
 *
 * 核心思想：
 * 快慢指针（Floyd判圈算法）- 快指针每次走两步，慢指针每次走一步
 *
 * 算法原理：
 * 1. 如果链表中有环，快指针和慢指针最终会相遇
 * 2. 如果链表中没有环，快指针会先到达链表末尾
 * 3. 时间复杂度O(n)，空间复杂度O(1)
 */

// TODO: 待实现
// 预计包含以下解法：
// 1. 快慢指针法（推荐）
// 2. 哈希表法
// 3. 标记法（修改节点值）
// 解决链表环检测的经典问题

module.exports = {
    // 主要解法将在这里实现
};

// 链表节点定义
class ListNode {
    constructor(val, next) {
        this.val = val === undefined ? 0 : val;
        this.next = next === undefined ? null : next;
    }
}

/**
 * 解法一：快慢指针法（Floyd判圈算法，推荐）
 *
 * 核心思想：
 * 使用两个指针以不同速度遍历链表
 * - 慢指针每次走一步
 * - 快指针每次走两步
 * 如果有环，快指针最终会追上慢指针
 *
 * @param {ListNode} head - 链表头节点
 * @returns {boolean} 是否存在环
 * @time O(n) 最多遍历链表一次
 * @space O(1) 只使用常数额外空间
 */
function hasCycle(head) {
    // 边界条件：空链表或只有一个节点
    if (!head || !head.next) {
        return false;
    }

    let slow = head;      // 慢指针，每次走一步
    let fast = head.next; // 快指针，每次走两步

    // 当快指针能够继续前进时
    while (fast && fast.next) {
        // 如果快慢指针相遇，说明有环
        if (slow === fast) {
            return true;
        }

        // 移动指针
        slow = slow.next;       // 慢指针走一步
        fast = fast.next.next;  // 快指针走两步
    }

    // 快指针到达链表末尾，没有环
    return false;
}

/**
 * 解法二：快慢指针法（同起点版本）
 *
 * 核心思想：
 * 快慢指针从同一起点开始，在循环内部移动指针
 *
 * @param {ListNode} head - 链表头节点
 * @returns {boolean} 是否存在环
 * @time O(n) 最多遍历链表一次
 * @space O(1) 只使用常数额外空间
 */
function hasCycleSameStart(head) {
    if (!head || !head.next) {
        return false;
    }

    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        // 先移动指针，再检查
        slow = slow.next;
        fast = fast.next.next;

        // 检查是否相遇
        if (slow === fast) {
            return true;
        }
    }

    return false;
}

/**
 * 解法三：哈希表法
 *
 * 核心思想：
 * 使用Set记录访问过的节点，如果再次访问到已记录的节点，说明有环
 *
 * @param {ListNode} head - 链表头节点
 * @returns {boolean} 是否存在环
 * @time O(n) 遍历链表一次
 * @space O(n) Set存储访问过的节点
 */
function hasCycleHashSet(head) {
    const visited = new Set();
    let current = head;

    while (current) {
        // 如果当前节点已经访问过，说明有环
        if (visited.has(current)) {
            return true;
        }

        // 记录当前节点
        visited.add(current);
        current = current.next;
    }

    // 到达链表末尾，没有环
    return false;
}

/**
 * 解法四：标记法（会修改原链表）
 *
 * 核心思想：
 * 遍历链表时给每个节点添加一个标记，如果遇到已标记的节点说明有环
 * 注意：这种方法会修改原链表结构
 *
 * @param {ListNode} head - 链表头节点
 * @returns {boolean} 是否存在环
 * @time O(n) 遍历链表一次
 * @space O(1) 只使用常数额外空间
 */
function hasCycleMarking(head) {
    let current = head;

    while (current) {
        // 如果节点已被标记，说明有环
        if (current.visited) {
            return true;
        }

        // 标记当前节点
        current.visited = true;
        current = current.next;
    }

    // 到达链表末尾，没有环
    return false;
}

/**
 * 解法五：递归法（会导致栈溢出，不推荐）
 *
 * 核心思想：
 * 递归遍历链表，使用函数调用栈记录访问路径
 * 注意：如果有环会导致无限递归，实际使用中不推荐
 *
 * @param {ListNode} head - 链表头节点
 * @returns {boolean} 是否存在环
 * @time O(n) 递归深度
 * @space O(n) 递归调用栈
 */
function hasCycleRecursive(head) {
    const visited = new Set();

    function dfs(node) {
        if (!node) return false;
        if (visited.has(node)) return true;

        visited.add(node);
        return dfs(node.next);
    }

    return dfs(head);
}

// 辅助函数：创建带环的链表
function createCycleList(values, cycleIndex = -1) {
    if (!values || values.length === 0) return null;

    const nodes = values.map(val => new ListNode(val));

    // 连接节点
    for (let i = 0; i < nodes.length - 1; i++) {
        nodes[i].next = nodes[i + 1];
    }

    // 如果指定了环的位置，创建环
    if (cycleIndex >= 0 && cycleIndex < nodes.length) {
        nodes[nodes.length - 1].next = nodes[cycleIndex];
    }

    return nodes[0];
}

// 辅助函数：清除节点的访问标记
function clearVisitedMarks(head) {
    const visited = new Set();
    let current = head;

    while (current && !visited.has(current)) {
        visited.add(current);
        delete current.visited;
        current = current.next;
    }
}

// 辅助函数：安全地打印链表（避免环导致的无限循环）
function printListSafely(head, maxNodes = 10) {
    const result = [];
    let current = head;
    let count = 0;

    while (current && count < maxNodes) {
        result.push(current.val);
        current = current.next;
        count++;
    }

    if (current) {
        result.push('...(可能有环)');
    }

    return result.join(' -> ');
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 013: 环形链表 测试 ===\n');

    const testCases = [
        {
            values: [3, 2, 0, -4],
            cycleIndex: 1,
            expected: true,
            description: '标准有环链表：尾节点指向索引1'
        },
        {
            values: [1, 2],
            cycleIndex: 0,
            expected: true,
            description: '简单有环链表：尾节点指向头节点'
        },
        {
            values: [1],
            cycleIndex: -1,
            expected: false,
            description: '单节点无环链表'
        },
        {
            values: [1, 2, 3, 4, 5],
            cycleIndex: -1,
            expected: false,
            description: '多节点无环链表'
        },
        {
            values: [],
            cycleIndex: -1,
            expected: false,
            description: '空链表'
        },
        {
            values: [1, 2, 3, 4, 5],
            cycleIndex: 2,
            expected: true,
            description: '环在中间位置'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`链表值: [${test.values.join(', ')}]`);
        console.log(`环位置: ${test.cycleIndex >= 0 ? `索引${test.cycleIndex}` : '无环'}`);

        // 创建测试链表
        const head1 = createCycleList(test.values, test.cycleIndex);
        const head2 = createCycleList(test.values, test.cycleIndex);
        const head3 = createCycleList(test.values, test.cycleIndex);
        const head4 = createCycleList(test.values, test.cycleIndex);
        const head5 = createCycleList(test.values, test.cycleIndex);

        console.log(`链表结构: ${printListSafely(head1)}`);

        // 测试各种解法
        const result1 = hasCycle(head1);
        const result2 = hasCycleSameStart(head2);
        const result3 = hasCycleHashSet(head3);
        const result4 = hasCycleMarking(head4);
        const result5 = hasCycleRecursive(head5);

        console.log(`快慢指针法结果: ${result1}`);
        console.log(`同起点快慢指针结果: ${result2}`);
        console.log(`哈希表法结果: ${result3}`);
        console.log(`标记法结果: ${result4}`);
        console.log(`递归法结果: ${result5}`);

        // 清理标记
        clearVisitedMarks(head4);

        // 验证结果
        const results = [result1, result2, result3, result4, result5];
        const allCorrect = results.every(result => result === test.expected);
        console.log(`结果验证: ${allCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能测试 ===');

    // 创建大规模链表
    const size = 100000;
    const values = Array.from({ length: size }, (_, i) => i);

    console.log(`测试数据规模: ${size} 个节点`);

    // 测试无环链表
    console.log('\n无环链表测试:');
    const noLoopHead1 = createCycleList(values, -1);
    const noLoopHead2 = createCycleList(values, -1);
    const noLoopHead3 = createCycleList(values, -1);

    console.time('快慢指针法');
    const result1 = hasCycle(noLoopHead1);
    console.timeEnd('快慢指针法');

    console.time('哈希表法');
    const result2 = hasCycleHashSet(noLoopHead2);
    console.timeEnd('哈希表法');

    console.time('标记法');
    const result3 = hasCycleMarking(noLoopHead3);
    console.timeEnd('标记法');

    console.log(`无环链表结果一致: ${result1 === result2 && result2 === result3 ? '✅' : '❌'}`);

    // 测试有环链表
    console.log('\n有环链表测试:');
    const loopHead1 = createCycleList(values, Math.floor(size / 2));
    const loopHead2 = createCycleList(values, Math.floor(size / 2));
    const loopHead3 = createCycleList(values, Math.floor(size / 2));

    console.time('快慢指针法');
    const result4 = hasCycle(loopHead1);
    console.timeEnd('快慢指针法');

    console.time('哈希表法');
    const result5 = hasCycleHashSet(loopHead2);
    console.timeEnd('哈希表法');

    console.time('标记法');
    const result6 = hasCycleMarking(loopHead3);
    console.timeEnd('标记法');

    console.log(`有环链表结果一致: ${result4 === result5 && result5 === result6 ? '✅' : '❌'}`);
}

// Floyd判圈算法详解
function floydAlgorithmDemo() {
    console.log('\n=== Floyd判圈算法详解 ===');

    console.log('算法核心思想：');
    console.log('1. 使用快慢两个指针，慢指针每次走1步，快指针每次走2步');
    console.log('2. 如果链表中有环，快指针最终会追上慢指针');
    console.log('3. 如果链表中没有环，快指针会先到达NULL');
    console.log('');

    console.log('数学证明（为什么快指针一定能追上慢指针）：');
    console.log('- 设环的长度为C，慢指针进入环时，快指针在环中位置为K');
    console.log('- 每次移动后，快指针相对慢指针前进1步');
    console.log('- 最多经过C次移动，快指针就能追上慢指针');
    console.log('');

    console.log('时间复杂度分析：');
    console.log('- 无环情况：O(n)，快指针最多走n/2步到达末尾');
    console.log('- 有环情况：O(n)，慢指针最多走n步进入环，然后最多再走环长度的步数');
    console.log('');

    console.log('空间复杂度：O(1)，只使用两个指针变量');
}

// 复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. 快慢指针法（推荐）:');
    console.log('   时间复杂度: O(n) - 最多遍历链表一次');
    console.log('   空间复杂度: O(1) - 只使用两个指针变量');
    console.log('   优点: 空间效率最优，算法经典');
    console.log('   缺点: 理解稍复杂');
    console.log('');

    console.log('2. 哈希表法:');
    console.log('   时间复杂度: O(n) - 遍历链表一次');
    console.log('   空间复杂度: O(n) - Set存储访问过的节点');
    console.log('   优点: 思路直观，容易理解和实现');
    console.log('   缺点: 需要额外的存储空间');
    console.log('');

    console.log('3. 标记法:');
    console.log('   时间复杂度: O(n) - 遍历链表一次');
    console.log('   空间复杂度: O(1) - 只在原节点上添加标记');
    console.log('   优点: 空间复杂度低');
    console.log('   缺点: 会修改原链表结构，实际应用中不推荐');
    console.log('');

    console.log('4. 递归法:');
    console.log('   时间复杂度: O(n) - 递归深度');
    console.log('   空间复杂度: O(n) - 递归调用栈');
    console.log('   缺点: 有环时会导致栈溢出，不实用');
}

// 扩展应用
function extendedApplications() {
    console.log('\n=== 扩展应用 ===');

    console.log('1. 环形链表II - 找到环的起始节点:');
    console.log('   在检测到环后，使用数学方法找到环的入口点');
    console.log('   需要额外的指针移动步骤');
    console.log('');

    console.log('2. 快乐数问题:');
    console.log('   数字各位平方和的计算过程可能形成环');
    console.log('   使用Floyd算法检测是否进入循环');
    console.log('');

    console.log('3. 前端应用场景:');
    console.log('   - 检测对象引用循环（防止JSON.stringify报错）');
    console.log('   - 检测依赖关系中的循环依赖');
    console.log('   - 游戏开发中的路径循环检测');
    console.log('   - 数据结构验证和调试');
    console.log('');

    console.log('4. 算法变种:');
    console.log('   - 检测有向图中的环');
    console.log('   - 检测重复序列模式');
    console.log('   - 周期性检测算法');
}

// 运行测试
if (require.main === module) {
    runTests();
    performanceTest();
    floydAlgorithmDemo();
    complexityAnalysis();
    extendedApplications();
}