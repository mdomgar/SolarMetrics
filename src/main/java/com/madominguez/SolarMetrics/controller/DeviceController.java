package com.madominguez.SolarMetrics.controller;

import com.madominguez.SolarMetrics.entity.Inversor;
import com.madominguez.SolarMetrics.entity.Medida;
import com.madominguez.SolarMetrics.entity.User;
import com.madominguez.SolarMetrics.repository.InversorRepository;
import com.madominguez.SolarMetrics.repository.MedidaRepository;
import com.madominguez.SolarMetrics.repository.UserRepository;
import com.madominguez.SolarMetrics.service.InversorService;
import com.madominguez.SolarMetrics.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/devices")
public class DeviceController {

    @Autowired
    private final InversorService inversorService;

    @Autowired
    private final UserService userService;

    @Autowired
    private final InversorRepository inversorRepository;

    @Autowired
    private final MedidaRepository medidaRepository;

    @Autowired
    private final UserRepository userRepository;

    public DeviceController(InversorService inversorService, UserService userService, InversorRepository inversorRepository, MedidaRepository medidaRepository, UserRepository userRepository) {
        this.inversorService = inversorService;
        this.userService = userService;
        this.inversorRepository = inversorRepository;
        this.medidaRepository = medidaRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/get")
    public List<Inversor> getDevices(){
        return inversorService.getAllInversor();
    }

    @GetMapping()
    public ResponseEntity<List<Inversor>> getDevicesOfUser(@RequestParam String username){
        List<Inversor> inversors = userService.getInversorsForUser(username);
        return ResponseEntity.ok(inversors);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addDevice(@RequestBody Inversor baseInversor) {

        Inversor inversor = new Inversor();
        inversor.setStationLabel(baseInversor.getStationLabel());

        Inversor savedInversor = inversorRepository.save(inversor);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.getInversores().add(savedInversor);
        userRepository.save(user);

        List<Medida> medidasInversor = new ArrayList<>();

        for (int i = 1; i <= 10; i++) {

            Medida medida = new Medida();
            medida.setInversor(savedInversor);
            medida.setGroupId(i);

            // Valores aleatorios
            medida.setTotalIncome(randomDouble(400, 1500));
            medida.setTotalPower(randomDouble(200, 600));
            medida.setDayPower(randomDouble(40, 140));
            medida.setActivePower(randomDouble(40, 170));
            medida.setMpptPower(randomDouble(25, 230));

            medida.setPv1_u(randomDouble(58, 340));
            medida.setPv1_i(randomDouble(1, 6));

            medida.setPv2_u(randomDouble(75, 350));
            medida.setPv2_i(randomDouble(3.5, 4.7));

            medida.setPv3_u(randomDouble(25, 350));
            medida.setPv3_i(randomDouble(1, 4.5));

            medida.setPv4_u(randomDouble(30, 350));
            medida.setPv4_i(randomDouble(1, 4.5));

            medida.setPv5_u(randomDouble(15, 330));
            medida.setPv5_i(randomDouble(1, 4.2));

            medidasInversor.add(medida);
        }

        medidaRepository.saveAll(medidasInversor);

        return ResponseEntity.ok(savedInversor);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> updateDevice(@PathVariable long id, @RequestBody Inversor updatedInversor) {
        boolean exists = inversorRepository.existsById(id);
        if (exists) {
            Inversor existingInversor = inversorRepository.findInversorById(id);

            existingInversor.setStationLabel(updatedInversor.getStationLabel());
            inversorRepository.save(existingInversor);

            return ResponseEntity.ok(existingInversor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteInversor(@PathVariable Integer id) {
        Optional<Inversor> optionalInversor = inversorRepository.findById(id);
        if (optionalInversor.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Inversor inversor = optionalInversor.get();

        List<User> usersWithInversor = userRepository.findAll().stream()
                .filter(u -> u.getInversores().contains(inversor))
                .toList();

        for (User user : usersWithInversor) {
            user.getInversores().remove(inversor);
            userRepository.save(user);
        }

        inversorRepository.delete(inversor);

        return ResponseEntity.noContent().build();
    }


    // Metodo para obtener valores random
    private double randomDouble(double min, double max) {
        return Math.round((min + Math.random() * (max - min)) * 10.0) / 10.0;
    }
}
