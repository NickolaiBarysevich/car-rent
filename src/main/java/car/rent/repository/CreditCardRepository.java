package car.rent.repository;

import car.rent.entity.CreditCard;
import car.rent.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CreditCardRepository extends JpaRepository<CreditCard, Integer> {

    List<CreditCard> findAllByUser(User user);

    Optional<CreditCard> findByIdAndUser(int id, User user);

    void deleteByIdAndUser(int id, User user);

    CreditCard findByUserAndMain(User user, boolean main);
}
