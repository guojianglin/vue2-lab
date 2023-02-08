/**
 * 深拷贝函数
 * @param {object | array} source 要复制的源数据
 * @return {object | array} 返回复制后的数据
 */
export function deepCopy (source, hash) {
  const sourceType = type(source);
  if (sourceType !== 'Object' && sourceType !== 'Array') {
    return new Error('不支持的数据类型');
  }
  // 声明要返回的对象或者数组
  const target = sourceType === 'Object' ? {} : [];
  // 用哈希表保存对象值以防止循环引用
  hash = hash || new WeakMap();
  // 如果存在于哈希表中直接返回
  if (hash.has(source)) {
    return hash.get(source);
  }
  // 设置哈希值
  hash.set(source, target);

  // 判断源数据类型
  if (sourceType === 'Object') {
    for (const key in source) {
      if (type(source[key]) === 'Object' || type(source[key]) === 'Array') {
        target[key] = deepCopy(source[key], hash);
      } else {
        target[key] = source[key];
      }
    }
  } else if (sourceType === 'Array') {
    // 这里可以使用 for in 直接对数组和对象进行兼容，
    // 但是数组使用 for in 会有一定的性能损耗
    // 数据量上万后会有明显的差异
    for (let i = 0; i < source.length; i++) {
      if (type(source[i]) === 'Object' || type(source[i]) === 'Array') {
        target[i] = deepCopy(source[i], hash);
      } else {
        target[i] = source[i];
      }
    }
  } else {
    // nothing to do
  }
  return target;
}

/**
* 判断某个值的类型
* @param {*} value 要判断类型的值
*/
function type (value) {
  return Object.prototype.toString.call(value).slice(8, -1);
}

export function getOffset (ele) {
  let element = ele;
  let top = 0;
  let left = 0;
  while (element) {
    top += element.offsetTop;
    left += element.offsetLeft;
    element = element.offsetParent;
  }
  return {
    left,
    top
  };
}