/**
 * 第2章：链表 - 练习题解答
 *
 * 本文件包含第2章链表练习题的完整解答，涵盖：
 * 1. 删除链表中的重复元素（简单）
 * 2. 反转链表（简单）
 * 3. 链表的中间结点（中等）
 * 4. 删除链表的倒数第N个节点（中等）
 * 5. 合并K个升序链表（困难）
 *
 * 每道题都包含详细的核心思想解释、完整代码实现和测试用例
 */

// 链表节点定义
class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

// 辅助函数：从数组创建链表
function createList(arr) {
    if (!arr || arr.length === 0) return null;

    const head = new ListNode(arr[0]);
    let current = head;

    for (let i = 1; i < arr.length; i++) {
        current.next = new ListNode(arr[i]);
        current = current.next;
    }

    return head;
}

// 辅助函数：将链表转换为数组
function listToArray(head) {
    const result = [];
    let current = head;

    while (current) {
        result.push(current.val);
        current = current.next;
    }

    return result;
}

//==========================================
// 题目1：删除链表中的重复元素（简单）
//==========================================

/**
 * 删除排序链表中的重复元素
 *
 * 核心思想：
 * 由于链表已经排序，重复元素必然相邻。只需要遍历链表，
 * 比较当前节点与下一个节点的值，如果相同就跳过下一个节点。
 *
 * 算法步骤：
 * 1. 从头节点开始遍历
 * 2. 比较当前节点和下一个节点的值
 * 3. 如果值相同，修改当前节点的next指针跳过下一个节点
 * 4. 如果值不同，移动到下一个节点
 * 5. 重复直到链表末尾
 *
 * @param {ListNode} head 链表头节点
 * @returns {ListNode} 删除重复元素后的链表头节点
 * @time O(n) 遍历一次链表
 * @space O(1) 只使用常数额外空间
 */
function deleteDuplicates(head) {
    // 处理空链表
    if (!head) return null;

    let current = head;

    // 遍历链表
    while (current && current.next) {
        if (current.val === current.next.val) {
            // 发现重复，跳过下一个节点
            current.next = current.next.next;
        } else {
            // 没有重复，移动到下一个节点
            current = current.next;
        }
    }

    return head;
}

//==========================================
// 题目2：反转链表（简单）
//==========================================

/**
 * 反转链表 - 迭代解法
 *
 * 核心思想：
 * 使用三个指针维护前一个节点、当前节点和下一个节点的关系。
 * 逐个改变每个节点的next指向，使其指向前一个节点。
 *
 * 算法步骤：
 * 1. 初始化prev为null，current为head
 * 2. 保存当前节点的下一个节点
 * 3. 将当前节点的next指向prev
 * 4. 更新prev和current为下一轮做准备
 * 5. 重复直到current为null
 *
 * @param {ListNode} head 链表头节点
 * @returns {ListNode} 反转后的链表头节点
 * @time O(n) 遍历一次链表
 * @space O(1) 只使用常数额外空间
 */
function reverseListIterative(head) {
    let prev = null;
    let current = head;

    while (current) {
        // 保存下一个节点
        const next = current.next;
        // 反转当前节点的指向
        current.next = prev;
        // 移动指针
        prev = current;
        current = next;
    }

    return prev; // prev成为新的头节点
}

/**
 * 反转链表 - 递归解法
 *
 * 核心思想：
 * 递归到链表末尾，然后在回溯过程中逐个反转节点指向。
 * 每次递归处理当前节点和下一个节点的关系。
 *
 * 算法步骤：
 * 1. 递归到链表末尾（基础情况）
 * 2. 在回溯时，将下一个节点的next指向当前节点
 * 3. 将当前节点的next设为null
 * 4. 返回新的头节点
 *
 * @param {ListNode} head 链表头节点
 * @returns {ListNode} 反转后的链表头节点
 * @time O(n) 递归调用n次
 * @space O(n) 递归栈深度为n
 */
function reverseListRecursive(head) {
    // 基础情况：空链表或只有一个节点
    if (!head || !head.next) {
        return head;
    }

    // 递归反转剩余部分
    const newHead = reverseListRecursive(head.next);

    // 反转当前节点的指向
    head.next.next = head;
    head.next = null;

    return newHead;
}

