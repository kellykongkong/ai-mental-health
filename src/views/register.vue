<template>
  <div class="container">
    <div class="title">
      <div class="title-text">
        <h2>创建您的账户</h2>
        <p>请填写注册信息</p>
      </div>
    </div>
    <div class="form-container">
      <el-form
        label-position="top"
        :model="formData"
        :rules="rules"
        ref="submitFormRef"
      >
        <el-form-item label="用户名或邮箱" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
            size="large"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱"
            size="large"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input
            v-model="formData.nickname"
            placeholder="请输入昵称"
            size="large"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号"
            size="large"
          />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
          type="password"
          show-password
        >
          <el-input
            v-model="formData.password"
            placeholder="请输入密码"
            size="large"
          />
        </el-form-item>
        <el-form-item
          label="确认密码"
          prop="confirmPassword"
          type="password"
          show-password
        >
          <el-input
            v-model="formData.confirmPassword"
            placeholder="请再次确认密码"
            size="large"
          />
        </el-form-item>
        <el-button
          type="primary"
          size="large"
          @click="submitForm(submitFormRef)"
          class="btn"
        >
          注册
        </el-button>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive } from "vue";
import { register } from "@/api/frontend";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const formData = reactive({
  username: "",
  email: "",
  nickname: "",
  phone: "",
  password: "",
  confirmPassword: "",
  gender: 0, // 性别
  userType: 1, // 1为普通用户
});
const rules = reactive({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "请输入确认密码", trigger: "blur" },
  ],
});

// 表单提交
const router = useRouter();
const submitFormRef = ref(null);
const submitForm = async (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    if (!valid) {
      ElMessage.error("请检查表单填写是否正确");
      return;
    }
    register(formData)
      .then((res) => {
        console.log("后端返回完整响应:", res);

        if (!res) {
          ElMessage.error("注册失败：服务器无响应");
          return;
        }

        // 🚨 核心修复：自动脱去 Axios 的外套（如果有的话）
        // 如果 res 里有 data，就用 res.data；否则说明没穿外套，直接用 res
        const responseData = res.data || res;

        // 现在我们拿脱掉外套后的 responseData 来判断
        if (
          responseData.code === "200" ||
          responseData.code === 200 ||
          responseData.success === true
        ) {
          ElMessage.success("注册成功");
          router.push("/auth/login");
        } else if (responseData.code === "BUSINESS_ERROR") {
          ElMessage.error(
            responseData.message || responseData.msg || "注册失败",
          );
        } else {
          ElMessage.error(responseData.message || "注册失败，请重试");
        }
      })
      .catch((err) => {
        console.error("注册请求错误:", err);
        ElMessage.error("网络请求失败，请检查后端服务");
      });
  });
};
</script>
<style lang="scss" scoped>
.container {
  width: 384px;
  .flex-box {
    display: flex;
    align-items: center;
  }
  .title {
    .title-text {
      text-align: center;
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
    margin-top: 30px;
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
