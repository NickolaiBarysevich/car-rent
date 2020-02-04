package car.rent.secutiry;

import car.rent.entity.UserRole;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class AuthenticationResponse {

    private final String username;
    private final String authToken;
    private final UserRole role;

}
