/**
 * LeetCode 032: 删除链表的倒数第N个节点 (Remove Nth Node From End of List)
 *
 * 题目描述：
 * 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。
 *
 * 核心思想：
 * 双指针技巧 - 快慢指针保持n步距离，当快指针到达末尾时，慢指针正好指向要删除节点的前一个
 * 关键洞察：通过指针间的固定距离，一次遍历就能定位到目标位置
 *
 * 算法原理：
 * 1. 快指针先走n步，建立与慢指针的距离
 * 2. 两指针同时移动，直到快指针到达末尾
 * 3. 此时慢指针指向要删除节点的前一个位置
 * 4. 执行删除操作：slow.next = slow.next.next
 */

// 链表节点定义
class ListNode {
    constructor(val, next) {
        this.val = (val === undefined ? 0 : val);
        this.next = (next === undefined ? null : next);
    }
}

/**
 * 方法一：双指针法（推荐）
 *
 * 核心思想：
 * 使用快慢双指针，保持n的距离，一次遍历定位删除位置
 *
 * 算法步骤：
 * 1. 创建哑节点，简化边界处理
 * 2. 快指针先走n+1步（为了让慢指针停在删除节点的前一个）
 * 3. 快慢指针同时移动，直到快指针到达末尾
 * 4. 删除慢指针的下一个节点
 *
 * @param {ListNode} head - 链表头节点
 * @param {number} n - 倒数第n个位置
 * @returns {ListNode} 删除后的链表头节点
 * @time O(L) - L为链表长度，只需一次遍历
 * @space O(1) - 只使用常数额外空间
 */
function removeNthFromEnd(head, n) {
    // 创建哑节点，处理删除头节点的边界情况
    const dummy = new ListNode(0);
    dummy.next = head;

    let fast = dummy;
    let slow = dummy;

    // 快指针先走n+1步，保证慢指针停在删除节点的前一个位置
    for (let i = 0; i <= n; i++) {
        fast = fast.next;
    }

    // 快慢指针同时移动，直到快指针到达末尾
    while (fast !== null) {
        fast = fast.next;
        slow = slow.next;
    }

    // 删除倒数第n个节点
    slow.next = slow.next.next;

    return dummy.next;
}

/**
 * 方法二：两次遍历法
 *
 * 核心思想：
 * 第一次遍历获取链表长度，第二次遍历找到删除位置
 *
 * @param {ListNode} head - 链表头节点
 * @param {number} n - 倒数第n个位置
 * @returns {ListNode} 删除后的链表头节点
 * @time O(L) - 需要两次遍历，但时间复杂度仍为O(L)
 * @space O(1) - 只使用常数额外空间
 */
function removeNthFromEndTwoPasses(head, n) {
    // 第一次遍历：计算链表长度
    let length = 0;
    let current = head;
    while (current !== null) {
        length++;
        current = current.next;
    }

    // 处理删除头节点的情况
    if (n === length) {
        return head.next;
    }

    // 第二次遍历：找到要删除节点的前一个节点
    const targetIndex = length - n; // 要删除节点的前一个节点的索引（0-based）
    current = head;

    for (let i = 0; i < targetIndex - 1; i++) {
        current = current.next;
    }

    // 删除目标节点
    current.next = current.next.next;

    return head;
}

/**
 * 方法三：栈实现
 *
 * 核心思想：
 * 使用栈存储所有节点，然后弹出n个节点，栈顶就是要删除节点的前一个
 *
 * @param {ListNode} head - 链表头节点
 * @param {number} n - 倒数第n个位置
 * @returns {ListNode} 删除后的链表头节点
 * @time O(L) - 遍历链表一次
 * @space O(L) - 栈空间存储所有节点
 */
function removeNthFromEndStack(head, n) {
    const dummy = new ListNode(0);
    dummy.next = head;

    const stack = [];
    let current = dummy;

    // 将所有节点压入栈
    while (current !== null) {
        stack.push(current);
        current = current.next;
    }

    // 弹出n个节点，栈顶就是要删除节点的前驱
    for (let i = 0; i < n; i++) {
        stack.pop();
    }

    const prev = stack[stack.length - 1];
    prev.next = prev.next.next;

    return dummy.next;
}

/**
 * 方法四：递归实现
 *
 * 核心思想：
 * 使用递归遍历到链表末尾，然后在回溯过程中计数，找到目标节点
 *
 * @param {ListNode} head - 链表头节点
 * @param {number} n - 倒数第n个位置
 * @returns {ListNode} 删除后的链表头节点
 * @time O(L) - 递归遍历整个链表
 * @space O(L) - 递归调用栈空间
 */
