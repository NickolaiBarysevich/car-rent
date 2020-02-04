package car.rent.controller;

import car.rent.entity.Car;
import car.rent.secutiry.Secured;
import car.rent.service.api.CarService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static car.rent.entity.UserRole.ADMIN;

@RestController
@RequestMapping(value = "/api/cars",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
public class CarController {

    private CarService service;

    public CarController(CarService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Car>> getCars() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable int id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    @Secured(ADMIN)
    public ResponseEntity<Car> createCar(@RequestBody Car car) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.create(car));
    }

    @PutMapping("/{id}")
    @Secured(ADMIN)
    public ResponseEntity<Car> editCar(@PathVariable int id, @RequestBody Car car) {
        car.setId(id);
        return ResponseEntity.ok(service.update(car));
    }

    @DeleteMapping("/{id}")
    @Secured(ADMIN)
    public ResponseEntity<Object> deleteCar(@PathVariable int id) {
        service.delete(id);
        return ResponseEntity.ok().build();
    }
}
