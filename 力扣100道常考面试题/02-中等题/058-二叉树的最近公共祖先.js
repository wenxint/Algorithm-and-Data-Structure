/**
 * LeetCode 236. 二叉树的最近公共祖先
 *
 * 问题描述：
 * 给定一个二叉树, 找到该树中两个指定节点的最近公共祖先。
 *
 * 核心思想：
 * 1. 后序遍历（左右根），从下往上返回信息
 * 2. 如果在某个节点的左右子树中分别找到了p和q，那么该节点就是LCA
 * 3. 如果只在一侧找到，则返回找到的那个节点
 *
 * 示例：
 * 输入：root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1
 * 输出：3
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
 * 二叉树的最近公共祖先
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
function lowestCommonAncestor(root, p, q) {
    // TODO: 实现最近公共祖先算法
    console.log("最近公共祖先算法待实现");
    return null;
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TreeNode,
        lowestCommonAncestor
    };
}