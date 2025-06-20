/**
 * 第4章：哈希表 - 基础实现
 *
 * 本文件包含：
 * 1. 链地址法哈希表实现
 * 2. 开放地址法哈希表实现
 * 3. JavaScript内置Map和Set的增强使用
 * 4. 性能分析和测试用例
 *
 * @author Algorithm Tutorial
 * @date 2024
 */

// ==================== 哈希节点类 ====================

/**
 * 哈希表节点类
 * 用于链地址法中存储键值对
 */
class HashNode {
    constructor(key, value) {
        this.key = key;
        this.value = value;
        this.next = null;
    }
}

// ==================== 链地址法哈希表 ====================

/**
 * 使用链地址法处理冲突的哈希表
 *
 * 核心思想：
 * 每个桶维护一个链表，相同哈希值的元素存储在同一个链表中
 * 查找时需要遍历对应桶的链表
 */
class HashMapChaining {
    /**
     * 构造函数
     * @param {number} initialCapacity - 初始容量
     */
    constructor(initialCapacity = 16) {
        this.capacity = initialCapacity;
        this.size = 0;
        this.buckets = new Array(this.capacity).fill(null);
        this.loadFactorThreshold = 0.75;
    }

    /**
     * 哈希函数
     * @param {string} key - 键
     * @returns {number} 哈希值
     * @time O(k) - k为键的长度
     */
    _hash(key) {
        let hash = 0;
        const str = String(key);

        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) % this.capacity;
        }

        return hash < 0 ? hash + this.capacity : hash;
    }

    /**
     * 设置键值对
     * @param {*} key - 键
     * @param {*} value - 值
     * @time O(1) 平均情况，O(n) 最坏情况
     * @space O(1)
     */
    set(key, value) {
        const index = this._hash(key);

        if (!this.buckets[index]) {
            // 桶为空，直接创建新节点
            this.buckets[index] = new HashNode(key, value);
            this.size++;
        } else {
            // 桶中有元素，遍历链表
            let current = this.buckets[index];

            while (current) {
                if (current.key === key) {
                    // 键已存在，更新值
                    current.value = value;
                    return;
                }

                if (!current.next) {
                    // 到达链表末尾，添加新节点
                    current.next = new HashNode(key, value);
                    this.size++;
                    break;
                }

                current = current.next;
            }
        }

        // 检查是否需要扩容
        if (this.size > this.capacity * this.loadFactorThreshold) {
            this._resize();
        }
    }

    /**
     * 获取值
     * @param {*} key - 键
     * @returns {*} 值，不存在返回undefined
     * @time O(1) 平均情况，O(n) 最坏情况
     * @space O(1)
     */
    get(key) {
        const index = this._hash(key);
        let current = this.buckets[index];

        while (current) {
            if (current.key === key) {
                return current.value;
            }
            current = current.next;
        }

        return undefined;
    }

    /**
     * 检查键是否存在
     * @param {*} key - 键
     * @returns {boolean} 是否存在
     * @time O(1) 平均情况，O(n) 最坏情况
     * @space O(1)
     */
    has(key) {
        return this.get(key) !== undefined;
    }

    /**
     * 删除键值对
     * @param {*} key - 键
     * @returns {boolean} 是否删除成功
     * @time O(1) 平均情况，O(n) 最坏情况
     * @space O(1)
     */
    delete(key) {
        const index = this._hash(key);
        let current = this.buckets[index];

        if (!current) {
            return false;
        }

        // 删除第一个节点
        if (current.key === key) {
            this.buckets[index] = current.next;
            this.size--;
            return true;
        }

        // 删除后续节点
        while (current.next) {
            if (current.next.key === key) {
                current.next = current.next.next;
                this.size--;
                return true;
            }
            current = current.next;
        }

        return false;
    }

    /**
     * 获取负载因子
     * @returns {number} 负载因子
     */
    getLoadFactor() {
        return this.size / this.capacity;
    }

    /**
     * 扩容
     * @private
     * @time O(n) - 需要重新哈希所有元素
     * @space O(n) - 新的桶数组
     */
    _resize() {
        const oldBuckets = this.buckets;
        const oldCapacity = this.capacity;

        // 扩大容量为原来的2倍
        this.capacity *= 2;
        this.size = 0;
        this.buckets = new Array(this.capacity).fill(null);

        // 重新插入所有元素
        for (let i = 0; i < oldCapacity; i++) {
            let current = oldBuckets[i];

            while (current) {
                this.set(current.key, current.value);
                current = current.next;
            }
        }
    }

    /**
     * 获取所有键
     * @returns {Array} 所有键的数组
     * @time O(n)
     * @space O(n)
     */
    keys() {
        const keys = [];

        for (let i = 0; i < this.capacity; i++) {
            let current = this.buckets[i];

            while (current) {
                keys.push(current.key);
                current = current.next;
            }
        }

        return keys;
    }

    /**
     * 获取所有值
     * @returns {Array} 所有值的数组
     * @time O(n)
     * @space O(n)
     */
    values() {
        const values = [];

        for (let i = 0; i < this.capacity; i++) {
            let current = this.buckets[i];

            while (current) {
                values.push(current.value);
                current = current.next;
            }
        }

        return values;
    }

    /**
     * 清空哈希表
     * @time O(1)
     * @space O(1)
     */
    clear() {
        this.buckets = new Array(this.capacity).fill(null);
        this.size = 0;
    }

    /**
     * 转换为字符串
     * @returns {string} 字符串表示
     */
    toString() {
        const pairs = [];

        for (let i = 0; i < this.capacity; i++) {
            let current = this.buckets[i];

            while (current) {
                pairs.push(`${current.key}: ${current.value}`);
                current = current.next;
            }
        }

        return `HashMapChaining { ${pairs.join(', ')} }`;
    }
}

