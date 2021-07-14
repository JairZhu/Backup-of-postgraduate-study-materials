package org.jairzhu.coursewebserver.domain;

import java.util.Date;
import java.util.Objects;

public class CourseInformation {
    private String title;
    private String content;
    private String writer;
    private Date time;

    @Override
    public String toString() {
        return "CourseInformation{" +
                "title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", writer='" + writer + '\'' +
                ", time=" + time +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof CourseInformation)) return false;
        CourseInformation that = (CourseInformation) o;
        return Objects.equals(title, that.title) && Objects.equals(content, that.content) && Objects.equals(writer, that.writer) && Objects.equals(time, that.time);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, content, writer, time);
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getWriter() {
        return writer;
    }

    public void setWriter(String writer) {
        this.writer = writer;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }
}
