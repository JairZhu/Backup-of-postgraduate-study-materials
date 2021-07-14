package org.jairzhu.coursewebserver.domain;

import java.util.Date;
import java.util.Objects;

public class Comment {
    private int id;
    private String title;
    private String content;
    private String writer;
    private String counterpart;
    private String reference;
    private Date time;

    @Override
    public String toString() {
        return "Comment{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", writer='" + writer + '\'' +
                ", counterpart='" + counterpart + '\'' +
                ", reference='" + reference + '\'' +
                ", time=" + time +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Comment)) return false;
        Comment comment = (Comment) o;
        return id == comment.id && Objects.equals(title, comment.title) && Objects.equals(content, comment.content) && Objects.equals(writer, comment.writer) && Objects.equals(counterpart, comment.counterpart) && Objects.equals(reference, comment.reference) && Objects.equals(time, comment.time);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, content, writer, counterpart, reference, time);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
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

    public String getCounterpart() {
        return counterpart;
    }

    public void setCounterpart(String counterpart) {
        this.counterpart = counterpart;
    }

    public String getReference() {
        return reference;
    }

    public void setReference(String reference) {
        this.reference = reference;
    }

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }
}
