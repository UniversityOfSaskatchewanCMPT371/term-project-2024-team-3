package service;

import com.beaplab.BeaplabEngine.metadata.IncorrectLoginsDto;
import com.beaplab.BeaplabEngine.metadata.PredictedDataDto;
import com.beaplab.BeaplabEngine.metadata.RawDataDto;
import com.beaplab.BeaplabEngine.model.PredictedData;
import com.beaplab.BeaplabEngine.model.RawData;
import com.beaplab.BeaplabEngine.repository.PredictedDataDao;
import com.beaplab.BeaplabEngine.repository.RawDataDao;
import com.beaplab.BeaplabEngine.service.PredictedDataService;
import com.beaplab.BeaplabEngine.service.RawDataService;
import com.beaplab.BeaplabEngine.util.Util;
import com.beaplab.BeaplabEngine.util.objectMapper.PredictedDataMapper;
import com.beaplab.BeaplabEngine.util.objectMapper.RawDataMapper;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.runners.MockitoJUnitRunner;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.*;
import org.mockito.runners.MockitoJUnitRunner;
import utils.TestHelper;

import java.sql.Timestamp;

import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;
import static org.junit.Assert.*;
import static utils.MockFactory.*;
import static utils.TestHelper.*;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.eq;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class PredictedDataServiceTest {

    @InjectMocks
    private PredictedDataService predictedDataService;

    @Mock
    private PredictedDataDto predictedDataDto;

    @Mock
    private PredictedDataMapper predictedDataMapper;

    @Mock
    private PredictedDataDao predictedDataDao;

    @Mock
    private Util util;

    @Before
    public void setUp() {MockitoAnnotations.initMocks(this);}

    @Test
    /*
     * T5.26
     * Preconditions: A byte array, a PredictedData.predictionType object, and a processedDataId are provided
     * Post-conditions: The save method should return a Long object representing the id of the saved PredictedData object
     */
    public void testSave() {
        byte[] data = new byte[10];
        PredictedData.predictionType predictionType = PredictedData.predictionType.svm;
        Long processedDataId = 1L;
        Timestamp timestamp = TestHelper.getTimestamp(2024, 2, 3, 4, 3);

        when(util.getCurrentTimeStamp()).thenReturn(timestamp);
        when(predictedDataDao.save(Matchers.<PredictedData>any(), eq(processedDataId))).thenReturn(1L);

        Long result = predictedDataService.save(data, predictionType, processedDataId);
        ArgumentCaptor<PredictedData> argument = ArgumentCaptor.forClass(PredictedData.class);
        verify(predictedDataDao).save(argument.capture(), eq(processedDataId));

        assertEquals(Long.valueOf(1L), result);
        assertArrayEquals(data, argument.getValue().getData());
        assertEquals(predictionType, argument.getValue().getPredictionType());
        assertEquals(timestamp, argument.getValue().getDateTime());
    }

    @Test
    /*
     * T5.27
     * Preconditions: A PredictedData object with a specific id exists in the database
     * Post-conditions: The get method should return a PredictedDataDto object representing the PredictedData object with the specified id
     */
    public void testGet() {
        Long id = 1L;
        PredictedData predictedData = mockPredictedData(PredictedData.predictionType.svm);
        PredictedDataDto expected = mockPredictedDataDto(PredictedData.predictionType.svm);

        when(predictedDataDao.get(id)).thenReturn(predictedData);
        when(predictedDataMapper.model2Dto(eq(predictedData), Matchers.<PredictedDataDto>any())).thenReturn(expected);

        PredictedDataDto result = predictedDataService.get(id);

        assertEquals(expected, result);
    }

    @Test
    /*
     * T.28
     * Preconditions: No PredictedData object with a specific id exists in the database
     * Post-conditions: The get method should return null
     */
    public void testGetWhenPredictedDataDoesNotExist() {
        Long id = 1L;

        when(predictedDataDao.get(id)).thenReturn(null);

        PredictedDataDto result = predictedDataService.get(id);

        assertNull(result);
    }

    /**
     * T.29
     * Returns a list of PredictedDataDto objects for a given user and data type.
     *
     * Preconditions:
     * - userId should be a valid user ID that exists in the database.
     * - type should be a valid RawData.dataType value.
     *
     * Postconditions:
     * - Returns a list of PredictedDataDto objects. Each PredictedDataDto object represents a PredictedData object in the database that matches the given userId and type.
     * - If no PredictedData objects match the given userId and type, the method returns an empty list.
     * - If userId or type is null, or if userId does not exist in the database, the behavior of the method is undefined.
     * - A list of PredictedDataDto objects.
     */
    @Test
    public void testList() {
        Long userId = 1L;
        RawData.dataType type = RawData.dataType.AppleWatch;

        // Create mock data
        List<PredictedData> predictedDataList = new ArrayList<>();
        predictedDataList.add(mockPredictedData(PredictedData.predictionType.svm));
        predictedDataList.add(mockPredictedData(PredictedData.predictionType.randomForest));

        List<PredictedDataDto> expectedDtoList = new ArrayList<>();
        expectedDtoList.add(mockPredictedDataDto(PredictedData.predictionType.svm));
        expectedDtoList.add(mockPredictedDataDto(PredictedData.predictionType.randomForest));

        // Set up mocks
        when(predictedDataDao.list(userId, type)).thenReturn(predictedDataList);
        when(predictedDataMapper.model2Dto(eq(predictedDataList), Matchers.<List<PredictedDataDto>>any())).thenReturn(expectedDtoList);

        // Call method under test
        List<PredictedDataDto> resultDtoList = predictedDataService.list(userId, type);

        // Verify results
        assertEquals(expectedDtoList, resultDtoList);
    }

    @Test
    /*
     * T.?
     * Preconditions: Existing predicted data in the database
     * Post-conditions: Predicted data is deleted
     */
    public void testDelete() {
        Long id = 1L;

        when(predictedDataDao.delete(id)).thenReturn(true);

        Boolean result = predictedDataService.delete(id);

        assertTrue(result);
    }

    @Test
    /*
     * T.?
     * Preconditions: No existing predicted data in the database
     * Post-conditions: Predicted data is not deleted
     */
    public void testDeleteFails() {
        Long id = 1L;

        when(predictedDataDao.delete(id)).thenReturn(false);

        Boolean result = predictedDataService.delete(id);

        assertFalse(result);
    }
}
