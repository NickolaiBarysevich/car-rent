package car.rent.secutiry;

import car.rent.entity.User;
import car.rent.entity.UserRole;
import car.rent.exception.TokenExpiredException;
import car.rent.exception.TokenValidationException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class AuthenticationProvider {

    private static final String ROLE_CLAIM = "role";
    private static final String USER_ID_CLAIM = "userId";

    @Value("${authentication.secret}")
    private String secret;
    @Value("${authentication.token.expiration.time}")
    private int jwtExpiration;

    public AuthenticationResponse generateJwtToken(User user) {
        String token = Jwts.builder()
                .setSubject(user.getUsername())
                .claim(ROLE_CLAIM, user.getRole())
                .claim(USER_ID_CLAIM, user.getId())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpiration))
                .signWith(SignatureAlgorithm.HS512, secret)
                .compact();
        return new AuthenticationResponse(user.getUsername(), token, user.getRole());
    }

    public UserPrincipal buildUserPrincipal(String authToken) {
        int id = parseId(authToken);
        String username = parseUsername(authToken);
        UserRole role = parseRole(authToken);
        return new UserPrincipal(id, username, role);
    }

    private int parseId(String token) {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody().get(USER_ID_CLAIM, Integer.class);
    }

    private String parseUsername(String token) {
        return Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody().getSubject();
    }

    private UserRole parseRole(String token) {
        String role = Jwts.parser().setSigningKey(secret).parseClaimsJws(token).getBody().get(ROLE_CLAIM, String.class);
        return UserRole.valueOf(role);
    }

    public void validateJwtToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(secret).parseClaimsJws(authToken);
        } catch (ExpiredJwtException e) {
            throw new TokenExpiredException();
        } catch (Exception e) {
            throw new TokenValidationException(e.getMessage(), e);
        }
    }
}


