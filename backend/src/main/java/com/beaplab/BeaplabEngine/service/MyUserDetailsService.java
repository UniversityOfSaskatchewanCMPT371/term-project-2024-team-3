/*
 * Developed by Arastoo Bozorgi.
 * a.bozorgi67@gmail.com
 */

package com.beaplab.BeaplabEngine.service;

import com.beaplab.BeaplabEngine.model.Role;
import com.beaplab.BeaplabEngine.model.User;
import com.beaplab.BeaplabEngine.repository.UserDao;
import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;


/**
 * This class implements UserDetailsService interface. The UserDetailsService interface is used to retrieve user-related data. It has one method named loadUserByUsername() which finds a user entity based on the username and can be overridden to customize the process of finding the user.
 */
@Service("myUserDetailsService")
@Transactional
public class MyUserDetailsService implements UserDetailsService {

    final static Logger logger = LogManager.getLogger(MyUserDetailsService.class.getName());

    /**
     * injecting UserDao into this class
     */
    @Autowired
    private UserDao userDao;



    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userDao.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException(
                    "No user found with username: "+ username);
        }
        boolean enabled = true;
        boolean accountNonExpired = true;
        boolean credentialsNonExpired = true;
        boolean accountNonLocked = true;
        return  new org.springframework.security.core.userdetails.User
                (user.getUsername(),
                        user.getPassword().toLowerCase(), enabled, accountNonExpired,
                        credentialsNonExpired, accountNonLocked,
                        getAuthorities(user.getRoleIDs()));
    }


    private static List<GrantedAuthority> getAuthorities (Set<Role> roles) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority(role.getRoleName()));
        }
        return authorities;
    }
}
