<template>
  <div>
    <el-row type="flex" justify="space-around" style="margin-top: 30px">
      <el-col :span="6"></el-col>
      <el-col :span="10">
        <el-card>
          <div style="line-height: 150%; white-space: pre-wrap; margin-bottom: 20px">
            <a>{{$store.state.courseInformation.content}}</a>
          </div>
          <div style="text-align: center;">
            <el-button v-if="$store.state.isTeacher" type="primary" @click="dialog.visible = true">编辑</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6"></el-col>
    </el-row>
    <el-dialog title="编辑教学大纲" :visible.sync="dialog.visible" :before-close="handleClose">
      <el-form :model="dialog.form" :rules="editDialogFormRules" ref="editDialogForm" label-width="80px">
        <el-form-item label="时间" prop="time">
          <el-date-picker v-model="dialog.form.time" type="datetime" placeholder="请选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="dialog.form.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button @click="resetInfo('editDialogForm')">重 置</el-button>
        <el-button type="primary" @click="editCourseInformation('editDialogForm')">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Syllabus",
  data() {
    return {
      dialog: {
        visible: false,
        form: {
          title: '',
          content: '',
          writer: '',
          time: ''
        }
      },
      editDialogFormRules: {
        time: [
          { required: true, message: '请选择日期时间', trigger: 'change'}
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur'}
        ]
      },
    }
  },
  methods: {
    handleClose() {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.dialog.visible = false;
        })
        .catch(_ => {});
    },
    editCourseInformation(formName) {
      this.dialog.form.writer = this.$store.state.user.name;
      this.dialog.form.title = this.$store.state.courseInformation.title;
      // console.log("editCourseInformation: ", this.dialog.form)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post("http://47.101.58.148:8090/deleteCourseInformation", [this.dialog.form.title]).then(result => {
            if (result.data) {
              this.$http.post("http://47.101.58.148:8090/saveCourseInformation", this.dialog.form).then(res => {
                if (res.data) {
                  this.$store.commit('setCourseInformation', JSON.parse(JSON.stringify(this.dialog.form)));
                  this.$notify({
                    type: "success",
                    title: "修改成功！"
                  });
                  this.dialog.visible = false;
                }
              })
            }
          })
        }
      })
    },
    resetInfo(formName) {
      this.$refs[formName].resetFields();
    }
  },
}
</script>

<style scoped>

</style>
