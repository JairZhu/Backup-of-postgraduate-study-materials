<template>
  <div>
    <el-row type="flex" justify="space-around" style="margin-top: 30px">
      <el-col :span="6"></el-col>
      <el-col :span="10">
        <el-card>
          <div slot="header">
            <i class="el-icon-chat-line-round"></i><span style="margin-left: 5px;">讨论主题</span>
          </div>
          <div v-for="i in $store.state.discussTitle" style="margin-bottom: 18px">
            <i class="el-icon-chat-round"></i>
            <el-button type="text" @click="showCommentByTitle(i)">{{i}}</el-button>
            <el-button v-if="$store.state.isTeacher" type="text" style="float: right" @click="deleteByTitle(i)"><i class="el-icon-delete"></i></el-button>
          </div>
          <div style="text-align: center">
            <el-button type="primary" icon="el-icon-chat-square" @click="dialog.visible=true">新增主题</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>
    <el-dialog title="添加主题" :visible.sync="dialog.visible" :before-close="handleClose">
      <el-form :model="dialog.form" :rules="rules" ref="dialog" label-width="80px">
        <el-form-item label="主题" prop="title">
          <el-input v-model="dialog.form.title" placeholder="请输入主题" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="dialog.form.content"></el-input>
        </el-form-item>
      </el-form>
      <div  slot="footer" style="text-align: right">
        <el-button @click="dialog.visible=false">取 消</el-button>
        <el-button @click="resetForm('dialog')">重 置</el-button>
        <el-button type="primary" @click="addDiscussTitle('dialog')">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DiscussTitle",
  data() {
    return {
      dialog: {
        visible: false,
        form: {
          title: '',
          content: '',
          writer: '',
          counterpart: '',
          time: '',
        }
      },
      rules: {
        title: [
          { required: true, message: '请输入主题', trigger: 'blur' },
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    deleteByTitle(title) {
            this.$confirm('确认删除？')
              .then(_ => {
                  this.$http.post("http://47.101.58.148:8090/deleteCommentByTitle", [title]).then(result => {
                      if (result.data) {
                          this.$notify({
                              type: "success",
                              title: "删除成功！"
                          });
                          this.$store.commit('setDiscussTitle', this.$store.state.discussTitle.filter(function (v) { return title !== v}));
                        }
                    })
                })
              .catch(_ => {});
    },
    showCommentByTitle(title) {
      this.$router.push({path: '/comment', query: { title: title}});
    },
    handleClose() {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.dialog.visible = false;
        })
        .catch(_ => {});
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    addDiscussTitle(formName) {
      if (this.$store.state.isLogin) {
        this.dialog.form.writer = this.$store.state.user.name;
        this.dialog.form.time = new Date();
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$http.post("http://47.101.58.148:8090/saveComment", this.dialog.form).then(result => {
              if (result.data) {
                this.$store.commit('addDiscussTitle', JSON.parse(JSON.stringify(this.dialog.form.title)));
                this.$message({
                  type: 'success',
                  message: '添加成功'
                })
              }
              this.dialog.visible = false;
            })
          }
        });
      } else {
        this.$message.error("请先登录！");
        this.$router.push('/mainPage');
      }
    }
  },
}
</script>

<style scoped>

</style>
