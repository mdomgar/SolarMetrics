package com.madominguez.SolarMetrics.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "inversor")
public class Inversor {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private int id;

        private String stationLabel;

        @OneToMany(mappedBy = "inversor", cascade = CascadeType.ALL, orphanRemoval = true)
        private List<Medida> medidas = new ArrayList<>();

        public Inversor() {
        }

        public Inversor(int id, String stationLabel) {
                this.id = id;
                this.stationLabel = stationLabel;
        }

        public int getDeviceId() {
                return id;
        }

        public void setDeviceId(Integer deviceId) {
                this.id = deviceId;
        }

        public String getStationLabel() {
                return stationLabel;
        }

        public void setStationLabel(String stationLabel) {
                this.stationLabel = stationLabel;
        }

}
