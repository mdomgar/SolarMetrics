package com.madominguez.SolarMetrics.entity;

public class InversorDTO {
    private Integer deviceId;
    private String stationLabel;

    public InversorDTO(Integer deviceId, String stationLabel) {
        this.deviceId = deviceId;
        this.stationLabel = stationLabel;
    }

    public Integer getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(Integer deviceId) {
        this.deviceId = deviceId;
    }

    public String getStationLabel() {
        return stationLabel;
    }

    public void setStationLabel(String stationLabel) {
        this.stationLabel = stationLabel;
    }
}

