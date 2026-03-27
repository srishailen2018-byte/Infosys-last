package com.shivathmika.frauddetector.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "transactions")
public class Transaction {

    @Id
    private String txnId;

    private String mobileNo;
    private String location;
    private String merchant;
    private String txnType;
    private double amount;
    private String status;
    private LocalDateTime txnTime;
    private String ipAddress;

    @Column(name = "risk_score")
    private int riskScore;

    @Column(name = "fraud", nullable = false)
    private boolean fraud;
}