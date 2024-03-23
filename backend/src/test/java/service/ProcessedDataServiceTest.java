package service;

import com.beaplab.BeaplabEngine.metadata.ProcessedDataDto;
import com.beaplab.BeaplabEngine.model.ProcessedData;
import com.beaplab.BeaplabEngine.model.RawData;
import com.beaplab.BeaplabEngine.repository.ProcessedDataDao;
import com.beaplab.BeaplabEngine.service.ProcessedDataService;
import com.beaplab.BeaplabEngine.util.Util;
import com.beaplab.BeaplabEngine.util.objectMapper.ProcessedDataMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.runners.MockitoJUnitRunner;
import utils.TestHelper;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;
import static org.mockito.Mockito.*;
import static utils.MockFactory.mockProcessedData;
import static utils.MockFactory.mockProcessedDataDto;


@RunWith(MockitoJUnitRunner.class)
public class ProcessedDataServiceTest {

    @InjectMocks
    private ProcessedDataService processedDataService;

    @Mock
    private ProcessedDataDao processedDataDao;

    @Mock
    private ProcessedDataMapper processedDataMapper;

    @Mock
    private Util util;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    /*
     * T.30
     * Preconditions: A byte array and a rawDataId are provided
     * Post-conditions: The save method should return a Long object representing the id of the saved ProcessedData object
     */
    public void testSave() {
        byte[] data = new byte[10];
        Long rawDataId = 1L;
        Timestamp timestamp = TestHelper.getTimestamp(2024, 2, 3, 4, 3);
        String year = "2024";

        when(util.getCurrentTimeStamp()).thenReturn(timestamp);
        when(processedDataDao.save(Matchers.<ProcessedData>any(), eq(rawDataId))).thenReturn(1L);

        Long result = processedDataService.save(data, rawDataId);
        ArgumentCaptor<ProcessedData> argument = ArgumentCaptor.forClass(ProcessedData.class);
        verify(processedDataDao).save(argument.capture(), eq(rawDataId));

        assertEquals(Long.valueOf(1L), result);
        assertArrayEquals(data, argument.getValue().getData());
        assertEquals(argument.getValue().getDateTime(), timestamp);
        assertEquals(year, argument.getValue().getYear());
    }

    @Test
    /*
     * T.31
     * Preconditions: A ProcessedData object with a specific id exists in the database
     * Post-conditions: The get method should return a ProcessedDataDto object representing the ProcessedData object with the specified id
     */
    public void testGet() {
        Long id = 1L;
        ProcessedData processedData = mockProcessedData();
        ProcessedDataDto expected = mockProcessedDataDto();

        when(processedDataDao.get(id)).thenReturn(processedData);
        when(processedDataMapper.model2Dto(eq(processedData), Matchers.<ProcessedDataDto>any())).thenReturn(expected);

        ProcessedDataDto result = processedDataService.get(id);

        assertEquals(expected, result);
    }

    @Test
    /*
     * T.32
     * Preconditions: No ProcessedData object with a specific id exists in the database
     * Post-conditions: The get method should return null
     */
    public void testGetWhenProcessedDataDoesNotExist() {
        Long id = 1L;

        when(processedDataDao.get(id)).thenReturn(null);

        ProcessedDataDto result = processedDataService.get(id);

        assertNull(result);
    }


    @Test
    /*
     * T.33
     * Preconditions: A list of ProcessedData objects associated with a specific userId and type exists in the database
     * Post-conditions: The list method should return a list of ProcessedDataDto objects representing the ProcessedData objects with the specified userId and type
     */
    public void testList() {
        Long userId = 1L;
        RawData.dataType type = RawData.dataType.AppleWatch;
        List<ProcessedData> processedDataList = Arrays.asList(mockProcessedData(), mockProcessedData());
        List<ProcessedDataDto> expected = Arrays.asList(mockProcessedDataDto(), mockProcessedDataDto());

        when(processedDataDao.list(userId, type)).thenReturn(processedDataList);
        when(processedDataMapper.model2Dto(eq(processedDataList), Matchers.<List<ProcessedDataDto>>any())).thenReturn(expected);

        List<ProcessedDataDto> result = processedDataService.list(userId, type);

        assertEquals(expected, result);
    }

    @Test
    /*
     * T.34
     * Preconditions: No ProcessedData objects associated with a specific userId and type exist in the database
     * Post-conditions: The list method should return null
     */
    public void testListWhenProcessedDataDoesNotExist() {
        Long userId = 1L;
        RawData.dataType type = RawData.dataType.AppleWatch;

        when(processedDataDao.list(userId, type)).thenReturn(null);

        List<ProcessedDataDto> result = processedDataService.list(userId, type);

        assertNull(result);
    }



}
