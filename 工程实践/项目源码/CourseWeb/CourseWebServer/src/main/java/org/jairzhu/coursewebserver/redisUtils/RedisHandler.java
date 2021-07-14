package org.jairzhu.coursewebserver.redisUtils;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.jairzhu.coursewebserver.domain.*;
import org.jairzhu.coursewebserver.mapper.CourseWebMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
public final class RedisHandler {
    @Autowired
    private CourseWebMapper courseWebMapper;

    @Autowired
    private RedisUtils redisUtils;

    private final Logger logger = LoggerFactory.getLogger(RedisHandler.class);

    public List<Notification> findAllNotifications() throws JsonProcessingException {
        List<Notification> notifications;
        ObjectMapper objectMapper = new ObjectMapper();
        List<String> titleList = redisUtils.lGet("AllNotifications", 0, -1);
        if (titleList == null || titleList.size() == 0) {
            notifications = courseWebMapper.findAllNotifications();
            for (Notification noti : notifications) {
                redisUtils.lSet("AllNotifications", "notification-" + noti.getTitle());
                String jsonNoti = objectMapper.writeValueAsString(noti);
                redisUtils.set("notification-" + noti.getTitle(), jsonNoti);
            }
        }
        else {
            notifications = new ArrayList<>();
            for (String title: titleList) {
                notifications.add(objectMapper.readValue(redisUtils.get(title), Notification.class));
            }
        }
        return notifications;
    }

    public List<News> findAllNews() throws JsonProcessingException {
        List<News> objectList;
        ObjectMapper objectMapper = new ObjectMapper();
        List<String> titleList = redisUtils.lGet("AllNews", 0, -1);
        if (titleList == null || titleList.size() == 0) {
            objectList = courseWebMapper.findAllNews();
            for (News object : objectList) {
                redisUtils.lSet("AllNews", "news-" + object.getTitle());
                redisUtils.set("news-" + object.getTitle(), objectMapper.writeValueAsString(object));
            }
        }
        else {
            objectList = new ArrayList<>();
            for (String title: titleList) {
                objectList.add(objectMapper.readValue(redisUtils.get(title), News.class));
            }
        }
        return objectList;
    }

    public List<PPT> findAllPPTs() throws JsonProcessingException {
        List<PPT> objectList;
        ObjectMapper objectMapper = new ObjectMapper();
        List<String> titleList = redisUtils.lGet("AllPPTs", 0, -1);
        if (titleList == null || titleList.size() == 0) {
            objectList = courseWebMapper.findAllPPTs();
            for (PPT object : objectList) {
                redisUtils.lSet("AllPPTs", "PPT-" + object.getTitle());
                redisUtils.set("PPT-" + object.getTitle(), objectMapper.writeValueAsString(object));
            }
        }
        else {
            objectList = new ArrayList<>();
            for (String title: titleList) {
                objectList.add(objectMapper.readValue(redisUtils.get(title), PPT.class));
            }
        }
        return objectList;
    }

    public List<Assignment> findAllAssignment() throws JsonProcessingException {
        List<Assignment> objectList;
        ObjectMapper objectMapper = new ObjectMapper();
        List<String> titleList = redisUtils.lGet("AllAssignments", 0, -1);
        if (titleList == null || titleList.size() == 0) {
            objectList = courseWebMapper.findAllAssignment();
            for (Assignment object : objectList) {
                redisUtils.lSet("AllAssignments", "assignment-" + object.getTitle());
                redisUtils.set("assignment-" + object.getTitle(), objectMapper.writeValueAsString(object));
            }
        }
        else {
            objectList = new ArrayList<>();
            for (String title: titleList) {
                objectList.add(objectMapper.readValue(redisUtils.get(title), Assignment.class));
            }
        }
        return objectList;
    }

    public List<User> findAllUsers() throws JsonProcessingException {
        List<User> objectList;
        ObjectMapper objectMapper = new ObjectMapper();
        List<String> titleList = redisUtils.lGet("AllUsers", 0, -1);
        if (titleList == null || titleList.size() == 0) {
            objectList = courseWebMapper.findAllUsers();
            for (User object : objectList) {
                redisUtils.lSet("AllUsers", "user-" + object.getName());
                redisUtils.set("user-" + object.getName(), objectMapper.writeValueAsString(object));
            }
        }
        else {
            objectList = new ArrayList<>();
            for (String title: titleList) {
                objectList.add(objectMapper.readValue(redisUtils.get(title), User.class));
            }
        }
        return objectList;
    }

