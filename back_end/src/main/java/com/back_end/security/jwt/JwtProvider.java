package com.back_end.security.jwt;

import com.back_end.security.userPrincipal.UserPrincipal;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtProvider.class);
    private static final String SECRET_KEY = "404E635266546A576E5A7234753778214125442A472D4B6150645367566B5870";
    private static final int TOKEN_EXPIRED_TIME = 86400;
    public String generateToken(Authentication authentication) {
        UserPrincipal currentUser = (UserPrincipal) authentication.getPrincipal();
        return Jwts.builder()
                .setSubject(currentUser.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(new Date().getTime() + TOKEN_EXPIRED_TIME * 1000L))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    public boolean isValidToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (ExpiredJwtException e) {
            logger.error("ERROR -> EXPIRED TOKEN Message {}", e.getMessage());
        }catch (UnsupportedJwtException e) {
            logger.error("ERROR -> UNSUPPORTED TOKEN Message {}", e.getMessage());
        }catch (MalformedJwtException e) {
            logger.error("ERROR -> INCORRECT FORMAT TOKEN Message {}", e.getMessage());
        }catch (SignatureException e) {
            logger.error("ERROR -> INCORRECT SIGNATURE TOKEN Message {}", e.getMessage());
        }catch (IllegalArgumentException e) {
            logger.error("ERROR -> CLAIMS EMPTY TOKEN Message {}", e.getMessage());
        }
        return false;
    }

    public String getUserNameFromToken(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY)
                .parseClaimsJws(token).getBody().getSubject();
    }

    public long getExpiredTimeFromToken(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY)
                .parseClaimsJws(token).getBody().getExpiration().getTime();
    }

}
