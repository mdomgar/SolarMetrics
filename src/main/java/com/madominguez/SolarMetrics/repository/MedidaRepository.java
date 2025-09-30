package com.madominguez.SolarMetrics.repository;

import com.madominguez.SolarMetrics.entity.Inversor;
import com.madominguez.SolarMetrics.entity.Medida;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedidaRepository extends JpaRepository<Medida, Integer> {

    List<Medida> findByGroupId(long groupId);
    void deleteByInversor_Id(Long deviceId);
}
