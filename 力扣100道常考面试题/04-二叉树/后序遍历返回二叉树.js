// 定义二叉树节点
class TreeNode {
  constructor(val = 0, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

/**
 * 根据后序遍历数组重建二叉搜索树
 * @param {number[]} posArr 后序遍历数组
 * @return {TreeNode} 重建后的树的根节点
 */
function buildBSTFromPostorder(posArr) {
  // 辅助递归函数
  function build(start, end) {
    if (start > end) return null; // 递归终止条件

    // 后序遍历的最后一个元素是当前子树的根节点
    let rootVal = posArr[end];
    let root = new TreeNode(rootVal);

    // 找到第一个比 rootVal 大的元素的位置，作为左右子树的分界
    let splitIndex = start;
    while (splitIndex < end && posArr[splitIndex] < rootVal) {
      splitIndex++;
    }

    // 递归构建左子树和右子树
    root.left = build(start, splitIndex - 1);       // 左子树范围 [start, splitIndex - 1]
    root.right = build(splitIndex, end - 1);        // 右子树范围 [splitIndex, end - 1]

    return root;
  }

  // 调用辅助函数，初始范围是整个数组
  return build(0, posArr.length - 1);
}
let posArr = [1, 3, 2, 5, 7, 6, 4];
let root = buildBSTFromPostorder(posArr);