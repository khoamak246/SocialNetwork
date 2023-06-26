package com.back_end.utils.util;

import com.back_end.dto.response.ResponseMessage;
import com.back_end.utils.constant.ValidationRegex;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class Utils {

    public static ResponseMessage buildSuccessMessage(String message, Object data) {
        return ResponseMessage.builder()
                        .status("OK")
                        .message(message)
                        .data(data)
                        .build();

    }

    public static ResponseMessage buildSuccessMessage(String message) {
        return ResponseMessage.builder()
                        .status("OK")
                        .message(message)
                        .data("")
                        .build();

    }

    public static ResponseMessage buildFailMessage(String message) {
        return ResponseMessage.builder()
                .status("FAILED")
                .message(message)
                .data("")
                .build();
    }

}
