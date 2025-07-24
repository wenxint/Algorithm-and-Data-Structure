/**
 * LeetCode 162. 寻找峰值
 *
 * 问题描述：
 * 峰值元素是指其值严格大于左右相邻值的元素。
 * 给你一个整数数组 nums，找到峰值元素并返回其索引。数组可能包含多个峰值，在这种情况下，返回任何一个峰值所在位置即可。
 *
 * 你可以假设 nums[-1] = nums[n] = -∞。
 * 你必须实现时间复杂度为 O(log n) 的算法。
 *
 * 核心思想：
 * 二分查找 - 根据中点与相邻元素的关系确定搜索方向
 * 关键观察：如果 nums[mid] < nums[mid+1]，那么右侧必定存在峰值
 * 因为要么 nums[mid+1] 就是峰值，要么在右侧的上升过程中会找到峰值
 *
 * 算法步骤：
 * 1. 使用二分查找，比较中点与右邻居的大小关系
 * 2. 如果 nums[mid] < nums[mid+1]，说明右侧有上升趋势，峰值在右侧
 * 3. 如果 nums[mid] > nums[mid+1]，说明左侧有上升趋势或mid就是峰值，峰值在左侧
 * 4. 继续二分直到找到峰值
 *
 * 示例：
 * 输入：nums = [1,2,3,1]  ->  输出：2 (元素3是峰值)
 * 输入：nums = [1,2,1,3,5,6,4]  ->  输出：1或5 (元素2或6都是峰值)
 */

/**
 * 方法一：二分查找（最优解）
 *
 * 核心思想：
 * 利用峰值的性质进行二分查找。关键在于：
 * - 如果中点比右邻居小，右侧必有峰值
 * - 如果中点比右邻居大，左侧必有峰值或中点就是峰值
 *
 * @param {number[]} nums - 输入数组
 * @return {number} 峰值的索引
 * @time O(log n) - 二分查找
 * @space O(1) - 只使用常数额外空间
 */
function findPeakElement(nums) {
    let left = 0;
    let right = nums.length - 1;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);

        // 关键判断：比较中点与右邻居
        if (nums[mid] < nums[mid + 1]) {
            // 右侧有上升趋势，峰值在右侧
            left = mid + 1;
        } else {
            // 左侧有上升趋势或mid就是峰值，峰值在左侧（包括mid）
            right = mid;
        }
    }

    return left; // left === right，即峰值位置
}

/**
 * 方法二：线性扫描（简单但不符合时间复杂度要求）
 *
 * 核心思想：
 * 从左到右扫描，找到第一个满足峰值条件的元素
 *
 * @param {number[]} nums - 输入数组
 * @return {number} 峰值的索引
 * @time O(n) - 线性扫描
 * @space O(1) - 只使用常数额外空间
 */
function findPeakElementLinear(nums) {
    const n = nums.length;

    // 特殊情况处理
    if (n === 1) return 0;

    // 检查第一个元素
    if (nums[0] > nums[1]) return 0;

    // 检查最后一个元素
    if (nums[n - 1] > nums[n - 2]) return n - 1;

    // 检查中间元素
    for (let i = 1; i < n - 1; i++) {
        if (nums[i] > nums[i - 1] && nums[i] > nums[i + 1]) {
            return i;
        }
    }

    return -1; // 理论上不会到达这里
}

/**
 * 方法三：递归二分查找
 *
 * 核心思想：
 * 用递归的方式实现二分查找，逻辑更清晰
 *
 * @param {number[]} nums - 输入数组
 * @return {number} 峰值的索引
 * @time O(log n) - 二分查找
 * @space O(log n) - 递归栈空间
 */
function findPeakElementRecursive(nums) {
    return binarySearchPeak(nums, 0, nums.length - 1);
}

function binarySearchPeak(nums, left, right) {
    if (left === right) {
        return left;
    }

    const mid = Math.floor((left + right) / 2);

    if (nums[mid] < nums[mid + 1]) {
        // 峰值在右侧
        return binarySearchPeak(nums, mid + 1, right);
    } else {
        // 峰值在左侧（包括mid）
        return binarySearchPeak(nums, left, mid);
    }
}

