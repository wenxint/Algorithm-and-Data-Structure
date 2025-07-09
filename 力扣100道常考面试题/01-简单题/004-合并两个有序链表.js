/**
 * LeetCode 004: 合并两个有序链表 (Merge Two Sorted Lists)
 *
 * 题目描述：
 * 将两个升序链表合并为一个新的升序链表并返回。
 * 新链表是通过拼接给定的两个链表的所有节点组成的。
 *
 * 核心思想：
 * 归并思想 + 双指针技巧 - 类似归并排序中的合并步骤
 *
 * 算法原理：
 * 1. 使用两个指针分别指向两个链表的当前节点
 * 2. 比较两个节点的值，选择较小的节点添加到结果链表
 * 3. 移动对应的指针到下一个节点
 * 4. 重复直到其中一个链表遍历完毕
 * 5. 将剩余的链表直接连接到结果链表末尾
 */

// 链表节点定义（复用之前的定义）
class ListNode {
    constructor(val, next) {
        this.val = val === undefined ? 0 : val;
        this.next = next === undefined ? null : next;
    }
}

/**
 * 解法一：迭代法（推荐）
 *
 * 核心思想：
 * 使用虚拟头节点简化边界处理，双指针逐步比较合并
 *
 * @param {ListNode} list1 - 第一个有序链表
 * @param {ListNode} list2 - 第二个有序链表
 * @returns {ListNode} 合并后的有序链表头节点
 * @time O(m + n) m和n分别是两个链表的长度
 * @space O(1) 只使用常数额外空间
 */
function mergeTwoLists(list1, list2) {
    // 创建虚拟头节点，简化边界条件处理
    const dummy = new ListNode(0);
    let current = dummy;

    // 双指针同时遍历两个链表
    while (list1 !== null && list2 !== null) {
        // 比较当前节点值，选择较小的
        if (list1.val <= list2.val) {
            current.next = list1;  // 连接较小的节点
            list1 = list1.next;    // 移动指针
        } else {
            current.next = list2;
            list2 = list2.next;
        }
        current = current.next;    // 移动结果链表指针
    }

    // 连接剩余的节点（至多有一个链表还有剩余节点）
    current.next = list1 !== null ? list1 : list2;

    // 返回真正的头节点（跳过虚拟头节点）
    return dummy.next;
}

/**
 * 解法二：递归法
 *
 * 核心思想：
 * 将问题分解为：选择当前最小节点 + 递归合并剩余部分
 *
 * @param {ListNode} list1 - 第一个有序链表
 * @param {ListNode} list2 - 第二个有序链表
 * @returns {ListNode} 合并后的有序链表头节点
 * @time O(m + n) 每个节点访问一次
 * @space O(m + n) 递归调用栈深度
 */
function mergeTwoListsRecursive(list1, list2) {
    // 递归终止条件
    if (list1 === null) return list2;
    if (list2 === null) return list1;

    // 比较当前节点，选择较小的作为结果链表的当前节点
    if (list1.val <= list2.val) {
        // list1的当前节点较小，它的next应该是剩余部分的合并结果
        list1.next = mergeTwoListsRecursive(list1.next, list2);
        return list1;
    } else {
        // list2的当前节点较小
        list2.next = mergeTwoListsRecursive(list1, list2.next);
        return list2;
    }
}

/**
 * 解法三：优先队列法（适用于多个链表合并）
 *
 * 核心思想：
 * 使用最小堆维护当前最小的节点，适合扩展到K个链表的合并
 *
 * @param {ListNode} list1 - 第一个有序链表
 * @param {ListNode} list2 - 第二个有序链表
 * @returns {ListNode} 合并后的有序链表头节点
 * @time O((m + n) log 2) = O(m + n) 对于两个链表来说
 * @space O(2) = O(1) 堆大小为常数
 */
function mergeTwoListsPriorityQueue(list1, list2) {
    // 简单实现：使用数组模拟优先队列
    const nodes = [];

    // 将两个链表的所有节点放入数组
    let curr = list1;
    while (curr) {
        nodes.push(curr);
        curr = curr.next;
    }

    curr = list2;
    while (curr) {
        nodes.push(curr);
        curr = curr.next;
    }

    // 如果没有节点，返回null
    if (nodes.length === 0) return null;

    // 按值排序
    nodes.sort((a, b) => a.val - b.val);

    // 重新连接节点
    for (let i = 0; i < nodes.length - 1; i++) {
        nodes[i].next = nodes[i + 1];
    }
    nodes[nodes.length - 1].next = null;

    return nodes[0];
}

