from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import mysql.connector
from mysql.connector import Error
import datetime
import time
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import re

app = Flask(__name__)
CORS(app)  # allow cross-origin requests from frontend

# Email Configuration
EMAIL_SENDER = "srishailen2018_bai27@mepcoeng.ac.in"
EMAIL_PASSWORD = "gjrp vfjt yfti dleu" # Application Passkey
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 465 # Use SSL port for better reliability

def send_fraud_alert_email(receiver_email, transaction_details):
    if not EMAIL_SENDER or EMAIL_SENDER == "your-email@gmail.com":
        print("Email sender not configured. Skipping email alert.")
        return False

    # Clean the password - remove extra spaces
    clean_password = EMAIL_PASSWORD.replace(" ", "")

    try:
        msg = MIMEMultipart('alternative')
        msg['From'] = EMAIL_SENDER
        msg['To'] = receiver_email
        msg['Subject'] = "🚨 FRAUD ALERT: Suspicious Transaction Detected"

        # HTML Version for beautiful formatting (Cyberpunk Edition)
        html_body = f"""
        <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Share+Tech+Mono&display=swap');
                
                body {{ margin: 0; padding: 0; background-color: #020617; }}
                .container {{ 
                    font-family: 'Segoe UI', sans-serif; 
                    max-width: 600px; 
                    margin: 20px auto; 
                    background-color: #0f172a; 
                    border: 2px solid #00f3ff; 
                    border-radius: 4px; 
                    overflow: hidden;
                    box-shadow: 0 0 20px rgba(0, 243, 255, 0.2);
                }}
                .header {{ 
                    background: linear-gradient(90deg, #00f3ff 0%, #7000ff 100%); 
                    padding: 30px 20px; 
                    text-align: center; 
                    color: #ffffff;
                    border-bottom: 2px solid #00f3ff;
                }}
                .header h1 {{ 
                    margin: 0; 
                    font-family: 'Orbitron', sans-serif; 
                    font-size: 32px; 
                    letter-spacing: 4px;
                    text-transform: uppercase;
                    text-shadow: 2px 2px #7000ff;
                }}
                .content {{ 
                    padding: 40px 30px; 
                    color: #94a3b8; 
                    line-height: 1.8;
                }}
                .alert-banner {{ 
                    background-color: rgba(225, 29, 72, 0.1); 
                    border: 1px solid #e11d48; 
                    color: #e11d48; 
                    padding: 15px; 
                    font-family: 'Share Tech Mono', monospace;
                    font-size: 18px;
                    font-weight: bold; 
                    margin-bottom: 30px; 
                    text-align: center;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                }}
                .details-table {{ 
                    width: 100%; 
                    border-collapse: collapse; 
                    margin: 25px 0; 
                    background-color: rgba(30, 41, 59, 0.5);
                    border: 1px solid rgba(0, 243, 255, 0.1);
                }}
                .details-table td {{ 
                    padding: 15px; 
                    border-bottom: 1px solid rgba(255, 255, 255, 0.05); 
                }}
                .label {{ 
                    color: #00f3ff; 
                    font-family: 'Share Tech Mono', monospace;
                    font-size: 12px; 
                    text-transform: uppercase; 
                    letter-spacing: 1px;
                    width: 40%; 
                }}
                .value {{ 
                    color: #ffffff; 
                    font-weight: bold; 
                    text-align: right; 
                }}
                .footer {{ 
                    background-color: #020617; 
                    padding: 25px; 
                    text-align: center; 
                    color: #475569; 
                    font-family: 'Share Tech Mono', monospace;
                    font-size: 11px; 
                    border-top: 1px solid #00f3ff; 
                }}
                .btn {{ 
                    display: inline-block; 
                    padding: 15px 30px; 
                    background-color: transparent; 
                    color: #00f3ff; 
                    text-decoration: none; 
                    border: 1px solid #00f3ff;
                    font-family: 'Orbitron', sans-serif;
                    font-size: 14px;
                    font-weight: bold; 
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    margin-top: 25px;
                    transition: all 0.3s;
                }}
                .risk-badge {{ 
                    padding: 5px 12px; 
                    border-radius: 2px; 
                    font-size: 14px; 
                    background-color: #e11d48; 
                    color: #ffffff; 
                    font-family: 'Share Tech Mono', monospace;
                    box-shadow: 0 0 10px rgba(225, 29, 72, 0.5);
                }}
                .glitch-text {{ color: #00f3ff; font-weight: bold; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>FRAUD_SHIELD</h1>
                    <p style="margin-top: 10px; font-family: 'Share Tech Mono', monospace; font-size: 12px; letter-spacing: 2px; opacity: 0.8;">NEURAL_NET_MONITOR_v2.0</p>
                </div>
                <div class="content">
                    <div class="alert-banner">
                        [!] SECURITY_BREACH_DETECTED [!]
                    </div>
                    <p>System identity confirmed. Initializing threat report...</p>
                    <p>A <span class="glitch-text">CRITICAL_ANOMALY</span> has been identified by the core ML engine. Protective protocols have been engaged.</p>
                    
                    <table class="details-table">
                        <tr>
                            <td class="label">ENTRY_ID</td>
                            <td class="value">{transaction_details['id']}</td>
                        </tr>
                        <tr>
                            <td class="label">TARGET_MERCHANT</td>
                            <td class="value">{transaction_details['merchant']}</td>
                        </tr>
                        <tr>
                            <td class="label">CREDITS_TRANSFER</td>
                            <td class="value" style="color: #00f3ff;">{transaction_details['amount']}</td>
                        </tr>
                        <tr>
                            <td class="label">GEO_LOCATION</td>
                            <td class="value">{transaction_details['location']}</td>
                        </tr>
                        <tr>
                            <td class="label">THREAT_LEVEL</td>
                            <td class="value"><span class="risk-badge">{transaction_details['risk']}%_RISK</span></td>
                        </tr>
                        <tr>
                            <td class="label">DETECTION_LOG</td>
                            <td class="value">{transaction_details['reason']}</td>
                        </tr>
                        <tr>
                            <td class="label">PROTOCOL_ENGAGED</td>
                            <td class="value" style="color: #e11d48; text-transform: uppercase;">{transaction_details['status']}</td>
                        </tr>
                    </table>

                    <div style="text-align: center;">
                        <a href="#" class="btn">ACCESS_MAIN_FRAME</a>
                    </div>
                    
                    <p style="margin-top: 40px; font-size: 12px; color: #475569; font-family: 'Share Tech Mono', monospace;">If this was authorized by the user, disregard this transmission. Unauthorized access will be traced.</p>
                </div>
                <div class="footer">
                    FRAUD_SHIELD_OS // SECURE_CONNECTION_ESTABLISHED<br>
                    DO_NOT_REPLY_TO_AUTOMATED_SYSTEM_NODE
                </div>
            </div>
        </body>
        </html>
        """

        # Plain text fallback
        text_body = f"""
        🚨 FRAUD ALERT: Suspicious Transaction Detected

        Transaction Details:
        -------------------
        ID: {transaction_details['id']}
        Merchant: {transaction_details['merchant']}
        Amount: {transaction_details['amount']}
        Location: {transaction_details['location']}
        Risk Score: {transaction_details['risk']}%
        Action: {transaction_details['status'].upper()}

        If this was not you, contact support immediately.
        """

        msg.attach(MIMEText(text_body, 'plain'))
        msg.attach(MIMEText(html_body, 'html'))

        if SMTP_PORT == 465:
            server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
        else:
            server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
            server.starttls()
            
        server.set_debuglevel(1)
        server.login(EMAIL_SENDER, clean_password)
        text = msg.as_string()
        server.sendmail(EMAIL_SENDER, receiver_email, text)
        server.quit()
        print(f"Fraud alert email sent to {receiver_email}")
        return True
    except Exception as e:
        print(f"Failed to send email: {e}")
        return False

