/**
 * LeetCode 86. 分隔链表
 *
 * 问题描述：
 * 给你一个链表的头节点 head 和一个特定值 x ，请你对链表进行分隔，
 * 使得所有 小于 x 的节点都出现在 大于或等于 x 的节点之前。
 * 你应当 保留 两个分区中每个节点的初始相对位置。
 *
 * 核心思想：
 * 使用两个虚拟头节点分别收集小于x和大于等于x的节点，
 * 最后将两个链表连接起来
 *
 * 示例：
 * 输入：head = [1,4,3,2,5,2], x = 3
 * 输出：[1,2,2,4,3,5]
 */

/**
 * 链表节点定义
 */
class ListNode {
    constructor(val, next) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
}

/**
 * 方法一：双指针分离法
 *
 * 核心思想：
 * 创建两个新链表：
 * - smaller链表：收集所有小于x的节点
 * - larger链表：收集所有大于等于x的节点
 * 最后将smaller链表的尾部连接到larger链表的头部
 *
 * 算法步骤：
 * 1. 创建两个虚拟头节点
 * 2. 遍历原链表，根据节点值分别添加到两个新链表
 * 3. 连接两个链表
 * 4. 返回结果
 *
 * @param {ListNode} head - 链表头节点
 * @param {number} x - 分隔值
 * @returns {ListNode} 分隔后的链表头节点
 * @time O(n) - 需要遍历整个链表
 * @space O(1) - 只使用常数额外空间
 */
function partition(head, x) {
    console.log(`分隔链表，x = ${x}`);

    // 创建两个虚拟头节点
    const smallerHead = new ListNode(0); // 小于x的节点链表
    const largerHead = new ListNode(0);   // 大于等于x的节点链表

    // 分别记录两个链表的当前尾节点
    let smallerTail = smallerHead;
    let largerTail = largerHead;

    let current = head;

    // 遍历原链表
    while (current !== null) {
        console.log(`处理节点: ${current.val}`);

        if (current.val < x) {
            // 将节点添加到smaller链表
            smallerTail.next = current;
            smallerTail = current;
            console.log(`  添加到smaller链表: ${current.val}`);
        } else {
            // 将节点添加到larger链表
            largerTail.next = current;
            largerTail = current;
            console.log(`  添加到larger链表: ${current.val}`);
        }

        current = current.next;
    }

    // 重要：断开larger链表的尾部连接
    largerTail.next = null;

    // 连接两个链表
    smallerTail.next = largerHead.next;

    console.log("分隔完成");
    return smallerHead.next;
}

/**
 * 方法二：原地重排（保持相对顺序）
 *
 * 核心思想：
 * 在原链表上直接操作，通过指针调整来实现分隔
 * 需要特别注意保持节点的相对顺序
 *
 * @param {ListNode} head - 链表头节点
 * @param {number} x - 分隔值
 * @returns {ListNode} 分隔后的链表头节点
 * @time O(n) - 需要遍历整个链表
 * @space O(1) - 只使用常数额外空间
 */
function partitionInPlace(head, x) {
    if (!head || !head.next) return head;

    console.log(`\n原地分隔链表，x = ${x}`);

    // 虚拟头节点
    const dummy = new ListNode(0);
    dummy.next = head;

    // 找到第一个大于等于x的节点的前驱
    let beforeLarge = dummy;
    while (beforeLarge.next && beforeLarge.next.val < x) {
        beforeLarge = beforeLarge.next;
    }

    // 如果所有节点都小于x，直接返回
    if (!beforeLarge.next) {
        return dummy.next;
    }

    let prev = beforeLarge;
    let current = beforeLarge.next;

    // 查找小于x的节点并移动到前面
    while (current) {
        if (current.val < x) {
            // 移动current到beforeLarge后面
            prev.next = current.next;
            current.next = beforeLarge.next;
            beforeLarge.next = current;
            beforeLarge = current;
            current = prev.next;
        } else {
            prev = current;
            current = current.next;
        }
    }

    return dummy.next;
}

// ===========================================
// 辅助函数
// ===========================================

/**
 * 数组转链表
 */
function arrayToList(arr) {
    if (arr.length === 0) return null;

    const head = new ListNode(arr[0]);
    let current = head;

    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }

    return head;
}

