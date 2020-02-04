package car.rent.exception.handler;

import car.rent.exception.AlreadyBookedException;
import car.rent.exception.ApplicationEndedException;
import car.rent.exception.CarIsBusyException;
import car.rent.exception.CardAlreadyExistsException;
import car.rent.exception.DuplicateFiledException;
import car.rent.exception.EntityNotFoundException;
import car.rent.exception.ForbiddenException;
import car.rent.exception.InvalidCredentialsException;
import car.rent.exception.NoCreditCardException;
import car.rent.exception.NotBookedCarException;
import car.rent.exception.UnauthorizedException;
import car.rent.exception.UserNotApprovedException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@ControllerAdvice
public class ExceptionsHandler extends ResponseEntityExceptionHandler {

    private ResponseEntity<Object> handleException(String message, HttpStatus errorStatus) {
        return ResponseEntity
                .status(errorStatus)
                .body(new ErrorResponse(message));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Object> handleEntityNotFoundException(EntityNotFoundException exception) {
        return handleException(
                String.format("Сущность %s с id: %d не найдена", exception.getMessage(), exception.getId()),
                NOT_FOUND);
    }

    @ExceptionHandler(ApplicationEndedException.class)
    public ResponseEntity<Object> handleApplicationEndedException() {
        return handleException("Эта поездка уже завершена", BAD_REQUEST);
    }

    @ExceptionHandler(CarIsBusyException.class)
    public ResponseEntity<Object> handleCarIsBusyException() {
        return handleException("Эта машина сейчас занята", BAD_REQUEST);
    }

    @ExceptionHandler(UserNotApprovedException.class)
    public ResponseEntity<Object> handleUserNotApprovedException() {
        return handleException("Ваши документы еще не проверены", BAD_REQUEST);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<Object> handleInvalidCredentialsException() {
        return handleException("Имя пользователя или пароль указаны не верно", UNAUTHORIZED);
    }

    @ExceptionHandler(NoCreditCardException.class)
    public ResponseEntity<Object> handleNoCreditCardException() {
        return handleException("Укажите хотя бы одну кредитную карту, чтобы начать поездку", BAD_REQUEST);
    }

    @ExceptionHandler(CardAlreadyExistsException.class)
    public ResponseEntity<Object> handleCardAlreadyExistsException() {
        return handleException("Карта с таким номером уже привязана", BAD_REQUEST);
    }

    @ExceptionHandler(DuplicateFiledException.class)
    public ResponseEntity<Object> handleDuplicateFiledException(DuplicateFiledException e) {
        return handleException(e.getMessage(), BAD_REQUEST);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Object> handleConstraintViolationException(ConstraintViolationException exception) {
        StringBuilder builder = new StringBuilder();
        for (ConstraintViolation<?> constraintViolation : exception.getConstraintViolations()) {
            builder.append(constraintViolation.getMessage());
            builder.append(". ");
        }
        String message = builder.toString();
        return handleException(message.substring(0, message.length() - 2), BAD_REQUEST);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Object> handleUnauthorizedException() {
        return handleException("Для доступа к ресурсу войдите в систему", UNAUTHORIZED);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Object> handleForbiddenException() {
        return handleException("У вас недостаточно прав для доступа к ресурсу", FORBIDDEN);
    }

    @ExceptionHandler(NotBookedCarException.class)
    public ResponseEntity<Object> handleNotBookedCarException() {
        return handleException("Машина не была забронирована", BAD_REQUEST);
    }

    @ExceptionHandler(AlreadyBookedException.class)
    public ResponseEntity<Object> handleAlreadyBookedException() {
        return handleException("У вас уже есть забронированная машина", BAD_REQUEST);
    }

    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(NoHandlerFoundException ex, HttpHeaders headers, HttpStatus status, WebRequest request) {
        return handleException("Ресурс не найден", NOT_FOUND);
    }

    @Override
    protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body, HttpHeaders headers, HttpStatus status, WebRequest request) {
        return handleException("Произошла неизвестная ошибка", INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleUnknownException(Exception e) {
        return handleException("Произошла неизвестная ошибка", INTERNAL_SERVER_ERROR);
    }
}
