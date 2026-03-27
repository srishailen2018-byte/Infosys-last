import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.util.Random;

public class FraudTransactionGenerator {

    static String DB_URL = "jdbc:mysql://localhost:3306/frauddb?useSSL=false&allowPublicKeyRetrieval=true";
    static String USER = "root";
    static String PASSWORD = "sriram3107";

    static String API_URL = "http://localhost:5000/mlFraudCheck";

    static Random random = new Random();

    public static void main(String[] args) {

        int fraudCount = 80;
        int normalCount = 20;

        try {

            Class.forName("com.mysql.cj.jdbc.Driver");

            Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD);

            String query = "INSERT INTO transactions (txn_id,mobile_no,location,merchant,txn_type,amount,status,txn_time,ip_address,fraud_score,fraud_reason,is_fraud,sender_name,sender_account_no,sender_ifsc,sender_bank,sender_mobile,sender_location,receiver_name,receiver_account_no,receiver_ifsc,receiver_bank,receiver_mobile,receiver_location) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

            PreparedStatement ps = conn.prepareStatement(query);

            for (int i = 0; i < fraudCount + normalCount; i++) {

                double amount;

                if (i < fraudCount)
                    amount = 50000 + random.nextInt(50000);
                else
                    amount = 100 + random.nextInt(2000);

                ApiResponse res = callAPI(amount);

                ps.setString(1, "TXN" + System.currentTimeMillis() + i);
                ps.setString(2, "9" + (long) (Math.random() * 1000000000));
                ps.setString(3, "Chennai");
                ps.setString(4, "Amazon");
                ps.setString(5, "UPI");
                ps.setDouble(6, amount);
                ps.setString(7, "SUCCESS");
                ps.setTimestamp(8, new Timestamp(System.currentTimeMillis()));
                ps.setString(9, generateIP());

                ps.setInt(10, res.score);
                ps.setString(11, res.reason);
                ps.setBoolean(12, res.fraud);

                ps.setString(13, "SenderA");
                ps.setString(14, "123456789");
                ps.setString(15, "SBIN000123");
                ps.setString(16, "SBI");
                ps.setString(17, "9876543210");
                ps.setString(18, "Chennai");

                ps.setString(19, "ReceiverB");
                ps.setString(20, "987654321");
                ps.setString(21, "HDFC000123");
                ps.setString(22, "HDFC");
                ps.setString(23, "9123456780");
                ps.setString(24, "Mumbai");

                ps.executeUpdate();
            }

            conn.close();

            System.out.println("100 transactions inserted successfully");

        } catch (Exception e) {

            e.printStackTrace();

        }

    }

    static ApiResponse callAPI(double amount) {

        ApiResponse r = new ApiResponse();

        try {

            URL url = new URL(API_URL);

            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setDoOutput(true);

            int isNight = random.nextInt(2);
            int locationRisk = random.nextInt(2);
            int merchantRisk = random.nextInt(2);
            int velocityFlag = random.nextInt(2);

            String json = "{"
                    + "\"amount\":" + amount + ","
                    + "\"is_night\":" + isNight + ","
                    + "\"location_risk\":" + locationRisk + ","
                    + "\"merchant_risk\":" + merchantRisk + ","
                    + "\"velocity_flag\":" + velocityFlag
                    + "}";

            OutputStream os = conn.getOutputStream();
            os.write(json.getBytes());
            os.flush();
            os.close();

            BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));

            String output = br.readLine();

            r.score = extractInt(output, "fraudScore");
            r.reason = extractString(output, "reason");
            r.fraud = output.contains("\"isFraud\":true");

        } catch (Exception e) {

            r.score = 0;
            r.reason = "API error";
            r.fraud = false;

        }

        return r;

    }

    static int extractInt(String json, String key) {

        try {

            String val = json.split("\"" + key + "\":")[1];
            return Integer.parseInt(val.split("[,}]")[0]);

        } catch (Exception e) {

            return 0;

        }

    }

    static String extractString(String json, String key) {

        try {

            String val = json.split("\"" + key + "\":\"")[1];
            return val.split("\"")[0];

        } catch (Exception e) {

            return "Unknown";

        }

    }

    static String generateIP() {

        return random.nextInt(255) + "." + random.nextInt(255) + "." + random.nextInt(255) + "." + random.nextInt(255);

    }

    static class ApiResponse {

        int score;
        String reason;
        boolean fraud;

    }

}