/**
 * 链表转数组
 */
function listToArray(head) {
    const result = [];
    let current = head;

    while (current !== null) {
        result.push(current.val);
        current = current.next;
    }

    return result;
}

/**
 * 打印链表
 */
function printList(head, description = "") {
    const arr = listToArray(head);
    console.log(`${description}[${arr.join(' -> ')}]`);
}

// ===========================================
// 测试用例
// ===========================================

/**
 * 测试函数
 */
function runTests() {
    console.log("=".repeat(50));
    console.log("分隔链表算法测试");
    console.log("=".repeat(50));

    const testCases = [
        { arr: [1,4,3,2,5,2], x: 3, expected: [1,2,2,4,3,5] },
        { arr: [2,1], x: 2, expected: [1,2] },
        { arr: [1], x: 2, expected: [1] },
        { arr: [2,1], x: 1, expected: [2,1] },
        { arr: [1,4,3,0,2,5,2], x: 3, expected: [1,0,2,2,4,3,5] },
        { arr: [], x: 1, expected: [] }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`\n--- 测试用例 ${index + 1} ---`);
        console.log(`输入: [${testCase.arr.join(', ')}], x = ${testCase.x}`);
        console.log(`期望: [${testCase.expected.join(', ')}]`);

        // 测试方法一
        const list1 = arrayToList(testCase.arr);
        printList(list1, "原链表: ");
        const result1 = partition(list1, testCase.x);
        const resultArr1 = listToArray(result1);
        printList(result1, "结果1: ");
        console.log(`方法一结果: ${JSON.stringify(resultArr1) === JSON.stringify(testCase.expected) ? '✅' : '❌'}`);

        // 测试方法二
        const list2 = arrayToList(testCase.arr);
        const result2 = partitionInPlace(list2, testCase.x);
        const resultArr2 = listToArray(result2);
        printList(result2, "结果2: ");
        console.log(`方法二结果: ${JSON.stringify(resultArr2) === JSON.stringify(testCase.expected) ? '✅' : '❌'}`);
    });
}

// ===========================================
// 算法演示
// ===========================================

/**
 * 算法演示函数
 */
function demonstrateAlgorithm() {
    console.log("\n" + "=".repeat(50));
    console.log("分隔链表算法演示");
    console.log("=".repeat(50));

    const demoArray = [1, 4, 3, 2, 5, 2];
    const x = 3;
    console.log(`演示链表: [${demoArray.join(' -> ')}]`);
    console.log(`分隔值: ${x}`);

    console.log("\n算法核心思想:");
    console.log("1. 创建两个新链表分别收集小于x和大于等于x的节点");
    console.log("2. 保持原有的相对顺序");
    console.log("3. 最后将两个链表连接起来");

    console.log("\n分隔过程:");
    const list = arrayToList(demoArray);
    const result = partition(list, x);

    console.log("\n时间复杂度：O(n) - 需要遍历整个链表一次");
    console.log("空间复杂度：O(1) - 只使用常数额外空间");
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
    console.log("1. 分隔链表需要保持节点的相对顺序");
    console.log("2. 使用两个虚拟头节点简化边界处理");
    console.log("3. 最后要正确连接两个链表");

    console.log("\n🔧 实现技巧:");
    console.log("1. 创建两个虚拟头节点分别收集不同类型的节点");
    console.log("2. 使用尾指针追踪每个链表的末尾");
    console.log("3. 记得断开larger链表的尾部连接");
    console.log("4. 连接时将smaller链表尾部指向larger链表头部");

    console.log("\n❗ 常见陷阱:");
    console.log("1. 忘记断开larger链表的尾部连接，导致环");
    console.log("2. 相对顺序被破坏");
    console.log("3. 边界情况：空链表、单节点链表");
    console.log("4. 所有节点都小于x或都大于等于x的情况");

    console.log("\n🔗 相关问题:");
    console.log("1. 奇偶链表");
    console.log("2. 分隔数组");
    console.log("3. 快速排序的分区操作");
    console.log("4. 链表排序");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ListNode,
        partition,
        partitionInPlace,
        arrayToList,
        listToArray,
        printList,
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