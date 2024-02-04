/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.util.objectMapper.base;

import java.util.List;

/**
 * The base interface of mapper classes
 * @param <M>
 * @param <D>
 */
public interface BaseMapper<M, D> {


    /**
     * converting a model to dto
     * @param modelClass
     * @param dtoClass
     * @return
     */
    public D model2Dto(M modelClass, D dtoClass);


    /**
     * converting a list of model to a list of dto
     * @param modelClass
     * @param dtoClass
     * @return
     */
    public List<D> model2Dto(List<M> modelClass, List<D> dtoClass);


    /**
     * converting a dto to model
     * @param dtoClass
     * @param modelClass
     * @return
     */
    public M dto2Model(D dtoClass, M modelClass);


    /**
     * converting a list of dto to a list of model
     * @param dtoClass
     * @param modelClass
     * @return
     */
    public List<M> dto2Model(List<D> dtoClass, List<M> modelClass);

}
