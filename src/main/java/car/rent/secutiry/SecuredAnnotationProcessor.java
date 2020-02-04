package car.rent.secutiry;

import car.rent.entity.UserRole;
import car.rent.exception.ForbiddenException;
import car.rent.exception.UnauthorizedException;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.stereotype.Component;

import java.util.stream.Stream;

@Aspect
@Component
public class SecuredAnnotationProcessor {

    @Before("@annotation(secured)")
    public void processSecured(Secured secured) {
        UserPrincipal userPrincipal = AuthenticationContext.getUserPrincipal();
        if (userPrincipal == null)
            throw new UnauthorizedException();
        UserRole[] allowedRoles = secured.value();
        if (Stream.of(allowedRoles).noneMatch(userRole -> userRole == userPrincipal.getUserRole())) {
            throw new ForbiddenException();
        }
    }
}
