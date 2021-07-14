package org.jairzhu.coursewebserver.domain;

import java.util.Date;
import java.util.Objects;

public class Homework {
    private String title;
    private String content;
    private String fileName;
    private String writer;
    private Date time;
    private int score;

    @Override
    public String toString() {
        return "Homework{" +
                "title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", fileName='" + fileName + '\'' +
                ", writer='" + writer + '\'' +
                ", time=" + time +
                ", score=" + score +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Homework)) return false;
        Homework homework = (Homework) o;
        return score == homework.score && Objects.equals(title, homework.title) && Objects.equals(content, homework.content) && Objects.equals(fileName, homework.fileName) && Objects.equals(writer, homework.writer) && Objects.equals(time, homework.time);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, content, fileName, writer, time, score);
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

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
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

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }
}
