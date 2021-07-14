<template>
  <div>
    <el-row type="flex" justify="space-around" style="margin-top: 30px">
      <el-col :span="6">
        <el-card v-if="$store.state.isLogin" style="margin-bottom: 10px">
          <div slot="header">
            <i class="el-icon-user"></i>
            <span style="margin-left: 5px;">个人中心</span>
          </div>
          <div>
            <div style="text-align: center">
              <el-image class="headPhoto" :src="$store.state.imgUrl" :fit="'contain'" style="width: 100px; height: 100px;"></el-image><br>
              <!--              <span>{{$store.state.user.name}}</span><br>-->
              <el-button type="danger" @click="userLogout" style="margin-top: 10px" round>退出</el-button>
            </div>
          </div>
        </el-card>
        <el-card v-else style="margin-bottom: 10px">
          <div slot="header">
            <i class="el-icon-user"></i>
            <span style="margin-left: 5px;">用户登录</span>
          </div>
          <div>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" class="demo-ruleForm">
              <el-form-item label="用户名" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password" type="password"></el-input>
              </el-form-item>
              <el-form-item label="类型" prop="type">
                <el-select v-model="ruleForm.type" placeholder="请选择类型">
                  <el-option label="学生" value="false"></el-option>
                  <el-option label="老师" value="true"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="success" icon="el-icon-check" @click="submitForm('ruleForm')" circle></el-button>
                <el-button type="danger" icon="el-icon-close" @click="resetForm('ruleForm')" circle></el-button>
                <el-button type="primary" icon="el-icon-plus" @click="loginForm('ruleForm')" circle></el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
        <el-card v-if="$store.state.isTeacher">
          <div slot="header">
            <i class="el-icon-document-checked"></i>
            <span style="margin-left: 5px">作业查看</span>
          </div>
          <div>
            <div v-for="i in $store.state.homeworks" style="margin-bottom: 18px">
              <i class="el-icon-document"></i>
              <el-button type="text" @click="showHomeworkDrawer(i)">{{i.title}}</el-button>
            </div>
          </div>
        </el-card>
        <el-card v-else>
          <div slot="header">
            <i class="el-icon-upload"></i>
            <span style="margin-left: 5px">作业上传</span>
          </div>
          <div>
            <el-form :model="homeworkForm" :rules="editDialogFormRules" ref="homeworkForm" label-width="70px">
              <el-form-item label="标题" prop="title">
                <el-input v-model="homeworkForm.title" placeholder="请输入标题"></el-input>
              </el-form-item>
              <el-form-item label="内容" prop="content">
                <el-input type="textarea" :row="2" placeholder="请输入内容" v-model="homeworkForm.content"></el-input>
              </el-form-item>
              <el-form-item label="文件">
                <el-upload
                  action="http://47.101.58.148:8090/uploadFile/homework"
                  accept=".pdf"
                  :before-upload="handleHomeworkUpload"
                  :before-remove="handleHomeworkRemove"
                  :limit="1"
                  :disabled="!$store.state.isLogin">
                  <el-button size="small" type="primary" :disabled="!$store.state.isLogin">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传pdf文件，且不超过20MB</div>
                </el-upload>
              </el-form-item>
              <el-form-item label="时间" prop="time">
                <el-date-picker v-model="homeworkForm.time" type="datetime" placeholder="请选择日期时间" style="width: 200px"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitHomework('homeworkForm')" :disabled="!$store.state.isLogin">立即提交</el-button>
                <el-button @click="resetForm('homeworkForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card style="margin-bottom: 10px">
          <div slot="header">
            <i class="el-icon-news"></i>
            <span style="margin-left: 5px;">新闻</span>
            <span v-if="$store.state.isTeacher" style="float: right">
              <el-button type="text" @click="editInfo('编辑新闻', $store.state.news)">编辑</el-button>
            </span>
          </div>
          <div v-for="i in $store.state.news" style="margin-bottom: 18px">
            <i class="el-icon-link"></i>
            <el-button type="text" @click="getDrawerInfo(i)">{{i.title}}</el-button>
          </div>
        </el-card>
        <el-card>
          <div slot="header">
            <i class="el-icon-bell"></i>
            <span style="margin-left: 5px;">通知</span>
            <span v-if="$store.state.isTeacher" style="float: right">
              <el-button type="text" @click="editInfo('编辑通知', $store.state.notifications)">编辑</el-button>
            </span>
          </div>
          <div v-for="i in $store.state.notifications" style="margin-bottom: 18px">
            <i class="el-icon-position"></i>
            <el-button type="text" @click="getDrawerInfo(i)">{{i.title}}</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card style="margin-bottom: 10px">
          <div slot="header">
            <i class="el-icon-edit-outline"></i>
            <span style="margin-left: 5px;">最新作业列表</span>
            <span v-if="$store.state.isTeacher" style="float: right">
              <el-button type="text" @click="editInfo('编辑作业', $store.state.assignments)">编辑</el-button>
            </span>
          </div>
          <div v-for="i in $store.state.assignments" style="margin-bottom: 18px">
            <i class="el-icon-notebook-1"></i>
            <el-button type="text" @click="getDrawerInfo(i)">{{i.title}}</el-button>
          </div>
        </el-card>
        <el-card>
          <div slot="header">
            <i class="el-icon-document-copy"></i>
            <span style="margin-left: 5px">课件下载</span>
            <span v-if="$store.state.isTeacher" style="float: right">
              <el-button type="text" @click="editInfo('编辑课件', $store.state.ppts)">编辑</el-button>
            </span>
          </div>
          <div v-for="i in $store.state.ppts" style="margin-bottom: 18px">
            <i class="el-icon-tickets"></i>
            <el-link type="primary" :href="'http://47.101.58.148:8090/downloadFile/ppt/'+ i.title">{{i.title}}</el-link>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-drawer :title="showDrawer.title" :visible.sync="showDrawer.visible" :direction="'ltr'" size="50%">
      <div style="margin-left: 20px; margin-right: 20px;margin-bottom: 20px">
        <span>作者：{{showDrawer.content.writer}}</span><br><br>
        <span style="line-height: 150%; white-space: pre-wrap">{{showDrawer.content.content}}</span>
      </div>
    </el-drawer>
    <el-drawer :title="variousDrawers.title" :visible.sync="variousDrawers.visible" :direction="'ltr'">
      <div style="margin-left: 20px">
        <el-checkbox-group v-model="checkList" style="">
          <span v-for="i in variousDrawers.content">
            <el-checkbox  :label="i.title"></el-checkbox> <br>
          </span>
        </el-checkbox-group>
        <div style="text-align: center;margin-top: 10px">
          <el-button type="text" icon="el-icon-plus" style="margin-right: 30px;" @click="showEditDialog(variousDrawers.title)" circle></el-button>
          <el-popover placement="top" v-model="popoverVisible">
            <p>
              <i class="el-icon-info" style="color: red"></i>
              <span style="margin-left: 3px">确定删除吗？</span>
            </p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="popoverVisible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="deleteInfo(variousDrawers.title, checkList)">确定</el-button>
            </div>
            <el-button slot="reference" type="text" icon="el-icon-delete" circle></el-button>
          </el-popover>
        </div>
      </div>
    </el-drawer>
    <el-drawer :title="homeworkDrawer.title" :visible.sync="homeworkDrawer.visible" :direction="'rtl'">
      <div style="margin-left: 20px; margin-right: 20px;margin-bottom: 20px">
        <span>作者：{{homeworkDrawer.writer}}</span> <br><br>
        <!--        <p style="text-indent: 20px">{{homeworkDrawer.time}}</p>-->
        <span style="line-height: 150%; white-space: pre-wrap">内容：{{homeworkDrawer.content}}</span><br><br>
        文件：<el-link type="primary" :href="'http://47.101.58.148:8090/downloadFile/homework/'+ homeworkDrawer.fileName">{{homeworkDrawer.fileName}}</el-link><br><br>
        分数：<el-input v-model="homeworkDrawer.score" placeholder="请输入分数" style="width: 120px" oninput="value=value.replace(/[^\d]/g,'')" clearable></el-input><br><br>
        <div style="text-align: center">
          <el-button type="primary" @click="updateScore(homeworkDrawer)" round>确认</el-button>
        </div>
      </div>
    </el-drawer>
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" @close="dialog.isPPT = false" :before-close="handleClose">
      <el-form :model="dialog.form" :rules="editDialogFormRules" ref="editDialogForm" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="dialog.form.title" placeholder="请输入标题" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="时间" prop="time">
          <el-date-picker v-model="dialog.form.time" type="datetime" placeholder="请选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="文件" v-if="dialog.isPPT">
          <el-upload action="http://47.101.58.148:8090/uploadFile/ppt" :limit="1" :before-upload="handlePPTUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传单个文件，且不超过20MB</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" :row="4" placeholder="请输入内容" v-model="dialog.form.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button @click="resetForm('editDialogForm')">重 置</el-button>
        <el-button type="primary" @click="addInfo('editDialogForm', dialog)">添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "MainPage",
  data() {
    return {
      imgUrl: '',
      checkList: [],
      popoverVisible: false,
      homeworkDrawer: {
        title: '',
        visible: false,
        content: '',
        writer: '',
        time: '',
        fileName: '',
        score: '',
      },
      showDrawer: {
        visible: false,
        title: '',
        content: '',
      },
      variousDrawers: {
        visible: false,
        title: '',
        content: '',
      },
      dialog: {
        title: '',
        visible: false,
        isPPT: false,
        form: {
          title: '',
          content: '',
          writer: '',
          time: ''
        }
      },
      homeworkForm: {
        title: '',
        content: '',
        fileName: '',
        writer: '',
        time: ''
      },
      ruleForm: {
        name: '',
        password: '',
        type: null,
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
      },
      editDialogFormRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
        ],
        time: [
          { required: true, message: '请选择日期时间', trigger: 'change'}
        ],
        content: [
          { required: true, message: '请输入内容', trigger: 'blur'}
        ]
      },
    };
  },
  methods: {
    userLogout() {
      this.$store.commit('setIsLogin', false);
      this.$store.commit('setTeacher', false);
      this.$store.commit('setUser', {
        name: '',
        password: '',
        type: false,
      });
      localStorage.setItem("isLogin", JSON.stringify(false));
      localStorage.setItem("isTeacher", JSON.stringify(false));
      localStorage.setItem("user", JSON.stringify({
        name: '',
        password: '',
        type: false,
      }));
    },
    userLogin() {
      this.$store.commit('setIsLogin', true);
      this.$store.commit('setTeacher', (this.ruleForm.type === 'true'));
      this.$store.commit('setUser', this.ruleForm);
      localStorage.setItem("isLogin", JSON.stringify(this.$store.state.isLogin));
      localStorage.setItem("isTeacher", JSON.stringify(this.$store.state.isTeacher));
      localStorage.setItem("user", JSON.stringify(this.$store.state.user));
    },
    handleClose() {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.dialog.visible = false;
        })
        .catch(_ => {});
    },
    showHomeworkDrawer(item) {
      this.homeworkDrawer = {
        title: item.title,
        content: item.content,
        visible: true,
        writer: item.writer,
        fileName: item.fileName,
        time: item.time,
        score: item.score
      }
    },
    editInfo(title, items) {
      this.variousDrawers = {
        visible: true,
        title: title,
        content: items,
      }
    },
    getDrawerInfo(item) {
      this.showDrawer = {
        visible: true,
        title: item.title,
        content: item
      }
      // console.log("getDrawerInfo: ", this.drawerContent);
    },
    showEditDialog(title) {
      this.dialog.title = title;
      this.dialog.visible = true;
      if (title === "编辑课件")
        this.dialog.isPPT = true;
      // console.log("showEditDialog:", this.dialog);
    },
    updateAddInfo(res, args) {
      if (res.data) {
        this.$store.commit(args.type, args.data);
        this.$message({
          type: 'success',
          message: '添加成功',
        });
      } else {
        this.$message.error("添加失败！标题不能重复！")
      }
      this.dialog.visible = false;
      this.variousDrawers.visible = false;
    },
    addInfo(formName, dialog) {
      dialog.form.writer = this.$store.state.user.name;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (dialog.title === "编辑新闻") {
            this.$http.post("http://47.101.58.148:8090/saveNews", dialog.form).then(result => {
              this.updateAddInfo(result, {
                type: 'addNews',
                data: JSON.parse(JSON.stringify(dialog.form))
              })
            })
          } else if (dialog.title === "编辑通知") {
            this.$http.post("http://47.101.58.148:8090/saveNotification", dialog.form).then(result => {
              this.updateAddInfo(result, {
                type: 'addNotification',
                data: JSON.parse(JSON.stringify(dialog.form))
              })
            })
          } else if (dialog.title === "编辑作业") {
            this.$http.post("http://47.101.58.148:8090/saveAssignment", dialog.form).then(result => {
              this.updateAddInfo(result, {
                type: 'addAssignment',
                data: JSON.parse(JSON.stringify(dialog.form))
              })
            })
          } else if (dialog.title === "编辑课件") {
            this.$http.post("http://47.101.58.148:8090/savePPT", dialog.form).then(result => {
              this.updateAddInfo(result, {
                type: 'addPPT',
                data: JSON.parse(JSON.stringify(dialog.form))
              })
            })
          }
        }
      });
    },
    updateDeleteInfo(result, args) {
      if (result.data) {
        this.$store.commit(args.type, args.array.filter(function (v) {return args.checkList.indexOf(v.title) === -1}))
        this.$message({
          message: "删除成功！",
          type: 'success'
        });
      } else {
        this.$message.error("删除失败！");
      }
      this.popoverVisible = false;
      this.variousDrawers.visible = false;
      args.checkList = [];
    },
    deleteInfo(type, checkList) {
      if (type === '编辑新闻') {
        this.$http.post("http://47.101.58.148:8090/deleteNews", checkList).then(result => {
          this.updateDeleteInfo(result, {
            type: 'setNews',
            array: this.$store.state.news,
            checkList: checkList
          })
        });
      } else if (type === '编辑通知') {
        this.$http.post("http://47.101.58.148:8090/deleteNotification", checkList).then(result => {
          this.updateDeleteInfo(result, {
            type: 'setNotifications',
            array: this.$store.state.notifications,
            checkList: checkList
          })
        });
      } else if (type === '编辑作业') {
        this.$http.post("http://47.101.58.148:8090/deleteAssignment", checkList).then(result => {
          this.updateDeleteInfo(result, {
            type: 'setAssignments',
            array: this.$store.state.assignments,
            checkList: checkList
          });
        });
      } else if (type === '编辑课件') {
        this.$http.post("http://47.101.58.148:8090/deletePPT", checkList).then(result => {
          this.updateDeleteInfo(result, {
            type: 'setPPTs',
            array: this.$store.state.ppts,
            checkList: checkList
          });
        });
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // console.log("submitForm: ", this.ruleForm);
          this.$http.post("http://47.101.58.148:8090/postUser", this.ruleForm).then(result => {
            if (result.data) {
              this.userLogin();
              this.$notify({
                title: '登录成功',
                message: this.$store.state.user.name + '，欢迎！',
                type: 'success',
              });
            } else {
              this.userLogout();
              this.$notify.error({
                title: '登录失败',
                message: '账号、密码或类型错误！',
              });
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    loginForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post("http://47.101.58.148:8090/saveUser", this.ruleForm).then(result => {
            if (result.data) {
              this.userLogin();
              this.$notify({
                title: '注册成功',
                message: this.$store.state.user.name + '，欢迎！',
                type: 'success',
              })
            } else {
              this.userLogout();
              this.$notify.error({
                title: '注册失败',
                message: '用户已存在！',
              })
            }
          });
        }
      });
    },
    submitHomework(formName) {
      this.$refs[formName].validate((valid) => {
        if (this.$store.state.isLogin) {
          this.homeworkForm.writer = this.$store.state.user.name;
          if (valid) {
            // console.log("homeworkForm:", this.homeworkForm);
            this.$http.post("http://47.101.58.148:8090/saveHomework", this.homeworkForm).then(result => {
              if (result.data) {
                this.$store.commit('addHomework', JSON.parse(JSON.stringify(this.homeworkForm)));
                this.$notify({
                  title: "提交成功",
                  type: "success"
                });
              } else {
                this.$notify.error({
                  title: "提交失败！",
                  message: "标题不能重复！"
                });
              }
            });
          }
        }
      });
    },
    handlePPTUpload(file) {
      // console.log("上传课件：", file);
      this.dialog.form.title = file.name;
      return true;
    },
    handleHomeworkUpload(file) {
      // console.log("上传文件：", file);
      this.homeworkForm.fileName = file.name;
      return true;
    },
    handleHomeworkRemove(file, fileList) {
      // console.log("移除文件：", file, fileList);
      this.homeworkForm.fileName = '';
      return true;
    },
    updateScore(item) {
      // console.log("updateScore:", item);
      this.$http.post("http://47.101.58.148:8090/updateScore", item).then(result => {
        if (result.data) {
          this.$store.commit('updateScore', item);
          this.$message({
            message: "修改成功！",
            type: 'success'
          });
        } else {
          this.$message.error("修改失败！");
        }
      });
      this.homeworkDrawer.visible = false;
    }
  },
}
</script>

<style >
.el-drawer:focus {
  outline: none;
}
.el-drawer__header span:focus {
  outline: 0;
}
.el-drawer__body {
  overflow: auto;
}

.headPhoto{
  border-radius: 100px;
}
</style>
