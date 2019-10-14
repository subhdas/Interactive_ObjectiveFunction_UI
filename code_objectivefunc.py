from hyperOpt_optimize import preProcessData, makePredictions
import pandas as pd
from sklearn.model_selection import train_test_split
import numpy as np
from hyperopt import hp, tpe, STATUS_OK, Trials
from hyperopt.fmin import fmin
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score


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

def find_goodModel(train, test, targetTrain, targetTest):
    train,idCol = preProcessData(train, userFeatures  = [])
    test, idCol = preProcessData(test, userFeatures=[])

    def objective(space):
        clf = RandomForestClassifier(max_depth=space['max_depth'],
                                     min_samples_split=space['min_samples_split'],
                                     min_samples_leaf=space['min_samples_leaf'],
                                     bootstrap=space['bootstrap'],
                                     criterion=space['criterion']
                                     )
        clf.fit(train, targetTrain)
        cross_mean_score = cross_val_score( estimator=clf, X=train, y=targetTrain, scoring='accuracy', cv=3, n_jobs=-1).mean()

        result = {'loss': -1*cross_mean_score, 'status': STATUS_OK}
        print " result is ", result
        return result
        # end of objective function

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

    trials = Trials()
    best = fmin(fn=objective,
                space=space,
                algo=tpe.suggest,
                max_evals=3,  # change
                trials=trials)

    print " trials are ", trials
    mod_results = {}

    ind = 0
    for trial in trials.trials:
        res = trial['result']
        par_space = trial['misc']['vals']
        print " we get trial as : ", trial
        print " we get trial as : ", res
        print " we get trial as : ", par_space
        print " ######################## "

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

    print " mod results obj ", mod_results
    print " mod results obj ", allmodel_pred_out

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
    find_goodModel(train, test, targetTrain, targetTest)
