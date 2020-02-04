package car.rent.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import java.math.BigDecimal;

@Entity
@Table(name = "car")
@Data
@NoArgsConstructor
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotBlank(message = "Модель должна быть указана")
    private String model;

    @NotBlank(message = "Описание автомобиля не должно быть пустым")
    @Column(columnDefinition = "text")
    private String description;

    @NotNull(message = "Цена за автомобиль должна быть указана")
    @Positive(message = "Цена должна быть положительным числом")
    private BigDecimal price;

    @Min(value = 2, message = "Количество мест в автомобиле должно быть указано от 2 до 10")
    @Max(value = 10, message = "Количество мест в автомобиле должно быть указано от 2 до 10")
    private int places;

    @Min(value = 2, message = "Количество дверей в автомобиле должно быть указано от 2 до 7")
    @Max(value = 7, message = "Количество дверей в автомобиле должно быть указано от 2 до 7")
    private int doors;

    @NotBlank(message = "Фото автомобиля должно быть указано")
    @Column(name = "photo", columnDefinition = "longblob")
    private String photo;

    @NotBlank(message = "Текущий аддрес автомобиля должен быть указан")
    @Column(name = "current_address")
    private String currentAddress;

    @Column(columnDefinition = "tinyint")
    private boolean busy;

}
