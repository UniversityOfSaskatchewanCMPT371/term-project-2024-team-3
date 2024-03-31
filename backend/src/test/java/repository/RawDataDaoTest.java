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
public class RawDataDaoTest {


    @InjectMocks
    private RawDataDao rawDataDao;
    @Mock
    private SessionFactory sessionFactory;

    private final Session session = Mockito.mock(Session.class);
    private final Criteria criteria = Mockito.mock(Criteria.class);
    private final SQLQuery query = Mockito.mock(SQLQuery.class);

    @Mock
    private PredictedDataDao predictedDataDao;

    @Mock
    private ProcessedDataDao processedDataDao;
    @Mock
    private UserDao userDao;

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
     * A method that tests deleting raw data's relation to a user
     * Preconditions: Relation to user exists
     * Post-conditions: Relation is deleted
     */
    @Test
    public void testDeleteRelationToUserExists() {
        Long userId = 3L;

        when(query.executeUpdate()).thenReturn(1);

        Boolean result = rawDataDao.deleteRelationToUser(userId);

        assertTrue(result);
    }

    /**
     * T??
     * A method that tests deleting raw data's relation to a user
     * Preconditions: Relation to user does not exist
     * Post-conditions: Relation is not deleted
     */
    @Test
    public void testDeleteRelationToUserDoesNotExist() {
        Long userId = 3L;

        when(query.executeUpdate()).thenReturn(0);

        Boolean result = rawDataDao.deleteRelationToUser(userId);

        assertFalse(result);
    }

    /**
     * T??
     * A method that tests deleting raw data
     * Preconditions: Raw data to be deleted exists
     * Post-conditions: Raw data is deleted
     */
    @Test
    public void testDeleteSucceeded() {
        Long userId = 3L;

        when(query.executeUpdate()).thenReturn(1);

        Boolean result = rawDataDao.delete(userId);

        assertTrue(result);
    }

    /**
     * T??
     * A method that tests deleting raw data
     * Preconditions: Raw data to be deleted exists
     * Post-conditions: Raw data is deleted
     */
    @Test
    public void testDeleteFailed() {
        Long userId = 3L;

        when(query.executeUpdate()).thenReturn(0);

        Boolean result = rawDataDao.delete(userId);

        assertFalse(result);
    }




}
