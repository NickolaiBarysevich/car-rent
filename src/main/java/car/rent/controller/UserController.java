package car.rent.controller;

import car.rent.dto.LoginForm;
import car.rent.dto.SignUpForm;
import car.rent.entity.User;
import car.rent.secutiry.AuthenticationProvider;
import car.rent.secutiry.AuthenticationResponse;
import car.rent.secutiry.Secured;
import car.rent.service.api.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static car.rent.entity.UserRole.ADMIN;
import static car.rent.entity.UserRole.CLIENT;

@RestController
@RequestMapping(value = "/api/users",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
public class UserController {

    private UserService userService;
    private AuthenticationProvider authProvider;

    public UserController(UserService userService, AuthenticationProvider authProvider) {
        this.userService = userService;
        this.authProvider = authProvider;
    }

    @GetMapping
    @Secured(ADMIN)
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(userService.getUsers());
    }

    @GetMapping(params = "lastName")
    @Secured(ADMIN)
    public ResponseEntity<List<User>> getUsers(@RequestParam String lastName) {
        return ResponseEntity.ok(userService.findByLastName(lastName));
    }

    @GetMapping(params = "info")
    @Secured(CLIENT)
    public ResponseEntity<User> getUserInfo() {
        return ResponseEntity.ok(userService.getUserInfo());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody LoginForm loginForm) {
        return ResponseEntity.ok(authProvider.generateJwtToken(userService.login(loginForm)));
    }

    @PostMapping("/signUp")
    public ResponseEntity<User> signUp(@RequestBody SignUpForm signUpForm) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userService.createFromForm(signUpForm));
    }

    @PutMapping(value = "/{id}", params = "approve")
    @Secured(ADMIN)
    public ResponseEntity<User> approveUser(@PathVariable int id) {
        User user = userService.findById(id);
        user.setApproved(true);
        return ResponseEntity.ok(userService.update(user));
    }

    @PutMapping(params = "update")
    @Secured(CLIENT)
    public ResponseEntity<AuthenticationResponse> updateUser(@RequestBody User user) {
        AuthenticationResponse authenticationResponse = authProvider.generateJwtToken(userService.updateUser(user));
        return ResponseEntity.ok(authenticationResponse);
    }
}
