package com.madominguez.SolarMetrics.controller;

import com.madominguez.SolarMetrics.entity.Inversor;
import com.madominguez.SolarMetrics.entity.Medida;
import com.madominguez.SolarMetrics.repository.InversorRepository;
import com.madominguez.SolarMetrics.repository.MedidaRepository;
import com.madominguez.SolarMetrics.service.InversorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class InversorAPIController {

    private final InversorRepository InversorRepository;

    private final MedidaRepository medidaRepository;

    @Autowired
    private InversorService inversorService;

    public InversorAPIController(InversorRepository inversorRepository, MedidaRepository medidaRepository) {
        InversorRepository = inversorRepository;
        this.medidaRepository = medidaRepository;
    }

    @PostMapping("/inversores/add")
    public ResponseEntity<Inversor> addInversor(@RequestBody Inversor inversor) {
        Inversor newInversor = inversorService.saveInversor(inversor);
        return new ResponseEntity<>(newInversor, HttpStatus.CREATED);
    }

    @GetMapping("/inversores/group/{groupId}")
    public List<Medida> obtenerDatosPorGrupo(@PathVariable("groupId") Integer groupId) {
        return medidaRepository.findByGroupId(groupId);
    }
}
