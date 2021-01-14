import csv
import math
import numpy as np
import pandas as pd
from scipy import stats
import warnings

warnings.filterwarnings("ignore")

def read_data_set():
    '''处理数据，提取特征'''
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
    data.drop(labels=["Age", "Fare", "Ticket", "Cabin", "Name", "PassengerId", 'Family'], axis=1, inplace=True)

    data = data[['Pclass', 'Sex', 'SibSp', 'Parch', 'Embarked', 'FareLimit', 'AgeLimit', 'Survived']]

    trainY = data[:len(trainData)]['Survived'].values.tolist()
    trainX = data[:len(trainData)].drop(labels='Survived', axis=1)
    testY = data[len(trainData):]['Survived'].values.tolist()
    testX = data[len(trainData):].drop(labels='Survived', axis=1)

    return trainX, trainY, testX, testY

class NaiveBayes:
    def __init__(self, x, y):
        self.xlabel = ['Pclass', 'Sex', 'SibSp', 'Parch', 'Embarked', 'FareLimit', 'AgeLimit']
        ycounts = [0, 0]
        self.pos_dict = {
            'Pclass': {},
            'Sex': {},
            'SibSp': {},
            'Parch': {},
            'Embarked': {},
            'FareLimit': {},
            'AgeLimit': {}
        }
        self.neg_dict = {
            'Pclass': {},
            'Sex': {},
            'SibSp': {},
            'Parch': {},
            'Embarked': {},
            'FareLimit': {},
            'AgeLimit': {}
        }
        for i in range(len(y)):
            ycounts[y[i]] += 1
            for index in self.xlabel:
                item = x.iloc[i][index]
                if y[i]:
                    self.pos_dict[index][item] = self.pos_dict[index].get(item, 0) + 1
                else:
                    self.neg_dict[index][item] = self.neg_dict[index].get(item, 0) + 1
        for index in self.xlabel:
            for key in list(self.pos_dict[index].keys()):
                self.pos_dict[index][key] = (self.pos_dict[index].get(key, 0) + 1) / (ycounts[1] + len(self.pos_dict[index].keys()))
            for key in list(self.neg_dict[index].keys()):
                self.neg_dict[index][index] = (self.pos_dict[index].get(key, 0) + 1) / (ycounts[0] + len(self.neg_dict[index].keys()))
        self.pos_prob = ycounts[1] / len(y)
        self.neg_prob = ycounts[0] / len(y)

    def classify(self, testX):
        result = []
        for i in range(len(testX)):
            positive = math.log(self.pos_prob)
            negative = math.log(self.neg_prob)
            for index in self.xlabel:
                item = testX.iloc[i][index]
                positive += math.log(self.pos_dict[index].get(item, 0.000000001))
                negative += math.log(self.neg_dict[index].get(item, 0.000000001))
            result.append(1 if positive > negative else 0)
        return result

def validation(testY, result):
    count = 0
    for i in range(len(result)):
        if int(result[i]) == int(testY[i]):
            count += 1
    print('准确率:', count / len(result))

if __name__ == "__main__":
    trainX, trainY, testX, testY = read_data_set()
    navieBayes = NaiveBayes(trainX, trainY)
    result = navieBayes.classify(testX)
    validation(testY, result)