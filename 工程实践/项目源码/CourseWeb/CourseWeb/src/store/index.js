import Vue from 'vue'
import Vuex from 'vuex'
import it from "element-ui/src/locale/lang/it";

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    isLogin: false,
    isTeacher: false, //true表示老师，false表示学生
    user: null,
    assignments: [],
    news: [],
    ppts: [],
    videos:[],
    notifications: [],
    homeworks: [],
    courseInformation: '',
    discussTitle: [],
    comments: [],
    imgUrl: '',
  },
  mutations: {
    setDiscussTitle(state, item) {
      state.discussTitle = item;
    },
    setImgUrl(state, item){
      state.imgUrl = item;
    },
    setComment(state, item) {
      state.comments = item;
    },
    setIsLogin(state, online) {
      state.isLogin = online;
    },
    setTeacher(state, teacher) {
      state.isTeacher = teacher;
    },
    setUser(state, item) {
      state.user = item;
    },
    setAssignments(state, item) {
      state.assignments = item;
    },
    setNews(state, item) {
      state.news = item;
    },
    setPPTs(state, item) {
      state.ppts = item;
    },
    setVideos(state, item) {
      state.videos = item;
    },
    setNotifications(state, item) {
      state.notifications = item;
    },
    setHomeworks(state, item) {
      state.homeworks = item;
    },
    setCourseInformation(state, item) {
      state.courseInformation = item;
    },
    addNews(state, item) {
      state.news.push(item);
    },
    addNotification(state, item) {
      state.notifications.push(item);
    },
    addAssignment(state, item) {
      state.assignments.push(item);
    },
    addPPT(state, item) {
      state.ppts.push(item);
    },
    addVideo(state,item){
      state.videos.push(item);
    },
    addHomework(state, item) {
      state.homeworks.push(item);
    },
    addDiscussTitle(state, item) {
      state.discussTitle.push(item);
    },
    addComment(state, item) {
      state.comments.data.push(item);
    },
    updateScore(state, item) {
      for (let i = 0; i < state.homeworks.length; ++i) {
        if (state.homeworks[i].title === item.title) {
          state.homeworks[i].score = item.score;
          return;
        }
      }
    }
  },
  actions: {},
  getters: {
    getCommentByTitle(state, title) {
      for (let v in state.comments) {
        if (state.comments[v][0].title === title) {
          return state.comments[v];
        }
      }
    }
  },
  modules: {}
})

export default store
