import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.util.Random;
import java.util.Scanner;

public class frauddetector {

    private static final String URL =
            "jdbc:mysql://localhost:3306/transactions_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC";

    private static final String USER = "root";
    private static final String PASSWORD = "shivathmika@26";

    private static final String CREATE_TABLE_QUERY =
            "CREATE TABLE IF NOT EXISTS transactions (" +
                    "txn_id VARCHAR(25) PRIMARY KEY," +
                    "mobile_no VARCHAR(15)," +
                    "location VARCHAR(50)," +
                    "merchant VARCHAR(50)," +
                    "txn_type VARCHAR(20)," +
                    "amount DOUBLE," +
                    "status VARCHAR(20)," +
                    "txn_time DATETIME," +
                    "ip_address VARCHAR(20)," +
                    "is_fraud BOOLEAN" +
                    ")";

    private static final String INSERT_QUERY =
            "INSERT INTO transactions " +
                    "(txn_id, mobile_no, location, merchant, txn_type, amount, status, txn_time, ip_address, is_fraud) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    private static final String[] LOCATIONS = {
            "Chennai", "Mumbai", "Delhi", "Bangalore", "Hyderabad",
            "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Coimbatore"
    };

    private static final String[] MERCHANTS = {
            "Amazon", "Flipkart", "Swiggy", "Zomato", "Uber",
            "Ola", "Myntra", "Meesho", "Reliance", "BigBasket"
    };

    private static final String[] TXN_TYPES = {
            "UPI", "Debit Card", "Credit Card", "Net Banking", "Wallet"
    };

    private static final Random random = new Random();

    public static void main(String[] args) {

        Scanner scanner = new Scanner(System.in);
        System.out.print("Enter number of transactions to generate: ");
        int totalTransactions = scanner.nextInt();

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(URL, USER, PASSWORD);
                 Statement stmt = conn.createStatement();
                 PreparedStatement ps = conn.prepareStatement(INSERT_QUERY)) {

                conn.setAutoCommit(false);
                stmt.executeUpdate(CREATE_TABLE_QUERY);

                for (int i = 1; i <= totalTransactions; i++) {

                    String txnId = generateTxnId(i);
                    String mobile = generateMobile();
                    String location = LOCATIONS[random.nextInt(LOCATIONS.length)];
                    String merchant = MERCHANTS[random.nextInt(MERCHANTS.length)];
                    String txnType = TXN_TYPES[random.nextInt(TXN_TYPES.length)];
                    double amount = generateAmount();
                    String status = random.nextBoolean() ? "SUCCESS" : "FAILED";
                    Timestamp txnTime = new Timestamp(System.currentTimeMillis());
                    String ip = generateIP();
                    boolean isFraud = detectFraud(amount, location);

                    ps.setString(1, txnId);
                    ps.setString(2, mobile);
                    ps.setString(3, location);
                    ps.setString(4, merchant);
                    ps.setString(5, txnType);
                    ps.setDouble(6, amount);
                    ps.setString(7, status);
                    ps.setTimestamp(8, txnTime);
                    ps.setString(9, ip);
                    ps.setBoolean(10, isFraud);

                    ps.addBatch();

                    if (i % 1000 == 0) {
                        ps.executeBatch();
                        conn.commit();
                        System.out.println(i + " transactions inserted...");
                    }
                }

                ps.executeBatch();
                conn.commit();
                System.out.println("✅ " + totalTransactions + " Transactions Inserted Successfully!");

            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static String generateTxnId(int i) {
        return "TXN" + System.currentTimeMillis() + i + random.nextInt(999);
    }

    private static String generateMobile() {
        return "9" + (long)(Math.random() * 9000000000L + 1000000000L);
    }

    private static double generateAmount() {
        return Math.round((10 + (100000 - 10) * random.nextDouble()) * 100.0) / 100.0;
    }

    private static String generateIP() {
        return random.nextInt(255) + "." +
                random.nextInt(255) + "." +
                random.nextInt(255) + "." +
                random.nextInt(255);
    }

    private static boolean detectFraud(double amount, String location) {
        if (amount > 50000) return true;
        if (location.equals("Kolkata") && amount > 20000) return true;
        return random.nextInt(100) < 3;
    }
}