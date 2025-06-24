/**
 * LeetCode 199. 二叉树的右视图
 *
 * 问题描述：
 * 给定一个二叉树的根节点 root，想象自己站在它的右侧，按照从顶部到底部的顺序，
 * 返回从右侧所能看到的节点值。
 *
 * 核心思想：
 * 1. 层序遍历，取每层的最后一个节点
 * 2. 或者先序遍历（根右左），记录每层第一次访问的节点
 *
 * 示例：
 * 输入: [1,2,3,null,5,null,4]
 * 输出: [1,3,4]
 */

// 二叉树节点定义
class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * 二叉树的右视图
 * @param {TreeNode} root
 * @return {number[]}
 */
function rightSideView(root) {
    // TODO: 实现二叉树的右视图算法
    console.log("二叉树的右视图算法待实现");
    return [];
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TreeNode,
        rightSideView
    };
}