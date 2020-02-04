package car.rent.exception.handler;

import car.rent.exception.TokenExpiredException;
import car.rent.exception.TokenValidationException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Component
public class TokenExceptionHandler extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            filterChain.doFilter(request, response);
        } catch (TokenExpiredException e) {
            buildException(response, "Время вашей сессии истекло. Перезайдите в систему");
        } catch (TokenValidationException e) {
            buildException(response, "Токен авторизации не прошел проверку");
        }
    }

    private void buildException(HttpServletResponse response, String message) throws IOException {
        ErrorResponse errorResponse = new ErrorResponse(message);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpStatus.FORBIDDEN.value());
        response.getWriter().write(toJson(errorResponse));
    }

    private String toJson(ErrorResponse response) throws JsonProcessingException {
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(response);
    }
}
