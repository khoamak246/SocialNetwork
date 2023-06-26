package com.back_end.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import javax.persistence.*;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int userNumber;
    private boolean status;

    @OneToMany(mappedBy = "room")
    @JsonIgnoreProperties({"room"})
    private List<UserRoom> userRoom;

    @OneToMany(mappedBy = "room")
    @JsonIgnoreProperties({"room"})
    private List<Chat> chat;
}
