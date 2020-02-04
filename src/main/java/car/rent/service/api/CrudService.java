package car.rent.service.api;

import java.util.List;

public interface CrudService<T> {

    T create(T entity);

    T update(T entity);

    void delete(int id);

    T findById(int id);

    List<T> findAll();
}
