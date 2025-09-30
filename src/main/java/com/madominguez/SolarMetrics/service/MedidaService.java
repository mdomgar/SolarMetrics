package com.madominguez.SolarMetrics.service;

import com.madominguez.SolarMetrics.entity.Inversor;
import com.madominguez.SolarMetrics.entity.Medida;
import com.madominguez.SolarMetrics.repository.MedidaRepository;
import com.madominguez.SolarMetrics.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedidaService{

    private final MedidaRepository medidaRepository;

    public MedidaService(MedidaRepository medidaRepository) {
        this.medidaRepository = medidaRepository;
    }

    public Medida saveMedida(Medida medida) {
        return medidaRepository.save(medida);
    }

    public List<Medida> getAllMedidas() {
        return medidaRepository.findByGroupId(1);
    }

    public void deleteByDeviceId(long id) {
        medidaRepository.deleteByInversor_Id(id);
    }
}
