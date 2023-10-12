import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import accuracy_score, confusion_matrix, classification_report
from sklearn.preprocessing import LabelEncoder
import sys
import numpy as np
from numpy import loadtxt
from keras.models import Sequential
from keras.layers import Dense
from sklearn.preprocessing import StandardScaler
import pandas as pd


dataset = pd.read_csv("./water_c.csv")
dataset["City_str"] = dataset["City"].astype(str)
dataset["Country_str"] = dataset["Country"].astype(str)

dataset["City_Country"] = (
    dataset["City_str"] + "_" + dataset["Country_str"].str.lstrip()
)

dataset.drop("City", axis=1, inplace=True)
dataset.drop("Country", axis=1, inplace=True)
dataset.drop("City_str", axis=1, inplace=True)
dataset.drop("Country_str", axis=1, inplace=True)


if sys.argv[1] == "encodings":
    le = LabelEncoder()
    dataset["Encoded"] = le.fit_transform(dataset["City_Country"])
    dataset = dataset[["City_Country", "Encoded"]].copy()
    export = dataset.to_json("data.json", orient="records", lines=False)

    print(dataset)
elif sys.argv[1] == "run":
    data_1 = sys.argv[2].split(",")
    data_2 = sys.argv[3]
    data_1 = [int(x) for x in data_1]
    data_1.append(int(data_2))

    le = LabelEncoder()
    dataset["City_Country"] = le.fit_transform(dataset["City_Country"])

    X = dataset.iloc[:, 1:24].values
    Y = dataset.iloc[:, 0].values

    model = Sequential()
    model.add(Dense(64, kernel_initializer="normal", input_dim=23, activation="relu"))
    model.add(Dense(6, kernel_initializer="normal", activation="relu"))
    model.add(Dense(1, kernel_initializer="normal", activation="relu"))

    model.compile(optimizer="adam", metrics=["accuracy"], loss="mean_squared_error")

    model.fit(X, Y, epochs=50, batch_size=100, verbose=0)
    pred = model.predict([data_1], verbose=0)
    print(pred)