    public List<CourseInformation> findCourseInformation() throws JsonProcessingException {
        String result = redisUtils.get("CourseInformation");
        ObjectMapper objectMapper = new ObjectMapper();
        List<CourseInformation> courseInformationList;
        if (result == null || result.length() == 0) {
            courseInformationList = courseWebMapper.findCourseInformation();
            redisUtils.set("CourseInformation", objectMapper.writeValueAsString(courseInformationList));
        }
        else {
            courseInformationList = objectMapper.readValue(result, new TypeReference<List<CourseInformation>>() {});
        }
        return courseInformationList;
    }

    public List<Homework> findAllHomeworks() throws JsonProcessingException {
        List<Homework> objectList;
        ObjectMapper objectMapper = new ObjectMapper();
        List<String> titleList = redisUtils.lGet("AllHomeworks", 0, -1);
        if (titleList == null || titleList.size() == 0) {
            objectList = courseWebMapper.findAllHomeworks();
            for (Homework object : objectList) {
                redisUtils.lSet("AllHomeworks", "homework-" + object.getTitle());
                redisUtils.set("homework-" + object.getTitle(), objectMapper.writeValueAsString(object));
            }
        }
        else {
            objectList = new ArrayList<>();
            for (String title: titleList) {
                objectList.add(objectMapper.readValue(redisUtils.get(title), Homework.class));
            }
        }
        return objectList;
    }

    public List<String> findAllCommentTitle() throws JsonProcessingException {
        List<String> objectList;
        Set<String> titleList = redisUtils.sGet("AllCommentTitle");
        if (titleList == null || titleList.size() == 0) {
            List<String> src = courseWebMapper.findAllCommentTitle();
            objectList = new ArrayList<>();
            for (String s: src) {
                if (!objectList.contains(s)) {
                    objectList.add(s);
                    redisUtils.sSet("AllCommentTitle", s);
                }
            }
        }
        else {
            objectList = new ArrayList<>(titleList);
        }
        return objectList;
    }

    public List<Comment> findAllCommentByTitle(String title) throws JsonProcessingException {
        List<Comment> objectList;
        ObjectMapper objectMapper = new ObjectMapper();
        List<String> result = redisUtils.lGet(title, 0, -1);
        if (result == null || result.size() == 0) {
            objectList = courseWebMapper.findAllCommentByTitle(title);
            for (Comment comment: objectList) {
                redisUtils.lSet(title, "comment-" + comment.getId());
                redisUtils.set("comment-" + comment.getId(), objectMapper.writeValueAsString(comment));
            }
        }
        else {
            objectList = new ArrayList<>();
            for (String id: result) {
                objectList.add(objectMapper.readValue(redisUtils.get(id), Comment.class));
            }
        }
        return objectList;
    }

    public void saveComment(Comment comment) throws JsonProcessingException {
        courseWebMapper.saveComment(comment);
        ObjectMapper objectMapper = new ObjectMapper();
        redisUtils.sSet("AllCommentTitle", comment.getTitle());
        redisUtils.lSet(comment.getTitle(), "comment-" + comment.getId());
        redisUtils.set("comment-" + comment.getId(), objectMapper.writeValueAsString(comment));
    }

    public void saveUser(User user) throws JsonProcessingException {
        courseWebMapper.saveUser(user);
        ObjectMapper objectMapper = new ObjectMapper();
        redisUtils.lSet("AllUsers", "user-" + user.getName());
        redisUtils.set("user-" + user.getName(), objectMapper.writeValueAsString(user));
    }

    public void savePPT(PPT ppt) throws JsonProcessingException {
        courseWebMapper.savePPT(ppt);
        ObjectMapper objectMapper = new ObjectMapper();
        redisUtils.lSet("AllPPTs", "PPT-" + ppt.getTitle());
        redisUtils.set("PPT-" + ppt.getTitle(), objectMapper.writeValueAsString(ppt));
    }

    public void saveNews(News news) throws JsonProcessingException {
        courseWebMapper.saveNews(news);
        ObjectMapper objectMapper = new ObjectMapper();
        redisUtils.lSet("AllNews", "news-" + news.getTitle());
        redisUtils.set("news-" + news.getTitle(), objectMapper.writeValueAsString(news));
    }

    public void saveNotification(Notification notification) throws JsonProcessingException {
        courseWebMapper.saveNotification(notification);
        ObjectMapper objectMapper = new ObjectMapper();
        redisUtils.lSet("AllNotifications", "notification-" + notification.getTitle());
        redisUtils.set("notification-" + notification.getTitle(), objectMapper.writeValueAsString(notification));
    }

