package car.rent.secutiry;

import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class AuthenticationFilter extends OncePerRequestFilter {

    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String TOKEN_TYPE = "Bearer ";

    private AuthenticationProvider authProvider;

    public AuthenticationFilter(AuthenticationProvider authProvider) {
        this.authProvider = authProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authToken = getAuthToken(request);
        if (authToken != null) {
            authProvider.validateJwtToken(authToken);
            UserPrincipal userPrincipal = authProvider.buildUserPrincipal(authToken);
            AuthenticationContext.setUserPrincipal(userPrincipal);
        }
        filterChain.doFilter(request, response);
    }

    private String getAuthToken(HttpServletRequest request) {
        String authHeader = request.getHeader(AUTHORIZATION_HEADER);

        if (authHeader != null && authHeader.startsWith(TOKEN_TYPE))
            return authHeader.replace(TOKEN_TYPE, "");
        return null;
    }

}
