package com.pm.loginsession.security;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                //Cross Site Request Forgery - req giả
                .csrf(csrf -> csrf.disable())
                // chặn req khác origin (port)
                .cors(cors -> {
                })
                //tạo phân quyền -> AuthorizationFilter
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/login").hasRole("USER")
//                        .requestMatchers("/api/auth/**").permitAll() //hkkong can login de vao khac voi bo qua Security
                        .anyRequest().authenticated()
                )
                //UsernamePasswordAuthenticationFilter
                .formLogin(form -> form
                        //req vào url này sẽ bị filter chặn
                        .loginProcessingUrl("/api/auth/login") // endpoint login
                        .usernameParameter("username")         // field username
                        .passwordParameter("password")         // field password
                        //call back
                        .successHandler((req, res, auth) -> {
                            res.setStatus(200);
                            res.getWriter().write("Login thanh cong");

                        })
                        //chạy khi sai user/pass, chưa hình thành auth
                        .failureHandler((req, res, ex) -> {
                            res.setStatus(401);
                            res.getWriter().write("Login that bai");
                        })
                )
                .logout(logout -> logout
                        .logoutUrl("/api/auth/logout")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                        .logoutSuccessHandler((req, res, auth) -> {
                            res.setStatus(200);
                            res.getWriter().write("Logout OK");
                        })
                )
        ;
        return httpSecurity.build();
    }

}