# MySQL Configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': 'sriram3107',
    'database': 'frauddb'
}

def get_db_connection():
    try:
        connection = mysql.connector.connect(**db_config)
        return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

def log_audit(user_email, action, details):
    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            cursor.execute("INSERT INTO audit_logs (user_email, action, details) VALUES (%s, %s, %s)", (user_email, action, details))
            conn.commit()
        except Error as e:
            print(f"Audit log error: {e}")
        finally:
            cursor.close()
            conn.close()

model = joblib.load("fraud_model.pkl")

# load dataset and compute stats
_data = pd.read_csv("banksim.csv").head(50000)
_data.rename(columns={"fraud":"is_fraud"}, inplace=True)
_data["is_high_amount"] = _data["amount"].apply(lambda x:1 if x>50000 else 0)
_data["is_night"] = _data["step"].apply(lambda x:1 if (x%24>=22 or x%24<=5) else 0)
np.random.seed(42)
_data["location_risk"] = np.random.randint(0,2,len(_data))
_data["merchant_risk"] = np.random.randint(0,2,len(_data))
_data["velocity_flag"] = np.random.randint(0,2,len(_data))

features = ["amount","is_high_amount","is_night","location_risk","merchant_risk","velocity_flag"]
X = _data[features]
y = _data["is_fraud"]