// 辅助函数：创建链表
function createLinkedList(arr) {
    if (!arr || arr.length === 0) return null;

    const head = new ListNode(arr[0]);
    let curr = head;

    for (let i = 1; i < arr.length; i++) {
        curr.next = new ListNode(arr[i]);
        curr = curr.next;
    }

    return head;
}

// 辅助函数：链表转数组
function linkedListToArray(head) {
    const result = [];
    let curr = head;

    while (curr) {
        result.push(curr.val);
        curr = curr.next;
    }

    return result;
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 004: 合并两个有序链表 测试 ===\n');

    const testCases = [
        {
            list1: [1, 2, 4],
            list2: [1, 3, 4],
            expected: [1, 1, 2, 3, 4, 4],
            description: '标准用例：两个正常长度的链表'
        },
        {
            list1: [],
            list2: [],
            expected: [],
            description: '边界用例：两个空链表'
        },
        {
            list1: [],
            list2: [0],
            expected: [0],
            description: '边界用例：一个空链表，一个单节点'
        },
        {
            list1: [1, 3, 5],
            list2: [2, 4, 6],
            expected: [1, 2, 3, 4, 5, 6],
            description: '交替情况：两链表值交替出现'
        },
        {
            list1: [1, 1, 1],
            list2: [2, 2, 2],
            expected: [1, 1, 1, 2, 2, 2],
            description: '一个链表的所有值都小于另一个'
        },
        {
            list1: [1, 2, 3],
            list2: [1, 2, 3],
            expected: [1, 1, 2, 2, 3, 3],
            description: '相同值的重复出现'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`list1: [${test.list1.join(', ')}]`);
        console.log(`list2: [${test.list2.join(', ')}]`);

        // 创建三组相同的测试链表
        const l1_iter = createLinkedList(test.list1);
        const l2_iter = createLinkedList(test.list2);
        const l1_rec = createLinkedList(test.list1);
        const l2_rec = createLinkedList(test.list2);
        const l1_pq = createLinkedList(test.list1);
        const l2_pq = createLinkedList(test.list2);

        // 测试迭代法
        const result1 = mergeTwoLists(l1_iter, l2_iter);
        const arr1 = linkedListToArray(result1);
        console.log(`迭代法结果: [${arr1.join(', ')}]`);

        // 测试递归法
        const result2 = mergeTwoListsRecursive(l1_rec, l2_rec);
        const arr2 = linkedListToArray(result2);
        console.log(`递归法结果: [${arr2.join(', ')}]`);

        // 测试优先队列法
        const result3 = mergeTwoListsPriorityQueue(l1_pq, l2_pq);
        const arr3 = linkedListToArray(result3);
        console.log(`优先队列法结果: [${arr3.join(', ')}]`);

        // 验证结果
        const isCorrect = JSON.stringify(arr1) === JSON.stringify(test.expected);
        console.log(`结果验证: ${isCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 可视化演示
function visualDemo() {
    console.log('\n=== 合并链表可视化演示 ===');

    const list1 = createLinkedList([1, 3, 5]);
    const list2 = createLinkedList([2, 4, 6]);

    console.log('初始状态:');
    console.log(`list1: [${linkedListToArray(list1).join(' -> ')}]`);
    console.log(`list2: [${linkedListToArray(list2).join(' -> ')}]`);

    console.log('\n合并过程演示:');
    console.log('步骤1: 比较1和2，选择1 -> result: [1]');
    console.log('步骤2: 比较3和2，选择2 -> result: [1, 2]');
    console.log('步骤3: 比较3和4，选择3 -> result: [1, 2, 3]');
    console.log('步骤4: 比较5和4，选择4 -> result: [1, 2, 3, 4]');
    console.log('步骤5: 比较5和6，选择5 -> result: [1, 2, 3, 4, 5]');
    console.log('步骤6: list1已空，直接连接剩余的6 -> result: [1, 2, 3, 4, 5, 6]');

    // 实际执行合并
    const merged = mergeTwoLists(createLinkedList([1, 3, 5]), createLinkedList([2, 4, 6]));
    console.log(`\n实际结果: [${linkedListToArray(merged).join(' -> ')}]`);
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能对比测试 ===');

    // 生成大规模测试数据
    const size = 50000;
    const list1Data = Array.from({ length: size }, (_, i) => i * 2);      // 偶数
    const list2Data = Array.from({ length: size }, (_, i) => i * 2 + 1);  // 奇数

    console.log(`测试数据规模: 每个链表 ${size} 个节点`);

    // 测试迭代法
    console.time('迭代法');
    const l1_iter = createLinkedList(list1Data);
    const l2_iter = createLinkedList(list2Data);
    const result1 = mergeTwoLists(l1_iter, l2_iter);
    console.timeEnd('迭代法');

    // 测试递归法（小数据量，避免栈溢出）
    if (size <= 5000) {
        console.time('递归法');
        const l1_rec = createLinkedList(list1Data);
        const l2_rec = createLinkedList(list2Data);
        const result2 = mergeTwoListsRecursive(l1_rec, l2_rec);
        console.timeEnd('递归法');
    } else {
        console.log('递归法: 数据量过大，跳过测试（避免栈溢出）');
    }

    // 测试优先队列法
    console.time('优先队列法');
    const l1_pq = createLinkedList(list1Data);
    const l2_pq = createLinkedList(list2Data);
    const result3 = mergeTwoListsPriorityQueue(l1_pq, l2_pq);
    console.timeEnd('优先队列法');

    console.log(`合并后链表长度: ${linkedListToArray(result1).length}`);
}

// 算法复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. 迭代法（推荐）:');
    console.log('   时间复杂度: O(m + n) - 每个节点访问一次');
    console.log('   空间复杂度: O(1) - 只使用常数额外空间');
    console.log('   优点: 效率高，空间占用小，不会栈溢出');
    console.log('   缺点: 代码稍长，需要处理指针操作');

    console.log('\n2. 递归法:');
    console.log('   时间复杂度: O(m + n) - 每个节点访问一次');
    console.log('   空间复杂度: O(m + n) - 递归调用栈深度');
    console.log('   优点: 代码简洁，思路清晰');
    console.log('   缺点: 空间开销大，大数据时可能栈溢出');

    console.log('\n3. 优先队列法:');
    console.log('   时间复杂度: O((m + n) log(m + n)) - 排序时间');
    console.log('   空间复杂度: O(m + n) - 存储所有节点');
    console.log('   优点: 易于扩展到K个链表合并');
    console.log('   缺点: 时间复杂度不是最优');

    console.log('\n推荐解法: 迭代法');
    console.log('理由: 时间空间效率最优，适用于大规模数据');
}

// 扩展到K个链表的合并
function mergeKLists(lists) {
    /**
     * 合并K个有序链表
     *
     * 核心思想：分治法，两两合并
     *
     * @param {ListNode[]} lists - K个有序链表
     * @returns {ListNode} 合并后的链表
     * @time O(n log k) n是所有节点总数，k是链表个数
     * @space O(log k) 递归调用栈
     */
    if (!lists || lists.length === 0) return null;
    if (lists.length === 1) return lists[0];

    // 分治合并
    while (lists.length > 1) {
        const mergedLists = [];

        // 两两配对合并
        for (let i = 0; i < lists.length; i += 2) {
            const l1 = lists[i];
            const l2 = i + 1 < lists.length ? lists[i + 1] : null;
            const merged = mergeTwoLists(l1, l2);
            mergedLists.push(merged);
        }

        lists = mergedLists;
    }

    return lists[0];
}

// 实际应用示例
function practicalApplications() {
    console.log('\n=== 实际应用场景 ===');

    console.log('1. 数据库查询结果合并:');
    console.log('   - 合并多个已排序的查询结果');
    console.log('   - 分布式系统中的数据合并');

    console.log('\n2. 外部排序:');
    console.log('   - 大文件排序时的归并步骤');
    console.log('   - 多路归并排序的核心操作');

    console.log('\n3. 日志文件合并:');
    console.log('   - 按时间戳合并多个日志文件');
    console.log('   - 保持时间顺序的日志分析');

    console.log('\n4. 搜索引擎:');
    console.log('   - 合并多个有序的搜索结果');
    console.log('   - 按相关性分数排序');

    // 示例：合并多个有序数组
    console.log('\n合并K个链表示例:');
    const lists = [
        createLinkedList([1, 4, 5]),
        createLinkedList([1, 3, 4]),
        createLinkedList([2, 6])
    ];

    const merged = mergeKLists(lists);
    console.log(`结果: [${linkedListToArray(merged).join(', ')}]`);
}

// 运行所有测试
if (require.main === module) {
    runTests();
    visualDemo();
    performanceTest();
    complexityAnalysis();
    practicalApplications();
}

// 导出函数供其他模块使用
module.exports = {
    ListNode,
    mergeTwoLists,
    mergeTwoListsRecursive,
    mergeTwoListsPriorityQueue,
    mergeKLists,
    createLinkedList,
    linkedListToArray
};