// ==================== 开放地址法哈希表 ====================

/**
 * 使用开放地址法（线性探测）处理冲突的哈希表
 *
 * 核心思想：
 * 发生冲突时，线性探测下一个位置，直到找到空位
 * 删除操作使用懒删除标记，避免破坏探测序列
 */
class HashMapOpenAddressing {
    /**
     * 构造函数
     * @param {number} initialCapacity - 初始容量
     */
    constructor(initialCapacity = 16) {
        this.capacity = initialCapacity;
        this.size = 0;
        this.keys = new Array(this.capacity).fill(null);
        this.values = new Array(this.capacity).fill(null);
        this.deleted = new Array(this.capacity).fill(false);
        this.loadFactorThreshold = 0.5; // 开放地址法需要更低的负载因子
    }

    /**
     * 哈希函数
     * @param {*} key - 键
     * @returns {number} 哈希值
     * @time O(k) - k为键的长度
     */
    _hash(key) {
        let hash = 0;
        const str = String(key);

        for (let i = 0; i < str.length; i++) {
            hash = (hash * 31 + str.charCodeAt(i)) % this.capacity;
        }

        return hash < 0 ? hash + this.capacity : hash;
    }

    /**
     * 查找键的位置
     * @param {*} key - 键
     * @returns {number} 键的位置，-1表示不存在
     * @private
     * @time O(1) 平均情况，O(n) 最坏情况
     */
    _findIndex(key) {
        let index = this._hash(key);

        while (this.keys[index] !== null) {
            if (this.keys[index] === key && !this.deleted[index]) {
                return index;
            }
            index = (index + 1) % this.capacity;
        }

        return -1;
    }

    /**
     * 设置键值对
     * @param {*} key - 键
     * @param {*} value - 值
     * @time O(1) 平均情况，O(n) 最坏情况
     * @space O(1)
     */
    set(key, value) {
        // 检查是否需要扩容
        if (this.size >= this.capacity * this.loadFactorThreshold) {
            this._resize();
        }

        let index = this._hash(key);

        // 线性探测
        while (this.keys[index] !== null &&
               (this.keys[index] !== key || this.deleted[index])) {
            index = (index + 1) % this.capacity;
        }

        // 如果是新键
        if (this.keys[index] === null || this.deleted[index]) {
            this.size++;
        }

        this.keys[index] = key;
        this.values[index] = value;
        this.deleted[index] = false;
    }

    /**
     * 获取值
     * @param {*} key - 键
     * @returns {*} 值，不存在返回undefined
     * @time O(1) 平均情况，O(n) 最坏情况
     * @space O(1)
     */
    get(key) {
        const index = this._findIndex(key);
        return index === -1 ? undefined : this.values[index];
    }

    /**
     * 检查键是否存在
     * @param {*} key - 键
     * @returns {boolean} 是否存在
     * @time O(1) 平均情况，O(n) 最坏情况
     * @space O(1)
     */
    has(key) {
        return this._findIndex(key) !== -1;
    }

    /**
     * 删除键值对（懒删除）
     * @param {*} key - 键
     * @returns {boolean} 是否删除成功
     * @time O(1) 平均情况，O(n) 最坏情况
     * @space O(1)
     */
    delete(key) {
        const index = this._findIndex(key);

        if (index === -1) {
            return false;
        }

        this.deleted[index] = true;
        this.size--;
        return true;
    }

