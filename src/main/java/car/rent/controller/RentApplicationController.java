package car.rent.controller;

import car.rent.entity.RentApplication;
import car.rent.secutiry.Secured;
import car.rent.service.api.RentApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static car.rent.entity.UserRole.ADMIN;
import static car.rent.entity.UserRole.CLIENT;

@RestController
@RequestMapping(value = "/api/applications",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
public class RentApplicationController {

    private RentApplicationService applicationService;

    public RentApplicationController(RentApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping("/{id}")
    @Secured(ADMIN)
    public ResponseEntity<RentApplication> getRentApplication(@PathVariable int id) {
        return ResponseEntity.ok(applicationService.findById(id));
    }

    @GetMapping
    @Secured(ADMIN)
    public ResponseEntity<List<RentApplication>> getApplications() {
        return ResponseEntity.ok(applicationService.findAll());
    }

    @GetMapping(params = "username")
    @Secured(CLIENT)
    public ResponseEntity<RentApplication> getApplicationByUsername(@RequestParam String username) {
        return ResponseEntity.ok(applicationService.findByUserName(username));
    }

    @GetMapping(params = "lastName")
    @Secured(ADMIN)
    public ResponseEntity<List<RentApplication>> getApplicationsByLastName(@RequestParam String lastName) {
        return ResponseEntity.ok(applicationService.findByUserLastName(lastName));
    }

    @GetMapping(params = "mine")
    @Secured(CLIENT)
    public ResponseEntity<List<RentApplication>> getUserApplications() {
        return ResponseEntity.ok(applicationService.findUserRentApplications());
    }

    @PostMapping(params = {"book", "carId"})
    @Secured(CLIENT)
    public ResponseEntity<RentApplication> bookCar(@RequestParam int carId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(applicationService.bookCar(carId));
    }

    @PostMapping(params = {"unBook", "carId"})
    @Secured(CLIENT)
    public ResponseEntity<RentApplication> unBookCar(@RequestParam int carId) {
        applicationService.unBookCar(carId);
        return ResponseEntity.ok().build();
    }

    @PutMapping(params = {"start", "carId"})
    @Secured(CLIENT)
    public ResponseEntity<RentApplication> startRent(@RequestParam int carId) {
        return ResponseEntity.ok(applicationService.startRent(carId));
    }

    @PutMapping(value = "/{id}", params = "newAddress")
    @Secured(CLIENT)
    public ResponseEntity<RentApplication> endRent(@PathVariable int id, @RequestParam String newAddress) {
        return ResponseEntity.ok(applicationService.endRent(id, newAddress));
    }

    @PutMapping(value = "/{id}", params = "lock")
    @Secured(CLIENT)
    public ResponseEntity<RentApplication> toggleCarLock(@PathVariable int id) {
        return ResponseEntity.ok(applicationService.toggleCarLock(id));
    }
}
