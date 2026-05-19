<template>
  <div class="container">
    <div class="title">
      <div class="back-home">
        <el-icon><Back /></el-icon>
        <span>返回首页</span>
      </div>
      <div class="title-text">
        <h2>登录您的账户</h2>
        <p>请输入您的登录信息</p>
      </div>
    </div>
    <div class="form-container">
      <!-- 登录表单 -->
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :rules="rules"
        label-position="top"
      >
        <!-- 表单域 -->
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名或邮箱"
            size="large"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            type="password"
            size="large"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button class="btn" type="primary" @click="submitForm(ruleFormRef)"
            >登录</el-button
          >
        </el-form-item>
        <p class="footer">
          还没有账号？<router-link to="/auth/register">注册</router-link>
        </p>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import { login } from "@/api/admin";
import { useRouter } from "vue-router";

const ruleFormRef = ref();
const formData = reactive({
  username: "",
  password: "",
});
const rules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
});
// 登录提交
const router = useRouter();
const submitForm = async (formEl) => {
  console.log("✅ 按钮点击成功，函数执行了！");

  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log(formData, "formData");

      login(formData)
        .then((data) => {
          if (!data || !data.token) {
            return console.error("登录失败");
          }

          // 1. 存 token
          localStorage.setItem("token", data.token);

          // 2. 存 userInfo（原汁原味地存进去，不要造假）
          localStorage.setItem("userInfo", JSON.stringify(data.userInfo));

          console.log("登录成功，当前用户信息：", data.userInfo);

          // 3. 🚨 核心逻辑：根据真实权限进行分流跳转
          if (data.userInfo.userType === 2) {
            // 如果是管理员，跳转到后台
            router.push("/back/dashboard");
          } else if (data.userInfo.userType === 1) {
            // 🚨 如果是普通用户，跳转到前台首页（或者你指定的前台页面）
            router.push("/");
          } else {
            // 兜底处理
            console.error("未知的用户类型：", data.userInfo.userType);
          }
        })
        .catch((err) => {
          console.error("登录请求异常：", err);
        });
    }
  });
};
</script>
<style scoped lang="scss">
.container {
  width: 384px;
  .back-home {
    margin-bottom: 60px;
  }
  .title {
    text-align: center;

    .title-text {
      h2 {
        font-size: 36px;
        margin-bottom: 10px;
      }
      p {
        font-size: 18px;
        color: #6b7280;
      }
    }
  }
  .form-container {
    margin-top: 40px;
    .btn {
      margin-top: 40px;
      width: 100%;
    }
    .footer {
      padding: 30px;
      text-align: center;
    }
  }
}
</style>
