package car.rent.repository;

import car.rent.entity.Car;
import car.rent.entity.RentApplication;
import car.rent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface RentApplicationRepository extends JpaRepository<RentApplication, Integer> {

    List<RentApplication> findByUser(User user);

    Optional<RentApplication> findByUserAndRentEnd(User user, LocalDateTime rentEnd);

    Optional<RentApplication> findByIdAndUser(int id, User user);

    Optional<RentApplication> getByUser(User user);

    Optional<RentApplication> findByCarAndUserAndRentEnd(Car car, User user, LocalDateTime rentEnd);
}
