package car.rent.service.impl;

import car.rent.exception.EntityNotFoundException;
import car.rent.service.api.CrudService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public abstract class AbstractCrudService<T> implements CrudService<T> {

    private JpaRepository<T, Integer> repository;

    public AbstractCrudService(JpaRepository<T, Integer> repository) {
        this.repository = repository;
    }

    @Override
    public T create(T entity) {
        return repository.save(entity);
    }

    @Override
    public T update(T entity) {
        return repository.saveAndFlush(entity);
    }

    @Override
    public void delete(int id) {
        repository.deleteById(id);
    }

    @Override
    public T findById(int id) {
        return repository.findById(id).orElseThrow(() -> new EntityNotFoundException(getRussianTableName(), id));
    }

    @Override
    public List<T> findAll() {
        return repository.findAll();
    }

    protected abstract String getRussianTableName();
}
