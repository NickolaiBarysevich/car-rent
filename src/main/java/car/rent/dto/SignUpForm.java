package car.rent.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.hibernate.validator.constraints.Length;

import javax.persistence.Column;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

@Getter
@RequiredArgsConstructor
public class SignUpForm {

    @NotBlank(message = "Имя пользователя не должно быть пустым")
    @Length(min = 3, max = 20, message = "Имя пользователя должно быть от 3 до 20 символов")
    private final String username;

    @NotBlank(message = "Пароль не должен быть пустым")
    @Length(min = 4, message = "Пароль должен быть от 8 символов")
    private final String password;

    @NotBlank(message = "Имя не должно быть пустым")
    @Column(name = "first_name")
    private final String firstName;

    @NotBlank(message = "Фамилия не должна быть пустой")
    @Column(name = "last_name")
    private final String lastName;

    @NotBlank(message = "Номер телефона на должен быть пустым")
    @Column(name = "phone_number")
    private final String phoneNumber;

    @NotBlank(message = "Email не должен быть пустым")
    @Email(message = "Email указан не верно")
    private final String email;

    @NotBlank(message = "Фото паспорта должно быть указано")
    @Column(name = "passport_photo")
    private final String passportPhoto;

    @NotBlank(message = "Фото водительского удостоверения должно быть указано")
    @Column(name = "driver_license_photo")
    private final String driverLicensePhoto;
}
