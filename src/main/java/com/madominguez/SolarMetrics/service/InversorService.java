package com.madominguez.SolarMetrics.service;

import com.madominguez.SolarMetrics.entity.Inversor;
import com.madominguez.SolarMetrics.entity.User;
import com.madominguez.SolarMetrics.repository.InversorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InversorService {

    @Autowired
    private InversorRepository inversorRepository;

    public Inversor saveInversor(Inversor inversor) {
        return inversorRepository.save(inversor);
    }

    public List<Inversor> getAllInversor() {
        return inversorRepository.findAll();
    }

    public void deleteByDeviceId(long id) {
        inversorRepository.deleteById(id);
    }
}