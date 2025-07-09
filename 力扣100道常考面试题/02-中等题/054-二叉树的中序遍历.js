/**
 * LeetCode 94. 二叉树的中序遍历
 *
 * 问题描述：
 * 给定一个二叉树的根节点 root ，返回它的中序遍历。
 *
 * 核心思想：
 * 中序遍历的顺序是：左子树 -> 根节点 -> 右子树
 * 可以用递归或迭代（栈）两种方式实现
 *
 * 示例：
 * 输入：root = [1,null,2,3]
 * 输出：[1,3,2]
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
 * 中序遍历二叉树
 * @param {TreeNode} root
 * @return {number[]}
 */
function inorderTraversal(root) {
    // TODO: 实现中序遍历算法
    console.log("中序遍历算法待实现");
    return [];
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TreeNode,
        inorderTraversal
    };
}