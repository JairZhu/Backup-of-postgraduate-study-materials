import numpy as np
import pandas as pd
from scipy import stats
import warnings

warnings.filterwarnings("ignore")

trainData = pd.read_csv("train.csv")
testData = pd.read_csv("test.csv")
# 将训练集和测试集整合
data = pd.concat([trainData, testData], axis=0).reset_index(drop=True)
# male: 0, female: 1
data['Sex'].replace(['male', 'female'], [0, 1], inplace=True)
# S: 0, C: 1, Q: 2
data['Embarked'].replace(['S', 'C', 'Q'], [0, 1, 2], inplace=True)

# print(data[data['Fare'].isnull()])
# Pclass: 3, Embarked: 0, Sex: 0
# 填补Fare为NaN的数据
data['Fare'] = data['Fare'].fillna(
    np.mean(data[((data['Pclass'] == 3) & (data['Embarked'] == 0) & (data['Sex'] == 0))]['Fare']))
# print(data[data['Fare'].isnull()])
# Empty DataFrame

# data['FareLimit'] = pd.qcut(data['Fare'], 4)
# print(data.groupby(['FareLimit'])['Survived'].mean())
# 使用FareLimit替代Fare
data['FareLimit'] = 0
data.loc[data['Fare'] <= 8.662, 'FareLimit'] = 0
data.loc[(data['Fare'] > 8.662) & (data['Fare'] <= 14.454), 'FareLimit'] = 1
data.loc[(data['Fare'] > 14.454) & (data['Fare'] <= 53.1), 'FareLimit'] = 2
data.loc[data['Fare'] > 53.1, 'FareLimit'] = 3

# print(data[data['Embarked'].isnull()])
# Pclass: 1, Sex: 1
# 填补Embarked为NaN的数据
data['Embarked'] = data['Embarked'].fillna(
    stats.mode(data[((data['Pclass'] == 1) & (data['Sex'] == 1))]['Embarked'])[0][0])
# print(data[data['Embarked'].isnull()])
# Empty DataFrame

# 添加新特征：家人Family
data['Family'] = data['SibSp'] + data['Parch']
data['Family'].replace([0, 1, 2, 3, 4, 5, 6, 7, 10], [0, 1, 1, 1, 0, 2, 0, 2, 2], inplace=True)

# 添加新特征：单身Alone
data["Alone"] = [1 if i == 0 else 0 for i in data["Family"]]

# 填补Age为NaN的数据
dataAgeNanIndex = data[data['Age'].isnull()].index
for i in dataAgeNanIndex:
    # 取Pclass、Family相同的数据的平均值
    meanAge = data['Age'][
        (data['Pclass'] == data.iloc[i]['Pclass']) & (data['Family'] == data.iloc[i]['Family'])].mean()
    data['Age'].iloc[i] = meanAge

# data['AgeLimit'] = pd.cut(data['Age'], 5)
# print(data.groupby(['AgeLimit'])['Survived'].mean())
# 使用AgeLimit替代Age
data['AgeLimit'] = 0
data.loc[data['Age'] <= 16, 'AgeLimit'] = 0
data.loc[(data['Age'] > 16) & (data['Age'] <= 32), 'AgeLimit'] = 1
data.loc[(data['Age'] > 32) & (data['Age'] <= 48), 'AgeLimit'] = 2
data.loc[(data['Age'] > 48) & (data['Age'] <= 60), 'AgeLimit'] = 3
data.loc[data['Age'] > 60, 'AgeLimit'] = 4

# 删除无用列
data.drop(labels=["Age", "Fare", "Ticket", "Cabin", "Name", "PassengerId"], axis=1, inplace=True)

# one-hot编码
data = pd.get_dummies(data, columns=['Pclass'])
data = pd.get_dummies(data, columns=['Sex'])
data = pd.get_dummies(data, columns=['Embarked'])
data = pd.get_dummies(data, columns=['Family'])
data = pd.get_dummies(data, columns=['AgeLimit'])
data = pd.get_dummies(data, columns=['FareLimit'])

trainX = data[:len(trainData)].drop(labels='Survived', axis=1)
trainY = data[:len(trainData)]['Survived']
testY = data[len(trainData):]['Survived']
testX = data[len(trainData):].drop(labels='Survived', axis=1)

trainX = trainX.values
trainY = trainY.values
testX = testX.values
testY = testY.values.tolist()
n_samples = len(trainX)
eta = 0.01
iter = 10000

trainX = np.c_[np.ones(n_samples), trainX]
n_features = trainX.shape[-1]
theta = np.ones(n_features)
loss_ = [0]
for i in range(iter):
    errors = trainX.dot(theta) - trainY
    loss = 1 / (2 * n_samples) * errors.dot(errors)
    delta_loss = loss - loss_[-1]
    loss_.append(loss)
    print("loss:", np.abs(loss))
    gradient = 1 / n_samples * trainX.T.dot(errors)
    theta -= eta * gradient

testX = np.c_[np.ones(len(testX)), testX]
predict = [1 if i >= 0.5 else 0 for i in testX.dot(theta).tolist()]
count = 0.0
for i in range(len(predict)):
    if testY[i] != predict[i]:
        count += 1.0
print("测试集正确率:", 1 - count / len(predict))