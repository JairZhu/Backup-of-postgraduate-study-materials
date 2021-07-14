<template>
  <div id="app">
    <el-row>
      <el-col :span="24" style="text-align: center;">
        <el-image style="width: 60px; height: 60px; vertical-align: middle" :src="imageURL" :fit="'fill'"></el-image>
        <span style="font-size: 30px; vertical-align: middle; margin-left: 10px">软件体系结构课程网页</span>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-menu mode="horizontal" @select="handleSelect">
        <el-menu-item index="/mainPage">首页</el-menu-item>
        <el-menu-item index="/syllabus">教学大纲</el-menu-item>
        <el-menu-item index="/discussTitle">讨论区</el-menu-item>
        <el-menu-item index="/videoPage">视频区</el-menu-item>
        <el-menu-item index="/personInfo">用户中心</el-menu-item>
      </el-menu>
    </el-row>
    <el-row>
      <router-view/>
    </el-row>
  </div>
</template>

<script>
import image from "./assets/USTC.jpg";
export default {
  name: 'App',
  data() {
    return {
      imageURL: image,
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      this.$router.push(key);
    }
  },
  created() {
    this.$http.get("http://47.101.58.148:8090/getPPTs").then(result => {
      this.$store.commit('setPPTs', result.data);
    });
    this.$http.get("http://47.101.58.148:8090/getVideos").then(result => {
      this.$store.commit('setVideos', result.data);
    });
    this.$http.get("http://47.101.58.148:8090/getNews").then(result => {
      this.$store.commit('setNews', result.data);
    });
    this.$http.get("http://47.101.58.148:8090/getNotifications").then(result => {
      this.$store.commit('setNotifications', result.data);
    });
    this.$http.get("http://47.101.58.148:8090/getAssignments").then(result => {
      this.$store.commit('setAssignments', result.data);
    });
    this.$http.get("http://47.101.58.148:8090/getHomeworks").then(result => {
      this.$store.commit('setHomeworks', result.data);
    });
    this.$http.get("http://47.101.58.148:8090/getCommentTitles").then(result => {
      this.$store.commit('setDiscussTitle', result.data);
    });
    this.$store.commit('setIsLogin', JSON.parse(localStorage.getItem("isLogin")));
    this.$store.commit('setTeacher', JSON.parse(localStorage.getItem("isTeacher")));
    this.$store.commit('setUser', JSON.parse(localStorage.getItem("user")));
    this.$http.get("http://47.101.58.148:8090/getCourseInformation").then(result => {
      this.$store.commit('setCourseInformation', result.data[0]);
    });
    if(this.$store.state.user != null){
      this.$store.commit('setImgUrl', 'http://47.101.58.148:8090/photoPlay?userName='+this.$store.state.user.name+'.jpg');
    }
  }
}
</script>

<style>

</style>
