from hyperOpt_optimize import preProcessData, makePredictions
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
import numpy as np
from hyperopt import hp, tpe, STATUS_OK, Trials
from hyperopt.fmin import fmin
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
from code_model import *
from code_key_model import *


# def warn(*args, **kwargs):
#         pass
# import warnings
# warnings.filterwarnings("ignore", category=DeprecationWarning)
# from sklearn.exceptions import DataConversionWarning
# warnings.filterwarnings(action='ignore', category=DataConversionWarning)
# with warnings.catch_warnings():
#     warnings.simplefilter("ignore")

train, test, targetTrain, targetTest = None,None,None,None
trainId, testId = None, None


def load_prep_data(path=None):
    if(path is None ): path ='./static/data/scenario/Employee_Compensation_SF_SUB_short1.csv'
    tarCol = 'target_variable'
    df = pd.read_csv(path)
    df['id'] = np.arange(len(df))

    print ('cols loaded ', df.columns.values, df.shape)
    X = df.drop(tarCol, axis=1)
    y = df[tarCol]
    train, test, targetTrain, targetTest = train_test_split(X, y, test_size=0.33, random_state=42)
    return train, test, targetTrain, targetTest


def objective(space):
    clf = RandomForestClassifier(max_depth=space['max_depth'],
                                    min_samples_split=space['min_samples_split'],
                                    min_samples_leaf=space['min_samples_leaf'],
                                    bootstrap=space['bootstrap'],
                                    criterion=space['criterion']
                                    )
                                    
    clf.fit(train, targetTrain)

    predTrain = clf.predict(train)
    predTest = clf.predict(test)

    critScore = critical_metrics_key(targetTrain, predTrain, trainId)
    similarityScore = similar_diff_metrics_key(targetTrain, predTrain, trainId)
    candScore = cand_metrics_key(targetTrain, predTrain, trainId)
    
    crossScore = crossval_metric_key(clf, train, targetTrain)
    precScore = precision_metric_key(targetTrain,predTrain)
    accScore = acc_metric_key(targetTrain,predTrain)
    recallScore = recall_metric_key(targetTrain, predTrain)
    f1Score = f1score_metric_key(targetTrain, predTrain)

    accAll = (crossScore + precScore + accScore + recallScore + f1Score)/5.0

    finalscore = (critScore + similarityScore + candScore + accAll)/4.0

    result = {'loss': -1*finalscore, 'status': STATUS_OK}
    print " result is ", result, critScore, candScore
    return result
    # end of objective function

def find_goodModel():
    global train, test, targetTrain, targetTest
    global trainId, testId
    train,trainId = preProcessData(train, userFeatures  = [])
    test, testId = preProcessData(test, userFeatures=[])

    trainId = trainId.values
    targetTrain = targetTrain.values

    col_train = train.columns
    bootStrapArr = [True, False]
    criterionArr = ["gini", "entropy"]
    space = {
        # 'max_depth': hp.choice('max_depth', np.arange(10, 30, dtype=int)),
        'max_depth': hp.choice('max_depth', range(5, 30)),
        # 'min_samples_split': hp.choice('min_samples_split', np.arange(8, 15, dtype=int)),
        'min_samples_split': hp.choice('min_samples_split', range(8, 15)),
        # 'min_samples_leaf': hp.choice('min_samples_leaf', np.arange(5, 15, dtype=int)),
        'min_samples_leaf': hp.choice('min_samples_leaf', range(5, 15)),
        'bootstrap': hp.choice('bootstrap', bootStrapArr),
        'criterion': hp.choice('criterion', criterionArr)
    }

    # space['dataArr'] = (train, test, targetTrain, targetTest)

    trials = Trials()
    best = fmin(fn=objective,
                space=space,
                algo=tpe.suggest,
                max_evals=3,  # change
                trials=trials)
    mod_results = {}
    ind = 0
    for trial in trials.trials:
        res = trial['result']
        par_space = trial['misc']['vals']
        # print " we get trial as : ", trial
        # print " we get trial as : ", res
        # print " we get trial as : ", par_space
        # print " ######################## "

        for item in res:
            res[item] = -1*res[item]
        for item in par_space:
            par_space[item] = par_space[item][0]
            if(item == 'min_samples_split' or item == 'max_depth' or item == 'min_samples_leaf'):
                if(par_space[item] < 2):
                    par_space[item] = int(par_space[item]) + 2
        mod_results[ind] = {'res': res, 'space': par_space}
        print " we get trial as  after : ", par_space

        ind += 1

    allmodel_pred_out = {}
    for item in mod_results:
        space = mod_results[item]['space']
        pred_out = {}
        # pred_out = makePredictions(space, train, test, targetTrain, targetTest)
        allmodel_pred_out[item] = pred_out

    # print " mod results obj ", mod_results
    # print " mod results obj ", allmodel_pred_out

    print(" best output is ", best)
    best['bootstrap'] = bootStrapArr[best['bootstrap']]
    best['criterion'] = criterionArr[best['criterion']]

    obj = {
        'predictionsAll': allmodel_pred_out,
        'params': best,
        'STATUS': 'OK'
    }
    return obj


if __name__ == "__main__":
    import warnings
    warnings.filterwarnings("ignore")
    
    train, test, targetTrain, targetTest = load_prep_data()
    find_goodModel()
