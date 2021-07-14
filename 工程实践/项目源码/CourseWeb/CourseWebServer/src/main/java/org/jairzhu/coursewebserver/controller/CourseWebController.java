package org.jairzhu.coursewebserver.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.jairzhu.coursewebserver.domain.*;
import org.jairzhu.coursewebserver.mapper.CourseWebMapper;
import org.jairzhu.coursewebserver.redisUtils.RedisHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ResourceUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@EnableAutoConfiguration
public class CourseWebController {


    private final Logger logger = LoggerFactory.getLogger(CourseWebController.class);

    @Autowired
    private CourseWebMapper courseWebMapper;

    @RequestMapping(value = "getNews")
    @ResponseBody
    public List<News> findAllNews() throws JsonProcessingException {
        return courseWebMapper.findAllNews();
    }

    @RequestMapping(value = "getNotifications")
    @ResponseBody
    public List<Notification> findAllNotifications() throws JsonProcessingException {
        return courseWebMapper.findAllNotifications();
    }

    @RequestMapping(value = "getPPTs")
    @ResponseBody
    public List<PPT> findAllPPTs() throws JsonProcessingException {
        return courseWebMapper.findAllPPTs();
    }

    @RequestMapping(value = "getAssignments")
    @ResponseBody
    public List<Assignment> findAllAssignment() throws JsonProcessingException {
        return courseWebMapper.findAllAssignment();
    }

    @RequestMapping(value = "getHomeworks")
    @ResponseBody
    public List<Homework> findAllHomeworks() throws JsonProcessingException { return courseWebMapper.findAllHomeworks();}

    @RequestMapping(value = "getCourseInformation")
    @ResponseBody
    public List<CourseInformation> findCourseInformation() throws JsonProcessingException { return courseWebMapper.findCourseInformation();}

    @RequestMapping(value = "getCommentTitles")
    @ResponseBody
    public List<String> findCommentTitles() throws JsonProcessingException {
        List<String> src = courseWebMapper.findAllCommentTitle();
        List<String> res = new ArrayList<>();
        for (String s : src) {
            if (!res.contains(s)) {
                res.add(s);
            }
        }
        return res;
    }

    @RequestMapping(value = "getCommentByTitle")
    @ResponseBody
    public List<Comment> findCommentByTitle(@RequestParam String title) throws JsonProcessingException {
        List<Comment> res = courseWebMapper.findAllCommentByTitle(title);
        logger.info(res.toString());
        return res;
    }

    @PostMapping(value = "postUser")
    @ResponseBody
    public boolean userLogin(@RequestBody User user) throws JsonProcessingException {
        logger.info(user.toString());
        List<User> userList = courseWebMapper.findAllUsers();
        return userList.contains(user);
    }

    @PostMapping(value = "saveComment")
    @ResponseBody
    public boolean saveComment(@RequestBody Comment comment) {
        logger.info(comment.toString());
        try {
            courseWebMapper.saveComment(comment);
            return true;
        } catch (Exception exception) {
            exception.printStackTrace();
            return false;
        }
    }

    @PostMapping(value = "saveUser")
    @ResponseBody
    public boolean saveUser(@RequestBody User user) {
        logger.info(user.toString());
        try {
            courseWebMapper.saveUser(user);
            return true;
        } catch (Exception exception) {
            exception.printStackTrace();
            return false;
        }
    }

    @PostMapping(value = "savePPT")
    @ResponseBody
    public boolean savePPT(@RequestBody PPT ppt) {
        logger.info(ppt.toString());
        try {
            courseWebMapper.savePPT(ppt);
            return true;
        } catch (Exception exception) {
            exception.printStackTrace();
            return false;
        }
    }

    @PostMapping(value = "saveNews")
    @ResponseBody
    public boolean saveNews(@RequestBody News news) {
        logger.info(news.toString());
        try {
            courseWebMapper.saveNews(news);
            return true;
        } catch (Exception exception) {
            exception.printStackTrace();
            return false;
        }
    }

    @PostMapping(value = "saveNotification")
    @ResponseBody
    public boolean saveNotification(@RequestBody Notification notification) {
        logger.info(notification.toString());
        try {
            courseWebMapper.saveNotification(notification);
            return true;
        } catch (Exception exception) {
            exception.printStackTrace();
            return false;
        }
    }

    @PostMapping(value = "saveAssignment")
    @ResponseBody
    public boolean saveAssignment(@RequestBody Assignment assignment) {
        logger.info(assignment.toString());
        try {
            courseWebMapper.saveAssignment(assignment);
            return true;
        } catch (Exception exception) {
            exception.printStackTrace();
            return false;
        }
    }

    @PostMapping(value = "saveCourseInformation")
    @ResponseBody
    public boolean saveCourseInformation(@RequestBody CourseInformation courseInformation) {
        logger.info(courseInformation.toString());
        try {
            courseWebMapper.saveCourseInformation(courseInformation);
            return true;
        } catch (Exception exception) {
            exception.printStackTrace();
            return false;
        }
    }

