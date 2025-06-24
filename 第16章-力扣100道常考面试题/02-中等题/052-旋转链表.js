/**
 * LeetCode 61. 旋转链表
 *
 * 问题描述：
 * 给你一个链表的头节点 head ，旋转链表，将链表每个节点向右移动 k 个位置。
 *
 * 核心思想：
 * 1. 计算链表长度
 * 2. 将链表首尾相连形成环
 * 3. 找到新的尾节点位置
 * 4. 断开环形成新的链表
 *
 * 示例：
 * 输入：head = [1,2,3,4,5], k = 2
 * 输出：[4,5,1,2,3]
 */

// 链表节点定义
class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

/**
 * 旋转链表
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
function rotateRight(head, k) {
    // TODO: 实现旋转链表算法
    console.log("旋转链表算法待实现");
    return null;
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ListNode,
        rotateRight
    };
}