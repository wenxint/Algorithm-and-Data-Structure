/**
 * 第2章 - 链表算法实现
 *
 * 本文件包含：
 * 1. 快慢指针技术相关算法
 * 2. 递归处理技术相关算法
 * 3. 双指针操作技术相关算法
 * 4. 高级链表算法
 * 5. 完整的测试用例
 */

// 引入基础链表实现
const { ListNode } = require('./基础实现.js');

// ========== 辅助函数 ==========

/**
 * 根据数组创建链表
 * @param {Array} arr - 数组
 * @returns {ListNode} 链表头节点
 */
function createListFromArray(arr) {
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
 * 将链表转换为数组
 * @param {ListNode} head - 链表头节点
 * @returns {Array} 数组
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

// ========== 快慢指针技术算法 ==========

/**
 * 检测链表中是否存在环
 *
 * 核心思想：
 * 使用快慢指针，快指针每次走2步，慢指针每次走1步
 * 如果链表中有环，快指针最终会追上慢指针
 *
 * 算法步骤：
 * 1. 初始化快慢指针都指向头节点
 * 2. 快指针每次移动2步，慢指针每次移动1步
 * 3. 如果快指针能到达末尾，说明无环
 * 4. 如果快慢指针相遇，说明有环
 *
 * @param {ListNode} head - 链表头节点
 * @returns {boolean} 是否存在环
 * @time O(n) - 最多遍历链表两遍
 * @space O(1) - 只使用两个指针
 */
function hasCycle(head) {
    if (!head || !head.next) {
        return false;  // 空链表或单节点无环
    }

    let slow = head;      // 慢指针
    let fast = head;      // 快指针

    while (fast && fast.next) {
        slow = slow.next;        // 慢指针移动1步
        fast = fast.next.next;   // 快指针移动2步

        if (slow === fast) {
            return true;  // 快慢指针相遇，存在环
        }
    }

    return false;  // 快指针到达末尾，无环
}

/**
 * 找到链表环的起始位置
 *
 * 核心思想：
 * 1. 先用快慢指针找到相遇点
 * 2. 将一个指针重置到头部，然后两个指针同速移动
 * 3. 再次相遇的位置就是环的起始位置
 *
 * 数学原理：
 * 设链表头到环起始点距离为a，环起始点到相遇点距离为b，相遇点到环起始点距离为c
 * 慢指针走过距离：a + b
 * 快指针走过距离：a + b + c + b = a + 2b + c
 * 由于快指针速度是慢指针2倍：a + 2b + c = 2(a + b)
 * 简化得：c = a
 *
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode} 环的起始节点，无环返回null
 * @time O(n)
 * @space O(1)
 */
function detectCycle(head) {
    if (!head || !head.next) {
        return null;
    }

    let slow = head;
    let fast = head;

    // 第一阶段：检测是否有环
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;

        if (slow === fast) {
            // 第二阶段：找到环的起始位置
            let ptr1 = head;      // 从头开始
            let ptr2 = slow;      // 从相遇点开始

            while (ptr1 !== ptr2) {
                ptr1 = ptr1.next;
                ptr2 = ptr2.next;
            }

            return ptr1;  // 环的起始节点
        }
    }

    return null;  // 无环
}

/**
 * 找到链表的中间节点
 *
 * 核心思想：
 * 快指针每次走2步，慢指针每次走1步
 * 当快指针到达末尾时，慢指针正好在中间位置
 *
 * 注意：
 * - 奇数个节点：返回中间节点
 * - 偶数个节点：返回第二个中间节点
 *
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode} 中间节点
 * @time O(n)
 * @space O(1)
 */
function findMiddle(head) {
    if (!head) return null;

    let slow = head;
    let fast = head;

    while (fast && fast.next) {
        slow = slow.next;      // 慢指针走1步
        fast = fast.next.next; // 快指针走2步
    }

    return slow;
}

/**
 * 判断链表是否为回文
 *
 * 核心思想：
 * 1. 使用快慢指针找到链表中点
 * 2. 反转后半部分链表
 * 3. 比较前半部分和反转后的后半部分
 * 4. 恢复链表结构（可选）
 *
 * @param {ListNode} head - 链表头节点
 * @returns {boolean} 是否为回文
 * @time O(n)
 * @space O(1)
 */
function isPalindrome(head) {
    if (!head || !head.next) {
        return true;  // 空链表或单节点是回文
    }

    // 找到链表中点
    let slow = head;
    let fast = head;

    while (fast.next && fast.next.next) {
        slow = slow.next;
        fast = fast.next.next;
    }

    // 反转后半部分
    let secondHalf = reverseList(slow.next);
    slow.next = null;  // 断开连接

    // 比较前后两部分
    let firstHalf = head;
    let result = true;

    while (secondHalf && result) {
        if (firstHalf.val !== secondHalf.val) {
            result = false;
        }
        firstHalf = firstHalf.next;
        secondHalf = secondHalf.next;
    }

    return result;
}

