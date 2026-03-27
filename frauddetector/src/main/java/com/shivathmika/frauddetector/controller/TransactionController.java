package com.shivathmika.frauddetector.controller;

import com.shivathmika.frauddetector.model.Transaction;
import com.shivathmika.frauddetector.repository.TransactionRepository;
import com.shivathmika.frauddetector.service.FraudDetectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin
public class TransactionController {

    @Autowired
    private FraudDetectionService fraudService;

    @Autowired
    private TransactionRepository repository;

    @PostMapping("/check")
    public Transaction checkTransaction(@RequestBody Transaction txn) {

        txn.setTxnId("TXN-" + UUID.randomUUID());
        txn.setTxnTime(LocalDateTime.now());

        int riskScore = fraudService.calculateRiskScore(
                txn.getMobileNo(),
                txn.getAmount(),
                txn.getLocation(),
                txn.getMerchant(),
                txn.getStatus()
        );

        txn.setRiskScore(riskScore);
        txn.setFraud(fraudService.isFraud(riskScore));

        return repository.save(txn);
    }

    @GetMapping("/all")
    public Object getAllTransactions() {
        return repository.findAll();
    }
}




