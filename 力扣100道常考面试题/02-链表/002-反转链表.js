/**
 * LeetCode 002: 反转链表 (Reverse Linked List)
 *
 * 题目描述：
 * 给你单链表的头节点 head，请你反转链表，并返回反转后的链表。
 *
 * 核心思想：
 * 指针操作的经典问题 - 通过改变指针指向来实现链表反转
 *
 * 算法原理：
 * 1. 遍历链表，对于每个节点，将其 next 指针指向前一个节点
 * 2. 为了不丢失后续节点，需要在修改指针前先保存下一个节点
 * 3. 使用三个指针：prev(前一个)、curr(当前)、next(下一个)
 * 4. 最终 prev 指向原链表的最后一个节点，即新链表的头节点
 */

// 链表节点定义
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
 * 使用三个指针遍历链表，逐个反转节点的指向
 * - prev: 指向前一个节点（已处理的部分）
 * - curr: 指向当前节点（正在处理）
 * - next: 指向下一个节点（待处理的部分）
 *
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode} 反转后的链表头节点
 * @time O(n) 遍历一次链表
 * @space O(1) 只使用常数个指针
 */
function reverseList(head) {
    // 边界条件：空链表或只有一个节点
    if (!head || !head.next) {
        return head;
    }

    let prev = null;    // 前一个节点，初始为null
    let curr = head;    // 当前节点，从头节点开始

    // 遍历链表，反转每个节点的指向
    while (curr !== null) {
        // 1. 保存下一个节点，防止丢失
        const next = curr.next;

        // 2. 反转当前节点的指向
        curr.next = prev;

        // 3. 移动指针到下一位置
        prev = curr;     // prev 向前移动
        curr = next;     // curr 向前移动
    }

    // 循环结束时，prev 指向原链表的最后一个节点，即新的头节点
    return prev;
}

/**
 * 解法二：递归法
 *
 * 核心思想：
 * 将问题分解为：反转当前节点和反转后续链表两个子问题
 * 1. 递归反转从第二个节点开始的链表
 * 2. 将当前节点接到已反转链表的末尾
 * 3. 返回新的头节点
 *
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode} 反转后的链表头节点
 * @time O(n) 每个节点访问一次
 * @space O(n) 递归调用栈的深度
 */
function reverseListRecursive(head) {
    // 递归终止条件：空节点或只有一个节点
    if (!head || !head.next) {
        return head;
    }

    // 递归反转从 head.next 开始的链表
    // newHead 是反转后链表的新头节点
    const newHead = reverseListRecursive(head.next);

    // 此时 head.next 是原链表中 head 的下一个节点
    // 在反转后的链表中，它应该指向 head
    head.next.next = head;

    // 断开 head 指向原来下一个节点的连接
    head.next = null;

    // 返回新的头节点
    return newHead;
}

/**
 * 解法三：栈辅助法
 *
 * 核心思想：
 * 利用栈的后进先出特性，先将所有节点入栈，然后出栈重新连接
 *
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode} 反转后的链表头节点
 * @time O(n) 遍历两次链表
 * @space O(n) 栈存储所有节点
 */
