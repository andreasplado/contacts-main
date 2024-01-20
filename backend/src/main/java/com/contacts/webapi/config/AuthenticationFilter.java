package com.contacts.webapi.config;

import com.contacts.webapi.dao.entity.UserEntity;
import com.contacts.webapi.model.AuthToken;
import com.contacts.webapi.service.CustomUserDetailsService;
import com.contacts.webapi.service.UserDataService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.AuthenticationManager;


import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private UserDataService userDataService;

    private String secret = "hhhhhhhhhhwqdjidwqijdjidwijqdwdwqihodqwjipqdwpjiqwdpjwqdpjiqwdpjiqdwjpiowdqipqwdouqdwouwdquodqwo123";


    public AuthenticationFilter(AuthenticationManager authenticationManager, ApplicationContext ctx) {
        this.authenticationManager = authenticationManager;
        this.customUserDetailsService = ctx.getBean(CustomUserDetailsService.class);
        this.userDataService = ctx.getBean(UserDataService.class);
        setFilterProcessesUrl("/user-login");
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        try {
            UserEntity creds = new ObjectMapper().readValue(request.getInputStream(), UserEntity.class);
            return authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(creds.getUsername(), creds.getPassword(), new ArrayList<>()));
        } catch (IOException e) {
            throw new RuntimeException("Could not read request" + e);
        }
    }

    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain, Authentication authentication) throws IOException {
        String token = Jwts.builder()
                .setSubject(((User) authentication.getPrincipal()).getUsername())
                .setExpiration(new Date(System.currentTimeMillis() + 864_000_000))
                .signWith(SignatureAlgorithm.HS512, secret.getBytes())
                .compact();
        UserEntity userEntity = userDataService.findByUsername((((User) authentication.getPrincipal()).getUsername()));
        response.addHeader("Authorization", "Bearer " + token);
        response.addHeader("UserId", userEntity.getId() + "" );

        AuthToken authToken = new AuthToken();
        authToken.setToken(token);
        authToken.setUsername(((User) authentication.getPrincipal()).getUsername());
        authToken.setUserId(userEntity.getId());
        String json = new ObjectMapper().writeValueAsString(authToken);
        response.getWriter().write(json);
    }
}