package car.rent.controller;

import car.rent.entity.CreditCard;
import car.rent.secutiry.Secured;
import car.rent.service.api.CreditCardService;
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

import static car.rent.entity.UserRole.CLIENT;

@RestController
@RequestMapping(value = "/api/cards",
        consumes = MediaType.APPLICATION_JSON_VALUE,
        produces = MediaType.APPLICATION_JSON_VALUE)
public class CreditCardController {

    private CreditCardService creditCardService;

    public CreditCardController(CreditCardService creditCardService) {
        this.creditCardService = creditCardService;
    }

    @GetMapping
    @Secured(CLIENT)
    public ResponseEntity<List<CreditCard>> getCards() {
        return ResponseEntity.ok(creditCardService.findAllForUser());
    }

    @GetMapping("/{id}")
    @Secured(CLIENT)
    public ResponseEntity<CreditCard> getCreditCard(@PathVariable int id) {
        return ResponseEntity.ok(creditCardService.findByIdAndUser(id));
    }

    @PostMapping
    @Secured(CLIENT)
    public ResponseEntity<CreditCard> createCreditCard(@RequestBody CreditCard creditCard) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(creditCardService.create(creditCard));
    }

    @DeleteMapping("/{id}")
    @Secured(CLIENT)
    public ResponseEntity<Void> deleteCreditCard(@PathVariable int id) {
        creditCardService.delete(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping("/{id}")
    @Secured(CLIENT)
    public ResponseEntity<CreditCard> makeMain(@PathVariable int id) {
        return ResponseEntity.ok(creditCardService.makeMain(id));
    }
}
