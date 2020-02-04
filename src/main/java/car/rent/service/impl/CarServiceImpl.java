package car.rent.service.impl;

import car.rent.entity.Car;
import car.rent.repository.CarRepository;
import car.rent.service.api.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CarServiceImpl extends AbstractCrudService<Car> implements CarService {

    private CarRepository carRepository;

    @Autowired
    public CarServiceImpl(CarRepository repository) {
        super(repository);
        carRepository = repository;
    }

    @Override
    protected String getRussianTableName() {
        return "машина";
    }
}
