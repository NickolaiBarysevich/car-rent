package car.rent.secutiry;

import car.rent.entity.UserRole;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public class UserPrincipal {

    private final int id;
    private final String username;
    private final UserRole userRole;
}