    /**
     * 获取负载因子
     * @returns {number} 负载因子
     */
    getLoadFactor() {
        return this.size / this.capacity;
    }

    /**
     * 扩容
     * @private
     * @time O(n) - 需要重新哈希所有元素
     * @space O(n) - 新的数组
     */
    _resize() {
        const oldKeys = this.keys;
        const oldValues = this.values;
        const oldDeleted = this.deleted;
        const oldCapacity = this.capacity;

        // 扩大容量
        this.capacity *= 2;
        this.size = 0;
        this.keys = new Array(this.capacity).fill(null);
        this.values = new Array(this.capacity).fill(null);
        this.deleted = new Array(this.capacity).fill(false);

        // 重新插入所有未删除的元素
        for (let i = 0; i < oldCapacity; i++) {
            if (oldKeys[i] !== null && !oldDeleted[i]) {
                this.set(oldKeys[i], oldValues[i]);
            }
        }
    }

    /**
     * 转换为字符串
     * @returns {string} 字符串表示
     */
    toString() {
        const pairs = [];

        for (let i = 0; i < this.capacity; i++) {
            if (this.keys[i] !== null && !this.deleted[i]) {
                pairs.push(`${this.keys[i]}: ${this.values[i]}`);
            }
        }

        return `HashMapOpenAddressing { ${pairs.join(', ')} }`;
    }
}

// ==================== 增强的Map类 ====================

/**
 * 扩展JavaScript内置Map的功能
 * 提供更多实用方法
 */
class EnhancedMap extends Map {
    /**
     * 获取值，如果不存在则返回默认值
     * @param {*} key - 键
     * @param {*} defaultValue - 默认值
     * @returns {*} 值或默认值
     */
    getWithDefault(key, defaultValue) {
        return this.has(key) ? this.get(key) : defaultValue;
    }

    /**
     * 安全递增值
     * @param {*} key - 键
     * @param {number} delta - 增量，默认为1
     */
    increment(key, delta = 1) {
        this.set(key, (this.get(key) || 0) + delta);
    }

    /**
     * 安全递减值
     * @param {*} key - 键
     * @param {number} delta - 减量，默认为1
     */
    decrement(key, delta = 1) {
        this.set(key, (this.get(key) || 0) - delta);
    }

    /**
     * 批量设置键值对
     * @param {Array|Object} entries - 键值对数组或对象
     */
    setMultiple(entries) {
        if (Array.isArray(entries)) {
            for (const [key, value] of entries) {
                this.set(key, value);
            }
        } else {
            for (const [key, value] of Object.entries(entries)) {
                this.set(key, value);
            }
        }
    }

    /**
     * 根据条件过滤
     * @param {Function} predicate - 过滤函数
     * @returns {EnhancedMap} 新的过滤后的Map
     */
    filter(predicate) {
        const result = new EnhancedMap();

        for (const [key, value] of this) {
            if (predicate(value, key, this)) {
                result.set(key, value);
            }
        }

        return result;
    }

    /**
     * 映射值
     * @param {Function} mapper - 映射函数
     * @returns {EnhancedMap} 新的映射后的Map
     */
    map(mapper) {
        const result = new EnhancedMap();

        for (const [key, value] of this) {
            result.set(key, mapper(value, key, this));
        }

        return result;
    }

    /**
     * 转换为普通对象
     * @returns {Object} 普通对象
     */
    toObject() {
        return Object.fromEntries(this);
    }

    /**
     * 转换为数组
     * @returns {Array} 键值对数组
     */
    toArray() {
        return Array.from(this.entries());
    }

    /**
     * 从对象创建EnhancedMap
     * @param {Object} obj - 对象
     * @returns {EnhancedMap} 新的EnhancedMap实例
     * @static
     */
    static fromObject(obj) {
        return new EnhancedMap(Object.entries(obj));
    }
}

// ==================== 测试函数 ====================

/**
 * 测试链地址法哈希表
 */
