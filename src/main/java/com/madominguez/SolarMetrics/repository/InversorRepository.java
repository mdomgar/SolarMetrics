package com.madominguez.SolarMetrics.repository;

import com.madominguez.SolarMetrics.entity.Inversor;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InversorRepository extends JpaRepository<Inversor, Integer> {

    @Modifying
    @Transactional
    @Query("DELETE FROM Inversor i WHERE i.id = :deviceId")
    void deleteById(@Param("deviceId") long deviceId);

    @Modifying
    boolean existsById(long deviceId);

    Inversor findInversorById(long deviceId);

    List<Inversor> findByIdIn(List<Integer> deviceIds);

}
