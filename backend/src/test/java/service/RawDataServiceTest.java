package service;

import com.beaplab.BeaplabEngine.metadata.RawDataDto;
import com.beaplab.BeaplabEngine.model.RawData;
import com.beaplab.BeaplabEngine.repository.RawDataDao;
import com.beaplab.BeaplabEngine.service.RawDataService;
import com.beaplab.BeaplabEngine.util.Util;
import com.beaplab.BeaplabEngine.util.objectMapper.RawDataMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.runners.MockitoJUnitRunner;
import utils.TestHelper;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static utils.MockFactory.mockRawData;
import static utils.MockFactory.mockRawDataDto;

@RunWith(MockitoJUnitRunner.class)
public class RawDataServiceTest {

    @InjectMocks
    private RawDataService rawDataService;

    @Mock
    private RawDataDao rawDataDao;

    @Mock
    private RawDataMapper rawDataMapper;

    @Mock
    private Util util;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    /*
     * T.35
     * Preconditions: A byte array, a RawData.dataType object, and a userId are provided
     * Post-conditions: The save method should return a Long object representing the id of the saved RawData object
     */
    public void testSave() {
        // Your test code here
        Timestamp timestamp = TestHelper.getTimestamp(2024, 2, 3, 4, 3);
        RawData rawData = mockRawData(RawData.dataType.AppleWatch);
        Long userID = 3L;
        Long expected = 4L;
        Long processedDataId = -1L;

        when(util.getCurrentTimeStamp()).thenReturn(timestamp);
        when(rawDataDao.save(Matchers.<RawData>any(), eq(userID))).thenReturn(expected);

        Long results = rawDataService.save(rawData.getData(), RawData.dataType.AppleWatch, userID);
        ArgumentCaptor<RawData> argument = ArgumentCaptor.forClass(RawData.class);
        verify(rawDataDao).save(argument.capture(), eq(userID));


        assertEquals(expected, results);
        assertEquals(argument.getValue().getData(), rawData.getData());
        assertEquals(argument.getValue().getType(), RawData.dataType.AppleWatch);
        assertEquals(argument.getValue().getProcessedDataID(), processedDataId);
        assertEquals(argument.getValue().getDateTime(), timestamp);
        assertEquals(argument.getValue().getYear(), "2024");

    }

    @Test
    /*
     * T.36
     * Preconditions: An id is provided
     * Post-conditions: The get method should return a RawDataDto object corresponding to the provided id
     */
    public void testGet() {
        // Your test code here
        Long id = 1L;
        RawData rawData = mockRawData(RawData.dataType.AppleWatch);
        RawDataDto expected = mockRawDataDto(RawData.dataType.AppleWatch);

        when(rawDataDao.get(id)).thenReturn(rawData);
        when(rawDataMapper.model2Dto(eq(rawData), Matchers.<RawDataDto>any())).thenReturn(expected);

        RawDataDto result = rawDataService.get(id);

        assertEquals(expected, result);
    }

    @Test
    /*
     * T.37
     * Preconditions: No RawData object with a specific id exists in the database
     * Post-conditions: The get method should return null
     */
    public void testGetWhenRawDataDoesNotExist() {
        Long id = 1L;

        when(rawDataDao.get(id)).thenReturn(null);

        RawDataDto result = rawDataService.get(id);

        assertNull(result);
    }


    @Test
    /*
     * T.38
     * Preconditions: A RawData object with a specific id exists in the database
     * Post-conditions: The getProcessDataId method should return the processedDataId of the RawData object with the specified id
     */
    public void testGetProcessDataId() {
        Long id = 1L;
        Long expected = 2L;

        when(rawDataDao.getProcessDataId(id)).thenReturn(expected);

        Long result = rawDataService.getProcessDataId(id);

        assertEquals(expected, result);
    }

    @Test
    /*
     * T.39
     * Preconditions: No RawData object with a specific id exists in the database
     * Post-conditions: The getProcessDataId method should return null
     */
    public void testGetProcessDataIdWhenRawDataDoesNotExist() {
        Long id = 1L;

        when(rawDataDao.getProcessDataId(id)).thenReturn(null);

        Long result = rawDataService.getProcessDataId(id);

        assertNull(result);
    }

    @Test
    /*
     * T.40
     * Preconditions: A list of RawData objects associated with a specific userId and type exists in the database
     * Post-conditions: The list method should return a list of RawDataDto objects representing the RawData objects with the specified userId and type
     */
    public void testList() {
        Long userId = 1L;
        RawData.dataType type = RawData.dataType.AppleWatch;
        List<RawData> rawDataList = Arrays.asList(mockRawData(type), mockRawData(type));
        List<RawDataDto> expected = Arrays.asList(mockRawDataDto(type), mockRawDataDto(type));

        when(rawDataDao.list(userId, type)).thenReturn(rawDataList);
        when(rawDataMapper.model2Dto(rawDataList, new ArrayList<RawDataDto>())).thenReturn(expected);

        List<RawDataDto> result = rawDataService.list(userId, type);

        assertEquals(expected, result);
    }

    @Test
    /*
     * T.41
     * Preconditions: No RawData objects associated with a specific userId and type exist in the database
     * Post-conditions: The list method should return null
     */
    public void testListWhenRawDataDoesNotExist() {
        Long userId = 1L;
        RawData.dataType type = RawData.dataType.AppleWatch;

        when(rawDataDao.list(userId, type)).thenReturn(null);

        List<RawDataDto> result = rawDataService.list(userId, type);

        assertNull(result);
    }

    @Test
    /*
     * T.?
     * Preconditions: Existing raw data in the database
     * Post-conditions: raw data is deleted
     */
    public void testDeleteSucceeded() {
        Long id = 1L;

        when(rawDataDao.delete(id)).thenReturn(true);

        Boolean result = rawDataService.delete(id);

        assertTrue(result);
    }

    @Test
    /*
     * T.?
     * Preconditions: No existing raw data in the database
     * Post-conditions: No raw data is deleted
     */
    public void testDeleteFailed() {
        Long id = 1L;

        when(rawDataDao.delete(id)).thenReturn(false);

        Boolean result = rawDataService.delete(id);

        assertFalse(result);
    }


}


