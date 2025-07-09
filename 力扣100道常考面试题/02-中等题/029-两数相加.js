/**
 * LeetCode 031: 两数相加 (Add Two Numbers)
 *
 * 题目描述：
 * 给你两个非空的链表，表示两个非负的整数。它们每位数字都是按照逆序的方式存储的，
 * 并且每个节点只能存储一位数字。请你将两个数相加，并以相同形式返回一个表示和的链表。
 * 你可以假设除了数字 0 之外，这两个数都不会以 0 开头。
 *
 * 核心思想：
 * 模拟手工加法过程 - 从最低位开始逐位相加，处理进位
 * 关键洞察：链表逆序存储正好符合从低位到高位的加法顺序
 *
 * 算法原理：
 * 1. 同时遍历两个链表，对对应位置的数字相加
 * 2. 维护进位标志，处理超过10的情况
 * 3. 处理长度不同的链表（较短链表视为补0）
 * 4. 最后可能还有进位需要新增节点
 */

// 链表节点定义
class ListNode {
    constructor(val, next) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
}

/**
 * 方法一：模拟加法（推荐）
 *
 * 核心思想：
 * 模拟手工加法，从最低位开始逐位相加，维护进位
 *
 * 算法步骤：
 * 1. 使用哑节点简化边界处理
 * 2. 同时遍历两个链表，逐位相加
 * 3. 计算当前位的和 = val1 + val2 + carry
 * 4. 新节点的值 = sum % 10，进位 = sum / 10
 * 5. 处理剩余的链表和最终的进位
 *
 * @param {ListNode} l1 - 第一个链表
 * @param {ListNode} l2 - 第二个链表
 * @returns {ListNode} 相加结果的链表
 * @time O(max(m,n)) - m,n分别为两个链表的长度
 * @space O(max(m,n)) - 结果链表的长度
 */
function addTwoNumbers(l1, l2) {
    const dummy = new ListNode(0); // 哑节点，简化处理
    let current = dummy;
    let carry = 0; // 进位

    // 当还有节点需要处理或还有进位时继续
    while (l1 !== null || l2 !== null || carry !== 0) {
        // 获取当前位的值（如果节点为空则为0）
        const val1 = l1 ? l1.val : 0;
        const val2 = l2 ? l2.val : 0;

        // 计算当前位的和
        const sum = val1 + val2 + carry;

        // 创建新节点存储当前位的结果
        current.next = new ListNode(sum % 10);
        current = current.next;

        // 更新进位
        carry = Math.floor(sum / 10);

        // 移动到下一个节点
        if (l1) l1 = l1.next;
        if (l2) l2 = l2.next;
    }

    return dummy.next; // 返回真正的头节点
}

/**
 * 方法二：递归实现
 *
 * 核心思想：
 * 使用递归的方式处理每一位的加法，自然处理进位
 *
 * @param {ListNode} l1 - 第一个链表
 * @param {ListNode} l2 - 第二个链表
 * @param {number} carry - 进位值
 * @returns {ListNode} 相加结果的链表
 * @time O(max(m,n)) - 递归深度为较长链表的长度
 * @space O(max(m,n)) - 递归调用栈空间
 */
function addTwoNumbersRecursive(l1, l2, carry = 0) {
    // 基础情况：两个链表都为空且无进位
    if (!l1 && !l2 && carry === 0) {
        return null;
    }

    // 获取当前位的值
    const val1 = l1 ? l1.val : 0;
    const val2 = l2 ? l2.val : 0;
    const sum = val1 + val2 + carry;

    // 创建当前节点
    const node = new ListNode(sum % 10);

    // 递归处理下一位
    const next1 = l1 ? l1.next : null;
    const next2 = l2 ? l2.next : null;
    const nextCarry = Math.floor(sum / 10);

    node.next = addTwoNumbersRecursive(next1, next2, nextCarry);

    return node;
}

/**
 * 工具函数：将数组转换为链表
 */
function arrayToList(arr) {
    if (arr.length === 0) return null;

    const dummy = new ListNode(0);
    let current = dummy;

    for (const val of arr) {
        current.next = new ListNode(val);
        current = current.next;
    }

    return dummy.next;
}

/**
 * 工具函数：将链表转换为数组
 */
function listToArray(head) {
    const result = [];
    while (head !== null) {
        result.push(head.val);
        head = head.next;
    }
    return result;
}

// 测试用例
function runTests() {
    console.log("=== 两数相加测试 ===\n");

    const testCases = [
        {
            l1: [2, 4, 3],
            l2: [5, 6, 4],
            expected: [7, 0, 8],
            description: "342 + 465 = 807"
        },
        {
            l1: [0],
            l2: [0],
            expected: [0],
            description: "0 + 0 = 0"
        },
        {
            l1: [9, 9, 9, 9, 9, 9, 9],
            l2: [9, 9, 9, 9],
            expected: [8, 9, 9, 9, 0, 0, 0, 1],
            description: "9999999 + 9999 = 10009998"
        }
    ];

    const methods = [
        { name: "模拟加法", func: addTwoNumbers },
        { name: "递归实现", func: addTwoNumbersRecursive }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`l1: [${testCase.l1.join(' -> ')}]`);
        console.log(`l2: [${testCase.l2.join(' -> ')}]`);
        console.log(`期望: [${testCase.expected.join(' -> ')}]`);

        methods.forEach(method => {
            const l1 = arrayToList(testCase.l1);
            const l2 = arrayToList(testCase.l2);
            const result = method.func(l1, l2);
            const resultArray = listToArray(result);
            const isCorrect = JSON.stringify(resultArray) === JSON.stringify(testCase.expected);
            const status = isCorrect ? "✓" : "✗";
            console.log(`${method.name}: [${resultArray.join(' -> ')}] ${status}`);
        });
        console.log();
    });
}

// 面试要点
function interviewKeyPoints() {
    console.log("=== 面试要点 ===\n");

    console.log("🎯 核心考点：");
    console.log("1. 链表遍历和节点创建");
    console.log("2. 进位处理的正确性");
    console.log("3. 边界情况的处理");
    console.log("4. 空间复杂度的优化");
    console.log();

    console.log("💡 解题技巧：");
    console.log("1. 使用哑节点简化链表操作");
    console.log("2. 统一处理空节点（视为0）");
    console.log("3. 循环条件包含进位检查");
    console.log("4. 分离进位计算和节点创建");
    console.log();

    console.log("🚫 常见误区：");
    console.log("1. 忘记处理最后的进位");
    console.log("2. 链表长度不同时处理错误");
    console.log("3. 进位计算公式错误");
    console.log("4. 循环条件不完整");
}

// 导出所有方法
module.exports = {
    ListNode,
    addTwoNumbers,
    addTwoNumbersRecursive,
    arrayToList,
    listToArray,
    runTests,
    interviewKeyPoints
};

// 如果直接运行此文件，执行测试
if (require.main === module) {
    runTests();
    interviewKeyPoints();
}