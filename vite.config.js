import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig(({ mode }) => {
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      // 你的代理配置完全不动
      proxy: {
        "/api": {
          target: "http://159.75.169.224:1235",
          changeOrigin: true,
        },
      },
      // 热更新配置完全不动
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
    // 环境区分的base配置，现在mode已经正确定义了
    base: mode === "production" ? "/ai-mental-health/" : "/",
  };
});