//==========================================
// 题目3：链表的中间结点（中等）
//==========================================

/**
 * 查找链表的中间节点
 *
 * 核心思想：
 * 使用快慢指针技术，快指针每次移动两步，慢指针每次移动一步。
 * 当快指针到达链表末尾时，慢指针恰好在中间位置。
 * 如果链表长度为偶数，返回第二个中间节点。
 *
 * 算法步骤：
 * 1. 初始化快慢指针都指向头节点
 * 2. 快指针每次移动两步，慢指针每次移动一步
 * 3. 当快指针到达末尾时停止
 * 4. 慢指针所在位置就是中间节点
 *
 * @param {ListNode} head 链表头节点
 * @returns {ListNode} 中间节点
 * @time O(n) 遍历半个链表
 * @space O(1) 只使用常数额外空间
 */
function findMiddleNode(head) {
    if (!head) return null;

    let slow = head;
    let fast = head;

    // 快指针走两步，慢指针走一步
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }

    return slow;
}

//==========================================
// 题目4：删除链表的倒数第N个节点（中等）
//==========================================

/**
 * 删除链表的倒数第N个节点
 *
 * 核心思想：
 * 使用双指针技术，让两个指针保持n的距离。
 * 当前面的指针到达末尾时，后面的指针正好指向要删除节点的前一个节点。
 * 使用虚拟头节点简化边界处理。
 *
 * 算法步骤：
 * 1. 创建虚拟头节点简化边界处理
 * 2. 让快指针先走n+1步
 * 3. 快慢指针同时移动，直到快指针到达末尾
 * 4. 此时慢指针指向要删除节点的前一个节点
 * 5. 删除目标节点
 *
 * @param {ListNode} head 链表头节点
 * @param {number} n 倒数第n个节点
 * @returns {ListNode} 删除节点后的链表头节点
 * @time O(L) L为链表长度，只遍历一次
 * @space O(1) 只使用常数额外空间
 */
function removeNthFromEnd(head, n) {
    // 创建虚拟头节点，简化边界处理
    const dummy = new ListNode(0);
    dummy.next = head;

    let fast = dummy;
    let slow = dummy;

    // 快指针先走n+1步
    for (let i = 0; i <= n; i++) {
        fast = fast.next;
    }

    // 快慢指针同时移动
    while (fast) {
        fast = fast.next;
        slow = slow.next;
    }

    // 删除倒数第n个节点
    slow.next = slow.next.next;

    return dummy.next;
}

//==========================================
// 题目5：合并K个升序链表（困难）
//==========================================

/**
 * 合并两个有序链表
 *
 * 核心思想：
 * 使用归并排序的合并过程，双指针分别指向两个链表，
 * 比较节点值，将较小的节点加入结果链表。
 *
 * @param {ListNode} l1 第一个有序链表
 * @param {ListNode} l2 第二个有序链表
 * @returns {ListNode} 合并后的有序链表
 * @time O(m + n) m和n分别为两个链表长度
 * @space O(1) 只使用常数额外空间
 */
function mergeTwoSortedLists(l1, l2) {
    const dummy = new ListNode(0);
    let current = dummy;

    // 双指针合并
    while (l1 && l2) {
        if (l1.val <= l2.val) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }

    // 连接剩余节点
    current.next = l1 || l2;

    return dummy.next;
}

/**
 * 合并K个升序链表
 *
 * 核心思想：
 * 使用分治法思想，将K个链表两两配对合并，
 * 不断减少链表数量，直到最终合并为一个链表。
 * 这样可以将时间复杂度从O(kN)优化到O(N log k)。
 *
 * 算法步骤：
 * 1. 将链表数组两两配对
 * 2. 合并每一对链表
 * 3. 将合并结果作为新的链表数组
 * 4. 重复直到只剩一个链表
 *
 * @param {ListNode[]} lists K个升序链表数组
 * @returns {ListNode} 合并后的升序链表
 * @time O(N log k) N为所有节点总数，k为链表个数
 * @space O(log k) 递归调用栈深度
 */
