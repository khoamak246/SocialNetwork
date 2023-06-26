package com.back_end.dto.request;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PagingAndSorting {

   private Long userId;
   private int paging;
   private int size;
   private String date;
   private String type;

}
