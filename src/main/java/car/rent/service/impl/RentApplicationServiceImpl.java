package car.rent.service.impl;

import car.rent.entity.Car;
import car.rent.entity.CreditCard;
import car.rent.entity.RentApplication;
import car.rent.entity.User;
import car.rent.exception.AlreadyBookedException;
import car.rent.exception.ApplicationEndedException;
import car.rent.exception.CarIsBusyException;
import car.rent.exception.EntityNotFoundException;
import car.rent.exception.NoCreditCardException;
import car.rent.exception.NotBookedCarException;
import car.rent.exception.UserNotApprovedException;
import car.rent.repository.RentApplicationRepository;
import car.rent.secutiry.AuthenticationContext;
import car.rent.service.api.CarService;
import car.rent.service.api.CreditCardService;
import car.rent.service.api.RentApplicationService;
import car.rent.service.api.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class RentApplicationServiceImpl extends AbstractCrudService<RentApplication> implements RentApplicationService {

    private RentApplicationRepository rentApplicationRepository;
    private UserService userService;
    private CarService carService;
    private CreditCardService creditCardService;

    @Autowired
    public RentApplicationServiceImpl(RentApplicationRepository repository, UserService userService,
                                      CarService carService, CreditCardService creditCardService) {
        super(repository);
        rentApplicationRepository = repository;
        this.userService = userService;
        this.carService = carService;
        this.creditCardService = creditCardService;
    }

    @Override
    public RentApplication endRent(int applicationId, String newAddress) {
        RentApplication rentApplication = rentApplicationRepository
                .findByIdAndUser(applicationId, getUserFromContext())
                .orElseThrow(() -> new EntityNotFoundException("заявка на поездку", applicationId));
        if (rentApplication.getRentEnd() != null)
            throw new ApplicationEndedException();
        LocalDateTime rentEndTime = LocalDateTime.now();
        rentApplication.setRentEnd(rentEndTime);
        rentApplication.setCarLocked(true);
        Car car = rentApplication.getCar();
        car.setCurrentAddress(newAddress);
        car.setBusy(false);
        rentApplication.setTotalPrice(countTotalCost(rentApplication));
        return update(rentApplication);
    }

    private BigDecimal countTotalCost(RentApplication application) {
        BigDecimal price = application.getCar().getPrice();
        LocalDateTime rentStart = application.getRentStart();
        long minutes = Duration.between(rentStart, application.getRentEnd()).toMinutes();
        return price.multiply(new BigDecimal(minutes)).add(application.getCar().getPrice());
    }

    @Override
    public RentApplication toggleCarLock(int applicationId) {
        RentApplication rentApplication = rentApplicationRepository
                .findByIdAndUser(applicationId, getUserFromContext())
                .orElseThrow(() -> new EntityNotFoundException("заявка на поездку", applicationId));
        if (rentApplication.getRentEnd() != null)
            throw new ApplicationEndedException();
        rentApplication.setCarLocked(!rentApplication.isCarLocked());
        return update(rentApplication);
    }

    @Override
    public RentApplication bookCar(int carId) {
        Car car = carService.findById(carId);
        if (car.isBusy())
            throw new CarIsBusyException();
        User user = userService.findById(AuthenticationContext.getUserPrincipal().getId());
        if (!user.isApproved())
            throw new UserNotApprovedException();
        RentApplication userApplications = rentApplicationRepository.findByUserAndRentEnd(user, null).orElse(null);
        if (userApplications != null) {
            throw new AlreadyBookedException();
        }
        RentApplication rentApplication = new RentApplication();
        rentApplication.setUser(user);
        rentApplication.setCar(car);
        rentApplication.getCar().setBusy(true);
        return create(rentApplication);
    }

    @Override
    public RentApplication startRent(int carId) {
        User user = userService.findById(AuthenticationContext.getUserPrincipal().getId());
        RentApplication rentApplication = rentApplicationRepository.findByUserAndRentEnd(user, null).orElseThrow(NotBookedCarException::new);
        Car car = carService.findById(carId);
        if (!rentApplication.getCar().equals(car))
            throw new NotBookedCarException();
        CreditCard creditCard = creditCardService.findByUserAndMain(user, true);
        if (Objects.isNull(creditCard))
            throw new NoCreditCardException();
        rentApplication.setRentStart(LocalDateTime.now());
        return update(rentApplication);
    }

    private User getUserFromContext() {
        return userService.findById(AuthenticationContext.getUserPrincipal().getId());
    }

    @Override
    public List<RentApplication> findUserRentApplications() {
        return rentApplicationRepository.findByUser(getUserFromContext());
    }

    @Override
    public List<RentApplication> findByUserLastName(String lastName) {
        List<User> users = userService.findByLastName(lastName);
        List<RentApplication> applications = new ArrayList<>();
        for (User user : users) {
            applications.addAll(rentApplicationRepository.findByUser(user));
        }
        return applications;
    }

    @Override
    public void unBookCar(int carId) {
        Car car = carService.findById(carId);
        User user = userService.findById(AuthenticationContext.getUserPrincipal().getId());
        RentApplication rentApplication = rentApplicationRepository.findByCarAndUserAndRentEnd(car, user, null).orElseThrow(NotBookedCarException::new);
        rentApplication.getCar().setBusy(false);
        rentApplication.setCar(null);
        rentApplication.setUser(null);
        rentApplicationRepository.delete(rentApplication);
    }

    @Override
    protected String getRussianTableName() {
        return "заявка на поездку";
    }

    @Override
    public RentApplication findByUserName(String username) {
        User user = userService.findByUsername(username);
        return rentApplicationRepository.findByUserAndRentEnd(user, null).orElseThrow(() -> new EntityNotFoundException("Заказ", user.getId()));
    }
}
