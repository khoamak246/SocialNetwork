package com.back_end.security.jwt;

import com.back_end.dto.response.ResponseMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@Component
@RequiredArgsConstructor
public class JwtEntryPoint implements AuthenticationEntryPoint {

    private final Logger logger = LoggerFactory.getLogger(JwtEntryPoint.class);

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException)
            throws IOException, ServletException {
        logger.error("FAILED -> CAN NOT AUTHORIZED Message {}", authException.getMessage());
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "FAILED -> CAN NOT AUTHORIZED" + authException.getMessage());
    }
}
