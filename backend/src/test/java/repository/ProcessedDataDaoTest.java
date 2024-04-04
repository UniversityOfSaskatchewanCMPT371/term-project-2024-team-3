package repository;


import com.beaplab.BeaplabEngine.model.User;
import com.beaplab.BeaplabEngine.repository.PredictedDataDao;
import com.beaplab.BeaplabEngine.repository.ProcessedDataDao;
import com.beaplab.BeaplabEngine.repository.RawDataDao;
import com.beaplab.BeaplabEngine.repository.UserDao;
import org.hibernate.Criteria;
import org.hibernate.SQLQuery;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.runners.MockitoJUnitRunner;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static utils.MockFactory.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class ProcessedDataDaoTest {


    @InjectMocks
    private ProcessedDataDao processedDataDao;
    @Mock
    private SessionFactory sessionFactory;

    private final Session session = Mockito.mock(Session.class);
    private final Criteria criteria = Mockito.mock(Criteria.class);
    private final SQLQuery query = Mockito.mock(SQLQuery.class);

    @Mock
    private PredictedDataDao predictedDataDao;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
        when(sessionFactory.getCurrentSession()).thenReturn(session);

        when(
                session
                        .createSQLQuery(anyString())
        ).thenReturn(query);

        when(
                query
                        .setParameter(anyString(), any())
        ).thenReturn(query);
    }

    /**
     * T??
     * A method that tests deleting processed data and its related predicted data
     * Preconditions: Processed data to be deleted exists
     * Post-conditions: Processed data is deleted
     */
    @Test
    public void testDeleteSucceeded() {
        // Setup mocks
        Session session2 = Mockito.mock(Session.class);
        when(sessionFactory.getCurrentSession()).thenReturn(session2);

        // mock the user id, the linked predicted data found, and the sql queries to find them

        List<Object> predictedDataLinked = new ArrayList<>();
        predictedDataLinked.add(BigInteger.valueOf(1L));

        SQLQuery searchQueryForPredictedDataLinked = Mockito.mock(SQLQuery.class);
        SQLQuery deleteQuery = Mockito.mock(SQLQuery.class);

        // Predicted Data Mocks
        when(
                session2
                        .createSQLQuery(eq("SELECT predicteddataids_id FROM tbl_processed_data_tbl_predicted_data WHERE tbl_processed_data_id = :processed_data_id"))
        ).thenReturn(searchQueryForPredictedDataLinked);
        when(
                searchQueryForPredictedDataLinked
                        .setParameter(eq("processed_data_id"), anyLong())
        ).thenReturn(searchQueryForPredictedDataLinked);

        when(searchQueryForPredictedDataLinked.list()).thenReturn(predictedDataLinked);

        when(session2.createSQLQuery(eq("DELETE FROM tbl_processed_data WHERE id = :processed_data_id")))
                .thenReturn(deleteQuery);
        when(deleteQuery.setParameter(eq("processed_data_id"), anyLong()))
                .thenReturn(deleteQuery);
        when(deleteQuery.executeUpdate()).thenReturn(1);


        // verify that the delete processed data method was called with
        Long userId = 3L;
        when(query.executeUpdate()).thenReturn(1);
        Boolean result = processedDataDao.delete(userId);
        verify(predictedDataDao).delete(1L);
        assertTrue(result);

    }

    /**
     * T??
     * A method that tests deleting processed data and its related predicted data
     * Preconditions: Processed data to be deleted does not exist
     * Post-conditions: Processed data is not deleted
     */
    @Test
    public void testDeleteFailed1() {
        // Setup mocks
        Session session2 = Mockito.mock(Session.class);
        when(sessionFactory.getCurrentSession()).thenReturn(session2);

        // mock the user id, the linked predicted data found, and the sql queries to find them

        List<Object> predictedDataLinked = new ArrayList<>();

        SQLQuery searchQueryForPredictedDataLinked = Mockito.mock(SQLQuery.class);
        SQLQuery deleteQuery = Mockito.mock(SQLQuery.class);

        // Predicted Data Mocks
        when(
                session2
                        .createSQLQuery(eq("SELECT predicteddataids_id FROM tbl_processed_data_tbl_predicted_data WHERE tbl_processed_data_id = :processed_data_id"))
        ).thenReturn(searchQueryForPredictedDataLinked);
        when(
                searchQueryForPredictedDataLinked
                        .setParameter(eq("processed_data_id"), any())
        ).thenReturn(searchQueryForPredictedDataLinked);

        when(session2.createSQLQuery(eq("DELETE FROM tbl_processed_data WHERE id = :processed_data_id")))
                .thenReturn(deleteQuery);
        when(deleteQuery.setParameter(eq("processed_data_id"), anyLong()))
                .thenReturn(deleteQuery);
        when(deleteQuery.executeUpdate()).thenReturn(0);

        when(searchQueryForPredictedDataLinked.list()).thenReturn(predictedDataLinked);
        verify(predictedDataDao, never()).delete(anyLong());

        // verify that the delete processed data method was called with
        Long userId = 3L;
        Boolean result = processedDataDao.delete(userId);
        assertFalse(result);
    }

    /**
     * T??
     * A method that tests deleting processed data and its related predicted data
     * Preconditions: Processed data to be deleted exists and is not linked to any predicted data
     * Post-conditions: Processed data is deleted but predicted is not
     */
    @Test
    public void testDeleteFailed2() {
        // Setup mocks
        Session session2 = Mockito.mock(Session.class);
        when(sessionFactory.getCurrentSession()).thenReturn(session2);

        // mock the user id, the linked predicted data found, and the sql queries to find them

        List<Object> predictedDataLinked = new ArrayList<>();

        SQLQuery searchQueryForPredictedDataLinked = Mockito.mock(SQLQuery.class);
        SQLQuery deleteQuery = Mockito.mock(SQLQuery.class);

        // Predicted Data Mocks
        when(
                session2
                        .createSQLQuery(eq("SELECT predicteddataids_id FROM tbl_processed_data_tbl_predicted_data WHERE tbl_processed_data_id = :processed_data_id"))
        ).thenReturn(searchQueryForPredictedDataLinked);
        when(
                searchQueryForPredictedDataLinked
                        .setParameter(eq("processed_data_id"), any())
        ).thenReturn(searchQueryForPredictedDataLinked);

        when(session2.createSQLQuery(eq("DELETE FROM tbl_processed_data WHERE id = :processed_data_id")))
                .thenReturn(deleteQuery);
        when(deleteQuery.setParameter(eq("processed_data_id"), anyLong()))
                .thenReturn(deleteQuery);
        when(deleteQuery.executeUpdate()).thenReturn(1);

        when(searchQueryForPredictedDataLinked.list()).thenReturn(predictedDataLinked);
        verify(predictedDataDao, never()).delete(anyLong());

        // verify that the delete processed data method was called with
        Long userId = 3L;
        when(query.executeUpdate()).thenReturn(1);
        Boolean result = processedDataDao.delete(userId);
        assertTrue(result);

    }


}

