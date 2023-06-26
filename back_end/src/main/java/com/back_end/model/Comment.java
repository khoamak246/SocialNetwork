package com.back_end.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import net.bytebuddy.utility.nullability.MaybeNull;
import org.springframework.web.bind.annotation.GetMapping;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String content;
    private long commentTime;
    private int likeNumber;
    private int commentNumber;
    private boolean type;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties({"posts", "user", "follower"})
    private User user;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "post_id")
    @JsonIgnore
    private Post post;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "nested_comment",
            joinColumns = @JoinColumn(name = "comment_id"),
            inverseJoinColumns = @JoinColumn(name = "nested_id"))
    @JsonIgnoreProperties({"comments", "post"})
    private List<Comment> comments;

    @ManyToMany(mappedBy = "comments")
    @JsonIgnore
    private List<Comment> comment;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "comment_like",
            joinColumns = @JoinColumn(name = "comment_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    @JsonIgnoreProperties({"posts", "user", "follower"})
    private List<User> likeUser;

}
