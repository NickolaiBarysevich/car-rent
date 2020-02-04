package car.rent.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "user")
@Data
@NoArgsConstructor
@ToString(exclude = "password")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String username;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "phone_number")
    private String phoneNumber;

    private String email;

    @Column(columnDefinition = "tinyint")
    private boolean approved;

    @Column(name = "passport_photo", columnDefinition = "longblob")
    private String passportPhoto;

    @Column(name = "driver_license_photo", columnDefinition = "longblob")
    private String driverLicensePhoto;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "enum")
    private UserRole role;

}
