import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib

data=pd.read_csv("banksim.csv")

data=data.head(50000)

data.rename(columns={"fraud":"is_fraud"},inplace=True)

data["is_high_amount"]=data["amount"].apply(lambda x:1 if x>50000 else 0)

data["is_night"]=data["step"].apply(lambda x:1 if (x%24>=22 or x%24<=5) else 0)

np.random.seed(42)

data["location_risk"]=np.random.randint(0,2,len(data))
data["merchant_risk"]=np.random.randint(0,2,len(data))
data["velocity_flag"]=np.random.randint(0,2,len(data))

features=[
"amount",
"is_high_amount",
"is_night",
"location_risk",
"merchant_risk",
"velocity_flag"
]

X=data[features]
y=data["is_fraud"]

X_train,X_test,y_train,y_test=train_test_split(X,y,test_size=0.2)

model=RandomForestClassifier(n_estimators=20)

model.fit(X_train,y_train)

joblib.dump(model,"fraud_model.pkl")

print("fraud_model.pkl created")