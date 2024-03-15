package service;


import com.beaplab.BeaplabEngine.metadata.IncorrectLoginsDto;
import com.beaplab.BeaplabEngine.model.IncorrectLogins;
import com.beaplab.BeaplabEngine.model.User;
import com.beaplab.BeaplabEngine.repository.IncorrectLoingsDao;
import com.beaplab.BeaplabEngine.service.IncorrectLoginsService;
import com.beaplab.BeaplabEngine.util.objectMapper.IncorrectLoginsMapper;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.runners.MockitoJUnitRunner;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.*;
import static utils.MockFactory.*;
import static utils.TestHelper.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class IncorrectLoginsServiceTest {

    @InjectMocks
    private IncorrectLoginsService incorrectLoginsService;

    @Mock
    private IncorrectLoingsDao incorrectLoingsDao;

    @Mock
    private IncorrectLoginsMapper incorrectLoginsMapper;


    @Before
    public void setUp(){
        MockitoAnnotations.initMocks(this);
    }

    @Test
    /*
     * Preconditions: 2 IncorrectLogins exist in the database
     * Post-conditions: Returns a list of 2 IncorrectLogins from the database
     */
    public void testList(){
        List<IncorrectLogins> incorrectLoginsList = new ArrayList<>();
        User user1 = mockUser(
                "Michael",
                "Scott",
                "PrisonMike"
        );
        User user2 = mockUser(
                "Dwight",
                "Schrute",
                "MonkeyTrainer"
        );

        incorrectLoginsList.add(
                mockIncorrectLogins(
                        user1,
                        true,
                        getTimestamp(2023, 0, 1, 0, 0),
                        5
                )
        );
        incorrectLoginsList.add(
                mockIncorrectLogins(
                        user2,
                        false,
                        getTimestamp(2023, 0, 1, 0, 0),
                        2
                )
        );

        when(incorrectLoingsDao.list()).thenReturn(incorrectLoginsList);
        List<IncorrectLoginsDto> expected = incorrectLoginsMapper.model2Dto(incorrectLoginsList, new ArrayList<IncorrectLoginsDto>());
        when(incorrectLoginsMapper.model2Dto(eq(incorrectLoginsList), anyListOf(IncorrectLoginsDto.class))).thenReturn(expected);
        List<IncorrectLoginsDto> result = incorrectLoginsService.list();
        assertEquals(expected, result);
    }

    @Test
    /*
     * Preconditions: NO IncorrectLogins exist in the database
     * Post-conditions: Empty list is returned
     */
    public void testListEmpty(){
        List<IncorrectLogins> incorrectLoginsList = new ArrayList<>();
        when(incorrectLoingsDao.list()).thenReturn(incorrectLoginsList);
        List<IncorrectLoginsDto> expected = incorrectLoginsMapper.model2Dto(incorrectLoginsList, new ArrayList<IncorrectLoginsDto>());
        when(incorrectLoginsMapper.model2Dto(eq(incorrectLoginsList), anyListOf(IncorrectLoginsDto.class))).thenReturn(expected);
        List<IncorrectLoginsDto> result = incorrectLoginsService.list();
        assertTrue(result.isEmpty());
        assertEquals(expected, result);
    }

    @Test
    /*
     * Preconditions: None
     * Post-conditions: IncorrectLogins are added to the database
     */
    public void testSave(){

        IncorrectLoginsDto incorrectLoginsDto = mockIncorrectLoginsDto(
                mockUserDto(),
                false,
                2,
                getTimestamp(2023, 0, 1, 0, 0)
        );
        IncorrectLogins incorrectLogins = mockIncorrectLogins(
                mockUser(),
                false,
                getTimestamp(2023, 0, 1, 0, 0),
                2
        );

        when(incorrectLoginsMapper.dto2Model(eq(incorrectLoginsDto), any(IncorrectLogins.class))).thenReturn(incorrectLogins);
        Serializable expected = incorrectLoingsDao.save(incorrectLogins);
        Serializable result = incorrectLoginsService.save(incorrectLoginsDto);
        assertEquals(expected, result);
    }

    @Test
    /*
     * Preconditions: None
     * Post-conditions: IncorrectLogins is updated
     */
    public void testUpdate(){
        IncorrectLoginsDto incorrectLoginsDto = mockIncorrectLoginsDto(
                mockUserDto(),
                false,
                2,
                getTimestamp(2023, 0, 1, 0, 0)
        );

        IncorrectLogins incorrectLogins = mockIncorrectLogins(
                mockUser(),
                false,
                getTimestamp(2023, 0, 1, 0, 0),
                2
        );



        when(incorrectLoginsMapper.dto2Model(eq(incorrectLoginsDto), any(IncorrectLogins.class))).thenReturn(incorrectLogins);
        incorrectLoginsService.update(incorrectLoginsDto);
        verify(incorrectLoingsDao).update(eq(incorrectLogins));

    }


    @Test
    /*
     * Preconditions: IncorrectLogins exists in the database
     * Post-conditions: Returns IncorrectLoginsDto object
     */
    public void testGet() {
        IncorrectLoginsDto expected = mockIncorrectLoginsDto(
                mockUserDto(),
                false,
                2,
                getTimestamp(2023, 0, 1, 0, 0)
        );

        IncorrectLogins incorrectLogins = mockIncorrectLogins(
                mockUser(),
                false,
                getTimestamp(2023, 0, 1, 0, 0),
                2
        );


        when(incorrectLoingsDao.get(eq(1L))).thenReturn(incorrectLogins);
        when(incorrectLoginsMapper.model2Dto(eq(incorrectLogins), any(IncorrectLoginsDto.class))).thenReturn(expected);

        IncorrectLoginsDto result = incorrectLoginsService.get("1");

        assertEquals(expected, result);
    }

    @Test
    /*
     * Preconditions: IncorrectLogin does not exist in the database
     * Post-conditions: Returns null
     */
    public void testGetNull() {
        when(incorrectLoingsDao.get(eq(1L))).thenReturn(null);

        IncorrectLoginsDto result = incorrectLoginsService.get("1");
        assertNull(result);
    }


    @Test
    /*
     * Preconditions: IncorrectLogins exists in the database
     * Post-conditions: IncorrectLogins removed from the database
     */
    public void testDelete() {
        String id = "1";
        incorrectLoginsService.delete(id);
        verify(incorrectLoingsDao).delete(eq(Long.parseLong(id)));

    }



    @Test
    /*
     * Preconditions: IncorrectLogins exists in the database
     * Post-conditions: Returns IncorrectLoginsDto object
     */
    public void testGetByUserId() {
        IncorrectLoginsDto expected = mockIncorrectLoginsDto(
                mockUserDto(),
                false,
                2,
                getTimestamp(2023, 0, 1, 0, 0)
        );

        IncorrectLogins incorrectLogins = mockIncorrectLogins(
                mockUser(),
                false,
                getTimestamp(2023, 0, 1, 0, 0),
                2
        );


        when(incorrectLoingsDao.getByUserID(eq(1L))).thenReturn(incorrectLogins);
        when(incorrectLoginsMapper.model2Dto(eq(incorrectLogins), any(IncorrectLoginsDto.class))).thenReturn(expected);

        IncorrectLoginsDto result = incorrectLoginsService.getByUserId(1L);

        assertEquals(expected, result);
    }

    @Test
    /*
     * Preconditions: IncorrectLogins does not exist in the database
     * Post-conditions: Returns null
     */
    public void testGetByUserIdNull() {
        when(incorrectLoingsDao.getByUserID(1L)).thenReturn(null);

        IncorrectLoginsDto result = incorrectLoginsService.getByUserId(1L);
        assertNull(result);
    }




}
