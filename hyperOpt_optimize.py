import os
import pandas as pd
import random
import numpy as np
import json
import math
from hyperopt import hp, tpe

import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import RandomForestClassifier
import xgboost as xgb
from hyperopt import hp, tpe, STATUS_OK, Trials
from hyperopt.fmin import fmin



def preProcessData(data):
    data = data.apply(pd.to_numeric, errors='ignore')
    data = data._get_numeric_data()
    return data



def find_goodModel(train,target):
    train = preProcessData(train)
    def objective(space):
        # clf = xgb.XGBRegressor(n_estimators = space['n_estimators'],
        #                        max_depth = space['max_depth'],
        #                        min_child_weight = space['min_child_weight'],
        #                        subsample = space['subsample'],
        #                        learning_rate = space['learning_rate'],
        #                        gamma = space['gamma'],
        #                        colsample_bytree = space['colsample_bytree'],
        #                        objective='reg:linear'
        #                        )

        clf = RandomForestClassifier(max_depth=space['max_depth'],
                                    min_samples_split = space['min_samples_split'],
                                    min_samples_leaf = space['min_samples_leaf'],
                                    bootstrap = space['bootstrap'],
                                    criterion = space['criterion']
                                    )

        # score =  A*SameLabel + B*Features + 
        clf.fit(train, target)
        cross_mean_score = cross_val_score(
            estimator=clf, X=train, y=target, scoring='precision_macro', cv=3, n_jobs=-1).mean()

        result = {'loss':cross_mean_score, 'status': STATUS_OK }
        print " result is ", result
        return result

    col_train = train.columns
    bootStrapArr = [True,False]
    criterionArr = ["gini", "entropy"]
    space ={
        'max_depth': hp.choice('max_depth', np.arange(10, 30, dtype=int)),
        'min_samples_split': hp.choice('min_samples_split', np.arange(8, 15, dtype=int)),
        'min_samples_leaf': hp.choice('min_samples_leaf', np.arange(5, 15, dtype=int)),
        'bootstrap':hp.choice('bootstrap', bootStrapArr),
        'criterion':hp.choice('criterion', criterionArr)
    }

    trials = Trials()
    best = fmin(fn=objective,
                space=space,
                algo=tpe.suggest,
                max_evals=3, # change
                trials=trials)



    print(best)
    best['bootstrap'] = bootStrapArr[best['bootstrap']]
    best['criterion'] = criterionArr[best['criterion']]

    obj = {
    'predictions' : makePredictions(best,train, train,target),
    'params' : best,
    'STATUS' : 'OK'
    }
    return obj


def makePredictions(space, train, test, target):
    clf = RandomForestClassifier(max_depth=space['max_depth'],
                                min_samples_split = space['min_samples_split'],
                                min_samples_leaf = space['min_samples_leaf'],
                                bootstrap = space['bootstrap'],
                                criterion = space['criterion']
                                )
    clf.fit(train, target)
    predTrain = clf.predict(train)
    predTest = clf.predict(test)

    print "train predictions ", predTrain
    print "train predictions ", predTest
    predTrain = [str(x) for x in predTrain]
    predTest = [str(x) for x in predTest]

    predTrainDict = {}
    predTestDict = {}
    for i in range(len(predTrain)):
        id = train['id'].values[i]
        predTrainDict[str(id)] = str(predTrain[i])
    for i in range(len(predTest)):
        id = test['id'].values[i]
        predTestDict[str(id)] = str(predTest[i])


    return {
    'trainPred' : predTrainDict,
    'testPred' : predTestDict
    }


if __name__ == "__main__":

	import warnings
	warnings.filterwarnings("ignore")
