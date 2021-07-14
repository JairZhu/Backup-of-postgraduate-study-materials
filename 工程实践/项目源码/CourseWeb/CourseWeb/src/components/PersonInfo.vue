<template>
  <div>
    <el-row type="flex" justify="space-around" style="margin-top: 30px">
      <el-card v-if="$store.state.isLogin" class="box-card" align="middle">
        <div slot="header" class="clearfix" >
          <h2>用户中心</h2>
          <div class="demo-image" align="center">

            <el-image class="headPhoto"
                      style="width: 100px; height: 100px; "
                      :src=this.$store.state.imgUrl
                      align="left"

            ></el-image>

            <el-upload
              class="upload-demo"
              drag
              :action="uploadPath"
              method="post"
              enctype="multipart/form-data"
              align="middle">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将新头像拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg文件，且不超过500kb</div>
            </el-upload>

          </div>


          <el-button style="float: right; padding: 3px 0" type="text" @click="updatePwd('ruleForm')" circle>修改密码</el-button>
        </div>


        <el-form :model="ruleForm" ref="ruleForm" label-width="70px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="ruleForm.name" disabled></el-input>
          </el-form-item>
          <el-form-item v-if="$store.state.isTeacher" label="职位">
            <el-input placeholder="教师" disabled></el-input>
          </el-form-item>
          <el-form-item v-else label="职位">
            <el-input placeholder="学生" disabled></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="ruleForm.password" type="password"></el-input>
          </el-form-item>

        </el-form>


      </el-card>
      <el-card v-else class="box-card" align="middle">
        <span>未登录</span>
      </el-card>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "PersonInfo",
  data() {
    return {
      ruleForm: {
        name: this.$store.state.user.name,
        password: this.$store.state.user.password,
        type: this.$store.state.user.type
      },
      uploadPath:'http://47.101.58.148:8090/uploadHeadPhoto/'+this.$store.state.user.name+'.jpg'
    };
  },
  methods:{
    updatePwd(formName) {
      this.$store.commit('setUser', this.ruleForm);
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post("http://47.101.58.148:8090/updatePwd", this.ruleForm).then(result => {
            if (result.data) {
              this.userLogin();
              this.$notify({
                title: '更改密码成功,请下次使用新密码登录',
                message: this.$store.state.user.name + '更改密码成功',
                type: 'success',
              })
            } else {
              this.userLogout();
              this.$notify.error({
                title: '更改失败，您未登录',
                message: '更改失败，您未登录',
              })
            }
          });
        }
      });
    },
  }
}


</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 1000px;
}
.headPhoto{
  border-radius: 30px;
}

</style>