function reverseListStack(head) {
    if (!head || !head.next) {
        return head;
    }

    const stack = [];
    let curr = head;

    // 将所有节点入栈
    while (curr) {
        stack.push(curr);
        curr = curr.next;
    }

    // 新的头节点是原链表的最后一个节点
    const newHead = stack.pop();
    curr = newHead;

    // 从栈中取出节点，重新连接
    while (stack.length > 0) {
        curr.next = stack.pop();
        curr = curr.next;
    }

    // 最后一个节点的 next 应该为 null
    curr.next = null;

    return newHead;
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

// 辅助函数：打印链表
function printLinkedList(head, name = '链表') {
    const arr = linkedListToArray(head);
    console.log(`${name}: [${arr.join(' -> ')}]`);
}

// 测试用例
function runTests() {
    console.log('=== LeetCode 002: 反转链表 测试 ===\n');

    const testCases = [
        {
            input: [1, 2, 3, 4, 5],
            expected: [5, 4, 3, 2, 1],
            description: '标准用例：5个节点的链表'
        },
        {
            input: [1, 2],
            expected: [2, 1],
            description: '简单用例：2个节点的链表'
        },
        {
            input: [1],
            expected: [1],
            description: '边界用例：单个节点'
        },
        {
            input: [],
            expected: [],
            description: '边界用例：空链表'
        },
        {
            input: [1, 1, 1, 1],
            expected: [1, 1, 1, 1],
            description: '特殊用例：相同值的节点'
        }
    ];

    testCases.forEach((test, index) => {
        console.log(`测试用例 ${index + 1}: ${test.description}`);
        console.log(`输入: [${test.input.join(', ')}]`);

        // 创建三个相同的链表用于测试不同方法
        const list1 = createLinkedList(test.input);
        const list2 = createLinkedList(test.input);
        const list3 = createLinkedList(test.input);

        // 测试迭代法
        const result1 = reverseList(list1);
        const arr1 = linkedListToArray(result1);
        console.log(`迭代法结果: [${arr1.join(', ')}]`);

        // 测试递归法
        const result2 = reverseListRecursive(list2);
        const arr2 = linkedListToArray(result2);
        console.log(`递归法结果: [${arr2.join(', ')}]`);

        // 测试栈辅助法
        const result3 = reverseListStack(list3);
        const arr3 = linkedListToArray(result3);
        console.log(`栈辅助法结果: [${arr3.join(', ')}]`);

        // 验证结果
        const isCorrect = JSON.stringify(arr1) === JSON.stringify(test.expected);
        console.log(`结果验证: ${isCorrect ? '✅ 通过' : '❌ 失败'}`);
        console.log('---');
    });
}

// 可视化演示
function visualDemo() {
    console.log('\n=== 反转链表可视化演示 ===');

    // 创建示例链表: 1 -> 2 -> 3 -> 4 -> null
    const head = createLinkedList([1, 2, 3, 4]);

    console.log('原始链表:');
    printLinkedList(head, '原链表');

    console.log('\n迭代法反转过程演示:');
    console.log('使用三个指针: prev, curr, next');
    console.log('初始状态: prev=null, curr=1, next=2');
    console.log('第1步: 1.next=null, prev=1, curr=2, next=3');
    console.log('第2步: 2.next=1, prev=2, curr=3, next=4');
    console.log('第3步: 3.next=2, prev=3, curr=4, next=null');
    console.log('第4步: 4.next=3, prev=4, curr=null');
    console.log('最终: prev指向新头节点4');

    // 实际执行反转
    const reversed = reverseList(createLinkedList([1, 2, 3, 4]));
    printLinkedList(reversed, '反转后');
}

// 性能测试
function performanceTest() {
    console.log('\n=== 性能对比测试 ===');

    // 生成大规模测试数据
    const size = 100000;
    const testData = Array.from({ length: size }, (_, i) => i + 1);

    console.log(`测试数据规模: ${size} 个节点`);

    // 测试迭代法
    console.time('迭代法');
    const list1 = createLinkedList(testData);
    reverseList(list1);
    console.timeEnd('迭代法');

    // 测试递归法（小数据量，避免栈溢出）
    if (size <= 10000) {
        console.time('递归法');
        const list2 = createLinkedList(testData);
        reverseListRecursive(list2);
        console.timeEnd('递归法');
    } else {
        console.log('递归法: 数据量过大，跳过测试（避免栈溢出）');
    }

    // 测试栈辅助法
    console.time('栈辅助法');
    const list3 = createLinkedList(testData);
    reverseListStack(list3);
    console.timeEnd('栈辅助法');
}

// 算法复杂度分析
function complexityAnalysis() {
    console.log('\n=== 算法复杂度分析 ===');

    console.log('1. 迭代法（推荐）:');
    console.log('   时间复杂度: O(n) - 遍历一次链表');
    console.log('   空间复杂度: O(1) - 只使用常数个指针');
    console.log('   优点: 效率高，空间占用小，不会栈溢出');
    console.log('   缺点: 需要仔细处理指针操作');

    console.log('\n2. 递归法:');
    console.log('   时间复杂度: O(n) - 每个节点访问一次');
    console.log('   空间复杂度: O(n) - 递归调用栈深度');
    console.log('   优点: 代码简洁，思路清晰');
    console.log('   缺点: 空间开销大，大数据时可能栈溢出');

    console.log('\n3. 栈辅助法:');
    console.log('   时间复杂度: O(n) - 遍历两次链表');
    console.log('   空间复杂度: O(n) - 栈存储所有节点');
    console.log('   优点: 思路直观，易于理解');
    console.log('   缺点: 空间开销大，时间常数较大');

    console.log('\n推荐解法: 迭代法');
    console.log('理由: 时间空间效率最优，适用于大规模数据');
}

// 常见错误示例
function commonMistakes() {
    console.log('\n=== 常见错误分析 ===');

    console.log('❌ 错误1: 忘记保存下一个节点');
    console.log(`
function wrongReverse(head) {
    let prev = null, curr = head;
    while (curr) {
        curr.next = prev;  // 错误！丢失了原来的next
        prev = curr;
        curr = curr.next;  // curr.next已经被修改了！
    }
    return prev;
}
    `);

    console.log('✅ 正确做法: 先保存next，再修改指针');
    console.log(`
function correctReverse(head) {
    let prev = null, curr = head;
    while (curr) {
        const next = curr.next;  // 先保存
        curr.next = prev;        // 再修改
        prev = curr;
        curr = next;             // 使用保存的值
    }
    return prev;
}
    `);

    console.log('\n❌ 错误2: 递归中忘记断开原连接');
    console.log('✅ 正确做法: head.next = null');
}

// 运行所有测试
if (require.main === module) {
    runTests();
    visualDemo();
    performanceTest();
    complexityAnalysis();
    commonMistakes();
}

// 导出函数供其他模块使用
module.exports = {
    ListNode,
    reverseList,
    reverseListRecursive,
    reverseListStack,
    createLinkedList,
    linkedListToArray
};