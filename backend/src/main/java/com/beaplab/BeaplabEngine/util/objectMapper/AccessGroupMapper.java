/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.util.objectMapper;

import com.beaplab.BeaplabEngine.metadata.AccessGroupDto;
import com.beaplab.BeaplabEngine.model.AccessGroup;
import com.beaplab.BeaplabEngine.util.objectMapper.base.BaseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * this class converts AccessGroup to AccessGroupDto and vice versa
 */
@Component("accessGroupMapper")
public class AccessGroupMapper implements BaseMapper<AccessGroup, AccessGroupDto> {

    /**
     * converting AccessGroup to AccessGroupDto
     * @param accessGroup
     * @param accessGroupDto
     * @return
     */
    @Override
    public AccessGroupDto model2Dto(AccessGroup accessGroup, AccessGroupDto accessGroupDto) {
        accessGroupDto.setId(accessGroup.getId());
        accessGroupDto.setDescription(accessGroup.getDescription());
        accessGroupDto.setAccessGroupName(accessGroup.getAccessGroupName());

        accessGroupDto.setCreatedDate(accessGroup.getCreatedDate());
        accessGroupDto.setLastModifiedDate(accessGroup.getLastModifiedDate());

        return accessGroupDto;
    }


    /**
     * converting a list of AccessGroup to a list of AccessGroupDto
     * @param accessGroups
     * @param accessGroupDtos
     * @return
     */
    @Override
    public List<AccessGroupDto> model2Dto(List<AccessGroup> accessGroups, List<AccessGroupDto> accessGroupDtos) {
        for (AccessGroup accessGroup: accessGroups){
            accessGroupDtos.add(model2Dto(accessGroup, new AccessGroupDto()));
        }
        return accessGroupDtos;
    }



    /**
     * converting a set of AccessGroup to a list of AccessGroupDto
     * @param accessGroups
     * @param accessGroupDtos
     * @return
     */
    public Set<AccessGroupDto> model2Dto(Set<AccessGroup> accessGroups, Set<AccessGroupDto> accessGroupDtos) {
        for (AccessGroup accessGroup: accessGroups){
            accessGroupDtos.add(model2Dto(accessGroup, new AccessGroupDto()));
        }
        return accessGroupDtos;
    }


    /**
     * converting AccessGroupDto to AccessGroup
     * @param accessGroupDto
     * @param accessGroup
     * @return
     */
    @Override
    public AccessGroup dto2Model(AccessGroupDto accessGroupDto, AccessGroup accessGroup) {
        accessGroup.setId(accessGroupDto.getId());
        accessGroup.setDescription(accessGroupDto.getDescription());
        accessGroup.setLastModifiedDate(accessGroupDto.getLastModifiedDate());
        accessGroup.setCreatedDate(accessGroupDto.getCreatedDate());
        accessGroup.setAccessGroupName(accessGroupDto.getAccessGroupName());

        return accessGroup;
    }


    /**
     * converting a list of AccessGroupDto to a list of AccessGroup
     * @param accessGroupDtos
     * @param accessGroups
     * @return
     */
    @Override
    public List<AccessGroup> dto2Model(List<AccessGroupDto> accessGroupDtos, List<AccessGroup> accessGroups) {
        for (AccessGroupDto accessGroupDto : accessGroupDtos){
            accessGroups.add(dto2Model(accessGroupDto, new AccessGroup()));
        }
        return accessGroups;
    }


    /**
     * converting a set of AccessGroupDto to a list of AccessGroup
     * @param accessGroupDtos
     * @param accessGroups
     * @return
     */
    public Set<AccessGroup> dto2Model(Set<AccessGroupDto> accessGroupDtos, Set<AccessGroup> accessGroups) {
        for (AccessGroupDto accessGroupDto : accessGroupDtos){
            accessGroups.add(dto2Model(accessGroupDto, new AccessGroup()));
        }
        return accessGroups;
    }


}
