import { createRouter, createWebHistory } from "vue-router";
import BackendLayout from "@/components/BackendLayout.vue";
import AuthLayout from "@/components/AuthLayout.vue";
import FrontendLayout from "@/components/FrontendLayout.vue";

//路由配置
const backendRoutes = [
  {
    path: "/back",
    redirect: "/back/dashboard",
    component: BackendLayout,
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/Dashboard.vue"),
        meta: {
          title: "数据分析",
          icon: "PieChart",
        },
      },
      {
        path: "knowledge",
        component: () => import("@/views/knowledge.vue"),
        meta: {
          title: "知识文章",
          icon: "ChatLineSquare",
        },
      },
      {
        path: "consultations",
        component: () => import("@/views/Consultations.vue"),
        meta: {
          title: "咨询管理",
          icon: "Message",
        },
      },
      {
        path: "emotion",
        component: () => import("@/views/emotion.vue"),
        meta: {
          title: "情绪日志",
          icon: "User",
        },
      },
    ],
  },
  {
    path: "/auth",
    component: AuthLayout,
    children: [
      {
        path: "login",
        component: () => import("@/views/Login.vue"),
        meta: {
          title: "登录",
        },
      },
      {
        path: "register",
        component: () => import("@/views/Register.vue"),
        meta: {
          title: "注册",
        },
      },
    ],
  },
];
const frontendRoutes = [
  {
    path: "/",
    component: FrontendLayout,
    children: [
      {
        path: "",
        component: () => import("@/views/home.vue"),
      },
      {
        path: "consultation",
        component: () => import("@/views/consultation.vue"),
      },
      {
        path: "emotion-diary",
        component: () => import("@/views/emotionDiary.vue"),
      },
      {
        path: "knowledge",
        component: () => import("@/views/frontendKnowledge.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [...backendRoutes, ...frontendRoutes],
});
// 路由守卫：检查登录状态
// 如果用户未登录，且尝试访问后台页面，跳转到登录页
// 如果用户已登录，且尝试访问登录页，跳转到后台首页
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  // 当前用户是否登录
  if (token) {
    // 获取并解析 userInfo
    const userInfoRaw = localStorage.getItem("userInfo");
    let userInfo = null;

    try {
      // 加上 try-catch 防止存在无效的 JSON 字符串导致解析直接崩溃
      userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : null;
    } catch (error) {
      console.error("解析用户信息失败:", error);
    }

    // 🚨 核心修复：如果存在 token，但是 userInfo 丢失或损坏，视为登录失效
    if (!userInfo) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      return next("/auth/login"); // 强制打回登录页
    }

    // 数据正常，开始判断权限
    if (userInfo.userType === 2) {
      // 如果是后台用户
      if (to.path.startsWith("/back")) {
        next();
      } else {
        next("/back/dashboard");
      }
    } else if (userInfo.userType === 1) {
      // 用户端账号只能访问前台路由
      if (to.path.startsWith("/back") || to.path.startsWith("/auth")) {
        next("/");
      } else {
        next(); // 🚨 关键修复：访问正常的前台页面，必须放行！
      }
    } else {
      // 未知用户类型兜底放行
      next();
    }
  } else {
    // 未登录状态
    if (to.path.startsWith("/back")) {
      // 如果是访问后台页面，那么跳转到登录页
      next("/auth/login");
    } else {
      // 访问 login 或 register 等公开页面，直接放行
      next();
    }
  }
});
export default router;