function removeNthFromEndRecursive(head, n) {
    function helper(node) {
        if (node === null) {
            return 0; // 从末尾开始计数
        }

        const count = helper(node.next) + 1;

        // 如果当前节点的下一个节点是要删除的节点
        if (count === n + 1) {
            node.next = node.next.next;
        }

        return count;
    }

    const dummy = new ListNode(0);
    dummy.next = head;
    helper(dummy);

    return dummy.next;
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
    console.log("=== 删除链表倒数第N个节点测试 ===\n");

    const testCases = [
        {
            list: [1, 2, 3, 4, 5],
            n: 2,
            expected: [1, 2, 3, 5],
            description: "删除倒数第2个节点"
        },
        {
            list: [1],
            n: 1,
            expected: [],
            description: "删除唯一节点"
        },
        {
            list: [1, 2],
            n: 1,
            expected: [1],
            description: "删除最后一个节点"
        },
        {
            list: [1, 2],
            n: 2,
            expected: [2],
            description: "删除第一个节点"
        },
        {
            list: [1, 2, 3, 4, 5, 6],
            n: 6,
            expected: [2, 3, 4, 5, 6],
            description: "删除头节点"
        },
        {
            list: [1, 2, 3],
            n: 3,
            expected: [2, 3],
            description: "删除头节点（3个节点）"
        }
    ];

    const methods = [
        { name: "双指针法", func: removeNthFromEnd },
        { name: "两次遍历", func: removeNthFromEndTwoPasses },
        { name: "栈实现", func: removeNthFromEndStack },
        { name: "递归实现", func: removeNthFromEndRecursive }
    ];

    testCases.forEach((testCase, index) => {
        console.log(`测试用例 ${index + 1}: ${testCase.description}`);
        console.log(`输入: [${testCase.list.join(', ')}], n = ${testCase.n}`);
        console.log(`期望: [${testCase.expected.join(', ')}]`);

        methods.forEach(method => {
            const head = arrayToList(testCase.list);
            const result = method.func(head, testCase.n);
            const resultArray = listToArray(result);
            const isCorrect = JSON.stringify(resultArray) === JSON.stringify(testCase.expected);
            const status = isCorrect ? "✓" : "✗";
            console.log(`${method.name}: [${resultArray.join(', ')}] ${status}`);
        });
        console.log();
    });
}

// 算法演示
function demonstrateAlgorithm() {
    console.log("=== 双指针算法演示 ===\n");

    const arr = [1, 2, 3, 4, 5];
    const n = 2;

    console.log(`输入链表: [${arr.join(' -> ')}]`);
    console.log(`删除倒数第 ${n} 个节点`);
    console.log("目标：删除节点4，结果应为 [1 -> 2 -> 3 -> 5]");
    console.log();

    // 创建链表
    const head = arrayToList(arr);
    const dummy = new ListNode(0);
    dummy.next = head;

    console.log("执行过程：");
    console.log("1. 创建哑节点，fast和slow都指向哑节点");
    console.log("   dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null");
    console.log("   ↑");
    console.log("   fast, slow");
    console.log();

    console.log("2. fast指针先走n+1步（3步）：");
    console.log("   dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null");
    console.log("   ↑              ↑");
    console.log("   slow           fast");
    console.log();

    console.log("3. fast和slow同时移动，直到fast到达末尾：");
    console.log("   步骤1: fast和slow都向右移动一步");
    console.log("   dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null");
    console.log("            ↑              ↑");
    console.log("            slow           fast");
    console.log();

    console.log("   步骤2: fast和slow都向右移动一步");
    console.log("   dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null");
    console.log("                  ↑              ↑");
    console.log("                  slow           fast");
    console.log();

    console.log("   步骤3: fast和slow都向右移动一步");
    console.log("   dummy -> 1 -> 2 -> 3 -> 4 -> 5 -> null");
    console.log("                       ↑              ↑");
    console.log("                       slow           fast");
    console.log();

    console.log("4. fast到达末尾，slow指向要删除节点的前一个节点");
    console.log("   执行删除：slow.next = slow.next.next");
    console.log("   dummy -> 1 -> 2 -> 3 -> 5 -> null");
    console.log("                       ↑");
    console.log("                       slow");
    console.log();

    const result = removeNthFromEnd(arrayToList(arr), n);
    const resultArray = listToArray(result);
    console.log(`最终结果: [${resultArray.join(' -> ')}]`);
}

