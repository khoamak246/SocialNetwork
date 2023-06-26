package com.back_end.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PostImg {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private String url;

    private boolean type;

    @ManyToOne
    @JoinColumn(name = "post_id", referencedColumnName = "id")
    @JsonIgnore
    private Post post;
}
