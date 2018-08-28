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








def find_goodModel(train,target):
    # domain space
    # space = hp.uniform('x', -5, 6)
    # # Create the algorithm
    # tpe_algo = tpe.suggest
    # # Create a trials object
    # tpe_trials = Trials()
    # # Run 2000 evals with the tpe algorithm
    # tpe_best = fmin(fn=objective, space=space,
    #                 algo=tpe_algo, trials=tpe_trials,
    #                 max_evals=2000)

    def objective(space):
        # """Objective function to minimize"""
        # # Create the polynomial object
        # f = np.poly1d([1, -2, -28, 28, 12, -26, 100])
        # # Return the value of the polynomial
        # return f(x) * 0.05
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

        # eval_set  = [( train, train_y), ( test, test_y)]
        clf.fit(train, target)
        # test = train
        # pred = clf.predict(test)
        cross_mean_score = cross_val_score(
            estimator=clf, X=train, y=target, scoring='precision_macro', cv=3, n_jobs=-1).mean()

        result = {'loss':cross_mean_score, 'status': STATUS_OK }
        print " result is ", result
        #    print "SCORE:", mae
        return result


    col_train = train.columns

    space ={
        'max_depth': hp.choice('max_depth', np.arange(10, 30, dtype=int)),
        'min_samples_split': hp.choice('min_samples_split', np.arange(3, 15, dtype=int)),
        'min_samples_leaf': hp.choice('min_samples_leaf', np.arange(3, 15, dtype=int)),
        'bootstrap':hp.choice('bootstrap',[True,False]),
        'criterion':hp.choice('criterion',["gini", "entropy"])
    }

    trials = Trials()
    best = fmin(fn=objective,
                space=space,
                algo=tpe.suggest,
                max_evals=3, # change
                trials=trials)

    print(best)
    return {a:0, b:1}

if __name__ == "__main__":

	import warnings
	warnings.filterwarnings("ignore")
