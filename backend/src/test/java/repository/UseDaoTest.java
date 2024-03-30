package repository;

import com.beaplab.BeaplabEngine.model.User;
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
public class UseDaoTest {

    @InjectMocks
    private UserDao userDao;

    @Mock
    private SessionFactory sessionFactory;

    private final Session session = Mockito.mock(Session.class);
    private final Criteria criteria = Mockito.mock(Criteria.class);
    private final SQLQuery query = Mockito.mock(SQLQuery.class);

    @Mock
    private RawDataDao rawDataDao;

    @Mock
    private ProcessedDataDao processedDataDao;

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
     * T5.??
     * Preconditions: User exists
     * Post-conditions: User is updated
     */
    @Test
    public void testNewUpdateWhenUserExists() {
        List<User> expected = new ArrayList<>();
        User user = mockUser();
        user.setId(1L);
        expected.add(user);

        when(query.list()).thenReturn(expected);

        when(query.executeUpdate()).thenReturn(1);

        Boolean result = userDao.newUpdate(user);

        assertTrue(result);
    }

    /**
     * T5.??
     * Preconditions: User does not exist
     * Post-conditions: User is not updated
     */
    @Test
    public void testNewUpdateWhenUserDoesNotExists() {
        List<User> expected = new ArrayList<>();
        User user = mockUser();
        user.setId(1L);
        expected.add(user);

        when(query.list()).thenReturn(expected);

        when(query.executeUpdate()).thenReturn(0);

        Boolean result = userDao.newUpdate(user);

        assertFalse(result);
    }

    /**
     * T5.??
     * Preconditions: User has relation to role
     * Post-conditions: User relation to role is deleted
     */
    @Test
    public void testDeleteRelationToRoleExists() {
        Long userId = 3L;

        when(query.executeUpdate()).thenReturn(1);

        Boolean result = userDao.deleteRelationToRole(userId);

        assertTrue(result);
    }

    /**
     * T5.??
     * Preconditions: User has no relation to role
     * Post-conditions: User relation to role is not deleted
     */
    @Test
    public void testDeleteRelationToRoleNotExists() {
        Long userId = 3L;

        when(query.executeUpdate()).thenReturn(0);

        Boolean result = userDao.deleteRelationToRole(userId);

        assertFalse(result);
    }

    /**
     * T5.??
     * Preconditions: User has relation to access group
     * Post-conditions: User relation to access group is deleted
     */
    @Test
    public void testDeleteRelationToAccessGroupExists() {
        Long userId = 3L;

        when(query.executeUpdate()).thenReturn(1);

        Boolean result = userDao.deleteRelationToAccessGroup(userId);

        assertTrue(result);
    }

    /**
     * T5.??
     * Preconditions: User has no relation to access group
     * Post-conditions: User relation to access group is not deleted
     */
    @Test
    public void testDeleteRelationToAccessGroupNotExists() {
        Long userId = 3L;

        when(query.executeUpdate()).thenReturn(0);

        Boolean result = userDao.deleteRelationToAccessGroup(userId);

        assertFalse(result);
    }

    /**
     * T5.??
     * Preconditions: Use has login history
     * Post-conditions: User login history is deleted
     */
    @Test
    public void testDeleteUserLoginHistoryExists() {
        Long userId = 3L;

        when(query.executeUpdate()).thenReturn(1);

        Boolean result = userDao.deleteUserLoginHistory(userId);

        assertTrue(result);
    }

    /**
     * T5.??
     * Preconditions: Use has no login history
     * Post-conditions: User login history is not deleted
     */
    @Test
    public void testDeleteUserLoginHistoryNotExists() {
        Long userId = 3L;

        when(query.executeUpdate()).thenReturn(0);

        Boolean result = userDao.deleteUserLoginHistory(userId);

        assertFalse(result);
    }

    /**
     * T5.??
     * Preconditions: Use has incorrect login history
     * Post-conditions: User incorrect login history is deleted
     */
    @Test
    public void testDeleteUserIncorrectLoginHistoryExist() {
        Long userId = 3L;

        when(query.executeUpdate()).thenReturn(1);

        Boolean result = userDao.deleteUserIncorrectLoginHistory(userId);

        assertTrue(result);
    }

