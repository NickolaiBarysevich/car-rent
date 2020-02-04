package car.rent.service.api;

import car.rent.entity.CreditCard;
import car.rent.entity.User;

import java.util.List;

public interface CreditCardService extends CrudService<CreditCard> {

    List<CreditCard> findAllForUser();

    CreditCard findByIdAndUser(int id);

    void deleteByIdAndUser(int id);

    CreditCard findByUserAndMain(User user, boolean main);

    CreditCard makeMain(int id);
}