// ========== 递归处理技术算法 ==========

/**
 * 递归反转链表
 *
 * 核心思想：
 * 将反转链表问题分解为：
 * 1. 递归反转除第一个节点外的剩余部分
 * 2. 调整第一个节点与第二个节点的连接关系
 *
 * 递归步骤：
 * 1. 基础情况：空链表或单节点直接返回
 * 2. 递归反转后面部分，得到新的头节点
 * 3. 调整当前节点的连接：head.next.next = head
 * 4. 断开当前节点的原连接：head.next = null
 *
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode} 反转后的头节点
 * @time O(n) - 遍历每个节点一次
 * @space O(n) - 递归栈深度
 */
function reverseList(head) {
    // 基础情况：空链表或单节点
    if (!head || !head.next) {
        return head;
    }

    // 递归反转后面部分
    const newHead = reverseList(head.next);

    // 调整当前节点的连接
    head.next.next = head;  // 让下一个节点指向当前节点
    head.next = null;       // 断开当前节点的原连接

    return newHead;  // 返回新的头节点
}

/**
 * 递归合并两个有序链表
 *
 * 核心思想：
 * 比较两个链表的头节点，选择较小的作为结果头节点
 * 然后递归合并该节点的next与另一个链表
 *
 * 递归步骤：
 * 1. 基础情况：任一链表为空，返回另一个链表
 * 2. 比较两个头节点的值
 * 3. 选择较小的节点，递归处理其next指针
 * 4. 返回选中的节点
 *
 * @param {ListNode} list1 - 第一个有序链表
 * @param {ListNode} list2 - 第二个有序链表
 * @returns {ListNode} 合并后的头节点
 * @time O(m + n) - m和n分别是两个链表的长度
 * @space O(m + n) - 递归栈深度
 */
function mergeTwoLists(list1, list2) {
    // 基础情况：其中一个链表为空
    if (!list1) return list2;
    if (!list2) return list1;

    // 比较头节点，选择较小的
    if (list1.val <= list2.val) {
        // 选择list1的头节点，递归处理剩余部分
        list1.next = mergeTwoLists(list1.next, list2);
        return list1;
    } else {
        // 选择list2的头节点，递归处理剩余部分
        list2.next = mergeTwoLists(list1, list2.next);
        return list2;
    }
}

/**
 * 递归删除链表中的所有指定值
 *
 * 核心思想：
 * 对于每个节点，先递归处理其后续部分
 * 然后判断当前节点是否需要删除
 *
 * @param {ListNode} head - 链表头节点
 * @param {number} val - 要删除的值
 * @returns {ListNode} 删除后的头节点
 * @time O(n)
 * @space O(n) - 递归栈
 */
function removeElements(head, val) {
    // 基础情况：空链表
    if (!head) return null;

    // 递归处理后续节点
    head.next = removeElements(head.next, val);

    // 判断当前节点是否需要删除
    return head.val === val ? head.next : head;
}

/**
 * 递归交换链表中的相邻节点
 *
 * 核心思想：
 * 每次处理一对节点，递归处理后续部分
 *
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode} 交换后的头节点
 * @time O(n)
 * @space O(n) - 递归栈
 */
function swapPairs(head) {
    // 基础情况：空链表或只有一个节点
    if (!head || !head.next) {
        return head;
    }

    // 保存第二个节点
    const second = head.next;

    // 递归处理后续部分
    head.next = swapPairs(second.next);

    // 交换前两个节点
    second.next = head;

    return second;  // 第二个节点成为新的头节点
}

// ========== 双指针操作技术算法 ==========

/**
 * 删除链表的倒数第N个节点
 *
 * 核心思想：
 * 使用两个指针保持N的固定距离
 * 当前指针到达末尾时，后指针正好指向目标节点的前一个位置
 *
 * 算法步骤：
 * 1. 创建虚拟头节点简化边界处理
 * 2. 第一个指针先移动n+1步
 * 3. 两个指针同时移动直到第一个指针到达末尾
 * 4. 删除第二个指针的下一个节点
 *
 * @param {ListNode} head - 链表头节点
 * @param {number} n - 倒数第n个
 * @returns {ListNode} 删除后的头节点
 * @time O(L) - L是链表长度
 * @space O(1)
 */
