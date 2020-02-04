package car.rent.entity;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "rent_application")
@Data
@NoArgsConstructor
public class RentApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    @Column(name = "total_price")
    private BigDecimal totalPrice;

    @Column(name = "rent_start")
    private LocalDateTime rentStart;

    @Column(name = "rent_end")
    private LocalDateTime rentEnd;

    @Column(name = "car_locked", columnDefinition = "tinyint")
    private boolean carLocked;

}
