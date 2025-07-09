/**
 * LeetCode 142. 环形链表 II
 *
 * 问题描述：
 * 给定一个链表，返回链表开始入环的第一个节点。如果链表无环，则返回 null。
 *
 * 核心思想：
 * 1. 快慢指针检测环的存在
 * 2. 数学推导找到环的入口
 * 3. 从头和相遇点同时出发找入口
 *
 * 示例：
 * 输入：head = [3,2,0,-4], pos = 1
 * 输出：返回索引为1的链表节点
 */

// 链表节点定义
class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

/**
 * 找到环的入口节点
 * @param {ListNode} head
 * @return {ListNode}
 */
function detectCycle(head) {
    // TODO: 实现环形链表II算法
    console.log("环形链表II算法待实现");
    return null;
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ListNode,
        detectCycle
    };
}