function removeNthFromEnd(head, n) {
    // 创建虚拟头节点，简化删除头节点的情况
    const dummy = new ListNode(0);
    dummy.next = head;

    let first = dummy;   // 第一个指针
    let second = dummy;  // 第二个指针

    // 第一个指针先移动n+1步
    for (let i = 0; i <= n; i++) {
        first = first.next;
    }

    // 两个指针同时移动
    while (first !== null) {
        first = first.next;
        second = second.next;
    }

    // 删除倒数第n个节点
    second.next = second.next.next;

    return dummy.next;
}

/**
 * 旋转链表
 *
 * 核心思想：
 * 1. 将链表连成环
 * 2. 找到新的头节点位置
 * 3. 在正确位置断开环
 *
 * @param {ListNode} head - 链表头节点
 * @param {number} k - 旋转步数
 * @returns {ListNode} 旋转后的头节点
 * @time O(n)
 * @space O(1)
 */
function rotateRight(head, k) {
    if (!head || !head.next || k === 0) {
        return head;
    }

    // 计算链表长度并找到尾节点
    let length = 1;
    let tail = head;
    while (tail.next) {
        tail = tail.next;
        length++;
    }

    // 连成环
    tail.next = head;

    // 计算新头节点的位置
    k = k % length;  // 处理k大于链表长度的情况
    const stepsToNewHead = length - k;

    // 找到新头节点的前一个节点
    let newTail = head;
    for (let i = 1; i < stepsToNewHead; i++) {
        newTail = newTail.next;
    }

    const newHead = newTail.next;
    newTail.next = null;  // 断开环

    return newHead;
}

/**
 * 分隔链表
 *
 * 核心思想：
 * 将链表分为两部分：小于x的节点和大于等于x的节点
 * 然后将两部分连接起来
 *
 * @param {ListNode} head - 链表头节点
 * @param {number} x - 分隔值
 * @returns {ListNode} 分隔后的头节点
 * @time O(n)
 * @space O(1)
 */
function partition(head, x) {
    // 创建两个虚拟头节点
    const beforeHead = new ListNode(0);  // 小于x的节点
    const afterHead = new ListNode(0);   // 大于等于x的节点

    let before = beforeHead;
    let after = afterHead;

    // 遍历原链表，分别构建两个新链表
    while (head) {
        if (head.val < x) {
            before.next = head;
            before = before.next;
        } else {
            after.next = head;
            after = after.next;
        }
        head = head.next;
    }

    // 连接两部分
    after.next = null;        // 断开after链表的尾部
    before.next = afterHead.next;  // 连接before和after

    return beforeHead.next;
}

// ========== 高级链表算法 ==========

/**
 * 合并K个有序链表
 *
 * 核心思想：
 * 使用分治法，两两合并链表
 * 时间复杂度优于依次合并的方法
 *
 * @param {ListNode[]} lists - 链表数组
 * @returns {ListNode} 合并后的头节点
 * @time O(N log k) - N是总节点数，k是链表数量
 * @space O(log k) - 递归栈深度
 */
function mergeKLists(lists) {
    if (!lists || lists.length === 0) {
        return null;
    }

    while (lists.length > 1) {
        const mergedLists = [];

        // 两两配对合并
        for (let i = 0; i < lists.length; i += 2) {
            const list1 = lists[i];
            const list2 = i + 1 < lists.length ? lists[i + 1] : null;
            mergedLists.push(mergeTwoLists(list1, list2));
        }

        lists = mergedLists;
    }

    return lists[0];
}

/**
 * 链表排序（归并排序）
 *
 * 核心思想：
 * 1. 使用快慢指针找到中点分割链表
 * 2. 递归排序左右两部分
 * 3. 合并两个有序链表
 *
 * @param {ListNode} head - 链表头节点
 * @returns {ListNode} 排序后的头节点
 * @time O(n log n)
 * @space O(log n) - 递归栈
 */
function sortList(head) {
    if (!head || !head.next) {
        return head;
    }

    // 找到中点并分割链表
    const mid = getMiddleAndSplit(head);

    // 递归排序两部分
    const left = sortList(head);
    const right = sortList(mid);

    // 合并有序链表
    return mergeTwoLists(left, right);
}

/**
 * 找到中点并分割链表
 * @param {ListNode} head
 * @returns {ListNode} 后半部分的头节点
 */
function getMiddleAndSplit(head) {
    let slow = head;
    let fast = head;
    let prev = null;

    while (fast && fast.next) {
        prev = slow;
        slow = slow.next;
        fast = fast.next.next;
    }

    // 分割链表
    prev.next = null;
    return slow;
}

/**
 * 相交链表
 *
 * 核心思想：
 * 两个指针分别遍历两个链表，当到达末尾时切换到另一个链表
 * 如果有交点，两个指针会在交点相遇
 *
 * @param {ListNode} headA - 链表A头节点
 * @param {ListNode} headB - 链表B头节点
 * @returns {ListNode} 交点节点，无交点返回null
 * @time O(m + n)
 * @space O(1)
 */
