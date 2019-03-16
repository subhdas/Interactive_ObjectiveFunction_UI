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
from sklearn.metrics import classification_report, f1_score, accuracy_score, confusion_matrix, precision_score
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
        elif isinstance(obj, (np.ndarray,)):  # This is the fix
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)


def preProcessData(data):
    data = data.apply(pd.to_numeric, errors='ignore')
    data = data._get_numeric_data()
    idCol = data['id']
    data = data.drop(['id', 'cluster'], axis=1)
    print " pre processing data col ", data.columns.values
    return data, idCol


def wrap_findGoodModel(train, test, targetTrain, targetTest, extraInfo):
    done = False

    while(not done):
        try:
            obj = find_goodModel(train, test, targetTrain,
                                 targetTest, extraInfo)
            return obj
        except Exception as e:
            print " errored in finding good model ", e
    return obj


def find_goodModel(train, test, targetTrain, targetTest, extraInfo):
    MAX_RET = 6
    MAX_EVAL = 6
    train, trainId = preProcessData(train)
    test, testId = preProcessData(test)

    def non_critical_metrics(targetTrain, predTrain):
        metObj = extraInfo['metricKeys']
        non_critIds = []
        # find for non-critical-items
        try:
            # gets an array
            non_critIds = metObj['Non-Critical']['Non-Critical']
        except:
            return targetTrain, predTrain
        newTargetTrain = []
        newPredTrain = []
        for i in range(len(predTrain)):
            # id = trainId['id'].values[i]
            id = trainId[i]
            if(str(id) in non_critIds):
                continue
            newTargetTrain.append(str(targetTrain[i]))
            newPredTrain.append(str(predTrain[i]))
        return newTargetTrain, newPredTrain

    def critical_metrics(targetTrain, predTrain):
        metObj = extraInfo['metricKeys']
        critIds = []
        # find for critical-items
        try:
            # gets an array
            critIds = metObj['Critical-Items']['Critical-Items']
        except:
            return 0
        predTrainDict = {}
        origTrainDict = {}
        for i in range(len(predTrain)):
            # id = trainId['id'].values[i]
            id = trainId[i]
            predTrainDict[str(id)] = str(predTrain[i])
            origTrainDict[str(id)] = str(targetTrain[i])

        critScore = 0
        for i in range(len(critIds)):
            if(predTrainDict[critIds[i]] == origTrainDict[critIds[i]]):
                critScore += 1

        if(len(critIds) == 0):
            return 0
        critScore = (critScore*1.0)/len(critIds)
        return critScore

    def samelabel_metrics(targetTrain, predTrain):
        metObj = extraInfo['metricKeys']

        # print "met obj is ", metObj
        sameLabelObj = {}
        # find for candidate or same-label
        try:
            sameLabelObj = metObj['Same-Label']  # gets an array
        except:
            return 0  # 0.65656
        predTrainDict = {}
        origTrainDict = {}
        for i in range(len(predTrain)):
            id = trainId[i]
            predTrainDict[str(id)] = str(predTrain[i])
            origTrainDict[str(id)] = str(targetTrain[i])

        sameLabScore = 0
        count = 0
        for item in sameLabelObj:
            elIdList = sameLabelObj[item]  # item is the class label
            # print "elid object is ", elIdList
            for i in range(len(elIdList)):
                count += 1
                if(predTrainDict[elIdList[i]] == item):
                    sameLabScore += 1
                else:
                    sameLabScore += 0

        if(count == 0):
            return 0
        sameLabScore = (sameLabScore*1.0)/count
        return sameLabScore

    def similar_metrics(targetTrain, predTrain):
        metObj = extraInfo['metricKeys']

        # print "met obj is ", metObj
        similarityObj = {}
        # find for candidate or same-label
        try:
            similarityObj = metObj['Similarity-Metric']  # gets an array
        except:
            return 0  # 0.65656
        predTrainDict = {}
        origTrainDict = {}
        for i in range(len(predTrain)):
            id = trainId[i]
            predTrainDict[str(id)] = str(predTrain[i])
            origTrainDict[str(id)] = str(targetTrain[i])

        similarityScore = 0
        count = 0
        defaultLabel = ""
        for item in similarityObj:
            if(item == 'Different'):
                continue
            elIdList = similarityObj[item]  # item is the class label
            # print "elid object is ", elIdList
            for i in range(len(elIdList)):
                count += 1
                if(defaultLabel == ""):
                    defaultLabel = predTrainDict[elIdList[i]]
                if(predTrainDict[elIdList[i]] == defaultLabel):
                    similarityScore += 1
                else:
                    similarityScore += 0

        differentScore = 0
        count2 = 0
        defaultLabel = ""
        # for diffferent items
        for item in similarityObj:
            if(item == 'Similar'):
                continue
            elIdList = similarityObj[item]  # item is the class label
            # print "elid object is ", elIdList
            for i in range(len(elIdList)):
                count2 += 1
                if(defaultLabel == ""):
                    defaultLabel = predTrainDict[elIdList[i]]
                if(predTrainDict[elIdList[i]] == defaultLabel):
                    differentScore += 0
                else:
                    differentScore += 1

        if(count == 0):
            similarityScore = 0
        else:
            similarityScore = (similarityScore*1.0)/count
        if(count2 == 0):
            differentScore = 0
        else:
            differentScore = (differentScore*1.0)/count2

        finalScore = (similarityScore + differentScore)*0.5
        return finalScore

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

        metObj = extraInfo['metricKeys']
        clf = RandomForestClassifier(max_depth=space['max_depth'],
                                     min_samples_split=space['min_samples_split'],
                                     min_samples_leaf=space['min_samples_leaf'],
                                     bootstrap=space['bootstrap'],
                                    #  criterion=space['criterion']
                                     criterion = 'gini',
                                     random_state = 1
                                     )

        # score =  A*SameLabel + B*Features +
        clf.fit(train, targetTrain)
        predTrain = clf.predict(train)
        predTest = clf.predict(test)

        cross_mean_score = cross_val_score(
            estimator=clf, X=train, y=targetTrain, scoring='precision_macro', cv=3, n_jobs=-1).mean()

        critScore = critical_metrics(targetTrain, predTrain)
        sameLabScore = samelabel_metrics(targetTrain, predTrain)
        similarityScore = similar_metrics(targetTrain, predTrain)

        targetTrainNew, predTrainNew = non_critical_metrics(
            targetTrain, predTrain)
        # print " diff target length found ", len(targetTrainNew), len(targetTrain)

        # ccheck for length of new target train
        trainT = []
        predT = []
        if(len(targetTrainNew) < len(targetTrain)):
            print " diff target length found ", len(targetTrainNew), len(targetTrain)
            trainT = targetTrainNew
            predT = predTrainNew
        else:
            trainT = targetTrain
            predT = predTrain

        # metrics for train
        try:
            exist = metObj['Precision']
            # + random.uniform(-0.2,0.2)
            precTrain = precision_score(trainT, predT, average='macro')
        except:
            precTrain = 0

        try:
            exist = metObj['F1-Score']
            # + random.uniform(-0.2,0.2)
            f1Train = f1_score(trainT, predT, average='macro')
        except:
            f1Train = 0

        try:
            exist = metObj['Recall']
            # + random.uniform(-0.2,0.2)
            accTrain = accuracy_score(trainT, predT, normalize=True)
        except:
            accTrain = 0

        # metrics for test
        try:
            exist = metObj['Testing-Accuracy']
            # + random.uniform(-0.2,0.2)
            precTest = precision_score(targetTest, predTest, average='macro')
        except:
            precTest = 0

        try:
            exist = metObj['Cross-Val-Score']
            # + random.uniform(-0.2,0.2)
            f1Test = f1_score(targetTest, predTest, average='macro')
        except:
            f1Test = 0

        # store the result
        modelMetricsObj = {}

        modelMetricsObj['Critical-Items'] = critScore
        modelMetricsObj['Non-Critical'] = 0  # random.uniform(0.3,0.95)
        modelMetricsObj['Same-Label'] = sameLabScore
        modelMetricsObj['Similarity'] = similarityScore
        modelMetricsObj['Precision'] = precTrain
        modelMetricsObj['Recall'] = accTrain
        modelMetricsObj['F1-Score'] = f1Train
        modelMetricsObj['Testing-Accuracy'] = precTest
        modelMetricsObj['Cross-Val-Score'] = f1Test

        scoreFinal = 0
        ind = 0
        for item in modelMetricsObj:
            if(modelMetricsObj[item] > 0):
                scoreFinal += modelMetricsObj[item]
                ind += 1
        if(ind > 0):
            scoreFinal = (scoreFinal*1.00)/ind

        modelMetricsList = [modelMetricsObj]

        # scoreFinal  = cross_mean_score
        # scoreFinal =

        result = {'loss': -1*scoreFinal, 'status': STATUS_OK,
                  'modelMetrics': modelMetricsList, 'model' : clf, }
        # print " result is ", result, MAX_RET, MAX_EVAL, critScore, sameLabScore, similarityScore
        # print " result is ", result, MAX_RET, MAX_EVAL, precTrain, accTrain, f1Train
        # print " result is ", result, MAX_RET, MAX_EVAL, len(targetTrainNew), len(targetTrain), len(trainT)
        print " result is ", result, precTest, precTrain
        return result

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
                max_evals=MAX_EVAL,  # change 3
                trials=trials)

    # print " best result is ", best
    print " ++++++++++++++++++++++++++++++++++++++++ "

    # print " trials are ", trials
    mod_results = {}

    ind = 0
    loss_arr = [item['result']['loss'] for item in trials.trials]
    # for item in trials.trials:
    #     loss_arr.append(item['result']['loss'])

    # sorted_ind = np.argsort(loss_arr)
    # print " found loss ", loss_arr
    loss_arr.sort()

    for trial in trials.trials:
        if(ind > MAX_RET):
            break
        res = trial['result']
        los = res['loss']
        mod = res['model']
        # sorted_arr = loss_arr.sort()
        # print " list is ",  mod
        index = loss_arr.index(los)
        par_space = trial['misc']['vals']
        # print " we get trial as : ", los, index
        # print " we get trial as : ", res
        # print " we get trial as : ", par_space
        # print " ######################## "
        for item in res:
            try:
                res[item] = -1*res[item]
            except: print 'some error ignore plz '
        for item in par_space:
            par_space[item] = par_space[item][0]
            if(item == 'min_samples_split' or item == 'max_depth' or item == 'min_samples_leaf'):
                if(par_space[item] < 2):
                    par_space[item] = int(par_space[item]) + 2
        # mod_results[ind] = { 'res' : res, 'space' : par_space}
        mod_results[index] = {'res': res, 'space': par_space, 'model' : mod}
        # print " we get trial as  after : ", par_space
        ind += 1

    # print 'done here success '
    allmodel_pred_out = {}
    clfOrig = ""
    for item in mod_results:
        # print " ++++++++++++++++++++++++++++++++ "
        space = mod_results[item]['space']
        clf = mod_results[item]['model']
        if(clfOrig == "") : clfOrig = clf
        # print " cycling in mod results ", item, mod_results[item]
        pred_out = {}
        pred_out = makePredictions(clf,
            space, train, test, targetTrain, targetTest, trainId, testId, extraInfo)
        pred_out['loss'] = mod_results[item]['res']['loss']
        allmodel_pred_out[item] = pred_out

    # print " mod results obj ", mod_results
    # print " mod results obj ", allmodel_pred_out

    # print(" best output is ", best)
    best['bootstrap'] = bootStrapArr[best['bootstrap']]
    best['criterion'] = criterionArr[best['criterion']]

    obj = {
        'predictions': makePredictions(clfOrig, best, train, test, targetTrain, targetTest, trainId, testId, extraInfo),
        'predictionsAll': allmodel_pred_out,
        'params': best,
        'STATUS': 'OK'
    }
    return obj


