/**
 * 第18章 单调栈 - 基础实现
 * 
 * 本文件包含单调栈数据结构的核心实现，包括:
 * 1. 单调递增栈的封装
 * 2. 单调递减栈的封装
 * 3. 基础操作方法
 * 4. 简单应用示例
 */

/**
 * 单调栈基础类
 * @class MonotonicStack
 * @template T
 */
class MonotonicStack {
    /**
     * 创建一个单调栈实例
     * @param {('increasing'|'decreasing')} mode - 栈模式: increasing(递增)或decreasing(递减)
     * @param {boolean} [strict=true] - 是否严格单调
     */
    constructor(mode, strict = true) {
        this.stack = [];          // 存储栈元素
        this.mode = mode;         // 单调模式
        this.strict = strict;     // 是否严格单调
        this.size = 0;            // 栈大小
    }

    /**
     * 判断当前元素是否可以入栈
     * @private
     * @param {T} element - 待入栈元素
     * @returns {boolean} - 是否可以直接入栈
     */
    _canPush(element) {
        if (this.isEmpty()) return true;

        const topElement = this.peek();
        
        // 递增栈判断
        if (this.mode === 'increasing') {
            if (this.strict) {
                return element > topElement;
            } else {
                return element >= topElement;
            }
        }
        
        // 递减栈判断
        if (this.mode === 'decreasing') {
            if (this.strict) {
                return element < topElement;
            } else {
                return element <= topElement;
            }
        }
    }

    /**
     * 入栈操作
     * @param {T} element - 待入栈元素
     * @returns {T[]} - 被弹出的元素数组
     */
    push(element) {
        const poppedElements = [];
        
        // 当不能直接入栈时，弹出栈顶元素
        while (!this.isEmpty() && !this._canPush(element)) {
            poppedElements.push(this.pop());
        }
        
        // 当前元素入栈
        this.stack.push(element);
        this.size++;
        
        return poppedElements;
    }

    /**
     * 出栈操作
     * @returns {T} - 栈顶元素
     * @throws {Error} - 栈为空时抛出错误
     */
    pop() {
        if (this.isEmpty()) {
            throw new Error('Stack is empty');
        }
        
        this.size--;
        return this.stack.pop();
    }

    /**
     * 获取栈顶元素
     * @returns {T} - 栈顶元素
     * @throws {Error} - 栈为空时抛出错误
     */
    peek() {
        if (this.isEmpty()) {
            throw new Error('Stack is empty');
        }
        
        return this.stack[this.stack.length - 1];
    }

    /**
     * 判断栈是否为空
     * @returns {boolean} - 栈是否为空
     */
    isEmpty() {
        return this.size === 0;
    }

    /**
     * 清空栈
     */
    clear() {
        this.stack = [];
        this.size = 0;
    }

    /**
     * 获取栈的所有元素
     * @returns {T[]} - 栈元素数组
     */
    toArray() {
        return [...this.stack];
    }

    /**
     * 获取栈的字符串表示
     * @returns {string} - 栈的字符串表示
     */
    toString() {
        return `MonotonicStack(${this.mode}, ${this.strict ? 'strict' : 'non-strict'}): [${this.stack.join(', ')}]`;
    }
}

/**
 * 创建单调递增栈
 * @param {boolean} [strict=true] - 是否严格单调
 * @returns {MonotonicStack}
 */
function createIncreasingStack(strict = true) {
    return new MonotonicStack('increasing', strict);
}

/**
 * 创建单调递减栈
 * @param {boolean} [strict=true] - 是否严格单调
 * @returns {MonotonicStack}
 */
function createDecreasingStack(strict = true) {
    return new MonotonicStack('decreasing', strict);
}

/**
 * 寻找数组中每个元素的下一个更大元素
 * @param {number[]} nums - 输入数组
 * @returns {number[]} - 每个元素的下一个更大元素，不存在则为-1
 */
function nextGreaterElement(nums) {
    const stack = createDecreasingStack(); // 使用单调递减栈
    const result = new Array(nums.length).fill(-1);
    
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        
        // 当栈不为空且当前元素大于栈顶元素时
        while (!stack.isEmpty() && num > nums[stack.peek()]) {
            const topIndex = stack.pop();
            result[topIndex] = num;
        }
        
        stack.push(i);
    }
    
    return result;
}

/**
 * 寻找数组中每个元素的下一个更小元素
 * @param {number[]} nums - 输入数组
 * @returns {number[]} - 每个元素的下一个更小元素，不存在则为-1
 */
function nextSmallerElement(nums) {
    const stack = createIncreasingStack(); // 使用单调递增栈
    const result = new Array(nums.length).fill(-1);
    
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        
        // 当栈不为空且当前元素小于栈顶元素时
        while (!stack.isEmpty() && num < nums[stack.peek()]) {
            const topIndex = stack.pop();
            result[topIndex] = num;
        }
        
        stack.push(i);
    }
    
    return result;
}

// 导出模块
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        MonotonicStack,
        createIncreasingStack,
        createDecreasingStack,
        nextGreaterElement,
        nextSmallerElement
    };
}

// 示例使用
if (typeof window !== 'undefined') {
    window.MonotonicStackUtils = {
        MonotonicStack,
        createIncreasingStack,
        createDecreasingStack,
        nextGreaterElement,
        nextSmallerElement
    };

    // 演示代码
    console.log('===== 单调栈基础实现演示 =====');
    const incStack = createIncreasingStack();
    [3, 1, 2, 4, 0].forEach(num => {
        const popped = incStack.push(num);
        console.log(`入栈元素 ${num}，弹出元素:`, popped);
        console.log(incStack.toString());
    });

    console.log('\n===== 下一个更大元素演示 =====');
    const nums = [2, 1, 2, 4, 3];
    console.log('输入数组:', nums);
    console.log('下一个更大元素:', nextGreaterElement(nums));

    console.log('\n===== 下一个更小元素演示 =====');
    console.log('输入数组:', nums);
    console.log('下一个更小元素:', nextSmallerElement(nums));
}