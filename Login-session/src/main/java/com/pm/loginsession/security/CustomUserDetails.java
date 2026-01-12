package com.pm.loginsession.security;

import com.pm.loginsession.entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;


public class CustomUserDetails implements UserDetails {

    // Lưu trữ entity User lấy từ database
    private final User user;

    // Constructor nhận entity User để Spring Security tạo đối tượng UserDetails
    public CustomUserDetails(User user) {
        this.user = user;
    }

    // Override các phương thức bắt buộc của interface UserDetails

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public String getPassword() {
        return user.getPassword(); // Mật khẩu đã được mã hóa
    }

    // Trả về danh sách quyền (authorities) của người dùng, ở đây là 1 role duy nhất
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + user.getRole())
        );
    }


    // Các trạng thái tài khoản - hiện tại chưa triển khai khóa/hết hạn nên luôn true
    @Override public boolean isEnabled() { return true; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
}