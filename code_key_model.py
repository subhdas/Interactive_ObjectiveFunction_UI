from sklearn.metrics import classification_report, f1_score, accuracy_score, confusion_matrix, precision_score, recall_score
from sklearn.model_selection import train_test_split, cross_val_score


def critical_metrics_key(origTrainDict,predTrainDict):
    trainId = origTrainDict.keys()
    ind = [12, 23, 5]
    critIds = [trainId[ind[0]], trainId[ind[1]], trainId[ind[2]]]
    critScore = 0
    for i in range(len(critIds)):
        if(predTrainDict[(critIds[i])] == origTrainDict[(critIds[i])]): critScore += 1

    if(len(critIds) == 0):  return 0
    critScore = (critScore*1.0)/len(critIds)
    print ' getting crit score as ', critScore, critIds
    return critScore


# def list_toTuple(idList):
#         n = len(idList)
#         if(n % 2 is not 0):
#             idList = idList[0:n-1]
#         newTupList = []
#         for i in range(0, len(idList)-1, 2):
#             newTupList.append((idList[i], idList[i+1]))
#         return newTupList

def similar_diff_metrics_key(origTrainDict, predTrainDict):
    similarityObj = {'Similarity' : 1, 'Different' : 1}
    similarityScore, count = 0,0
    defaultLabel = ""

    trainId = origTrainDict.keys()
    ind = [13, 34, 12]
    similarityObj={}
    similarityObj['label_name'] = [(trainId[ind[0]]),(trainId[ind[1]]),(trainId[ind[2]])] # this data ids should be in same label, given by the label name

    for item in similarityObj:
        elIdList = similarityObj[item]  # item is the class label
        print "in similar object is ", elIdList
        for i in range(len(elIdList)):
            count += 1
            if(defaultLabel == ""):
                defaultLabel = predTrainDict[elIdList[i]]
            if(predTrainDict[elIdList[i]] == defaultLabel):
                similarityScore += 1
            else:
                similarityScore += 0
    # print " def lable and sim score 1 ", defaultLabel, similarityScore, similarityObj

    differentScore, count2 = 0,0
    fac = 0.5
    # defaultLabel = ""
    # differentObj={}
    # differentObj['label_name'] = [12, 24]
    # for item in differentObj:
    #     elIdList = differentObj[item]  # item is the class label
    #     newTupList = list_toTuple(elIdList)
    #     print "in different object is ", elIdList, newTupList
    #     for i in range(len(newTupList)):
    #         count2 += 1
    #         if(predTrainDict[newTupList[i][0]] is not predTrainDict[newTupList[i][1]]):
    #             differentScore += 1
    #         else:
    #             differentScore += 0
    # if(count == 0):
    #     similarityScore = 0
    #     fac = 1
    # else:
    #     similarityScore = (similarityScore*1.0)/count

    # if(count2 == 0):
    #     differentScore = 0
    #     fac = 1
    # else:
    #     differentScore = (differentScore*1.0)/count2
    finalScore = (similarityScore + differentScore)*fac
    print " def lable and sim score 2 ", defaultLabel, similarityScore, differentScore, finalScore, fac
    return finalScore


def cand_metrics_key(origTrainDict, predTrainDict):
    trainId = origTrainDict.keys()
    ind = [23, 6, 10]
    sameLabelObj = {}
    sameLabelObj['0'] = [trainId[ind[0]], trainId[ind[1]], trainId[ind[2]]]
    ind = [12, 54, 15]
    sameLabelObj['1'] = [trainId[ind[0]], trainId[ind[1]], trainId[ind[2]]]
    candScore, count = 0,0
    for item in sameLabelObj:
        elIdList = sameLabelObj[item]  # item is the class label
        for i in range(len(elIdList)):
            count += 1
            if(predTrainDict[elIdList[i]] == int(item)): candScore += 1
    if(count == 0): return 0
    candScore = (candScore*1.0)/count
    print ('cand score retrieved ', candScore)
    return candScore


def precision_metric_key(targetTrain, predTrain):
    precScore = precision_score(targetTrain, predTrain, average='weighted')
    return precScore

def recall_metric_key(targetTrain, predTrain):
    recScore = precision_score(targetTrain, predTrain, average='weighted')
    return recScore

def f1score_metric_key(targetTrain, predTrain):
    f1Score = f1_score(targetTrain, predTrain, average='weighted')
    return f1Score

def acc_metric_key(targetTrain, predTrain):
    accScore = accuracy_score(targetTrain, predTrain, normalize=True)
    return accScore

def crossval_metric_key(clf,train, targetTrain):
    crossScore = cross_val_score(estimator=clf, X=train, y=targetTrain, scoring='f1_weighted', cv=10, n_jobs=-1).mean()
    return crossScore