X_train,X_test,y_train,y_test = train_test_split(X,y,test_size=0.2, random_state=42)
train_pred = model.predict(X_train)
test_pred = model.predict(X_test)
train_accuracy = accuracy_score(y_train, train_pred)
test_accuracy = accuracy_score(y_test, test_pred)

@app.route("/stats")
def stats():
    conn = get_db_connection()
    db_total = 0
    db_fraud = 0
    db_flagged = 0
    db_blocked = 0
    
    if conn:
        try:
            cursor = conn.cursor()
            # Total transactions and total fraud (blocked)
            cursor.execute("SELECT COUNT(*), SUM(is_fraud) FROM transactions")
            row = cursor.fetchone()
            db_total = row[0] or 0
            db_blocked = int(row[1]) if row[1] else 0
            
            # Count flagged (score > 40 but not is_fraud)
            cursor.execute("SELECT COUNT(*) FROM transactions WHERE fraud_score > 40 AND is_fraud = 0")
            db_flagged = cursor.fetchone()[0] or 0
            
            db_fraud = db_blocked + db_flagged
        except Error as e:
            print(f"Stats DB Error: {e}")
        finally:
            cursor.close()
            conn.close()

    total = len(_data) + db_total
    fraud_count = int(_data["is_fraud"].sum()) + db_fraud
    normal_count = total - fraud_count
    
    # ML Metrics (Still based on test set for accuracy)
    precision = precision_score(y_test, model.predict(X_test), zero_division=0)
    recall = recall_score(y_test, model.predict(X_test), zero_division=0)
    f1 = f1_score(y_test, model.predict(X_test), zero_division=0)
    
    return jsonify({
        "total": total,
        "fraudCount": fraud_count,
        "blockedCount": db_blocked + int(_data["is_fraud"].sum() * 0.8), # partial estimate for base data
        "flaggedCount": db_flagged,
        "normalCount": normal_count,
        "trainAccuracy": float(train_accuracy),
        "testAccuracy": float(test_accuracy),
        "precision": float(precision),
        "recall": float(recall),
        "f1": float(f1)
    })

@app.route("/")
def home():
    return "Fraud Detection ML API Running"

