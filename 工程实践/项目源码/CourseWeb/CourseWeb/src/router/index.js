import Vue from 'vue'
import Router from 'vue-router'
import MainPage from "../components/MainPage";
import Syllabus from "../components/Syllabus";
import Comment from "../components/Comment";
import DiscussTitle from "../components/DiscussTitle";
import videoPage from "../components/videoPage";
import PersonInfo from "../components/PersonInfo";
Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect: '/mainPage'
    },
    {
      path:'/mainPage',
      component: MainPage
    },
    {
      path: '/syllabus',
      component: Syllabus
    },
    {
      path: '/discussTitle',
      component: DiscussTitle
    },
    {
      path: '/comment',
      component: Comment
    },
    {
      path: '/videoPage',
      component: videoPage
    },
    {
      path:'/personInfo',
      component:PersonInfo
    }
  ]
})
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
