package org.jairzhu.coursewebserver.controller;


import com.fasterxml.jackson.core.JsonProcessingException;
import org.jairzhu.coursewebserver.domain.NonStaticResourceHttpRequestHandler;
import org.jairzhu.coursewebserver.domain.Video;
import org.jairzhu.coursewebserver.mapper.CourseWebMapper;
import org.jairzhu.coursewebserver.redisUtils.RedisHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.cache.CacheProperties;
import org.springframework.util.ResourceUtils;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

/***
 * author:朱康乐
 * time:2021/3/23
 * content:视频区
 */
@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@EnableAutoConfiguration
public class VideoController {

    private final Logger logger = LoggerFactory.getLogger(CourseWebController.class);
    @Autowired
    private final NonStaticResourceHttpRequestHandler nonStaticResourceHttpRequestHandler;

    @Autowired
    private CourseWebMapper courseWebMapper;

    public VideoController(NonStaticResourceHttpRequestHandler nonStaticResourceHttpRequestHandler) {
        this.nonStaticResourceHttpRequestHandler = nonStaticResourceHttpRequestHandler;
    }

    @PostMapping(value = "deleteVideo")
    @ResponseBody
    public boolean deleteVideo(@RequestBody List<String> titles) {
        logger.info("delete:"+titles.toString());
        for (String title: titles)
            courseWebMapper.deleteVideo(title);
        return true;
    }

    @RequestMapping(value = "getVideos")
    @ResponseBody
    public List<Video> findAllvideos() throws JsonProcessingException { return courseWebMapper.findAllVideos(); }

    @RequestMapping(value="saveVideo")
    @ResponseBody
    public boolean saveVideo(@RequestBody Video video){
        logger.info(video.toString());
        try{
            courseWebMapper.saveVideo(video);
            return true;
        }catch (Exception exception){
            exception.printStackTrace();
            return false;
        }
    }

    @PostMapping(value = "deleteFile")
    @ResponseBody
    public boolean deleteFile(@RequestBody List<String> fileName, HttpServletRequest request) throws FileNotFoundException {
        //数据库中删除文件数据
        for (String title : fileName) {
            courseWebMapper.deleteVideo(title);
        }
        //根据文件夹获取此文件夹的真实路径是绝对路径
        String path = ResourceUtils.getURL("src/main/resources/static/video").getPath().substring(1);
        //根据文件的路径获取此文件
        for (String name : fileName) {
            File file = new File(path + "/" + name);
            if (file != null) {
                //文件不为空，执行删除
                file.delete();
            } else {
                //为空提示错误信息
                request.setAttribute("error", "文件不存在，不能删除");
                return false;
            }
        }
        return true;
    }

    /***
     * 批量上传视频功能，待完善
     * @param
     * @return
     */
//    @PostMapping(value = "uploadVideos")
//    @ResponseBody
//    public boolean uploadVideos(@RequestParam("file") MultipartFile[] files) {
//        for (MultipartFile oneFile : files) {
//            String filename = oneFile.getOriginalFilename();
//            try {
//                oneFile.transferTo(new File(System.getProperty("user.dir") + "/src/main/resources/static/video", filename));
//            } catch (IOException e) {
//                e.printStackTrace();
//                return false;
//            }
//        }
//        return true;
//    }





    @RequestMapping(value = "videoPlay")
    @ResponseBody
    public void videoPreview(@RequestParam(name = "fileName") String fileName, HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        //假如视频1.mp4放在了static下的video文件夹里头，sourcePath是获取resources文件夹的绝对地址
        //realPath是视频所在的绝对地址
        logger.info("videoPlay:"+fileName);
        String path = ResourceUtils.getURL("src/main/resources/static/video").getPath().substring(1);

//        String path = ResourceUtils.getURL("src/main/resources/static/video").getPath().substring(1);
        logger.info("video:src"+path);
        String realPath = "/" + path +  fileName;

        Path filePath = Paths.get(realPath);
        logger.info(realPath);
        if (Files.exists(filePath)) {
            logger.info("if jinru");
            String contentType = Files.probeContentType(filePath);
            if (!StringUtils.isEmpty(contentType)) {
                response.setContentType(contentType);
            }
            request.setAttribute(NonStaticResourceHttpRequestHandler.ATTR_FILE, filePath);
            logger.info("zhuanfa qian");

            nonStaticResourceHttpRequestHandler.handleRequest(request, response);
            logger.info("zhuanfa hou");
        } else {
            logger.info("else jinru");
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.setCharacterEncoding(StandardCharsets.UTF_8.toString());
        }
        logger.info("jieshu");
    }
}
