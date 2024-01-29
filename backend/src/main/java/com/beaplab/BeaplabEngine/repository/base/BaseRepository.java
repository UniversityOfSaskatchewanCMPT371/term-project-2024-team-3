/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.repository.base;

import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.math.BigInteger;
import java.util.List;
import java.util.UUID;

public interface BaseRepository<T> {

    /**
     * retrieving a list of T
     * @return List<T>
     */
    @Transactional
    public List<T> list();


    /**
     * creating a T
     * @param t
     */
    public Long save(T t);


    /**
     * updating an existing T
     * @param t
     */
    public void update(T t);


    /**
     * retrieving a specific T by its id
     * @param uuid
     * @return T
     */
    public T get(Long uuid);


    /**
     * deleting a specific T by its id
     * @param uuid
     */
    public void delete(Long uuid);
}
