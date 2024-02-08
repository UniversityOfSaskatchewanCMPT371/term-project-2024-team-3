/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.service.base;

import java.io.Serializable;
import java.util.List;

public interface BaseService<T> {

    /**
     * retrieving a list of T
     * @return List<T>
     */
    public List<T> list();


    /**
     * creating a T
     * @param t
     */
    public Serializable save(T t);


    /**
     * updating an existing T
     * @param t
     */
    public void update(T t);


    /**
     * retrieving a specific T by its id
     * @param id
     * @return T
     */
    public T get(String id);


    /**
     * deleting a specific T by its id
     * @param id
     */
    public void delete(String id);
}
