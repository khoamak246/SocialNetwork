package com.back_end.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;


import javax.persistence.*;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String fullName;

    @Column(unique = true, length = 30)
    private String username;

    @Column(unique = true, length = 10)
    private String phoneNumber;

    @Column(unique = true)
    private String email;

    @Column(length = 100)
    @JsonIgnore
    private String password;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_indfo_id", referencedColumnName = "id")
    private UserInfo userInfo;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Post> posts;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "follower",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id"))
    @JsonIgnoreProperties({"user", "posts", "follower"})
    private List<User> follower;

    @ManyToMany(mappedBy = "follower")
    @JsonIgnore
    private List<User> user;

    @ManyToMany(mappedBy = "likeUser")
    @JsonIgnore
    private List<Comment> likeComment;

    @OneToMany(mappedBy = "user")
    private List<Collection> collection;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<UserRoom> userRoom;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    List<Chat> chat;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Report> report;

}
