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


def wrap_findGoodModel(train,target):
    done = False
    while( not done):
        try:
            obj = find_goodModel(train,target)
            return obj
        except Exception as e:
            print " errored in finding good model ", e
    return obj


def find_goodModel(train,target):
    train = preProcessData(train)
    def objective(space):
        # make the model using SKLearns classifiers
        clf = RandomForestClassifier(max_depth=space['max_depth'],
                                    min_samples_split = space['min_samples_split'],
                                    min_samples_leaf = space['min_samples_leaf'],
                                    bootstrap = space['bootstrap'],
                                    criterion = space['criterion']
                                    )

        userDefinedWeights = {
            'sameLabelWt' : 0.5,
            'similarLabelIds' : 0.3,
            'trainingAccuracy' : 0.2
        }
        # get the prediction    
        clf.fit(train, target)
        targetPredicted = clf.predict(train)

        trainNew = train.copy()
        trainNew['target_variable'] = targetPredicted

        # weighted by the user
         userDefinedWeights = {
             'sameLabelWt': 0.5,
             'similarLabelIds': 0.3,
             'trainingAccuracy': 0.2
         }

        # 1 - trainingAccuracy
        cross_mean_score = cross_val_score( estimator=clf, X=train, y=target, scoring='precision_macro', cv=3, n_jobs=-1).mean()

        # 2 - compute score for same label
        sameLabelObj = {
            'sameLabelIds': [10, 25, 45],
            'label': 0
        }
        label = sameLabelObj['label']
        penaltySameLabel = 0
        sameLabelIdsArr = sameLabelObj['sameLabelIds']
        for i in range(len(sameLabelIdsArr)):
            if(label == None):
                label = trainNew.ix[sameLabelIdsArr[i], 'target_variable']

            if(label is not trainNew.ix[sameLabelIdsArr[i], 'target_variable']):
                penaltySameLabel += 1

        # 3 - compute score for similar data items
        similarLabelId = {
            'similarLabelIds': [5, 22, 28],
            'differentLabelIds': [10, 12, 18]
        }
        label = None
        penaltySimilarLabel = 0
        similarLabelIdArr = similarLabelId['similarLabelIds']
        for i in range(len(similarLabelIdArr)):
            if(label == None):
                label = trainNew.ix[similarLabelIdArr[i], 'target_variable']

            if(label is not trainNew.ix[similarLabelIdArr[i], 'target_variable']):
                penaltySimilarLabel += 1


        score = cross_mean_score *userDefinedWeights['trainingAccuracyWt'] 
                    + penaltySameLabel * userDefinedWeights['sameLabelWt']
                        + penaltySimilarLabel * userDefinedWeights['trainingAccuracy']


        result = {'loss': score, 'status': STATUS_OK}
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