// 边界情况分析
function edgeCaseAnalysis() {
    console.log("=== 边界情况分析 ===\n");

    const edgeCases = [
        {
            case: "删除唯一节点",
            list: [1],
            n: 1,
            analysis: "链表变为空，需要正确处理"
        },
        {
            case: "删除头节点",
            list: [1, 2, 3],
            n: 3,
            analysis: "删除的是第一个节点，返回新的头节点"
        },
        {
            case: "删除尾节点",
            list: [1, 2, 3],
            n: 1,
            analysis: "删除最后一个节点"
        },
        {
            case: "两个节点删除第一个",
            list: [1, 2],
            n: 2,
            analysis: "只有两个节点时删除头节点"
        },
        {
            case: "两个节点删除第二个",
            list: [1, 2],
            n: 1,
            analysis: "只有两个节点时删除尾节点"
        }
    ];

    edgeCases.forEach(({case: caseName, list, n, analysis}) => {
        console.log(`${caseName}:`);
        console.log(`输入: [${list.join(', ')}], n = ${n}`);

        const head = arrayToList(list);
        const result = removeNthFromEnd(head, n);
        const resultArray = listToArray(result);

        console.log(`结果: [${resultArray.join(', ')}]`);
        console.log(`分析: ${analysis}`);
        console.log();
    });
}

// 复杂度分析
function complexityAnalysis() {
    console.log("=== 复杂度分析 ===\n");

    const methods = [
        {
            name: "双指针法",
            time: "O(L)",
            space: "O(1)",
            description: "一次遍历，最优解法"
        },
        {
            name: "两次遍历",
            time: "O(L)",
            space: "O(1)",
            description: "两次遍历，但时间复杂度相同"
        },
        {
            name: "栈实现",
            time: "O(L)",
            space: "O(L)",
            description: "需要额外的栈空间"
        },
        {
            name: "递归实现",
            time: "O(L)",
            space: "O(L)",
            description: "递归调用栈空间"
        }
    ];

    console.log("算法复杂度对比：");
    console.log("算法名称".padEnd(12) + "时间复杂度".padEnd(12) + "空间复杂度".padEnd(12) + "特点");
    console.log("-".repeat(55));

    methods.forEach(method => {
        console.log(
            method.name.padEnd(12) +
            method.time.padEnd(12) +
            method.space.padEnd(12) +
            method.description
        );
    });

    console.log("\n说明:");
    console.log("- L 为链表长度");
    console.log("- 双指针法是最优解，时间和空间复杂度都最好");
    console.log("- 所有方法都只需遍历链表一次或两次");
}

// 面试要点
function interviewKeyPoints() {
    console.log("=== 面试要点 ===\n");

    console.log("🎯 核心考点：");
    console.log("1. 双指针技巧的应用");
    console.log("2. 链表删除操作的边界处理");
    console.log("3. 哑节点的使用技巧");
    console.log("4. 一次遍历vs两次遍历的权衡");
    console.log();

    console.log("💡 解题技巧：");
    console.log("1. 使用哑节点简化删除头节点的处理");
    console.log("2. 快指针先走n+1步，确保慢指针停在正确位置");
    console.log("3. 双指针保持固定距离的思想");
    console.log("4. 注意边界条件：n等于链表长度的情况");
    console.log();

    console.log("🚫 常见误区：");
    console.log("1. 快指针走的步数错误（应该是n+1而不是n）");
    console.log("2. 忘记处理删除头节点的特殊情况");
    console.log("3. 没有使用哑节点导致代码复杂");
    console.log("4. 边界检查不充分");
    console.log();

    console.log("🔍 相关问题：");
    console.log("1. 链表的中间节点");
    console.log("2. 删除排序链表中的重复元素");
    console.log("3. 旋转链表");
    console.log("4. 链表求交集");
}

// 导出所有方法
module.exports = {
    ListNode,
    removeNthFromEnd,
    removeNthFromEndTwoPasses,
    removeNthFromEndStack,
    removeNthFromEndRecursive,
    arrayToList,
    listToArray,
    runTests,
    demonstrateAlgorithm,
    edgeCaseAnalysis,
    complexityAnalysis,
    interviewKeyPoints
};

// 如果直接运行此文件，执行测试
if (require.main === module) {
    runTests();
    demonstrateAlgorithm();
    edgeCaseAnalysis();
    complexityAnalysis();
    interviewKeyPoints();
}