function getIntersectionNode(headA, headB) {
    if (!headA || !headB) return null;

    let pA = headA;
    let pB = headB;

    // 两个指针分别遍历两个链表
    // 当到达末尾时切换到另一个链表的头部
    while (pA !== pB) {
        pA = pA ? pA.next : headB;
        pB = pB ? pB.next : headA;
    }

    return pA;  // 交点或null
}

// ========== 测试用例 ==========

console.log('=== 快慢指针技术测试 ===');

// 测试环检测
console.log('\n1. 环检测测试：');
const listWithCycle = createListFromArray([1, 2, 3, 4]);
listWithCycle.next.next.next.next = listWithCycle.next; // 创建环
console.log('有环链表检测:', hasCycle(listWithCycle)); // true

const listWithoutCycle = createListFromArray([1, 2, 3, 4]);
console.log('无环链表检测:', hasCycle(listWithoutCycle)); // false

// 测试找中点
console.log('\n2. 找中点测试：');
const oddList = createListFromArray([1, 2, 3, 4, 5]);
console.log('奇数长度链表中点:', findMiddle(oddList).val); // 3

const evenList = createListFromArray([1, 2, 3, 4]);
console.log('偶数长度链表中点:', findMiddle(evenList).val); // 3

// 测试回文检测
console.log('\n3. 回文检测测试：');
const palindromeList = createListFromArray([1, 2, 2, 1]);
console.log('回文链表检测:', isPalindrome(palindromeList)); // true

console.log('\n=== 递归处理技术测试 ===');

// 测试链表反转
console.log('\n1. 链表反转测试：');
const originalList = createListFromArray([1, 2, 3, 4, 5]);
console.log('原链表:', listToArray(originalList));
const reversedList = reverseList(originalList);
console.log('反转后:', listToArray(reversedList));

// 测试合并有序链表
console.log('\n2. 合并有序链表测试：');
const list1 = createListFromArray([1, 2, 4]);
const list2 = createListFromArray([1, 3, 4]);
const merged = mergeTwoLists(list1, list2);
console.log('合并结果:', listToArray(merged)); // [1, 1, 2, 3, 4, 4]

// 测试删除元素
console.log('\n3. 删除元素测试：');
const listToRemove = createListFromArray([1, 2, 6, 3, 4, 5, 6]);
const afterRemove = removeElements(listToRemove, 6);
console.log('删除6后:', listToArray(afterRemove)); // [1, 2, 3, 4, 5]

console.log('\n=== 双指针操作技术测试 ===');

// 测试删除倒数第N个节点
console.log('\n1. 删除倒数第N个节点测试：');
const listForRemoveNth = createListFromArray([1, 2, 3, 4, 5]);
const afterRemoveNth = removeNthFromEnd(listForRemoveNth, 2);
console.log('删除倒数第2个后:', listToArray(afterRemoveNth)); // [1, 2, 3, 5]

// 测试旋转链表
console.log('\n2. 旋转链表测试：');
const listForRotate = createListFromArray([1, 2, 3, 4, 5]);
const rotated = rotateRight(listForRotate, 2);
console.log('向右旋转2位后:', listToArray(rotated)); // [4, 5, 1, 2, 3]

// 测试分隔链表
console.log('\n3. 分隔链表测试：');
const listForPartition = createListFromArray([1, 4, 3, 2, 5, 2]);
const partitioned = partition(listForPartition, 3);
console.log('以3分隔后:', listToArray(partitioned)); // [1, 2, 2, 4, 3, 5]

console.log('\n=== 高级算法测试 ===');

// 测试合并K个有序链表
console.log('\n1. 合并K个有序链表测试：');
const lists = [
    createListFromArray([1, 4, 5]),
    createListFromArray([1, 3, 4]),
    createListFromArray([2, 6])
];
const mergedK = mergeKLists(lists);
console.log('合并K个链表结果:', listToArray(mergedK)); // [1, 1, 2, 3, 4, 4, 5, 6]

// 测试链表排序
console.log('\n2. 链表排序测试：');
const unsortedList = createListFromArray([4, 2, 1, 3]);
const sortedList = sortList(unsortedList);
console.log('排序结果:', listToArray(sortedList)); // [1, 2, 3, 4]

// 导出所有函数
module.exports = {
    createListFromArray,
    listToArray,
    hasCycle,
    detectCycle,
    findMiddle,
    isPalindrome,
    reverseList,
    mergeTwoLists,
    removeElements,
    swapPairs,
    removeNthFromEnd,
    rotateRight,
    partition,
    mergeKLists,
    sortList,
    getIntersectionNode
};