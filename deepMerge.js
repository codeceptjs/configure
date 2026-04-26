import merge from 'lodash.mergewith'

function customizer(objValue, srcValue) {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
}

export default function deepMerge(a, b) {
  return merge(a, b, customizer)
}
