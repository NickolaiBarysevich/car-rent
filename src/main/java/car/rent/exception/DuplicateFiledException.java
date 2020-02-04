package car.rent.exception;

public class DuplicateFiledException extends RuntimeException {

    public DuplicateFiledException(String message) {
        super(message);
    }

    public DuplicateFiledException() {
    }
}