@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "Analyst")
    admin_email = data.get("adminEmail") # Admin who is creating the account

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
        
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "DB connection failed"}), 500
        
    try:
        cursor = conn.cursor(dictionary=True)
        # Verify if the request comes from an Admin (Simple check for now)
        if admin_email:
            cursor.execute("SELECT role FROM users WHERE email = %s", (admin_email,))
            admin = cursor.fetchone()
            if not admin or admin['role'] != 'Admin':
                return jsonify({"error": "Only Admins can create accounts"}), 403
        else:
            # If no adminEmail, check if any users exist (Initial setup)
            cursor.execute("SELECT COUNT(*) as count FROM users")
            if cursor.fetchone()['count'] > 0:
                 return jsonify({"error": "Admin authentication required"}), 403

        # Check if user already exists
        cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cursor.fetchone():
            return jsonify({"error": "Email already registered"}), 400
            
        # Insert new user
        cursor.execute("INSERT INTO users (email, password, role) VALUES (%s, %s, %s)", (email, password, role))
        conn.commit()
        log_audit(admin_email or "SYSTEM", "USER_CREATED", f"Created {role} account for {email}")
        return jsonify({"message": "User registered successfully"}), 201
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
        
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "DB connection failed"}), 500
        
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT email, role FROM users WHERE email = %s AND password = %s", (email, password))
        user = cursor.fetchone()
        
        if user:
            log_audit(email, "LOGIN", "Successful login to the system")
            return jsonify({"message": "Login successful", "email": user['email'], "role": user['role']}), 200
        else:
            log_audit(email, "LOGIN_FAILED", "Failed login attempt")
            return jsonify({"error": "Invalid email or password"}), 401
    except Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/auditLogs")
def get_audit_logs():
    conn = get_db_connection()
    if not conn:
        return jsonify([])
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100")
        rows = cursor.fetchall()
        for row in rows:
            if row['timestamp']:
                row['timestamp'] = row['timestamp'].strftime("%Y-%m-%d %H:%M:%S")
        return jsonify(rows)
    except Error as e:
        print(f"Error fetching audits: {e}")
        return jsonify([])
    finally:
        cursor.close()
        conn.close()

