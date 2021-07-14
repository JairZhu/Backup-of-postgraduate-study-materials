package org.jairzhu.coursewebserver.domain;

import java.util.Date;
import java.util.Objects;

public class Video {
    private String title;
    private String writer;
    private Date time;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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

    public Video(String title, String writer, Date time) {
        this.title = title;
        this.writer = writer;
        this.time = time;
    }

    public Video() {
        this.title = null;
        this.writer = null;
        this.time = null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Video video = (Video) o;
        return Objects.equals(title, video.title) && Objects.equals(writer, video.writer) && Objects.equals(time, video.time);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, writer, time);
    }

    @Override
    public String toString() {
        return "Video{" +
                "title='" + title + '\'' +
                ", writer='" + writer + '\'' +
                ", time=" + time +
                '}';
    }
}
