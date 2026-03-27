package com.shivathmika.frauddetector.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class FraudDetectionService {

    // Blacklisted merchants (case-insensitive)
    private final Set<String> blacklistedMerchants =
            new HashSet<>(Arrays.asList("fakestore", "darkshop", "unknownpay"));

    // Store last location of each user
    private final Map<String, String> lastLocationMap = new HashMap<>();

    // Store last transaction time of each user
    private final Map<String, LocalDateTime> lastTxnTimeMap = new HashMap<>();

    public int calculateRiskScore(String mobile,
                                  double amount,
                                  String location,
                                  String merchant,
                                  String status) {

        int score = 0; // Start from 0 for accurate scoring
        LocalDateTime now = LocalDateTime.now();

        // 🔹 Rule 1: High Amount Rule
        if (amount > 50000) {
            score += 40;
        }

        // 🔹 Rule 2: Blacklisted Merchant (case-insensitive check)
        if (merchant != null &&
                blacklistedMerchants.contains(merchant.toLowerCase())) {
            score += 30;
        }

        // 🔹 Rule 3: Sudden Location Change
        if (mobile != null && location != null) {
            if (lastLocationMap.containsKey(mobile)) {
                String lastLocation = lastLocationMap.get(mobile);
                if (!lastLocation.equalsIgnoreCase(location)) {
                    score += 25;
                }
            }
            // Update latest location
            lastLocationMap.put(mobile, location);
        }

        // 🔹 Rule 4: Rapid Transactions (within 1 minute)
        if (mobile != null) {
            if (lastTxnTimeMap.containsKey(mobile)) {
                LocalDateTime lastTime = lastTxnTimeMap.get(mobile);
                if (lastTime != null &&
                        now.minusMinutes(1).isBefore(lastTime)) {
                    score += 35;
                }
            }
            // Update latest transaction time
            lastTxnTimeMap.put(mobile, now);
        }

        // 🔹 Rule 5: Midnight Suspicious Transactions (1 AM - 4 AM)
        int hour = now.getHour();
        if (hour >= 1 && hour <= 4 && amount > 10000) {
            score += 20;
        }

        // 🔹 Rule 6: Failed Transaction Pattern
        if (status != null && status.equalsIgnoreCase("FAILED")) {
            score += 10;
        }

        // 🔹 Final: Limit score between 0 and 100
        return Math.min(score, 100);
    }

    // Fraud decision logic
    public boolean isFraud(int riskScore) {
        return riskScore >= 70;
    }
}