    /**
     * T5.??
     * Preconditions: Use has no incorrect login history
     * Post-conditions: User incorrect login history is not deleted
     */
    @Test
    public void testDeleteUserIncorrectLoginHistoryNotExist() {
        Long userId = 3L;

        when(query.executeUpdate()).thenReturn(0);

        Boolean result = userDao.deleteUserIncorrectLoginHistory(userId);

        assertFalse(result);
    }

    /**
     * T5.??
     * Preconditions: User account exists in database
     * Post-conditions: User account and relations are deleted
     */
    @Test
    public void testDeleteUserAccountExist() {
        Long userId = 3L;

        when(query.executeUpdate()).thenReturn(1);

        Boolean result = userDao.deleteUserAccount(userId);

        assertTrue(result);
    }

    /**
     * T5.??
     * Preconditions: User account does not exist in database
     * Post-conditions: User account and relations are not deleted
     */
    @Test
    public void testDeleteUserAccountNotExist() {
        Long userId = 3L;

        when(query.executeUpdate()).thenReturn(0);

        Boolean result = userDao.deleteUserAccount(userId);

        assertFalse(result);
    }

    /**
     * T5.??
     * Preconditions: User has data
     * Post-conditions: User data is deleted
     */
    @Test
    public void testDeleteUserDataSucceeded() {
        // Setup mocks
        Session session2 = Mockito.mock(Session.class);

        when(sessionFactory.getCurrentSession()).thenReturn(session2);

        Long userId = 1L;
        List<Object> rawData = new ArrayList<>();
        rawData.add(BigInteger.valueOf(1L));

        List<Object> processedData = new ArrayList<>();
        processedData.add(BigInteger.valueOf(2L));

        SQLQuery searchQueryForRawData = Mockito.mock(SQLQuery.class);
        SQLQuery searchQueryForProcessedData = Mockito.mock(SQLQuery.class);

        // Raw Data Mocks
        when(
                session2
                        .createSQLQuery(eq("SELECT rawdataids_id FROM tbl_user_tbl_raw_data WHERE tbl_user_id = :user_id"))
        ).thenReturn(searchQueryForRawData);
        when(
                searchQueryForRawData
                        .setParameter(eq("user_id"), eq(userId))
        ).thenReturn(searchQueryForRawData);

        when(searchQueryForRawData.list()).thenReturn(rawData);

        // Processed Data Mocks
        when(
                session2
                        .createSQLQuery(eq("SELECT processed_data_id FROM tbl_raw_data WHERE id = :raw_data_id"))
        ).thenReturn(searchQueryForProcessedData);
        when(
                searchQueryForProcessedData
                        .setParameter(eq("raw_data_id"), eq(1L))
        ).thenReturn(searchQueryForProcessedData);

        when(searchQueryForProcessedData.list()).thenReturn(processedData);

        userDao.deleteUserData(userId);

        verify(processedDataDao).delete(2L);
        verify(rawDataDao).delete(1L);
    }

    /**
     * T5.??
     * Preconditions: User has not data
     * Post-conditions: User data is not deleted
     */
    @Test
    public void testDeleteUserDataFailed() {
        // Setup mocks
        Session session2 = Mockito.mock(Session.class);

        when(sessionFactory.getCurrentSession()).thenReturn(session2);

        Long userId = 1L;
        List<Object> rawData = new ArrayList<>();


        SQLQuery searchQueryForRawData = Mockito.mock(SQLQuery.class);

        // Raw Data Mocks
        when(
                session2
                        .createSQLQuery(eq("SELECT rawdataids_id FROM tbl_user_tbl_raw_data WHERE tbl_user_id = :user_id"))
        ).thenReturn(searchQueryForRawData);
        when(
                searchQueryForRawData
                        .setParameter(eq("user_id"), eq(userId))
        ).thenReturn(searchQueryForRawData);

        when(searchQueryForRawData.list()).thenReturn(rawData);

        userDao.deleteUserData(userId);

        verify(processedDataDao, never()).delete(anyLong());
        verify(rawDataDao, never()).delete(anyLong());
    }
}
