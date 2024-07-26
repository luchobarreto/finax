package com.finax.security;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.finax.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collection;
import java.util.Objects;

public class UserDetailsImpl implements UserDetails {
    private static final Long serialVersionUID = 1L;
    
    private Long id;
    private String username;
    @JsonIgnore
    private String password;
    
    public UserDetailsImpl(Long id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }
    
    public static UserDetailsImpl build(User user) {
        try {
            return new UserDetailsImpl(user.getId(), user.getUsername(), user.getPassword());
        } catch (NullPointerException | IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid user session.");
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
    
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return null;
    }
    
    public Long getId() {
        return id;
    }
    
    public String getPassword() {
        return password;
    }
    
    public String getUsername() {
        return username;
    }
    
    public int hashCode() {
        return id.hashCode();
    }
    
    public boolean isAccountNonExpired() {
        return true;
    }
    
    public boolean isAccountNonLocked() {
        return true;
    }
    
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    public boolean isEnabled() {
        return true;
    }
    
    public boolean equals(Object o) {
        if(this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        UserDetailsImpl user = (UserDetailsImpl) o;
        return Objects.equals(id, user.id);
    }
}