@app.route("/mlFraudCheck", methods=["POST"])
def fraud_check():
    data = request.json
    amount = float(data.get("amount", 0))
    is_night = int(data.get("is_night", 0))
    location_risk = int(data.get("location_risk", 0))
    merchant_risk = int(data.get("merchant_risk", 0))
    velocity_flag = int(data.get("velocity_flag", 0))
    merchant = data.get("merchant", "Amazon")
    location = data.get("location", "Chennai")
    user_email = data.get("userEmail")

    is_high_amount = 1 if amount > 50000 else 0

    features = np.array([[
        amount,
        is_high_amount,
        is_night,
        location_risk,
        merchant_risk,
        velocity_flag
    ]])

    probability = model.predict_proba(features)[0][1]
    fraud_score = int(probability * 100)
    is_fraud = fraud_score >= 50

    reasons = []
    if is_high_amount: reasons.append("High Amount")
    if is_night: reasons.append("Night Transaction")
    if location_risk: reasons.append("Risky Location")
    if merchant_risk: reasons.append("Blacklisted Merchant")
    if velocity_flag: reasons.append("High Velocity Behavior")
    reason_text = ", ".join(reasons) if reasons else "Normal"

    # SAVE TO MYSQL
    txn_id = f"ML{int(time.time() * 1000)}"
    txn_time = datetime.datetime.now()
    
    transaction_obj = {
        "id": txn_id,
        "time": txn_time.strftime("%H:%M"),
        "merchant": merchant,
        "amount": f"${amount:,.2f}",
        "location": location,
        "risk": fraud_score,
        "status": "blocked" if is_fraud else ("flagged" if fraud_score > 40 else "approved"),
        "reason": reason_text
    }

    # TRIGGER EMAIL ALERT IF FRAUD
    if (is_fraud or fraud_score > 40) and user_email:
        print(f"Attempting to send real email to {user_email}...")
        send_fraud_alert_email(user_email, transaction_obj)

    conn = get_db_connection()
    if conn:
        try:
            cursor = conn.cursor()
            query = """INSERT INTO transactions 
                       (txn_id, mobile_no, location, merchant, txn_type, amount, status, txn_time, ip_address, 
                        fraud_score, fraud_reason, is_fraud, sender_name, sender_account_no, sender_ifsc, 
                        sender_bank, sender_mobile, sender_location, receiver_name, receiver_account_no, 
                        receiver_ifsc, receiver_bank, receiver_mobile, receiver_location) 
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            
            values = (
                txn_id, "9876543210", location, merchant, "UPI", amount, "SUCCESS", txn_time, "127.0.0.1",
                fraud_score, reason_text, is_fraud, "Sender", "12345", "SBIN001", "SBI", "9876543210", 
                location, "Receiver", "67890", "HDFC001", "HDFC", "9123456789", "Mumbai"
            )
            
            cursor.execute(query, values)
            conn.commit()
            print(f"Transaction {txn_id} saved to database")
            
            # Log action
            log_audit(user_email or "SYSTEM", "FRAUD_CHECK", f"Checked transaction {txn_id} - Score: {fraud_score}%")
        except Error as e:
            print(f"Failed to insert into MySQL: {e}")
        finally:
            cursor.close()
            conn.close()

    return jsonify(transaction_obj)

@app.route("/mlBatchCheck", methods=["POST"])
def batch_check():
    data = request.json
    batch_size = int(data.get("batchSize", 10))
    fraud_ratio = int(data.get("fraudRatio", 15))
    max_amount = float(data.get("maxAmount", 10000))
    scenario = data.get("scenario", "Mixed (Normal + Fraud)")
    user_email = data.get("userEmail")
    
    merchants = ['Amazon', 'Apple Store', 'Netflix', 'Starbucks', 'Uber', 'Unknown Vendor', 'Spotify', 'eBay', 'Walmart', 'Shell']
    locations = ['New York, US', 'London, UK', 'Dubai, AE', 'Paris, FR', 'Singapore, SG', 'Moscow, RU', 'Mumbai, IN', 'Tokyo, JP']
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "DB connection failed"}), 500
        
    generated_txns = []
    try:
        cursor = conn.cursor()
        for i in range(batch_size):
            # Determine if this specific transaction in the batch should be fraud based on scenario
            if scenario == "Normal Traffic Only":
                is_fraud_sim = False
            elif scenario == "High Velocity Attack":
                is_fraud_sim = True
            elif scenario == "Geo-Location Anomaly":
                is_fraud_sim = True
            else: # Mixed (Normal + Fraud)
                is_fraud_sim = np.random.random() * 100 < fraud_ratio
            
            if is_fraud_sim:
                # Generate high risk features
                amount = np.random.random() * max_amount + 5000 # fraud usually higher
                is_night = np.random.choice([0, 1], p=[0.3, 0.7])
                location_risk = 1 if scenario == "Geo-Location Anomaly" else np.random.choice([0, 1], p=[0.4, 0.6])
                merchant_risk = np.random.choice([0, 1], p=[0.4, 0.6])
                velocity_flag = 1 if scenario == "High Velocity Attack" else np.random.choice([0, 1], p=[0.4, 0.6])
            else:
                # Generate safe features (Truly normal)
                amount = np.random.random() * min(max_amount, 2000) # normal usually lower
                is_night = 0 # mostly day
                location_risk = 0
                merchant_risk = 0
                velocity_flag = 0
            
            merchant = np.random.choice(merchants)
            location = np.random.choice(locations)
            
            is_high_amount = 1 if amount > 50000 else 0
            
            features = np.array([[amount, is_high_amount, is_night, location_risk, merchant_risk, velocity_flag]])
            probability = model.predict_proba(features)[0][1]
            fraud_score = int(probability * 100)
            
            # STRENGHTEN SCENARIO ENFORCEMENT: 
            # If scenario is "Normal Traffic Only", we force the model's output to be low 
            # by providing safe features above, but we also manually cap the score just in case.
            if scenario == "Normal Traffic Only":
                fraud_score = min(fraud_score, 10)
                is_fraud = False
            else:
                is_fraud = fraud_score >= 50
            
            reasons = []
            if is_high_amount: reasons.append("High Amount")
            if is_night: reasons.append("Night Transaction")
            if location_risk: reasons.append("Risky Location")
            if merchant_risk: reasons.append("Blacklisted Merchant")
            if velocity_flag: reasons.append("High Velocity Behavior")
            reason_text = ", ".join(reasons) if reasons else "Normal"
            
            txn_id = f"BATCH{int(time.time() * 1000)}{i}"
            txn_time = datetime.datetime.now()
            
            query = """INSERT INTO transactions 
                       (txn_id, mobile_no, location, merchant, txn_type, amount, status, txn_time, ip_address, 
                        fraud_score, fraud_reason, is_fraud, sender_name, sender_account_no, sender_ifsc, 
                        sender_bank, sender_mobile, sender_location, receiver_name, receiver_account_no, 
                        receiver_ifsc, receiver_bank, receiver_mobile, receiver_location) 
                       VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
            
            values = (
                txn_id, "9876543210", location, merchant, "UPI", amount, "SUCCESS", txn_time, "127.0.0.1",
                fraud_score, reason_text, is_fraud, "BatchSender", "12345", "SBIN001", "SBI", "9876543210", 
                location, "BatchReceiver", "67890", "HDFC001", "HDFC", "9123456789", "Mumbai"
            )
            
            cursor.execute(query, values)
            
            generated_txns.append({
                "id": txn_id,
                "time": txn_time.strftime("%H:%M"),
                "merchant": merchant,
                "amount": f"${amount:,.2f}",
                "location": location,
                "risk": fraud_score,
                "status": "blocked" if is_fraud else ("flagged" if fraud_score > 40 else "approved")
            })
            
        conn.commit()

        # TRIGGER BATCH EMAIL ALERT IF FRAUD FOUND
        frauds = [t for t in generated_txns if t['status'] != 'approved']
        if frauds and user_email:
            print(f"Attempting to send real batch email to {user_email}...")
            summary = {
                "id": frauds[0]['id'], # Representative ID
                "merchant": f"Multiple ({len(frauds)} cases)",
                "amount": f"Total {len(frauds)} suspicious transactions",
                "location": "Various",
                "risk": max([t['risk'] for t in frauds]),
                "reason": "Batch Simulation Fraud",
                "time": datetime.datetime.now().strftime("%H:%M"),
                "status": "flagged/blocked"
            }
            send_fraud_alert_email(user_email, summary)

        return jsonify(generated_txns), 200
    except Error as e:
        print(f"Batch insert error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/transactions")
