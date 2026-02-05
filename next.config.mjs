/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true // 保留图片不优化（静态导出必需）
  },
  // 新增这一行：启用静态导出，替代被移除的 next export 命令
  output: 'export',
  // 可选：如果之前有 output: 'standalone' 请确保已移除
};

export default nextConfig;
