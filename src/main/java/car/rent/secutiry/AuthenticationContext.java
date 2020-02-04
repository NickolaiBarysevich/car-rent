package car.rent.secutiry;

public class AuthenticationContext {

    private static final ThreadLocal<UserPrincipal> principalHolder = new ThreadLocal<>();

    public static UserPrincipal getUserPrincipal() {
        return principalHolder.get();
    }

    public static void setUserPrincipal(UserPrincipal userPrincipal) {
        principalHolder.set(userPrincipal);
    }
}