    @PostMapping(value = "saveHomework")
    @ResponseBody
    public boolean saveHomework(@RequestBody Homework homework) {
        logger.info(homework.toString());
        try {
            courseWebMapper.saveHomework(homework);
            return true;
        } catch (Exception exception) {
            exception.printStackTrace();
            return false;
        }
    }

    @PostMapping(value = "deleteNews")
    @ResponseBody
    public boolean deleteNews(@RequestBody List<String> titles) {
        logger.info(titles.toString());
        for (String title: titles)
            courseWebMapper.deleteNews(title);
        return true;
    }

    @PostMapping(value = "deletePPT")
    @ResponseBody
    public boolean deletePPT(@RequestBody List<String> titles) {
        logger.info(titles.toString());
        for (String title: titles)
            courseWebMapper.deletePPT(title);
        return true;
    }

    @PostMapping(value = "deleteNotification")
    @ResponseBody
    public boolean deleteNotification(@RequestBody List<String> titles) {
        logger.info(titles.toString());
        for (String title: titles)
            courseWebMapper.deleteNotifications(title);
        return true;
    }

    @PostMapping(value = "deleteAssignment")
    @ResponseBody
    public boolean deleteAssignment(@RequestBody List<String> titles) {
        logger.info(titles.toString());
        for (String title: titles)
            courseWebMapper.deleteAssignment(title);
        return true;
    }

    @PostMapping(value = "deleteCourseInformation")
    @ResponseBody
    public boolean deleteCourseInformation(@RequestBody List<String> title) {
        logger.info(title.toString());
        courseWebMapper.deleteCourseInformation(title.get(0));
        return true;
    }

    @PostMapping(value = "deleteCommentByTitle")
    @ResponseBody
     public boolean deleteCommentByTitle(@RequestBody List<String> titles) {
        logger.info(titles.toString());
        courseWebMapper.deleteCommentByTitle(titles.get(0));
        return true;
    }

    @PostMapping(value = "deleteComment")
    @ResponseBody
    public boolean deleteComment(@RequestBody Comment comment) {
        logger.info(comment.toString());
        courseWebMapper.deleteComment(comment);
        return true;
    }

    @PostMapping(value = "updateScore")
    @ResponseBody
    public boolean updateScore(@RequestBody Homework homework) throws JsonProcessingException {
        logger.info(homework.toString());
        courseWebMapper.updateScore(homework);
        return true;
    }

//    @PostMapping(value = "uploadHomeworkFile")
//    @ResponseBody
//    public boolean uploadHomeworkFile(@RequestParam("file") MultipartFile file) {
//        logger.info(System.getProperty("user.dir"));
//        String originName = file.getOriginalFilename();
//        try {
//            file.transferTo(new File(System.getProperty("user.dir")+"/src/main/resources/static/homework", originName));
//            return true;
//        } catch (Exception exception) {
//            exception.printStackTrace();
//            return false;
//        }
//    }

//    @PostMapping(value = "uploadPPTFile")
//    @ResponseBody
//    public boolean uploadPPTFile(@RequestParam("file") MultipartFile file) {
//        logger.info(System.getProperty("user.dir"));
//        String originName = file.getOriginalFilename();
//        try {
//            file.transferTo(new File(System.getProperty("user.dir")+"/src/main/resources/static/ppt", originName));
//            return true;
//        } catch (Exception exception) {
//            exception.printStackTrace();
//            return false;
//        }
//    }

    @PostMapping(value = "uploadFile/{type}")
    @ResponseBody
    public boolean uploadFile(@PathVariable(name="type")String type,@RequestParam("file") MultipartFile file) throws FileNotFoundException {
        String filename = file.getOriginalFilename();
        logger.info("uploadFile"+System.getProperty("user.dir")+filename);

        String path = System.getProperty("user.dir") + "/src/main/resources/static/" + type;
        File dir =new File(path);
        if  (!dir.exists()  && !dir.isDirectory())
        {
            dir.mkdirs();
        }
        try {
            file.transferTo(new File(path, filename));

            return true;
        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    @RequestMapping(value = "downloadFile/{type}/{fileName}")
    @ResponseBody
    public ResponseEntity<Object> downloadFile(@PathVariable(name = "fileName") String fileName, @PathVariable(name = "type") String type) throws FileNotFoundException {
        logger.info("download type: " + type + "  file: " + fileName);

        String path = System.getProperty("user.dir") + "/src/main/resources/static/" + type;
        File file = new File(path, fileName);

        InputStreamResource resource = new InputStreamResource ( new FileInputStream( file ) );

        byte[] fileNameBytes = fileName.getBytes(StandardCharsets.UTF_8);
        fileName = new String(fileNameBytes, 0, fileNameBytes.length, StandardCharsets.ISO_8859_1);

        HttpHeaders headers = new HttpHeaders();
        headers.add ( "Content-Disposition",String.format("attachment;filename=\"%s",fileName));
        headers.add ( "Cache-Control","no-cache,no-store,must-revalidate" );
        headers.add ( "Pragma","no-cache" );
        headers.add ( "Expires","0" );

        return ResponseEntity.ok()
                .headers ( headers )
                .contentLength ( file.length ())
                .contentType(MediaType.parseMediaType ( "application/txt" ))
                .body(resource);
    }
}
