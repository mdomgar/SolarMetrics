package com.madominguez.SolarMetrics.service;

import com.madominguez.SolarMetrics.entity.Inversor;
import com.madominguez.SolarMetrics.entity.User;
import com.madominguez.SolarMetrics.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<Inversor> getInversorsForUser(String username) {
        return userRepository.findByUsername(username)
                .map(User::getInversores)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
    }
}
