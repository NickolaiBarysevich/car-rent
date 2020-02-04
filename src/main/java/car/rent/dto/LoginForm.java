package car.rent.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotBlank;

@Getter
@RequiredArgsConstructor
public class LoginForm {

    @NotBlank(message = "Имя пользователя должно быть указано")
    @Length(min = 3, max = 20, message = "Имя пользователя должно быть от 3 до 20 символов")
    private final String username;

    @NotBlank(message = "Пароль не должен быть пустым")
    @Length(min = 4, max = 30,message = "Пароль должен быть от 4 до 30 символов")
    private final String password;
}
