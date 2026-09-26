package com.smartcrop.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "labour_records")
public class LabourRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Labourer name is required")
    @Column(nullable = false)
    private String labourerName;

    @NotNull(message = "Date is required")
    @Column(nullable = false)
    private LocalDate workDate;

    @NotBlank(message = "Work description is required")
    @Column(nullable = false)
    private String workDescription;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Amount cannot be negative")
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(length = 500)
    private String notes;

    public LabourRecord() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLabourerName() {
        return labourerName;
    }

    public void setLabourerName(String labourerName) {
        this.labourerName = labourerName;
    }

    public LocalDate getWorkDate() {
        return workDate;
    }

    public void setWorkDate(LocalDate workDate) {
        this.workDate = workDate;
    }

    public String getWorkDescription() {
        return workDescription;
    }

    public void setWorkDescription(String workDescription) {
        this.workDescription = workDescription;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}