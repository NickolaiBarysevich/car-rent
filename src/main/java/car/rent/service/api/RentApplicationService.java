package car.rent.service.api;

import car.rent.entity.RentApplication;

import java.util.List;

public interface RentApplicationService extends CrudService<RentApplication> {

    RentApplication endRent(int applicationId, String newAddress);

    RentApplication toggleCarLock(int applicationId);

    RentApplication startRent(int carId);

    List<RentApplication> findUserRentApplications();

    RentApplication findByUserName(String username);

    List<RentApplication> findByUserLastName(String lastName);

    RentApplication bookCar(int carId);

    void unBookCar(int carId);
}
