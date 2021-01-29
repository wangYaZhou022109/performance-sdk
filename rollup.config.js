import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import { terser } from "rollup-plugin-terser"

const path = require('path')
const _resolve = dir => path.resolve(__dirname, './', dir)
const version = require('./package.json').version

const banner =
  '/**\n' +
  ` * performance.js v${version}\n` +
  ` * (c) ${new Date().getFullYear()} wangyazhou\n` +
  ' * Released under the ISC License.\n' +
  ' */'

const builds = [
  {
    file: _resolve(`dist/performance.cjs.js`),
    format: 'cjs',
    exports: 'default',
    banner,
    sourceMap: 'inline' // 线上debugger方便
  },
  {
    file: _resolve(`dist/performance.esm.js`),
    format: 'esm',
    banner,
    sourceMap: 'inline'
  },
  {
    file: _resolve(`dist/performance.umd.js`),
    format: 'umd',
    name: 'JYperformance',
    banner,
    sourceMap: 'inline'
  }
]
export default {
  input: _resolve('src/index.js'),
  output: [...builds],
  plugins: [
    resolve({
      jsnext: true,  // 该属性是指定将Node包转换为ES2015模块
    }),
    json(),
    terser(), // 压缩用
    commonjs(),
    babel({ 
      exclude: 'node_modules/**',
      runtimeHelpers: true
    }), // 只编译我们的源代码
  ]
}