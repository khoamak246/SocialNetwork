package com.back_end.model;


import com.back_end.utils.constant.ValidationRegex;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Pattern;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 2200)
    private String content;

    private String location;

    @Column(columnDefinition = "date")
    private String createdDate;

    private boolean privacy;

    private int likeNumber;
    private int shareNumber;
    private int commentNumber;

    private boolean type;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonIgnoreProperties({"follower" ,"user"})
    private User user;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, mappedBy = "post")
    private Set<PostImg> postImg;

    @OneToMany(mappedBy = "posts")
    @JsonIgnoreProperties({"posts"})
    private List<PostBehavior> postBehavior;

    @OneToMany(mappedBy = "post")
    private List<Comment> comments;

    @ManyToMany(mappedBy = "post")
    @JsonIgnore
    private List<Collection> collection;

    @OneToMany(mappedBy = "post")
    @JsonIgnore
    private List<Report> report;

}
