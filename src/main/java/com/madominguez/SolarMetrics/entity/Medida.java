package com.madominguez.SolarMetrics.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "medidas")
public class Medida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer groupId;

    private Double totalIncome;

    private Double totalPower;

    private Double dayPower;

    private Double activePower;

    private Double mpptPower;

    private Double pv1_u;

    private Double pv1_i;

    private Double pv2_u;

    private Double pv2_i;

    private Double pv3_u;

    private Double pv3_i;

    private Double pv4_u;

    private Double pv4_i;

    private Double pv5_u;

    private Double pv5_i;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private Inversor inversor;

    public Medida() {
    }

    public Medida(Long id, Integer groupId, Double totalIncome, Double totalPower, Double dayPower, Double activePower, Double mpptPower, Double pv1_u, Double pv1_i, Double pv2_u, Double pv2_i, Double pv3_u, Double pv3_i, Double pv4_u, Double pv4_i, Double pv5_u, Double pv5_i, Inversor inversor) {
        this.id = id;
        this.groupId = groupId;
        this.totalIncome = totalIncome;
        this.totalPower = totalPower;
        this.dayPower = dayPower;
        this.activePower = activePower;
        this.mpptPower = mpptPower;
        this.pv1_u = pv1_u;
        this.pv1_i = pv1_i;
        this.pv2_u = pv2_u;
        this.pv2_i = pv2_i;
        this.pv3_u = pv3_u;
        this.pv3_i = pv3_i;
        this.pv4_u = pv4_u;
        this.pv4_i = pv4_i;
        this.pv5_u = pv5_u;
        this.pv5_i = pv5_i;
        this.inversor = inversor;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public Double getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(Double totalIncome) {
        this.totalIncome = totalIncome;
    }

    public Double getTotalPower() {
        return totalPower;
    }

    public void setTotalPower(Double totalPower) {
        this.totalPower = totalPower;
    }

    public Double getDayPower() {
        return dayPower;
    }

    public void setDayPower(Double dayPower) {
        this.dayPower = dayPower;
    }

    public Double getActivePower() {
        return activePower;
    }

    public void setActivePower(Double activePower) {
        this.activePower = activePower;
    }

    public Double getMpptPower() {
        return mpptPower;
    }

    public void setMpptPower(Double mpptPower) {
        this.mpptPower = mpptPower;
    }

    public Double getPv1_u() {
        return pv1_u;
    }

    public void setPv1_u(Double pv1_u) {
        this.pv1_u = pv1_u;
    }

    public Double getPv1_i() {
        return pv1_i;
    }

    public void setPv1_i(Double pv1_i) {
        this.pv1_i = pv1_i;
    }

    public Double getPv2_u() {
        return pv2_u;
    }

    public void setPv2_u(Double pv2_u) {
        this.pv2_u = pv2_u;
    }

    public Double getPv2_i() {
        return pv2_i;
    }

    public void setPv2_i(Double pv2_i) {
        this.pv2_i = pv2_i;
    }

    public Double getPv3_u() {
        return pv3_u;
    }

    public void setPv3_u(Double pv3_u) {
        this.pv3_u = pv3_u;
    }

    public Double getPv3_i() {
        return pv3_i;
    }

    public void setPv3_i(Double pv3_i) {
        this.pv3_i = pv3_i;
    }

    public Double getPv4_u() {
        return pv4_u;
    }

    public void setPv4_u(Double pv4_u) {
        this.pv4_u = pv4_u;
    }

    public Double getPv4_i() {
        return pv4_i;
    }

    public void setPv4_i(Double pv4_i) {
        this.pv4_i = pv4_i;
    }

    public Double getPv5_u() {
        return pv5_u;
    }

    public void setPv5_u(Double pv5_u) {
        this.pv5_u = pv5_u;
    }

    public Double getPv5_i() {
        return pv5_i;
    }

    public void setPv5_i(Double pv5_i) {
        this.pv5_i = pv5_i;
    }

    public Inversor getInversor() {
        return inversor;
    }

    public void setInversor(Inversor inversor) {
        this.inversor = inversor;
    }

    @Override
    public String toString() {
        return "Medida{" +
                "id=" + id +
                ", groupId=" + groupId +
                ", totalIncome=" + totalIncome +
                ", totalPower=" + totalPower +
                ", dayPower=" + dayPower +
                ", activePower=" + activePower +
                ", mpptPower=" + mpptPower +
                ", pv1_u=" + pv1_u +
                ", pv1_i=" + pv1_i +
                ", pv2_u=" + pv2_u +
                ", pv2_i=" + pv2_i +
                ", pv3_u=" + pv3_u +
                ", pv3_i=" + pv3_i +
                ", pv4_u=" + pv4_u +
                ", pv4_i=" + pv4_i +
                ", pv5_u=" + pv5_u +
                ", pv5_i=" + pv5_i +
                ", inversor=" + inversor +
                '}';
    }
}