// 测试用例
function testFindPeakElement() {
    console.log("=== 寻找峰值算法测试 ===\n");

    const testCases = [
        {
            nums: [1, 2, 3, 1],
            description: "标准测试用例"
        },
        {
            nums: [1, 2, 1, 3, 5, 6, 4],
            description: "多个峰值"
        },
        {
            nums: [1],
            description: "单个元素"
        },
        {
            nums: [1, 2],
            description: "两个元素，递增"
        },
        {
            nums: [2, 1],
            description: "两个元素，递减"
        },
        {
            nums: [1, 2, 3, 4, 5],
            description: "完全递增序列"
        },
        {
            nums: [5, 4, 3, 2, 1],
            description: "完全递减序列"
        },
        {
            nums: [1, 3, 2, 4, 1],
            description: "山峰形状"
        }
    ];

    testCases.forEach(({ nums, description }, index) => {
        console.log(`测试用例 ${index + 1}: ${description}`);
        console.log(`输入数组: [${nums.join(', ')}]`);

        const result1 = findPeakElement([...nums]);
        const result2 = findPeakElementLinear([...nums]);
        const result3 = findPeakElementRecursive([...nums]);

        console.log(`二分查找结果: 索引 ${result1}, 值 ${nums[result1]}`);
        console.log(`线性扫描结果: 索引 ${result2}, 值 ${nums[result2]}`);
        console.log(`递归二分结果: 索引 ${result3}, 值 ${nums[result3]}`);

        // 验证结果是否为峰值
        const isPeak = (arr, idx) => {
            const n = arr.length;
            const left = idx === 0 ? -Infinity : arr[idx - 1];
            const right = idx === n - 1 ? -Infinity : arr[idx + 1];
            return arr[idx] > left && arr[idx] > right;
        };

        console.log(`验证: ${isPeak(nums, result1) ? '✓' : '✗'} 结果正确`);
        console.log("---");
    });
}

// 性能测试
function performanceTest() {
    console.log("=== 性能测试 ===\n");

    const sizes = [1000, 10000, 100000];

    sizes.forEach(size => {
        // 生成测试数据：创建有多个峰值的数组
        const nums = [];
        for (let i = 0; i < size; i++) {
            nums.push(Math.floor(Math.random() * 1000));
        }

        console.log(`数组大小: ${size}`);

        // 测试二分查找
        const start1 = performance.now();
        const result1 = findPeakElement([...nums]);
        const end1 = performance.now();
        console.log(`二分查找: ${(end1 - start1).toFixed(4)}ms, 结果索引: ${result1}`);

        // 测试线性扫描（仅对较小数组）
        if (size <= 10000) {
            const start2 = performance.now();
            const result2 = findPeakElementLinear([...nums]);
            const end2 = performance.now();
            console.log(`线性扫描: ${(end2 - start2).toFixed(4)}ms, 结果索引: ${result2}`);
        }

        console.log("---");
    });
}

// 算法可视化演示
function visualizeBinarySearch() {
    console.log("=== 二分查找过程可视化 ===\n");

    const nums = [1, 2, 1, 3, 5, 6, 4];
    console.log(`目标数组: [${nums.join(', ')}]`);
    console.log("寻找峰值的二分查找过程：\n");

    let left = 0;
    let right = nums.length - 1;
    let step = 1;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);

        console.log(`步骤 ${step}:`);
        console.log(`  当前范围: [${left}, ${right}]`);
        console.log(`  中点: ${mid}, 值: ${nums[mid]}`);
        console.log(`  右邻居: ${mid + 1}, 值: ${nums[mid + 1]}`);

        if (nums[mid] < nums[mid + 1]) {
            console.log(`  ${nums[mid]} < ${nums[mid + 1]}, 峰值在右侧`);
            left = mid + 1;
        } else {
            console.log(`  ${nums[mid]} >= ${nums[mid + 1]}, 峰值在左侧`);
            right = mid;
        }

        console.log(`  新范围: [${left}, ${right}]\n`);
        step++;
    }

    console.log(`最终结果: 索引 ${left}, 值 ${nums[left]}`);
}

// 运行测试
if (require.main === module) {
    testFindPeakElement();
    performanceTest();
    visualizeBinarySearch();
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        findPeakElement,
        findPeakElementLinear,
        findPeakElementRecursive
    };
}