package car.rent.service.api;

import car.rent.dto.LoginForm;
import car.rent.dto.SignUpForm;
import car.rent.entity.User;

import java.util.List;

public interface UserService extends CrudService<User> {

    User findByUsername(String username);

    User createFromForm(SignUpForm signUpForm);

    User login(LoginForm loginForm);

    List<User> findByLastName(String lastName);

    List<User> getUsers();

    User getUserInfo();

    User updateUser(User user);
}