def get_transactions():
    conn = get_db_connection()
    if not conn:
        return jsonify([])
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM transactions ORDER BY txn_time DESC LIMIT 100")
        rows = cursor.fetchall()
        
        # Format for frontend
        formatted = []
        for row in rows:
            formatted.append({
                "id": row['txn_id'],
                "time": row['txn_time'].strftime("%H:%M"),
                "merchant": row['merchant'],
                "amount": f"${row['amount']:,.2f}",
                "location": row['location'],
                "risk": row['fraud_score'],
                "status": "blocked" if row['is_fraud'] else ("flagged" if row['fraud_score'] > 40 else "approved"),
                "reason": row['fraud_reason'],
                "sender": {
                    "name": row['sender_name'],
                    "account": row['sender_account_no'],
                    "bank": row['sender_bank'],
                    "mobile": row['sender_mobile'],
                    "location": row['sender_location']
                },
                "receiver": {
                    "name": row['receiver_name'],
                    "account": row['receiver_account_no'],
                    "bank": row['receiver_bank'],
                    "mobile": row['receiver_mobile'],
                    "location": row['receiver_location']
                },
                "ip": row['ip_address'],
                "type": row['txn_type']
            })
        return jsonify(formatted)
    except Error as e:
        print(f"Error fetching transactions: {e}")
        return jsonify([])
    finally:
        cursor.close()
        conn.close()

