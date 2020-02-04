package car.rent.exception;

import lombok.Getter;

public class EntityNotFoundException extends RuntimeException {

    @Getter
    private final int id;

    public EntityNotFoundException(String message, int id) {
        super(message);
        this.id = id;
    }
}