function mergeKLists(lists) {
    if (!lists || lists.length === 0) return null;
    if (lists.length === 1) return lists[0];

    // 分治合并
    while (lists.length > 1) {
        const mergedLists = [];

        // 两两配对合并
        for (let i = 0; i < lists.length; i += 2) {
            const l1 = lists[i];
            const l2 = i + 1 < lists.length ? lists[i + 1] : null;
            mergedLists.push(mergeTwoSortedLists(l1, l2));
        }

        lists = mergedLists;
    }

    return lists[0];
}

//==========================================
// 测试代码
//==========================================

console.log("第2章：链表 - 练习题解答测试");
console.log("=====================================");

// 测试题目1：删除链表中的重复元素
console.log("\n题目1：删除链表中的重复元素");
console.log("----------------------------");

const test1_1 = createList([1, 1, 2]);
console.log("输入:", listToArray(test1_1));
const result1_1 = deleteDuplicates(test1_1);
console.log("输出:", listToArray(result1_1)); // [1, 2]

const test1_2 = createList([1, 1, 2, 3, 3]);
console.log("输入:", listToArray(test1_2));
const result1_2 = deleteDuplicates(test1_2);
console.log("输出:", listToArray(result1_2)); // [1, 2, 3]

// 测试题目2：反转链表
console.log("\n题目2：反转链表");
console.log("----------------------------");

const test2_1 = createList([1, 2, 3, 4, 5]);
console.log("输入:", listToArray(test2_1));
const result2_1 = reverseListIterative(createList([1, 2, 3, 4, 5]));
console.log("迭代解法:", listToArray(result2_1)); // [5, 4, 3, 2, 1]

const result2_2 = reverseListRecursive(createList([1, 2, 3, 4, 5]));
console.log("递归解法:", listToArray(result2_2)); // [5, 4, 3, 2, 1]

// 测试题目3：链表的中间结点
console.log("\n题目3：链表的中间结点");
console.log("----------------------------");

const test3_1 = createList([1, 2, 3, 4, 5]);
console.log("输入:", listToArray(test3_1));
const result3_1 = findMiddleNode(test3_1);
console.log("中间节点值:", result3_1.val); // 3

const test3_2 = createList([1, 2, 3, 4, 5, 6]);
console.log("输入:", listToArray(test3_2));
const result3_2 = findMiddleNode(test3_2);
console.log("中间节点值:", result3_2.val); // 4

// 测试题目4：删除链表的倒数第N个节点
console.log("\n题目4：删除链表的倒数第N个节点");
console.log("----------------------------");

const test4_1 = createList([1, 2, 3, 4, 5]);
console.log("输入:", listToArray(test4_1), "n = 2");
const result4_1 = removeNthFromEnd(test4_1, 2);
console.log("输出:", listToArray(result4_1)); // [1, 2, 3, 5]

const test4_2 = createList([1, 2, 3, 4, 5]);
console.log("输入:", listToArray(test4_2), "n = 5");
const result4_2 = removeNthFromEnd(test4_2, 5);
console.log("输出:", listToArray(result4_2)); // [2, 3, 4, 5]

// 测试题目5：合并K个升序链表
console.log("\n题目5：合并K个升序链表");
console.log("----------------------------");

const lists = [
    createList([1, 4, 5]),
    createList([1, 3, 4]),
    createList([2, 6])
];
console.log("输入链表:");
lists.forEach((list, index) => {
    console.log(`  链表${index + 1}:`, listToArray(list));
});

const result5 = mergeKLists(lists);
console.log("合并结果:", listToArray(result5)); // [1, 1, 2, 3, 4, 4, 5, 6]

// 边界情况测试
console.log("\n边界情况测试");
console.log("----------------------------");

// 空链表测试
console.log("空链表反转:", listToArray(reverseListIterative(null))); // []
console.log("单节点反转:", listToArray(reverseListIterative(createList([1])))); // [1]

// 合并空链表数组
console.log("合并空数组:", listToArray(mergeKLists([]))); // []
console.log("合并包含null的数组:", listToArray(mergeKLists([null, createList([1])]))); // [1]

console.log("\n所有测试完成！");