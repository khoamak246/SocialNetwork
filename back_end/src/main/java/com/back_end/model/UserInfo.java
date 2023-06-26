package com.back_end.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    private String avatar;

    @Column(columnDefinition = "date")
    private String createdDate;

    @Column(columnDefinition = "date")
    private String birthDay;

    private boolean gender;

    @Column(columnDefinition = "date")
    private String lastLogin;

    @OneToOne(mappedBy = "userInfo")
    @JsonIgnore
    private User user;

    private String introduce;

}
