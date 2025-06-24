/**
 * LeetCode 160. 相交链表
 *
 * 问题描述：
 * 给你两个单链表的头节点 headA 和 headB ，请你找出并返回两个单链表相交的起始节点。
 * 如果两个链表不存在相交节点，返回 null 。
 *
 * 核心思想：
 * 双指针：两个指针分别从两个链表开始，到达末尾后换到另一个链表继续
 * 如果相交，两指针会在相交点相遇
 *
 * 示例：
 * 输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,6,1,8,4,5], skipA = 2, skipB = 3
 * 输出：相交节点值为 8
 */

// 链表节点定义
class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

/**
 * 相交链表
 * @param {ListNode} headA
 * @param {ListNode} headB
 * @return {ListNode}
 */
function getIntersectionNode(headA, headB) {
    // TODO: 实现相交链表算法
    console.log("相交链表算法待实现");
    return null;
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ListNode,
        getIntersectionNode
    };
}