    public void saveAssignment(Assignment assignment) throws JsonProcessingException {
        courseWebMapper.saveAssignment(assignment);
        ObjectMapper objectMapper = new ObjectMapper();
        redisUtils.lSet("AllAssignments", "assignment-" + assignment.getTitle());
        redisUtils.set("assignment-" + assignment.getTitle(), objectMapper.writeValueAsString(assignment));
    }

    public void saveCourseInformation(CourseInformation courseInformation) throws JsonProcessingException {
        courseWebMapper.saveCourseInformation(courseInformation);
        ObjectMapper objectMapper = new ObjectMapper();
        List<CourseInformation> courseInformationList = new ArrayList<>();
        courseInformationList.add(courseInformation);
        redisUtils.set("CourseInformation", objectMapper.writeValueAsString(courseInformationList));
    }

    public void saveHomework(Homework homework) throws JsonProcessingException {
        courseWebMapper.saveHomework(homework);
        ObjectMapper objectMapper = new ObjectMapper();
        redisUtils.lSet("AllHomeworks", "homework-" + homework.getTitle());
        redisUtils.set("homework-" + homework.getTitle(), objectMapper.writeValueAsString(homework));
    }

    public void deleteComment(Comment comment) {
        courseWebMapper.deleteComment(comment);
        redisUtils.lRemove(comment.getTitle(), 1, "comment-" + comment.getId());
        redisUtils.del("comment-" + comment.getId());
        if (redisUtils.lGetListSize(comment.getTitle()) == 0) {
            redisUtils.setRemove("AllCommentTitle", comment.getTitle());
        }
    }

    public void deleteCommentByTitle(String title) {
        courseWebMapper.deleteCommentByTitle(title);
        List<String> stringList = redisUtils.lGet(title, 0, -1);
        for (String s: stringList) {
            redisUtils.del(s);
        }
        redisUtils.del(title);
        redisUtils.setRemove("AllCommentTitle", title);
    }

    public void deleteNews(String title) {
        courseWebMapper.deleteNews(title);
        redisUtils.lRemove("AllNews", 1, "news-" + title);
        redisUtils.del("news-" + title);
    }

    public void deletePPT(String title) {
        courseWebMapper.deletePPT(title);
        redisUtils.lRemove("AllPPTs", 1, "PPT-" + title);
        redisUtils.del("PPT-" + title);
    }

    public void deleteNotifications(String title) {
        courseWebMapper.deleteNotifications(title);
        redisUtils.lRemove("AllNotifications", 1, "notification-" + title);
        redisUtils.del("notification-" + title);
    }

    public void deleteAssignment(String title) {
        courseWebMapper.deleteAssignment(title);
        redisUtils.lRemove("AllAssignments", 1, "assignment-" + title);
        redisUtils.del("assignment-" + title);
    }

    public void deleteCourseInformation(String title) {
        courseWebMapper.deleteCourseInformation(title);
        redisUtils.del("CourseInformation");
    }

    public void updateScore(Homework homework) throws JsonProcessingException {
        courseWebMapper.updateScore(homework);
        ObjectMapper objectMapper = new ObjectMapper();
        redisUtils.set("homework-" + homework.getTitle(), objectMapper.writeValueAsString(homework));
    }

    public List<Video> findAllVideos() throws JsonProcessingException {
        List<Video> objectList;
        ObjectMapper objectMapper = new ObjectMapper();
        List<String> titleList = redisUtils.lGet("AllVideos", 0, -1);
        if (titleList == null || titleList.size() == 0) {
            objectList = courseWebMapper.findAllVideos();
            for (Video object : objectList) {
                redisUtils.lSet("AllVideos", "video-" + object.getTitle());
                redisUtils.set("video-" + object.getTitle(), objectMapper.writeValueAsString(object));
            }
        }
        else {
            objectList = new ArrayList<>();
            for (String title: titleList) {
                objectList.add(objectMapper.readValue(redisUtils.get(title), Video.class));
            }
        }
        return objectList;
    }

    public void saveVideo(Video video) throws JsonProcessingException {
        courseWebMapper.saveVideo(video);
        ObjectMapper objectMapper = new ObjectMapper();
        redisUtils.lSet("AllVideos", "video-" + video.getTitle());
        redisUtils.set("video-" + video.getTitle(), objectMapper.writeValueAsString(video));
    }

    public void deleteVideo(String title) {
        courseWebMapper.deleteVideo(title);
        redisUtils.lRemove("AllVideos", 1, "video-" + title);
        redisUtils.del("video-" + title);
    }

    public void updatePwd(User user) throws JsonProcessingException {
        courseWebMapper.updatePwd(user);
        ObjectMapper objectMapper = new ObjectMapper();
        redisUtils.set("user-" + user.getName(), objectMapper.writeValueAsString(user));
    }
}