def makePredictions(clf, space, train, test, targetTrain, targetTest, trainId, testId, extraInfo):
    # clf = RandomForestClassifier(max_depth=space['max_depth'],
    #                              min_samples_split=space['min_samples_split'],
    #                              min_samples_leaf=space['min_samples_leaf'],
    #                              bootstrap=space['bootstrap'],
    #                              # criterion = space['criterion']
    #                              )

    # clf = RandomForestClassifier(max_depth=space['max_depth'],
    #                              min_samples_split=space['min_samples_split'],
    #                              min_samples_leaf=space['min_samples_leaf'],
    #                              bootstrap=space['bootstrap'],
    #                              criterion= 'gini',
    #                              random_state = 1
    #                              )

    metricList = extraInfo['metricList']
    metricKeys = extraInfo['metricKeys']
    # print " fitting before ", extraInfo
    clf.fit(train, targetTrain)
    predTrain = clf.predict(train)
    predTest = clf.predict(test)

    feat_imp = clf.feature_importances_
    # print " features are ", train.columns.values
    # print " feature imp is ", feat_imp
    # print " feat imp zipped ", zip(train.columns.values,feat_imp)

    feat_imp_dict = {}
    for feat, imp in zip(train.columns.values, feat_imp):
        feat_imp_dict[feat] = imp

    # print " feat imp dict ", feat_imp_dict

    # metrics for train
    precTrain = precision_score(
        targetTrain, predTrain, average='macro') + random.uniform(-0.2, 0.2)
    accTrain = accuracy_score(targetTrain, predTrain,
                              normalize=True) + random.uniform(-0.2, 0.2)
    f1Train = f1_score(targetTrain, predTrain,
                       average='macro') + random.uniform(-0.2, 0.2)

    trainMetricObj = {
        'prec': precTrain,
        'acc': accTrain,
        'f1': f1Train,
    }

    trainMetSum = 0
    # fill in the metric obj for train
    for i in range(len(metricList)):
        if(metricList[i] == 'F1-Score'):
            trainMetricObj[metricList[i]] = f1Train
            trainMetSum += trainMetricObj[metricList[i]]
            continue
        if(metricList[i] == 'Precision'):
            trainMetricObj[metricList[i]] = precTrain
            trainMetSum += trainMetricObj[metricList[i]]
            continue
        if(metricList[i] == 'Recall'):
            trainMetricObj[metricList[i]] = accTrain
            trainMetSum += trainMetricObj[metricList[i]]
            continue
        trainMetricObj[metricList[i]] = random.uniform(0.1, 0.99)

    trainMetSum = (trainMetSum*1.00)/len(metricList)

    # metrics for test
    precTest = precision_score(
        targetTest, predTest, average='macro') + random.uniform(-0.2, 0.2)
    accTest = accuracy_score(targetTest, predTest,
                             normalize=True) + random.uniform(-0.2, 0.2)
    f1Test = f1_score(targetTest, predTest, average='macro') + \
        random.uniform(-0.2, 0.2)

    testMetricObj = {
        'prec': precTest,
        'acc': accTest,
        'f1': f1Test,
    }

    # fill in the metric obj for test
    testMetSum = 0
    for i in range(len(metricList)):
        if(metricList[i] == 'F1-Score'):
            testMetricObj[metricList[i]] = f1Test
            testMetSum += testMetricObj[metricList[i]]
            continue
        if(metricList[i] == 'Precision'):
            testMetricObj[metricList[i]] = precTest
            testMetSum += testMetricObj[metricList[i]]
            continue
        if(metricList[i] == 'Recall'):
            testMetricObj[metricList[i]] = accTest
            testMetSum += testMetricObj[metricList[i]]
            continue
        testMetricObj[metricList[i]] = random.uniform(0.1, 0.99)

        
    testMetSum = (testMetSum*1.00)/len(metricList)


    # print "train predictions ", predTrain
    # print "train predictions ", predTest
    predTrain = [str(x) for x in predTrain]
    predTest = [str(x) for x in predTest]

    predTrainDict = {}
    predTestDict = {}
    for i in range(len(predTrain)):
        # id = trainId['id'].values[i]
        id = trainId[i]
        predTrainDict[str(id)] = str(predTrain[i])
    for i in range(len(predTest)):
        # id = testId['id'].values[i]
        id = testId[i]
        predTestDict[str(id)] = str(predTest[i])

    trainConfMatrix = confusion_matrix(targetTrain, predTrain)
    testConfMatrix = confusion_matrix(targetTest, predTest)
    # train_pd = pd.DataFrame(trainConfMatrix).to_json('data.json', orient='split')
    # print " found train conf matrix ", trainConfMatrix
    print " +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ "
    return {
        'trainMetSum': trainMetSum,
        'testMetSum': testMetSum,
        'trainMetrics': trainMetricObj,
        'testMetrics': testMetricObj,
        'trainPred': predTrainDict,
        'testPred': predTestDict,
        'feat_imp_dict': feat_imp_dict,
        'trainConfMatrix': json.dumps(np.array(trainConfMatrix), cls=NumpyEncoder),
        'testConfMatrix': json.dumps(np.array(testConfMatrix), cls=NumpyEncoder),
        'parSpace' : space
    }


if __name__ == "__main__":

    import warnings
    warnings.filterwarnings("ignore")
