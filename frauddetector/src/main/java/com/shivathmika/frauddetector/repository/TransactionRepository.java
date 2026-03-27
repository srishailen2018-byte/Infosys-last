package com.shivathmika.frauddetector.repository;

import com.shivathmika.frauddetector.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, String> {
}