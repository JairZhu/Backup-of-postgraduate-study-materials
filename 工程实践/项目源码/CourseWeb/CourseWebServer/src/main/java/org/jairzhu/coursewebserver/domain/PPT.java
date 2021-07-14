package org.jairzhu.coursewebserver.domain;

import java.util.Date;
import java.util.Objects;

public class PPT {
    private String title;
    private String writer;
    private Date time;

    @Override
    public String toString() {
        return "PPT{" +
                "title='" + title + '\'' +
                ", writer='" + writer + '\'' +
                ", time=" + time +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PPT)) return false;
        PPT ppt = (PPT) o;
        return Objects.equals(title, ppt.title) && Objects.equals(writer, ppt.writer) && Objects.equals(time, ppt.time);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, writer, time);
    }

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
}
