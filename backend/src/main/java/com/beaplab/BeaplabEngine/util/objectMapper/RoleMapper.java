/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.util.objectMapper;

import com.beaplab.BeaplabEngine.metadata.RoleDto;
import com.beaplab.BeaplabEngine.model.Role;
import com.beaplab.BeaplabEngine.util.objectMapper.base.BaseMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;


/**
 * this class converts Role to RoleDto and vice versa
 */
@Component("roleMapper")
public class RoleMapper implements BaseMapper<Role, RoleDto> {


    /**
     * converting Role to RoleDto
     * @param role
     * @param roleDto
     * @return
     */
    @Override
    public RoleDto model2Dto(Role role, RoleDto roleDto) {
        roleDto.setId(role.getId());
        roleDto.setDescription(role.getDescription());
        roleDto.setRoleName(role.getRoleName());
        return roleDto;
    }


    /**
     * converting a list of Role to a list of RoleDto
     * @param roles
     * @param roleDtos
     * @return
     */
    @Override
    public List<RoleDto> model2Dto(List<Role> roles, List<RoleDto> roleDtos) {
        for (Role role: roles){
            roleDtos.add(model2Dto(role, new RoleDto()));
        }
        return roleDtos;
    }


    /**
     * converting a set of Role to a list of RoleDto
     * @param roles
     * @param roleDtos
     * @return
     */
    public Set<RoleDto> model2Dto(Set<Role> roles, Set<RoleDto> roleDtos) {
        for (Role role: roles){
            roleDtos.add(model2Dto(role, new RoleDto()));
        }
        return roleDtos;
    }


    /**
     * converting RoleDto to Role
     * @param roleDto
     * @param role
     * @return
     */
    @Override
    public Role dto2Model(RoleDto roleDto, Role role) {
        role.setId(roleDto.getId());
        role.setDescription(roleDto.getDescription());
        role.setRoleName(roleDto.getRoleName());
        return role;
    }


    /**
     * converting a list of RoleDto to a list of Role
     * @param roleDtos
     * @param roles
     * @return
     */
    @Override
    public List<Role> dto2Model(List<RoleDto> roleDtos, List<Role> roles) {
        for (RoleDto roleDto: roleDtos){
            roles.add(dto2Model(roleDto, new Role()));
        }
        return roles;
    }


    /**
     * converting a set of RoleDto to a list of Role
     * @param roleDtos
     * @param roles
     * @return
     */
    public Set<Role> dto2Model(Set<RoleDto> roleDtos, Set<Role> roles) {
        for (RoleDto roleDto: roleDtos){
            roles.add(dto2Model(roleDto, new Role()));
        }
        return roles;
    }
}
