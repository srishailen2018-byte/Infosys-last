import streamlit as st
import pandas as pd
import numpy as np
import requests
import plotly.express as px
import plotly.graph_objects as go

API_ROOT = "http://localhost:5000"

st.set_page_config(page_title="FraudShield", layout="wide")

# backend helpers
def get_stats():
    try:
        print(f"[DEBUG] Attempting to fetch stats from {API_ROOT}/stats")
        r = requests.get(f"{API_ROOT}/stats", timeout=5)
        print(f"[DEBUG] Status code: {r.status_code}")
        r.raise_for_status()
        data = r.json()
        print(f"[DEBUG] Successfully retrieved stats: {data}")
        return data
    except requests.exceptions.ConnectionError as e:
        print(f"[ERROR] Connection error: {e}")
        return None
    except requests.exceptions.Timeout as e:
        print(f"[ERROR] Timeout error: {e}")
        return None
    except Exception as e:
        print(f"[ERROR] Exception: {type(e).__name__}: {e}")
        return None

def get_transactions():
    try:
        print(f"[DEBUG] Attempting to fetch transactions from {API_ROOT}/transactions")
        r = requests.get(f"{API_ROOT}/transactions", timeout=5)
        r.raise_for_status()
        return pd.DataFrame(r.json())
    except Exception as e:
        print(f"[ERROR] Failed to get transactions: {e}")
        return None

def get_fraud_stats():
    try:
        print(f"[DEBUG] Attempting to fetch fraud stats from {API_ROOT}/fraudStats")
        r = requests.get(f"{API_ROOT}/fraudStats", timeout=5)
        r.raise_for_status()
        data = r.json()
        print(f"[DEBUG] Successfully retrieved fraud stats: {data}")
        return data
    except Exception as e:
        print(f"[ERROR] Failed to get fraud stats: {e}")
        return None

# UI
st.sidebar.title("FraudShield")
section = st.sidebar.radio("Navigate", ["Dashboard", "Simulation", "Detection", "Analytics", "Transaction Generation", "Transactions", "Settings"], index=3)

stats = get_stats()
transactions_df = get_transactions()
fraud_stats = get_fraud_stats()
backend = stats is not None and transactions_df is not None and fraud_stats is not None
if not backend:
    st.sidebar.error("Backend not available at localhost:5000. Running in fallback mode.")

if section == "Analytics":
    st.title("ML Analytics & API Gateway")
    st.subheader("Machine learning model monitoring")

    if backend:
        p = stats.get("precision", 0)*100
        r = stats.get("recall", 0)*100
        f = stats.get("f1", 0)*100
        st.metric("Precision", f"{p:.1f}%")
        st.metric("Recall", f"{r:.1f}%")
        st.metric("F1 Score", f"{f:.1f}%")

        df = pd.DataFrame({"Month": ["Jan","Feb","Mar","Apr","May","Jun"],
                           "Precision": [p-2,p-1,p,p+1,p+1.5,p+2],
                           "Recall": [r-3,r-2,r-1,r,r+1,r+1.5],
                           "F1": [f-2,f-1.5,f-1,f,f+0.5,f+1]})
        fig = go.Figure()
        fig.add_trace(go.Scatter(x=df.Month, y=df.Precision, mode='lines+markers', name='Precision'))
        fig.add_trace(go.Scatter(x=df.Month, y=df.Recall, mode='lines+markers', name='Recall'))
        fig.add_trace(go.Scatter(x=df.Month, y=df.F1, mode='lines+markers', name='F1 Score'))
        fig.update_layout(plot_bgcolor='#0b1220', paper_bgcolor='#0b1220', font_color='white')
        st.plotly_chart(fig, use_container_width=True)
    else:
        st.warning("No backend stats detected, showing demo values")

elif section == "Transaction Generation":
    st.title("Transaction Generation")
    with st.form("tx_form"):
        amount = st.number_input("Amount", value=1000.0)
        is_night = st.checkbox("Night")
        location_risk = st.selectbox("Location risk", [0,1])
        merchant_risk = st.selectbox("Merchant risk", [0,1])
        velocity_flag = st.selectbox("Velocity flag", [0,1])
        if st.form_submit_button("Generate"):
            payload={
                "amount":amount,
                "is_night":1 if is_night else 0,
                "location_risk":location_risk,
                "merchant_risk":merchant_risk,
                "velocity_flag":velocity_flag
            }
            if backend:
                resp = requests.post(f"{API_ROOT}/mlFraudCheck", json=payload)
                if resp.ok:
                    result = resp.json()
                    st.success(f"Score: {result['fraudScore']}, Fraud: {result['isFraud']}")
                    st.json(result)
                else:
                    st.error("Model call failed")
            else:
                st.warning("Backend offline, simulation responses not supported yet")

elif section == "Transactions":
    st.title("Transaction History")
    if backend and transactions_df is not None:
        st.dataframe(transactions_df)
    else:
        st.error("No transactions available")

else:
    st.write("Section coming soon")
