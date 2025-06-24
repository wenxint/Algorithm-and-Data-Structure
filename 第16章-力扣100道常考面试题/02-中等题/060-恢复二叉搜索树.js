/**
 * LeetCode 99. 恢复二叉搜索树
 *
 * 问题描述：
 * 给你二叉搜索树的根节点 root ，该树中的恰好两个节点的值被错误地交换。
 * 请在不改变其结构的情况下，恢复这棵树。
 *
 * 核心思想：
 * 1. 中序遍历二叉搜索树，得到的序列应该是有序的
 * 2. 如果有两个节点被交换，中序遍历会出现两个逆序对
 * 3. 找到这两个被交换的节点，然后交换它们的值
 *
 * 示例：
 * 输入：root = [1,3,null,null,2]
 * 输出：[3,1,null,null,2]
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
 * 恢复二叉搜索树
 * @param {TreeNode} root
 * @return {void} Do not return anything, modify root in-place instead.
 */
function recoverTree(root) {
    // TODO: 实现恢复二叉搜索树算法
    console.log("恢复二叉搜索树算法待实现");
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TreeNode,
        recoverTree
    };
}