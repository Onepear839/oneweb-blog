/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true // 保留图片不优化配置（可选，根据你的需求调整）
  },
  // 核心修改：改用 standalone 模式（支持动态路由、服务端渲染）
  output: 'standalone',
  // 移除之前添加的 output: 'export'
};

export default nextConfig;