function testHashMapChaining() {
    console.log("=== 链地址法哈希表测试 ===");

    const map = new HashMapChaining(4);

    // 测试基本操作
    map.set('apple', 10);
    map.set('banana', 5);
    map.set('orange', 8);
    map.set('grape', 12);

    console.log(`设置四个键值对后: ${map.toString()}`);
    console.log(`大小: ${map.size}, 负载因子: ${map.getLoadFactor().toFixed(2)}`);

    // 测试查找
    console.log(`apple: ${map.get('apple')}`);
    console.log(`banana: ${map.get('banana')}`);
    console.log(`不存在的键: ${map.get('kiwi')}`);

    // 测试更新
    map.set('apple', 15);
    console.log(`更新apple后: ${map.get('apple')}`);

    // 测试删除
    console.log(`删除banana: ${map.delete('banana')}`);
    console.log(`删除后大小: ${map.size}`);

    // 测试扩容（添加更多元素触发扩容）
    map.set('kiwi', 20);
    map.set('mango', 25);
    console.log(`扩容后容量: ${map.capacity}, 负载因子: ${map.getLoadFactor().toFixed(2)}`);

    console.log(`所有键: ${map.keys()}`);
    console.log(`所有值: ${map.values()}`);
}

/**
 * 测试开放地址法哈希表
 */
function testHashMapOpenAddressing() {
    console.log("\n=== 开放地址法哈希表测试 ===");

    const map = new HashMapOpenAddressing(4);

    // 测试基本操作
    map.set('a', 1);
    map.set('b', 2);
    map.set('c', 3);

    console.log(`设置三个键值对: ${map.toString()}`);
    console.log(`大小: ${map.size}, 负载因子: ${map.getLoadFactor().toFixed(2)}`);

    // 测试查找
    console.log(`a: ${map.get('a')}`);
    console.log(`不存在的键: ${map.get('z')}`);

    // 测试删除
    console.log(`删除b: ${map.delete('b')}`);
    console.log(`删除后: ${map.toString()}`);

    // 测试再次设置已删除的键
    map.set('b', 20);
    console.log(`重新设置b: ${map.toString()}`);
}

/**
 * 测试增强Map
 */
function testEnhancedMap() {
    console.log("\n=== 增强Map测试 ===");

    const map = new EnhancedMap();

    // 测试增强方法
    console.log(`默认值获取: ${map.getWithDefault('count', 0)}`);

    map.increment('count');
    map.increment('count', 5);
    console.log(`递增后count: ${map.get('count')}`);

    map.decrement('count', 2);
    console.log(`递减后count: ${map.get('count')}`);

    // 批量设置
    map.setMultiple([
        ['name', 'John'],
        ['age', 25],
        ['city', 'Beijing']
    ]);

    console.log(`批量设置后: ${JSON.stringify(map.toObject())}`);

    // 过滤和映射
    const filtered = map.filter((value, key) => typeof value === 'number');
    console.log(`过滤数字: ${JSON.stringify(filtered.toObject())}`);

    const mapped = map.map((value, key) => `${key}: ${value}`);
    console.log(`映射后: ${JSON.stringify(mapped.toObject())}`);
}

/**
 * 性能测试
 */
function performanceTest() {
    console.log("\n=== 性能测试 ===");

    const testSize = 10000;

    // 测试链地址法
    console.time("链地址法 - 插入");
    const chainMap = new HashMapChaining();
    for (let i = 0; i < testSize; i++) {
        chainMap.set(`key${i}`, i);
    }
    console.timeEnd("链地址法 - 插入");

    console.time("链地址法 - 查找");
    for (let i = 0; i < testSize; i++) {
        chainMap.get(`key${i}`);
    }
    console.timeEnd("链地址法 - 查找");

    // 测试开放地址法
    console.time("开放地址法 - 插入");
    const openMap = new HashMapOpenAddressing();
    for (let i = 0; i < testSize; i++) {
        openMap.set(`key${i}`, i);
    }
    console.timeEnd("开放地址法 - 插入");

    console.time("开放地址法 - 查找");
    for (let i = 0; i < testSize; i++) {
        openMap.get(`key${i}`);
    }
    console.timeEnd("开放地址法 - 查找");

    // 测试内置Map
    console.time("内置Map - 插入");
    const builtinMap = new Map();
    for (let i = 0; i < testSize; i++) {
        builtinMap.set(`key${i}`, i);
    }
    console.timeEnd("内置Map - 插入");

    console.time("内置Map - 查找");
    for (let i = 0; i < testSize; i++) {
        builtinMap.get(`key${i}`);
    }
    console.timeEnd("内置Map - 查找");

    console.log(`\n最终大小 - 链地址法: ${chainMap.size}, 开放地址法: ${openMap.size}, 内置Map: ${builtinMap.size}`);
}

// 运行所有测试
if (typeof require !== 'undefined' && require.main === module) {
    testHashMapChaining();
    testHashMapOpenAddressing();
    testEnhancedMap();
    performanceTest();

    console.log("\n=== 所有测试完成！ ===");
}

// 导出类供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HashNode,
        HashMapChaining,
        HashMapOpenAddressing,
        EnhancedMap
    };
}