@app.route("/fraudStats")
def fraud_stats():
    conn = get_db_connection()
    if not conn:
        return jsonify({"fraud": 0, "normal": 0, "total": 0})
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT is_fraud, COUNT(*) as count FROM transactions GROUP BY is_fraud")
        results = cursor.fetchall()
        
        fraud = 0
        normal = 0
        for r in results:
            if r['is_fraud']: fraud = r['count']
            else: normal = r['count']
            
        return jsonify({
            "fraud": fraud,
            "normal": normal,
            "total": fraud + normal
        })
    except Error as e:
        print(f"Error fetching stats: {e}")
        return jsonify({"fraud": 0, "normal": 0, "total": 0})
    finally:
        cursor.close()
        conn.close()

@app.route("/chatbot", methods=["POST"])
def chatbot():
    data = request.json
    if not data:
        return jsonify({"response": "No query provided."}), 400
        
    query = data.get("query", "").lower()
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"response": "I'm having trouble connecting to the database right now."})
    
    cursor = None
    try:
        cursor = conn.cursor(dictionary=True)
        
        # 1. Transaction Summarizer
        if "summary" in query or "today" in query:
            cursor.execute("SELECT COUNT(*) as count, SUM(amount) as total FROM transactions WHERE is_fraud = 1")
            row = cursor.fetchone()
            count = row['count'] or 0
            total = row['total'] or 0
            
            cursor.execute("SELECT merchant, COUNT(*) as m_count FROM transactions WHERE is_fraud = 1 GROUP BY merchant ORDER BY m_count DESC LIMIT 1")
            m_row = cursor.fetchone()
            top_merchant = m_row['merchant'] if m_row else "none"
            
            return jsonify({
                "response": f"Today we detected {count} fraud attempts totaling ${total:,.2f}. The most targeted merchant was {top_merchant}."
            })

        # 2. Risk Explainer
        if "why" in query or "blocked" in query or "reason" in query:
            cursor.execute("SELECT * FROM transactions WHERE is_fraud = 1 ORDER BY id DESC LIMIT 1")
            last_fraud = cursor.fetchone()
            if last_fraud:
                reason = "It was flagged because "
                if last_fraud['amount'] > 1500:
                    reason += f"the amount of ${last_fraud['amount']} is unusually high. "
                if last_fraud['fraud_score'] > 80:
                    reason += f"the ML model detected a high risk score of {last_fraud['fraud_score']}%. "
                reason += f"The transaction at {last_fraud['merchant']} from {last_fraud['location']} triggered multiple anomaly flags."
                return jsonify({"response": reason})
            return jsonify({"response": "I couldn't find any recent blocked transactions to explain."})

        # 3. Natural Language Queries (Trigger Simulation)
        if "generate" in query or "add" in query:
            match = re.search(r'\d+', query)
            num = int(match.group()) if match else 5
            scenario = "Normal Traffic Only" if "normal" in query else "High Velocity"
            
            # Call internal batch check logic (Simplified for bot)
            # In a real app, we'd refactor the simulation logic into a shared service
            # For now, let's just confirm and suggest using the Simulation tab or implement a quick version
            return jsonify({
                "response": f"I've initiated a request to generate {num} {scenario} transactions. They will appear on your dashboard in a few seconds.",
                "triggerSimulation": {"count": num, "scenario": scenario}
            })

        # 4. Trend Analyst
        if "trend" in query or "merchant" in query or "highest risk" in query:
            cursor.execute("""
                SELECT merchant, 
                (SUM(CASE WHEN is_fraud = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as risk_rate 
                FROM transactions 
                GROUP BY merchant 
                ORDER BY risk_rate DESC 
                LIMIT 1
            """)
            row = cursor.fetchone()
            if row:
                return jsonify({
                    "response": f"Currently, {row['merchant']} has a {row['risk_rate']:.1f}% fraud rate, which is the highest in the system right now."
                })
            return jsonify({"response": "I don't have enough data to calculate merchant trends yet."})

        return jsonify({"response": "I'm your FraudShield assistant. I can summarize transactions, explain risk, analyze trends, or help you generate simulations. What would you like to know?"})

    except Exception as e:
        return jsonify({"response": f"Error: {str(e)}"})
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

if __name__ == "__main__":
    app.run(port=5000)
