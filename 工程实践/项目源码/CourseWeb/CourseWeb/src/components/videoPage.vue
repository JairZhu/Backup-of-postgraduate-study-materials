<template>
  <div>
  <el-row :gutter="10"  justify="space-around" style="margin-top: 30px">
    <el-col :span="16" >
        <el-card >
          <video id="video" controls width="100%" height="100%">
            <source id="playVideos" :src=this.videoSrc type="video/mp4">
          </video>
        </el-card>
    </el-col>
    <el-col :span="8" >
      <el-card>
        <div slot="header">
          <i class="el-icon-document-copy"></i>
          <span style="margin-left: 5px">视频浏览</span>
          <span v-if="$store.state.isTeacher" style="float: right">
              <el-button type="text" icon="el-icon-edit" @click="editInfo('编辑视频', $store.state.videos)"></el-button>
            </span>
        </div>

        <div v-for="i in $store.state.videos" style="margin-bottom: 18px">
          <i class="el-icon-tickets"></i>

          <el-link type="primary" @click="changeVideo(i.title)">{{i.title}}</el-link>
          <el-link type="primary" icon="el-icon-download" :href="'http://47.101.58.148:8090/downloadFile/video/'+ i.title" style="float: right"></el-link>
        </div>
      </el-card>
    </el-col>
  </el-row>
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
  <el-dialog :title="dialog.title" :visible.sync="dialog.visible" @close="dialog.isVideo = false" :before-close="handleClose">
    <el-form :model="dialog.form" :rules="editDialogFormRules" ref="editDialogForm" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="dialog.form.title" placeholder="请输入标题" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="时间" prop="time">
        <el-date-picker v-model="dialog.form.time" type="datetime" placeholder="请选择日期时间"></el-date-picker>
      </el-form-item>
      <el-form-item label="文件" v-if="dialog.isVideo">
        <el-upload action="http://47.101.58.148:8090/uploadFile/video" :limit="10" :before-upload="handleVideoUpload">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传最多单个个文件，且不超过2GB</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="dialog.form.content"></el-input>
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
  name: "videoPage",
  data(){
    return{
      checkList: [],
      popoverVisible: false,
      videoSrc:'',
      variousDrawers: {
        visible: false,
        title: '',
        content: '',
      },
      dialog: {
        title: '',
        visible: false,
        isVideo: false,
        form: {
          title: '',
          content: '',
          writer: '',
          time: ''
        }
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
    }

  },
  created: function () {
    this.videoSrc='http://localhost:8090/videoPlay?fileName='+this.$store.state.videos[0].title;
    let vdo = document.getElementById("video")
    vdo.src=this.videoSrc;
    vdo.oncanplay();
    console.log("video:"+this.videoSrc);
  },
  methods:{
    addInfo(formName, dialog) {
      dialog.form.writer = this.$store.state.user.name;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (dialog.title === "编辑视频") {
            this.$http.post("http://47.101.58.148:8090/saveVideo", dialog.form).then(result => {
              this.updateAddInfo(result, {
                type: 'addVideo',
                // array: this.$store.state.videos,
                data: JSON.parse(JSON.stringify(dialog.form))
              })
            })
          }
        }
      });
    },
    changeVideo(videoName){
      this.videoSrc='http://47.101.58.148:8090/videoPlay?fileName='+videoName;
      let vdo = document.getElementById("video")
      vdo.src=this.videoSrc;
      vdo.play();
      console.log(this.videoSrc);
    },

    deleteInfo(type, checkList) {
      if (type === '编辑视频') {
        console.log(checkList)
        this.$http.post('http://47.101.58.148:8090/deleteFile/',checkList).then(result => {
          this.updateDeleteInfo(result, {
            type: 'setVideos',
            array: this.$store.state.videos,
            checkList: checkList
          })
        });
      }
    },

    editInfo(title, items) {
      this.variousDrawers = {
        visible: true,
        title: title,
        content: items,
      }
    },
    showEditDialog(title) {
      this.dialog.title = title;
      this.dialog.visible = true;
      if (title === "编辑视频")
        this.dialog.isVideo = true;
      // console.log("showEditDialog:", this.dialog);
    },
    handleClose() {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.dialog.visible = false;
        })
        .catch(_ => {});
    },
    handleVideoUpload(file) {
      // console.log("上传课件：", file);
      this.dialog.form.title = file.name;
      return true;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    updateAddInfo(res, args) {
      if (res.data) {
        // this.$store.commit(args.type, args.array.filter(function (v) {return args.checkList.indexOf(v.title) === -1}))

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

  }
}
</script>

<style scoped>

</style>
