package com.back_end.model;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostBehavior {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, cascade= {CascadeType.PERSIST, CascadeType.REMOVE})
    @JoinColumn(name = "postId")
    @JsonIgnoreProperties({"user"})
    private Post posts;

    @ManyToOne(fetch = FetchType.EAGER, cascade= {CascadeType.PERSIST, CascadeType.REMOVE})
    @JoinColumn(name = "userId")
    @JsonIgnoreProperties({"posts", "follower", "user"})
    private User users;

    private String type;
}
