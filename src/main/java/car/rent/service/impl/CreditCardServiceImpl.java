package car.rent.service.impl;

import car.rent.entity.CreditCard;
import car.rent.entity.User;
import car.rent.exception.CardAlreadyExistsException;
import car.rent.exception.EntityNotFoundException;
import car.rent.repository.CreditCardRepository;
import car.rent.secutiry.AuthenticationContext;
import car.rent.secutiry.UserPrincipal;
import car.rent.service.api.CreditCardService;
import car.rent.service.api.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@Transactional
public class CreditCardServiceImpl extends AbstractCrudService<CreditCard> implements CreditCardService {

    private CreditCardRepository creditCardRepository;
    private UserService userService;

    @Autowired
    public CreditCardServiceImpl(CreditCardRepository repository, UserService userService) {
        super(repository);
        creditCardRepository = repository;
        this.userService = userService;
    }

    @Override
    public List<CreditCard> findAllForUser() {
        User user = getUserFromContext();
        return creditCardRepository.findAllByUser(user);
    }

    private User getUserFromContext() {
        UserPrincipal userPrincipal = AuthenticationContext.getUserPrincipal();
        return userService.findById(userPrincipal.getId());
    }

    @Override
    public CreditCard findByIdAndUser(int id) {
        return creditCardRepository
                .findByIdAndUser(id, getUserFromContext())
                .orElseThrow(() -> new EntityNotFoundException("кредитная карта", id));
    }

    @Override
    public CreditCard create(CreditCard creditCard) {
        User user = getUserFromContext();
        creditCard.setUser(user);
        List<CreditCard> creditCards = creditCardRepository.findAllByUser(user);
        if (creditCards.isEmpty()) {
            creditCard.setMain(true);
        }
        try {
            return super.create(creditCard);
        } catch (Exception e) {
            throw new CardAlreadyExistsException();
        }
    }

    @Override
    public void delete(int id) {
        User user = getUserFromContext();
        CreditCard creditCard = creditCardRepository.findByIdAndUser(id, user).orElseThrow(() -> new EntityNotFoundException("Кредитная карта", id));
        creditCard.setUser(null);
        if (creditCard.isMain()) {
            assignAnotherCardAsMain();
        }
        super.delete(id);
    }

    private void assignAnotherCardAsMain() {
        List<CreditCard> creditCards = creditCardRepository.findAllByUser(getUserFromContext());
        if (!creditCards.isEmpty()) {
            CreditCard otherCreditCard = creditCards.get(0);
            otherCreditCard.setMain(true);
            creditCardRepository.saveAndFlush(otherCreditCard);
        }
    }

    @Override
    public void deleteByIdAndUser(int id) {
        creditCardRepository.deleteByIdAndUser(id, getUserFromContext());
    }

    @Override
    protected String getRussianTableName() {
        return "кредитная карта";
    }

    @Override
    public CreditCard findByUserAndMain(User user, boolean main) {
        return creditCardRepository.findByUserAndMain(user, main);
    }

    @Override
    public CreditCard makeMain(int id) {
        List<CreditCard> creditCards = creditCardRepository.findAllByUser(getUserFromContext());
        CreditCard targetCard = null;
        for (CreditCard creditCard : creditCards) {
            if (creditCard.isMain()) {
                creditCard.setMain(false);
                creditCardRepository.saveAndFlush(creditCard);
            }
            if (creditCard.getId() == id) {
                targetCard = creditCard;
                targetCard.setMain(true);
            }
        }
        if (Objects.isNull(targetCard)) {
            throw new EntityNotFoundException("Кредитная карта", id);
        }
        return creditCardRepository.saveAndFlush(targetCard);
    }
}
