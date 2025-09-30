package com.madominguez.SolarMetrics.controller;

import com.madominguez.SolarMetrics.entity.Inversor;
import com.madominguez.SolarMetrics.entity.InversorDTO;
import com.madominguez.SolarMetrics.entity.User;
import com.madominguez.SolarMetrics.repository.InversorRepository;
import com.madominguez.SolarMetrics.repository.UserRepository;
import com.madominguez.SolarMetrics.service.InversorService;
import com.madominguez.SolarMetrics.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private final UserService userService;

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final InversorRepository inversorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AdminController(UserService userService, UserRepository userRepository, InversorRepository inversorRepository, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.inversorRepository = inversorRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @GetMapping("/users")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }

    @PostMapping("/users/add")
    public ResponseEntity<?> addUser(@RequestBody User user){
        try {
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            User newUser = new User(user.getUsername(), encodedPassword, user.getRole());

            userRepository.save(newUser);
            return ResponseEntity.ok(newUser);
        } catch (Exception e) {
            System.err.println("Error añadiendo un usuario" + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear el usuario.");
        }
    }

    @PutMapping("/users/edit/{id}")
    public ResponseEntity<?> editUser(@PathVariable Long id, @RequestBody User updatedUser){
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            User existingUser = user.get();
            existingUser.setUsername(updatedUser.getUsername());
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                String encodedPassword = passwordEncoder.encode(updatedUser.getPassword());
                existingUser.setPassword(encodedPassword); // La contraseña debe ser codificada
            }
            existingUser.setRole(updatedUser.getRole());
            userRepository.save(existingUser);
            return ResponseEntity.ok(existingUser);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Usuario no encontrado");
        }
    }

    @DeleteMapping("/users/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = optionalUser.get();

        user.getInversores().clear();
        userRepository.save(user);

        userRepository.delete(user);
        return ResponseEntity.noContent().build();
    }


    @GetMapping("/users/{id}/devices")
    public List<InversorDTO> getUserDevices(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        return user.getInversores().stream()
                .map(inv -> new InversorDTO(inv.getDeviceId(), inv.getStationLabel()))
                .toList();
    }

    @PutMapping("/users/{id}/devices")
    public void updateUserDevices(@PathVariable Long id, @RequestBody List<Integer> deviceIds) {
        User user = userRepository.findById(id).orElseThrow();
        List<Inversor> inversores = inversorRepository.findByIdIn(deviceIds);
        user.setInversores(inversores);
        userRepository.save(user);
    }
}
