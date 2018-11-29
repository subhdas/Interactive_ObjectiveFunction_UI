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
from sklearn.metrics import classification_report, f1_score, accuracy_score, confusion_matrix
import json

# for json dumps to work
class NumpyEncoder(json.JSONEncoder):
    """ Special json encoder for numpy types """
    def default(self, obj):
        if isinstance(obj, (np.int_, np.intc, np.intp, np.int8,
            np.int16, np.int32, np.int64, np.uint8,
            np.uint16, np.uint32, np.uint64)):
            return int(obj)
        elif isinstance(obj, (np.float_, np.float16, np.float32, 
            np.float64)):
            return float(obj)
        elif isinstance(obj,(np.ndarray,)): #### This is the fix
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)

def preProcessData(data):
    data = data.apply(pd.to_numeric, errors='ignore')
    data = data._get_numeric_data()
    return data


def wrap_findGoodModel(train,test, targetTrain, targetTest):
    done = False
    while( not done):
        try:
            obj = find_goodModel(train,test,targetTrain,targetTest)
            return obj
        except Exception as e:
            print " errored in finding good model ", e
    return obj


def find_goodModel(train,test,targetTrain,targetTest):
    train = preProcessData(train)
    test = preProcessData(test)
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
        clf.fit(train, targetTrain)
        cross_mean_score = cross_val_score( estimator=clf, X=train, y=targetTrain, scoring='precision_macro', cv=3, n_jobs=-1).mean()

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
    'predictions' : makePredictions(best,train, test,targetTrain, targetTest),
    'params' : best,
    'STATUS' : 'OK'
    }
    return obj


def makePredictions(space, train, test, targetTrain, targetTest):
    clf = RandomForestClassifier(max_depth=space['max_depth'],
                                min_samples_split = space['min_samples_split'],
                                min_samples_leaf = space['min_samples_leaf'],
                                bootstrap = space['bootstrap'],
                                criterion = space['criterion']
                                )
    clf.fit(train, targetTrain)
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


    trainConfMatrix = confusion_matrix(targetTrain, predTrain)
    testConfMatrix = confusion_matrix(targetTest, predTest)
    # train_pd = pd.DataFrame(trainConfMatrix).to_json('data.json', orient='split')
    print " found train conf matrix ", trainConfMatrix

    return {
    'trainPred' : predTrainDict,
    'testPred' : predTestDict,
    'trainConfMatrix' : json.dumps(np.array(trainConfMatrix), cls=NumpyEncoder),
    'testConfMatrix' : json.dumps(np.array(testConfMatrix), cls=NumpyEncoder),
    }


if __name__ == "__main__":

	import warnings
	warnings.filterwarnings("ignore")
