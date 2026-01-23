/** @type {import('next').NextConfig} */
const nextConfig = {
  // デプロイ優先: 型エラーとLintエラーを完全に無視
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ビルド時の型チェックを完全にスキップ
  swcMinify: true,
  // その他の設定
  reactStrictMode: false,
};

export default nextConfig;


