package com.back_end.dto.request;

import com.back_end.model.Post;
import com.back_end.model.User;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CollectionForm {
    private String name;
    private Long userId;
    private Long collectionId;
    private Long postId;
}
