package car.rent.service.impl;

import car.rent.dto.LoginForm;
import car.rent.dto.SignUpForm;
import car.rent.entity.User;
import car.rent.entity.UserRole;
import car.rent.exception.DuplicateFiledException;
import car.rent.exception.EntityNotFoundException;
import car.rent.exception.InvalidCredentialsException;
import car.rent.repository.UserRepository;
import car.rent.secutiry.AuthenticationContext;
import car.rent.secutiry.UserPrincipal;
import car.rent.service.api.UserService;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.stereotype.Service;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Validator;
import java.util.List;
import java.util.Set;

@Service
public class UserServiceImpl extends AbstractCrudService<User> implements UserService {

    private UserRepository userRepository;
    private Validator validator;

    public UserServiceImpl(UserRepository repository, Validator validator) {
        super(repository);
        userRepository = repository;
        this.validator = validator;
    }

    @Override
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElseThrow(InvalidCredentialsException::new);
    }

    @Override
    public User createFromForm(SignUpForm signUpForm) {
        try {
            return create(mapUserFromForm(signUpForm));
        } catch (Exception e) {
            throw new DuplicateFiledException(getDuplicateFieldsMessage(e));
        }
    }

    private User mapUserFromForm(SignUpForm signUpForm) {
        Set<ConstraintViolation<SignUpForm>> violations = validator.validate(signUpForm);
        if (!violations.isEmpty())
            throw new ConstraintViolationException(violations);
        User user = new User();
        user.setUsername(signUpForm.getUsername());
        user.setPassword(DigestUtils.sha256Hex(signUpForm.getPassword()));
        user.setFirstName(signUpForm.getFirstName());
        user.setLastName(signUpForm.getLastName());
        user.setEmail(signUpForm.getEmail());
        user.setPhoneNumber(signUpForm.getPhoneNumber());
        user.setPassportPhoto(signUpForm.getPassportPhoto());
        user.setDriverLicensePhoto(signUpForm.getDriverLicensePhoto());
        user.setApproved(false);
        user.setRole(UserRole.CLIENT);
        return user;
    }

    @Override
    public User login(LoginForm loginForm) {
        Set<ConstraintViolation<LoginForm>> violations = validator.validate(loginForm);
        if (!violations.isEmpty())
            throw new ConstraintViolationException(violations);
        User user = findByUsername(loginForm.getUsername());
        String encodedPassword = DigestUtils.sha256Hex(loginForm.getPassword());
        if (user.getPassword().equals(encodedPassword))
            return user;
        else
            throw new InvalidCredentialsException();
    }

    @Override
    public List<User> findByLastName(String lastName) {
        return userRepository.findByLastName(lastName);
    }

    @Override
    protected String getRussianTableName() {
        return "пользователь";
    }

    @Override
    public List<User> getUsers() {
        return userRepository.findByOrderByApproved();
    }

    @Override
    public User getUserInfo() {
        UserPrincipal userPrincipal = AuthenticationContext.getUserPrincipal();
        return userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new EntityNotFoundException("Пользователь", userPrincipal.getId()));
    }

    @Override
    public User updateUser(User user) {
        UserPrincipal userPrincipal = AuthenticationContext.getUserPrincipal();
        User originalUser = userRepository.findById(userPrincipal.getId()).orElseThrow(() -> new EntityNotFoundException("Пользователь", userPrincipal.getId()));
        if (user.getUsername() != null)
            originalUser.setUsername(user.getUsername());
        if (user.getPassword() != null)
            originalUser.setPassword(DigestUtils.sha256Hex(user.getPassword()));
        if (user.getLastName() != null)
            originalUser.setLastName(user.getLastName());
        if (user.getFirstName() != null)
            originalUser.setFirstName(user.getFirstName());
        if (user.getPhoneNumber() != null)
            originalUser.setPhoneNumber(user.getPhoneNumber());
        if (user.getEmail() != null)
            originalUser.setEmail(user.getEmail());

        try {
            return update(originalUser);
        } catch (Exception e) {
            throw new DuplicateFiledException(getDuplicateFieldsMessage(e));
        }
    }

    private String getDuplicateFieldsMessage(Exception e) {
        String message = e.getMessage();
        if (message.contains("username_UNIQUE"))
            return "Имя пользователя уже занято";
        if (message.contains("phone_number_UNIQUE"))
            return "Пользователь с таким номером телефона уже существует";
        if (message.contains("email_UNIQUE"))
            return "Пользователь с таким email уже существует";
        throw new RuntimeException();
    }
}
